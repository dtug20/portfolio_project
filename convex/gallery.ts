import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Lấy danh sách ảnh gallery, resolve public url cho ảnh
export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("galleries")
      .withIndex("by_order")
      .collect();

    // Map storageId to full URL
    return Promise.all(
      items.map(async (item) => {
        const url = await ctx.storage.getUrl(item.storageId);
        return { ...item, url };
      })
    );
  },
});

export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("galleries")
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .order("asc")
      .collect();

    return Promise.all(
      items.map(async (item) => {
        const url = await ctx.storage.getUrl(item.storageId);
        return { ...item, url };
      })
    );
  },
});

// Thêm ảnh vào gallery
export const add = mutation({
  args: {
    type: v.union(
      v.literal("Personal"),
      v.literal("Open Project"),
      v.literal("S.E Project"),
      v.literal("Bluemato")
    ),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Lấy order lớn nhất hiện tại để thêm vào cuối
    const existing = await ctx.db.query("galleries").collect();
    const maxOrder = existing.reduce((max, item) => Math.max(max, item.order), -1);

    return await ctx.db.insert("galleries", {
      type: args.type,
      storageId: args.storageId,
      order: maxOrder + 1,
      createdAt: Date.now(),
    });
  },
});

// Xoá ảnh khỏi gallery
export const remove = mutation({
  args: {
    id: v.id("galleries"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Image not found");

    // Xoá file trong storage
    await ctx.storage.delete(item.storageId);
    // Xoá bản ghi
    await ctx.db.delete(args.id);
  },
});

export const toggleFeatured = mutation({
  args: {
    id: v.id("galleries"),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isFeatured: args.isFeatured });
  },
});

// Cập nhật thứ tự hiển thị
export const reorder = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("galleries"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, { order: update.order });
    }
  },
});

// Generate URL để upload file
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
