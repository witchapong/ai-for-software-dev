"""Aggregate eval runs into a per-gate table and two headline rates.

Usage: python3 eval/score.py

Reports two numbers, not one:
  unaided  - all four gates green with no help
  working  - a passing app at the end (in assisted mode, after recovery)

The second is the classroom-relevant figure, because per-gate recovery is what
stops failure compounding across four gates.
"""

import json
import re
import statistics
from collections import Counter
from pathlib import Path

RESULTS = Path(__file__).parent / "results"
TOTAL_TESTS = 7
REQUEST_SUBTYPE = "api_req_started"  # confirm in Phase B; change if different
GATE_NAMES = {1: "Gate 2 spec", 2: "Gate 3 plan", 3: "Gate 4 maths", 4: "Gate 4 page"}


def read_run(log: Path) -> dict:
    stem = log.stem
    subtypes: Counter = Counter()
    for line in log.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            message = json.loads(line)
        except json.JSONDecodeError:
            continue
        key = message.get("say") or message.get("ask")
        if key:
            subtypes[key] += 1

    gates, problems = {}, []
    gates_file = RESULTS / f"{stem}.gates"
    if gates_file.exists():
        for line in gates_file.read_text(encoding="utf-8").splitlines():
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            gates[record["gate"]] = record["passed"]
            problems += record["problems"]

    report_path = RESULTS / f"{stem}.pytest"
    report = report_path.read_text(encoding="utf-8") if report_path.exists() else ""
    match = re.search(r"(\d+) passed", report)
    passed = int(match.group(1)) if match else 0

    seconds_path = RESULTS / f"{stem}.seconds"
    seconds = int(seconds_path.read_text().strip()) if seconds_path.exists() else 0

    return {
        "model": stem.rsplit("-run", 1)[0],
        "gates": gates,
        "red_gates": sum(1 for ok in gates.values() if not ok),
        "green": passed == TOTAL_TESTS,
        "requests": subtypes.get(REQUEST_SUBTYPE, 0),
        "seconds": seconds,
        "problems": problems,
        "subtypes": subtypes,
    }


def main() -> None:
    runs = [read_run(log) for log in sorted(RESULTS.glob("*.jsonl"))]
    if not runs:
        print("No results found. Run eval/run_lab1.sh first.")
        return

    by_model: dict[str, list[dict]] = {}
    for run in runs:
        by_model.setdefault(run["model"], []).append(run)

    print("## Headline rates\n")
    print("| Model | Unaided (all gates green) | Working app | Median requests | Median minutes |")
    print("|---|---|---|---|---|")
    for model, group in sorted(by_model.items()):
        unaided = sum(1 for r in group if r["red_gates"] == 0)
        working = sum(1 for r in group if r["green"])
        n = len(group)
        print(
            f"| {model} | {unaided}/{n} ({unaided / n:.0%}) | {working}/{n} ({working / n:.0%}) "
            f"| {statistics.median(r['requests'] for r in group):.0f} "
            f"| {statistics.median(r['seconds'] for r in group) / 60:.1f} |"
        )

    print("\n## Where runs broke\n")
    print("| Model | " + " | ".join(GATE_NAMES.values()) + " |")
    print("|---|" + "---|" * len(GATE_NAMES))
    for model, group in sorted(by_model.items()):
        cells = [f"{sum(1 for r in group if r['gates'].get(g))}/{len(group)}" for g in GATE_NAMES]
        print(f"| {model} | " + " | ".join(cells) + " |")

    print("\n## Problems reported, most common first\n")
    tally = Counter(
        re.sub(r"\[.*?\]|\d+", "N", problem) for run in runs for problem in run["problems"]
    )
    for problem, count in tally.most_common(20):
        print(f"- ({count}x) {problem}")

    print("\n## Budget\n")
    per_run = statistics.median(r["requests"] for r in runs) if runs else 0
    print(f"Measured requests per run: **{per_run:.0f}**\n")
    print("| Model | Daily free ceiling | Runs affordable per day |")
    print("|---|---|---|")
    if per_run:
        print(f"| Gemini 2.5 Flash | 250 requests | {250 // per_run} |")
        print("| Mistral Experiment | no daily cap | clock-limited |")
    else:
        print("| — | — | no requests counted; check REQUEST_SUBTYPE below |")

    print("\n## Message subtypes seen (sanity check for REQUEST_SUBTYPE)\n")
    combined: Counter = Counter()
    for run in runs:
        combined.update(run["subtypes"])
    for name, count in combined.most_common(15):
        print(f"- `{name}`: {count}")


if __name__ == "__main__":
    main()
