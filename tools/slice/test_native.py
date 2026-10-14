#!/usr/bin/env python3
from pathlib import Path
import shutil,subprocess
root=Path(__file__).resolve().parents[2]
compiler=shutil.which('gcc') or shutil.which('clang')
if not compiler:raise SystemExit('A C compiler is required for the Linux native-core replay check.')
(root/'.cache').mkdir(exist_ok=True)
subprocess.run([compiler,'-std=c11','-O2','-Wall','-Wextra','-Werror','-Islice/src','slice/src/core.c','tests/slice-native.c','-lm','-o','.cache/slice-native-test'],cwd=root,check=True)
result=subprocess.run(['.cache/slice-native-test','docs/evidence/combat-slice/playthrough-inputs.bin'],cwd=root,check=True,capture_output=True,text=True)
(root/'docs/evidence/combat-slice/native-c-replay.txt').write_text(result.stdout)
print(result.stdout)
