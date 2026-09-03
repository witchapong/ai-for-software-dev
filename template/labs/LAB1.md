# Lab 1 — Build a spectrum analyser, twice

You will build the same app two ways, and the comparison between them is the
whole point of the lab. Round 1 you just ask for it. Round 2 you go through
four checkpoints where a person decides before the agent is allowed to carry
on. Same app, same agent, same model.

Everything below is written so you can follow it on your own. If you get
stuck for more than ten minutes on any step, ask a neighbour before you ask
the instructor — there are sixty of you and one of them.

---

## What you are building

A **spectrum analyser** takes a signal and tells you which frequencies it is
made of.

**What you type in:**

| Input | Meaning | Use this |
|---|---|---|
| Frequency 1 | how fast the first tone oscillates, in hertz | **50** |
| Amplitude 1 | how tall that tone is | **1.0** |
| Frequency 2 | the second tone, in hertz | **120** |
| Amplitude 2 | how tall the second tone is | **0.5** |
| Sampling rate | samples taken per second | **1000** |
| Duration | how many seconds of signal | **1.0** |

**What must come out:** two charts.

1. **Time domain** — the two sine waves added together. A messy wiggle. This
   is what an oscilloscope would show you.
2. **Frequency domain** — the spectrum. Two spikes: one **at 50 Hz reaching
   1.0**, one **at 120 Hz reaching 0.5**.

Those spike heights are not decoration. They are the numbers you typed in,
handed back to you — which is what makes this app checkable at all.

---

## What is in this repository

Before you build anything, spend three minutes looking at what you already
have. Open the file explorer on the left and follow along.

```
your-repo/
├── app.py                  the front page. Run this to start the app.
├── pages/                  ONE FILE PER FEATURE. This matters in Session 2:
│   └── 1_Example.py        four people each own a file and never collide.
├── core/                   shared code the pages import.
│   ├── spectrum.py         <- YOU BUILD THIS in Lab 1. Currently every
│   │                          function raises NotImplementedError.
│   ├── llm.py              the AI slot. Empty until Session 3, on purpose.
│   ├── models.py           the shapes your data takes.
│   └── storage.py          saving and loading.
├── tests/                  automated checks.
│   └── test_spectrum.py    <- YOUR SPECIFICATION. Seven checks. The app is
│                              finished when all seven pass.
├── aidlc/                  the four planning documents. You fill these in
│   ├── intent.md           before any code exists. This is Round 2.
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
├── labs/                   these instructions, and the prompts to paste.
├── briefs/                 project ideas for Session 2.
├── .clinerules             the rules your agent obeys on EVERY request.
├── .clinerules.gates       the stricter version. Round 2 switches to it.
├── .env                    YOUR API KEYS. Never commit this file.
└── requirements.txt        the approved library list. It is closed.
```

One of these deserves a proper look right now.

**Open `.clinerules`.** Plain English, in a plain file. Your agent reads it
before every single request. Right now it contains safety rules only — no
process, no approvals, no one telling it to stop and check. That is
deliberate, and Round 1 is why.

Leave `tests/` alone for now. You will open it in Round 2, at the point where
it does the most good.

---

## Before you start: point Cline at a model

Your key in `.env` is for the **app**. Cline is a separate extension with
its own settings and its own copy of the key. Passing `check_setup.py` tells
you nothing about whether your agent can talk to anything.

**"Why the same key in two places?"** Because they are two different
programs. `.env` is read by *your app* — `check_setup.py` today, and
`core/llm.py` in Session 3 when your app starts calling a model itself. Cline
is not your app; it is the tool building it, and it carries its own
credentials. Lab 1's app never calls a model at all, so today `.env` is doing
one job: proving your key is real before you depend on it.

That split — the tool that does things, and the model that decides what to
say — is the mental model this whole course runs on. You just met it as an
annoyance.

1. Click the **Cline icon** — the robot, near the bottom of the strip of icons
   down the far left. They are unlabelled; hover to check.
2. Cline opens on **"How will you use Cline?"** with **Absolutely Free**
   already ticked. **Do not take it** — that signs you into Cline's own service
   and never uses your key. Choose **Bring my own API key**.
3. Provider: **Mistral** (or **Google Gemini** if that is the key you have).
   Paste the matching key.
4. Choose a **model**. Cline's list is its own and does not match the names in
   `.env` or in Mistral's documentation: the entries carry a date, like
   `devstral-2512`, and there is no "latest" among them. Pick one starting
   with **`devstral`** if you see one — those are the coding models — otherwise
   **`mistral-medium`**.
