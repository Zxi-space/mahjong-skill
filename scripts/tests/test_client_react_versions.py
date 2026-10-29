"""Guard React 18 Client from other React 19 workspaces."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
CLIENT = ROOT / 'frontend/client'

class TestClientReactIsolation(unittest.TestCase):
    def test_client_dep_versions_locked(self):
        pkg = json.loads((CLIENT / 'package.json').read_text(encoding='utf-8'))
        self.assertEqual(pkg['dependencies']['react'], '18.3.1')
        self.assertEqual(pkg['dependencies']['react-dom'], '18.3.1')
        self.assertEqual(pkg['scripts']['doctor:react'], 'node scripts/verify-react.cjs')

    def test_h5_webpack_alias_isolation(self):
        config = (CLIENT / 'config/index.ts').read_text(encoding='utf-8')
        self.assertIn("createRequire(resolve(__dirname, '../package.json'))", config)
        self.assertIn("chain.resolve.alias.set('react', clientReactDir)", config)
        self.assertIn("chain.resolve.alias.set('react-dom', clientReactDomDir)", config)
        self.assertIn('reactVersion !== reactDomVersion', config)

    def test_root_doctor_alias(self):
        pkg = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
        self.assertEqual(pkg['scripts']['mahjong-skill:doctor:client:react'], 'pnpm --filter @mahjong-skill/client doctor:react')

    def test_other_apps_remain_independent(self):
        for app in ('admin', 'portal'):
            pkg = json.loads((ROOT / 'frontend' / app / 'package.json').read_text(encoding='utf-8'))
            self.assertTrue(pkg['dependencies']['react'].startswith('^19.'))

if __name__ == '__main__':
    unittest.main()
