import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// --- Round-Up Settings ---
export const getRoundUpSettings = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("roundup_settings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const updateRoundUpSettings = mutation({
  args: {
    userId: v.id("users"),
    enabled: v.boolean(),
    multiplier: v.number(),
    linked_account_mask: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("roundup_settings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        enabled: args.enabled,
        multiplier: args.multiplier,
        linked_account_mask: args.linked_account_mask,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("roundup_settings", {
        userId: args.userId,
        enabled: args.enabled,
        multiplier: args.multiplier,
        linked_account_mask: args.linked_account_mask,
      });
    }
  },
});

// --- Recurring Buys ---
export const getRecurringBuys = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("recurring_buys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createRecurringBuy = mutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    frequency: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
  },
  handler: async (ctx, args) => {
    let nextExecution = Date.now();
    if (args.frequency === "daily") nextExecution += 24 * 60 * 60 * 1000;
    else if (args.frequency === "weekly") nextExecution += 7 * 24 * 60 * 60 * 1000;
    else nextExecution += 30 * 24 * 60 * 60 * 1000; // rough month

    return await ctx.db.insert("recurring_buys", {
      userId: args.userId,
      amount: args.amount,
      frequency: args.frequency,
      next_execution: nextExecution,
      status: "active",
    });
  },
});

export const updateRecurringBuyStatus = mutation({
  args: {
    buyId: v.id("recurring_buys"),
    status: v.union(v.literal("active"), v.literal("paused")),
  },
  handler: async (ctx, { buyId, status }) => {
    await ctx.db.patch(buyId, { status });
  },
});

export const deleteRecurringBuy = mutation({
  args: { buyId: v.id("recurring_buys") },
  handler: async (ctx, { buyId }) => {
    await ctx.db.delete(buyId);
  },
});

// --- Savings Goals ---
export const getSavingsGoals = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("savings_goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const createSavingsGoal = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    target_amount: v.number(),
    deadline: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("savings_goals", {
      userId: args.userId,
      name: args.name,
      target_amount: args.target_amount,
      current_amount: 0,
      deadline: args.deadline,
    });
  },
});

export const updateSavingsGoalProgress = mutation({
  args: {
    goalId: v.id("savings_goals"),
    amountToAdd: v.number(),
  },
  handler: async (ctx, { goalId, amountToAdd }) => {
    const goal = await ctx.db.get(goalId);
    if (!goal) throw new Error("Goal not found");
    await ctx.db.patch(goalId, {
      current_amount: goal.current_amount + amountToAdd,
    });
  },
});

export const deleteSavingsGoal = mutation({
  args: { goalId: v.id("savings_goals") },
  handler: async (ctx, { goalId }) => {
    await ctx.db.delete(goalId);
  },
});
