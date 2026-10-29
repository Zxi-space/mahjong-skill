"""Client cross-platform engineering invariants. WeChat simulator/manual checks remain required."""
import json
from pathlib import Path
import re
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
CLIENT = ROOT / 'frontend' / 'client'
sys.path.insert(0, str(ROOT / 'scripts'))
from client_bundle_report import collect, report  # noqa: E402


class TestClientCompileLayout(unittest.TestCase):
    def test_platform_specific_output_and_wechat_project(self):
        config = (CLIENT / 'config/index.ts').read_text(encoding='utf-8')
        self.assertIn('dist/${target}', config)
        self.assertIn("target === 'h5' || useMiniFilesystemCache", config)
        project = json.loads((CLIENT / 'project.config.json').read_text(encoding='utf-8'))
        self.assertEqual(project['miniprogramRoot'], 'dist/weapp/')

    def test_h5_html_entry_is_present_and_taro_manages_assets(self):
        config = (CLIENT / 'config/index.ts').read_text(encoding='utf-8')
        self.assertNotIn('static: { directory:', config)
        self.assertIn("port: 5174", config)
        html = (CLIENT / 'src/index.html').read_text(encoding='utf-8')
        self.assertIn('<div id="app"></div>', html)
        self.assertIn('htmlWebpackPlugin.options.script', html)
        self.assertIn('<title>雀变</title>', html)
        self.assertNotIn('<%= projectName %>', html)

    def test_no_cross_frontend_source_imports(self):
        for file in (CLIENT / 'src').rglob('*.tsx'):
            src = file.read_text(encoding='utf-8')
            self.assertNotRegex(src, r'(?:frontend/admin|frontend/portal|/\.\./\.\./admin/)')
            self.assertNotRegex(src, r'\b(?:window\.|document\.|localStorage\.|sessionStorage\.)')

    def test_pages_use_direct_ui_imports(self):
        for page in (CLIENT / 'src/pages').rglob('*.tsx'):
            src = page.read_text(encoding='utf-8')
            self.assertNotIn("from '../../components/ui'", src, page.as_posix())

    def test_gallery_moved_to_subpackage(self):
        app_config = (CLIENT / 'src/app.config.ts').read_text(encoding='utf-8')
        self.assertIn("subPackages: [{ root: 'subpackages', pages: ['gallery/index'] }]", app_config)
        home = (CLIENT / 'src/pages/index/index.tsx').read_text(encoding='utf-8')
        self.assertIn('/subpackages/gallery/index', home)

    def test_gallery_has_interactive_cross_platform_checks(self):
        page = (CLIENT / 'src/subpackages/gallery/index.tsx').read_text(encoding='utf-8')
        for token in ('getPlatformName()', '<MjDialog', '<MjToast', '<MjSheet', '<MjTabs', '<MjInput'):
            self.assertIn(token, page)

    def test_bundle_report_uses_actual_generated_assets(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / 'chunk').mkdir()
            (root / 'chunk' / 'large.js').write_bytes(b'a' * 307200)
            (root / 'app.css').write_text('body { color: red; }', encoding='utf-8')
            data = report('h5', build_dir=root)
            self.assertEqual(data['asset_count'], 2)
            self.assertEqual(data['over_budget'], ['chunk/large.js'])
            self.assertGreater(data['top_assets'][0]['bytes'], data['top_assets'][0]['gzip_bytes'])
            self.assertEqual(len(collect(root)), 2)


if __name__ == '__main__':
    unittest.main()
