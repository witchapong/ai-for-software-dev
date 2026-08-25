# Brief 2 — Study Session Finder

## The situation

Exam season. Everyone wants to study in a group, but sessions get organised in
five different chats and nobody knows what already exists. People commit to two
sessions at once and show up to neither.

## What you are building

A web app where anyone can post a study session and join others — with the app
keeping your schedule honest.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| Post a session | Subject, date, start and end time, place, note |
| Browse sessions | Upcoming sessions, filterable by subject |
| Join a session | Confirm, see who else is coming |
| My schedule | Everything I have joined, in time order |

## Suggested data

One row per session: `id`, `subject`, `date`, `start_time`, `end_time`,
`place`, `posted_by`.

One row per signup: `id`, `session_id`, `student_name`.

## The hard part

**A student must not be able to join two sessions that overlap in time.**
"Mine ends at 16:00 and the next starts at 16:00" is fine. "Starts at 15:00
while I am in one until 16:00" is not.

The test to write first:

> A student already in a session from 14:00 to 16:00 on Tuesday is refused a
> 15:00–17:00 session that day, and the message names the clash. A 16:00–18:00
> session is accepted.

Time overlap is the classic interval problem: there are four ways two ranges
can overlap and it is easy to code only three of them. The agent will get this
subtly wrong more often than you expect — that is why the boundary case is in
the test.

## AI feature for Session 3

Let a student paste a messy chat message — *"physics cramming thurs after lab,
maybe 5ish till dinner, library 3rd floor"* — and turn it into a filled-in
session form they confirm. Structured output turns prose into fields.
