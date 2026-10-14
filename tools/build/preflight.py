#!/usr/bin/env python3
"""Read-only UE host inventory; never downloads, accepts licenses or starts a build."""
import argparse
import json
import os
from pathlib import Path
import platform
import shutil
import sys

ROOT = Path(__file__).resolve().parents[2]
ENGINE_FILES = {
    'editor_commandlet': 'Engine/Binaries/Win64/UnrealEditor-Cmd.exe',
    'build_script': 'Engine/Build/BatchFiles/Build.bat',
    'automation_tool': 'Engine/Build/BatchFiles/RunUAT.bat',
}


def inspect_engine(root):
    result = {'configured': bool(root), 'version': None, 'files': {}, 'issues': []}
    if not root:
        result['issues'].append('Set UE_ROOT or engine_root in tools/build/env.json.')
        return result
    path = Path(root)
    for name, relative in ENGINE_FILES.items():
        result['files'][name] = (path / relative).is_file()
        if not result['files'][name]:
            result['issues'].append(f'Missing {relative}')
    try:
        version = json.loads((path / 'Engine/Build/Build.version').read_text(encoding='utf-8-sig'))
        numbers = [version[k] for k in ('MajorVersion', 'MinorVersion', 'PatchVersion')]
        if not all(type(n) is int and n >= 0 for n in numbers) or numbers[0] != 5:
            raise ValueError('Requires a UE5 version with non-negative integer components')
        result['version'] = '.'.join(map(str, numbers))
    except (OSError, ValueError, KeyError, TypeError) as error:
        result['issues'].append(f'Invalid/unreadable Build.version: {type(error).__name__}')
    return result


def inventory(engine_root, *, system=None, machine=None, lookup=shutil.which):
    system = system or platform.system()
    machine = machine or platform.machine()
    engine = inspect_engine(engine_root)
    commands = {'git': 'git', 'git_lfs': 'git-lfs', 'ffmpeg': 'ffmpeg',
                'archive': '7z', 'powershell': 'pwsh'}
    tools = {key: bool(lookup(command)) for key, command in commands.items()}
    # Windows PowerShell is also usable on the owner's workstation.
    tools['powershell'] = tools['powershell'] or bool(lookup('powershell'))
    tools['python_3_11_plus'] = sys.version_info >= (3, 11)
    windows = system == 'Windows' and machine.lower() in ('amd64', 'x86_64')
    present = windows and not engine['issues'] and all(tools.values())
    return {
        'schema': 1, 'scope': 'Read-only file/tool inventory, not a build or M0 certification',
        'host': {'system': system, 'architecture': machine, 'windows_x64': windows},
        'tools': tools, 'engine': engine,
        'status': 'PREREQUISITE_FILES_PRESENT' if present else 'BLOCKED',
        'prerequisite_files_present': bool(present),
        'm0_passed': False,
        'unverified': ['Windows 11 and hardware capacity', 'Epic EULA and asset licenses',
                       'Latest stable UE release and feature maturity', 'C++ compiler and SDK compatibility',
                       'GPU/driver and T1–T5 budgets', 'Compile/cook/package/launch',
                       'Editor automation, captures and profiling', 'Human Art Lock/Blind Bench'],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=ROOT / 'tools/build/env.json')
    parser.add_argument('--output', type=Path, default=ROOT / 'docs/evidence/M0-v3/preflight.json')
    parser.add_argument('--require-ready', action='store_true', help='Exit 2 if prerequisite files/tools are missing')
    args = parser.parse_args()
    config = {}
    if args.config.is_file():
        try:
            config = json.loads(args.config.read_text(encoding='utf-8-sig'))
            if not isinstance(config, dict) or not isinstance(config.get('engine_root', ''), str):
                raise ValueError('Expected an object with an optional engine_root string')
        except (OSError, ValueError) as error:
            parser.error(f'Invalid config: {error}')
    report = inventory(os.environ.get('UE_ROOT') or config.get('engine_root'))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, indent=2))
    return 2 if args.require_ready and not report['prerequisite_files_present'] else 0


if __name__ == '__main__':
    raise SystemExit(main())
