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
| 1 | | | `pages/1_....py` | `EYES: ...` |
| 2 | | | `pages/2_....py` | `EYES: ...` |
| 3 | | | `core/models.py` | `pytest ...` |
| 4 | | | `core/storage.py` | `pytest ...` |

**Approved by:**
**Date:**
