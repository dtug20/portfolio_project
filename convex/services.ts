import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Admin Functions ───────────────────────────────────────

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("services").withIndex("by_order").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    shortDesc: v.string(),
    fullDesc: v.string(),
    deliverables: v.array(v.string()),
    timeline: v.string(),
    tags: v.array(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    imagePosition: v.optional(v.string()),
    isPublished: v.boolean(),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("services").collect();
    const order = existing.length;

    let imageUrl = args.imageUrl;
    if (args.imageStorageId) {
      imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }

    return await ctx.db.insert("services", {
      ...args,
      imageUrl,
      order,
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("services"),
    title: v.optional(v.string()),
    shortDesc: v.optional(v.string()),
    fullDesc: v.optional(v.string()),
    deliverables: v.optional(v.array(v.string())),
    timeline: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    imagePosition: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    if (updates.imageStorageId !== undefined) {
      if (updates.imageStorageId === null) {
        // null means clear the image
        updates.imageUrl = undefined;
        // Also we'd want to remove the old storage if necessary, but we'll leave it for now or delete later.
      } else {
        const url = await ctx.storage.getUrl(updates.imageStorageId);
        updates.imageUrl = url ?? undefined;
      }
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const service = await ctx.db.get(args.id);
    if (service?.imageStorageId) {
      await ctx.storage.delete(service.imageStorageId);
    }
    return await ctx.db.delete(args.id);
  },
});

export const updateOrder = mutation({
  args: {
    orderedIds: v.array(v.id("services")),
  },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.orderedIds.length; i++) {
      await ctx.db.patch(args.orderedIds[i], {
        order: i,
        updatedAt: Date.now(),
      });
    }
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// ── Public Frontend Functions ───────────────────────────────

export const listPublished = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("services").withIndex("by_order").collect();
    return all.filter((s) => s.isPublished);
  },
});

export const listFeatured = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("services").withIndex("by_order").collect();
    return all.filter((s) => s.isPublished && s.isFeatured);
  },
});

// ── Seeding Data ──────────────────────────────────────────

export const seedInitialData = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("services").collect();
    if (existing.length > 0) return "Already seeded";

    const data = [
      {
        title: "Composition",
        imageUrl: "/images/composition.webp",
        imagePosition: "center",
        shortDesc: "Original works for orchestral, chamber, and electronic forces.",
        fullDesc:
          "Bespoke compositions conceived from first principles — from intimate solo études to full orchestral canvases. Each score is shaped by a deep understanding of your brief, the acoustic context, and the cultural resonance you wish to create. Nguyen Minh's compositional voice bridges Vietnamese pentatonic tradition and late European modernism to produce music that is unmistakably particular, and universally felt.",
        deliverables: ["Fully notated score", "MIDI mockup / reference recording", "Performance notes", "Rights clearance support"],
        timeline: "8 – 24 weeks",
        tags: ["Orchestral", "Chamber", "Solo", "Electronic", "Film Score"],
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "Education",
        imageUrl: "/images/education.webp",
        imagePosition: "center",
        shortDesc: "Intensive programmes for conservatories, festivals, and institutions.",
        fullDesc:
          "Intensive workshops and masterclasses designed for advanced students, emerging professionals, and institutional education programmes. Topics include composition technique, cross-cultural musical language, career navigation for performing artists, and the business of new music. Delivered in person or via high-quality video link. Available in English and Vietnamese.",
        deliverables: ["Pre-session diagnostic", "Bespoke curriculum outline", "Post-session feedback document", "Follow-up consultation"],
        timeline: "2 – 8 weeks",
        tags: ["Masterclass", "Workshop", "Curriculum Design", "Residency", "Lecture"],
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "Live Performance",
        imageUrl: "/images/live_performance.webp",
        imagePosition: "center 35%",
        shortDesc: "Solo recitals, concertos, and bespoke ensemble programmes.",
        fullDesc:
          "From intimate salon recitals to headline festival slots, Nguyen Minh curates each performance programme with the precision of a dramatist. Engagements include solo piano recitals, concerto appearances with symphony orchestras, and collaborative projects with the Vietnam Contemporary Music Ensemble. All bookings include pre-concert programme notes, artist liaison, and technical rider.",
        deliverables: ["Custom programme design", "Programme notes for print", "Artist Q&A / Masterclass (optional)", "Technical rider"],
        timeline: "Minimum 12 weeks notice",
        tags: ["Solo Recital", "Concerto", "Festival", "Private Event", "Residency"],
        isPublished: true,
        isFeatured: true,
      },
      {
        title: "Music Production",
        imageUrl: "/images/engineer.webp",
        imagePosition: "center 39%",
        shortDesc: "Full-service recording production — arrangement to final mix.",
        fullDesc:
          "End-to-end production for recording artists, film directors, and brands requiring original music of the highest standard. Services span creative arrangement, full orchestration, session direction (Hanoi, London, Singapore), and mix oversight at partner studios. Nguyen Minh has produced records released on Deutsche Grammophon, Sony Classical, and independent labels across Southeast Asia.",
        deliverables: ["Arrangement & orchestration", "Session direction", "Stem delivery", "Mastered final audio"],
        timeline: "4 – 16 weeks",
        tags: ["Recording", "Orchestration", "Arrangement", "Mixing", "Mastering"],
        isPublished: true,
        isFeatured: true,
      },
    ];

    for (let i = 0; i < data.length; i++) {
      await ctx.db.insert("services", {
        ...data[i],
        order: i,
        updatedAt: Date.now(),
      });
    }

    return "Seeded 4 services.";
  },
});
