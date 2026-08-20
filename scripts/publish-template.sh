#!/usr/bin/env bash
# Publish template/ as the student-facing GitHub template repository.
#
# Run from the repository root. Safe to re-run: it force-updates all branches.
#
#   main             what students get - no solutions, but the acceptance tests
#   solution/lab1    core/spectrum.py, the page, and the golden gate documents
#   solution/lab3    the LLM helpers (added when Session 3 is built)
set -euo pipefail

REPO="ai-workshop-template"
OWNER="$(gh api user --jq .login)"
REPO_ROOT="$(pwd)"
WORK="$(mktemp -d)"

[ -d "$REPO_ROOT/template" ] || { echo "run me from the repository root"; exit 1; }

echo "Staging template/ into $WORK"
cp -R "$REPO_ROOT/template/." "$WORK/"
rm -rf "$WORK/.venv" "$WORK/data" "$WORK/.env"
cd "$WORK"

git init -q -b main
git add -A
git commit -q -m "Workshop project template"

git branch solution/lab1

# solution/lab1 also carries the golden gate documents - what a stuck student
# restores with git checkout.
if compgen -G "$REPO_ROOT/eval/golden/lab1/*.md" > /dev/null; then
  git checkout -q solution/lab1
  cp "$REPO_ROOT"/eval/golden/lab1/*.md aidlc/
  git add aidlc/
  git commit -q -m "Add golden gate artifacts for Lab 1"
  git checkout -q main
else
  echo "WARNING: eval/golden/lab1 is empty - publishing without gate recovery."
fi

# main must not ship the answers.
# tests/test_spectrum.py deliberately STAYS: it is the acceptance specification
# students are given, not an answer.
git rm -q core/spectrum.py pages/2_Spectrum_Analyzer.py
git commit -q -m "Remove reference solutions from main"

if ! gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "Creating $OWNER/$REPO"
  gh repo create "$OWNER/$REPO" --public \
    --description "Student project template for the AI for Software Development workshop"
fi

git remote add origin "https://github.com/$OWNER/$REPO.git"
git push -q --force origin main solution/lab1

gh repo edit "$OWNER/$REPO" --enable-issues=false --template
cd "$REPO_ROOT" && rm -rf "$WORK"
echo "Published: https://github.com/$OWNER/$REPO"
