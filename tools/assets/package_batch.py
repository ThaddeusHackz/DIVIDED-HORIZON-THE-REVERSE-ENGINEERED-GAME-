#!/usr/bin/env python3
"""Package only the explicit Batch 01 delivery allowlist; never secrets or caches."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'artifacts'
OUT.mkdir(exist_ok=True)
ARCHIVE = OUT / 'DIVIDED_HORIZON_Batch_01.zip'
ASSETS = ROOT / 'prototype/public/assets/batch-01'
DIST = ROOT / 'prototype/dist'
assert (DIST / 'index.html').is_file(), 'Run npm run build before packaging.'
manifest = json.loads((ASSETS / 'manifest.json').read_text())
for asset in manifest['assets']:
    assert hashlib.sha256((ASSETS / asset['file']).read_bytes()).hexdigest() == asset['sha256']
    assert (ASSETS / asset['preview']).is_file()

paths = [ROOT / p for p in ['package.json', 'package-lock.json', '.gitignore', 'README.md']]
for directory in ['prototype/src', 'prototype/public', 'tools/assets', 'tests', 'docs']:
    paths.extend(p for p in (ROOT / directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
paths.extend([ROOT / 'prototype/index.html', ROOT / 'prototype/vite.config.js'])

start = '''DIVIDED HORIZON — BATCH 01 / PUERTO CHICO

THIS IS A PROTOTYPE ASSET KIT AND BROWSER EXPLORATION TEST, NOT A WINDOWS EXE.

Models and PNGs: prototype/public/assets/batch-01/
Start with: docs/ASSET_BATCH_01.md
Unreal import and native-build requirements: docs/UNREAL_HANDOFF.md
Checks and limitations: docs/reports/BATCH_01.md

RUN THE PREBUILT BROWSER PREVIEW (Python 3 required):
  cd Web-Preview
  python -m http.server 8080
  Open http://localhost:8080 in your browser.
On Windows, use py -m http.server 8080 if python is not on PATH.
Do not double-click index.html: the model loader requires HTTP.
All runtime assets are local. No CDN, account, API key or generation credits.

EDIT OR REBUILD FROM SOURCE (Node.js 22.12+):
  npm ci
  npm run dev

Desktop controls: WASD move, Shift sprint, E interact, mouse drag to look,
arrow keys turn/look, Escape pause. Collect the manifest, inspect the hut
ledger, restore the mast signal, then return to the end of the jetty.

These assets are original AI-assisted procedural geometry, NOT Tripo output.
They are untextured prototypes, NOT final photoreal assets.
Keep docs/licenses/ and Web-Preview/THIRD_PARTY_LICENSES.txt with distributions.
'''

with zipfile.ZipFile(ARCHIVE, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    z.writestr('START_HERE.txt', start)
    for p in sorted(set(paths)):
        z.write(p, p.relative_to(ROOT).as_posix())
    for p in sorted(DIST.rglob('*')):
        if p.is_file():
            z.write(p, 'Web-Preview/' + p.relative_to(DIST).as_posix())
    z.write(ROOT / 'docs/licenses/three-MIT.txt', 'Web-Preview/THIRD_PARTY_LICENSES.txt')
with zipfile.ZipFile(ARCHIVE) as z:
    assert z.testzip() is None
    assert not any('/node_modules/' in n or '/.git/' in n for n in z.namelist())
size = ARCHIVE.stat().st_size
assert size <= 100 * 1024 * 1024, 'Drive attachment exceeds the 100 MiB tool limit.'
digest = hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()
(OUT / (ARCHIVE.name + '.sha256')).write_text(f'{digest}  {ARCHIVE.name}\n')
print(f'{ARCHIVE.name}: {size:,} bytes; ZIP CRC checks passed')
print(f'SHA-256: {digest}')
