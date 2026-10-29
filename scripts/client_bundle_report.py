#!/usr/bin/env python3
"""Report actual Taro client build sizes (raw + gzip), with no npm dependencies.

Usage (from repository root):
    python scripts/client_bundle_report.py h5
    python scripts/client_bundle_report.py weapp
    python scripts/client_bundle_report.py h5 --budget-kib 350 --fail-on-budget
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import gzip
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
CLIENT = ROOT / 'frontend' / 'client'
DIST = CLIENT / 'dist'
ARTIFACTS = ROOT / 'artifacts'
ASSET_EXTENSIONS = {'.js', '.css', '.wxss', '.wxml', '.json', '.html', '.map'}


def collect(build_dir: Path):
    if not build_dir.is_dir():
        raise FileNotFoundError(f'{build_dir} 不存在，请先执行对应平台的 build 命令')
    assets = []
    for file in build_dir.rglob('*'):
        if not file.is_file() or file.suffix.lower() not in ASSET_EXTENSIONS:
            continue
        payload = file.read_bytes()
        assets.append({
            'path': file.relative_to(build_dir).as_posix(),
            'bytes': len(payload),
            'gzip_bytes': len(gzip.compress(payload, compresslevel=6, mtime=0)),
            'sha256': hashlib.sha256(payload).hexdigest(),
        })
    return sorted(assets, key=lambda item: (-item['bytes'], item['path']))


def report(platform: str, *, build_dir: Path | None = None, budget_kib: int = 244):
    build_dir = build_dir or DIST / platform
    assets = collect(build_dir)
    if not assets:
        raise ValueError(f'{build_dir} 未找到有效产物文件')
    all_bytes = sum(a['bytes'] for a in assets if not a['path'].endswith('.map'))
    js_assets = [a for a in assets if a['path'].endswith('.js')]
    css_assets = [a for a in assets if a['path'].endswith(('.css', '.wxss'))]
    groups = {}
    for asset in js_assets:
        groups.setdefault(asset['sha256'], []).append(asset['path'])
    duplicates = [paths for paths in groups.values() if len(paths) > 1]
    budget_bytes = budget_kib * 1024
    return {
        'platform': platform,
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'output_root': str(build_dir),
        'budget_kib': budget_kib,
        'asset_count': len(assets),
        'total_bytes_excluding_maps': all_bytes,
        'js_bytes': sum(a['bytes'] for a in js_assets),
        'css_bytes': sum(a['bytes'] for a in css_assets),
        'over_budget': [a['path'] for a in js_assets if a['bytes'] > budget_bytes],
        'exact_duplicate_js_files': duplicates,
        'top_assets': assets[:25],
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description='Taro Client build bundle audit')
    parser.add_argument('platform', choices=['h5', 'weapp', 'alipay', 'tt'])
    parser.add_argument('--budget-kib', type=int, default=244)
    parser.add_argument('--fail-on-budget', action='store_true')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args(argv)
    if args.budget_kib <= 0:
        parser.error('--budget-kib 必须大于零')
    try:
        data = report(args.platform, budget_kib=args.budget_kib)
    except (FileNotFoundError, ValueError) as exc:
        print(f'[Client Bundle] ERROR: {exc}', file=sys.stderr)
        return 2
    dest = args.output or ARTIFACTS / f'client-{args.platform}-bundle-report.json'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'\n[Client Bundle] {args.platform.upper()} | {data["asset_count"]} files | JS {data["js_bytes"]/1024:.1f} KiB | CSS {data["css_bytes"]/1024:.1f} KiB')
    print('Largest assets (raw / gzip):')
    for asset in data['top_assets'][:12]:
        print(f'  {asset["bytes"]/1024:>7.1f} / {asset["gzip_bytes"]/1024:>7.1f} KiB  {asset["path"]}')
    print(f'Files larger than {args.budget_kib} KiB: {len(data["over_budget"])}')
    print(f'Exact duplicate JS groups: {len(data["exact_duplicate_js_files"])}')
    print('Report:', dest)
    print('提示：这是实际产物体积报告，不包含 Webpack modules / dependency graph；不能据此判断大 Chunk 的具体依赖归属。')
    return 1 if args.fail_on_budget and data['over_budget'] else 0


if __name__ == '__main__':
    sys.exit(main())
