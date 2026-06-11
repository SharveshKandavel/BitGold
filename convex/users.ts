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
  args: { demoIdentifier: v.optional(v.string()) },
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx, { demoIdentifier }) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (identity) {
      // 1. Logic for Real Cloud Users
      const existing = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

      if (existing) {
        // Sync details
        if (existing.name !== identity.name || existing.email !== identity.email || existing.picture !== identity.pictureUrl) {
          await ctx.db.patch(existing._id, {
            name: identity.name ?? existing.name,
            email: identity.email ?? existing.email,
            picture: identity.pictureUrl ?? existing.picture,
          });
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
      // 2. Logic for Unique Demo Users
      const tokenIdentifier = `demo:${demoIdentifier}`;
      const existingDemo = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .unique();

      if (existingDemo) {
        return existingDemo._id;
      }

      return await ctx.db.insert("users", {
        name: "Demo Investor",
        email: "demo@bitgold.io",
        picture: `https://api.dicebear.com/8.x/initials/svg?seed=${demoIdentifier}`,
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
