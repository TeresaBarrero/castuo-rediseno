import { chromium } from 'playwright';
const url = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, deviceScaleFactor: 1.75 });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await b.startTracing(p, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink', 'v8', 'loading', 'toplevel'] });
await p.goto(url, { waitUntil: 'load' });
await p.waitForTimeout(3000);
const buf = await b.stopTracing();
const ev = JSON.parse(buf.toString()).traceEvents;
const main = ev.filter((e) => e.name === 'RunTask' && e.dur > 50000).sort((a, c) => c.dur - a.dur).slice(0, 3);
for (const t of main) {
  const kids = ev.filter((e) => e.tid === t.tid && e.pid === t.pid && e.ts >= t.ts && e.ts + (e.dur || 0) <= t.ts + t.dur && e.dur > 5000 && e.name !== 'RunTask');
  const agg = {};
  for (const k of kids) agg[k.name] = (agg[k.name] || 0) + k.dur / 1000;
  console.log('TASK', Math.round(t.dur / 1000), 'ms', JSON.stringify(Object.entries(agg).sort((a, c) => c[1] - a[1]).slice(0, 12).map(([n, d]) => [n, Math.round(d)])));
}
await b.close();
