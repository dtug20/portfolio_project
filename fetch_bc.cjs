const fs = require('fs');
fetch('https://nguyennhatminh.bandcamp.com/music')
  .then(res => res.text())
  .then(text => {
    fs.writeFileSync('bc.html', text);
    console.log('Saved to bc.html');
  });
