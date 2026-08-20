# AI for Software Development — workshop materials

A three-session, nine-hour hands-on workshop teaching 3rd-year electrical
engineering undergraduates to build and ship software with an AI coding agent.
Roughly 70% lab, 30% lecture, on free-tier tools inside a browser.

## What is here

| Path | What it is |
|---|---|
| `docs/superpowers/specs/` | The workshop design: sessions, labs, tooling decisions, assessment |
| `docs/superpowers/plans/` | The implementation plan for building every artifact |
| `template/` | The student project template — published separately as a GitHub template repository |
| `slides/` | Lecture decks and the PptxGenJS generator that builds them |
| `resources/` | Source material: AI-DLC notes and reference decks |
| `SLIDE-STYLE.md` | Slide design spec — the authority for anything in `slides/` |
| `CLAUDE.md` | Conventions for working in this repo |

## The three sessions

| | Topic | Lab |
|---|---|---|
| **1** | How an agent works; the Four Gates | Build a two-tone spectrum analyser, twice — once by asking, once through the gates |
| **2** | Requirements, decomposition, version control | Teams start the group project; one file per owner, parallel branches |
| **3** | Building with language models | Add an AI feature, then demo |

## Status

| Item | State |
|---|---|
| Workshop design spec | Complete |
| Implementation plan | Complete — 16 tasks |
| `template/` (Session 1 scope) | Built. 25 tests pass; Streamlit app verified |
| Session 1 deck | Built. 22 slides, validated and rendered |
| Session 2 and 3 decks | Not started |
| Task 9A — reliability eval and golden set | Not started. **Blocking**: it picks the model on evidence and produces the fallback artifacts the labs depend on |
| Lab-PC pilot | Not run. Two checks can invalidate the browser-only approach |

## Working on the template

```bash
cd template
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python -m pytest -m "not live"     # 25 tests
.venv/bin/python -m streamlit run app.py
```

## Working on the slides

```bash
cd slides && npm install
node session1.js                              # writes the .pptx
```

Then run the three-step QA in `CLAUDE.md` — schema validation, content check,
and a visual render. All three, every time.
