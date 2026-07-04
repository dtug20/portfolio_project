import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import sharp from "sharp";

const CONVEX_URL = "https://qualified-ibis-738.convex.cloud";
const convex = new ConvexHttpClient(CONVEX_URL);
const BANDCAMP_URL = "https://nguyennhatminh.bandcamp.com";

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToConvex(buffer, contentType) {
  const uploadUrl = await convex.mutation(api.media.generateUploadUrl);
  const result = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: buffer,
  });
  if (!result.ok) throw new Error("Failed to upload to Convex");
  const json = await result.json();
  return json.storageId;
}

async function main() {
  console.log("Fetching Bandcamp index...");
  const res = await fetch(`${BANDCAMP_URL}/music`);
  const html = await res.text();
  
  const regex = /<a href="(\/album\/[^"]+|\/track\/[^"]+)">/g;
  const matches = [...html.matchAll(regex)];
  let links = matches.map(m => m[1]);
  links = [...new Set(links)]; // Deduplicate
  console.log(`Found ${links.length} links to process.`);

  // Get current order
  const existing = await convex.query(api.media.listAll);
  let nextOrder = existing.length > 0 ? Math.max(...existing.map(e => e.order)) + 1 : 0;

  for (const link of links) {
    const fullUrl = `${BANDCAMP_URL}${link}`;
    console.log(`\nProcessing: ${fullUrl}`);
    try {
      const pageRes = await fetch(fullUrl);
      const pageHtml = await pageRes.text();
      
      const match = pageHtml.match(/data-tralbum="({.*?})"/);
      if (!match) {
        console.log("No data-tralbum found, skipping.");
        continue;
      }
      
      const data = JSON.parse(match[1].replace(/&quot;/g, '"'));
      const title = data.current.title;
      const releaseDate = data.current.release_date;
      const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : new Date().getFullYear().toString();
      const artId = data.art_id;
      const itemType = data.item_type; // 'track' or 'album'
      const tag = itemType === 'album' ? 'Digital Album' : 'Digital Track';
      
      // Get first track with audio
      let audioUrl = null;
      if (data.trackinfo && data.trackinfo.length > 0) {
        const playableTrack = data.trackinfo.find(t => t.file && t.file['mp3-128']);
        if (playableTrack) {
          audioUrl = playableTrack.file['mp3-128'].replace(/&amp;/g, '&');
        }
      }

      // Extract description
      let description = "";
      const descMatch = pageHtml.match(/<div class="tralbumData tralbum-about">([\s\S]*?)<\/div>/);
      if (descMatch) {
        // Strip HTML tags and clean up
        description = descMatch[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
      }

      // Check for duplicates
      if (existing.some(e => e.title === title)) {
        console.log(`- Skipping duplicate: ${title}`);
        continue;
      }

      console.log(`- Title: ${title}`);
      console.log(`- Tag: ${tag}`);
      console.log(`- Year: ${year}`);
      console.log(`- Has Audio: ${!!audioUrl}`);

      let coverStorageId = null;
      if (artId) {
        const imgUrl = `https://f4.bcbits.com/img/a${artId}_10.jpg`;
        console.log(`- Fetching cover image...`);
        const imgBuffer = await fetchBuffer(imgUrl);
        console.log(`- Converting image to WebP...`);
        const webpBuffer = await sharp(imgBuffer).webp({ quality: 85 }).toBuffer();
        console.log(`- Uploading WebP image to Convex...`);
        coverStorageId = await uploadToConvex(webpBuffer, "image/webp");
      }

      let audioStorageId = null;
      let audioFilename = null;
      if (audioUrl) {
        console.log(`- Fetching audio stream...`);
        const audioBuffer = await fetchBuffer(audioUrl);
        console.log(`- Uploading audio to Convex...`);
        audioStorageId = await uploadToConvex(audioBuffer, "audio/mpeg");
        audioFilename = `${title}.mp3`;
      }

      console.log(`- Saving to Convex database...`);
      await convex.mutation(api.media.create, {
        title: title,
        description: description,
        tag: tag,
        year: year,
        hasPlay: !!audioStorageId,
        isPublished: true,
        isFeatured: false,
        order: nextOrder++,
        coverStorageId: coverStorageId || undefined,
        audioStorageId: audioStorageId || undefined,
        audioFilename: audioFilename || undefined,
      });

      console.log(`✓ Successfully imported: ${title}`);
    } catch (e) {
      console.error(`X Failed to process ${link}:`, e.message);
    }
  }
  
  console.log("\nDone crawling Bandcamp data!");
}

main().catch(console.error);
