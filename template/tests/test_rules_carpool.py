import pytest

from core.rules_carpool import can_book, seats_left


def test_an_empty_three_seat_ride_accepts_a_booking():
    allowed, reason = can_book(3, 0)
    assert allowed is True
    assert reason == ""


def test_a_three_seat_ride_with_three_bookings_is_full():
    allowed, reason = can_book(3, 3)
    assert allowed is False
    assert "full" in reason


def test_a_cancellation_frees_the_seat_again():
    # The ride was full at three bookings; someone cancels, so the count drops
    # to two and the fourth person can book. Nothing had to be "given back" —
    # the seat count is worked out from the bookings every time.
    assert can_book(3, 3)[0] is False
    assert can_book(3, 2)[0] is True


def test_seats_left_never_goes_below_zero():
    assert seats_left(3, 5) == 0


def test_a_ride_with_no_seats_is_rejected():
    with pytest.raises(ValueError, match="positive"):
        seats_left(0, 0)
