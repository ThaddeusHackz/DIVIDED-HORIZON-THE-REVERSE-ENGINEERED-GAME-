#!/usr/bin/env python3
"""Compile only the engine-independent headers. This is NOT an Unreal build."""
from pathlib import Path
import json
import subprocess
import shutil

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / '.cache/native-tests'
OUT.mkdir(parents=True, exist_ok=True)
compiler = shutil.which('g++') or shutil.which('clang++')
if not compiler:
    raise SystemExit('Install a C++20 compiler for portable native-rule tests.')
mesh = ROOT / 'native/DividedHorizon/Content/PrototypeData/world.dhmesh'
if not mesh.exists():
    raise SystemExit('Run npm run native:export first.')
command = [compiler, '-std=c++20', '-Wall', '-Wextra', '-Werror', '-pedantic',
           '-I', str(ROOT / 'native/DividedHorizon/Source/DividedHorizon/Public'),
           str(ROOT / 'tests/native-rules.cpp'), '-o', str(OUT / 'native-rules')]
subprocess.run(command, cwd=ROOT, check=True)
result = subprocess.run([str(OUT / 'native-rules'), str(mesh)], cwd=ROOT, check=True, text=True, capture_output=True)
print(result.stdout)
evidence = ROOT / 'docs/evidence/native-foundation'
evidence.mkdir(parents=True, exist_ok=True)
(evidence / 'portable-cpp-tests.json').write_text(json.dumps({
    'passed': True, 'scope': 'Only engine-independent C++ headers; NOT the Unreal module',
    'compiler': compiler, 'command': command, 'output': result.stdout,
    'unrealCompiled': False, 'windowsPackaged': False, 'windowsLaunchTested': False
}, indent=2) + '\n')
