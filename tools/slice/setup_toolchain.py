#!/usr/bin/env python3
"""Pinned Linux-x64 tools for the fallback Windows cross-build; no install scripts."""
from pathlib import Path
import hashlib,json,platform,subprocess,tarfile,urllib.request
root=Path(__file__).resolve().parents[2]
if platform.system()!='Linux' or platform.machine() not in ('x86_64','AMD64'):
 raise SystemExit('The pinned fallback cross-build toolchain is for Linux x64. The packaged Windows game itself needs no compiler.')
cache=root/'.cache';tool=cache/'toolchains';vendor=cache/'vendor';tool.mkdir(parents=True,exist_ok=True);vendor.mkdir(parents=True,exist_ok=True)
package='@oven/zig-linux-x64@0.12.0-dev.1286'
expected='sha512-8vT8FO4smHeurOHFdJ7zyUvOifxkTtii2Y7+lEkkSKBEHozsHUKSnElSV8q7hNl3pH5Rl4u/rw9eWsF+ejGNLg=='
subprocess.run(['npm','install','--prefix',str(tool),'--ignore-scripts','--no-audit','--no-fund',package],check=True)
lock=json.loads((tool/'package-lock.json').read_text())
assert lock['packages']['node_modules/@oven/zig-linux-x64']['integrity']==expected,'Compiler package integrity mismatch'
archive=vendor/'raylib-5.5.tar.gz';digest='aea98ecf5bc5c5e0b789a76de0083a21a70457050ea4cc2aec7566935f5e258e'
if not archive.exists():
 with urllib.request.urlopen('https://codeload.github.com/raysan5/raylib/tar.gz/refs/tags/5.5',timeout=90) as response:archive.write_bytes(response.read())
assert hashlib.sha256(archive.read_bytes()).hexdigest()==digest,'Raylib source checksum mismatch'
if not (vendor/'raylib-5.5/src/raylib.h').exists():
 with tarfile.open(archive) as tar:
  for item in tar.getmembers():
   target=(vendor/item.name).resolve()
   if not target.is_relative_to(vendor.resolve()) or item.issym() or item.islnk():raise RuntimeError('Unsafe archive member')
  tar.extractall(vendor)
print('Pinned Zig compiler and raylib 5.5 source are ready. No downloaded install scripts were run.')
