# Workshop Design — AI for Software Development

**Audience:** 3rd-year Electrical Engineering undergraduates (30–60 students)
**Format:** 3 sessions × 3 hours, ~70% hands-on / ~30% lecture, weekly spacing
**Date:** 2026-08-15
**Status:** Design approved, pending spec review

---

## 1. Objective and success criteria

The workshop succeeds if, on the Monday after it ends, a student can open a laptop and build
something real on their own using an AI coding agent — without the instructor present.

That is a higher bar than "they watched an agent write code." It requires them to own the
*decisions* the agent cannot make for them: what to build, how to break it down, whether the
output is correct, and when to stop.

### Learning objectives

By the end, a student can:

1. Explain how an AI coding agent works — the separation between **harness** (the program
   that runs the loop and edits files) and **model** (the thing that predicts text), the
   read → plan → edit → run → observe loop, and why it fails the ways it does.
2. Run the **Four Gates** workflow to take a one-paragraph intent to a deployed, working app.
3. Read, review, and accept or reject code they did not write.
4. Collaborate through version control — branch, pull request, review, merge.
5. Write a specification with testable acceptance criteria, and test what they built.
6. Build an application that calls an LLM as a *component* — prompt design, structured output,
   simple retrieval, and evaluation.
7. Deploy to a public URL.
8. Judge when AI helps and when it hurts, and manage quota, cost, privacy and academic honesty.

### Non-goals (deliberately excluded)

No cloud infrastructure or AWS, no authentication systems, no databases beyond SQLite/CSV,
no React or JavaScript frameworks, no MCP servers, no fine-tuning, no multi-agent
orchestration. Every one of these is a plausible tangent that would consume a session and
teach less than the thing it displaced.

---

## 2. Constraints that shaped this design

| Constraint | Consequence |
|---|---|
| University lab PCs, Windows, **no admin rights** | Browser-only stack; install request is minimal |
| Software must be requested from lab staff **in advance** | Zero reliance on class-time installs |
| **Free-tier only** for agent and LLM | Two model providers configured; quota discipline is taught, not assumed |
| **30–60 students, no teaching assistants** | The method must be enforced by tooling, not by the instructor walking the room |
| Programming background: **one intro Python course** | Python-only stack; agent writes the code; students own the judgment |
| Weekly spacing, homework possible | Account setup happens before Session 1; group project spans the Session 2→3 gap |

The no-TA constraint is the dominant one. With 60 students and one instructor, anything
that requires individual intervention will fail. Every design decision below is filtered
through: *what happens when 15 people are stuck at once?*

---

## 3. The Four Gates — the method students actually run

### Why not AI-DLC verbatim

