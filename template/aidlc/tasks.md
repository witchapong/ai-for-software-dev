# Gate 3 — Task list

Your agent drafts this. You correct it and approve it.

**The one rule that matters:** every task names exactly ONE owner and touches
exactly ONE file that no other task touches. This is what lets four people
build at the same time without their work colliding.

**The second rule:** every task has a **Done when** copied from
`aidlc/requirements.md` — and it must be one that could fail. A task owning a
file under `pages/` gets an EYES criterion, because no test opens a page. A
task with no Done when is a task that can never be wrong, and it will be.

| # | Task | Owner | The ONE file it touches | Done when |
|---|---|---|---|---|
| 1 | | | `core/....py` | `pytest test_...` |
| 2 | | | `pages/N_....py` | `EYES: ...` |

One row per task, and no more. **Lab 1 has exactly two.** The group project has
one per person. Delete any row you do not use — a row naming a file nobody owns
is worse than no row at all.

**Approved by:**
**Date:**
