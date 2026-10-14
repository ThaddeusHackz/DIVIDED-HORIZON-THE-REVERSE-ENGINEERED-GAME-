#!/usr/bin/env python3
"""Cross-compile the standalone fallback slice. A successful build is NOT a Windows launch test."""
from pathlib import Path
import subprocess,shutil,json,hashlib
root=Path(__file__).resolve().parents[2]
zig=root/'.cache/toolchains/node_modules/@oven/zig-linux-x64/zig'
raylib=root/'.cache/vendor/raylib-5.5/src'
if not zig.is_file() or not raylib.is_dir():raise SystemExit('Run python3 tools/slice/setup_toolchain.py first.')
out=root/'artifacts/DividedHorizon-Windows-Slice'
out.mkdir(parents=True,exist_ok=True)
units=[str(raylib/(name+'.c')) for name in ['rcore','rshapes','rtextures','rtext','rmodels','raudio','utils','rglfw']]
exe=out/'DividedHorizon-Slice.exe'
cmd=[str(zig),'cc','-target','x86_64-windows-gnu','-O2','-s','-DPLATFORM_DESKTOP','-DGRAPHICS_API_OPENGL_33',f'-I{raylib}',f'-I{raylib}/external/glfw/include','slice/src/desktop.c','slice/src/core.c',*units,'-o',str(exe),'-lopengl32','-lgdi32','-lwinmm','-luser32','-lshell32','-Wl,--subsystem,windows']
subprocess.run(cmd,cwd=root,check=True)
assets=root/'prototype/public/assets/batch-02';(out/'assets').mkdir(exist_ok=True)
for p in assets.glob('*.glb'):shutil.copy2(p,out/'assets'/p.name)
shutil.copytree(assets/'audio',out/'assets/audio',dirs_exist_ok=True)
for name in ['manifest.json','combat.json']:shutil.copy2(assets/name,out/'assets'/name)
licenses=out/'licenses';licenses.mkdir(exist_ok=True)
shutil.copy2(root/'.cache/vendor/raylib-5.5/LICENSE',licenses/'raylib-LICENSE.txt')
for notice in ['zig-MIT.txt','mingw-COPYING.txt']:
 shutil.copy2(root/'docs/licenses'/notice,licenses/notice)
# Preserve unabridged embedded copyright/license notices in bundled dependency headers.
shutil.copytree(raylib/'external',licenses/'raylib-external-source-notices',dirs_exist_ok=True,
                ignore=shutil.ignore_patterns('*.png','*.jpg','*.ttf','*.ogg','*.wav'))
(out/'Run-Diagnostics.bat').write_text('@echo off\r\ncd /d "%~dp0"\r\nstart /wait "" "DividedHorizon-Slice.exe" --self-test\r\ntype self-test.txt\r\npause\r\n')
info=subprocess.check_output(['objdump','-p',str(exe)],text=True)
assert exe.read_bytes()[:2]==b'MZ'
dlls=[line.split('DLL Name:')[1].strip() for line in info.splitlines() if 'DLL Name:' in line]
allowed={'KERNEL32.dll','msvcrt.dll','USER32.dll','GDI32.dll','WINMM.dll','SHELL32.dll','OPENGL32.dll','ADVAPI32.dll','ole32.dll'}
assert all(d.lower() in {a.lower() for a in allowed} for d in dlls),f'Unexpected runtime DLL dependency: {dlls}'
evidence=root/'docs/evidence/combat-slice';evidence.mkdir(parents=True,exist_ok=True)
receipt={'status':'WINDOWS_X64_COMPILED_NOT_WINDOWS_LAUNCH_VERIFIED','engine':'raylib 5.5 fallback slice; NOT Unreal','target':'x86_64-windows-gnu / OpenGL 3.3','bytes':exe.stat().st_size,'sha256':hashlib.sha256(exe.read_bytes()).hexdigest(),'systemDLLs':dlls,'windowsLaunchTested':False,'gameplayCore':'same slice/src/core.c used by the browser WebAssembly build'}
(evidence/'windows-build.json').write_text(json.dumps(receipt,indent=2)+'\n');(out/'BUILD_STATUS.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt,indent=2))
