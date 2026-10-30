"""Phase 03 layout checks; source docs are authoritative, not screenshots embedded as UI."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs' / 'system'
CLIENT = ROOT / 'frontend' / 'client' / 'src'
ADMIN = ROOT / 'frontend' / 'admin' / 'src'
PORTAL = ROOT / 'frontend' / 'portal' / 'src'


def test_approved_references_not_removed():
    for name in ('01-client-approved-20261030.webp', '02-portal-approved-20261030.webp', '03-admin-approved-20261030.webp'):
        assert (DOCS / 'references' / name).is_file()


def test_three_packages_remain_independent():
    for name in ('client', 'admin', 'portal'):
        assert (ROOT / 'frontend' / name / 'package.json').is_file()
    assert not (ROOT / 'frontend' / 'packages').exists()


def test_tokens_remain_source_of_truth():
    data = json.loads((DOCS / 'tokens' / 'design-tokens.json').read_text(encoding='utf-8'))
    assert 'light' in data['themes'] and 'dark' in data['themes']
    for name in ('light', 'dark'):
        assert '--qb-action-primary' in data['themes'][name]['semantic']
    assert (CLIENT / 'styles' / '_qb-theme.scss').is_file()
    assert (ADMIN / 'styles' / 'qb-tokens.css').is_file()
    assert (PORTAL / 'styles' / 'qb-tokens.css').is_file()


def test_client_has_real_navigation_and_cross_platform_states():
    for name in ('mini-nav-bar', 'bottom-tab-bar', 'page-container'):
        assert (CLIENT / 'components' / 'layout' / name / 'index.tsx').is_file()
    for name in ('switch', 'skeleton', 'error-state'):
        assert (CLIENT / 'components' / 'ui' / name / 'index.tsx').is_file()
    app_config = (CLIENT / 'app.config.ts').read_text(encoding='utf-8')
    assert 'navigationStyle' in app_config and "'custom'" in app_config
    tabs = (CLIENT / 'components' / 'layout' / 'bottom-tab-bar' / 'index.tsx').read_text(encoding='utf-8')
    assert '/pages/index/index' in tabs and '/pages/room/index' in tabs and '/subpackages/gallery/index' in tabs
    assert '摸牌' not in tabs and '出牌' not in tabs


def test_admin_layout_and_actual_empty_data():
    assert (ADMIN / 'components' / 'layout' / 'admin-shell.tsx').exists()
    for name in ('page-header', 'panel', 'data-table', 'dialog', 'empty-state', 'status-badge', 'skeleton'):
        assert (ADMIN / 'components' / 'ui' / f'{name}.tsx').exists()
    dash = (ADMIN / 'features' / 'dashboard.tsx').read_text(encoding='utf-8')
    assert 'rows={[]}' in dash and '—' in dash
    assert '24893' not in dash and '24,893' not in dash


def test_portal_layout_and_truthful_claims():
    for part in ('site-header', 'site-footer'):
        assert (PORTAL / 'components' / 'layout' / f'{part}.tsx').exists()
    page = (PORTAL / 'app' / 'page.tsx').read_text(encoding='utf-8')
    for id in ('features', 'steps', 'scenes'):
        assert f"id='{id}'" in page
    assert '不会替你摸牌、出牌或自动判定胜负' in page
    assert '正式雀叽插画需另行接入' in page


def test_shared_css_variables_not_hardcoded_theme_swap():
    for path in (ADMIN / 'styles.css', PORTAL / 'app' / 'globals.css'):
        content = path.read_text(encoding='utf-8')
        assert 'var(--qb-bg-canvas)' in content
        assert 'var(--qb-action-primary)' in content
        assert 'prefers-reduced-motion' in content
