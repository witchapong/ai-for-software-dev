/**
 * Session 1 — "Meet your agent"
 *
 * Content only. Every layout comes from deck.js, which transcribes the recipes
 * in SLIDE-STYLE.md. If a slide will not fit one of those recipes, split the
 * content — do not add a layout.
 *
 * Build:  node session1.js
 */

import {
  pres, titleSlide, agendaSlide, dividerSlide, bodySlide,
  twoColumnSlide, figureSlide, codeSlide, takeawaysSlide, closingSlide,
} from "./deck.js";

const FOOT = "AI for Software Development · Session 1";
const p = n => String(n).padStart(2, "0");

/* 01 */ titleSlide({
  course: "AI for Software Development · 3rd Year EE",
  title: "Meet your agent",
  subtitle: "Session 1 — how an AI coding agent works, and how to make it build what you meant",
  presenter: "Your Name · Department of Electrical Engineering",
  date: "Session 1 of 3",
}).addNotes(
  "Cover. Hold it while people sit down. Say the one-line promise: by the end of today you will have built and published a working app, and you will know why the careful route beat the quick one."
);

/* 02 */ bodySlide({
  eyebrow: "Setup",
  title: "Before we start",
  bullets: [
    ["A GitHub account, then a Codespace.", "Free at github.com. One click from the template page builds a Linux machine in your browser; nothing installs here."],
    ["TWO API keys, not one.", "Gemini at aistudio.google.com/apikey, Mistral at console.mistral.ai. Free tiers refuse service without warning."],
    ["Paste both into .env, save, close the tab.", "A key is a password, and you will be sharing this screen before the day is out."],
    ["Then run check_setup.py.", "Five checks. It names whichever one is not right yet. Do not move on until they are all green."],
  ],
  footerLeft: FOOT, page: p(2),
}).addNotes(
  "This is on screen as they walk in, and stays up for the first fifteen minutes. Say the key rule out loud: the key goes in .env, never in a file you commit, and never pasted into the chat. Walk the room rather than talking — the failures are individual, and the check script names each one."
);

/* 03 */ codeSlide({
  eyebrow: "Setup",
  title: "The five checks",
  code: [
    "$ python check_setup.py",
    "",
    "[PASS] Python version: 3.11",
    "[PASS] Packages: all 6 installed",
    "[PASS] API key present",
    "[PASS] API key works: Gemini",
    "       replied",
    "[PASS] Backup provider: both",
    "       providers configured",
    "",
    "ALL CHECKS PASSED",
  ].join("\n"),
  paras: [
    "Five checks, in the order they can fail. A failing line names the fix; it never just tells you something is wrong.",
    "Still stuck after ten minutes? Ask a neighbour before you ask me. TROUBLESHOOTING.md carries the same list with fixes.",
  ],
  prompt: "Nothing installs on the lab PC. The machine you are working on is in the browser.",
  footerLeft: FOOT, page: p(3),
}).addNotes(
  "The most common two failures: the key pasted with a trailing space, and the placeholder text left in place. Both are named explicitly by the script. If a whole row is stuck, it is usually the proxy rather than the student."
);

/* 04 */ bodySlide({
  eyebrow: "Setup",
  title: "Cline needs its own key",
  bullets: [
    [".env is for your app.", "check_setup.py and core/llm.py read it. Cline never does — separate program, separate settings, its own copy of the key."],
    ["It opens on a screen nobody expects.", "“How will you use Cline?”, with Absolutely Free already ticked. Do not take it — choose Bring my own API key, or your key is never used."],
    ["Then provider, then model.", "Mistral or Gemini, paste the key. Model names carry a date — devstral-2512, not devstral-latest. Prefer a devstral if you see one."],
    "Check the model name after any reload: Cline can reset itself, sometimes to a paid one. A price per million tokens beside it means change it back.",
  ],
  footerLeft: FOOT, page: p(4),
}).addNotes(
  "The single most likely way for a student to arrive unable to work, and it is invisible: every check passes, then Cline opens on a configuration screen nobody mentioned - with the wrong option already selected for them. Do this one on the projector rather than describing it, because the free option is the big attractive button and taking it leaves their key unused with no error to tell them. Cline's model list is its own: it uses dated names and has no latest, so anything you read elsewhere will not match it."
);

