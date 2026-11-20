import fs from 'node:fs/promises';
const RAW = 'scripts/.crawl';
const files = (await fs.readdir(RAW)).filter((f) => f.includes('%2Ftienda%2F') && f.split('%2F').length > 6);
const dec = (s) => s.replace(/&#8364;|&euro;/g, '€').replace(/&nbsp;/g, ' ').replace(/&#215;/g, '×').replace(/&#8211;/g, '–').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&quot;/g, '"');
const out = [];
for (const f of files) {
  const h = await fs.readFile(`${RAW}/${f}`, 'utf8');
  const url = decodeURIComponent(f.slice(0, -5));
  const title = dec(h.match(/<h1[^>]*product_title[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.trim() ?? '');
  const priceBlock = h.match(/<p class="price">([\s\S]*?)<\/p>/)?.[1] ?? '';
  const prices = [...priceBlock.matchAll(/<bdi>([\d.,]+)/g)].map((m) => m[1]);
  const stock = /out-of-stock|Sin existencias|Agotado/i.test(h.match(/<div[^>]*class="[^"]*product[^"]*"[\s\S]{0,4000}/)?.[0] ?? '') ? 'AGOTADO' : '';
  const short = dec((h.match(/woocommerce-product-details__short-description">([\s\S]*?)<\/div>/)?.[1] ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  const desc = dec((h.match(/id="tab-description"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  const vj = h.match(/data-product_variations="([^"]+)"/)?.[1];
  let vars = [];
  if (vj) { try { vars = JSON.parse(dec(vj)).map((v) => ({ attrs: Object.values(v.attributes).join(' / '), price: v.display_price, stock: v.is_in_stock, img: v.image?.full_src?.split('/').pop() })); } catch (e) { vars = ['parse error']; } }
  const imgs = [...new Set([...h.matchAll(/data-large_image="([^"]+)"/g)].map((m) => m[1].split('/').pop()))];
  const stockTxt = h.match(/<p class="stock[^"]*">([^<]*)/)?.[1] ?? '';
  out.push({ url: url.replace('https://castuo.es', ''), title, prices, stockTxt, short, desc: desc.slice(0, 600), vars, imgs });
}
console.log(JSON.stringify(out, null, 1));
