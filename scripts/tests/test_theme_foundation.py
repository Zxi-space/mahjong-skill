"""Structural tests for the three independent design-system foundations."""
import json
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]
TOKENS = json.loads((ROOT/'docs/system/tokens/design-tokens.json').read_text(encoding='utf-8'))

class ThemeFoundationTests(unittest.TestCase):
    def test_complete_approved_semantic_palette(self):
        light = TOKENS['themes']['light']['semantic']
        dark = TOKENS['themes']['dark']['semantic']
        self.assertEqual(set(light), set(dark))
        self.assertEqual(light['--qb-bg-canvas'], '#FFFCF6')
        self.assertEqual(dark['--qb-bg-canvas'], '#091C19')
        self.assertEqual(light['--qb-card-paper'], dark['--qb-card-paper'])

    def test_snapshots_are_generated_from_design_source(self):
        command = [sys.executable, str(ROOT/'scripts/sync_theme_tokens.py'), '--check']
        done = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=10)
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)

    def test_client_miniprogram_and_browser_bootstrap(self):
        base = ROOT/'frontend/client/src'
        app = (base/'app.config.ts').read_text(encoding='utf-8')
        self.assertIn('darkmode: true', app)
        self.assertIn("themeLocation: 'theme.json'", app)
        json.loads((base/'theme.json').read_text(encoding='utf-8'))
        html = (base/'index.html').read_text(encoding='utf-8')
        self.assertIn('data-qb-theme', html)
        theme = (base/'theme/theme.ts').read_text(encoding='utf-8')
        for literal in ('Taro.getStorageSync', 'Taro.setStorageSync', 'Taro.onThemeChange', 'Taro.setNavigationBarColor', 'subscribeSystemTheme'):
            self.assertIn(literal, theme)
        wrapper = (base/'components/layout/page-container/index.tsx').read_text(encoding='utf-8')
        self.assertIn('qb-theme-${resolved}', wrapper)
        self.assertIn('MjThemeSwitcher', wrapper)

    def test_admin_portal_theme_bootstrap_and_switchers(self):
        admin = ROOT/'frontend/admin'
        portal = ROOT/'frontend/portal'
        for file in (admin/'index.html', portal/'src/app/layout.tsx'):
            self.assertIn('data-qb-theme', file.read_text(encoding='utf-8'))
        for app in (admin, portal):
            ui = (app/'src/components/theme-switcher.tsx').read_text(encoding='utf-8')
            for phrase in ("'light'", "'dark'", "'system'", 'matchMedia', 'localStorage', 'DropdownMenuRadioGroup'):
                self.assertIn(phrase, ui)
            css = (app/'src/styles/qb-tokens.css').read_text(encoding='utf-8')
            self.assertIn('--qb-card-paper: #FFF8EC;', css)
            self.assertIn('--qb-bg-canvas: #091C19;', css)

    def test_frontend_packages_remain_independent(self):
        self.assertFalse((ROOT/'frontend/packages').exists())
        for sub in ('client', 'admin', 'portal'):
            self.assertTrue((ROOT/f'frontend/{sub}/package.json').is_file())

if __name__=='__main__': unittest.main()
