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
  presenter: "Witchapong Daroontham · Department of Electrical Engineering",
  date: "Session 1 of 3",
}).addNotes(
  "Cover. Hold it while people sit down. Say the one-line promise: by the end of today you will have built and published a working app, and you will know why the careful route beat the quick one."
);

/* 02 */ agendaSlide({
  eyebrow: "Session 01",
  items: [
    "How an agent works",
    "What it costs, and why it fails",
    "Warm-up — build it by asking",
    "The Four Gates",
    "Lab 1 — the same app, done properly",
    "Read the reference, then ship",
  ],
  footerLeft: FOOT, page: p(2),
}).addNotes(
  "Agenda. Point out that item 05 is where they build the real thing; everything before it exists to make 05 work."
);

/* 03 */ dividerSlide({
  n: 1,
  name: "How an agent works",
  framing: "What actually happens between typing a request and a file changing on disk.",
}).addNotes(
  "Before clicking on: ask who has used ChatGPT to write code. Most hands. Then ask who knows what happens between typing the request and the file changing. Few hands. That gap is this section."
);

/* 04 */ figureSlide({
  eyebrow: "Section 01",
  title: "What a language model is",
  image: "figures/fig-language-model.png",
  paras: [
    "Trained once, on a very large amount of writing, to do a single thing: given some text, guess what comes next. Everything it appears to do is built on top of that one trick.",
    "It consults no database. An answer is reconstructed from patterns, never retrieved — which is the mechanism behind everything on the next three slides.",
  ],
  figSource: "Fig. 1 — trained once, then rented by the word",
  footerLeft: FOOT, page: p(4),
}).addNotes(
  "Keep this to three minutes and resist the detail. The two things they must leave with: training happened once and is finished, and the model predicts rather than looks up. Say the cost out loud — training one of these runs to millions of dollars, which is why you rent it instead of building it. Someone always asks whether it is on the internet: no. It is a fixed set of numbers that has been frozen since the day training stopped."
);

/* 05 */ figureSlide({
  eyebrow: "Section 01",
  title: "Harness and model",
  brands: ["cline", "googlegemini"],
  image: "figures/fig-harness-model.png",
  paras: [
    "A harness is the program that does things. Cline reads your files, writes the edits, runs the commands, and decides when to ask the model what to do next. It has no intelligence of its own.",
    "The model is the thing that decides what to say. It runs on someone else’s computer, never sees your disk, and can be swapped for another in three clicks.",
  ],
  figSource: "Fig. 2 — the two pieces you are driving",
  footerLeft: FOOT, page: p(5),
}).addNotes(
  "The single most useful distinction in the course. When something goes wrong they must ask which half broke: rate limited is a model problem, Diff Edit Failed is a harness problem."
);

/* 06 */ twoColumnSlide({
  eyebrow: "Section 01",
  title: "The tools people actually use",
  brands: ["cline", "cursor", "githubcopilot", "claude", "googlegemini", "mistralai"],
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
  footerLeft: FOOT, page: p(6),
}).addNotes(
  "Name-drop deliberately: these are the tools in job adverts, and students should recognise them. The point to land is the last line — when a model runs out of quota this afternoon they will change a dropdown and carry on working, and that only makes sense if they hold the two halves apart."
);

/* 07 */ figureSlide({
  eyebrow: "Section 01",
  title: "The loop the agent runs",
  image: "figures/fig-agent-loop.png",
  paras: [
    "Read, plan, edit, run, observe — then round again. The harness drives this loop until the task is done or you stop it.",
    "One sentence from you becomes four to ten laps, and every lap re-sends everything so far. That is where your allowance goes.",
  ],
  figSource: "Fig. 3 — one instruction, many laps",
  footerLeft: FOOT, page: p(7),
}).addNotes(
  "Walk the loop out loud with a concrete example: add a plot of the frequency response. Read the file, propose the edit, apply, run, read the error, go round again. The second paragraph sets up the quota slide."
);

/* 08 */ dividerSlide({
  n: 2,
  name: "What it costs, and why it fails",
  framing: "Three limits you will meet before lunch, and the reason none of them are bugs.",
}).addNotes(
  "This section is the one that changes their behaviour. Everything here is a constraint they hit today, not theory."
);

