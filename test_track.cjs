const fs = require('fs');

async function test() {
  const res = await fetch('https://nguyennhatminh.bandcamp.com/track/infrared');
  const html = await res.text();
  
  // Extract data-tralbum
  const match = html.match(/data-tralbum="({.*?})"/);
  if (match) {
    const data = JSON.parse(match[1].replace(/&quot;/g, '"'));
    console.log("Title:", data.current.title);
    console.log("Release date:", data.current.release_date);
    console.log("Art ID:", data.art_id);
    if (data.trackinfo && data.trackinfo[0]) {
      console.log("Audio URL:", data.trackinfo[0].file['mp3-128']);
    }
  } else {
    console.log("No data-tralbum found");
  }
  
  // Extract description (usually in <div class="tralbumData tralbum-about">)
  const descMatch = html.match(/<div class="tralbumData tralbum-about">([\s\S]*?)<\/div>/);
  if (descMatch) {
    console.log("Description:", descMatch[1].replace(/<[^>]+>/g, '').trim());
  } else {
    console.log("No description");
  }
}

test();
