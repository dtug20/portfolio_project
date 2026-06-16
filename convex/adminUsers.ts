import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const createAdminUser = internalMutation({
  args: { email: v.string(), passwordHash: v.string(), name: v.string() },
  handler: async (ctx, { email, passwordHash, name }) => {
    return ctx.db.insert("adminUsers", {
      email,
      passwordHash,
      name,
      createdAt: Date.now(),
    });
  },
});

export const updatePasswordHash = internalMutation({
  args: { adminId: v.id("adminUsers"), passwordHash: v.string() },
  handler: async (ctx, { adminId, passwordHash }) => {
    await ctx.db.patch(adminId, { passwordHash });
  },
});
