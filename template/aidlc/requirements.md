# Gate 2 — Requirements

Your agent drafts this. You correct it and approve it.

A requirement is only finished when its acceptance criterion **could fail**.
"The app should be user friendly" could never fail. "Booking a taken slot shows
the message 'already booked'" could.

There are exactly two kinds of criterion, and a good spec has both:

| Kind | Write it like this | Use it for |
|---|---|---|
| A test | `pytest test_a_50_hz_sine_peaks_at_50_hz` | anything the test suite already checks |
| A person | `EYES: with 50 Hz at 1.0, the tallest spike sits at 50 on the x-axis and reaches 1.0 on the y-axis` | anything on the screen |

**No test in this repository opens a page.** So every requirement about what
the app *looks like* is an EYES criterion, and if you have none, your spec
cannot see the half of the app your user actually uses.

An EYES criterion names what to open, what to set, and what number to read. If
it says "the chart looks right", it could never fail, so it is not a criterion.

| # | Requirement | Acceptance criterion (how we check it) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

**Approved by:** (your name)
**Date:**
