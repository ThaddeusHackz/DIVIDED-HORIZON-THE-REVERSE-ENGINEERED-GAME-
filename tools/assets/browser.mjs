import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import bundledChromium from '@sparticuz/chromium';

export async function launchBrowser(){
 if(process.env.CHROMIUM_PATH)return chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
 if(process.platform!=='linux')return chromium.launch({headless:true});
 const executablePath=await bundledChromium.executablePath();
 const env={...process.env};
 // Minimal Linux images may lack NSS. The pinned Chromium package ships those
 // libraries: use its own local archive, without downloading OS packages.
 const deps=execFileSync('ldd',[executablePath],{encoding:'utf8'});
 if(deps.includes('libnspr4.so => not found')||deps.includes('libnss3.so => not found')){
  const dir=path.resolve('.cache/chromium-libs');await fs.mkdir(dir,{recursive:true});
  const archive=await fs.readFile('node_modules/@sparticuz/chromium/bin/al2023.tar.br');
  await fs.writeFile(`${dir}/libs.tar`,zlib.brotliDecompressSync(archive));
  execFileSync('tar',['-xf',`${dir}/libs.tar`,'-C',dir]);
  env.LD_LIBRARY_PATH=`${dir}/lib${env.LD_LIBRARY_PATH?':'+env.LD_LIBRARY_PATH:''}`;
 }
 return chromium.launch({executablePath,headless:true,env,args:bundledChromium.args.filter(x=>!['--disable-web-security','--allow-running-insecure-content'].includes(x))});
}
