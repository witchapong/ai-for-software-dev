# Prompts that work

Copy these. Improvise later, once you have seen what good looks like. On day
one, use these.

## Gate 2 — ask for the spec

```
Read tests/test_spectrum.py. Those tests are the acceptance criteria for this
project. aidlc/intent.md says what we are building.

Now use your file-writing tool to WRITE the file aidlc/requirements.md,
replacing what is there. It must contain a markdown table with one numbered row
per requirement, and each row's acceptance criterion must match something those
tests actually check. Include the requirement that a tone entered at amplitude
1.0 reads back as 1.0.

Write the file now. Do not ask permission first. Do not print the table in your
reply instead of writing it. Do not write any .py file.
```

## Gate 3 — ask for the plan

```
aidlc/requirements.md is approved. Read it.

Now use your file-writing tool to WRITE two files, replacing what is there:

1. aidlc/design.md — what the app computes, and which screen shows it.
2. aidlc/tasks.md — a markdown table of exactly two tasks. Task 1 owns
   core/spectrum.py and nothing else. Task 2 owns pages/2_Spectrum_Analyzer.py
   and nothing else. One owner per row, one file per row.

Write both files now. Do not ask permission first. Do not print them in your
reply instead of writing them. Do not write any .py file.
```

## Gate 4, task 1 — the maths

```
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
```

## Gate 4, task 2 — the screen

```
Task 1 is done. Implement task 2 only.

Use your file-writing tool to CREATE pages/2_Spectrum_Analyzer.py: a Streamlit
page with number inputs for two tones, each with a frequency in hertz and an
amplitude, plus a sampling rate. Import make_signal, spectrum and
peak_frequency from core.spectrum. Show the strongest frequency, then two
charts: the combined waveform against time, and the amplitude of each frequency
present.

Write the whole file in one go. Write it now, do not print it in your reply
instead. Do not modify core/spectrum.py.
```

## Why these are worded the way they are

Six things in these prompts are deliberate. The last three were learned the
hard way — an earlier version of this file scored zero, and the agent replied
*"I don't have the capability to create files on your system."* That was not
true. It was the prompt.

1. **Each one is a separate task.** Start a new Cline task per gate. A long
   conversation makes the agent worse, not better.
2. **"Write the whole file in one go."** When an agent edits a file it has to
   match the existing text exactly, and it often fails. Writing a new file
   whole avoids that failure entirely.
3. **Exact function names and arguments are stated.** Anything you leave vague
   is a decision the agent makes for you, and it will not read your mind.
4. **Name the tool: "use your file-writing tool to WRITE …".** "Draft" and
   "create" both get satisfied by an agent that just talks at you. Naming the
   action leaves no room for that.
5. **Never write "wait for my approval" in a prompt.** `.clinerules` already
   makes the agent stop at each gate. Repeating it in the prompt makes the
   agent stop *instead of* doing the work.
6. **Forbid the near-miss.** "Do not print it in your reply instead of writing
   it" closes the one failure the other rules still allow.

**The transferable lesson:** when an agent tells you it *cannot* do something
it plainly can, read your own prompt before you blame the model. Nine times in
ten you told it not to.

## If a gate goes wrong

Do not keep prompting a confused agent. Restore the reference version of that
gate and carry on — it costs you nothing:

**First, once per Codespace, make the reference reachable.** Your repository was
made with "Use this template", and that copies only `main` — the solution
branches live on the template, not on your copy. Without this the commands
below fail with `invalid reference`:

```
git remote add reference https://github.com/witchapong/ai-workshop-template.git
git fetch reference
```

| Stuck at | Run this |
|---|---|
| Gate 2 | `git checkout reference/solution/lab1 -- aidlc/requirements.md` |
| Gate 3 | `git checkout reference/solution/lab1 -- aidlc/design.md aidlc/tasks.md` |
| Gate 4 task 1 | `git checkout reference/solution/lab1 -- core/spectrum.py` |
| Gate 4 task 2 | `git checkout reference/solution/lab1 -- pages/2_Spectrum_Analyzer.py` |


---

# Lab 3 prompts

Same rules as Lab 1: name the tool, ask for a whole file, forbid the reply that
talks instead of writing.

## Checkpoint 2 — the plain call

```
Read core/llm.py. It is a stub whose functions raise NotImplementedError.

Use your file-writing tool to OVERWRITE the whole file in one go, implementing
ask() so it sends a question to Gemini and returns the reply text. Read the
GEMINI_MODELS list at the top of check_setup.py and use the same
try-each-in-turn approach: pinned models get retired and busy ones return
"high demand".

Leave ask_structured() raising NotImplementedError for now. Write the file now;
do not print it in your reply instead.
```

## Checkpoint 3a — the schema call

```
Now implement ask_structured() in core/llm.py, overwriting the whole file
again. It takes a question and a JSON schema, asks the model to reply as JSON
matching that schema, and returns it as a Python dictionary. If the reply is
not valid JSON, raise ValueError saying so and showing what came back.

Keep ask() exactly as it is. Write the file now.
```

## Checkpoint 3b — the extractor

```
core/intake.py is a stub. Read session3/menu.md and session3/inbox.json first,
then overwrite core/intake.py in one go so that:

  load_menu and order_total are plain Python with no model call
  extract_one sends ONE message and returns the ORDER_SCHEMA shape
  extract_batch sends ALL messages in a SINGLE request and returns a list

Item names must come from the menu — pass the menu names into the prompt and
say they are the only permitted values. Do NOT ask the model to compute any
total; order_total does that in Python.

Then run: python -m pytest -m lab3 tests/test_intake.py -q
and paste the output verbatim. Do not write your own test script.
```

## Checkpoint 4 — the review queue

```
Implement needs_review() in core/intake.py: return the ids of records the model
flagged with needs_review true, plus any record with an empty required field or
a quantity of zero or less. Plain Python, no model call.

Then run: python -m pytest -m lab3 tests/test_intake.py -q
and paste the output verbatim.
```

## If it argues instead of writing

An agent that replies "I don't have the ability to create files" or hands you
the code in chat has been told to, somewhere in your wording. Say **"use your
file-writing tool to write the file now"** and it will.
