# Brief 2 — Component Inventory and BOM Helper

## The situation

A student society keeps a drawer of components. Nobody knows what is in it.
People buy parts that are already in the drawer, and start projects that cannot
be finished because one part is missing.

## What you are building

A web app that tracks stock and checks whether a project's parts list — its
bill of materials, or BOM — can be built from what is on hand.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| Stock | Every part, how many there are, where it lives |
| Add or remove stock | Record parts arriving or being taken |
| Build check | Paste a parts list, see what is missing |
| Shortages | Everything below its minimum quantity |

## Suggested data

One row per part: `id`, `part_number`, `description`, `quantity`,
`minimum_quantity`, `location`.

## The hard part

**Quantities must never go negative, and taking the last of something must
appear on the shortages page immediately.**

The test to write first:

> Taking 5 of a part that has 3 in stock is refused, and the stock level is
> still 3 afterwards.

That last clause matters. A common bug is to refuse the action but decrement
anyway, or to refuse it after already writing the new value.

## AI feature for Session 3

Let a user paste a messy parts list copied from a datasheet or a forum post,
and turn it into a clean table of part numbers and quantities. This is what
structured output is for — the model reads prose, your code gets rows.
