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
