import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// --- Bank Accounts ---
export const getBankAccounts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("bank_accounts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const linkBankAccount = mutation({
  args: {
    userId: v.id("users"),
    bank_name: v.string(),
    account_name: v.string(),
    routing_number: v.string(),
    account_number: v.string(),
    type: v.union(v.literal("checking"), v.literal("savings")),
  },
  handler: async (ctx, args) => {
    const last4 = args.account_number.slice(-4) || "0000";
    return await ctx.db.insert("bank_accounts", {
      userId: args.userId,
      bank_name: args.bank_name,
      account_name: args.account_name,
      routing_number: args.routing_number,
      account_number: args.account_number,
      last4,
      balance: 10000, // New account starts with 10K!
      is_verified: true, // Auto-verify for demo purposes
      type: args.type,
    });
  },
});

export const deleteBankAccount = mutation({
  args: {
    bankAccountId: v.id("bank_accounts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.bankAccountId);
  },
});

export const transferFunds = mutation({
  args: {
    userId: v.id("users"),
    bankAccountId: v.id("bank_accounts"),
    amount: v.number(),
    direction: v.union(v.literal("deposit"), v.literal("withdraw")), // deposit: bank -> app, withdraw: app -> bank
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const bankAccount = await ctx.db.get(args.bankAccountId);
    if (!bankAccount) throw new Error("Bank account not found");

    const appBalance = user.cadBalance ?? 0;
    const bankBalance = bankAccount.balance;

    if (args.direction === "deposit") {
      if (bankBalance < args.amount) {
        throw new Error(`Insufficient funds in bank account. Available: $${bankBalance.toLocaleString()}`);
      }
      // Deduct from bank, add to app
      await ctx.db.patch(args.bankAccountId, {
        balance: bankBalance - args.amount,
      });
      await ctx.db.patch(args.userId, {
        cadBalance: appBalance + args.amount,
      });
      
      // Add transaction
      await ctx.db.insert("transactions", {
        userId: args.userId,
        type: "deposit",
        cadAmount: args.amount,
        goldAmount: 0,
        pricePerGram: 0,
        status: "completed",
        createdAt: Date.now(),
      });
    } else {
      if (appBalance < args.amount) {
        throw new Error(`Insufficient funds in BitGold reserve. Available: $${appBalance.toLocaleString()}`);
      }
      // Add to bank, deduct from app
      await ctx.db.patch(args.bankAccountId, {
        balance: bankBalance + args.amount,
      });
      await ctx.db.patch(args.userId, {
        cadBalance: appBalance - args.amount,
      });
      
      // Add transaction
      await ctx.db.insert("transactions", {
        userId: args.userId,
        type: "withdraw",
        cadAmount: args.amount,
        goldAmount: 0,
        pricePerGram: 0,
        status: "completed",
        createdAt: Date.now(),
      });
    }
  },
});

// --- Delivery Requests ---
export const getDeliveryRequests = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("delivery_requests")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createDeliveryRequest = mutation({
  args: {
    userId: v.id("users"),
    item_type: v.union(v.literal("1g_bar"), v.literal("5g_coin"), v.literal("10g_swiss_bar")),
    shipping_address: v.object({
      name: v.string(),
      address1: v.string(),
      address2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Validate that the user has enough gold balance to redeem this item
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    let requiredGold = 1; // Default to 1g
    if (args.item_type === "5g_coin") requiredGold = 5;
    else if (args.item_type === "10g_swiss_bar") requiredGold = 10;

    const goldBalance = user.goldBalance ?? 0;
    if (goldBalance < requiredGold) {
      throw new Error(`Insufficient gold balance. You need at least ${requiredGold}g of gold to redeem this item.`);
    }

    // Deduct the gold balance
    await ctx.db.patch(args.userId, {
      goldBalance: goldBalance - requiredGold,
    });

    // Create delivery request
    const requestId = await ctx.db.insert("delivery_requests", {
      userId: args.userId,
      item_type: args.item_type,
      shipping_address: args.shipping_address,
      status: "processing",
    });

    // Add a transaction record for this redemption
    await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "redeem",
      cadAmount: 0,
      goldAmount: requiredGold,
      pricePerGram: 0,
      status: "completed",
      createdAt: Date.now(),
    });

    return requestId;
  },
});

// --- Audit Logs ---
export const getAuditLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("audit_logs")
      .order("desc")
      .collect();
  },
});

export const addAuditLog = mutation({
  args: {
    vault_id: v.string(),
    gold_bar_serial: v.string(),
    auditor: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("audit_logs", {
      vault_id: args.vault_id,
      gold_bar_serial: args.gold_bar_serial,
      auditor: args.auditor,
      verified_at: Date.now(),
    });
  },
});
