import pytest

from core.rules_roommates import compatibility


def profile(sleep_hour=23, tidiness=3, noise_tolerance=3, ac=True, studies_in_room=False):
    """Build a profile, changing only the parts a test cares about."""
    return {
        "sleep_hour": sleep_hour,
        "tidiness": tidiness,
        "noise_tolerance": noise_tolerance,
        "ac": ac,
        "studies_in_room": studies_in_room,
    }


def test_two_identical_students_score_perfectly():
    person = profile()
    assert compatibility(person, person) == 100


def test_the_score_is_the_same_whichever_student_comes_first():
    # A property, not an example: this does not check any particular score, it
    # checks that the rule cannot depend on argument order. Whoever filled in
    # the form first must not get a different answer from their own match.
    pairs = [
        (profile(), profile(sleep_hour=2, tidiness=5, noise_tolerance=1)),
        (profile(tidiness=1, ac=False), profile(tidiness=5, ac=True)),
        (profile(sleep_hour=0), profile(sleep_hour=12, studies_in_room=True)),
        (profile(noise_tolerance=5), profile(noise_tolerance=1, ac=False)),
        (profile(sleep_hour=21, tidiness=2), profile(sleep_hour=23, tidiness=4)),
    ]
    for one, other in pairs:
        assert compatibility(one, other) == compatibility(other, one)


def test_sleeping_at_23_and_at_01_counts_as_two_hours_apart():
    # Round the clock face 23:00 and 01:00 are two hours apart, not twenty-two.
    # Everything else about these two matches, so the whole penalty is the
    # sleep gap: 6 points an hour * 2 hours = 12, leaving 88.
    early = profile(sleep_hour=23)
    late = profile(sleep_hour=1)
    assert compatibility(early, late) == 88


def test_a_hand_computed_pair_scores_what_the_weighting_says():
    # a: asleep 23:00, tidiness 4, noise 2, wants the AC on, studies in the room
    # b: asleep 01:00, tidiness 2, noise 4, wants it off,     studies in the room
    #
    #   sleep      min(22, 2) = 2 hours apart  ->  6 * 2  = 12
    #   tidiness   |4 - 2| = 2                 ->  8 * 2  = 16
    #   noise      |2 - 4| = 2                 ->  6 * 2  = 12
    #   ac         they disagree               ->  15     = 15
    #   studies    they agree                  ->           0
    #                                            penalty = 55
    #   score = 100 - 55 = 45
    a = profile(sleep_hour=23, tidiness=4, noise_tolerance=2, ac=True, studies_in_room=True)
    b = profile(sleep_hour=1, tidiness=2, noise_tolerance=4, ac=False, studies_in_room=True)
    assert compatibility(a, b) == 45


def test_a_rating_off_the_scale_is_rejected():
    with pytest.raises(ValueError, match="tidiness"):
        compatibility(profile(tidiness=0), profile())
