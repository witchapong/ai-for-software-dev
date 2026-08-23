#!/usr/bin/env bash
# Verify template/ actually works in the container students get.
#
# Run this after ANY change to requirements.txt or devcontainer.json.
#
# Why it exists: numpy was pinned to 2.5.2, which has no Python 3.11 build.
# Local tests passed because the local venv is 3.12. Every student Codespace
# failed at postCreateCommand, and because that command was an && chain, .env
# was never created either. Nothing caught it until a Codespace was opened by
# hand. This script catches it in about a minute.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
IMAGE=$(python3 -c "import json;print(json.load(open('template/.devcontainer/devcontainer.json'))['image'])")
echo "Testing against $IMAGE — the image the devcontainer actually specifies"

docker run --rm -v "$PWD/template:/w" -w /w "$IMAGE" bash -c '
  set -e
  python --version
  echo "--- installing pinned requirements ---"
  pip install -q --no-cache-dir -r requirements.txt
  echo "--- postCreateCommand, exactly as devcontainer.json runs it ---"
  cp -n .env.example .env
  test -f .env && echo ".env created"
  echo "--- tests ---"
  python -m pytest -m "not live" -q
'
echo
echo "PASS - the container builds, dependencies resolve, and the tests run."