/* 09 */ bodySlide({
  eyebrow: "Section 02",
  title: "Context and its limits",
  bullets: [
    ["The model has no memory.", "Between one request and the next it retains nothing at all."],
    ["So everything is re-sent.", "Every request carries the whole conversation and every file read so far."],
    ["The context window is the ceiling", "on how much can be re-sent at once. Past it, the earliest parts fall away."],
    "A long conversation therefore makes an agent worse, not better. Start a new task for each feature.",
  ],
  footerLeft: FOOT, page: p(9),
}).addNotes(
  "The counter-intuitive point is the last one. Students assume a long conversation means the agent understands more; it means the opposite. The practical instruction is: start a new task per feature."
);

/* 10 */ codeSlide({
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
  footerLeft: FOOT, page: p(10),
}).addNotes(
  "Do this arithmetic on the board with them rather than reading it. The number that lands is roughly one lab session per day on one account. Then the bridge into the gates."
);

/* 11 */ bodySlide({
  eyebrow: "Section 02",
  title: "Why an agent invents things",
  bullets: [
    ["It predicts, it does not look up.", "The reply is the text most likely to follow your request, not a fact retrieved from anywhere."],
    ["A plausible function looks real.", "A library call that ought to exist looks exactly like one that does."],
    ["It cannot warn you.", "Not knowing and knowing feel identical from the inside, so both come out equally confident."],
    "Which leaves one rule: you check by running something, never by reading something that sounds right.",
  ],
  footerLeft: FOOT, page: p(11),
}).addNotes(
  "The key sentence is the third. A model cannot report not-knowing, because from the inside it looks the same as knowing. Hence the rule for the whole course: verify by running."
);

/* 12 */ dividerSlide({
  n: 3,
  name: "Warm-up — build it by asking",
  framing: "Set the machine up, then ask for the whole thing with no plan and see what arrives. 15 minutes of setup, 25 of building.",
}).addNotes(
  "Setup happens here rather than at the door, so nobody sits idle waiting for the room to catch up - get every check green before anyone pastes a prompt. Then say plainly: this round is meant to go badly, and going badly is the useful part. Do not rescue anyone during it."
);

/* 13 */ bodySlide({
  eyebrow: "Workshop 03",
  title: "Before we start",
  brands: ["github", "googlegemini", "mistralai", "python"],
  bullets: [
    ["A GitHub account, then a Codespace.", "The template is at github.com/witchapong/ai-workshop-template — Use this template, then Code, then Codespaces. One click builds a Linux machine in your browser; nothing installs here."],
    ["TWO API keys, not one.", "Gemini at aistudio.google.com/apikey, Mistral at console.mistral.ai. Free tiers refuse service without warning."],
    ["Paste both into .env, save, close the tab.", "A key is a password, and you will be sharing this screen before the day is out."],
    ["Then run check_setup.py.", "Five checks. It names whichever one is not right yet. Do not move on until they are all green."],
  ],
  footerLeft: FOOT, page: p(13),
}).addNotes(
  "This is on screen as they walk in, and stays up for the first fifteen minutes. Say the key rule out loud: the key goes in .env, never in a file you commit, and never pasted into the chat. Walk the room rather than talking — the failures are individual, and the check script names each one."
);

/* 14 */ codeSlide({
  eyebrow: "Workshop 03",
  title: "The five checks",
  brands: ["python", "googlegemini"],
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
  footerLeft: FOOT, page: p(14),
}).addNotes(
  "The most common two failures: the key pasted with a trailing space, and the placeholder text left in place. Both are named explicitly by the script. If a whole row is stuck, it is usually the proxy rather than the student."
);

