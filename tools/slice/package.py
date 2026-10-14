#!/usr/bin/env python3
"""Package the complete playable Windows slice and a separate source handoff."""
from pathlib import Path
import argparse,hashlib,json,shutil,zipfile
root=Path(__file__).resolve().parents[2];out=root/'artifacts';folder=out/'DividedHorizon-Windows-Slice'
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source-only',action='store_true',help='Package source without requiring a staged Windows binary')
args=parser.parse_args()
out.mkdir(parents=True,exist_ok=True)
packages=[]
if not args.source_only:
 exe=folder/'DividedHorizon-Slice.exe'
 assert exe.is_file(),'Run npm run slice:windows first.'
 assert exe.read_bytes()[:2]==b'MZ','Missing Windows PE signature'
 receipt=json.loads((folder/'BUILD_STATUS.json').read_text())
 assert hashlib.sha256(exe.read_bytes()).hexdigest()==receipt['sha256'],'Executable changed since verification'
 shutil.copy2(root/'docs/COMBAT_SLICE.md',folder/'README_START_HERE.txt')
 shot=root/'docs/evidence/combat-slice/gameplay-browser.png'
 if shot.is_file():shutil.copy2(shot,folder/'BROWSER_PREVIEW_NOT_WINDOWS_SCREENSHOT.png')
 checks=[]
 for p in sorted(folder.rglob('*')):
  if p.is_file() and p.name!='SHA256SUMS.txt':checks.append(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(folder).as_posix())
 (folder/'SHA256SUMS.txt').write_text('\n'.join(checks)+'\n')
 windows=out/'DIVIDED_HORIZON_Windows_Combat_Slice_0.3.zip'
 with zipfile.ZipFile(windows,'w',zipfile.ZIP_DEFLATED,compresslevel=9)as z:
  for p in sorted(folder.rglob('*')):
   if p.is_file():z.write(p,p.relative_to(folder).as_posix())
 packages.append(windows)
source=out/'DIVIDED_HORIZON_Combat_Slice_0.3_Source.zip'
files=[root/p for p in ['README.md','MASTER_PROMPT.md','package.json','package-lock.json','.gitignore','native/DividedHorizon/DividedHorizon.uproject','prototype/index.html','prototype/asset-lab.html','prototype/review.html','prototype/vite.config.js','prototype/public/slice-core.wasm']]
files.extend(root.glob('*.md'))  # Include owner-uploaded v3 brief, never regenerate it.
for directory in ['slice/src','slice/generated','tools','tests','docs','prompt_src','native/DividedHorizon/Source','native/DividedHorizon/Config','prototype/src','prototype/public/assets','.github']:
 files.extend(p for p in (root/directory).rglob('*')if p.is_file() and '__pycache__' not in p.parts and p.suffix!='.pyc' and p.name not in {'env.json','.env'} and not p.is_symlink())
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED,compresslevel=9)as z:
 z.writestr('START_HERE.txt','Read START_HERE_v3.md for the current production order, docs/ASSET_BATCH_02.md for review, and docs/COMBAT_SLICE.md for the playable prototype. This is the source handoff, NOT the runnable Windows package. The Windows ZIP is supplied separately. Unreal source remains uncompiled; the raylib fallback is the compiled executable.\n')
 for p in sorted(set(files)):
  if p.is_file() and not p.is_symlink():z.write(p,p.relative_to(root).as_posix())
packages.append(source)
report=[]
for archive in packages:
 with zipfile.ZipFile(archive)as z:assert z.testzip()is None
 assert archive.stat().st_size<100*1024*1024
 digest=hashlib.sha256(archive.read_bytes()).hexdigest();archive.with_name(archive.name+'.sha256').write_text(digest+'  '+archive.name+'\n')
 record={'file':archive.name,'bytes':archive.stat().st_size,'sha256':digest,'md5':hashlib.md5(archive.read_bytes()).hexdigest()};report.append(record);print(json.dumps(record))
(root/('docs/evidence/combat-slice/source-package.json' if args.source_only else 'docs/evidence/combat-slice/packages.json')).write_text(json.dumps(report,indent=2)+'\n')
