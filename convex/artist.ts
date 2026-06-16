import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ═══════════════════════════════════════════════════════════
// ARTIST INFO (singleton)
// ═══════════════════════════════════════════════════════════

export const getArtistInfo = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db.query("artistInfo").take(1);
    const info = records[0];
    if (!info) return null;

    let heroImageUrl = info.heroImageUrl;
    if (info.heroImageStorageId) {
      heroImageUrl = (await ctx.storage.getUrl(info.heroImageStorageId)) ?? heroImageUrl;
    }
    let portraitUrl = info.portraitUrl;
    if (info.portraitStorageId) {
      portraitUrl = (await ctx.storage.getUrl(info.portraitStorageId)) ?? portraitUrl;
    }
    return { ...info, heroImageUrl, portraitUrl };
  },
});

export const upsertArtistInfo = mutation({
  args: {
    name: v.string(),
    subtitle: v.string(),
    heroBio: v.string(),
    fullBio: v.string(),
    aboutHeadline: v.string(),
    heroImageStorageId: v.optional(v.id("_storage")),
    heroImageUrl: v.optional(v.string()),
    portraitStorageId: v.optional(v.id("_storage")),
    portraitUrl: v.optional(v.string()),
    statYears: v.string(),
    statConcerts: v.string(),
    statAlbums: v.string(),
    statAwards: v.string(),
    bookingEmail: v.string(),
    touringEmail: v.string(),
    pressEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("artistInfo").take(1);
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, { ...args, updatedAt: Date.now() });
      return existing[0]._id;
    }
    return ctx.db.insert("artistInfo", { ...args, updatedAt: Date.now() });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

export const seedArtistInfo = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("artistInfo").take(1);
    if (existing.length > 0) return { skipped: true };

    await ctx.db.insert("artistInfo", {
      name: "Nguyen Minh",
      subtitle: "Composer · Performer · Music Director",
      heroBio: "Pianist, composer, and music director whose work bridges the musical heritage of Vietnam with the contemporary Western canon.",
      fullBio: "Nguyen Minh is a Vietnamese pianist, composer, and music director widely regarded as one of the most significant musical voices to emerge from Southeast Asia in the past two decades. Born in Hanoi in 1985, he trained at the Hanoi Conservatory of Music before earning a full scholarship to the Royal College of Music in London.",
      aboutHeadline: "A Voice Between Two Worlds",
      heroImageUrl: "https://images.unsplash.com/photo-1558620013-a08999547a36?w=1080&q=80",
      portraitUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      statYears: "20+",
      statConcerts: "300+",
      statAlbums: "12",
      statAwards: "8",
      bookingEmail: "booking@nguyenminh.asia",
      touringEmail: "touring@nguyenminh.asia",
      pressEmail: "press@nguyenminh.asia",
      updatedAt: Date.now(),
    });
    return { seeded: true };
  },
});

// ═══════════════════════════════════════════════════════════
// MILESTONES
// ═══════════════════════════════════════════════════════════

export const listMilestones = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("milestones").withIndex("by_order").order("asc").collect();
  },
});

export const createMilestone = mutation({
  args: { year: v.string(), title: v.string(), description: v.string(), order: v.number() },
  handler: async (ctx, args) => {
    return ctx.db.insert("milestones", { ...args, createdAt: Date.now(), updatedAt: Date.now() });
  },
});

export const updateMilestone = mutation({
  args: { id: v.id("milestones"), year: v.string(), title: v.string(), description: v.string(), order: v.number() },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, { ...args, updatedAt: Date.now() });
  },
});

export const deleteMilestone = mutation({
  args: { id: v.id("milestones") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
});

export const seedMilestones = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("milestones").take(1);
    if (existing.length > 0) return { skipped: true };

    const data = [
      { year: "1985", title: "Born in Hanoi, Vietnam", description: "Raised in a musical household, Nguyen Minh began formal piano studies at the age of five under master teacher Pham Thi Lan at the Hanoi School of Music." },
      { year: "2003", title: "Hanoi Conservatory — First Prize", description: "Graduated with highest honours from the Hanoi Conservatory of Music, earning the National Young Musician Prize for his original composition cycle 'Song of the Red River'." },
      { year: "2007", title: "Royal College of Music, London", description: "Awarded a full scholarship to pursue postgraduate study in composition and performance at the Royal College of Music, studying under Sir Harrison Birtwistle." },
      { year: "2010", title: "International Debut — Carnegie Hall", description: "Made his international solo debut at Carnegie Hall, New York, performing his own composition 'Monsoon Suite' to critical acclaim." },
      { year: "2014", title: "UNESCO Artist for Peace", description: "Appointed as a UNESCO Artist for Peace in recognition of his contribution to cultural dialogue through music between Vietnam and the international community." },
      { year: "2018", title: "Founding of the Vietnam Contemporary Music Ensemble", description: "Established the Vietnam Contemporary Music Ensemble, a pioneering chamber group dedicated to premiering new works by Southeast Asian composers." },
      { year: "2021", title: "Grammy Nomination — Best Classical Composition", description: "Received a Grammy nomination for his orchestral work 'Between Silence', recorded with the London Symphony Orchestra and released on Deutsche Grammophon." },
      { year: "2024", title: "Artist in Residence — Sydney Opera House", description: "Named Artist in Residence at the Sydney Opera House for the 2024–2025 season, premiering three new works exploring the intersection of Vietnamese folk tradition and electronic composition." },
    ];

    for (let i = 0; i < data.length; i++) {
      await ctx.db.insert("milestones", { ...data[i], order: i, createdAt: Date.now(), updatedAt: Date.now() });
    }
    return { seeded: data.length };
  },
});

// ═══════════════════════════════════════════════════════════
// SERVICES
// ═══════════════════════════════════════════════════════════

export const listServices = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("services").withIndex("by_order").order("asc").collect();
  },
});

export const createService = mutation({
  args: {
    number: v.string(), title: v.string(), shortDesc: v.string(), fullDesc: v.string(),
    deliverables: v.array(v.string()), timeline: v.string(), tags: v.array(v.string()),
    isPublished: v.boolean(), order: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("services", { ...args, createdAt: Date.now(), updatedAt: Date.now() });
  },
});

export const updateService = mutation({
  args: {
    id: v.id("services"), number: v.string(), title: v.string(), shortDesc: v.string(),
    fullDesc: v.string(), deliverables: v.array(v.string()), timeline: v.string(),
    tags: v.array(v.string()), isPublished: v.boolean(), order: v.number(),
  },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, { ...args, updatedAt: Date.now() });
  },
});

export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
});