/* 15 */ bodySlide({
  eyebrow: "Workshop 03",
  title: "Cline needs its own key",
  brands: ["cline", "mistralai", "googlegemini"],
  bullets: [
    [".env is for your app.", "check_setup.py and core/llm.py read it. Cline never does — separate program, separate settings, its own copy of the key."],
    ["It opens on a screen nobody expects.", "“How will you use Cline?”, with Absolutely Free already ticked. Do not take it — choose Bring my own API key, or your key is never used."],
    ["Then provider, then model.", "Mistral or Gemini, paste the key. Model names carry a date — devstral-2512, not devstral-latest. Prefer a devstral if you see one."],
    "Check the model name after any reload: Cline can reset itself, sometimes to a paid one. A price per million tokens beside it means change it back.",
  ],
  footerLeft: FOOT, page: p(15),
}).addNotes(
  "The single most likely way for a student to arrive unable to work, and it is invisible: every check passes, then Cline opens on a configuration screen nobody mentioned - with the wrong option already selected for them. Do this one on the projector rather than describing it, because the free option is the big attractive button and taking it leaves their key unused with no error to tell them. Cline's model list is its own: it uses dated names and has no latest, so anything you read elsewhere will not match it."
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
    "**PROMPT**  “Read intent.md, then",
    "        the tests. WRITE a table.",
    "        Every done bullet gets a",
    "        row. pytest <name>, or",
    "        EYES: <what to look at>.”",
    "",
    "**WRITES**  aidlc/requirements.md",
  ].join("\n"),
  paras: [
    "Notice what it reads: the intent YOU wrote at Gate 1, plus the tests. Each gate consumes what the last one produced — that chain is the whole method.",
    "Two kinds of check, and you need both. A test for the maths; a person's eyes for the screen, because no test in this repository ever opens a page.",
  ],
  prompt: "Approve it only when every done bullet from your intent has a row that could fail.",
  footerLeft: FOOT, page: p(23),
}).addNotes(
  "Requirement 5 is the trap that catches everyone, including the agent: the DC term must not be doubled. Ask the room how they would have written the check for requirement 3 — most say “the peak is in the right place”, which is exactly the check that misses a factor of five hundred. The EYES row fixes a real failure from this course: a student whose intent asked for readable axes got seven rows, every one a pytest on core/ and nothing about the screen. Every test passed and the chart was unreadable."
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
    "        approved. WRITE design.md",
    "        and tasks.md. Two tasks,",
    "        one file each, and a",
    "        Done when for both.”",
    "",
    "**WRITES**  aidlc/design.md",
    "        aidlc/tasks.md",
  ].join("\n"),
  paras: [
    "It reads the spec you just approved, and nothing else. Approve a plan here, not code — no code exists yet.",
    "Every task names the ONE file it may touch, and the one criterion that says it is finished. A task with no Done when can never be wrong, so it will be.",
  ],
  prompt: "One task, one owner, one file, one check that could fail.",
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
    "        7 spectrum tests pass",
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
  brands: ["python", "pytest"],
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
  brands: ["streamlit"],
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
  brands: ["pytest"],
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
  title: "Round 2 — where each gate leaves you",
  code: [
    "**GATES 1-3 write documents.**",
    "The seven failures do not move.",
    "",
    "  gate 1   aidlc/intent.md",
    "  gate 2   aidlc/requirements.md",
    "  gate 3   aidlc/design.md, tasks.md",
    "",
    "**GATE 4 writes code.**",
    "Now pytest goes 7 failed -> 29 pass.",
    "",
    "  gate 4a  core/spectrum.py",
    "  gate 4b  the Streamlit page",
  ].join("\n"),
  paras: [
    "Every line of this happens on main. You do not change branch again — what changes is which files exist, and what pytest says.",
    "Nothing turns green until Gate 4. Three gates of documents with the number refusing to move is the design, not a fault.",
  ],
  prompt: "Lost? git branch --show-current, git status --short, pytest. Those three put you back on this list.",
  footerLeft: FOOT, page: p(34),
}).addNotes(
  "Leave this up for the whole of Round 2 if you can spare the projector. The panic you are heading off is at Gate 3: three gates in, an hour gone, and the test count has not moved a single digit. Say out loud that documents are the deliverable of gates 1 to 3, and that the seven failures are supposed to sit there untouched until the maths gets written."
);

/* 35 */ codeSlide({
  eyebrow: "Workshop 05",
  title: "Gate 1 — do this",
  code: [
    "**GATE 1 — INTENT**    you write this one",
    "",
    "**DO**     open aidlc/intent.md",
    "       answer the four questions",
    "       replace every PLACEHOLDER",
    "",
    "**CHECK**  grep -c PLACEHOLDER  ->  0",
    "",
    "**END**    intent.md filled in",
    "       pytest still 7 failed",
  ].join("\n"),
  paras: [
    "The only gate with no prompt. Four questions, four sentences, in your own words — this is the one the agent cannot do for you.",
    "It will refuse to write code while PLACEHOLDER is still in the file. That refusal is the gate working, not an error.",
  ],
  prompt: "The question that saves you is the last one: what is deliberately NOT included.",
  footerLeft: FOOT, page: p(35),
}).addNotes(
  "Five minutes, and they will want to spend twenty. Push them to write badly and move on - a rough intent that exists beats a polished one that does not. The NOT-included question is the one to read aloud: no file loading, no saving, no third tone. That single line is what stops the agent gold-plating for the rest of the afternoon."
);

