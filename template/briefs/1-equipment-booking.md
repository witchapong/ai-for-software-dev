# Brief 1 — Lab Equipment Booking

## The situation

The teaching lab has a handful of oscilloscopes, signal generators and power
supplies. Students turn up and find the one they need already in use. There is
a paper sign-up sheet that nobody can see until they walk to the lab.

## What you are building

A web app where a student can see what is free and book it for a time slot.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| Browse equipment | A list of instruments and whether each is free right now |
| Make a booking | Pick an instrument, a date and a time slot, confirm |
| My bookings | See and cancel your own bookings |
| Admin | Add or remove instruments |

## Suggested data

One row per booking: `id`, `equipment_name`, `student_name`, `date`,
`start_time`, `end_time`.

One row per instrument: `id`, `name`, `location`, `notes`.

## The hard part

**Two people must not be able to book the same instrument for overlapping
times.** This is harder than it looks. "Ends at 3, next starts at 3" is fine.
"Ends at 3, next starts at 2:30" is not.

Write it as an acceptance criterion at Gate 2 and a test at Gate 4. Something
like:

> Booking Scope A from 14:00 to 16:00 when it is already booked 15:00 to 17:00
> is refused, and the message says which booking it clashes with.

Get that test written before you let the agent build the booking page. It is
the requirement most likely to be quietly skipped.

## AI feature for Session 3

Let a student type *"I need a scope on Friday afternoon for two hours"* and turn
that sentence into a filled-in booking form they confirm. Use structured output
so your code gets a date and a time, not a paragraph.
