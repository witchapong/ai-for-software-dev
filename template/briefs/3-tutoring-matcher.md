# Brief 3 — Tutoring Matcher

## The situation

Some students are good at circuits and terrible at calculus; for others it is
the reverse. Everyone would trade an hour of help for an hour of help, but
finding each other relies on luck.

## What you are building

A web app where students offer help in subjects they are strong in and request
help in subjects they are not — and the app pairs them up.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| Offer help | Your name, subject, level, when you are free |
| Request help | Subject you need, what you are stuck on |
| Matches | Requests paired with offers for the same subject |
| Browse everything | All open offers and requests |

## Suggested data

One row per offer: `id`, `tutor_name`, `subject`, `note`, `available`.

One row per request: `id`, `student_name`, `subject`, `note`.

## The hard part

**People name the same subject differently, and your matcher must cope.**
"Calc 2", "Calculus II" and "calculus 2" are one subject. So are "EM" and
"electromagnetics" — or are they? You decide.

Pick your rule — lowercase and strip spaces? a synonym table you maintain? —
write it in `design.md`, and test it:

> A request for "calc 2" matches an offer for "Calculus II".

There is no perfect answer here, which is the point. Pick a rule you can defend
and that your test can check. A rule you cannot test is not a rule.

## If your team is fast

- **Trade balance.** Track hours given against hours received per student, so
  the same three people do not do all the tutoring.
- **Availability overlap.** Match only when tutor and student share a free
  slot — the study-session brief's interval logic, coming to you.
- **A leaderboard.** Most generous tutors this month.

## AI feature for Session 3

This is the brief where the AI genuinely solves the hard part rather than
decorating it: let the model normalise free-text subjects into your canonical
list using structured output, and explain each match in one sentence. Compare
its matching against your hand-written rule — which one is right more often?
