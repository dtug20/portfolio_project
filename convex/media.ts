import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ───────────────────────────────────────────────

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("mediaItems")
      .withIndex("by_order")
      .order("asc")
      .collect();

    // Resolve Convex storage URLs
    return Promise.all(
      items.map(async (item) => {
        let coverUrl = item.coverUrl;
        if (item.coverStorageId) {
          coverUrl = (await ctx.storage.getUrl(item.coverStorageId)) ?? coverUrl;
        }
        let audioUrl: string | undefined;
        if (item.audioStorageId) {
          audioUrl = (await ctx.storage.getUrl(item.audioStorageId)) ?? undefined;
        }
        let videoUrl = item.videoUrl;
        if (item.videoStorageId) {
          videoUrl = (await ctx.storage.getUrl(item.videoStorageId)) ?? videoUrl;
        }
        return { ...item, coverUrl, audioUrl, videoUrl };
      }),
    );
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("mediaItems")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("asc")
      .collect();

    return Promise.all(
      items.map(async (item) => {
        let coverUrl = item.coverUrl;
        if (item.coverStorageId) {
          coverUrl = (await ctx.storage.getUrl(item.coverStorageId)) ?? coverUrl;
        }
        return { ...item, coverUrl };
      }),
    );
  },
});

export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("mediaItems")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .order("asc")
      .collect();

    return Promise.all(
      items.map(async (item) => {
        let coverUrl = item.coverUrl;
        if (item.coverStorageId) {
          coverUrl = (await ctx.storage.getUrl(item.coverStorageId)) ?? coverUrl;
        }
        return { ...item, coverUrl };
      }),
    );
  },
});

export const getById = query({
  args: { id: v.id("mediaItems") },
  handler: async (ctx, { id }) => {
    const item = await ctx.db.get(id);
    if (!item) return null;

    let coverUrl = item.coverUrl;
    if (item.coverStorageId) {
      coverUrl = (await ctx.storage.getUrl(item.coverStorageId)) ?? coverUrl;
    }
    return { ...item, coverUrl };
  },
});

// ── Storage upload URL ────────────────────────────────────
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

// ── Mutations ─────────────────────────────────────────────

const mediaArgs = {
  category: v.union(v.literal("Video"), v.literal("Projects"), v.literal("Campaigns")),
  title: v.string(),
  description: v.string(),
  tag: v.string(),
  year: v.string(),
  hasPlay: v.boolean(),
  isPublished: v.boolean(),
  isFeatured: v.optional(v.boolean()),
  order: v.number(),
  coverStorageId: v.optional(v.id("_storage")),
  coverUrl: v.optional(v.string()),
  videoUrl: v.optional(v.string()),
  videoStorageId: v.optional(v.id("_storage")),
  audioStorageId: v.optional(v.id("_storage")),
  audioFilename: v.optional(v.string()),
  galleryStorageIds: v.optional(v.array(v.id("_storage"))),
};

export const create = mutation({
  args: mediaArgs,
  handler: async (ctx, args) => {
    return ctx.db.insert("mediaItems", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: { id: v.id("mediaItems"), ...mediaArgs },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, { ...args, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("mediaItems") },
  handler: async (ctx, { id }) => {
    const item = await ctx.db.get(id);
    if (!item) return;
    // Clean up storage files
    if (item.coverStorageId) await ctx.storage.delete(item.coverStorageId);
    if (item.audioStorageId) await ctx.storage.delete(item.audioStorageId);
    if (item.videoStorageId) await ctx.storage.delete(item.videoStorageId);
    if (item.galleryStorageIds) {
      for (const sid of item.galleryStorageIds) await ctx.storage.delete(sid);
    }
    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: { orderedIds: v.array(v.id("mediaItems")) },
  handler: async (ctx, { orderedIds }) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await ctx.db.patch(orderedIds[i], { order: i, updatedAt: Date.now() });
    }
  },
});

// ── Seed initial media ────────────────────────────────────
export const seedInitialMedia = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("mediaItems").take(1);
    if (existing.length > 0) return { skipped: true };

    const items = [
      { category: "Video" as const, title: "Echoes of the Red River", description: "Official music video — solo piano performance filmed at the Hanoi Opera House. Directed by Trần Anh Hùng.", tag: "Official Video", year: "2024", hasPlay: true, coverUrl: "https://images.unsplash.com/photo-1558620013-a08999547a36?w=1080&q=80", order: 0 },
      { category: "Projects" as const, title: "Between Silence — Studio Album", description: "Grammy-nominated studio album recorded with the London Symphony Orchestra. Released on Deutsche Grammophon, 2021.", tag: "Studio Album", year: "2021", hasPlay: false, coverUrl: "https://images.unsplash.com/photo-1674572392130-1d36223d9673?w=1080&q=80", order: 1 },
      { category: "Video" as const, title: "Monsoon Suite — Live at Carnegie Hall", description: "Full concert recording of the world-premiere performance at Carnegie Hall, New York.", tag: "Live Recording", year: "2023", hasPlay: true, coverUrl: "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1080&q=80", order: 2 },
      { category: "Campaigns" as const, title: "UNESCO — Music Bridges Campaign", description: "Global cultural campaign video commissioned by UNESCO exploring music as a bridge between civilizations.", tag: "Campaign", year: "2023", hasPlay: true, coverUrl: "https://images.unsplash.com/photo-1551696785-927d4ac2d35b?w=1080&q=80", order: 3 },
      { category: "Projects" as const, title: "Homeland — Original Film Score", description: "Complete score for Đặng Nhật Minh's feature film 'Homeland'. Winner of Best Original Score, Golden Kite Awards 2022.", tag: "Film Score", year: "2022", hasPlay: false, coverUrl: "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?w=1080&q=80", order: 4 },
      { category: "Video" as const, title: "The Space Between Notes", description: "Documentary short exploring Nguyen Minh's compositional process. Produced by VTV and the British Council.", tag: "Documentary", year: "2022", hasPlay: true, coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1080&q=80", order: 5 },
    ];

    for (const item of items) {
      await ctx.db.insert("mediaItems", { ...item, isPublished: true, createdAt: Date.now(), updatedAt: Date.now() });
    }
    return { seeded: items.length };
  },
});
