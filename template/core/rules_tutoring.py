"""Reference implementation of the hard part of Brief 3 — Tutoring Matcher.

One defensible rule, not the only one. If you take this file, you still owe
your project the wiring: your pages, your data model, your twist stay yours.

The hard part here is that two people typing the same subject rarely type the
same characters. "Calculus II", "calc 2" and "CALC II" are one subject to a
human and three to a computer. The fix is to squash every spelling down to one
plain form first, then compare those. Nothing clever happens at compare time,
which is what makes the behaviour easy to predict and easy to test.
"""

# Roman numerals used in course names, turned into ordinary digits.
ROMAN_NUMERALS = {"i": "1", "ii": "2", "iii": "3", "iv": "4"}

# Long subject names and the short form students actually type.
# Add your own campus's habits here — this is the one part worth extending.
SUBJECT_WORDS = {"calculus": "calc", "mathematics": "math"}


def normalize(subject: str) -> str:
    """Squash one subject name down to its plain comparable form.

    The steps, in order:
      1. lowercase and trim the outside spaces,
      2. drop anything that is not a letter, a digit or a space,
      3. word by word, swap roman numerals for digits and long subject names
         for their short forms,
      4. remove the remaining spaces.

    So "Calculus II", "calc 2" and "  CALC   ii " all come out as "calc2".

    Step 3 works word by word on purpose. A whole-string replacement would
    turn the "i" inside "physics" into a "1"; a word only counts as a roman
    numeral when it stands alone.
    """
    cleaned = "".join(
        character
        for character in subject.lower().strip()
        if character.isalnum() or character == " "
    )
    words = []
    for word in cleaned.split():
        word = ROMAN_NUMERALS.get(word, word)
        word = SUBJECT_WORDS.get(word, word)
        words.append(word)
    return "".join(words)


def matches(offer_subject: str, request_subject: str) -> bool:
    """Say whether someone offering to tutor a subject covers someone's request.

    Both sides go through normalize, so the comparison is between plain forms
    and never between raw typing. This is deliberately strict: it forgives
    spelling and spacing, but it does not guess. "EM" is not "electronics"
    here, because guessing at abbreviations pairs students wrongly, and a
    wrong match costs more than a missed one.
    """
    return normalize(offer_subject) == normalize(request_subject)
