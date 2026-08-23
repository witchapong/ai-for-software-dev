#!/usr/bin/env bash
# Publish template/ as the student-facing GitHub template repository.
#
# Run from the repository root. Safe to re-run.
#
#   main             what students get: the acceptance tests and a stub for
#                    each file Lab 1 asks them to build. No solutions.
#   solution/lab1    core/spectrum.py, the analyser page, and the golden
#                    gate documents a stuck student restores.
#
# History is preserved across runs, so an existing clone or Codespace can
# `git pull` an update instead of being recreated. An earlier version of this
# script force-pushed a fresh history each time, which left every existing
# clone with no tracking branch and no way to pull.
set -euo pipefail

REPO="ai-workshop-template"
# Prefer the owner already recorded in git config; fall back to the API only
# if we have never published. Repeated `gh api user` calls trip GitHub's
# secondary rate limit during rapid re-publishes.
OWNER="${TEMPLATE_OWNER:-$(git config --get remote.origin.url 2>/dev/null | sed -E 's#.*[:/]([^/]+)/[^/]+$#\1#')}"
[ -n "$OWNER" ] || OWNER="$(gh api user --jq .login)"
REPO_ROOT="$(pwd)"
WORK="$(mktemp -d)"

[ -d "$REPO_ROOT/template" ] || { echo "run me from the repository root"; exit 1; }

if git ls-remote "https://github.com/$OWNER/$REPO.git" >/dev/null 2>&1; then
  echo "Cloning existing $OWNER/$REPO to preserve history"
  git clone -q "https://github.com/$OWNER/$REPO.git" "$WORK"
  cd "$WORK"
  git checkout -q main
  # Drop tracked files so deletions propagate, then restore from template/.
  git rm -rq --ignore-unmatch . >/dev/null
else
  echo "Creating $OWNER/$REPO"
  cd "$WORK" && git init -q -b main
fi

cp -R "$REPO_ROOT/template/." "$WORK/"
cd "$WORK"
rm -rf .venv data .env

# --- main: the tests, but stubs where the answers would be -------------------
# A stub matters more than an absence: without core/spectrum.py, pytest fails
# at collection and runs ZERO tests, so a student's first `pytest` looks like a
# broken template. With the stub they get "7 failed, 18 passed" and the failing
# list is their specification.
cp "$REPO_ROOT/scripts/stubs/spectrum.py" core/spectrum.py
rm -f pages/2_Spectrum_Analyzer.py

git add -A
git commit -q -m "Workshop project template" 2>/dev/null || echo "  (main unchanged)"

# --- solution/lab1: the real implementation and the golden gate documents ----
git checkout -q -B solution/lab1
cp "$REPO_ROOT/template/core/spectrum.py" core/spectrum.py
cp "$REPO_ROOT/template/pages/2_Spectrum_Analyzer.py" pages/
if compgen -G "$REPO_ROOT/eval/golden/lab1/*.md" > /dev/null; then
  cp "$REPO_ROOT"/eval/golden/lab1/*.md aidlc/
else
  echo "  WARNING: eval/golden/lab1 is empty - students get no gate recovery."
fi
git add -A
git commit -q -m "Lab 1 reference solution and golden gate documents" 2>/dev/null || echo "  (solution/lab1 unchanged)"
git checkout -q main

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "$OWNER/$REPO" --public \
    --description "Student project template for the AI for Software Development workshop"
  git remote add origin "https://github.com/$OWNER/$REPO.git"
fi

# main is never force-pushed: existing clones and Codespaces must be able to
# pull. solution/lab1 is regenerated from main on every publish and nobody
# commits to it, so forcing that one is both safe and necessary.
git push -q origin main
git push -q --force origin solution/lab1
gh repo edit "$OWNER/$REPO" --enable-issues=false --template
cd "$REPO_ROOT" && rm -rf "$WORK"
echo "Published: https://github.com/$OWNER/$REPO"
