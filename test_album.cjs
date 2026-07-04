const fs = require('fs');

async function test() {
  const res = await fetch('https://nguyennhatminh.bandcamp.com/album/memories');
  const html = await res.text();
  
  const match = html.match(/data-tralbum="({.*?})"/);
  if (match) {
    const data = JSON.parse(match[1].replace(/&quot;/g, '"'));
    console.log("Album Title:", data.current.title);
    if (data.trackinfo) {
      console.log(`Tracks: ${data.trackinfo.length}`);
      data.trackinfo.forEach(t => console.log(` - ${t.title}: ${t.file ? 'has audio' : 'no audio'}`));
    }
  }
}

test();
