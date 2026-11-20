import fs from 'node:fs/promises';
const RAW = 'scripts/.crawl';
const pages = process.argv.slice(2);
for (const p of pages) {
  const f = `${RAW}/${encodeURIComponent('https://castuo.es' + p)}.html`;
  let h; try { h = await fs.readFile(f, 'utf8'); } catch { console.log('## (no) ', p); continue; }
  h = h.replace(/<(script|style|noscript|header|footer|nav)[\s\S]*?<\/\1>/gi, ' ');
  const main = h.match(/<(main|article)[\s\S]*<\/\1>/i)?.[0] ?? h;
  const t = main.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|h\d|li|div|tr)>/gi, '\n').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&#8211;/g, '–').replace(/&#8220;|&#8221;/g, '"').replace(/&#8217;/g, "'").replace(/&euro;|&#8364;/g, '€').replace(/&amp;/g, '&')
    .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter((l) => l.length > 2).join('\n');
  console.log(`\n## ${p}\n${t.slice(0, 3500)}`);
}
