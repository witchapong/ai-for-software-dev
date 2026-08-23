# Brief 3 — Energy Usage and Tariff Tracker

## The situation

A household has no idea which appliances dominate the electricity bill, or
whether a different tariff would be cheaper.

## What you are building

A web app to log appliance usage, work out energy in kilowatt-hours and cost,
and compare tariffs side by side.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| Appliances | Add appliances with their power rating in watts |
| Log usage | Record hours used on a date |
| Bill | Total kilowatt-hours and cost for a month |
| Compare tariffs | The same usage priced under two different tariffs |

## Suggested data

One row per appliance: `id`, `name`, `watts`.

One row per usage entry: `id`, `appliance_id`, `date`, `hours`.

One row per tariff: `id`, `name`, `cost_per_kwh`, `standing_charge`.

## The hard part

**Kilowatt-hours are watts times hours divided by 1000.** Every number in the
app depends on that one conversion, so it is the first thing to test:

> A 2000 W heater used for 3 hours is 6.0 kWh, and at 4 baht per kWh that is
> 24.00 baht.

Watch for the classic mistake: forgetting the standing charge, or applying it
per day when the tariff states it per month. Decide which, write it in
`design.md`, and test it.

## AI feature for Session 3

Give the model the user's actual logged usage and ask for three specific
suggestions to cut the bill, each naming a real appliance from their data. A
suggestion that does not name one of their appliances is a hallucination, and
your prompt should forbid it.
