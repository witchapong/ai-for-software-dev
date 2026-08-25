# Brief 4 — Dorm Roommate Matcher

## The situation

Every year, students pick dorm roommates nearly at random and spend two
semesters discovering that one of them sleeps at 21:00 and the other starts
gaming at midnight.

## What you are building

A web app where students fill in a short lifestyle profile and see how
compatible they are with other students looking for a roommate.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| My profile | Sleep time, tidiness 1–5, noise tolerance 1–5, AC preference, study-in-room or not |
| Browse students | Everyone looking, with their headline answers |
| Compatibility | Any two students, their score, and which answers clash |
| Best matches | For me: everyone ranked by score |

## Suggested data

One row per profile: `id`, `name`, `sleep_time`, `tidiness`, `noise_tolerance`,
`ac_preference`, `studies_in_room`.

## The hard part

**Your compatibility score must be symmetric and defined.** Symmetric means
score(A, B) equals score(B, A) — if Ploy is 78% compatible with Beam, Beam is
78% compatible with Ploy. Sounds obvious; asymmetric scoring bugs are
embarrassingly common when weights get involved.

Decide the formula — how much is a one-hour sleep difference worth against a
two-point tidiness gap? — write it in `design.md`, and test both properties:

> Two identical profiles score 100. And for any two profiles, score(A, B)
> equals score(B, A).

That second test is different from every other test you have written: it
checks a *property* of the formula, not one example. Ask your agent what a
property-based test is.

## AI feature for Session 3

Let a student write a free-text bio — *"night owl, pretty tidy, headphones
always on, freezing AC"* — and extract the structured profile from it. Then
have the model explain a match in plain language: what will work, and what to
agree on in week one.
