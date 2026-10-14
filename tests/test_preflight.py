import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('preflight', Path(__file__).resolve().parents[1] / 'tools/build/preflight.py')
preflight = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preflight)


class PreflightTests(unittest.TestCase):
    def engine(self, root, version=None):
        for path in preflight.ENGINE_FILES.values():
            file = Path(root) / path
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_bytes(b'TEST FIXTURE NOT AN EXECUTABLE')
        path = Path(root) / 'Engine/Build/Build.version'
        path.write_text(json.dumps(version or {'MajorVersion': 5, 'MinorVersion': 6, 'PatchVersion': 1}))

    def test_no_engine_never_passes(self):
        report = preflight.inventory(None, system='Windows', machine='AMD64', lookup=lambda _: 'fixture')
        self.assertFalse(report['prerequisite_files_present'])
        self.assertFalse(report['m0_passed'])

    def test_linux_never_certifies_windows(self):
        with tempfile.TemporaryDirectory() as root:
            self.engine(root)
            report = preflight.inventory(root, system='Linux', machine='x86_64', lookup=lambda _: 'fixture')
            self.assertEqual(report['status'], 'BLOCKED')

    def test_files_are_not_build_proof(self):
        with tempfile.TemporaryDirectory() as root:
            self.engine(root)
            report = preflight.inventory(root, system='Windows', machine='AMD64', lookup=lambda _: 'fixture')
            self.assertTrue(report['prerequisite_files_present'])
            self.assertEqual(report['engine']['version'], '5.6.1')
            self.assertFalse(report['m0_passed'])

    def test_missing_tool_blocks(self):
        with tempfile.TemporaryDirectory() as root:
            self.engine(root)
            report = preflight.inventory(root, system='Windows', machine='AMD64', lookup=lambda _: None)
            self.assertFalse(report['prerequisite_files_present'])

    def test_invalid_version_and_missing_editor_block(self):
        with tempfile.TemporaryDirectory() as root:
            for version in ({'MajorVersion': True, 'MinorVersion': 6, 'PatchVersion': 0},
                            {'MajorVersion': 4, 'MinorVersion': 27, 'PatchVersion': 0},
                            {'MajorVersion': 5}, {'MajorVersion': 5, 'MinorVersion': -1, 'PatchVersion': 0}):
                self.engine(root, version)
                self.assertTrue(preflight.inspect_engine(root)['issues'])
            self.engine(root)
            (Path(root) / preflight.ENGINE_FILES['editor_commandlet']).unlink()
            self.assertTrue(preflight.inspect_engine(root)['issues'])


if __name__ == '__main__':
    unittest.main()
