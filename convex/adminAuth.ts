"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET ?? "change-me-in-convex-env";

// ── Login ─────────────────────────────────────────────────
export const login = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    // Fetch user by email
    const user: any = await ctx.runQuery(internal.adminUsers.getUserByEmail, { email });

    if (!user) throw new Error("Sai email hoặc mật khẩu");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Sai email hoặc mật khẩu");

    const token = jwt.sign(
      { adminId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return { token, name: user.name, email: user.email };
  },
});

// ── Verify token (used by admin pages) ───────────────────
export const verifyToken = action({
  args: { token: v.string() },
  handler: async (_ctx, { token }) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        adminId: string;
        email: string;
        name: string;
      };
      return { valid: true, adminId: payload.adminId, email: payload.email, name: payload.name };
    } catch {
      return { valid: false };
    }
  },
});

// ── Change password ───────────────────────────────────────
export const changePassword = action({
  args: { token: v.string(), currentPassword: v.string(), newPassword: v.string() },
  handler: async (ctx, { token, currentPassword, newPassword }) => {
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      throw new Error("Token không hợp lệ");
    }

    const user: any = await ctx.runQuery(internal.adminUsers.getUserByEmail, {
      email: payload.email,
    });
    if (!user) throw new Error("Không tìm thấy tài khoản");

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new Error("Mật khẩu hiện tại không đúng");

    const newHash = await bcrypt.hash(newPassword, 12);
    await ctx.runMutation(internal.adminUsers.updatePasswordHash, {
      adminId: user._id,
      passwordHash: newHash,
    });
    return { success: true };
  },
});

// ── Seed first admin (run once) ───────────────────────────
export const seedAdmin = action({
  args: { email: v.string(), password: v.string(), name: v.string(), setupKey: v.string() },
  handler: async (ctx, { email, password, name, setupKey }) => {
    // Protect with a one-time setup key stored in env
    const expectedKey = process.env.ADMIN_SETUP_KEY;
    if (!expectedKey || setupKey !== expectedKey) {
      throw new Error("Setup key không hợp lệ");
    }

    const existing: any = await ctx.runQuery(internal.adminUsers.getUserByEmail, { email });
    if (existing) throw new Error("Admin đã tồn tại");

    const passwordHash = await bcrypt.hash(password, 12);
    await ctx.runMutation(internal.adminUsers.createAdminUser, {
      email,
      passwordHash,
      name,
    });
    return { success: true, message: "Admin đã được tạo thành công" };
  },
});


