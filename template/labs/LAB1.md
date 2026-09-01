# Lab 1 — Build a spectrum analyser, twice

You will build the same app two ways. The comparison is the whole point.

A spectrum analyser takes a signal and tells you which frequencies it is made
of. You will build one that adds two sine waves together and then shows you
that it can find both of them again.

## Round 1: just ask for it (25 minutes)

Open Cline. Type:

> Build me a spectrum analyser in Streamlit. I set two sine waves — a frequency
> and an amplitude for each — and it adds them together and plots the
> time-domain waveform and the frequency spectrum.

Accept whatever it does. Do not plan. Do not write a spec. Try to get it
working. Note what happens.

When time is up, answer these in your AI collaboration log:

- Did it run first time?
- Set tone A to 1.0 amplitude. **Does the spike reach 1.0?** If you cannot
  tell from the chart, that is itself an answer.
- If a classmate asked "is this correct", could you show them why?

Now delete it — all of it. Round 2 is only a fair comparison if it starts from
the same place you did, and `rm` on one filename misses whatever else the agent
decided to create.

```
git checkout -- .    # undo its edits to files that were already here
git clean -fd        # delete the new files it made
```

Your `.env` survives both: it is git-ignored, so your key is safe.

## Round 2: the Four Gates (70 minutes)

Same app. Different route. The exact prompts to paste are in `labs/PROMPTS.md`.

**Gate 1 — Intent (5 min).** Fill in `aidlc/intent.md` yourself. The agent
will not proceed until you do.

**Gate 2 — Spec (10 min).** Ask Cline to draft `aidlc/requirements.md`.
Read every line and fix what is wrong.

Now write, in your own words, how you would *check* that the spectrum your app
draws is correct. Write it down before reading on.

Then open `tests/test_spectrum.py`. Those tests were written for you — they are
the acceptance criteria your "customer" is handing over, and your app is
finished when they pass. Compare them to what you just wrote.

Most people write something like "the peaks should be in the right places".
The tests check that too — but they also check that a tone entered at amplitude
1.0 reads back as 1.0, because a spectrum can have every peak in exactly the
right place and still be wrong by a factor of five hundred. The gap between
those two sentences is the whole skill. Note it in your log.

Reply "approved" once `requirements.md` reflects what the tests actually
demand.

**Gate 3 — Plan (10 min).** Ask for `aidlc/design.md` and `aidlc/tasks.md`.
The maths belongs in `core/spectrum.py`; the screen belongs in
`pages/2_Spectrum_Analyzer.py`. Approve.

**Gate 4 — Build (40 min).** One task at a time. Your goal is simple: make
`pytest tests/test_spectrum.py` go green.

Run `pytest` now, before you build anything. You should see **7 failed, 22
passed, 25 deselected**. That is correct, not broken: the twenty-two are the
template's own tests, the twenty-five belong to Session 3 and are hidden until
you get there, and the seven are your specification. Watch that seven fall. After each task, run the tests and
look at the app. Commit every time the tests pass:

```
git add -A && git commit -m "what you just did"
```

**If a task is not working after 15 minutes, stop.** Do not keep prompting —
a long conversation makes the agent worse, not better. Restore the reference
version of whatever gate you are stuck at, read it, and carry on:

| Stuck at | Run this |
|---|---|
| Gate 2 | `git checkout origin/solution/lab1 -- aidlc/requirements.md` |
| Gate 3 | `git checkout origin/solution/lab1 -- aidlc/design.md aidlc/tasks.md` |
| Gate 4 task 1 | `git checkout origin/solution/lab1 -- core/spectrum.py` |
| Gate 4 task 2 | `git checkout origin/solution/lab1 -- pages/2_Spectrum_Analyzer.py` |

Those files are a reference run — one time the agent did the job well, saved so
you can pick it up rather than starting again. This is not cheating and it does
not cost you marks. Recognising a dead end and recovering from it is the skill
being assessed. Write down in your log what the agent was doing wrong and what
you tried.

**Gate 5 — Ship (10 min).** Push, then deploy at https://share.streamlit.io —
sign in with GitHub, pick your repository, set the main file to `app.py`, click
Deploy. Post your public URL.

## Part 3 — Understand the reference (everyone, 15 minutes)

Whether or not your own version worked, finish by studying the reference
implementation with your agent. Follow `labs/EXPLAIN.md`.

If your app works: compare it to the reference and find one thing each version
does better.

If it does not: this is where you get the content. Understanding code you did
not write, with an AI explaining it, is a real skill and the most common way
these tools get used at work.

Either way, put one thing you learned here into your AI collaboration log.

## You are done when

- [ ] Two tones at 50 Hz and 120 Hz produce exactly two spikes, in those places
- [ ] A tone you set to amplitude 1.0 produces a spike that reaches 1.0
- [ ] `pytest` passes all seven tests
- [ ] Your app is live at a public URL
- [ ] You have worked through `labs/EXPLAIN.md`

## If you finish early

- Add a third tone.
- Add random noise to the signal and watch a noise floor appear underneath the
  spikes. How much noise before you can no longer see the smaller tone?
- **Aliasing:** allow tone A above half the sampling rate. Set the sampling
  rate to 500 and tone A to 300 Hz. The spike appears at 200 Hz, not 300 —
  the frequency has "folded back". This is why sampling rate matters, and it
  is the single most important idea in digital signal processing.
- Export the spectrum as a CSV file.
