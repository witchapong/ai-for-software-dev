# Project briefs

Pick one. Each has been checked to fit the template, the time you have, and the
free tools we are using.

| # | Project | In one sentence |
|---|---|---|
| 1 | Lab Equipment Booking | Book benches and instruments so two people never turn up for the same oscilloscope |
| 2 | Component Inventory and BOM Helper | Track what parts are in stock and check whether a project can be built from them |
| 3 | Energy Usage and Tariff Tracker | Log appliance usage, work out the monthly bill, compare tariffs |
| 4 | Capstone Project Matcher | Post project ideas and find teammates with the skills you need |
| 5 | Solar Panel Sizing Service | Enter a site and a load, get a panel and battery recommendation you can save |

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