/* 05 */ agendaSlide({
  eyebrow: "Session 01",
  items: [
    "How an agent works",
    "What it costs, and why it fails",
    "Warm-up — build it by asking",
    "The Four Gates",
    "Lab 1 — the same app, done properly",
    "Read the reference, then ship",
  ],
  footerLeft: FOOT, page: p(5),
}).addNotes(
  "Agenda. Point out that item 05 is where they build the real thing; everything before it exists to make 05 work."
);

/* 06 */ dividerSlide({
  n: 1,
  name: "How an agent works",
  framing: "What actually happens between typing a request and a file changing on disk.",
}).addNotes(
  "Before clicking on: ask who has used ChatGPT to write code. Most hands. Then ask who knows what happens between typing the request and the file changing. Few hands. That gap is this section."
);

/* 07 */ figureSlide({
  eyebrow: "Section 01",
  title: "What a language model is",
  image: "figures/fig-language-model.png",
  paras: [
    "Trained once, on a very large amount of writing, to do a single thing: given some text, guess what comes next. Everything it appears to do is built on top of that one trick.",
    "It consults no database. An answer is reconstructed from patterns, never retrieved — which is the mechanism behind everything on the next three slides.",
  ],
  figSource: "Fig. 1 — trained once, then rented by the word",
  footerLeft: FOOT, page: p(7),
}).addNotes(
  "Keep this to three minutes and resist the detail. The two things they must leave with: training happened once and is finished, and the model predicts rather than looks up. Say the cost out loud — training one of these runs to millions of dollars, which is why you rent it instead of building it. Someone always asks whether it is on the internet: no. It is a fixed set of numbers that has been frozen since the day training stopped."
);

/* 08 */ figureSlide({
  eyebrow: "Section 01",
  title: "Harness and model",
  image: "figures/fig-harness-model.png",
  paras: [
    "A harness is the program that does things. Cline reads your files, writes the edits, runs the commands, and decides when to ask the model what to do next. It has no intelligence of its own.",
    "The model is the thing that decides what to say. It runs on someone else’s computer, never sees your disk, and can be swapped for another in three clicks.",
  ],
  figSource: "Fig. 2 — the two pieces you are driving",
  footerLeft: FOOT, page: p(8),
}).addNotes(
  "The single most useful distinction in the course. When something goes wrong they must ask which half broke: rate limited is a model problem, Diff Edit Failed is a harness problem."
);

/* 09 */ twoColumnSlide({
  eyebrow: "Section 01",
  title: "The tools people actually use",
  left: {
    label: "Harnesses",
    lead: "Cline and Roo Code, free inside VS Code. Cursor and Windsurf, whole editors. GitHub Copilot. Claude Code and Gemini CLI, in the terminal. Aider.",
    secondary: "All do the same job: read your files, write the edits, run the commands. We use Cline because it is free and shows you every step it takes.",
  },
  right: {
    label: "Models",
    lead: "Claude, GPT, Gemini, Mistral, Llama, Qwen, DeepSeek. Some you rent by the word; some you can download and run yourself.",
    secondary: "Nearly every harness lets you point at any of them. Swapping is a settings change, not a new tool — which is exactly why the split is worth knowing.",
  },
  footerLeft: FOOT, page: p(9),
}).addNotes(
  "Name-drop deliberately: these are the tools in job adverts, and students should recognise them. The point to land is the last line — when a model runs out of quota this afternoon they will change a dropdown and carry on working, and that only makes sense if they hold the two halves apart."
);

/* 10 */ figureSlide({
  eyebrow: "Section 01",
  title: "The loop the agent runs",
  image: "figures/fig-agent-loop.png",
  paras: [
    "Read, plan, edit, run, observe — then round again. The harness drives this loop until the task is done or you stop it.",
    "One sentence from you becomes four to ten laps, and every lap re-sends everything so far. That is where your allowance goes.",
  ],
  figSource: "Fig. 3 — one instruction, many laps",
  footerLeft: FOOT, page: p(10),
}).addNotes(
  "Walk the loop out loud with a concrete example: add a plot of the frequency response. Read the file, propose the edit, apply, run, read the error, go round again. The second paragraph sets up the quota slide."
);

