"""Prevent Admin build regressions caused by missing Vite import.meta.env types."""

import json
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[2]
ADMIN = ROOT / "frontend" / "admin"


class AdminViteEnvironmentTests(unittest.TestCase):
    def test_typescript_includes_vite_env_declaration(self):
        tsconfig = json.loads((ADMIN / "tsconfig.json").read_text(encoding="utf-8"))
        self.assertIn("src", tsconfig["include"])
        declaration = (ADMIN / "src" / "vite-env.d.ts").read_text(encoding="utf-8")
        self.assertIn('/// <reference types="vite/client" />', declaration)
        self.assertIn("interface ImportMetaEnv", declaration)
        self.assertIn("readonly VITE_API_BASE_URL?: string", declaration)
        self.assertIn("interface ImportMeta", declaration)
        self.assertIn("readonly env: ImportMetaEnv", declaration)

    def test_api_base_url_reads_declared_vite_environment(self):
        api = (ADMIN / "src" / "api" / "client.ts").read_text(encoding="utf-8")
        self.assertIn("import.meta.env.VITE_API_BASE_URL", api)
        self.assertIn("VITE_API_BASE_URL", (ADMIN / ".env.example").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
