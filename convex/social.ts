import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// --- Referrals ---
export const getReferrals = query({
  args: { referrerId: v.id("users") },
  handler: async (ctx, { referrerId }) => {
    return await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrer_id", referrerId))
      .collect();
  },
});

export const inviteUser = mutation({
  args: {
    referrerId: v.id("users"),
  },
  handler: async (ctx, { referrerId }) => {
    return await ctx.db.insert("referrals", {
      referrer_id: referrerId,
      status: "pending",
      reward_claimed: false,
    });
  },
});

export const completeReferral = mutation({
  args: {
    referralId: v.id("referrals"),
    refereeId: v.id("users"),
  },
  handler: async (ctx, { referralId, refereeId }) => {
    const referral = await ctx.db.get(referralId);
    if (!referral) throw new Error("Referral not found");

    await ctx.db.patch(referralId, {
      referee_id: refereeId,
      status: "completed",
    });

    // Reward both referrer and referee with $10 CAD as a referral bonus
    const referrer = await ctx.db.get(referral.referrer_id);
    const referee = await ctx.db.get(refereeId);

    if (referrer) {
      await ctx.db.patch(referral.referrer_id, {
        cadBalance: (referrer.cadBalance ?? 0) + 10,
      });
    }

    if (referee) {
      await ctx.db.patch(refereeId, {
        cadBalance: (referee.cadBalance ?? 0) + 10,
      });
    }
  },
});

// --- Gifts ---
export const sendGift = mutation({
  args: {
    senderId: v.id("users"),
    recipientEmail: v.string(),
    goldAmount: v.number(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sender = await ctx.db.get(args.senderId);
    if (!sender) throw new Error("Sender not found");

    const senderGold = sender.goldBalance ?? 0;
    if (senderGold < args.goldAmount) {
      throw new Error("Insufficient gold balance to send this gift.");
    }

    // Deduct gold from sender
    await ctx.db.patch(args.senderId, {
      goldBalance: senderGold - args.goldAmount,
    });

    // Generate a simple claim code
    const claimCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create gift record
    const giftId = await ctx.db.insert("gifts", {
      sender_id: args.senderId,
      recipient_email: args.recipientEmail,
      amount: args.goldAmount,
      message: args.message,
      claim_code: claimCode,
      status: "sent",
      expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    });

    // Log transaction
    await ctx.db.insert("transactions", {
      userId: args.senderId,
      type: "gift_send",
      cadAmount: 0,
      goldAmount: args.goldAmount,
      pricePerGram: 0,
      status: "completed",
      createdAt: Date.now(),
    });

    return { giftId, claimCode };
  },
});

export const claimGift = mutation({
  args: {
    recipientId: v.id("users"),
    claimCode: v.string(),
  },
  handler: async (ctx, { recipientId, claimCode }) => {
    const gift = await ctx.db
      .query("gifts")
      .filter((q) => q.eq(q.field("claim_code"), claimCode))
      .unique();

    if (!gift) throw new Error("Invalid claim code.");
    if (gift.status === "claimed") throw new Error("Gift has already been claimed.");
    if (gift.expires_at < Date.now()) throw new Error("Gift has expired.");

    const recipient = await ctx.db.get(recipientId);
    if (!recipient) throw new Error("Recipient not found");

    // Credit gold to recipient
    await ctx.db.patch(recipientId, {
      goldBalance: (recipient.goldBalance ?? 0) + gift.amount,
    });

    // Update gift status
    await ctx.db.patch(gift._id, {
      status: "claimed",
    });

    // Log transaction
    await ctx.db.insert("transactions", {
      userId: recipientId,
      type: "gift_claim",
      cadAmount: 0,
      goldAmount: gift.amount,
      pricePerGram: 0,
      status: "completed",
      createdAt: Date.now(),
    });

    return gift.amount;
  },
});
