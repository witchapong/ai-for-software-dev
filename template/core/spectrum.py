"""Build signals out of sine waves and look at their frequency content."""

import numpy as np


def make_signal(
    components: list[tuple[float, float]], fs: float, duration: float
) -> tuple[np.ndarray, np.ndarray]:
    """Add sine waves together.

    components is a list of (frequency in hertz, amplitude) pairs.
    fs is the sampling rate in samples per second.
    Returns the time values and the signal values.
    """
    if fs <= 0 or duration <= 0:
        raise ValueError("sampling rate and duration must both be positive")
    times = np.arange(0, duration, 1.0 / fs)
    signal = np.zeros_like(times)
    for frequency_hz, amplitude in components:
        signal += amplitude * np.sin(2 * np.pi * frequency_hz * times)
    return times, signal


def spectrum(signal: np.ndarray, fs: float) -> tuple[np.ndarray, np.ndarray]:
    """Return the frequencies present in the signal and how strong each one is.

    The scaling matters. numpy gives back unscaled numbers, so a one volt sine
    would show up as five hundred. Multiplying by 2/n converts them back into
    the amplitudes you actually put in. The nought hertz term is not doubled,
    because it is not part of a pair.
    """
    n = len(signal)
    if n == 0:
        raise ValueError("signal is empty")
    coefficients = np.fft.rfft(signal)
    magnitudes = 2.0 * np.abs(coefficients) / n
    magnitudes[0] = np.abs(coefficients[0]) / n
    freqs = np.fft.rfftfreq(n, 1.0 / fs)
    return freqs, magnitudes


def peak_frequency(freqs: np.ndarray, magnitudes: np.ndarray) -> float:
    """The frequency with the most energy in it."""
    return float(freqs[np.argmax(magnitudes)])
