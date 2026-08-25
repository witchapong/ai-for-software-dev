"""Reference implementation of the hard part of Brief 1 — Campus Carpool Board.

One defensible rule, not the only one. If you take this file, you still owe
your project the wiring: your pages, your data model, your twist stay yours.

The hard part here is counting seats honestly. A ride with three seats accepts
exactly three bookings — not two, not four. The count of bookings is the truth;
there is no separate "seats remaining" number to drift out of date. Cancel a
booking and the seat comes back for free, because the seat was never stored.
"""


def seats_left(seats_total: int, bookings_count: int) -> int:
    """How many seats are still free. Never negative.

    seats_total is how many seats the driver offered.
    bookings_count is how many bookings exist for this ride right now.

    If somehow more bookings exist than seats (two people booking at the same
    instant, say), this answers 0 rather than a negative number, because
    "minus one seats free" is not a thing you can show a passenger.
    """
    if seats_total <= 0:
        raise ValueError("seats must be positive")
    return max(0, seats_total - bookings_count)


def can_book(seats_total: int, bookings_count: int) -> tuple[bool, str]:
    """Answer whether one more person may book, and why not if not.

    Returns a pair: (allowed, reason). When booking is allowed the reason is
    an empty string. When it is refused the reason is a sentence you can show
    the passenger as-is — the rule and the message live together, so the page
    never has to invent its own wording.
    """
    if seats_left(seats_total, bookings_count) > 0:
        return True, ""
    return False, f"This ride is full ({seats_total} seats)."
