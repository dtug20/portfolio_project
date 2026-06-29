import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ───────────────────────────────────────────────

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .collect();
      
    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        coverUrl: post.coverStorageId
          ? (await ctx.storage.getUrl(post.coverStorageId)) ?? post.coverUrl
          : post.coverUrl,
      }))
    );
  },
});

export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .order("desc")
      .collect();
      
    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        coverUrl: post.coverStorageId
          ? (await ctx.storage.getUrl(post.coverStorageId)) ?? post.coverUrl
          : post.coverUrl,
      }))
    );
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("blogPosts").order("desc").collect();
    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        coverUrl: post.coverStorageId
          ? (await ctx.storage.getUrl(post.coverStorageId)) ?? post.coverUrl
          : post.coverUrl,
      }))
    );
  },
});

export const getById = query({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    const post = await ctx.db.get(id);
    if (!post) return null;
    
    let coverUrl = post.coverUrl;
    if (post.coverStorageId) {
      coverUrl = (await ctx.storage.getUrl(post.coverStorageId)) ?? coverUrl;
    }
    
    return { ...post, coverUrl };
  },
});

// ── Mutations ─────────────────────────────────────────────

const blogArgs = {
  title: v.string(),
  excerpt: v.string(),
  content: v.string(),
  coverStorageId: v.optional(v.id("_storage")),
  coverUrl: v.optional(v.string()),
  isPublished: v.boolean(),
  isFeatured: v.optional(v.boolean()),
  publishedAt: v.optional(v.number()),
};

export const create = mutation({
  args: blogArgs,
  handler: async (ctx, args) => {
    return ctx.db.insert("blogPosts", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: { id: v.id("blogPosts"), ...blogArgs },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, { ...args, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getImageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
