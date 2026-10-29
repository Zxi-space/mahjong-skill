#!/usr/bin/env python3
"""Initialize only this project's local Git metadata; never commit or push automatically."""
from __future__ import annotations
import argparse
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True, check=False)


def main() -> int:
    parser = argparse.ArgumentParser(description="Initialize or inspect the Mahjong Skill Git repository")
    parser.add_argument("--check", action="store_true", help="Only validate Git ignore rules; do not initialize")
    args = parser.parse_args()
    if not shutil.which("git"):
        print("[ERROR] Git is not installed or is missing from PATH", file=sys.stderr)
        return 2
    if not (ROOT / ".gitignore").is_file():
        print("[ERROR] Missing repository .gitignore", file=sys.stderr)
        return 2
    if not args.check:
        existing = git("rev-parse", "--show-toplevel")
        if existing.returncode == 0:
            actual = Path(existing.stdout.strip()).resolve()
            if actual != ROOT.resolve():
                print(f"[ERROR] Current directory is nested under a different Git repository: {actual}", file=sys.stderr)
                return 2
            print(f"[OK] Git repository already exists: {ROOT}")
        else:
            result = git("init", "-b", "main")
            if result.returncode != 0:
                print(result.stderr or result.stdout, file=sys.stderr)
                return result.returncode
            print(f"[OK] Initialized Git repository on main: {ROOT}")

    ignored = ["backend/.env", "frontend/client/.env.production", "frontend/client/dist/weapp/app.js",
               "frontend/client/project.private.config.json", "node_modules/package.json", "artifacts/source.zip"]
    tracked = ["backend/.env.example", "frontend/client/project.config.json", "backend/openapi.json",
               "backend/alembic/versions/20261029_0001_init.py", "docs/github.md", "pnpm-lock.yaml"]
    for rel in ignored:
        if git("check-ignore", "--no-index", "-q", rel).returncode != 0:
            print(f"[ERROR] Sensitive/generated file is not ignored: {rel}", file=sys.stderr)
            return 1
    for rel in tracked:
        if git("check-ignore", "--no-index", "-q", rel).returncode == 0:
            print(f"[ERROR] Required source file would be ignored: {rel}", file=sys.stderr)
            return 1
    print("[OK] .gitignore preflight passed")
    if not (ROOT / "pnpm-lock.yaml").is_file():
        print("[WARN] pnpm-lock.yaml missing; run pnpm install before first commit/CI")
    print("Next: git add . ; git status --short ; git commit -m 'chore: 初始化雀变 Git 仓库'")
    print("Then create an empty GitHub repository and push origin/main (see docs/github.md).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
