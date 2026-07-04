import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const CONVEX_URL = "https://qualified-ibis-738.convex.cloud";
const convex = new ConvexHttpClient(CONVEX_URL);
const BANDCAMP_URL = "https://nguyennhatminh.bandcamp.com";

// Simple HTML entity decoder
function decodeHTMLEntities(text) {
  if (!text) return text;
  return text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

async function main() {
  console.log("Fetching existing media items...");
  const items = await convex.query(api.media.listAll);
  
  console.log("Fetching Bandcamp index to map URLs...");
  const res = await fetch(`${BANDCAMP_URL}/music`);
  const html = await res.text();
  
  const regex = /<a href="(\/album\/[^"]+|\/track\/[^"]+)">/g;
  const matches = [...html.matchAll(regex)];
  let links = [...new Set(matches.map(m => m[1]))];
  
  const bandcampData = {};
  console.log(`Found ${links.length} bandcamp links. Fetching titles to map...`);
  
  // We fetch each page to get the exact title
  for (const link of links) {
    const fullUrl = `${BANDCAMP_URL}${link}`;
    try {
      const pageRes = await fetch(fullUrl);
      const pageHtml = await pageRes.text();
      const match = pageHtml.match(/data-tralbum="({.*?})"/);
      if (match) {
        const data = JSON.parse(match[1].replace(/&quot;/g, '"'));
        const title = data.current.title;
        bandcampData[title] = fullUrl;
      }
    } catch (e) {
      console.log(`Failed to fetch ${fullUrl}`);
    }
  }

  console.log("Patching items in Convex...");
  for (const item of items) {
    let needsUpdate = false;
    let newTitle = decodeHTMLEntities(item.title);
    let newDesc = decodeHTMLEntities(item.description);
    let newProjectUrl = item.projectUrl;

    if (newTitle !== item.title || newDesc !== item.description) {
      needsUpdate = true;
    }

    // Check if this item exists in our bandcampData
    // We try matching the raw title and the decoded title
    const matchedUrl = bandcampData[item.title] || bandcampData[newTitle];
    if (matchedUrl && !item.projectUrl) {
      newProjectUrl = matchedUrl;
      needsUpdate = true;
    }

    if (needsUpdate) {
      console.log(`Updating: ${item.title}`);
      if (newTitle !== item.title) console.log(`  Title: ${item.title} -> ${newTitle}`);
      if (newProjectUrl !== item.projectUrl) console.log(`  URL: ${newProjectUrl}`);
      
      await convex.mutation(api.media.update, {
        id: item._id,
        title: newTitle,
        description: newDesc,
        tag: item.tag,
        year: item.year,
        hasPlay: item.hasPlay,
        isPublished: item.isPublished,
        isFeatured: item.isFeatured,
        order: item.order,
        coverStorageId: item.coverStorageId,
        coverUrl: item.coverUrl,
        videoUrl: item.videoUrl,
        projectUrl: newProjectUrl,
        audioStorageId: item.audioStorageId,
        audioFilename: item.audioFilename,
        galleryStorageIds: item.galleryStorageIds,
      });
    }
  }
  
  console.log("Done patching data!");
}

main().catch(console.error);