/* 11 */ dividerSlide({
  n: 2,
  name: "What it costs, and why it fails",
  framing: "Three limits you will meet before lunch, and the reason none of them are bugs.",
}).addNotes(
  "This section is the one that changes their behaviour. Everything here is a constraint they hit today, not theory."
);

/* 12 */ bodySlide({
  eyebrow: "Section 02",
  title: "Context and its limits",
  bullets: [
    ["The model has no memory.", "Between one request and the next it retains nothing at all."],
    ["So everything is re-sent.", "Every request carries the whole conversation and every file read so far."],
    ["The context window is the ceiling", "on how much can be re-sent at once. Past it, the earliest parts fall away."],
    "A long conversation therefore makes an agent worse, not better. Start a new task for each feature.",
  ],
  footerLeft: FOOT, page: p(12),
}).addNotes(
  "The counter-intuitive point is the last one. Students assume a long conversation means the agent understands more; it means the opposite. The practical instruction is: start a new task per feature."
);

/* 13 */ codeSlide({
  eyebrow: "Section 02",
  title: "Your free allowance, and its two failures",
  code: [
    "one instruction from you",
    "    -> 4 to 10 requests",
    "a 2-hour lab",
    "    ~ 100 to 200 requests",
    "",
    "Gemini   250 req/day, 10/min",
    "         ~6s between steps",
    "Mistral  25,000 tokens/min",
    "         ~3 req/min",
    "         ~20s between steps",
  ].join("\n"),
  paras: [
    "One lab session is roughly one day of your Gemini allowance, and the pauses between steps are the limit working rather than a fault.",
    "Two different failures, opposite fixes. 429 “rate limited” means wait about a minute. 503 “high demand” means that model is refusing everyone — switch providers, because waiting will not help.",
  ],
  prompt: "Everything that cuts your request count is also just good engineering.",
  footerLeft: FOOT, page: p(13),
}).addNotes(
  "Do this arithmetic on the board with them rather than reading it. The number that lands is roughly one lab session per day on one account. Then the bridge into the gates."
);

/* 14 */ bodySlide({
  eyebrow: "Section 02",
  title: "Why an agent invents things",
  bullets: [
    ["It predicts, it does not look up.", "The reply is the text most likely to follow your request, not a fact retrieved from anywhere."],
    ["A plausible function looks real.", "A library call that ought to exist looks exactly like one that does."],
    ["It cannot warn you.", "Not knowing and knowing feel identical from the inside, so both come out equally confident."],
    "Which leaves one rule: you check by running something, never by reading something that sounds right.",
  ],
  footerLeft: FOOT, page: p(14),
}).addNotes(
  "The key sentence is the third. A model cannot report not-knowing, because from the inside it looks the same as knowing. Hence the rule for the whole course: verify by running."
);

/* 15 */ dividerSlide({
  n: 3,
  name: "Warm-up — build it by asking",
  framing: "No plan, no specification. Ask for the whole thing and see what arrives. 25 minutes.",
}).addNotes(
  "Say plainly: this round is meant to go badly, and going badly is the useful part. Do not rescue anyone during it."
);

/* 16 */ codeSlide({
  eyebrow: "Workshop 03",
  title: "Paste this, then watch",
  code: [
    "Build me a spectrum analyser in",
    "Streamlit. I set two sine waves",
    "- a frequency and an amplitude",
    "for each - and it adds them",
    "together and plots the",
    "time-domain waveform and the",
    "frequency spectrum.",
  ].join("\n"),
  paras: [
    "First run Step 1 in labs/LAB1.md — one command, and it is what lets you compare the two rounds at the end. Then paste this and accept whatever it gives you: do not plan, do not correct it.",
    "Set tone A to amplitude 1.0. Does the spike on the chart actually reach 1.0?",
  ],
  prompt: "If a classmate asked whether your app is correct, could you show them why?",
  footerLeft: FOOT, page: p(16),
}).addNotes(
  "Read the two questions aloud before they start; they are the point of the exercise, not the app. Circulate but do not help. Stop everyone at 25 minutes, especially anyone mid-flow."
);

