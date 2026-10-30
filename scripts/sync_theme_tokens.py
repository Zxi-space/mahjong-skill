"""Sync independent frontend theme snapshots from docs/system/tokens/design-tokens.json.

No shared runtime packages. Use --check in CI to verify all three frontend copies match the
approved design system and do not drift independently.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/system/tokens/design-tokens.json'
SOURCE_CSS = ROOT / 'docs/system/tokens/design-tokens.css'


def decls(theme: dict[str, str]) -> str:
    return '\n'.join(f'  {key}: {value};' for key, value in theme.items())


def palette(data: dict) -> str:
    entries = [f'  --qb-{family}-{step}: {value};' for family, tones in data['palette'].items() for step, value in tones.items()]
    entries += [f'  --qb-space-{n}: {n}px;' for n in data['spacing']]
    entries += [f'  --qb-radius-{key}: {value}px;' for key, value in data['radii'].items()]
    entries += [f'  --qb-control-{key}: {value}px;' for key, value in data['controlHeights'].items()]
    return '\n'.join(entries)


def outputs() -> dict[Path, str]:
    data = json.loads(SOURCE.read_text(encoding='utf-8'))
    light = data['themes']['light']['semantic']
    dark = data['themes']['dark']['semantic']
    assert set(light) == set(dark), 'Light/Dark semantic tokens must have identical keys'
    palette_css = palette(data)
    web = ('/* Generated snapshot: scripts/sync_theme_tokens.py. Do not edit manually. */\n'
           + SOURCE_CSS.read_text(encoding='utf-8').rstrip()
           + '\n\n/* Base palette, spacing, radii, control heights remain stable across themes. */\n'
           + ':root {\n' + palette_css + '\n}\n')
    client = ('''/* Generated snapshot: scripts/sync_theme_tokens.py. Do not edit manually.
 * Mini programs inherit variables from View, so a scoped class mirrors browser :root.
 * Dark mode is a color mode, not a separate game mode. */
:root, page, .qb-theme-root {
''' + decls(light) + '\n' + palette_css + '''
}
:root[data-qb-theme="dark"], .qb-theme-root.qb-theme-dark {
''' + decls(dark) + '''
}
''')
    return {
        ROOT / 'frontend/client/src/styles/_qb-theme.scss': client,
        ROOT / 'frontend/admin/src/styles/qb-tokens.css': web,
        ROOT / 'frontend/portal/src/styles/qb-tokens.css': web,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Check generated snapshots; do not modify files')
    args = parser.parse_args()
    invalid = []
    for path, expected in outputs().items():
        if args.check:
            if not path.is_file() or path.read_text(encoding='utf-8') != expected:
                invalid.append(str(path.relative_to(ROOT)))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(expected, encoding='utf-8')
            print('SYNC', path.relative_to(ROOT))
    if invalid:
        for path in invalid:
            print('DRIFT:', path)
        return 1
    print('Theme tokens checked' if args.check else 'Theme tokens synchronized')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
