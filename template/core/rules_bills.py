"""Reference implementation of the hard part of Brief 5 — Dorm Bill Splitter.

One defensible rule, not the only one. If you take this file, you still owe
your project the wiring: your pages, your data model, your twist stay yours.

The hard part here is that money does not divide evenly and floating point
numbers lie. 100 baht between three people is 33.333... each, and 0.1 + 0.2 is
famously not 0.3 on a computer. Both problems go away with the same trick:
work in whole satang (1 baht = 100 satang) as ordinary integers, decide
explicitly who gets the leftover satang, and only turn the numbers back into
baht at the very end, on the way to the screen.
"""


def _shares_in_satang(total_satang: int, names: list[str]) -> list[int]:
    """Cut a whole number of satang into one piece per name.

    Everyone gets the same base share, and the leftover satang go one each to
    the people at the front of the list. The rule is deterministic on purpose:
    the same input always produces the same answer, so the app is never seen
    to change its mind, and the pieces always add back up to the total exactly.
    """
    count = len(names)
    base_share = total_satang // count
    leftover = total_satang % count
    return [base_share + 1 if position < leftover else base_share for position in range(count)]


def split_evenly(amount_baht: float, names: list[str]) -> dict[str, float]:
    """Split one amount between people, exact to the satang.

    Returns a dictionary of name to baht, rounded to two decimal places, whose
    values add back up to the original amount exactly — no stray satang lost
    or invented.

    Where the leftover goes is a decision, not an accident: when the split is
    not even, the first names in the list given get one extra satang each.
    100 baht between Ana, Ben and Cho is 33.34, 33.33, 33.33 — Ana carries the
    extra satang because Ana was listed first.

    (Two people with the same name collapse into one entry, since the result
    is keyed by name. Give people distinct names.)
    """
    if not names:
        raise ValueError("names must not be empty")
    if amount_baht < 0:
        raise ValueError("amount must not be negative")
    total_satang = round(amount_baht * 100)
    pieces = _shares_in_satang(total_satang, names)
    return {name: round(piece / 100, 2) for name, piece in zip(names, pieces)}


def balances(expenses: list[dict], settlements: list[dict]) -> dict[str, float]:
    """Work out who is owed money and who owes it, across everything so far.

    An expense is a dictionary:
        {"amount": 100.0, "paid_by": "Ana", "shared_by": ["Ana", "Ben", "Cho"]}
    A settlement — one person actually transferring money to another — is:
        {"from_person": "Ben", "to_person": "Ana", "amount": 20.0}

    The sign convention: a positive balance means that person is owed money, a
    negative balance means they owe it. Reading it out loud, "Ana: +66.66"
    means the group owes Ana 66.66 baht.

    The bookkeeping is two lines of reasoning:
      - an expense: whoever paid is up by the whole amount, and everyone who
        shared it is down by their own share of it;
      - a settlement: whoever sent the money is up by it, whoever received it
        is down by it, because paying a debt cancels it.

    Because every expense hands out exactly as much as it takes back, all the
    balances always add up to zero. That is the invariant worth testing: if
    the total ever drifts away from zero, money has been invented somewhere.
    """
    totals: dict[str, int] = {}  # name -> satang, positive means "is owed money"

    for expense in expenses:
        amount_satang = round(expense["amount"] * 100)
        sharers = list(expense["shared_by"])
        if not sharers:
            raise ValueError("an expense must be shared by at least one person")
        payer = expense["paid_by"]
        totals[payer] = totals.get(payer, 0) + amount_satang
        for name, piece in zip(sharers, _shares_in_satang(amount_satang, sharers)):
            totals[name] = totals.get(name, 0) - piece

    for settlement in settlements:
        amount_satang = round(settlement["amount"] * 100)
        sender = settlement["from_person"]
        receiver = settlement["to_person"]
        totals[sender] = totals.get(sender, 0) + amount_satang
        totals[receiver] = totals.get(receiver, 0) - amount_satang

    return {name: round(satang / 100, 2) for name, satang in totals.items()}
