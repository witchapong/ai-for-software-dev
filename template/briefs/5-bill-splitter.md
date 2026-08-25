# Brief 5 — Dorm Bill Splitter

## The situation

Four roommates, one fridge, endless shared food orders, one electricity bill.
Somebody pays each time, everyone says "I'll transfer you later", and by the
end of the month nobody can reconstruct who owes whom.

## What you are building

A web app where roommates record shared expenses and the app keeps the running
balance of who owes whom.

## Suggested pages — one per person

| Page | What happens here |
|---|---|
| Add an expense | What, how much, who paid, who shares it |
| Expense history | Everything so far, newest first |
| Balances | Each person's net position: owed money or owing it |
| Settle up | Record a repayment, watch the balances update |

## Suggested data

One row per expense: `id`, `description`, `amount`, `paid_by`, `shared_by`
(comma-separated names).

One row per settlement: `id`, `from_person`, `to_person`, `amount`.

## The hard part

**The split must account for every satang.** 100 baht among three people is not
33.33 each — that loses one satang. Somebody gets 33.34, and your rule decides
who, deliberately.

The tests to write first:

> Splitting 100.00 among three people produces shares that sum to exactly
> 100.00. And across all expenses, the sum of everyone's balances is exactly
> zero.

That second one is the accountant's invariant: money never appears or
disappears, it only moves. It will catch rounding bugs your eyes never will —
a balance sheet that is off by one satang looks completely fine on screen.

## If your team is fast

The core app is the quickest of the five briefs to get working — the ceiling is
where this one gets interesting:

- **Uneven splits.** "I had the expensive dish" — split by shares or exact
  amounts, not just equally. The sum-to-total invariant must still hold.
- **Simplify debts.** If A owes B 50 and B owes C 50, one transfer settles it,
  not two. Computing the *minimum* set of transfers that zeroes every balance
  is a genuine algorithm problem. Ask your agent — then check its answer.
- **A monthly chart.** Who actually pays for this household, over time?

## AI feature for Session 3

Let a roommate paste a food delivery receipt — the messy text kind — and turn
it into an itemised expense with structured output: items, amounts, who is in.
The model reads prose; your code gets rows that sum to the receipt total.
