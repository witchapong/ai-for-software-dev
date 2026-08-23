## Headline rates

| Model | Unaided | Working app | Median requests | Median input tokens | Median minutes |
|---|---|---|---|---|---|
| mistral-devstral-medium-latest-strict | 0/1 (0%) | 0/1 (0%) | 38 | 310,783 | 16.0 |

## Where runs broke

| Model | Gate 2 spec | Gate 3 plan | Gate 4 maths | Gate 4 page |
|---|---|---|---|---|
| mistral-devstral-medium-latest-strict | 1/1 | 1/1 | 0/1 | 1/1 |

## Problems reported, most common first

- (1x) N/N tests pass

## Budget

Measured requests per run: **38**

| Model | Daily free ceiling | Runs affordable per day |
|---|---|---|
| Gemini (current Flash) | 250 requests | 6 |
| Mistral Experiment | no daily cap | clock-limited |

## Harness errors

- (1x) finishReason=aborted
- (1x) run timed out after 420s

## Message subtypes seen (schema sanity check)

- `agent_event`: 1348
- `hook_event`: 82
- `run_result`: 4
- `error`: 1

---

# Phase B calibration — findings

**Run 1, `mistral` / `devstral-medium-latest`, strict mode, 21 Aug 2026.**
One run. Diagnostic, not a pass rate — N=1 cannot estimate a probability.

## Per-gate detail

| Gate | Result | Iterations | Input tokens | Time |
|---|---|---|---|---|
| 1 — spec | ✅ pass | 6 | 47,091 | 81s |
| 2 — plan | ✅ pass | 6 | 44,091 | 108s |
| 3 — maths | ❌ **5/7 tests** | 11 | 85,356 | 193s |
| 4 — page | ✅ pass | 15 | 134,245 | 576s (hit the timeout, but had already written the file) |
| **Total** | | **38** | **310,783** | **16 min** |

## The budget question this phase existed to answer

**38 requests and ~311k input tokens per scripted run.** Well under the 40–80
estimate. But this is the *floor*, not a student's usage: four scripted prompts
with no follow-ups, no hand-correction of `requirements.md`, no exploration. A
student does far more. Treat 38 as "the happy path costs this much".

Input tokens, not request count, are the real currency — ~45k per gate, mostly
system prompt and tool definitions re-sent every call. Mistral's monthly
allowance is nowhere near binding at this rate.

## Finding 1 — the agent wrote its own test, passed it, and was wrong

Gate 3's prompt said to run `pytest tests/test_spectrum.py`. **It never did.**
There is not one command execution in the log. Instead it wrote an ad-hoc test
script, ran that, and reported:

> *"The manual tests have passed, confirming that the implementation is correct
> and meets the requirement that a tone at amplitude 1.0 reads back as 1.0."*

Two of the seven supplied tests were failing at that moment.

This violates `.clinerules` — *"Never claim success you have not verified by
running something"* — in the most slippery possible way: it **did** run
something. Its own test, covering only what it had thought of.

**Fix applied:** the gate 3 prompt now names the exact command, demands the
output verbatim, and forbids substituting a self-written script. To be
re-measured in Phase C.

**Why this matters beyond the eval.** It is the argument for handing students
acceptance tests rather than letting the agent invent its own. An agent's
self-written tests encode its own misunderstanding, so they pass. Ours did not.

## Finding 2 — the lab's central trap fired, exactly as designed

The agent got the famous `2/n` FFT scaling **right**: a 1.0 V tone reads back as
1.000. What it missed:

| Test | Expected | Agent produced |
|---|---|---|
| DC offset appears at 0 Hz | 2.000 | **4.000** — doubled the zero-hertz term, which is not half of a conjugate pair |
| Negative sampling rate rejected | `ValueError` | accepted silently |

A student looking at this app sees two spikes at the right frequencies and the
right heights. Everything visible is correct. Only a test catches it.

That is the takeaways slide, demonstrated by the model students will actually
use: *looking right and being right differ, and only one survives a test.*

**5/7 is also the right difficulty** — the agent does the bulk, and the student
debugs two real, comprehensible failures. The implementation is preserved at
`eval/findings/agent-spectrum-run1.py`; it is better teaching material than an
invented bug because the mistake is authentic.

## Finding 3 — `-t` does not stop a run cleanly

Gate 4 was given `-t 420` and ran **576 seconds** before aborting. It had
already written a valid page, so the gate passed, but a timeout that overruns by
37% cannot be relied on to bound a loop. Budget wall-clock accordingly.

## Carried forward to Phase C

1. Re-measure gate 3 with the hardened prompt.
2. Raise `GATE_TIMEOUT` above 420s, or accept that gate 4 needs ~10 minutes.
3. Then, and only then, run 3× for an actual rate.


---

# Phase C spot-check — the pytest fix, 23 Aug 2026

Gate 3 only, `mistral` / `devstral-medium-latest`, starting from the golden
plan and the shipped stub.

| | Original prompt | Hardened prompt |
|---|---|---|
| Tests passing | **5/7** | **7/7** |
| Ran the supplied suite | No — wrote its own | **Yes** |
| Iterations | 11 | 16 |
| Input tokens | 85,356 | 207,041 |

Naming the exact command, demanding the output verbatim, and forbidding a
self-written substitute changed the outcome completely. The agent now iterates
until the supplied tests pass instead of stopping at its own. It costs 2.4× the
tokens because it is doing the work it previously skipped.

**A second change was needed and is easy to miss.** Shipping the stub means
`core/spectrum.py` now exists, so gate 3 is a *replace*, not a *create* — which
is exactly the operation that triggers Cline's diff-edit failures. The prompt
now says the stub exists and to overwrite the whole file in one go. Without
that line the fix is only half made.

**Pedagogical note, deliberately not "fixed".** 7/7 is the right target for the
eval, which measures whether the toolchain can do the job. It is not obviously
the right student experience: the 5/7 run left a doubled DC term and a missing
input guard, both instructive, both invisible on the chart. A student whose
agent scores 7/7 first time learns less about verification than one who debugs
those two. The prompts shipped to students are the hardened ones — but expect,
and welcome, runs that land short.
