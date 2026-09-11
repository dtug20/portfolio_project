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

// One source of truth for static public routes. Do not invent modification dates.
const origin = 'https://nguyenminh.asia';
const urls = Object.keys(pages).map(path => origin + path);
await writeFile(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(new URL('sitemap_index.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${origin}/sitemap.xml</loc></sitemap></sitemapindex>\n`);
await writeFile(new URL('sitemap.txt', dist), urls.join('\n') + '\n');
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(new URL('404.html', dist), '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Không tìm thấy trang | Nguyễn Nhật Minh</title></head><body><main><h1>Không tìm thấy trang</h1><p>Đường dẫn này không tồn tại.</p><a href="/">Về trang chủ</a></main></body></html>');