5. **If you have a second key, add that provider too.** Cline runs one provider
   at a time; switching means changing it in the model selector, not having two
   set up side by side.
6. Type **hello** into Cline and check that you get a reply.

> **Check the model name after any window reload.** It is the small grey text
> at the bottom of the Cline box. Cline can quietly reset to a different model,
> sometimes a **paid** one. If you see a price per million tokens beside it,
> change it back before you do anything else.

**Then close the `.env` tab.** Your keys are passwords and they are sitting
on screen. Get in the habit now — you will be sharing this screen later.

### Switching providers is a two-minute skill you need today

Do it once now, deliberately, while nothing is at stake: open the model
selector, switch from Gemini to Mistral, ask "hello", switch back. That way
when it happens under pressure you already know where the button is.

You will hit one of two failures today, and they need opposite responses:

| What you see | What it means | What to do |
|---|---|---|
| `429` / "rate limit exceeded" | You are asking too fast. Your quota is fine. | **Wait.** About a minute. Switching wastes your other key. |
| `503` / "high demand" / "unavailable" | That model is refusing everyone. | **Switch provider.** Waiting will not help. |

**One honest warning about the second key.** Mistral's free tier is about three
requests a minute, and one instruction to an agent is four to ten requests. It
is a rescue for a stuck step, not a second full allowance — it will not carry a
whole 70-minute round on its own. If your main provider dies for good, pair up
with a neighbour whose quota is alive: one drives, one reads the diff. Then
take the reference version for whatever you cannot finish, which is what it is
there for.

Free tiers are genuinely flaky. Both of these happened repeatedly while this
lab was being written, on an ordinary weekday, with one user.

---

## Round 1: just ask for it (25 minutes)

### Step 1 — Put Round 1 on its own branch

You are going to throw this work away, but keeping it lets you compare the
two rounds at the end.

```
git checkout -b round1
```

### Step 2 — Ask for the app

Open Cline, start a **new task**, and paste exactly this:

```
Build me a spectrum analyser in Streamlit. I set two sine waves - a frequency
and an amplitude for each - and it adds them together and plots the
time-domain waveform and the frequency spectrum.
```

### Step 3 — Accept whatever it does

Expect two or three `429 rate limit exceeded` messages per task on a free tier.
Cline retries by itself; each costs twenty to forty seconds. That is the limit
working, not a fault, and it is not something you need to fix.

No spec. No plan. No corrections beyond getting it to run. When it asks to
create or edit a file, click **Save**. If it crashes, paste the error back to
it and let it try again. Your only goal is something on screen.

### Step 4 — Run it

```
streamlit run app.py
```

A preview opens. If it does not, open the **Ports** tab and click the globe
icon next to port 8501.

**Your new page may not be in the sidebar.** Nothing told the agent about the
`pages/` convention, so it has probably written a standalone script at the top
level instead. If the sidebar only shows *app* and *Example*, look at what it
actually created and run that file by name:

```
streamlit run whatever_it_made.py
```

That is not a mistake to fix — it is Round 1 being Round 1, and it is one of
the things you will compare at the end.

> **Run it yourself — do not ask your agent to.** "Run my app" looks like a
> reasonable request and it wedges Cline completely: a web server never exits,
> so the agent sits waiting for a command that will never finish and stops
> responding to anything else. If you have already done it, press `Ctrl+C` in
> the terminal to stop the server and the agent comes back.

### Step 5 — Interrogate it

Set **tone 1 to 50 Hz at amplitude 1.0** and **tone 2 to 120 Hz at amplitude
0.5**. Then answer these in `LOG.md` (your AI collaboration log — it is in your repository, with the questions already written out). Answer whichever set
applies:

**If it never ran:**
- What was the error, in full?
- How many attempts did it take, and how many minutes?
- Did the agent understand its own error, or did it guess?

**If it ran:**
- **Does the 50 Hz spike reach 1.0?** Read the number off the chart.
- Does the 120 Hz spike reach 0.5?
- If a classmate asked "is this correct?", could you show them why? Not
  "it looks right" — *show* them.

Whatever you find, write down the number you actually saw. It is the most
useful line in your log.

### Step 6 — Put it away

```
Ctrl+C                                    # stop the app first
git add -A
git commit -m "Round 1 - just asked for it"
git checkout main
```

