const fs = require('fs');
async function test() {
  const res = await fetch('https://nguyennhatminh.bandcamp.com/track/infrared');
  const html = await res.text();
  const match = html.match(/data-tralbum="({.*?})"/);
  if (match) {
    const data = JSON.parse(match[1].replace(/&quot;/g, '"'));
    console.log(Object.keys(data));
    console.log("item_type:", data.item_type);
    console.log("type:", data.current.type);
    
    // Bandcamp also has tags inside <a class="tag"> 
  }
  const tagsMatch = [...html.matchAll(/<a class="tag"[^>]*>([^<]+)<\/a>/g)];
  console.log("Tags:", tagsMatch.map(m => m[1]));
}
test();