/* 36 */ codeSlide({
  eyebrow: "Workshop 05",
  title: "Gate 2 — do this",
  code: [
    "**GATE 2 — SPEC**      the agent drafts",
    "",
    "**DO**     NEW task, paste \"Gate 2\"",
    "       from labs/PROMPTS.md",
    "       read it, reply approved",
    "",
    "**CHECK**  every bullet has a row,",
    "       all 7 tests cited, and",
    "       could each one FAIL?",
    "",
    "**END**    aidlc/requirements.md",
    "       pytest still 7 failed",
  ].join("\n"),
  paras: [
    "Before you paste anything, write down on paper how you would check the spectrum is right. Then compare it with what comes back.",
    "Count the rows against your intent. A pytest criterion may only back a claim about core/ — cite one for what the page does and it passes while the page is blank.",
  ],
  prompt: "One task per gate. A long conversation makes an agent worse, not better.",
  footerLeft: FOOT, page: p(36),
}).addNotes(
  "This is the gate that teaches the course's actual skill, so do not let them rush it. Ask two or three to read out one acceptance criterion, and put it to the room: could that ever fail? Most first drafts say the peak is in the right place, which is exactly the check that misses the scaling bug they are about to hit at Gate 4."
);

/* 37 */ codeSlide({
  eyebrow: "Workshop 05",
  title: "Gate 3 — do this",
  code: [
    "**GATE 3 — PLAN**    one file per task",
    "",
    "**DO**     NEW task, paste \"Gate 3\"",
    "       reply approved",
    "       git commit -m \"gates 1-3\"",
    "",
    "**CHECK**  design.md matches the tests",
    "       two tasks, one file each",
    "",
    "**END**    aidlc/design.md",
    "       aidlc/tasks.md",
    "       pytest still 7 failed",
  ].join("\n"),
  paras: [
    "You are approving a plan, not code. No code exists yet, which is exactly what makes this gate cheap to get right.",
    "One task, one file. Working alone that looks like bookkeeping; in Session 2 it is what lets four people build at once with nothing to merge.",
  ],
  prompt: "The task table is easy to check because the prompt dictated it. design.md is the part nobody dictated.",
  footerLeft: FOOT, page: p(37),
}).addNotes(
  "Flag forward to Session 2 explicitly here. The one-file-per-task rule looks like pedantry to someone working alone, and it is the only reason four people can build in parallel next week without anyone having to learn how to resolve a merge conflict."
);

/* 38 */ codeSlide({
  eyebrow: "Workshop 05",
  title: "Gate 4 — do this",
  code: [
    "**GATE 4 — BUILD**   one task at a time",
    "",
    "**DO**     a NEW task for each:",
    "       task 1: pytest, commit",
    "       task 2: run app, commit",
    "",
    "**CHECK**  7 spectrum tests pass",
    "       spike 1.0, then 0.3 -> 0.3",
    "       and no legend at all",
    "",
    "**END**    core/spectrum.py + page",
    "       **pytest 29 pass**",
  ].join("\n"),
  paras: [
    "Two tasks, two fresh Cline conversations, a commit after each. Never both in one task, however tempting it looks.",
    "If a test fails, paste that one failure back and let it fix that one thing. Fifteen minutes stuck is the limit, then restore the reference.",
  ],
  prompt: "Commit every time the tests go green. That is what makes git checkout a safe undo.",
  footerLeft: FOOT, page: p(38),
}).addNotes(
  "Forty minutes, and the room will fragment here - some green in ten, some still fighting the scaling at the end. Say the timebox before they start. The failure to watch for is not a failing test, it is a student clicking approve on a diff they have not read: that feels productive and is exactly how the DC bug gets committed."
);

