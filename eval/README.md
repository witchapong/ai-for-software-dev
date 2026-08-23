# Lab 1 reliability eval

Answers one question with a measurement instead of a guess: **can Cline, driven
by a free-tier model, build Lab 1 from our prompts?**

Full method in `docs/superpowers/plans/2026-08-17-workshop-materials.md`,
Task 9A. Five phases: author, calibrate, improve, certify, reference path.

## Status

| Phase | State |
|---|---|
| A — Author the prompts and harness | **Done.** Everything below is built and self-tested |
| B — Calibrate (1 run) | **Done, 21 Aug 2026.** 38 requests, 311k input tokens, 16 min per run. See `REPORT.md` |
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

```bash
npm i -g cline                             # harness. Verified at 3.0.55
set -a && source template/.env && set +a
export AGENT_KEY="$MISTRAL_API_KEY"        # -k overrides any stored provider key
export EVAL_PYTHON=/opt/homebrew/bin/python3.12   # template needs 3.11+; system python3 is 3.9
./eval/run_lab1.sh mistral codestral-latest 3 strict
python3 eval/score.py
```

Ideally run inside a Codespace on the published template, so the container is
the one students get.

### Verified CLI facts — Cline 3.0.55, 20 Aug 2026

Recorded here so Phase C does not rediscover them.

| Thing | Value |
|---|---|
| Provider id for Mistral | `mistral` (not `mistralai`) |
| Working models | `codestral-latest`, `devstral-medium-latest`, `mistral-medium-latest` |
| Flags used | `--json`, `--auto-approve`, `-c/--cwd`, `-P/--provider`, `-m/--model`, `-k/--key`, `-t/--timeout` |
| Gemini | **Unusable.** See the spec — retired model plus a credit-flagged free tier |

**The JSON schema is not the one in the pptx-skill docs.** There are no
`say`/`ask` subtypes. Real events:

```json
{"type":"agent_event","event":{"type":"iteration_start","iteration":1}}
{"type":"run_result","finishReason":"completed","iterations":2,
 "usage":{"inputTokens":10810,"outputTokens":38,"totalCost":0},"durationMs":16}
{"type":"error","message":"..."}
```

One model request is one **iteration**, and `run_result` carries the totals
directly — better than counting messages. `score.py` parses this.

**Baseline overhead:** asking Cline to create a one-word text file cost
**2 iterations and 10,810 input tokens**. Almost all of that is the system
prompt and tool definitions, re-sent every call. That is the floor under any
per-request estimate.

## Prompt wording decides tool use — the first real finding

The first calibration run scored **0/4 gates**. Not one file was written. The
model replied in chat instead:

> *"I'm here to help, but I currently don't have the capability to directly
> create files or run tests on your system."*

That is a false statement about its own abilities, and it was **caused by the
prompt, not the model.** The same model, same harness, same task, with the
prompt reworded, passed the gate cleanly.

| Wording that failed | Wording that worked |
|---|---|
| "Draft `aidlc/requirements.md`" | "use your file-writing tool to **WRITE** the file `aidlc/requirements.md`" |
| "Then stop and wait for my approval" | *removed* — the model stopped **instead of** acting |
| "Do not create any Python file yet" | "Do not write any `.py` file" — the original read as *do not create files* |
| — | "Do not print the table in your reply instead of writing it" |

Four rules, now applied to all four gate prompts:

1. **Name the tool.** "Use your file-writing tool to WRITE …" beats "draft" or
   "create", both of which a weak model satisfies by talking.
2. **Never say "wait for approval" in a prompt.** `.clinerules` already enforces
   the gate. In the prompt it reads as *do nothing yet*.
3. **Scope every prohibition precisely.** "No Python file yet" generalised to
   "no files".
4. **Forbid the near-miss explicitly.** Saying "do not print it instead of
   writing it" closes the failure the other three still allow.

This is what Phase C's attribution step is for: the symptom was *"the model
cannot use tools"*, and the cause was four words in a prompt. Reaching for a
different model first would have wasted a day and taught nothing.

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
