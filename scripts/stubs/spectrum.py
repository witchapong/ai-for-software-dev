"""Build signals out of sine waves and look at their frequency content.

YOU BUILD THIS. It is Lab 1 — follow labs/LAB1.md.

Every function below raises until it is implemented.

(This docstring is deliberately thin. It used to name the test file and call
it "your specification", which meant an agent opening this file in Round 1 was
handed the answer key it is not supposed to have. Round 2 introduces the tests
at Gate 2, where they do the most good.)
"""

TODO = "You build this in Lab 1. See labs/LAB1.md."


def make_signal(components, fs, duration):
    """Add sine waves together.

    components is a list of (frequency in hertz, amplitude) pairs.
    fs is the sampling rate in samples per second.
    Should return the time values and the signal values.
    """
    raise NotImplementedError(TODO)


def spectrum(signal, fs):
    """Return the frequencies present in the signal, and how strong each is.

    Should return (freqs, magnitudes).
    """
    raise NotImplementedError(TODO)


def peak_frequency(freqs, magnitudes):
    """The frequency with the most energy in it."""
    raise NotImplementedError(TODO)