/* 39 */ codeSlide({
  eyebrow: "Workshop 05",
  title: "Ship it — ten minutes",
  brands: ["streamlit", "github"],
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
  footerLeft: FOOT, page: p(39),
}).addNotes(
  "Ten minutes is tight and it depends on someone else's servers, so say the fallback BEFORE they start rather than after it goes wrong. Two things break most often: they forgot to push, so the cloud builds an empty repo; and they point it at the wrong main file. Neither is worth your time individually - put both on the board. Nothing in Lab 1 needs an API key, so the deploy is genuinely simple today. It stops being simple in Session 3, when the app starts calling a model and .env is not in the repository - that is what Streamlit's Secrets box is for, and LAB2 says so at the point it starts to matter."
);

/* 40 */ dividerSlide({
  n: 6,
  name: "How the analyser actually works",
  framing: "You approved this code. Now read it — the maths first, then the page that puts it on screen.",
}).addNotes(
  "Deliberately after the lab, not before it. They have already watched an agent get the scaling wrong and a test catch it, so the maths now answers a question they actually have. Fifteen minutes; skip the last slide and hand it out if you are short."
);

/* 41 */ codeSlide({
  eyebrow: "Section 06",
  title: "A wave becomes a list of numbers",
  brands: ["python", "numpy"],
  code: [
    "**# make_signal — building the input**",
    "",
    "times = np.arange(0, duration, 1/fs)",
    "signal = np.zeros_like(times)",
    "",
    "for freq, amp in components:",
    "    signal += amp * np.sin(",
    "        2 * np.pi * freq * times)",
    "",
    "fs = 1000 samples per second",
    "duration = 1 s  ->  n = 1000 numbers",
  ].join("\n"),
  paras: [
    "A computer never stores a curve. It stores the height of the wave at evenly spaced instants — here a thousand of them, one every millisecond.",
    "sin(2·pi·f·t) is one tone; the loop adds a term per tone. Everything after this works on that list of a thousand numbers.",
  ],
  prompt: "fs is the only reason the numbers mean anything. Without it, a list of samples has no timescale at all.",
  footerLeft: FOOT, page: p(41),
}).addNotes(
  "Put the real file on the projector rather than the slide. The line to dwell on is np.arange: the gap between samples is 1/fs, and that single number decides everything the rest of the code can and cannot see."
);

/* 42 */ bodySlide({
  eyebrow: "Section 06",
  title: "You only ever see half the sampling rate",
  bullets: [
    ["Sample at 1000 Hz and the highest frequency you can measure is 500.", "That ceiling is the Nyquist frequency, exactly half the sampling rate. The lab's 50 Hz and 120 Hz sit comfortably underneath it."],
    ["Above the ceiling, a tone comes back wearing a disguise.", "A 600 Hz tone sampled at 1000 Hz is indistinguishable from a 400 Hz one. That is aliasing, and it is why wagon wheels appear to spin backwards on film."],
    ["Nothing in the code will warn you.", "rfftfreq simply stops at 500 Hz. A tone above it does not raise an error — it quietly reports the wrong frequency, and the chart looks entirely reasonable."],
    ["The fix is always the sampling rate, never the maths.", "To see a 1 kHz tone you must sample faster than 2 kHz. This is the Nyquist–Shannon sampling theorem, and it is the one piece of theory worth carrying out of today."],
  ],
  footerLeft: FOOT, page: p(42),
}).addNotes(
  "The wagon wheel is the example that lands - most of them have seen it without knowing it had a name. If anyone asks why the tests use 1000 Hz for a 120 Hz tone, this is the answer: comfortably more than twice the highest frequency in the signal."
);

/* 43 */ codeSlide({
  eyebrow: "Section 06",
  title: "From N samples to N/2 + 1 frequencies",
  brands: ["python", "numpy"],
  code: [
    "**# spectrum — time into frequency**",
    "",
    "coefficients = np.fft.rfft(signal)",
    "freqs = np.fft.rfftfreq(n, 1/fs)",
    "",
    "n = 1000 samples, fs = 1000 Hz",
    "  ->  501 frequencies, 0 to 500 Hz",
    "  ->  spaced fs/n = 1 Hz apart",
    "",
    "one second of signal buys you",
    "  1 Hz of frequency detail",
  ].join("\n"),
  paras: [
    "The discrete Fourier transform asks, of every frequency it can see, how much of that frequency is in the signal. rfft does it for real input and returns only the positive half.",
    "Resolution comes from duration alone: bins sit fs/n apart, and n is fs times duration, so the spacing is 1/duration. Two seconds would give 0.5 Hz.",
  ],
  prompt: "Longer recording, finer frequency detail. Faster sampling, higher ceiling. Two different knobs.",
  footerLeft: FOOT, page: p(43),
}).addNotes(
  "The two-knobs line is the one to make them repeat back. Students reliably conflate the two and try to fix poor resolution by sampling faster, which does nothing at all - it raises a ceiling they were not hitting. Recording for longer is the only thing that separates two close tones."
);

