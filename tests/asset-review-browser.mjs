import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {launchBrowser} from '../tools/assets/browser.mjs';
const browser = await launchBrowser();
const checks = [], errors = [];
try {
  const page = await browser.newPage({viewport: {width: 1360, height: 900}});
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => {if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('http://127.0.0.1:5173/review.html');
  await page.waitForFunction(() => document.querySelectorAll('.model').length === 7);
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth === 1080));
  checks.push('Seven model cards and seven full-resolution PNGs loaded');
  assert.match(await page.locator('aside').innerText(), /not final art/);
  checks.push('Prototype/non-final disclosure visible');
  assert.equal(await page.locator('a[download]').count(), 15);
  for (const link of await page.locator('a[download]').evaluateAll(els => els.map(e => e.href))) {
    const response = await page.request.get(link); assert.equal(response.status(), 200); await response.dispose();
  }
  checks.push('All 15 model, PNG and manifest downloads respond successfully');
  await page.screenshot({path: 'docs/evidence/batch-02/review-desktop.png', fullPage: true});
  await page.setViewportSize({width: 390, height: 844});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  checks.push('390px mobile layout has no horizontal overflow');
  await page.goto('http://127.0.0.1:5173/?qa&quality=low');
  await page.waitForFunction(() => window.__combatReady, {timeout: 90000});
  await page.evaluate(() => window.__combat.freeze());
  await page.evaluate(async () => {
    await window.__combat.inspectAsset('SM_FieldGenerator_01');
    await window.__combat.inspectAsset('L_PuertoChico_Combat');
  });
  const state = await page.evaluate(() => window.__combat.inspectionState());
  assert.equal(state.visible, true, 'World clone must not inherit hidden cached-world visibility');
  checks.push('World stays visible when selected after a prop (hidden-clone regression)');
  const sandFraction = await page.evaluate(async () => {
    const image = new Image(); image.src = window.__combat.capture(); await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = 100; canvas.height = 100;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0, 100, 100);
    const pixels = ctx.getImageData(0, 0, 100, 100).data; let sand = 0;
    for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > pixels[i+1] * 1.04 && pixels[i+1] > pixels[i+2] * 1.1) sand++;
    return sand / 10000;
  });
  assert.ok(sandFraction > .05, `Expected visible warm land/props, not a water-only frame: ${sandFraction}`);
  checks.push('Captured world contains visible land/props, not only water');
  assert.deepEqual(errors, []);
  checks.push('No page errors or HTTP failures');
  await fs.writeFile('docs/evidence/batch-02/browser-review.json', JSON.stringify({passed:true, checks, sandFraction, scope:'Browser review UI and world-capture regression only; not Unreal/Art Lock/Windows performance'}, null, 2)+'\n');
  console.log(JSON.stringify({passed:true, checks, sandFraction}, null, 2));
} finally {await browser.close();}