Stop the server before you switch. Leave it running and it keeps serving a file
that no longer exists on this branch, your next `streamlit run` quietly lands on
port 8502 instead of 8501, and you spend ten minutes looking at a stale tab
wondering why nothing changes.

Your Round 1 app is safe on the `round1` branch, and `main` is clean again.
Your `.env` survives — it is git-ignored.

---

## Round 2: the Four Gates (70 minutes)

Gate 1 five, Gate 2 ten, Gate 3 ten, Gate 4 forty. That is sixty-five, and it
leaves nothing spare — Gate 5 (ship) happens in the ten minutes after this
block, not inside it. If you are behind, Gate 4 task 2 is the one to shorten.

Same app. Different route. Every prompt you need is in `labs/PROMPTS.md` —
copy them exactly on your first run.

### Step 0 — Check you are on `main`, and see where you start from

Round 2 belongs on `main`. If you are still on the `round1` branch, everything
below happens in the wrong place: the gate swap, every commit, and the Round 1
files are still sitting there for your agent to find.

```
git branch --show-current
```

**It must say `main`.** If it says `round1`, you have not finished Round 1 —
go back and do Step 6:

```
git add -A
git commit -m "Round 1 - just asked for it"
git checkout main
```

Now look at where you are starting from:

```
pytest
```

```
7 failed, 22 passed, 25 deselected
```

**That is correct, not broken.** The 22 passing are the template's own checks.
The 25 deselected belong to Session 3 and stay hidden until you get there. The
7 failing are your specification, and watching those seven turn green is the
whole of Round 2.

### Step 1 — Turn the gates on

In Round 1 your agent had no process rules, which is why it went straight to
code. The rules that change that are already in your repository:

```
cp .clinerules.gates .clinerules
git add .clinerules && git commit -m "turn the gates on"
```

**Commit it.** Otherwise the next `git checkout -- .` you run quietly puts
the old file back, your agent stops asking for approval, and you will not
know why.

Open `.clinerules` and read it again — it has changed. Then **start a new Cline task** — it reads
the rules when a task begins, so the one already open is still using the old
set.

Nothing else has changed. Same agent, same model, same request. Only this
file.

> ### ⚠ Two things that will cost you work if you skip them
>
> **1. Click Save before starting a new task.** When Cline writes a file it
> shows you a diff with **Save** and **Reject** buttons. Until you click
> Save, that work exists only in the preview. **If you start a new task
> while a diff is open, the edit is silently thrown away** — the code you
> just watched it write disappears and your tests go back to failing. This is
> the single easiest way to lose twenty minutes today.
>
> **2. `git checkout -- <file>` is your undo.** Pasted into the wrong pane?
> Agent mangled a file? One command puts that file back to your last commit:
> ```
> git checkout -- core/spectrum.py
> ```
> This is why you commit every time the tests pass.

### Gate 1 — Intent (5 minutes). You write this one.

Open `aidlc/intent.md`. Replace every `PLACEHOLDER` line with your own
answer. Four questions:

- **Who is this for?** One real person, one sentence.
- **What problem does it solve?** What is slow or annoying for them today?
- **What does "done" look like?** Be concrete. If you enter 1.0, say that the
  chart must show 1.0.
- **What is deliberately NOT included?** This is the one that saves you.
  No file loading, no saving, no more than two tones.

Your agent will refuse to write code while the placeholder text is still
there. That refusal is the file working.

### Gate 2 — Spec (10 minutes). The agent drafts, you approve.

**Before you prompt anything**, write down in your own words how you would
*check* that the spectrum your app draws is correct. Do it now, on paper.

Now paste the **Gate 2** prompt from `labs/PROMPTS.md`. The agent writes
`aidlc/requirements.md` — a numbered table where every requirement carries an
acceptance criterion you can run.

Read every line. Compare it to what you wrote on paper.

Most people write "the peaks should be in the right places". The tests check
that too — but they also check that **a tone entered at 1.0 reads back as
1.0**. The gap between those two sentences is the entire skill this lab is
teaching. Note it in your log.

Reply `approved` once the file reflects what `tests/test_spectrum.py`
actually demands.

### Gate 3 — Plan (10 minutes). The agent drafts, you approve.

Paste the **Gate 3** prompt. You get two files:

- `aidlc/design.md` — what the app computes and which screen shows it.
- `aidlc/tasks.md` — a table of exactly two tasks. Task 1 owns
  `core/spectrum.py`. Task 2 owns `pages/2_Spectrum_Analyzer.py`. One task,
  one owner, one file.

