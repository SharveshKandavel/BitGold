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
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    // Assuming the 'sub' field in identity is the user's ID in the 'users' table
    // You might need to adjust this based on your Convex authentication setup
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
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
