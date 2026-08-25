import pytest

from core.rules_bills import balances, split_evenly


def test_an_uneven_split_keeps_every_satang():
    shares = split_evenly(100.00, ["Ana", "Ben", "Cho"])
    # 100 baht is 10000 satang; 10000 / 3 leaves one satang over, and it goes
    # to Ana because Ana was listed first.
    assert shares == {"Ana": 33.34, "Ben": 33.33, "Cho": 33.33}
    assert sum(shares.values()) == 100.00


def test_an_even_split_gives_everyone_the_same():
    shares = split_evenly(10.00, ["Ana", "Ben", "Cho", "Dao"])
    assert shares == {"Ana": 2.50, "Ben": 2.50, "Cho": 2.50, "Dao": 2.50}


def test_the_balances_always_add_up_to_zero():
    # The accountant's invariant. Every expense gives out exactly as much as it
    # takes back, so the whole table must total zero. If it does not, the app
    # has invented or destroyed money. This set is deliberately awkward: an
    # amount that does not divide evenly, one expense shared by a subset of the
    # group, and one where the person who paid is not among the sharers at all.
    expenses = [
        {"amount": 100.00, "paid_by": "Ana", "shared_by": ["Ana", "Ben", "Cho"]},
        {"amount": 45.50, "paid_by": "Ben", "shared_by": ["Ana", "Cho"]},
        {"amount": 30.00, "paid_by": "Cho", "shared_by": ["Ben", "Cho"]},
    ]
    settlements = [{"from_person": "Ben", "to_person": "Ana", "amount": 20.00}]
    result = balances(expenses, settlements)

    # Add them back up in whole satang. The balances are exact to the satang,
    # but adding the baht floats leaves a crumb of about 0.0000000000000036 —
    # which is the floating point lie this module works around, so the total
    # is checked where it is genuinely exact, and again to the satang in baht.
    assert sum(round(value * 100) for value in result.values()) == 0
    assert round(sum(result.values()), 2) == 0.0


def test_a_settlement_clears_the_debt_it_pays_off():
    # Ana pays 60 for something she and Ben share, so they are 30 each:
    # Ana is up 60 and down 30, leaving +30; Ben is down 30.
    expenses = [{"amount": 60.00, "paid_by": "Ana", "shared_by": ["Ana", "Ben"]}]
    assert balances(expenses, []) == {"Ana": 30.00, "Ben": -30.00}

    # Ben then transfers his 30 to Ana, which cancels the debt exactly: Ben
    # goes from -30 to 0, and Ana from +30 back to 0.
    settlements = [{"from_person": "Ben", "to_person": "Ana", "amount": 30.00}]
    assert balances(expenses, settlements) == {"Ana": 0.00, "Ben": 0.00}


def test_splitting_between_nobody_is_rejected():
    with pytest.raises(ValueError, match="empty"):
        split_evenly(100.00, [])