/* 17 */ figureSlide({
  eyebrow: "Section 04",
  title: "The same app, asked for two ways",
  image: "figures/fig-round1-vs-round2.png",
  paras: [
    "Both were built by the same agent, on the same model, within the same hour. The left was one sentence. The right went through four checkpoints where a person decided before it could carry on.",
    "The left even drew its own “Expected: 50 Hz” markers. It verified the axis it got right and never checked the one it got wrong.",
  ],
  figSource: "Fig. 4 — one measured run, 1 September 2026. Yours will differ.",
  footerLeft: FOOT, page: p(17),
}).addNotes(
  "The bridge out of the warm-up and into the gates. Do NOT claim everyone got this - across four runs of Round 1 while building this lab, one read 0.5 for a 1.0 tone, one crashed before drawing a spectrum at all, and one was simply correct. Poll the room for those three outcomes by show of hands; you will get all three, and the spread is the point. Then land it: not one of you could tell which you had, and the ones who were right were right by luck. The gates did not make the agent correct - they made it wrong out loud. If a student says theirs worked, agree, and ask how they would have known if it had not."
);

/* 18 */ dividerSlide({
  n: 4,
  name: "The Four Gates",
  framing: "The same request, routed through four points where a person decides.",
}).addNotes(
  "Resume after the warm-up. Take three answers out loud before advancing, especially from anyone whose app looked finished. Most will not have checked the amplitude."
);

/* 19 */ twoColumnSlide({
  eyebrow: "Section 04",
  title: "Two routes to the same app",
  left: {
    label: "Asking directly",
    lead: "Faster to something on screen, and right often enough that it feels like it works.",
    secondary: "You cannot say what it should do, so you cannot say whether it does it. Nothing is checkable.",
  },
  right: {
    label: "Through the gates",
    lead: "Slower to the first screen, and you decide four times along the way instead of once at the end.",
    secondary: "Fewer requests too, because the agent stops guessing what you meant and backtracking.",
  },
  footerLeft: FOOT, page: p(19),
}).addNotes(
  "Keep this fair to the left column. Asking directly is genuinely faster and correct often enough to feel fine, which is exactly why it is dangerous. The difference is not speed, it is whether you can tell."
);

/* 20 */ figureSlide({
  eyebrow: "Section 04",
  title: "Four gates, four decisions",
  image: "figures/fig-four-gates.png",
  paras: [
    "A gate is where the agent stops and a person decides. You write the intent; the agent drafts the spec and the plan.",
    "You approve each before anything moves. Build then runs one task at a time — tests pass, you read the diff, and only then does the next task start.",
  ],
  figSource: "Fig. 5 — the agent proposes, you approve",
  footerLeft: FOOT, page: p(20),
}).addNotes(
  "Stress that Gate 1 is the only one they write themselves; the agent drafts 2 and 3 and they approve. Approving without reading is the failure mode to warn about now."
);

/* 21 */ codeSlide({
  eyebrow: "Section 04",
  title: "What you actually type",
  code: [
    "Read tests/test_spectrum.py.",
    "Those tests are the acceptance",
    "criteria. aidlc/intent.md says",
    "what we are building.",
    "",
    "Use your file-writing tool to",
    "WRITE aidlc/requirements.md ...",
    "",
    "Write the file now. Do not ask",
    "permission first. Do not print",
    "the table in your reply instead",
    "of writing it.",
  ].join("\n"),
  paras: [
    "All four gate prompts are in labs/PROMPTS.md. Copy them exactly today; improvise next week, once you have seen what a good one looks like.",
    "Every sentence in that last paragraph fixes a failure we watched happen: it asked permission and stopped, or it printed the table in the chat and called that done.",
  ],
  prompt: "Name the tool. Say where the output goes. Then forbid the near-miss.",
  footerLeft: FOOT, page: p(21),
}).addNotes(
  "The slide that stops the gates being magic. A gate is not a feature of Cline - it is a paragraph of English you paste, plus a rules file that makes refusing possible. Read the last three sentences aloud and say where each came from: an agent that asked permission and sat waiting, and an agent that printed a beautiful table in the chat and wrote no file at all. Both cost us a scored run during development."
);

