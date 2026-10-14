import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import validator from 'gltf-validator';
const dir='prototype/public/assets/batch-01';
const manifest=JSON.parse(await fs.readFile(`${dir}/manifest.json`));
const report={scope:'GLB structural validation only; not an art, UE5, collision or performance certification',validator:'Khronos gltf-validator 2.0.0-dev.3.10',assets:[]};
let errors=0;
for(const item of manifest.assets){
 const bytes=await fs.readFile(`${dir}/${item.file}`);
 assert.equal(bytes.length,item.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256);
 assert(item.triangles>0);assert(item.boundsMeters.every(x=>Number.isFinite(x)&&x>0));
 const result=await validator.validateBytes(new Uint8Array(bytes),{uri:item.file,maxIssues:30});
 errors+=result.issues.numErrors;
 report.assets.push({id:item.id,errors:result.issues.numErrors,warnings:result.issues.numWarnings,infos:result.issues.numInfos,messages:result.issues.messages,triangles:item.triangles,sha256:item.sha256});
 console.log(`${item.id}: ${result.issues.numErrors} errors, ${result.issues.numWarnings} warnings`);
}
report.passed=errors===0;
await fs.mkdir('docs/evidence/batch-01',{recursive:true});
await fs.writeFile('docs/evidence/batch-01/validation.json',JSON.stringify(report,null,2)+'\n');
assert.equal(errors,0,'Invalid glTF assets');
