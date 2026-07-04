const fs = require('fs');
const html = fs.readFileSync('bc.html', 'utf8');

// The music page contains a list of albums/tracks
const regex = /<a href="(\/album\/[^"]+|\/track\/[^"]+)">/g;
const matches = [...html.matchAll(regex)];
console.log(matches.map(m => m[1]));
