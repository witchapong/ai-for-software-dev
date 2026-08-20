design.md and tasks.md are approved. Implement task 1 only.
Create core/spectrum.py with exactly these three functions:
  make_signal(components, fs, duration) -> (times, signal)
      components is a list of (frequency_hz, amplitude) pairs
  spectrum(signal, fs) -> (freqs, magnitudes)
  peak_frequency(freqs, magnitudes) -> float
Write the whole file in one go rather than editing it repeatedly.
Every test in tests/test_spectrum.py must pass.
Run pytest tests/test_spectrum.py and report exactly what it printed.
