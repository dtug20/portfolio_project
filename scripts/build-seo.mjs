import { readFile, writeFile, mkdir } from 'node:fs/promises';
const pages = JSON.parse(await readFile(new URL('../src/seo/pages.json', import.meta.url), 'utf8'));
const dist = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const [path, page] of Object.entries(pages)) {
  const url = `https://nguyenminh.asia${path}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)}</title>`);
  for (const key of ['title', 'description', 'og:title', 'og:description', 'og:url', 'twitter:title', 'twitter:description', 'twitter:url']) {
    const value = key.endsWith('url') ? url : key.endsWith('title') ? page.title : page.description;
    html = html.replace(new RegExp(`(<meta (?:name|property)="${key}"\\s+content=")[^"]*("\\s*/?>)`), (_, a, b) => a + escape(value) + b);
  }
  html = html.replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`);
  if (path !== '/') {
    // Do not serve the homepage's fallback copy as the content of every route.
    const links = Object.entries(pages).map(([href, data]) => `<a href="${href}">${escape(data.title)}</a>`).join(' | ');
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root"><main><h1>${escape(page.title)}</h1><p>${escape(page.description)}</p><nav>${links}</nav></main></div>`);
    await mkdir(new URL(`.${path}/`, dist), { recursive: true });
  }
  await writeFile(new URL(path === '/' ? 'index.html' : `.${path}/index.html`, dist), html);
}
console.log(`Generated metadata for ${Object.keys(pages).length} public pages.`);
