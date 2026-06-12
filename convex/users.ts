import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel"; // Import Id type

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Explicitly cast userId to Id<"users"> if Convex's type inference struggles
    return await ctx.db.get(userId as Id<"users">);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Ensure the index is correctly used
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const getMe = query({
  args: { demoIdentifier: v.optional(v.string()) },
  handler: async (ctx, { demoIdentifier }) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (identity) {
      return await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();
    }

    if (demoIdentifier) {
      return await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", `demo:${demoIdentifier}`))
        .unique();
    }

    return null;
  },
});

export const ensureCurrentUser = mutation({
  args: { 
    demoIdentifier: v.optional(v.string()),
    fallbackName: v.optional(v.string()),
    fallbackEmail: v.optional(v.string()),
    fallbackPicture: v.optional(v.string()),
  },
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx, { demoIdentifier, fallbackName, fallbackEmail, fallbackPicture }) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (identity) {
      // 1. Logic for Real Cloud Users
      const existing = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

      if (existing) {
        // Sync details and ensure starting balances are initialized if missing
        const patchData: any = {};
        if (existing.name !== identity.name || existing.email !== identity.email || existing.picture !== identity.pictureUrl) {
          patchData.name = identity.name ?? existing.name;
          patchData.email = identity.email ?? existing.email;
          patchData.picture = identity.pictureUrl ?? existing.picture;
        }
        if (existing.cadBalance === undefined) {
          patchData.cadBalance = 10000;
        }
        if (existing.goldBalance === undefined) {
          patchData.goldBalance = 10;
        }
        if (Object.keys(patchData).length > 0) {
          await ctx.db.patch(existing._id, patchData);
        }
        return existing._id;
      }

      return await ctx.db.insert("users", {
        name: identity.name ?? "New User",
        email: identity.email,
        picture: identity.pictureUrl,
        tokenIdentifier: identity.tokenIdentifier,
        cadBalance: 10000, 
        goldBalance: 10,
      });
    }

    if (demoIdentifier) {
      // 2. Logic for Unique Demo Users (and Clerk fallbacks)
      const tokenIdentifier = `demo:${demoIdentifier}`;
      const existingDemo = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .unique();

      if (existingDemo) {
        const demoPatch: any = {};
        if (existingDemo.name !== fallbackName || existingDemo.email !== fallbackEmail || existingDemo.picture !== fallbackPicture) {
          if (fallbackName) demoPatch.name = fallbackName;
          if (fallbackEmail) demoPatch.email = fallbackEmail;
          if (fallbackPicture) demoPatch.picture = fallbackPicture;
        }
        if (existingDemo.cadBalance === undefined) {
          demoPatch.cadBalance = 10000;
        }
        if (existingDemo.goldBalance === undefined) {
          demoPatch.goldBalance = 10;
        }
        if (Object.keys(demoPatch).length > 0) {
          await ctx.db.patch(existingDemo._id, demoPatch);
        }
        return existingDemo._id;
      }

      return await ctx.db.insert("users", {
        name: fallbackName ?? "Demo Investor",
        email: fallbackEmail ?? "demo@bitgold.io",
        picture: fallbackPicture ?? `https://api.dicebear.com/8.x/initials/svg?seed=${demoIdentifier}`,
        tokenIdentifier,
        cadBalance: 10000, 
        goldBalance: 10,
      });
    }

    return null;
  },
});

export const patchUser = mutation({
  args: { userId: v.id("users"), userPatch: v.object({
    totpSecret: v.optional(v.string()),
    is2FAEnabled: v.optional(v.boolean()),
  }) },
  handler: async (ctx, { userId, userPatch }) => {
    // Explicitly cast userId to Id<"users"> for patching
    await ctx.db.patch(userId as Id<"users">, userPatch);
  },
});

export const resetPortfolio = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // 1. Reset balances
    await ctx.db.patch(userId, {
      cadBalance: 10000,
      goldBalance: 10,
    });

    // 2. Delete transactions
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const tx of transactions) {
      await ctx.db.delete(tx._id);
    }

    // 3. Delete bank accounts
    const bankAccounts = await ctx.db
      .query("bank_accounts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const bank of bankAccounts) {
      await ctx.db.delete(bank._id);
    }

    // 4. Delete recurring buys
    const recurringBuys = await ctx.db
      .query("recurring_buys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const buy of recurringBuys) {
      await ctx.db.delete(buy._id);
    }

    // 5. Delete savings goals
    const savingsGoals = await ctx.db
      .query("savings_goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const goal of savingsGoals) {
      await ctx.db.delete(goal._id);
    }
  },
});
