"""Synthetic fixtures exercise package checks; none of these files are runnable EXEs."""
import importlib.util
import hashlib
import json
from pathlib import Path
import struct
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('validate_package', Path(__file__).resolve().parents[1] / 'tools/slice/validate_package.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def fixture():
    exe = bytearray(128)
    exe[:2] = b'MZ'
    struct.pack_into('<I', exe, 60, 64)
    exe[64:68] = b'PE\0\0'
    struct.pack_into('<H', exe, 68, 0x8664)
    struct.pack_into('<H', exe, 88, 0x20b)
    files = {'DividedHorizon-Slice.exe': bytes(exe), 'README_START_HERE.txt': b'TEST FIXTURE',
             'Start-Game.bat': b'TEST FIXTURE', 'Run-Diagnostics.bat': b'TEST FIXTURE',
             'licenses/raylib-LICENSE.txt': b'TEST FIXTURE'}
    receipt = {'version': 'test-fixture', 'sourceCommit': 'fixture-not-a-commit',
               'bytes': len(exe), 'sha256': hashlib.sha256(exe).hexdigest(), 'windowsLaunchTested': False}
    files['BUILD_STATUS.json'] = json.dumps(receipt).encode()
    assets = []
    for name in sorted(module.MODELS):
        data = b'glTF' + bytes(32)
        files['assets/' + name + '.glb'] = data
        assets.append({'id': name, 'file': name + '.glb', 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
    files['assets/manifest.json'] = json.dumps({'assets': assets}).encode()
    files['assets/combat.json'] = json.dumps({'world': 'L_PuertoChico_Combat.glb'}).encode()
    for name in module.AUDIO:
        files['assets/audio/' + name + '.wav'] = b'RIFF' + bytes(4) + b'WAVE' + bytes(40)
    return files


class PackageTests(unittest.TestCase):
    def check(self, modify=None, unhashed=False):
        files = fixture()
        if modify:
            modify(files)
        files['SHA256SUMS.txt'] = ''.join(hashlib.sha256(data).hexdigest() + '  ' + name + '\n' for name, data in files.items()).encode()
        if unhashed:
            files['unlisted.txt'] = b'not hashed'
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'test.zip'
            with zipfile.ZipFile(path, 'w') as archive:
                for name, data in files.items():
                    archive.writestr(name, data)
            return module.validate_package(path)

    def test_complete_fixture(self):
        result = self.check()
        self.assertTrue(result['passed'])
        self.assertFalse(result['windowsLaunchTested'])

    def test_missing_model(self):
        with self.assertRaises((AssertionError, KeyError)):
            self.check(lambda files: files.pop('assets/SM_Culebra_W01.glb'))

    def test_missing_audio(self):
        with self.assertRaises((AssertionError, KeyError)):
            self.check(lambda files: files.pop('assets/audio/shot.wav'))

    def test_non_windows_executable(self):
        with self.assertRaises(AssertionError):
            self.check(lambda files: files.update({'DividedHorizon-Slice.exe': b'not PE'}))

    def test_corrupt_model_even_with_recomputed_archive_checksums(self):
        with self.assertRaises(AssertionError):
            self.check(lambda files: files.update({'assets/SM_Culebra_W01.glb': b'glTF' + bytes(33)}))

    def test_unhashed_extra_file(self):
        with self.assertRaises(AssertionError):
            self.check(unhashed=True)

    def test_path_traversal(self):
        with self.assertRaises(AssertionError):
            self.check(lambda files: files.update({'../escape.txt': b'bad'}))


if __name__ == '__main__':
    unittest.main()