AI-DLC (AWS's AI-Driven Development Life Cycle) is the conceptual frame for the lectures,
and the existing lecture notes cover it well. But AI-DLC's own scope note says it targets
*"systems with high architectural complexity, trade-offs, scalability needs, and multiple
teams"* and that *"simple apps should use low-code/no-code instead."*

Students will build simple apps in two-hour windows. Running Bolts, bounded contexts and Mob
Elaboration over a Streamlit calculator would be cargo cult — performing rituals without ever
meeting the problems those rituals solve.

So: **AI-DLC is taught as the concept; the Four Gates is the executable version sized for the labs.**
Students learn the vocabulary and reasoning (which transfers to industry) and practise a
shrunken form of the same loop.

### The method

A **gate** is a point where the agent stops and waits for a human to approve before continuing.

| Gate | Student does | Artifact | AI-DLC name |
|---|---|---|---|
| **1. Intent** | Writes one paragraph: who it's for, what problem, what "done" looks like | `aidlc/intent.md` | Intent |
| **2. Spec** | Agent drafts requirements + testable acceptance criteria; student corrects and approves | `aidlc/requirements.md` | Inception |
| **3. Plan** | Agent proposes files, data flow, and a task list with owners; student approves | `aidlc/design.md`, `aidlc/tasks.md` | Inception |
| **4. Build** | Agent implements **one task at a time**; student reviews every diff and runs the tests | code + tests | Construction (one Bolt) |
| **5. Ship** | Deploy; get a public URL | live app | Operations |

Gates 4 → 3 loop for each new unit of work.

### Why this also solves the quota problem

Spec-first prompting cuts the number of model round trips several-fold, because the agent
stops guessing and backtracking. The free-tier limit is not a nuisance to work around — it
is the forcing function that makes the discipline stick. Framed for students:

> Your quota is limited. Prompt like an engineer, not a slot machine.

---

## 4. Tooling decision

### Stack

| Layer | Choice | Why |
|---|---|---|
| **Environment** | GitHub Codespaces (browser VS Code) | Nothing to install on lab PCs; every student gets a byte-identical pre-built environment |
| **Harness** | Cline (VS Code extension, open source, free) | Shows every file change as an approve/reject diff — the best available teaching surface for human-in-the-loop review |
| **Agent model (primary)** | Mistral free "Experiment" tier (Codestral / Devstral) | Highest free token allowance by a wide margin; coding-tuned |
| **Agent model (backup)** | Google AI Studio — current Flash alias | Stronger reasoning for hard steps; students switch providers in three clicks. **Unverified — see the note below** |
| **App model** (Session 3) | Gemini Flash, Groq as fallback | Different job, different budget — see note below |
| **Language** | Python 3.11 | Their only language; EE-adjacent library ecosystem |
| **UI** | Streamlit | A web app from pure Python; `pages/` gives one-file-per-feature for free |
| **Deploy** | Streamlit Community Cloud | Free, deploys straight from the GitHub repo they already have |
| **Version control** | GitHub (branch → pull request → review → merge) | The collaboration mechanism *and* the anti-free-rider evidence trail |

**Two different models, two different budgets.** The model that *powers the coding agent*
consumes enormous context on every request and is the binding constraint. The model that
*the student's finished app calls* (Session 3) sends short prompts and costs almost nothing.
Providers that are useless for the first job are perfectly good for the second — students
should understand this distinction, because it's how real systems are costed.

### Quota analysis (the decision that ruled out the alternatives)

One student instruction is **not** one API request. The agent loops — read file, propose
edit, apply, run, read the error, fix — and each step is a separate round trip that re-sends
the whole conversation. Call this the **amplification factor**: typically **4–10 requests per
instruction**, more when things go wrong.

A beginner in a 2-hour lab issues roughly 15–30 instructions, so budget
**≈ 100–200 model requests per student per session.**

Three different limits can bite:
- **RPD** — requests per day: caps total work done.
- **RPM** — requests per minute: caps *speed*; exceeding it makes the agent visibly stall.
- **TPM** — tokens per minute: bites late in long conversations.

| Route | Free limits | Verdict |
|---|---|---|
| **Antigravity free** | ~20 requests/day (down from ~250 at launch); lockouts of up to **7 days** reported after 20–30 min of use | ❌ **Disqualified** — a student who overspends in Session 1 walks into Session 2 with a dead tool |
| Gemini Flash | 250 RPD, 10 RPM, 250K TPM | ⚠️ Usable but no margin; 10 RPM means ~6s of dead air. **Blocked on our test account — see below** |
| Gemini Flash-Lite | 1,000 RPD, 15 RPM | ⚠️ Request budget fine, model too weak for multi-file edits |
| **Mistral Experiment tier** | ~1B tokens/month, 500K TPM, ~1 req/sec | ✅ **Primary** — effectively unlimited for this class |
| Groq | 100K tokens/**day** | ❌ agent / ✅ small app calls in Session 3 |
| Cerebras | ~1M tokens/day | ❌ agent / ✅ small app calls in Session 3 |
| OpenRouter free | 50 requests/day | ❌ agent / ✅ emergency backup |

Two facts that matter for a computer lab:

- **Free-tier limits are per account, not per IP address.** 60 students behind one campus
  NAT is fine.
- **Codespaces compute is not the constraint.** The free tier is 120 core-hours/month;
  three 3-hour sessions on a 2-core machine consume ~18.

### Gemini is currently unusable on our test account — 20 Aug 2026

Both keys were created and tested. **Mistral works**; `codestral-latest`,
`devstral-medium-latest` and `mistral-medium-latest` all answered. **Gemini
failed two different ways:**

1. `gemini-2.5-flash`, the version this spec originally named, returns *"no
   longer available to new users."* It has been retired for new accounts.
2. Every current model — `gemini-3.6-flash`, `gemini-3.7-flash`,
   `gemini-flash-latest` — returns *"Your prepayment credits are depleted"* on a
   fresh free-tier project with zero usage. Google's own developer forum carries
   several threads reporting exactly this since early August, fallout from the
   Prepay/Postpay billing rollout of March 2026.

Neither is a bad key, and neither is fixable from our side.

**What this changes.** Mistral becomes the primary agent model in practice, not
just for Phase C tuning. Gemini stays in the design as the backup and as
Session 3's app model, but is marked **unverified** until it answers a request.
Every hard-coded model name has been replaced with the `gemini-flash-latest`
alias, since pinning a version is what broke first.

**What it does not change.** The workshop still runs. That is the entire return
on the two-provider decision: the obvious single choice on paper was Gemini, and
it is the one that failed six weeks out. Tell the students this story — it is
the vendor-risk lecture, with a real example they can check.

### Known-fragile assumptions

The 2026 free-tier landscape collapsed under agentic load — Gemini CLI's free tier ended
18 Jun 2026, Qwen Code's free OAuth ended 15 Apr 2026, GitHub Copilot Pro student signups
paused Apr 2026 (and Copilot Free has no agent mode), Firebase Studio stopped new signups
22 Jun 2026. **Assume at least one provider in this document will change before the workshop
runs.** This is why two providers are configured and why the swap is a one-line change in
`.env` — and it is worth telling students explicitly, because vendor risk is a real
engineering concern, not a footnote.

Mistral's free tier requires opting in to data-training. The classroom rule is therefore
**"no personal or confidential data in prompts"** — which is a five-minute security lesson
worth teaching anyway.

---

## 5. The scaffolding — one template that fits every project

Every "product or service" app reduces to the same four parts: **features (pages), a data
model, storage, and optionally an LLM call.** Whether a group builds equipment booking, a
solar sizing service, or a study-group finder, that shape holds. The scaffolding fixes the
shape; variation lives only in `pages/` and `core/models.py`.

Published as a **GitHub template repository** — one member per group clicks "Use this
template" and adds teammates as collaborators. No org admin, no GitHub Classroom teacher
verification delay.

```
ai-workshop-template/
├── .devcontainer/devcontainer.json   ← identical env for all students; Cline pre-installed,
│                                        Python + packages pinned
├── .clinerules                       ← THE FOUR GATES, as instructions to the agent
├── aidlc/
│   ├── intent.md          (Gate 1 — template with prompts to fill in)
│   ├── requirements.md    (Gate 2)
│   ├── design.md          (Gate 3)
│   └── tasks.md           (Gate 3 — has an OWNER column, one file per owner)
├── app.py                 ← nav + shared layout. Rarely edited; nobody's "own" file.
├── pages/                 ← ONE FILE PER FEATURE = one owner = one branch
│   └── 1_Home.py
├── core/
│   ├── models.py          ← shared data shapes (dataclasses); single owner
│   ├── storage.py         ← save/load (CSV or SQLite); single owner
│   └── llm.py             ← ★ pre-stubbed empty LLM wrapper — Session 3 drops in here
├── tests/                 ← one test file per module
├── check_setup.py         ← students run this first; verifies keys and prints ✅
├── requirements.txt
├── .env.example           ← where API keys go; the real .env is git-ignored
├── TROUBLESHOOTING.md     ← "if X breaks, do Y" — the no-TA safety net
└── .github/workflows/ci.yml  ← runs tests automatically on every push
```

### `.clinerules` — the highest-leverage artifact in the workshop

A rules file the agent reads automatically on every request (the same mechanism
`awslabs/aidlc-workflows` uses). With 60 students and no TAs the instructor cannot enforce
process by walking the room, so the **tool** enforces it. A student who types "build me an
app" is pushed back by their own agent.

Draft content:

```markdown
# How you must work on this project

You are working with a student who is learning software engineering.
Follow the Four Gates. Never skip ahead.

## Gate rules
1. If `aidlc/intent.md` is empty, ask the student to fill it in. Write no code.
2. Before writing any code, `aidlc/requirements.md` must exist with numbered
   requirements and testable acceptance criteria. Draft it, then STOP and ask
   for approval. Write no code until the student says "approved".
3. Before writing any code, `aidlc/design.md` and `aidlc/tasks.md` must exist.
   Every task must name exactly ONE owner and touch exactly ONE file that no
   other task touches. Draft them, then STOP and ask for approval.
4. Implement ONE task at a time. After each task: run the tests, report the
   result, and STOP. Do not start the next task without being asked.

## Coding rules
- Python 3.11 and Streamlit only. Do not add a dependency without asking first.
- Every function in `core/` needs a test in `tests/`.
- Keep diffs small. Never rewrite a file wholesale when an edit will do.
- Never edit a file owned by another task in `aidlc/tasks.md`.
- Never put an API key in code. Read it from the environment.
- If a requirement is ambiguous, ask. Do not guess and proceed.

## Teaching rules
- Explain what you are about to do in two sentences before doing it.
- When you finish a task, state plainly what you did NOT test.
```

The one-file-per-owner rule is not bureaucracy — it nearly eliminates **merge conflicts**
(two people editing the same lines), which is where beginners drown.

### `core/llm.py` is a deliberate empty slot

It means Session 3's pattern transfers by dropping code into a place that already exists,
rather than restructuring a working project the night before demos. The transfer is *easy
and encouraged*, but nothing breaks if a group skips it and demos what they have.

---

## 6. Session-by-session plan

**On the 70/30 split:** the plan below runs at roughly **76% hands-on / 24% lecture**
(130 lecture minutes of 540). That is slightly *more* hands-on than the 70/30 target, which
leaves about 30 minutes of lecture headroom across the three sessions. Spend it on whichever
of these the cohort turns out to need: more AI-DLC theory in Session 1, more on data
modelling in Session 2, or more on LLM evaluation in Session 3. Treat it as deliberate slack,
not spare time to fill by default — running under on lecture is the safer failure direction.



### Session 1 — "Meet your agent": the loop, the gates, and a first shipped tool

Individual work. Everyone builds the same thing.

| Time | Min | Activity | Mode |
|---|---|---|---|
| 0:00–0:15 | 15 | Open Codespace from template, run `check_setup.py` until it prints ✅. Instructor triages failures. | Hands-on |
| 0:15–0:20 | 5 | Cold open: instructor builds and deploys something small, live | Lecture |
| 0:20–0:40 | 20 | **Lecture 1** — How an agent works: harness vs model; the read→plan→edit→run→observe loop; context window; tokens and quota; why it hallucinates | Lecture |
| 0:40–1:05 | 25 | **Warm-up lab (deliberately unstructured)** — "Build me a spectrum analyser." No spec, no plan, just prompt for it. It half-works. This is the point. | Hands-on |
| 1:05–1:25 | 20 | **Lecture 2** — Why that broke → the Four Gates; SDLC fundamentals mapped onto them (requirements, design, implementation, test, deploy); AI-DLC concepts: intent, units, bolts, AI proposes / human approves | Lecture |
| 1:25–2:35 | 70 | **Lab 1** — rebuild the *same* spectrum analyser properly through the Four Gates | Hands-on |
| 2:35–2:45 | 10 | Deploy to Streamlit Community Cloud; post URL to the class channel | Hands-on |
| 2:45–3:00 | 15 | **Study the reference with your agent** (everyone), then debrief: "what did your agent get wrong?" + homework | Hands-on |

**Lecture 45 min (25%), hands-on 135 min.**

The warm-up lab is load-bearing. Students must *feel* vibe coding fall over before the Four
Gates reads as anything other than pointless paperwork. Do not skip it to save time.

Crucially, the warm-up and Lab 1 build the **same application**. Students throw the warm-up
away and rebuild it through the gates, so they compare two routes to one destination rather
than comparing two unrelated experiences. The comparison is the lesson.

The closing block is not padding. **Every student studies the reference implementation with
their agent**, whether or not their own version worked. Three reasons it earns fifteen
minutes:

- Reading unfamiliar code with an AI explaining it is the most common way these tools get
  used at work — more common than greenfield generation.
- It levels the room before Session 2. Students who failed get the content; students who
  succeeded compare against a second solution and discover there were alternatives.
- It is the sturdiest activity in the workshop. Explaining edits no files, so it cannot hit
  the agent failure mode that threatens the build path. **The rescue route is more reliable
  than the route it rescues** — exactly the property a rescue route needs.

The structural consequence matters more than the pedagogy: **this makes Lab 1 unable to fail
outright.** Even if the free-tier model turns out weak at building, the lab degrades to
"attempt it, then understand it" — still a good lab, and still assessable, since a student
who never got a working app can write a substantive AI collaboration log entry about why.

#### Lab 1 brief (fixed — everyone builds the same thing)

**Two-Tone Spectrum Analyser.** Add two sine waves together, then show both the combined
waveform and a chart of which frequencies are inside it and how strong each one is.

Chosen because:
- Every 3rd-year EE has just met the Fourier transform — they can tell when the output is
  *wrong*, which is exactly the judgment the workshop is trying to build.
- It's visual, and the payoff is genuinely striking: a messy waveform resolving into two
  clean spikes.
- It has an **analytically checkable acceptance criterion**: a tone entered at amplitude
  1.0 must produce a spike of height 1.0, at exactly the frequency entered.
- **It contains the best teaching trap available.** NumPy's FFT returns unscaled values, so
  a correct-looking result needs a `2/N` factor. Agents routinely omit it or use `1/N`. Every
  such mistake still puts the peaks in the *right places* — only their *heights* are wrong
  (500.0 or 0.5 instead of 1.0). A student who checks only the shape passes it; a student who
  checks the numbers catches it. That is the workshop's central skill in a single chart.

This trap is verified, not assumed: the supplied test suite was mutation-tested against all
three common scaling bugs. Two tests fail on each, while the peak-*location* test stays green
throughout — which is the point, and worth naming aloud in the Session 1 debrief.

Stretch goals for fast finishers: a third tone; add noise and watch a noise floor appear;
**aliasing** — sample a 300 Hz tone at 500 Hz and watch the spike fold back to 200 Hz; CSV
export of the spectrum.

Fixed rather than a menu because it's the first lab, students are solo, and there are no TAs.

#### Homework after Session 1
1. Finish and deploy Lab 1 if not done.
2. Read the AI-DLC lecture notes.
3. **AI collaboration log entry:** three things the agent got wrong, how you caught each,
   and what you changed in your prompting.

---

### Session 2 — "Design a product, build it as a team"

Groups of 3–4. **The Lab 2 output *is* the group project** — no separate briefing, they
leave with a running skeleton and a week to build on it.

| Time | Min | Activity | Mode |
|---|---|---|---|
| 0:00–0:10 | 10 | Recap; show three students' deployed Session 1 apps | Discussion |
| 0:10–0:40 | 30 | **Lecture 3** — AI-powered software and system design: requirements → user stories → acceptance criteria; decomposition into units; what a data model is; the anatomy of a web app (pages / state / storage); why file ownership enables parallel work; version control mental model (branch, PR, review, merge); what CI does | Lecture |
| 0:40–0:50 | 10 | Form groups, pick a brief, assign file ownership | Hands-on |
| 0:50–1:15 | 25 | **Gates 1–3, mobbed** — whole group at one screen: intent, spec, plan, task assignment | Hands-on |
| 1:15–2:05 | 50 | **Gate 4, parallel** — each member, own Codespace, own agent, own file, own branch | Hands-on |
| 2:05–2:20 | 15 | **Lecture 4** — Reviewing code you didn't write; AI failure modes: hallucinated APIs, silent fallbacks, quietly deleted code, over-engineering, tests that assert nothing | Lecture |
| 2:20–2:45 | 25 | Pull requests → peer review → merge → deploy | Hands-on |
| 2:45–3:00 | 15 | Plan the week: backlog, who does what, next check-in | Hands-on |

**Lecture 45 min (25%), hands-on 125 min, discussion 10 min.**

#### The idle-spectator problem, and how this fixes it

Agentic coding is single-driver by nature: one keyboard, one agent conversation, three
people watching. Role rotation alone doesn't fix it — the "reviewer" still just watches.

**Mob the thinking, parallelise the building.**

- **Gates 1–3 together on one screen.** That *is* AI-DLC's Mob Elaboration ritual. Nobody is
  idle because they're arguing about requirements, which is the part that needs four brains.
- **Gate 4 in parallel, one student per file.** Every student has their own Codespace, their
  own agent, and their own free-tier quota — four accounts means four times the quota.

The rule that makes it work for beginners:

> **Every task in `tasks.md` names exactly one owner and touches exactly one file that
> nobody else touches.**

Streamlit's `pages/` folder hands this to us: each `.py` file automatically becomes a
navigation tab. One file = one feature = one owner = one branch = no conflicts.

And this is where decomposition stops being a slide and becomes an experience: *the reason
you split a system into units is so that people can work at the same time.* That's what
AI-DLC's Units and bounded contexts are for. They feel it rather than take your word for it.

Peer review here isn't ceremony either. When AI writes the code, **reviewing code you didn't
write is the actual job**, and pull requests are the cheapest way to teach it.

#### Project brief menu (pre-vetted to fit the skeleton and the time budget)

Each has a natural slot for the Session 3 LLM feature, so the transfer is obvious later.

| # | Brief | Pages | Model | LLM slot (Session 3) |
|---|---|---|---|---|
| 1 | **Lab Equipment Booking** | browse, book, my bookings, admin | Equipment, Booking | "I need a scope Friday afternoon" → structured booking |
| 2 | **Component Inventory & BOM Helper** | stock, build BOM, shortages | Part, BOM | Paste a free-text parts list → structured BOM |
| 3 | **Energy Usage & Tariff Tracker** | log usage, kWh/cost, compare tariffs | Appliance, Reading | Grounded advice on reducing the bill |
| 4 | **Capstone / Study Group Finder** | post idea, browse, match | Student, Project | Extract skills from free text; explain matches |
| 5 | **Solar PV Sizing Service** | inputs, recommendation, saved quotes | Site, Quote | Plain-language explanation + Q&A over a sizing guide |
| 6 | **Own idea** | — | — | Requires instructor approval that it maps to the skeleton |

---

### Session 3 — "Put an LLM inside your product", then demo

| Time | Min | Activity | Mode |
|---|---|---|---|
| 0:00–0:25 | 25 | **Lecture 5** — Building *with* LLMs: system vs user prompt; structured output; tool calling (one slide); retrieval-augmented generation; evaluating a prompt like code; guardrails; cost, latency, privacy; non-determinism and why your app can't assume the same answer twice | Lecture |
| 0:25–1:30 | 65 | **Lab 3, guided** — everyone builds the identical LLM feature on the reference repo | Hands-on |
| 1:30–1:50 | 20 | **Transfer window** — graft the pattern into your own project (encouraged, not required) | Hands-on |
| 1:50–2:00 | 10 | Break; set up demo stations | — |
| 2:00–2:45 | 45 | **Demos** — science fair format | Hands-on |
| 2:45–3:00 | 15 | **Closing** — what you can now do alone; when *not* to use AI; security, ethics, academic honesty; where to go next | Lecture |

**Lecture 40 min (22%), hands-on 130 min, break 10 min.**

#### Why guided-then-transfer

Fifteen groups all doing different things with no TAs is a support nightmare. So everyone
follows the **identical** build first — same repo, same steps — which means a stuck student
can look at their neighbour's screen and self-serve. Only then do they apply the pattern to
their own project.

Per the agreed tweak, transfer is **ideal but optional**. Groups demo what they have. This
removes the demo-day cliff where a broken last-minute LLM integration takes down an
otherwise working project.

#### Lab 3 guided build — "Datasheet Assistant"

A Streamlit page that answers questions using a small set of provided component datasheet
excerpts. Four checkpoints, each independently useful:

| # | Min | Step | Concept taught |
|---|---|---|---|
| 1 | 15 | Plain call — implement `core/llm.py`, ask a question, get an answer | The API call; system vs user prompt; keys from environment |
| 2 | 20 | **Structured output** — extract component specs into a fixed JSON shape, render as a table | Don't parse prose — demand structure. The single most useful production pattern. |
| 3 | 20 | **Mini-RAG** — score 5 text files for relevance, paste the best chunk into the prompt, answer *with a citation* | Retrieval-augmented generation: the model doesn't "know" your data, you hand it the data |
| 4 | 10 | **Eval + guardrail** — write 3 test questions with expected answers; run them; watch it fail sometimes | Prompts are code and must be tested; non-determinism is real |

Checkpoint 4 is the honesty checkpoint: students see the same prompt give different answers
and learn to design for that rather than pretend it away.

Model for the app: a Gemini Flash model via `google-genai` (small prompts, well within
free limits), with Groq as fallback. Substitute Mistral if Gemini is still blocked. Keep the retrieval corpus tiny to stay inside the token budget.

#### Demo format — science fair, then a final

Groups of 3–4 means 8–20 groups depending on turnout. Sequential 3-minute presentations
would be 25–60 minutes of dead air for everyone not presenting, and the tail of that is
unsurvivable. Instead, a format whose length **does not grow with group count**:

- **Round 1 (20 min):** half the groups demo at their own machines; the other half circulate
  and score on a one-page peer form.
- **Round 2 (20 min):** swap.
- **Final (5 min):** the top three by peer vote give a 90-second lightning talk to the room.

This runs in the same 45 minutes whether there are 8 groups or 20 — only the crowd density
changes. Peer scoring makes the audience active rather than captive, and only three formal
presentations need scheduling.

---

## 7. Assessment

*This section is a proposal — grading was left open. Adopt it whole, use only the rubric as
self-check criteria for an ungraded workshop, or drop it.*

Because the AI writes most of the code, grading the code grades the AI. **Grade the process
and the judgment instead.**

### Group project (70%)

| Weight | Criterion | Evidence |
|---|---|---|
| 20% | **Spec quality** | `intent.md` and `requirements.md`: clear, specific, testable acceptance criteria |
| 15% | **Design & decomposition** | `design.md`, `tasks.md`: sensible units, one-file-per-owner respected, coherent data model |
| 20% | **Collaboration** | Commits and merged PRs from *every* member; substantive review comments |
| 20% | **Working software** | Runs; deployed URL; does what the spec says |
| 15% | **Testing & review quality** | Tests that would actually fail if the code broke; review comments that caught something real |
| 10% | **Demo & reflection** | Clear explanation; honest about limitations |

### Individual: AI collaboration log (30%)

One page per student, accumulated across all three sessions:

> Three things the agent got wrong, how you caught each, and what you changed in your
> prompting as a result.

This carries disproportionate weight for its size. It defeats free-riding (it cannot be
written by someone who didn't touch the keyboard), and it is the best learning-consolidation
artifact in the workshop — it forces the student to articulate the exact skill the workshop
exists to teach.

---

## 8. Requirements for lab staff

### Software to install

| Item | Priority | Note |
|---|---|---|
| Google Chrome or Microsoft Edge, current version | **Required** | Everything runs in the browser |
| VS Code Desktop + Git + Python 3.11 | Recommended insurance | Only used if Codespaces is blocked; costs little to pre-install |

### Network — allow-list

Codespaces and Streamlit both need **WebSocket** connections. If the proxy strips or blocks
WebSockets, neither will work — flag this explicitly as the highest-risk item.

```
github.com, *.github.com, api.github.com
*.github.dev, *.app.github.dev, *.githubpreview.dev     ← Codespaces + forwarded ports
*.githubusercontent.com
marketplace.visualstudio.com, *.vscode-cdn.net, *.gallerycdn.vsassets.io   ← extensions
generativelanguage.googleapis.com                        ← Gemini
api.mistral.ai                                           ← Mistral
api.groq.com                                             ← fallback
share.streamlit.io, *.streamlit.app, streamlit.io        ← deployment
pypi.org, files.pythonhosted.org                         ← pip
```

### Confirm with lab staff
- Students may sign in to **personal** GitHub and Google accounts on lab machines.
- Uplink can carry ~60 concurrent browser IDEs (modest but bursty traffic).
- No admin rights are needed for any of the above.

### Student pre-work (before Session 1)
1. Create a GitHub account with a personal email (~10 min).
2. Create a Google AI Studio API key (~5 min).
3. Create a Mistral account and API key (~5 min).
4. Open the template repo's Codespace once and run `check_setup.py` until it prints ✅.
5. Post "setup done" in the class channel — this converts Session 1's setup risk into a
   problem the instructor can solve *before* 60 people are sitting in a room.

### Instructor pre-work
- Build and publish the template repository and the Session 3 reference repository.
- Write `TROUBLESHOOTING.md` and the "if stuck for 10 minutes, do this" card.
- Create known-good checkpoint branches for each lab so a stuck student can jump forward.
- **Run the pilot (Section 10).**

---

## 9. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| A free tier changes or dies before the workshop | **High** | Two providers configured; swap is one line in `.env`; check both the week before |
| Agent produces broken code and a student stalls | **High** | `.clinerules` gates; `TROUBLESHOOTING.md`; known-good checkpoint branches |
| Campus proxy blocks WebSockets → Codespaces dead | Medium | Pilot before submitting the install request; local VS Code + Cline requested as fallback |
| Free-riding inside groups | Medium | Individual collaboration log + PR authorship trail |
| Demo-day tech failure | Medium | Require deployed URL **and** screenshots submitted the night before |
| Merge conflicts overwhelm beginners | Medium | One-file-per-owner rule enforced in `.clinerules` |
| Streamlit Cloud requires a public repo | Medium | Repos are public; drill "never commit `.env`" from Session 1 |
| Student exhausts Codespaces free hours | Low | ~18 core-hours needed of 120; teach stopping codespaces |
| 60 students rate-limited from one campus IP | Low | Verified: free-tier limits are per account, not per IP |

---

## 10. Pilot checklist — run on an actual lab PC before submitting the install request

1. Open a Codespace from the template in Chrome on a lab machine.
2. Confirm **Cline loads and runs** inside the browser-based Codespace.
3. Confirm an agent request completes against **both** Mistral and Gemini keys.
4. Run Streamlit and confirm the **forwarded preview URL opens** through the campus network.
5. Push a branch, open a PR, merge it — confirm GitHub is fully reachable.
6. Deploy to Streamlit Community Cloud and open the public URL from a lab machine.
7. Time the cold start of a Codespace on the lab's connection (this sets the Session 1 buffer).
8. Confirm a personal Google account can sign in without the domain policy blocking it.

Items 2 and 4 are the ones most likely to fail. Finding out now costs an hour; finding out
in Session 1 costs the session.
