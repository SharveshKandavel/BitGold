import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const transactionValidator = v.object({
  _id: v.id("transactions"),
  _creationTime: v.number(),
  userId: v.id("users"),
  type: v.string(),
  cadAmount: v.number(),
  goldAmount: v.number(),
  pricePerGram: v.number(),
  status: v.string(),
  createdAt: v.number(),
});

export const executeBuy = mutation({
  args: {
    userId: v.id("users"),
    cadAmount: v.number(),
    goldAmount: v.number(),
    pricePerGram: v.number(),
  },
  returns: v.id("transactions"),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const cadBalance = user.cadBalance ?? 0;
    const goldBalance = user.goldBalance ?? 0;

    if (cadBalance < args.cadAmount) {
      throw new Error("Insufficient funds to complete this transaction.");
    }

    await ctx.db.patch(args.userId, {
      cadBalance: cadBalance - args.cadAmount,
      goldBalance: goldBalance + args.goldAmount,
    });

    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "buy",
      cadAmount: args.cadAmount,
      goldAmount: args.goldAmount,
      pricePerGram: args.pricePerGram,
      status: "completed",
      createdAt: Date.now(),
    });

    return transactionId;
  },
});

export const executeSell = mutation({
  args: {
    userId: v.id("users"),
    cadAmount: v.number(),
    goldAmount: v.number(),
    pricePerGram: v.number(),
  },
  returns: v.id("transactions"),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const cadBalance = user.cadBalance ?? 0;
    const goldBalance = user.goldBalance ?? 0;

    if (goldBalance < args.goldAmount) {
      throw new Error("Insufficient gold balance to complete this sale.");
    }

    await ctx.db.patch(args.userId, {
      cadBalance: cadBalance + args.cadAmount,
      goldBalance: goldBalance - args.goldAmount,
    });

    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      type: "sell",
      cadAmount: args.cadAmount,
      goldAmount: args.goldAmount,
      pricePerGram: args.pricePerGram,
      status: "completed",
      createdAt: Date.now(),
    });

    return transactionId;
  },
});

export const getUserTransactions = query({
  args: { userId: v.id("users") },
  returns: v.array(transactionValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
