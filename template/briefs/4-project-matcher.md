# Brief 4 — Capstone Project Matcher

## The situation

Final-year students need project teammates. Right now this happens through
whoever you already know, so good ideas die for lack of a teammate who can do
the firmware.

## What you are building

A web app where students post project ideas and find teammates whose skills fit.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| Post an idea | Title, description, skills needed |
| Browse ideas | All open ideas, filterable by skill |
| My profile | Your name, your skills, what you are looking for |
| Matches | Ideas that need a skill you have |

## Suggested data

One row per student: `id`, `name`, `skills`, `looking_for`.

One row per idea: `id`, `title`, `description`, `skills_needed`, `posted_by`.

## The hard part

**Skills are free text, so "PCB design", "pcb" and "PCB layout" must count as
the same thing.** Decide your rule — lowercase and strip spaces? a synonym
list? — write it in `design.md`, and test it:

> A student whose skills say "pcb" is matched to an idea needing "PCB design".

There is no perfect answer here, which is the point. Pick a rule you can defend
and that your test can check. A rule you cannot test is not a rule.

## AI feature for Session 3

Read a student's free-text description of themselves and pull out a clean list
of skills, then explain in one sentence why a given idea matches them. This is
the brief where the AI feature genuinely solves the hard part rather than
decorating it.
