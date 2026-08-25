"""Reference implementation of the hard part of Brief 4 — Dorm Roommate Matcher.

One defensible rule, not the only one. If you take this file, you still owe
your project the wiring: your pages, your data model, your twist stay yours.

The hard part here is turning "would these two get along" into one number you
can sort a list by. There is no correct answer, so the goal is a rule you can
defend out loud and a student can argue with: every pair starts at a perfect
100 and loses points for each way the two people differ.
"""

# Sleep hours further apart than this are already as bad as it gets, so the
# penalty stops growing. Six hours apart or twelve, you are still waking each
# other up.
SLEEP_GAP_CAP = 6


def _check(profile: dict) -> None:
    """Refuse a profile whose ratings are off the one-to-five scale."""
    for key in ("tidiness", "noise_tolerance"):
        value = profile[key]
        if not 1 <= value <= 5:
            raise ValueError(f"{key} must be between 1 and 5, got {value}")


def compatibility(a: dict, b: dict) -> int:
    """Score how well two students would share a room, from 0 to 100.

    Each profile is a dictionary with these keys:
      sleep_hour        the hour they usually fall asleep, 0 to 23
      tidiness          1 (relaxed) to 5 (spotless)
      noise_tolerance   1 (needs silence) to 5 (sleeps through anything)
      ac                True if they want the air conditioning on
      studies_in_room   True if they study in the room rather than elsewhere

    One defensible weighting. Start at 100 and subtract:

        penalty = 6  * sleep_diff
                + 8  * difference in tidiness
                + 6  * difference in noise tolerance
                + 15 * 1 if the two disagree about the air conditioning
                + 10 * 1 if one studies in the room and the other does not

        score = max(0, 100 - penalty)

    The weights say what this rule believes: a fight about the air
    conditioning (15) hurts more than one point of difference in tidiness (8),
    because the thermostat is argued about every single night. Disagree with
    that and change the numbers — but be ready to say why.

    sleep_diff is the distance round a 24 hour clock face, not plain
    subtraction: 23:00 and 01:00 are two hours apart, not twenty-two. It is
    then capped at SLEEP_GAP_CAP, since past that point the two are simply on
    opposite schedules and more hours change nothing.

    The score is symmetric by construction — every term is an absolute
    difference or a disagreement, and neither notices which profile came
    first. compatibility(a, b) always equals compatibility(b, a).
    """
    _check(a)
    _check(b)

    hour_gap = abs(a["sleep_hour"] - b["sleep_hour"])
    sleep_diff = min(hour_gap, 24 - hour_gap)
    sleep_diff = min(sleep_diff, SLEEP_GAP_CAP)

    penalty = (
        6 * sleep_diff
        + 8 * abs(a["tidiness"] - b["tidiness"])
        + 6 * abs(a["noise_tolerance"] - b["noise_tolerance"])
        + 15 * int(a["ac"] != b["ac"])
        + 10 * int(a["studies_in_room"] != b["studies_in_room"])
    )
    return max(0, 100 - penalty)
