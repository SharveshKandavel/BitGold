import { v } from "convex/values";
import { action, internalMutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Mock 2FA for development to fix Type Errors
export const generate2FASecret = action({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }): Promise<{ secret: string, otpAuthUrl: string }> => {
    // In a real app, use 'otpauth' or 'speakeasy' here.
    // For now, we return a consistent mock secret to pass type checks.
    const secret = "MOCK_SECRET_BASE32_J5XW6Z3R"; 
    const otpAuthUrl = `otpauth://totp/BitGold:${userId}?secret=${secret}&issuer=BitGold`;

    return { secret, otpAuthUrl };
  },
});

export const validate2FA = action({
  args: { 
    email: v.string(),
    code: v.string() 
  },
  handler: async (ctx, { email, code }): Promise<{ success: boolean, message?: string }> => {
    const user = await ctx.runQuery(api.users.getUserByEmail, { email });

    if (!user) {
        return { success: false, message: "User not found" };
    }

    // Mock Validation: Always accept "123456" or the correct code if you implement logic
    const isValid = code === "123456"; 

    if (isValid) {
        return { success: true };
    } else {
        return { success: false, message: "Invalid code" };
    }
  },
});