/* 22 */ codeSlide({
  eyebrow: "Section 04",
  title: "Gate 1 — Intent, and you write it",
  code: [
    "**>INTENT<**  spec  plan  build  ship",
    "",
    "**READS**   nothing. This one is",
    "        yours.",
    "",
    "**YOU ANSWER**",
    "   Who is this for?",
    "   What problem does it solve?",
    "   What does “done” look like?",
    "   What is NOT included?",
    "",
    "**WRITES**  aidlc/intent.md",
  ].join("\n"),
  paras: [
    "The first box on the diagram, and the only one an agent cannot do for you. It has no prompt because nobody can tell you who your app is for.",
    "The fourth question is the one that earns its keep. Nothing told the Round 1 agent where to stop, so it invented scope.",
  ],
  prompt: "A vague intent does not produce a vague app. It produces a confident, wrong one.",
  footerLeft: FOOT, page: p(22),
}).addNotes(
  "Show the real file. The NOT-included question is worth dwelling on: their warm-up agent invented file loading, windowing and saving because nothing told it to stop. Scope is a decision, and it is theirs."
);

/* 23 */ codeSlide({
  eyebrow: "Section 04",
  title: "Gate 2 — Spec, and you approve it",
  code: [
    "intent  **>SPEC<**  plan  build  ship",
    "",
    "**READS**   aidlc/intent.md",
    "        tests/test_spectrum.py",
    "",
    "**PROMPT**  “intent.md says what we",
    "        are building. Read the",
    "        tests. WRITE a table,",
    "        each row with a check",
    "        that can be run.”",
    "",
    "**WRITES**  aidlc/requirements.md",
  ].join("\n"),
  paras: [
    "Notice what it reads: the intent YOU wrote at Gate 1, plus the tests. Each gate consumes what the last one produced — that chain is the whole method.",
    "The agent drafts; a person reads every line. It is far better at the left column than at the check beside it.",
  ],
  prompt: "Approve it only when every right-hand column could actually fail.",
  footerLeft: FOOT, page: p(23),
}).addNotes(
  "Requirement 5 is the trap that catches everyone, including the agent: the DC term must not be doubled. Ask the room how they would have written the check for requirement 3 — most say “the peak is in the right place”, which is exactly the check that misses a factor of five hundred."
);

/* 24 */ codeSlide({
  eyebrow: "Section 04",
  title: "Gate 3 — Plan, one file per task",
  code: [
    "intent  spec  **>PLAN<**  build  ship",
    "",
    "**READS**   aidlc/requirements.md",
    "",
    "**PROMPT**  “requirements.md is",
    "        approved. Read it. WRITE",
    "        design.md and tasks.md.",
    "        Exactly two tasks. One",
    "        owner, one file per row.”",
    "",
    "**WRITES**  aidlc/design.md",
    "        aidlc/tasks.md",
  ].join("\n"),
  paras: [
    "It reads the spec you just approved, and nothing else. Approve a plan here, not code — no code exists yet.",
    "Every task names the ONE file it may touch. Alone that is bookkeeping; in Session 2 it is what lets four people build at once with nothing to merge.",
  ],
  prompt: "One task, one owner, one file.",
  footerLeft: FOOT, page: p(24),
}).addNotes(
  "Approve the plan, not the code — no code exists yet. Flag forward to Session 2 explicitly: this is the rule that makes group work survivable without anyone having to learn git branching in an afternoon."
);

/* 25 */ codeSlide({
  eyebrow: "Section 04",
  title: "Gate 4 — Build, one task at a time",
  code: [
    "intent  spec  plan  **>BUILD<**  ship",
    "",
    "**READS**   aidlc/design.md",
    "        aidlc/tasks.md",
    "",
    "**PROMPT**  “design.md and tasks.md",
    "        are approved. Implement",
    "        task 1 only. OVERWRITE",
    "        core/spectrum.py.”",
    "",
    "**WRITES**  core/spectrum.py",
    "        $ pytest -> 7 passed",
  ].join("\n"),
  paras: [
    "The only box that produces code instead of a document, and it still reads the two documents before it. One task, one file, tests run, diff read, commit.",
    "The gates do not make the agent correct. They make it wrong out loud, early, in a place you are looking.",
  ],
  prompt: "Green tests and a diff you have actually read. Then the next task.",
  footerLeft: FOOT, page: p(25),
}).addNotes(
  "Commit every time the tests go green — that is what makes “git checkout the file” a safe escape hatch when the agent later mangles something. The failure mode to name now: approving a diff without reading it, which feels productive and is how the DC bug gets in."
);

