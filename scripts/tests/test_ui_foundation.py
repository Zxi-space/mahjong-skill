"""无第三方依赖的 Client UI 边界检查。真实渲染仍需要 Taro 构建和设备验收。"""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
CLIENT = ROOT / 'frontend/client/src'


class ClientUIFoundationTests(unittest.TestCase):
    def test_component_gallery_is_registered(self):
        config = (CLIENT / 'app.config.ts').read_text(encoding='utf-8')
        self.assertIn("subPackages: [{ root: 'subpackages', pages: ['gallery/index'] }]", config)
        self.assertTrue((CLIENT / 'subpackages/gallery/index.tsx').is_file())

    def test_every_ui_export_has_implementation(self):
        entry = (CLIENT / 'components/ui/index.ts').read_text(encoding='utf-8')
        names = re.findall(r"export \{ (Mj\w+) \} from './([\w-]+)'", entry)
        self.assertEqual(11, len(names))
        for name, folder in names:
            code = (CLIENT / f'components/ui/{folder}/index.tsx').read_text(encoding='utf-8')
            self.assertIn(f'function {name}', code)

    def test_platform_and_ui_boundaries(self):
        for path in (CLIENT / 'components').rglob('*.tsx'):
            contents = path.read_text(encoding='utf-8')
            self.assertNotRegex(contents, r'\b(?:window|document|localStorage)\.')
            self.assertNotRegex(contents, r'\b(?:wx|my|tt)\.')
            self.assertNotIn('frontend/admin', contents)
            self.assertNotIn('frontend/portal', contents)

    def test_style_tokens_in_all_three_independent_frontends(self):
        self.assertTrue((CLIENT / 'styles/_tokens.scss').is_file())
        self.assertTrue((ROOT / 'frontend/admin/src/styles/brand.css').is_file())
        self.assertTrue((ROOT / 'frontend/portal/src/styles/brand.css').is_file())
        self.assertFalse((ROOT / 'frontend/packages').exists())


if __name__ == '__main__':
    unittest.main()