Working alone that looks like bookkeeping. In Session 2 it is the whole
trick: four people build at once and never touch the same file, so there is
nothing to merge.

Check that no task touches two files, then approve.

### The one piece of maths you need

Gate 4 is where the agent gets the scaling wrong, and you cannot judge its fix
unless you know what right looks like. It is two lines.

An FFT of a signal with **N** samples splits each tone's energy between a
positive and a negative frequency. A one-sided spectrum only shows you the
positive half, so a tone you entered at amplitude 1.0 arrives holding **N/2**.
To get your 1.0 back you scale every bin by **2/N**.

The 0 Hz bin is the exception. A constant offset has no negative-frequency
twin to share with, so it was never halved — doubling it makes it twice as big
as it should be. It takes **1/N**.

```python
magnitudes = 2.0 * np.abs(coefficients) / n
magnitudes[0] = np.abs(coefficients[0]) / n     # DC has no twin
```

That asymmetry is requirement 5 in your spec, and it is the single thing the
agent is most likely to get wrong.

### Gate 4 — Build (40 minutes). One task at a time.

**Task 1, the maths.** Paste the **Gate 4 task 1** prompt. Then run:

```
pytest tests/test_spectrum.py -q
```

You are aiming for `7 passed`. You may well not get it first time — the
common failure is `test_a_constant_offset_appears_at_zero_hz`, because a
constant offset must not be doubled the way the tones are. If a test fails,
paste the failure back to the agent and let it fix that one thing.

**You will not all get the same result.** The same prompt on the same model
gives different answers on different runs. That is normal and it is worth
noting in your log.

When it is green:

```
git add -A && git commit -m "task 1: the maths"
```

**Task 2, the screen.** Paste the **Gate 4 task 2** prompt. Then run the app
and check it with your own eyes:

```
streamlit run app.py
```

Set 50 Hz at 1.0 and 120 Hz at 0.5. **The spike must reach 1.0.** Compare it
with what you wrote down in Round 1, Step 5.

Commit again.

### If a gate is not working after 15 minutes, stop

Do not keep prompting. A long conversation makes an agent worse, not better.
Restore the reference version of whatever gate you are stuck at, read it, and
carry on:

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

Those files are a reference run — one time the agent did the job well, saved
so you can pick it up rather than start again. **This is not cheating and it
does not cost you marks.** Recognising a dead end and recovering from it is
the skill being assessed. Write down what the agent was doing wrong and what
you tried.

### Gate 5 — Ship (10 minutes)

```
git push
```

Then deploy at https://share.streamlit.io — sign in with GitHub, pick your
repository, set the main file to `app.py`, click **Deploy**. Post your public
URL to the class channel.

---

## Part 3 — Compare the two rounds, and read the reference (15 minutes)

**Everyone does this**, whether your own version worked or not.

First, put your two rounds side by side:

```
git diff round1 main -- core/ pages/
```

Look for two things specifically:

- **Where does the maths live?** Round 1 usually puts it inside the page
  file. Round 2's plan forced it into `core/spectrum.py`, where a test can
  reach it.
- **How many tones can it handle?** Round 1 often hardcodes exactly two.

Then study the reference implementation with your agent, following
`labs/EXPLAIN.md`.

If your app works: find one thing each version does better.

If it does not: this is where you get the content. Understanding code you did
not write, with an AI explaining it, is a real skill and the most common way
these tools are used at work.

Either way, put one thing you learned into your log.

---

## You are done when

- [ ] Two tones at 50 Hz and 120 Hz produce exactly two spikes, in those places
- [ ] A tone you set to amplitude 1.0 produces a spike that reaches **1.0**
- [ ] `pytest tests/test_spectrum.py` reports **7 passed**
- [ ] Your app is live at a public URL
- [ ] You have run `git diff round1 main` and looked at it
- [ ] You have worked through `labs/EXPLAIN.md`
- [ ] Your log has the Round 1 number and the Round 2 number in it

## If you finish early

- Add a third tone. Notice whether your Round 2 code makes that easy.
- Add random noise to the signal and watch a noise floor appear underneath
  the spikes. How much noise before you can no longer see the smaller tone?
- **Aliasing:** allow tone 1 above half the sampling rate. Set the sampling
  rate to 500 and tone 1 to 300 Hz. The spike appears at 200 Hz, not 300 —
  the frequency has "folded back". This is why sampling rate matters, and it
  is the single most important idea in digital signal processing.
- Export the spectrum as a CSV file.
