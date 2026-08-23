import numpy as np

def make_signal(components, fs, duration):
    """
    Generate a signal from a list of frequency components.
    
    Args:
        components: List of (frequency_hz, amplitude) pairs.
        fs: Sampling frequency in Hz.
        duration: Duration of the signal in seconds.
    
    Returns:
        Tuple of (times, signal) where times is the time array and signal is the generated signal.
    """
    times = np.arange(0, duration, 1/fs)
    signal = np.zeros_like(times)
    
    for freq, amp in components:
        signal += amp * np.sin(2 * np.pi * freq * times)
    
    return times, signal

def spectrum(signal, fs):
    """
    Compute the frequency spectrum of a signal.
    
    Args:
        signal: Input signal array.
        fs: Sampling frequency in Hz.
    
    Returns:
        Tuple of (freqs, magnitudes) where freqs is the frequency array and magnitudes is the magnitude spectrum.
    """
    n = len(signal)
    freqs = np.fft.rfftfreq(n, 1/fs)
    magnitudes = np.abs(np.fft.rfft(signal)) * 2 / n
    
    return freqs, magnitudes

def peak_frequency(freqs, magnitudes):
    """
    Identify the peak frequency from the frequency and magnitude arrays.
    
    Args:
        freqs: Frequency array.
        magnitudes: Magnitude spectrum array.
    
    Returns:
        Peak frequency as a float.
    """
    peak_index = np.argmax(magnitudes)
    return freqs[peak_index]