import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Helper ────────────────────────────────────────────────
async function resolveShowUrls(ctx: any, show: any) {
  let coverUrl = show.coverUrl;
  if (show.coverStorageId) {
    coverUrl = (await ctx.storage.getUrl(show.coverStorageId)) ?? coverUrl;
  }
  
  let galleryUrls: string[] = [];
  if (show.galleryStorageIds && show.galleryStorageIds.length > 0) {
    galleryUrls = (await Promise.all(
      show.galleryStorageIds.map((id: string) => ctx.storage.getUrl(id))
    )).filter(Boolean) as string[];
  }
  
  return { ...show, coverUrl, galleryUrls };
}

// ── Queries ───────────────────────────────────────────────

export const listUpcoming = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const allShows = await ctx.db.query("shows").collect();
    const upcoming = allShows.filter(s => (s.date || "") >= today);
    upcoming.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return Promise.all(upcoming.map((s: any) => resolveShowUrls(ctx, { ...s, isPast: false })));
  },
});

export const listPast = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const allShows = await ctx.db.query("shows").collect();
    const past = allShows.filter(s => (s.date || "") < today);
    past.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return Promise.all(past.map((s: any) => resolveShowUrls(ctx, { ...s, isPast: true })));
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const shows = await ctx.db.query("shows").order("desc").collect();
    const processed = shows.map(s => ({ ...s, isPast: (s.date || "") < today }));
    return Promise.all(processed.map((s: any) => resolveShowUrls(ctx, s)));
  },
});

export const getById = query({
  args: { id: v.id("shows") },
  handler: async (ctx, { id }) => {
    const show = await ctx.db.get(id);
    if (!show) return null;
    return resolveShowUrls(ctx, show);
  },
});

// ── Mutations ─────────────────────────────────────────────

const showArgs = {
  date: v.optional(v.string()),
  time: v.optional(v.string()),
  day: v.optional(v.string()),
  month: v.optional(v.string()),
  year: v.optional(v.string()),
  sortDate: v.optional(v.string()),
  event: v.string(),
  venue: v.string(),
  city: v.string(),
  country: v.string(),
  type: v.string(),
  status: v.union(
    v.literal("tickets"),
    v.literal("rsvp"),
    v.literal("sold_out"),
    v.literal("details"),
  ),
  ticketUrl: v.optional(v.string()),
  isPast: v.boolean(),
  notes: v.optional(v.string()),
  coverStorageId: v.optional(v.id("_storage")),
  coverUrl: v.optional(v.string()),
  galleryStorageIds: v.optional(v.array(v.id("_storage"))),
};

export const create = mutation({
  args: showArgs,
  handler: async (ctx, args) => {
    return ctx.db.insert("shows", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: { id: v.id("shows"), ...showArgs },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, { ...args, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("shows") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// ── Seed helper (called from admin panel first time) ──────
export const seedInitialShows = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("shows").take(1);
    if (existing.length > 0) return { skipped: true };

    const upcoming = [
      { date: "2026-10-12", event: "Soul Live Project Arena", venue: "Soul Live Project Arena", city: "Ho Chi Minh City", country: "VN", type: "Personal", status: "tickets" as const, isPast: false },
      { date: "2026-11-04", event: "Hanoi International Music Festival", venue: "Hanoi Opera House", city: "Hanoi", country: "VN", type: "S.E Project", status: "rsvp" as const, isPast: false },
      { date: "2026-11-28", event: "Esplanade Presents — Southeast Asia Series", venue: "Esplanade Concert Hall", city: "Singapore", country: "SG", type: "Bluemato", status: "sold_out" as const, isPast: false },
      { date: "2027-01-17", event: "World Premiere — Between Silence II", venue: "Sydney Opera House", city: "Sydney", country: "AU", type: "Personal", status: "tickets" as const, isPast: false },
      { date: "2027-02-08", event: "Asia Contemporary Music Summit", venue: "Seoul Arts Centre", city: "Seoul", country: "KR", type: "S.E Project", status: "details" as const, isPast: false },
      { date: "2027-03-21", event: "Barbican International Residency", venue: "Barbican Centre", city: "London", country: "UK", type: "Personal", status: "tickets" as const, isPast: false },
      { date: "2027-04-05", event: "Carnegie Hall — Spring Series", venue: "Carnegie Hall", city: "New York", country: "US", type: "Bluemato", status: "tickets" as const, isPast: false },
    ];

    const past = [
      { date: "2025-09-14", event: "Hanoi Opera House — Season Opening", venue: "Hanoi Opera House", city: "Hanoi", country: "VN", type: "S.E Project", status: "details" as const, isPast: true },
      { date: "2025-07-22", event: "Esplanade Festival on the Bay", venue: "Esplanade Outdoor Theatre", city: "Singapore", country: "SG", type: "Bluemato", status: "details" as const, isPast: true },
      { date: "2025-05-03", event: "UNESCO — World Press Freedom Day Concert", venue: "UNESCO Headquarters", city: "Paris", country: "FR", type: "Personal", status: "details" as const, isPast: true },
      { date: "2025-03-18", event: "Sydney Opera House — Artist in Residence", venue: "Sydney Opera House", city: "Sydney", country: "AU", type: "Personal", status: "details" as const, isPast: true },
      { date: "2024-11-30", event: "Barbican — Asian Music Now", venue: "Barbican Centre", city: "London", country: "UK", type: "S.E Project", status: "details" as const, isPast: true },
      { date: "2024-08-12", event: "Salzburg Music Festival", venue: "Mozarteum", city: "Salzburg", country: "AT", type: "Personal", status: "details" as const, isPast: true },
    ];

    for (const s of [...upcoming, ...past]) {
      await ctx.db.insert("shows", { ...s, createdAt: Date.now(), updatedAt: Date.now() });
    }
    return { seeded: upcoming.length + past.length };
  },
});

