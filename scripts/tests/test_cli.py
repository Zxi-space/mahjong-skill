import importlib.util
import json
import unittest
import zipfile
from pathlib import Path
SCRIPT = Path(__file__).resolve().parents[1] / 'mahjong_skill.py'
spec = importlib.util.spec_from_file_location('cli', SCRIPT)
cli = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cli)

class ScriptTests(unittest.TestCase):
    def test_architecture(self):
        self.assertEqual(cli.architecture_scan(), 0)
    def test_package_rejects_secrets(self):
        for s in ('backend/.env','frontend/client/node_modules/a.js','.git/config','backend/cert.pem', 'frontend/client/project.private.config.json', 'frontend/client/project.config.local.json', 'frontend/client/.cache/state.json', 'backend/token.p8', 'backend/service-account-secret.json'):
            self.assertFalse(cli.safe_file(Path(s)))
        self.assertTrue(cli.safe_file(Path('frontend/client/.env.example')))
        self.assertTrue(cli.safe_file(Path('frontend/client/project.config.json')))
        self.assertTrue(cli.safe_file(Path('pnpm-lock.yaml')))
        self.assertFalse(cli.safe_file(Path('frontend/client/card.webp'), slim=True))
    def test_source_archive(self):
        path=cli.source_package('all')
        try:
            with zipfile.ZipFile(path) as z:
                names=z.namelist()
                self.assertIn('mahjong-skill/frontend/client/package.json',names)
                self.assertIn('mahjong-skill/backend/app/main.py',names)
                self.assertIn('mahjong-skill/docs/github.md',names)
                self.assertIn('mahjong-skill/.github/workflows/ci.yml',names)
                self.assertIn('mahjong-skill/.gitattributes',names)
                self.assertFalse(any('/node_modules/' in n or n.endswith('/.env') for n in names))
        finally: path.unlink(missing_ok=True)
    def test_package_scripts(self):
        s=json.loads((cli.ROOT/'package.json').read_text('utf-8'))['scripts']
        for key in ('dev','dev:down','dev:status','package:source','package:source:backend','check','build','git:init','git:check'):
            self.assertIn('mahjong-skill:'+key,s)
if __name__=='__main__': unittest.main()
