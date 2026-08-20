#!/usr/bin/env bash
# Run Lab 1 end to end for one model, scoring each gate as it goes.
#
# Usage: ./eval/run_lab1.sh <provider> <model> [runs] [strict|assisted]
#   strict   - no help; measures the unaided rate
#   assisted - restore golden artifacts after any failed gate; measures the
#              rate students will actually see, since they can do the same
#
# Run this INSIDE a Codespace on the published template, so the container is
# the one students get. See CLAUDE.md.
set -euo pipefail

PROVIDER="${1:?usage: run_lab1.sh <provider> <model> [runs] [strict|assisted]}"
MODEL="${2:?missing model}"
RUNS="${3:-3}"
MODE="${4:-strict}"
ROOT="$(git rev-parse --show-toplevel)"
TAG="${PROVIDER}-${MODEL//\//_}-${MODE}"
GOLDEN="$ROOT/eval/golden/lab1"
PYTHON="${EVAL_PYTHON:-python3}"
GATE_TIMEOUT="${GATE_TIMEOUT:-600}"   # seconds per gate; a hung call must not stall the loop
AGENT_KEY="${AGENT_KEY:-}"            # optional: overrides the provider's stored key
mkdir -p "$ROOT/eval/results"

command -v cline >/dev/null || { echo "cline not installed: npm i -g cline"; exit 1; }

for i in $(seq 1 "$RUNS"); do
  WORK="$(mktemp -d)"
  cp -R "$ROOT/template/." "$WORK/"
  rm -rf "$WORK/.venv"
  # The agent must build these two. The tests stay - they are the contract.
  rm -f "$WORK/core/spectrum.py" "$WORK/pages/2_Spectrum_Analyzer.py"
  cp "$ROOT/eval/fixtures/intent.md" "$WORK/aidlc/intent.md"

  "$PYTHON" -m venv "$WORK/.venv"
  "$WORK/.venv/bin/pip" -q install -r "$WORK/requirements.txt"

  LOG="$ROOT/eval/results/${TAG}-run${i}.jsonl"
  GATES="$ROOT/eval/results/${TAG}-run${i}.gates"
  : > "$LOG"; : > "$GATES"
  START=$(date +%s)

  GATE=0
  for prompt in "$ROOT"/eval/prompts/*.md; do
    GATE=$((GATE + 1))
    echo "  [run $i] gate $GATE: $(basename "$prompt")"
    cline --json --auto-approve true -P "$PROVIDER" -m "$MODEL" -c "$WORK" \
      ${GATE_TIMEOUT:+-t "$GATE_TIMEOUT"} ${AGENT_KEY:+-k "$AGENT_KEY"} \
      "$(cat "$prompt")" >> "$LOG" 2>&1 || echo "    (cline exited non-zero)"

    RESULT="$("$PYTHON" "$ROOT/eval/check_gate.py" "$WORK" "$GATE")"
    echo "$RESULT" >> "$GATES"
    echo "    $RESULT"

    if [ "$MODE" = "assisted" ] && ! echo "$RESULT" | grep -q '"passed": true'; then
      "$PYTHON" "$ROOT/eval/restore_golden.py" "$WORK" "$GATE" "$GOLDEN"
    fi
  done

  echo "$(( $(date +%s) - START ))" > "$ROOT/eval/results/${TAG}-run${i}.seconds"
  ( cd "$WORK" && .venv/bin/python -m pytest tests/test_spectrum.py -q ) \
    > "$ROOT/eval/results/${TAG}-run${i}.pytest" 2>&1 || true
  echo "run $i: $(tail -1 "$ROOT/eval/results/${TAG}-run${i}.pytest")"

  # Keep the gate documents of green runs - Phase C captures golden from these.
  if grep -q "7 passed" "$ROOT/eval/results/${TAG}-run${i}.pytest"; then
    mkdir -p "$ROOT/eval/results/${TAG}-run${i}-artifacts"
    cp "$WORK"/aidlc/*.md "$ROOT/eval/results/${TAG}-run${i}-artifacts/"
  fi
  rm -rf "$WORK"
done

echo
echo "Done. Score it with:  python3 eval/score.py"
