"""Checks that Client Sass modules avoid deprecated import and have explicit references."""
from pathlib import Path
import re
import unittest

CLIENT = Path(__file__).resolve().parents[2] / "frontend/client/src"

class SassModuleTests(unittest.TestCase):
    def test_no_deprecated_import(self):
        for file in CLIENT.rglob("*.scss"):
            with self.subTest(file=file):
                self.assertNotRegex(file.read_text(encoding="utf-8"), r"@import\s")

    def test_explicit_token_namespaces(self):
        for file in CLIENT.rglob("*.scss"):
            if file.name == "_tokens.scss":
                continue
            source = file.read_text(encoding="utf-8")
            with self.subTest(file=file):
                self.assertNotRegex(source, r"(?<![\w.])\$[\w-]+")

if __name__ == "__main__":
    unittest.main()