/* 26 */ codeSlide({
  eyebrow: "Section 04",
  title: "One command turns them on",
  code: [
    "$ cp .clinerules.gates .clinerules",
    "$ git add .clinerules && git commit",
    "        -m \"turn the gates on\"",
    "",
    "# then START A NEW CLINE TASK",
    "# rules load when a task begins",
    "",
    "# .clinerules",
    "Gate 2 - Spec. Draft the",
    "requirements, then STOP and",
    "ask for approval.",
  ].join("\n"),
  paras: [
    "In Round 1 your agent had no process rules, which is why it went straight to code. This file is the difference, and it was in your repository the whole time.",
    "Same agent, same model, same request. Copy it into place, start a new task, and watch it refuse you.",
  ],
  prompt: "Plain English, in a plain file. By Session 2 you will be editing it.",
  footerLeft: FOOT, page: p(26),
}).addNotes(
  "Do the copy live and re-ask the Round 1 question so they watch the same agent refuse it. Budget two minutes, not thirty seconds: it is a real free-tier call and it can rate-limit on the projector, so have a screenshot of the refusal ready as a fallback. Commit the file in front of them - without the commit the next checkout silently restores the ungated version, which is the confusing failure LAB1 warns about. Then open the file: the rules are plain English and they can edit them. Sixty of you and one of me, so the file holds the line rather than me."
);

/* 27 */ twoColumnSlide({
  eyebrow: "Section 04",
  title: "You have seen these gates before",
  left: {
    label: "The gates you run",
    lead: "Intent, then spec, then plan, then build one task at a time, then ship.",
    secondary: "Five steps that fit in a two-hour lab and produce four short documents.",
  },
  right: {
    label: "What it is called elsewhere",
    lead: "Requirements, design, implementation, testing, deployment — the software lifecycle, taught since the 1970s.",
    secondary: "The agent needs these written down for the same reason a team of people does. Neither can read your mind.",
  },
  footerLeft: FOOT, page: p(27),
}).addNotes(
  "This is where the software engineering content enters, and it should feel like a reveal. They have not been given four arbitrary hoops; they have walked the standard lifecycle, which predates all of this by fifty years."
);

/* 28 */ bodySlide({
  eyebrow: "Section 04",
  title: "The words used in industry",
  bullets: [
    ["Intent.", "The business goal, before anyone has decided how to build it. Your Gate 1."],
    ["Units.", "The independent pieces an intent breaks into. Next week each of you owns one."],
    ["Bolts.", "Build cycles measured in hours rather than the two to six weeks of a sprint."],
    "From AI-DLC, published by AWS in 2025. Its one rule: the AI proposes, and a human approves.",
  ],
  footerLeft: FOOT, page: p(28),
}).addNotes(
  "Credit AWS explicitly; the paper is in the homework. Do not oversell it: AI-DLC targets large systems with many teams, and what they run today is a shrunk version. Say that plainly."
);

/* 29 */ dividerSlide({
  n: 5,
  name: "Lab 1 — the same app, done properly",
  framing: "Delete the warm-up and build it again through the gates. Instructions in labs/LAB1.md. 70 minutes.",
}).addNotes(
  "Say the timebox rule out loud before they start: fifteen minutes stuck on one task, then restore the reference and move on. Nobody loses marks for that."
);

