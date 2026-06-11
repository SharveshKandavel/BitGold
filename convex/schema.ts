import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Core User Data
  users: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    picture: v.optional(v.string()),
    tokenIdentifier: v.string(),
    balance: v.optional(v.number()),
    cadBalance: v.optional(v.number()),
    goldBalance: v.optional(v.number()),
    is_verified: v.optional(v.boolean()),
    totpSecret: v.optional(v.string()),
    is2FAEnabled: v.optional(v.boolean()),
  }).index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  // 2. Transactions
  transactions: defineTable({
    userId: v.id("users"),
    type: v.string(), // "buy", "sell", "deposit"
    cadAmount: v.number(),
    goldAmount: v.number(),
    pricePerGram: v.number(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // 3. Automation (Phase 2)
  roundup_settings: defineTable({
    userId: v.id("users"),
    enabled: v.boolean(),
    multiplier: v.number(),
    linked_account_mask: v.string(),
  }).index("by_user", ["userId"]),

  recurring_buys: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    frequency: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")), // Corrected type
    next_execution: v.number(),
    status: v.union(v.literal("active"), v.literal("paused")), // Corrected type
  }).index("by_user", ["userId"]),

  savings_goals: defineTable({
    userId: v.id("users"),
    name: v.string(),
    target_amount: v.number(),
    current_amount: v.number(),
    deadline: v.number(),
  }).index("by_user", ["userId"]),

  // 4. Trust & Banking (Phase 3)
  bank_accounts: defineTable({
    userId: v.id("users"),
    bank_name: v.string(),
    last4: v.string(),
    is_verified: v.boolean(),
    type: v.union(v.literal("checking"), v.literal("savings")), // Corrected type
  }).index("by_user", ["userId"]),

  audit_logs: defineTable({
    vault_id: v.string(),
    gold_bar_serial: v.string(),
    auditor: v.string(),
    verified_at: v.number(),
  }),

  // 5. Viral & Social (Phase 4)
  referrals: defineTable({
    referrer_id: v.id("users"),
    referee_id: v.optional(v.id("users")), // Optional until they join
    status: v.union(v.literal("pending"), v.literal("completed")), // Corrected type
    reward_claimed: v.boolean(),
  }).index("by_referrer", ["referrer_id"]),

  gifts: defineTable({
    sender_id: v.id("users"),
    recipient_email: v.string(),
    amount: v.number(),
    message: v.optional(v.string()),
    claim_code: v.string(),
    status: v.union(v.literal("sent"), v.literal("claimed")), // Corrected type
    expires_at: v.number(),
  }),

  delivery_requests: defineTable({
    userId: v.id("users"),
    item_type: v.union(v.literal("1g_bar"), v.literal("5g_coin"), v.literal("10g_swiss_bar")), // Corrected type
    shipping_address: v.object({ // Corrected type
      name: v.string(),
      address1: v.string(),
      address2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
    status: v.union(v.literal("processing"), v.literal("shipped")), // Corrected type
  }).index("by_user", ["userId"]),
});