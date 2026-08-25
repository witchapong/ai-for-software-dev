# Project briefs

Pick one. Each has been checked to fit the template, the time you have, and the
free tools we are using.

| # | Project | In one sentence |
|---|---|---|
| 1 | Campus Carpool Board | Post and book seats on rides to the remote campus, without overselling a car |
| 2 | Study Session Finder | Post group study sessions and join them, without double-booking yourself |
| 3 | Tutoring Matcher | Offer and request help by subject, and match them even when people name subjects differently |
| 4 | Dorm Roommate Matcher | Fill in a lifestyle profile and get compatibility scores with other students |
| 5 | Dorm Bill Splitter | Track shared expenses and split them so every satang is accounted for |

**Want to build your own idea?** Allowed, with one condition: get the instructor
to confirm it fits the template — pages, a data shape, saved records, and
optionally one AI feature. If your idea does not fit that shape, it will not
finish in the time available.

Every brief has an **AI feature** section. That is what you build in Session 3.
It is a bonus, not a requirement — a working project without it beats a broken
project with it.

## What every brief has in common

Read this before picking. It is the shape your project must take, whichever one
you choose.

| Part | What it means for you |
|---|---|
| **Pages** | One file in `pages/`. One owner. This is how four people build at once |
| **A data shape** | One dataclass in `core/models.py`, like the `Item` example |
| **Storage** | `core/storage.py` already saves and loads CSV. You should not need to change it |
| **The hard part** | Every brief has one genuinely tricky rule. That is where your tests go |

The briefs suggest four pages because a team is three or four people. Fewer
people, fewer pages — cut a page rather than sharing a file.

The hard parts are deliberately different from each other: a capacity rule, a
time-overlap rule, a fuzzy-matching rule, a symmetry rule, and a rounding rule.
Whichever you pick, you meet one real class of bug that looks fine on screen
and only a test catches.

## What "finished" looks like

The bar is a **working prototype a stranger can click through** — not a
product. Concretely, by demo day:

- Every page works end to end: enter data, see it again, act on it.
- **The hard part is enforced, visibly.** You can trigger the refusal live —
  book the fourth seat, join the clashing session — and the message says why.
- `pytest` is green, and at least one test is the hard-part test.
- The app is live at a public URL, and every teammate can explain their page.

Expect roughly 300–600 lines of Python across the whole team. If you are far
past that, you are probably building out of scope.

**Deliberately out of scope, for every brief:** login and accounts, payments,
notifications, a real database, mobile layout, and custom styling — Streamlit's
default look is the expected look. Time spent on any of these is time taken
from the hard part.

One honest limitation to know about: Streamlit Cloud's storage is temporary,
so CSV data can reset when the app redeploys. That is fine at this bar — your
demo runs live anyway — and worth one sentence if anyone asks.

## Two teams, same brief?

Fine — expected, even. Three things keep you distinct:

1. **Your twist.** Gate 1 requires your `intent.md` to name one feature or
   variation of your own invention that is not in the brief. Small is fine;
   yours is the point.
2. **The hard parts have no single right answer.** Two matchers with different
   rules are different products. Defend yours.
3. **Demo day is side by side.** Same problem, different decisions, is the
   most interesting comparison in the room. The peer form asks what each team
   *added* — that is where you win it.