/* 30 */ codeSlide({
  eyebrow: "Workshop 05",
  title: "What is already in your repository",
  code: [
    "app.py             run this",
    "pages/             ONE FILE per feature",
    "core/spectrum.py   <- you build this",
    "core/llm.py        AI slot, empty till S3",
    "tests/             <- your specification",
    "aidlc/             the four gate documents",
    ".clinerules        rules your agent obeys",
    ".clinerules.gates  the strict version",
    ".env               your keys. never commit",
  ].join("\n"),
  paras: [
    "Three minutes reading this saves you twenty later. The one to open now is .clinerules — plain English in a plain file, and your agent obeys it before every single request.",
    "Leave tests/ shut for the moment. You meet it at Gate 2, which is the point where it does the most good.",
  ],
  prompt: "One feature, one file. In Session 2 that is what lets four people build at once.",
  footerLeft: FOOT, page: p(30),
}).addNotes(
  "Do this on the projector with the file tree open, not off the slide. Open .clinerules and read a rule or two aloud, so the file is familiar before Round 2 swaps it. Do NOT open tests/ here, however tempting - the seven test names give away what Round 1 exists to let them discover. They meet the tests at Gate 2, on slide 33."
);

/* 31 */ figureSlide({
  eyebrow: "Workshop 05",
  title: "What you are building",
  image: "figures/fig-spectrum.png",
  paras: [
    "Two sine waves in, and a chart that finds them again: spikes at exactly the frequencies you chose, at exactly the heights you set.",
    "The heights are the check. A spectrum can put every spike in the right place and still be wrong by a factor of five hundred.",
  ],
  figSource: "Fig. 6 — output of pages/2_Spectrum_Analyzer.py",
  footerLeft: FOOT, page: p(31),
}).addNotes(
  "The first sight of the thing they build all day. Point at the spike heights: 1.0 and 0.5 are the numbers they typed in - that equality is the entire lab. If it looks unimpressive, good: the point is that correctness, not spectacle, is what they are chasing."
);

/* 32 */ twoColumnSlide({
  eyebrow: "Workshop 05",
  title: "What goes in, what must come out",
  left: {
    label: "Input",
    lead: "Two tones, each with a frequency in hertz and an amplitude. A sampling rate in samples per second, and a duration.",
    secondary: "These must work: 50 Hz at 1.0 and 120 Hz at 0.5, sampled at 1000 for one second. They are the numbers the tests use.",
  },
  right: {
    label: "Output",
    lead: "The combined waveform against time, and beside it the spectrum: one spike per tone, at the right frequency and at the right height.",
    secondary: "Plus the strongest frequency printed as a number. Seven tests in tests/test_spectrum.py decide whether any of it is right.",
  },
  footerLeft: FOOT, page: p(32),
}).addNotes(
  "Read this out as the acceptance criteria, because that is what it is. The height requirement is the one they will skip and the one the tests will catch: a chart with both spikes in exactly the right place and every height wrong looks entirely convincing. Get the direction right if they ask: drop the 1/N and a unit tone reads N/2 - five hundred times too TALL at these settings, not too short."
);

/* 33 */ codeSlide({
  eyebrow: "Workshop 05",
  title: "Your customer wrote the tests",
  code: [
    "# tests/test_spectrum.py",
    "",
    "def test_a_one_volt_sine_shows",
    "        _an_amplitude_of_one():",
    "    _, sig = make_signal(",
    "        [(50.0, 1.0)], FS, DURATION)",
    "    f, mag = spectrum(sig, FS)",
    "    assert mag[argmax(mag)] == approx(",
    "        1.0, abs=0.001)",
  ].join("\n"),
  paras: [
    "Seven tests are already in your repository. Your app is finished when they pass.",
    "Before you read them, write down in your own words how you would check the chart is right. Then compare.",
  ],
  prompt: "A spectrum can have every peak in exactly the right place and still be wrong by a factor of five hundred.",
  footerLeft: FOOT, page: p(33),
}).addNotes(
  "Show the real test file on screen. Ask them to predict which of the seven tests would still pass if the scaling were wrong. Answer: all but two."
);

