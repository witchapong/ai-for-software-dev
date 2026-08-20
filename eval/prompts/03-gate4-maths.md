aidlc/design.md and aidlc/tasks.md are approved. Implement task 1 only.

Use your file-writing tool to CREATE core/spectrum.py with exactly these three
functions:

  make_signal(components, fs, duration) -> (times, signal)
      components is a list of (frequency_hz, amplitude) pairs
  spectrum(signal, fs) -> (freqs, magnitudes)
  peak_frequency(freqs, magnitudes) -> float

Write the whole file in one go rather than editing it repeatedly. Every test in
tests/test_spectrum.py must pass, including the one asserting that a tone at
amplitude 1.0 reads back as 1.0.

Write the file now, then run pytest tests/test_spectrum.py and report exactly
what it printed. Do not touch pages/.
