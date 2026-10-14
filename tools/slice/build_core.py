#!/usr/bin/env python3
from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parents[2]
zig=root/'.cache/toolchains/node_modules/@oven/zig-linux-x64/zig'
if not zig.is_file():raise SystemExit('Install the pinned toolchain with tools/slice/setup_toolchain.py first.')
exports=['dh_new','dh_input','dh_tick','dh_pause','dh_retry','dh_get','dh_enemy','dh_events','dh_event','dh_clear_events','dh_save','dh_save_pointer','dh_load','dh_debug_position','dh_debug_enemy','dh_debug_health']
cmd=[str(zig),'cc','-target','wasm32-wasi','-O2','-s','-mexec-model=reactor','-fno-stack-protector']+[f'-Wl,--export={name}' for name in exports]+['slice/src/core.c','-o','prototype/public/slice-core.wasm']
subprocess.run(cmd,cwd=root,check=True)
print('Built shared C simulation as WebAssembly:',(root/'prototype/public/slice-core.wasm').stat().st_size,'bytes')
