aidlc/design.md and aidlc/tasks.md are approved. Implement task 1 only.

core/spectrum.py already exists as a stub whose functions raise
NotImplementedError. Use your file-writing tool to OVERWRITE that whole file in
one go — do not edit it line by line. It must end up with exactly these three
functions:

  make_signal(components, fs, duration) -> (times, signal)
      components is a list of (frequency_hz, amplitude) pairs
  spectrum(signal, fs) -> (freqs, magnitudes)
  peak_frequency(freqs, magnitudes) -> float

Write the whole file in one go rather than editing it repeatedly. Every test in
tests/test_spectrum.py must pass, including the one asserting that a tone at
amplitude 1.0 reads back as 1.0.

Write the file now.

Then run this exact command and paste its output verbatim into your reply:

    python -m pytest tests/test_spectrum.py -q

Do NOT write your own test script, and do NOT judge the implementation by one.
The file tests/test_spectrum.py is the only thing that decides whether this is
finished. If it reports any failure, fix the code and run it again.

Do not touch pages/.
