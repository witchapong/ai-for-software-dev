from core.rules_tutoring import matches, normalize


def test_a_short_form_matches_the_long_course_name():
    assert matches("calc 2", "Calculus II") is True


def test_a_roman_numeral_matches_the_same_number_as_a_digit():
    assert matches("Physics III", "physics 3") is True


def test_an_abbreviation_is_not_guessed_at():
    assert matches("EM", "electronics") is False


def test_normalize_strips_spaces_and_shortens_the_subject_name():
    assert normalize("  Mathematics I ") == "math1"


def test_matching_works_the_same_way_round():
    # A property, not an example: whichever side is the offer and whichever is
    # the request, the answer must be the same. If this ever fails, matching
    # depends on argument order, and the board would show different results
    # depending on who happened to post first.
    pairs = [
        ("calc 2", "Calculus II"),
        ("Physics III", "physics 3"),
        ("EM", "electronics"),
        ("Mathematics I", "math 1"),
    ]
    for left, right in pairs:
        assert matches(left, right) == matches(right, left)
