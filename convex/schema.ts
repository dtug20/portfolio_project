import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ── Admin users ─────────────────────────────────────────
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(), // bcrypt hash
    name: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // ── Shows (lịch diễn) ───────────────────────────────────
  shows: defineTable({
    date: v.optional(v.string()),          // "2026-10-12" — ISO date string
    day: v.optional(v.string()),           // Legacy
    month: v.optional(v.string()),         // Legacy
    year: v.optional(v.string()),          // Legacy
    sortDate: v.optional(v.string()),      // Legacy
    event: v.string(),
    venue: v.string(),
    city: v.string(),
    country: v.string(),       // 2-letter ISO code: "VN"
    type: v.string(),          // "Solo Recital", "Headline Performance", ...
    status: v.union(
      v.literal("tickets"),
      v.literal("rsvp"),
      v.literal("sold_out"),
      v.literal("details"),
    ),
    ticketUrl: v.optional(v.string()),
    isPast: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_is_past", ["isPast"]),

  // ── Media items (tác phẩm) ──────────────────────────────
  mediaItems: defineTable({
    category: v.union(
      v.literal("Video"),
      v.literal("Projects"),
      v.literal("Campaigns"),
    ),
    title: v.string(),
    description: v.string(),
    tag: v.string(),           // "Official Video", "Studio Album", ...
    year: v.string(),
    hasPlay: v.boolean(),      // show play button overlay
    isPublished: v.boolean(),
    order: v.number(),         // display order

    // Cover image — one of: uploaded file OR external URL
    coverStorageId: v.optional(v.id("_storage")),
    coverUrl: v.optional(v.string()),  // external URL fallback / Unsplash

    // Video — external URL (YouTube / Vimeo) or uploaded file
    videoUrl: v.optional(v.string()),
    videoStorageId: v.optional(v.id("_storage")),

    // Audio — uploaded file
    audioStorageId: v.optional(v.id("_storage")),
    audioFilename: v.optional(v.string()),

    // Additional gallery images
    galleryStorageIds: v.optional(v.array(v.id("_storage"))),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"])
    .index("by_published", ["isPublished"]),

  // ── Artist info (singleton — always _id = one record) ───
  artistInfo: defineTable({
    name: v.string(),                   // "Nguyen Minh"
    subtitle: v.string(),               // "Composer · Performer · Music Director"
    heroBio: v.string(),                // Short bio under hero title
    fullBio: v.string(),                // Long bio for About page
    aboutHeadline: v.string(),          // "A Voice Between Two Worlds"

    // Hero section
    heroImageStorageId: v.optional(v.id("_storage")),
    heroImageUrl: v.optional(v.string()),

    // About portrait
    portraitStorageId: v.optional(v.id("_storage")),
    portraitUrl: v.optional(v.string()),

    // Stats shown in About section
    statYears: v.string(),              // "20+"
    statConcerts: v.string(),           // "300+"
    statAlbums: v.string(),             // "12"
    statAwards: v.string(),             // "8"

    // Contact info
    bookingEmail: v.string(),
    touringEmail: v.string(),
    pressEmail: v.string(),

    updatedAt: v.number(),
  }),

  // ── Career milestones ────────────────────────────────────
  milestones: defineTable({
    year: v.string(),
    title: v.string(),
    description: v.string(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_order", ["order"]),

  // ── Services ─────────────────────────────────────────────
  services: defineTable({
    number: v.string(),               // "01", "02", ...
    title: v.string(),
    shortDesc: v.string(),
    fullDesc: v.string(),
    deliverables: v.array(v.string()),
    timeline: v.string(),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_order", ["order"]),
});
