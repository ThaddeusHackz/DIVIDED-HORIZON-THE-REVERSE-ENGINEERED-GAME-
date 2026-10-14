import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import validator from 'gltf-validator';

const dir = 'prototype/public/assets/batch-02';
const manifest = JSON.parse(await fs.readFile(`${dir}/manifest.json`));
const report = {
  scope: 'GLB structure, manifest integrity and PNG presence; NOT topology/UV quality, Nanite, rigging, Art Lock or UE certification',
  validator: 'Khronos gltf-validator 2.0.0-dev.3.10',
  productionReady: false,
  assets: [],
};
let errors = 0;
for (const asset of manifest.assets) {
  assert.match(asset.file, /^[A-Za-z0-9_]+\.glb$/);
  assert.match(asset.preview, /^previews\/[A-Za-z0-9_]+\.png$/);
  const bytes = await fs.readFile(`${dir}/${asset.file}`);
  assert.equal(bytes.length, asset.bytes);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), asset.sha256);
  assert.equal(asset.prototype, true, 'Current assets must remain marked as placeholders');
  const result = await validator.validateBytes(new Uint8Array(bytes), {uri: asset.file, maxIssues: 30});
  errors += result.issues.numErrors;
  const preview = await fs.readFile(`${dir}/${asset.preview}`);
  assert.equal(preview.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(preview.readUInt32BE(16), 1080);
  assert.equal(preview.readUInt32BE(20), 800);
  const gltf = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  const primitives = gltf.meshes.flatMap(mesh => mesh.primitives);
  report.assets.push({
    id: asset.id, sha256: asset.sha256, triangles: asset.triangles,
    errors: result.issues.numErrors, warnings: result.issues.numWarnings,
    messages: result.issues.messages, previewSha256: crypto.createHash('sha256').update(preview).digest('hex'),
    primitiveCount: primitives.length,
    primitivesWithUVs: primitives.filter(p => p.attributes.TEXCOORD_0 !== undefined).length,
    skins: (gltf.skins || []).length, animations: (gltf.animations || []).length,
    productionReady: false,
  });
  console.log(`${asset.id}: ${result.issues.numErrors} errors, ${result.issues.numWarnings} warnings`);
}
report.passed = errors === 0;
await fs.mkdir('docs/evidence/batch-02', {recursive: true});
await fs.writeFile('docs/evidence/batch-02/validation.json', JSON.stringify(report, null, 2) + '\n');
assert.equal(errors, 0, 'Invalid GLB');
