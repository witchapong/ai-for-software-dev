"""Reference implementation of the hard part of Brief 2 — Study Session Finder.

One defensible rule, not the only one. If you take this file, you still owe
your project the wiring: your pages, your data model, your twist stay yours.

The hard part here is deciding when two sessions clash. Times are "HH:MM"
strings on a 24 hour clock, and both sessions are assumed to be on the same
day. Intervals are half-open, written [start, end): the start minute belongs
to the session, the end minute does not. That is what makes a session ending
at 16:00 and one starting at 16:00 not a clash — you can walk straight from
the first into the second.
"""


def _minutes(clock: str) -> int:
    """Turn a "HH:MM" string into minutes since midnight, so "14:30" is 870.

    Minutes since midnight are much easier to compare than strings: one
    subtraction and you have the gap. Anything that is not a real time on a
    24 hour clock is rejected here rather than quietly giving a wrong answer.
    """
    parts = clock.strip().split(":")
    if len(parts) != 2:
        raise ValueError(f"time must look like HH:MM, got {clock!r}")
    hours = int(parts[0])
    minutes = int(parts[1])
    if not 0 <= hours <= 23 or not 0 <= minutes <= 59:
        raise ValueError(f"time must look like HH:MM, got {clock!r}")
    return hours * 60 + minutes


def _span(start: str, end: str) -> tuple[int, int]:
    """One session as a (start, end) pair of minutes, checked for sanity."""
    start_minutes = _minutes(start)
    end_minutes = _minutes(end)
    if end_minutes <= start_minutes:
        raise ValueError("end must be after start")
    return start_minutes, end_minutes


def overlaps(start_a: str, end_a: str, start_b: str, end_b: str) -> bool:
    """Say whether two sessions on the same day share any time at all.

    The rule is shorter than the list of cases it replaces: two half-open
    intervals overlap exactly when each one starts before the other ends.
    Touching at a boundary is not an overlap, because the end minute is not
    part of the session.
    """
    a_start, a_end = _span(start_a, end_a)
    b_start, b_end = _span(start_b, end_b)
    return a_start < b_end and b_start < a_end


def find_clash(
    new_start: str, new_end: str, existing: list[tuple[str, str]]
) -> tuple[str, str] | None:
    """Find the first already-booked session the new one runs into.

    existing is a list of (start, end) pairs. Returns the first pair that
    clashes, so the page can say which session is in the way, or None when
    the new session fits.
    """
    _span(new_start, new_end)  # reject a nonsense new session even if the list is empty
    for start, end in existing:
        if overlaps(new_start, new_end, start, end):
            return (start, end)
    return None
