import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
const url = process.argv[2];
const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] });
const res = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] });
const ev = res.artifacts.Trace.traceEvents;
const tasks = ev.filter((e) => (e.name === 'RunTask' || e.name === 'ThreadControllerImpl::RunTask') && e.dur > 100000).sort((a, b) => b.dur - a.dur).slice(0, 3);
for (const t of tasks) {
  const kids = ev.filter((e) => e.tid === t.tid && e.pid === t.pid && e.ts >= t.ts && e.ts < t.ts + t.dur && (e.dur || 0) > 3000 && e !== t);
  const agg = {};
  for (const k of kids) agg[k.name] = Math.max(agg[k.name] || 0, k.dur / 1000);
  const tname = ev.find((e) => e.name === 'thread_name' && e.tid === t.tid && e.pid === t.pid)?.args?.name;
  console.log('TASK', Math.round(t.dur / 1000), 'ms', tname, JSON.stringify(Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([n, d]) => [n, Math.round(d)])));
}
await chrome.kill();
