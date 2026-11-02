"""Regression checks for real route-level splitting and the bundle budget report."""
from pathlib import Path
import json
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
ADMIN = ROOT / 'frontend/admin'
REPORT = ADMIN / 'scripts/analyze-bundle.mjs'


class AdminChunkTests(unittest.TestCase):
    def test_routes_are_lazy_and_keep_lab_out_of_shell(self):
        app = (ADMIN / 'src/app.tsx').read_text(encoding='utf-8')
        self.assertIn('lazy(() => import(', app)
        self.assertIn("import('./features/dashboard')", app)
        self.assertIn("import('./features/components-demo')", app)
        self.assertIn("import('./features/not-ready')", app)
        self.assertIn('Suspense fallback=', app)
        self.assertNotRegex(app, r"import\s+\{\s*(Dashboard|ComponentsDemo)\s*\}\s+from")
        self.assertIn('Skeleton', app)
        self.assertTrue((ADMIN / 'src/features/not-ready.tsx').exists())

    def test_vite_8_rolldown_uses_groups_not_deprecated_manual_chunks(self):
        config = (ADMIN / 'vite.config.ts').read_text(encoding='utf-8')
        self.assertIn('rolldownOptions:', config)
        self.assertIn('codeSplitting:', config)
        self.assertIn('manifest: true', config)
        self.assertNotIn('manualChunks:', config)
        for name in ('react-runtime', 'router-runtime', 'query-runtime', 'table-runtime'):
            self.assertIn(f"name: '{name}'", config)
        self.assertNotIn('chunkSizeWarningLimit:', config)
        self.assertTrue(REPORT.is_file())

    def test_react_group_does_not_match_router_and_matches_pnpm(self):
        # The webpack-style `node_modules/react` pattern would incorrectly
        # capture react-router-dom; this test executes actual JS regex literals.
        script = r"""
const fs = require('fs');
const source = fs.readFileSync(process.argv[1], 'utf8');
const match = source.match(/const reactRuntime = (\/.*\/)[\\s]*$/m);
if (!match) process.exit(2);
const re = eval(match[1]);
const paths = [
  '/home/project/node_modules/react/index.js',
  String.raw`D:\repo\node_modules\.pnpm\react-dom@19.3.1_react@19.3.1\node_modules\react-dom\client.js`,
  '/repo/node_modules/.pnpm/scheduler@0.27.0/node_modules/scheduler/index.js',
  '/repo/node_modules/react-router-dom/index.js',
  '/repo/node_modules/react-hook-form/index.js'
];
console.log(JSON.stringify(paths.map(id => re.test(id))));
"""
        result = subprocess.run(['node', '-e', script, str(ADMIN / 'vite.config.ts')], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), [True, True, True, False, False])

    def test_query_and_table_chunks_are_not_grouped_together(self):
        script = r"""
const fs = require('fs');
const source = fs.readFileSync(process.argv[1], 'utf8');
function get(name) {
  const hit = source.match(new RegExp('const ' + name + ' = (\\/.*\\/)', 'm'));
  if (!hit) throw new Error('Regex not found: ' + name);
  return eval(hit[1]);
}
const query = get('queryRuntime');
const table = get('tableRuntime');
const queryPath = '/repo/node_modules/.pnpm/@tanstack+react-query@5.90.0/node_modules/@tanstack/react-query/build/modern/index.js';
const tablePath = '/repo/node_modules/.pnpm/@tanstack+react-table@8.21.0/node_modules/@tanstack/react-table/build/lib/index.js';
console.log(JSON.stringify([query.test(queryPath), table.test(tablePath), query.test(tablePath), table.test(queryPath)]));
"""
        result = subprocess.run(['node', '-e', script, str(ADMIN / 'vite.config.ts')], capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), [True, True, False, False])

    def test_budget_reports_initial_and_lazy_assets(self):
        with tempfile.TemporaryDirectory() as temp:
            dist = Path(temp)
            assets = dist / 'assets'
            assets.mkdir()
            for name, length in [('main.js', 1000), ('react.js', 400), ('dashboard.js', 800), ('components.js', 1200)]:
                (assets / name).write_bytes(b'a' * length)
            manifest = {
                'src/main.tsx': {'file':'assets/main.js', 'isEntry':True, 'imports':['_react.js'], 'dynamicImports':['src/features/dashboard.tsx','src/features/components-demo.tsx']},
                '_react.js': {'file':'assets/react.js'},
                'src/features/dashboard.tsx': {'file':'assets/dashboard.js', 'isDynamicEntry':True, 'imports':['_react.js']},
                'src/features/components-demo.tsx': {'file':'assets/components.js', 'isDynamicEntry':True, 'imports':['_react.js']},
            }
            (dist / '.vite').mkdir()
            (dist / '.vite/manifest.json').write_text(json.dumps(manifest), encoding='utf-8')
            result = subprocess.run(['node', str(REPORT), '--dist', str(dist), '--strict'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
            self.assertIn('初始 JS：1.40 kB', result.stdout)
            self.assertIn('懒加载页面：2', result.stdout)
            self.assertIn('所有 JS 文件均不超过', result.stdout)
            # Oversized output must fail CI rather than hide the Vite warning.
            (assets / 'components.js').write_bytes(b'x' * 500_001)
            failed = subprocess.run(['node', str(REPORT), '--dist', str(dist), '--strict'], capture_output=True, text=True)
            self.assertNotEqual(failed.returncode, 0)
            self.assertIn('超过 500.00 kB', failed.stdout)
            # Regressed static imports or missing lazy entries must also fail.
            (assets / 'components.js').write_bytes(b'x' * 2000)
            manifest['src/features/components-demo.tsx'].pop('isDynamicEntry')
            (dist / '.vite/manifest.json').write_text(json.dumps(manifest), encoding='utf-8')
            failed = subprocess.run(['node', str(REPORT), '--dist', str(dist), '--strict'], capture_output=True, text=True)
            self.assertNotEqual(failed.returncode, 0)
            self.assertIn('页面缺少独立的异步入口', failed.stdout)


if __name__ == '__main__':
    unittest.main()
