# Lab 1 reliability eval

Answers one question with a measurement instead of a guess: **can Cline, driven
by a free-tier model, build Lab 1 from our prompts?**

Full method in `docs/superpowers/plans/2026-08-17-workshop-materials.md`,
Task 9A. Five phases: author, calibrate, improve, certify, reference path.

## Status

| Phase | State |
|---|---|
| A — Author the prompts and harness | **Done.** Everything below is built and self-tested |
| B — Calibrate (1 run) | Not run. Needs API keys and the Cline CLI |
| C — Improve (24 h budget) | Not started |
| D — Certify (2 hand-runs) | Not started |
| E — Reference path | Done — `template/labs/EXPLAIN.md` shipped with Session 1 |

## What is here

| File | What it does |
|---|---|
| `prompts/0N-*.md` | The four gate prompts, one `cline` invocation each |
| `fixtures/intent.md` | The Gate 1 document a student would have written |
| `check_gate.py` | Scores one gate. Prints JSON |
| `restore_golden.py` | Drops a gate's golden artifact in, as a stuck student would |
| `run_lab1.sh` | Runs N complete attempts, scoring each gate as it goes |
| `score.py` | Aggregates results into rates, a per-gate breakdown, and a budget |
| `golden/lab1/` | The fallback gate documents. **Provisional** — see below |

## Running it

Prerequisites, none of which exist yet:

```bash
npm i -g cline                    # the harness
cline auth                        # or set the provider's key in the environment
```

Then, ideally inside a Codespace on the published template so the container
matches the students':

```bash
./eval/run_lab1.sh mistral codestral-latest 3 strict
python3 eval/score.py
```

Provider and model identifiers are whatever `cline --help` reports — record the
real ones here in Phase B rather than trusting the examples above.

## Reading the output

Two headline numbers, and the second matters more:

- **Unaided** — all four gates green with no help.
- **Working app** — a passing test suite at the end. In `assisted` mode that
  includes runs rescued by a golden artifact, which is what a student can do.

Failure compounds across four gates: at 85% per gate, unaided end-to-end is only
52%. Per-gate recovery is what makes the lab survivable, so `assisted` is the
classroom-relevant figure.

## About `golden/lab1/`

**Golden prompts are authored. Golden artifacts are captured.** The prompts in
`prompts/` are written by us and identical for every student. The gate documents
in `golden/lab1/` should be lifted from a real run that went well, because
students should recognise them as the sort of thing their own agent produces.

The set currently there is **hand-written and provisional**, so the recovery
path works before Phase C has run. Phase C replaces it with a captured set:
green runs save their `aidlc/*.md` into `results/<tag>-runN-artifacts/`.

## Self-tests already run

The harness was checked before any model touched it:

- `check_gate.py` correctly fails all four gates against the untouched template,
  fails gates 1 and 2 when code exists prematurely, and passes gates 1 and 2
  against the filled-in golden documents.
- `score.py` was run against three synthetic runs with known outcomes and
  reproduced every figure — rates, per-gate breakdown, medians, and the
  requests-per-day arithmetic.

A gate checker that cannot fail is worth nothing, so both directions were
tested, not just the happy path.