/* 44 */ codeSlide({
  eyebrow: "Section 06",
  title: "The two lines that scale it",
  brands: ["python", "numpy"],
  code: [
    "**# the two lines that matter**",
    "",
    "mag = 2.0 * np.abs(coefficients) / n",
    "mag[0] = np.abs(coefficients[0]) / n",
    "",
    "why 2/n ?",
    "  a tone splits its energy",
    "  between +f and -f",
    "  rfft shows you only +f",
    "",
    "why is bin 0 different ?",
    "  0 Hz has no negative twin",
  ].join("\n"),
  paras: [
    "Without the 2/n a one-volt tone reads about five hundred. Every spike lands in the right place and every height is wrong.",
    "Bin 0 is a constant offset. It was never split across a pair, so doubling it makes it twice what it should be — the bug the agent writes most often.",
  ],
  prompt: "Requirement 5 in your spec, and the single line most worth checking by hand.",
  footerLeft: FOOT, page: p(44),
}).addNotes(
  "This is the payoff for the whole lab, so land it slowly. Ask which of their seven tests would still pass with the 2/n missing - the answer is the ones checking peak position, which is most of them. That is what an acceptance criterion that cannot fail buys you, stated in code they wrote this afternoon."
);

/* 45 */ codeSlide({
  eyebrow: "Section 06",
  title: "One file per page, and Streamlit finds it",
  brands: ["streamlit", "python"],
  code: [
    "**app.py**   run this. the entry point.",
    "",
    "**pages/**   one file = one tab",
    "  1_Example.py",
    "  2_Spectrum_Analyzer.py",
    "  9_Intake_Desk.py",
    "",
    "the leading number orders the tabs",
    "underscores become spaces",
    "there is no routing code to write",
  ].join("\n"),
  paras: [
    "Streamlit turns every file in pages/ into a tab by itself. You never register a route or edit a config — you add a file, and it appears.",
    "That is why the plan at Gate 3 gives one file to one task. Next week it is one file to one person, and four people never touch the same one.",
  ],
  prompt: "The convention doing the real work here is a naming rule, not a framework feature.",
  footerLeft: FOOT, page: p(45),
}).addNotes(
  "Show the sidebar next to the file tree so the mapping is literally visible. This is also where the Round 1 mess pays off: their agent knew nothing about pages/ and wrote a loose script at the top level, so the tab never appeared. The convention only looks obvious once you have watched an agent miss it."
);

/* 46 */ codeSlide({
  eyebrow: "Section 06",
  title: "Widgets in, chart out, and it reruns every time",
  brands: ["streamlit", "python"],
  code: [
    "**# the page, top to bottom**",
    "",
    "fs = st.select_slider(...)",
    "freq_a = st.number_input(...)",
    "amp_a = st.number_input(...)",
    "",
    "times, sig = make_signal(...)",
    "freqs, mag = spectrum(sig, fs)",
    "",
    "st.metric(\"Strongest frequency\", ...)",
    "st.pyplot(figure)",
    "st.info(\"check it yourself ...\")",
  ].join("\n"),
  paras: [
    "A widget is not an event handler. st.number_input hands back whatever is in the box right now, the script carries on using it, and moving any control reruns the whole file from the top.",
    "st.metric, st.pyplot and st.info are how this page shows a result. If your agent reaches for st.line_chart instead, name the axes with x= and y=, or it draws your x-axis as a second line.",
  ],
  prompt: "The maths lives in core/ with no Streamlit in it. That is why seven tests can check it without ever opening a browser.",
  footerLeft: FOOT, page: p(46),
}).addNotes(
  "The rerun model is the one thing to make them say back to you: there is no onChange anywhere in this file, and every interaction runs all forty lines again. Then point at the import at the top - core.spectrum knows nothing about Streamlit, and Streamlit knows nothing about FFTs. That split is why the tests could exist before the page did. Say the st.line_chart trap out loud: a student in this course got a chart with Time and Frequency drawn as data lines, no readable axis at all, while all their tests passed. The legend is the tell - an axis name should never be in it."
);

