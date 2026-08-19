# Prompts that work

Copy these. Improvise later, once you have seen what good looks like. On day
one, use these.

> **Note for the instructor:** this is the Phase A draft. It is replaced with
> the eval-tuned wording once Task 9A Phase C completes.

## Gate 2 — ask for the spec

```
Using the Four Gates in .clinerules: I have filled in aidlc/intent.md.
Read tests/test_spectrum.py first - those tests are the acceptance criteria.
Draft aidlc/requirements.md as a numbered table so every requirement matches
something those tests actually check. Then stop and wait for my approval.
Do not create any Python file yet.
```

## Gate 3 — ask for the plan

```
requirements.md is approved. Now draft aidlc/design.md and aidlc/tasks.md.
There are exactly two tasks. Task 1 owns core/spectrum.py and nothing else.
Task 2 owns pages/2_Spectrum_Analyzer.py and nothing else.
Then stop. Do not create any Python file yet.
```

## Gate 4, task 1 — the maths

```
design.md and tasks.md are approved. Implement task 1 only.
Create core/spectrum.py with exactly these three functions:
  make_signal(components, fs, duration) -> (times, signal)
      components is a list of (frequency_hz, amplitude) pairs
  spectrum(signal, fs) -> (freqs, magnitudes)
  peak_frequency(freqs, magnitudes) -> float
Write the whole file in one go rather than editing it repeatedly.
Every test in tests/test_spectrum.py must pass.
Run pytest tests/test_spectrum.py and report exactly what it printed.
```

## Gate 4, task 2 — the screen

```
Task 1 is done. Implement task 2 only. Create pages/2_Spectrum_Analyzer.py:
a Streamlit page with number inputs for two tones, each with a frequency in
hertz and an amplitude, plus a sampling rate. Import make_signal, spectrum and
peak_frequency from core.spectrum. Show the strongest frequency, then two
charts: the combined waveform against time, and the amplitude of each
frequency present. Write the whole file in one go.
Do not modify core/spectrum.py.
```

## Why these are worded the way they are

Four things in these prompts are deliberate, and worth copying into your own
prompts later:

1. **Each one is a separate task.** Start a new Cline task per gate. A long
   conversation makes the agent worse, not better.
2. **"Write the whole file in one go."** When an agent edits a file it has to
   match the existing text exactly, and it often fails. Writing a new file
   whole avoids that failure entirely.
3. **Exact function names and arguments are stated.** Anything you leave vague
   is a decision the agent makes for you, and it will not read your mind.
4. **"Do not create any Python file yet."** Saying it explicitly, even though
   `.clinerules` already says it, is cheap insurance.

## If a gate goes wrong

Do not keep prompting a confused agent. Restore the reference version of that
gate and carry on — it costs you nothing:

| Stuck at | Run this |
|---|---|
| Gate 2 | `git checkout origin/solution/lab1 -- aidlc/requirements.md` |
| Gate 3 | `git checkout origin/solution/lab1 -- aidlc/design.md aidlc/tasks.md` |
| Gate 4 task 1 | `git checkout origin/solution/lab1 -- core/spectrum.py` |
| Gate 4 task 2 | `git checkout origin/solution/lab1 -- pages/2_Spectrum_Analyzer.py` |