/* 34 */ codeSlide({
  eyebrow: "Workshop 05",
  title: "Ship it — ten minutes",
  code: [
    "$ git push",
    "",
    "share.streamlit.io",
    "  Continue to sign-in",
    "  authorise GitHub  (first time)",
    "  New app -> from existing repo",
    "",
    "    repo    your-repo",
    "    branch  main",
    "    file    app.py",
    "",
    "  Deploy",
  ].join("\n"),
  paras: [
    "Push first. Your Codespace is not the internet — the cloud builds from GitHub, so anything you have not pushed does not exist as far as it is concerned.",
    "The first deploy makes you a Streamlit account and asks for access to your repositories. Builds take two to five minutes, and sixty of us are building at once.",
  ],
  prompt: "Not live by 2:45? Push, and deploy at home. The code and the four documents are the deliverable; the URL is a bonus.",
  footerLeft: FOOT, page: p(34),
}).addNotes(
  "Ten minutes is tight and it depends on someone else's servers, so say the fallback BEFORE they start rather than after it goes wrong. Two things break most often: they forgot to push, so the cloud builds an empty repo; and they point it at the wrong main file. Neither is worth your time individually - put both on the board. Nothing in Lab 1 needs an API key, so the deploy is genuinely simple today. It stops being simple in Session 3, when the app starts calling a model and .env is not in the repository - that is what Streamlit's Secrets box is for, and LAB2 says so at the point it starts to matter."
);

/* 35 */ bodySlide({
  eyebrow: "Section 06",
  title: "Read the reference before you leave",
  bullets: [
    ["Everyone does this,", "whether your own version works or not. The prompts are in labs/EXPLAIN.md."],
    ["Ask it to break the code.", "Change the 2/n to 1/n, run the tests, watch which two fail, then change it back."],
    ["Nothing here edits your work,", "so none of it can break your project. Explaining is the safest thing an agent does."],
    "Reading code you did not write, with an AI explaining it, is the most common way these tools are used at work.",
  ],
  footerLeft: FOOT, page: p(35),
}).addNotes(
  "Last fifteen minutes, everyone, whether or not their app worked. Insist on the mutation exercise: two tests fail, the peak-location test stays green, and the chart still looks perfectly reasonable."
);

/* 36 */ bodySlide({
  eyebrow: "Section 06",
  title: "The files a person writes at work",
  bullets: [
    ["Open the four you approved.", "aidlc/intent.md, requirements.md, design.md and tasks.md — read them as one set, in order."],
    ["In a real team a person writes these.", "A product owner or tech lead drafts the intent and spec. The agent drafting them is a start, not a replacement."],
    ["Which is why you approved each one.", "Everything built today came out of those four files. A wrong line there becomes a wrong app, quickly and cheaply."],
    "labs/PROMPTS.md explains why each prompt is worded the way it is. Read it before Session 2 — you will be writing your own.",
  ],
  footerLeft: FOOT, page: p(36),
}).addNotes(
  "The closing idea of the session, and the bridge to Session 2. Say plainly that the documents, not the code, were the work today — the code was the cheap part, and it will only get cheaper. Anyone whose app did not run still has four documents they can show, and that is a real deliverable."
);

/* 37 */ takeawaysSlide({
  eyebrow: "Session 01",
  lines: [
    "An agent is a harness driving a model. Knowing which half broke is half the fix.",
    "A requirement you cannot check by running something is not a requirement yet.",
    "Looking right and being right differ, and only one of them survives a test.",
  ],
  footerLeft: FOOT, page: p(37),
}).addNotes(
  "Leave this up for a moment; this is the slide they photograph. Then homework, then the closing slide for questions."
);

/* 38 */ closingSlide({
  question: "What did your agent get wrong?",
  reading: "Finish and deploy Lab 1 if it is not live yet",
  deadline: "Read the AI-DLC notes before Session 2",
  office: "come back in at github.com/codespaces · do not make a new one",
  contact: "Your Name · you@university.ac.th",
  page: p(38),
}).addNotes(
  "Leave up during questions. Stress the log: three things the agent got wrong. Anyone who writes 'it all worked fine' did not look hard enough, and it is thirty per cent of the individual mark."
);

const file = "Session 1 - Meet Your Agent.pptx";
await pres.writeFile({ fileName: file });
console.log(`Wrote ${file} — ${pres.slides.length} slides`);
console.log("Fonts: Libre Franklin (sans), IBM Plex Mono (mono). No substitutions made by the generator.");