/* 47 */ twoColumnSlide({
  eyebrow: "Section 06",
  title: "Where to read more",
  brands: ["python", "numpy", "streamlit", "pytest"],
  left: {
    label: "The theory",
    lead: "Steven Smith, “The Scientist and Engineer's Guide to Digital Signal Processing” — free in full at dspguide.com. Chapters 8 to 12 cover everything on the last three slides.",
    secondary: "For intuition rather than algebra, 3Blue1Brown's “But what is the Fourier Transform?” is twenty minutes and worth all of them. Search Nyquist–Shannon sampling theorem for the ceiling.",
  },
  right: {
    label: "The tools",
    lead: "numpy.org documents fft.rfft and fft.rfftfreq, including the normalisation conventions behind every scaling bug you saw today.",
    secondary: "docs.streamlit.io for the interface and docs.pytest.org for the tests. Both are the official pages, both are shorter than you would expect, and both are what your agent was trained on.",
  },
  footerLeft: FOOT, page: p(47),
}).addNotes(
  "Hand this out rather than reading it. The one to actually push is dspguide.com - free, written for engineers who have not done the maths yet, and the book that makes the next signals course easier. Say plainly that the official docs are what the model has read, so quoting them in a prompt works better than describing what you want in your own words."
);

/* 48 */ bodySlide({
  eyebrow: "Section 07",
  title: "Read the reference before you leave",
  bullets: [
    ["Everyone does this,", "whether your own version works or not. The prompts are in labs/EXPLAIN.md."],
    ["Ask it to break the code.", "Change the 2/n to 1/n, run the tests, watch which two fail, then change it back."],
    ["Nothing here edits your work,", "so none of it can break your project. Explaining is the safest thing an agent does."],
    "Reading code you did not write, with an AI explaining it, is the most common way these tools are used at work.",
  ],
  footerLeft: FOOT, page: p(48),
}).addNotes(
  "Last fifteen minutes, everyone, whether or not their app worked. Insist on the mutation exercise: two tests fail, the peak-location test stays green, and the chart still looks perfectly reasonable."
);

/* 49 */ bodySlide({
  eyebrow: "Section 07",
  title: "The files a person writes at work",
  bullets: [
    ["Open the four you approved.", "aidlc/intent.md, requirements.md, design.md and tasks.md — read them as one set, in order."],
    ["In a real team a person writes these.", "A product owner or tech lead drafts the intent and spec. The agent drafting them is a start, not a replacement."],
    ["Which is why you approved each one.", "Everything built today came out of those four files. A wrong line there becomes a wrong app, quickly and cheaply."],
    "labs/PROMPTS.md explains why each prompt is worded the way it is. Read it before Session 2 — you will be writing your own.",
  ],
  footerLeft: FOOT, page: p(49),
}).addNotes(
  "The closing idea of the session, and the bridge to Session 2. Say plainly that the documents, not the code, were the work today — the code was the cheap part, and it will only get cheaper. Anyone whose app did not run still has four documents they can show, and that is a real deliverable."
);

/* 50 */ takeawaysSlide({
  eyebrow: "Session 01",
  lines: [
    "An agent is a harness driving a model. Knowing which half broke is half the fix.",
    "A requirement you cannot check by running something is not a requirement yet.",
    "Looking right and being right differ, and only one of them survives a test.",
  ],
  footerLeft: FOOT, page: p(50),
}).addNotes(
  "Leave this up for a moment; this is the slide they photograph. Then homework, then the closing slide for questions."
);

/* 51 */ closingSlide({
  question: "What did your agent get wrong?",
  reading: "Finish and deploy Lab 1 if it is not live yet",
  deadline: "Read the AI-DLC notes before Session 2",
  office: "come back in at github.com/codespaces · do not make a new one",
  contact: "Witchapong Daroontham · Department of Electrical Engineering",
  page: p(51),
}).addNotes(
  "Leave up during questions. Stress the log: three things the agent got wrong. Anyone who writes 'it all worked fine' did not look hard enough, and it is thirty per cent of the individual mark."
);

const file = "Session 1 - Meet Your Agent.pptx";
await pres.writeFile({ fileName: file });
console.log(`Wrote ${file} — ${pres.slides.length} slides`);
console.log("Fonts: Libre Franklin (sans), IBM Plex Mono (mono). No substitutions made by the generator.");
