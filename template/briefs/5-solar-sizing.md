# Brief 5 — Solar Panel Sizing Service

## The situation

A homeowner wants solar panels but every quote assumes they already know how
many kilowatts they need.

## What you are building

A web app that takes a location, a rough daily electricity use and a budget,
and recommends a panel and battery size, saving each quote.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| New estimate | Enter location, daily usage, budget |
| Recommendation | Suggested panel kilowatts, battery kilowatt-hours, reasoning |
| Saved quotes | Every estimate made so far |
| Assumptions | The sun-hours and prices used, editable |

## Suggested data

One row per quote: `id`, `location`, `daily_kwh`, `budget`, `panel_kw`,
`battery_kwh`, `created`.

One row per location: `name`, `peak_sun_hours`.

## The hard part

**Panel size in kilowatts is roughly daily kilowatt-hours divided by peak sun
hours, divided by a system efficiency factor.** That efficiency factor is a
judgement call — losses in the inverter, wiring, dust, temperature. Real
installers use something between 0.75 and 0.85.

Pick your number, write it in `design.md` with a sentence saying why, and test
the calculation:

> 12 kWh a day at 4.5 peak sun hours with 0.8 efficiency needs a 3.33 kW array.

The test is not checking that your factor is right. It is checking that the app
uses the factor you decided on, rather than one the agent invented.

## AI feature for Session 3

Explain the recommendation in plain language to someone with no electrical
background, and answer follow-up questions using a sizing guide document you
provide. Without the document the model will invent plausible numbers, which is
exactly the failure retrieval exists to prevent.
