#!/usr/bin/env python3
"""Validate a complete Windows ZIP offline. Does not execute or launch its EXE."""
import argparse
import hashlib
import json
from pathlib import PurePosixPath
import re
import struct
import zipfile

AUDIO = ('shot', 'rifle', 'impact', 'reload', 'heal', 'objective')
MODELS = {'L_PuertoChico_Combat', 'SM_Cosecha_Sentry_01', 'SM_Culebra_W01',
          'SM_Libertad_W05', 'SM_SandbagCover_01', 'SM_FieldGenerator_01', 'SM_HarborContainer_01'}


def validate_package(path):
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        assert len(names) == len(set(n.casefold() for n in names)), 'Duplicate ZIP entry'
        for name in names:
            assert not PurePosixPath(name).is_absolute() and '..' not in PurePosixPath(name).parts
            assert '\\' not in name and ':' not in name, 'Unsafe Windows path'
        assert sum(i.file_size for i in archive.infolist()) < 256 * 1024 * 1024, 'Unexpected package size'
        assert archive.testzip() is None, 'ZIP CRC failure'
        for required in ['DividedHorizon-Slice.exe', 'BUILD_STATUS.json', 'SHA256SUMS.txt',
                         'README_START_HERE.txt', 'Start-Game.bat', 'Run-Diagnostics.bat',
                         'assets/combat.json', 'assets/manifest.json', 'licenses/raylib-LICENSE.txt']:
            assert required in names, f'Missing required file: {required}'
        sums = {}
        for line in archive.read('SHA256SUMS.txt').decode().splitlines():
            digest, name = line.split('  ', 1)
            assert re.fullmatch('[0-9a-f]{64}', digest) and name not in sums
            assert hashlib.sha256(archive.read(name)).hexdigest() == digest, f'Checksum mismatch: {name}'
            sums[name] = digest
        assert set(sums) == set(names) - {'SHA256SUMS.txt'}, 'Checksum coverage incomplete'
        receipt = json.loads(archive.read('BUILD_STATUS.json'))
        exe = archive.read('DividedHorizon-Slice.exe')
        assert exe[:2] == b'MZ' and len(exe) >= 64, 'Not a PE executable'
        pe = struct.unpack_from('<I', exe, 60)[0]
        assert exe[pe:pe+4] == b'PE\0\0' and len(exe) >= pe + 26
        assert struct.unpack_from('<H', exe, pe+4)[0] == 0x8664, 'Not x64'
        assert struct.unpack_from('<H', exe, pe+24)[0] == 0x20b, 'Not PE32+'
        assert receipt['bytes'] == len(exe) and receipt['sha256'] == sums['DividedHorizon-Slice.exe']
        assert receipt['windowsLaunchTested'] is False, 'Revisit validator scope before changing launch claims'
        manifest = json.loads(archive.read('assets/manifest.json'))
        assert {a['id'] for a in manifest['assets']} == MODELS, 'Model manifest incomplete'
        for asset in manifest['assets']:
            assert re.fullmatch(r'[A-Za-z0-9_]+\.glb', asset['file'])
            name = 'assets/' + asset['file']
            data = archive.read(name)
            assert data[:4] == b'glTF' and len(data) == asset['bytes']
            assert sums[name] == asset['sha256'], f'Asset manifest mismatch: {name}'
        for sound in AUDIO:
            data = archive.read(f'assets/audio/{sound}.wav')
            assert data[:4] == b'RIFF' and data[8:12] == b'WAVE' and len(data) > 44
        assert json.loads(archive.read('assets/combat.json'))['world'] == 'L_PuertoChico_Combat.glb'
        return {'passed': True, 'scope': 'Offline ZIP/PE/hash/runtime-file validation, NOT a Windows launch',
                'files': len(names), 'models': len(MODELS), 'sounds': len(AUDIO),
                'version': receipt['version'], 'sourceCommit': receipt['sourceCommit'],
                'exeSha256': sums['DividedHorizon-Slice.exe'], 'windowsLaunchTested': False}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive')
    args = parser.parse_args()
    print(json.dumps(validate_package(args.archive), indent=2))
