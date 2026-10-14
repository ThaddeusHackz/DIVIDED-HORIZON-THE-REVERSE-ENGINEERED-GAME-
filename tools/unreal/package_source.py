#!/usr/bin/env python3
"""Bundle the native source foundation plus deterministic inputs; never imply an exe."""
from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'artifacts'
OUT.mkdir(exist_ok=True)
ARCHIVE = OUT / 'DIVIDED_HORIZON_Native_Foundation_Source.zip'
mesh = ROOT / 'native/DividedHorizon/Content/PrototypeData/world.dhmesh'
receipt = json.loads((ROOT / 'docs/evidence/native-foundation/export.json').read_text())
assert hashlib.sha256(mesh.read_bytes()).hexdigest() == receipt['outputSha256'], 'Regenerate native data before packaging'

files = [ROOT / p for p in ['package.json', 'package-lock.json', 'README.md', '.gitignore']]
# Explicit subtrees only; no credentials, caches, binaries, generated editor packages or vendor code.
for directory in ['native/DividedHorizon/Source', 'native/DividedHorizon/Config',
                  'native/DividedHorizon/Content/PrototypeData', 'tools/assets', 'tools/unreal',
                  'prototype/src', 'prototype/public', 'tests', 'docs', '.github/workflows']:
    files.extend(p for p in (ROOT / directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix != '.pyc')
files.extend([ROOT / 'native/DividedHorizon/DividedHorizon.uproject', ROOT / 'prototype/index.html', ROOT / 'prototype/vite.config.js'])
start = '''DIVIDED HORIZON — NATIVE UNREAL FOUNDATION / SOURCE ONLY

NO WINDOWS EXE IS INCLUDED. THE UNREAL MODULE HAS NOT BEEN COMPILED HERE.

Read docs/NATIVE_PROTOTYPE.md first. The .uproject alone is not a cooked game.

On an authorized Windows UE 5.6 build machine, from this extracted root:
  npm ci
  .\\tools\\unreal\\build.ps1 -EngineRoot 'C:\\Program Files\\Epic Games\\UE_5.6' -PrepareOnly

If compilation and preparation succeed, playtest in the Editor. Then run the
same command without -PrepareOnly to attempt a complete Win64 package.
All Unreal acceptance checks are pending until that build/test is performed.

Included: C++ project, original source GLBs/PNGs, generated native mesh data,
mission conversion, material/map creation, packaging script, test source,
portable-test evidence, notices, and an optional owner-provisioned CI recipe.
The owner must acquire Unreal, accept its terms, and provision Windows/tools.
No Epic credentials, external models, purchased content or service credits
are required by this archive's original asset generation code.

The browser prototype is still available: npm ci, then npm run dev.
Its screenshots are browser renders, NOT Unreal evidence.
'''
with zipfile.ZipFile(ARCHIVE, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    z.writestr('START_HERE_NATIVE_SOURCE_ONLY.txt', start)
    for p in sorted(set(files)):
        z.write(p, p.relative_to(ROOT).as_posix())
with zipfile.ZipFile(ARCHIVE) as z:
    assert z.testzip() is None
    assert not any(n.endswith('.exe') or '/node_modules/' in n or '/.git/' in n for n in z.namelist())
assert ARCHIVE.stat().st_size < 100 * 1024 * 1024
sha = hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()
(OUT / (ARCHIVE.name + '.sha256')).write_text(f'{sha}  {ARCHIVE.name}\n')
print(f'{ARCHIVE.name}: {ARCHIVE.stat().st_size:,} bytes; ZIP verified; SOURCE ONLY')
print(f'SHA-256: {sha}')
