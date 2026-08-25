import pytest

from core.rules_sessions import find_clash, overlaps


def test_two_sessions_that_share_an_hour_clash():
    assert overlaps("14:00", "16:00", "15:00", "17:00") is True


def test_a_session_starting_when_another_ends_does_not_clash():
    # The boundary case, and the reason the intervals are half-open: the
    # session that ends at 16:00 does not occupy 16:00, so the next one is
    # free to start there. You can walk from one straight into the other.
    assert overlaps("14:00", "16:00", "16:00", "18:00") is False


def test_a_short_session_inside_a_long_one_clashes():
    assert overlaps("14:00", "16:00", "15:00", "15:30") is True


def test_sessions_in_different_parts_of_the_day_do_not_clash():
    assert overlaps("14:00", "16:00", "12:00", "13:00") is False


def test_find_clash_names_the_session_in_the_way():
    existing = [("09:00", "10:00"), ("15:00", "17:00")]
    assert find_clash("14:00", "16:00", existing) == ("15:00", "17:00")


def test_find_clash_finds_nothing_in_an_empty_diary():
    assert find_clash("14:00", "16:00", []) is None


def test_a_session_that_ends_before_it_starts_is_rejected():
    with pytest.raises(ValueError, match="end must be after start"):
        overlaps("16:00", "14:00", "09:00", "10:00")
