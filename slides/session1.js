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
    ["A GitHub account.", "Free. Sign up at github.com — use your university email if you do not have one yet."],
    ["Open the template as a Codespace.", "One click from the repository page. It builds a Linux machine in your browser; nothing installs on this PC."],
    ["A Gemini API key.", "Free at aistudio.google.com/apikey. Paste it into .env, save, and never commit it."],
    ["Then run check_setup.py.", "It names whichever of the four checks is not right yet. Do not move on until all four are green."],
  ],
  footerLeft: FOOT, page: p(2),
}).addNotes(
  "This is on screen as they walk in, and stays up for the first fifteen minutes. Say the key rule out loud: the key goes in .env, never in a file you commit, and never pasted into the chat. Walk the room rather than talking — the failures are individual, and the check script names each one."
);

/* 03 */ codeSlide({
  eyebrow: "Setup",
  title: "The four checks",
  code: [
    "$ python check_setup.py",
    "",
    "[PASS] Python version: 3.11",
    "[PASS] Packages: all 6 installed",
    "[PASS] API key present",
    "[PASS] API key works: Gemini",
    "       replied",
    "",
    "ALL CHECKS PASSED - you are",
    "ready for the session.",
  ].join("\n"),
  paras: [
    "Four checks, in the order they can fail. A failing line names the fix; it never just tells you something is wrong.",
    "Still stuck after ten minutes? Ask a neighbour before you ask me. TROUBLESHOOTING.md carries the same list with fixes.",
  ],
  prompt: "Nothing installs on the lab PC. The machine you are working on is in the browser.",
  footerLeft: FOOT, page: p(3),
}).addNotes(
  "The most common two failures: the key pasted with a trailing space, and the placeholder text left in place. Both are named explicitly by the script. If a whole row is stuck, it is usually the proxy rather than the student."
);

/* 04 */ agendaSlide({
  eyebrow: "Session 01",
  items: [
    "How an agent works",
    "What it costs, and why it fails",
    "Warm-up — build it by asking",
    "The Four Gates",
    "Lab 1 — the same app, done properly",
    "Read the reference, then ship",
  ],
  footerLeft: FOOT, page: p(4),
}).addNotes(
  "Agenda. Point out that item 05 is where they build the real thing; everything before it exists to make 05 work."
);

/* 05 */ dividerSlide({
  n: 1,
  name: "How an agent works",
  framing: "What actually happens between typing a request and a file changing on disk.",
}).addNotes(
  "Before clicking on: ask who has used ChatGPT to write code. Most hands. Then ask who knows what happens between typing the request and the file changing. Few hands. That gap is this section."
);

/* 06 */ figureSlide({
  eyebrow: "Section 01",
  title: "What a language model is",
  image: "figures/fig-language-model.png",
  paras: [
    "Trained once, on a very large amount of writing, to do a single thing: given some text, guess what comes next. Everything it appears to do is built on top of that one trick.",
    "It consults no database. An answer is reconstructed from patterns, never retrieved — which is the mechanism behind everything on the next three slides.",
  ],
  figSource: "Fig. 1 — trained once, then rented by the word",
  footerLeft: FOOT, page: p(6),
}).addNotes(
  "Keep this to three minutes and resist the detail. The two things they must leave with: training happened once and is finished, and the model predicts rather than looks up. Say the cost out loud — training one of these runs to millions of dollars, which is why you rent it instead of building it. Someone always asks whether it is on the internet: no. It is a fixed set of numbers that has been frozen since the day training stopped."
);

/* 07 */ figureSlide({
  eyebrow: "Section 01",
  title: "Harness and model",
  image: "figures/fig-harness-model.png",
  paras: [
    "A harness is the program that does things. Cline reads your files, writes the edits, runs the commands, and decides when to ask the model what to do next. It has no intelligence of its own.",
    "The model is the thing that decides what to say. It runs on someone else’s computer, never sees your disk, and can be swapped for another in three clicks.",
  ],
  figSource: "Fig. 2 — the two pieces you are driving",
  footerLeft: FOOT, page: p(7),
}).addNotes(
  "The single most useful distinction in the course. When something goes wrong they must ask which half broke: rate limited is a model problem, Diff Edit Failed is a harness problem."
);

/* 08 */ twoColumnSlide({
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
  footerLeft: FOOT, page: p(8),
}).addNotes(
  "Name-drop deliberately: these are the tools in job adverts, and students should recognise them. The point to land is the last line — when a model runs out of quota this afternoon they will change a dropdown and carry on working, and that only makes sense if they hold the two halves apart."
);

/* 09 */ figureSlide({
  eyebrow: "Section 01",
  title: "The loop the agent runs",
  image: "figures/fig-agent-loop.png",
  paras: [
    "Read, plan, edit, run, observe — then round again. The harness drives this loop until the task is done or you stop it.",
    "One sentence from you becomes four to ten laps, and every lap re-sends everything so far. That is where your allowance goes.",
  ],
  figSource: "Fig. 3 — one instruction, many laps",
  footerLeft: FOOT, page: p(9),
}).addNotes(
  "Walk the loop out loud with a concrete example: add a plot of the frequency response. Read the file, propose the edit, apply, run, read the error, go round again. The second paragraph sets up the quota slide."
);

/* 10 */ dividerSlide({
  n: 2,
  name: "What it costs, and why it fails",
  framing: "Three limits you will meet before lunch, and the reason none of them are bugs.",
}).addNotes(
  "This section is the one that changes their behaviour. Everything here is a constraint they hit today, not theory."
);

/* 11 */ bodySlide({
  eyebrow: "Section 02",
  title: "Context and its limits",
  bullets: [
    ["The model has no memory.", "Between one request and the next it retains nothing at all."],
    ["So everything is re-sent.", "Every request carries the whole conversation and every file read so far."],
    ["The context window is the ceiling", "on how much can be re-sent at once. Past it, the earliest parts fall away."],
    "A long conversation therefore makes an agent worse, not better. Start a new task for each feature.",
  ],
  footerLeft: FOOT, page: p(11),
}).addNotes(
  "The counter-intuitive point is the last one. Students assume a long conversation means the agent understands more; it means the opposite. The practical instruction is: start a new task per feature."
);

/* 12 */ codeSlide({
  eyebrow: "Section 02",
  title: "Your free allowance, in one sum",
  code: [
    "one instruction from you",
    "    -> 4 to 10 requests",
    "",
    "a 2-hour lab",
    "    ~ 20 instructions",
    "    ~ 100 to 200 requests",
    "",
    "free tier, one Gemini Flash key",
    "    250 requests per day",
    "    10 requests per minute",
  ].join("\n"),
  paras: [
    "One lab session is roughly one day of your free allowance. There is no spare.",
    "Ten per minute also means the agent pauses about six seconds between steps. That is the limit working, not a fault.",
  ],
  prompt: "Everything that cuts your request count is also just good engineering.",
  footerLeft: FOOT, page: p(12),
}).addNotes(
  "Do this arithmetic on the board with them rather than reading it. The number that lands is roughly one lab session per day on one account. Then the bridge into the gates."
);

/* 13 */ bodySlide({
  eyebrow: "Section 02",
  title: "Why an agent invents things",
  bullets: [
    ["It predicts, it does not look up.", "The reply is the text most likely to follow your request, not a fact retrieved from anywhere."],
    ["A plausible function looks real.", "A library call that ought to exist looks exactly like one that does."],
    ["It cannot warn you.", "Not knowing and knowing feel identical from the inside, so both come out equally confident."],
    "Which leaves one rule: you check by running something, never by reading something that sounds right.",
  ],
  footerLeft: FOOT, page: p(13),
}).addNotes(
  "The key sentence is the third. A model cannot report not-knowing, because from the inside it looks the same as knowing. Hence the rule for the whole course: verify by running."
);

/* 14 */ dividerSlide({
  n: 3,
  name: "Warm-up — build it by asking",
  framing: "No plan, no specification. Ask for the whole thing and see what arrives. 25 minutes.",
}).addNotes(
  "Say plainly: this round is meant to go badly, and going badly is the useful part. Do not rescue anyone during it."
);

/* 15 */ codeSlide({
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
    "Accept whatever it gives you. Do not plan, do not correct it, do not write anything down first.",
    "Set tone A to amplitude 1.0. Does the spike on the chart actually reach 1.0?",
  ],
  prompt: "If a classmate asked whether your app is correct, could you show them why?",
  footerLeft: FOOT, page: p(15),
}).addNotes(
  "Read the two questions aloud before they start; they are the point of the exercise, not the app. Circulate but do not help. Stop everyone at 25 minutes, especially anyone mid-flow."
);

/* 16 */ dividerSlide({
  n: 4,
  name: "The Four Gates",
  framing: "The same request, routed through four points where a person decides.",
}).addNotes(
  "Resume after the warm-up. Take three answers out loud before advancing, especially from anyone whose app looked finished. Most will not have checked the amplitude."
);

/* 17 */ twoColumnSlide({
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
  footerLeft: FOOT, page: p(17),
}).addNotes(
  "Keep this fair to the left column. Asking directly is genuinely faster and correct often enough to feel fine, which is exactly why it is dangerous. The difference is not speed, it is whether you can tell."
);

/* 18 */ figureSlide({
  eyebrow: "Section 04",
  title: "Four gates, four decisions",
  image: "figures/fig-four-gates.png",
  paras: [
    "A gate is where the agent stops and a person decides. You write the intent; the agent drafts the spec and the plan.",
    "You approve each before anything moves. Build then runs one task at a time — tests pass, you read the diff, and only then does the next task start.",
  ],
  figSource: "Fig. 4 — the agent proposes, you approve",
  footerLeft: FOOT, page: p(18),
}).addNotes(
  "Stress that Gate 1 is the only one they write themselves; the agent drafts 2 and 3 and they approve. Approving without reading is the failure mode to warn about now."
);

/* 19 */ codeSlide({
  eyebrow: "Section 04",
  title: "Gate 1 — Intent, and you write it",
  code: [
    "# aidlc/intent.md",
    "",
    "Who is this for?",
    "  A student who has just met",
    "  the Fourier transform.",
    "",
    "What does \u201cdone\u201d look like?",
    "  I set two sine waves going",
    "  and see a chart with exactly",
    "  those two frequencies, at the",
    "  amplitudes I chose.",
  ].join("\n"),
  paras: [
    "The only gate you write yourself, in your own words: who it is for, what problem it solves, what done looks like, and what is deliberately left out.",
    "The agent will not start without it. A vague intent does not produce a vague app — it produces a confident, wrong one.",
  ],
  prompt: "The question that saves you is the one about scope: what is deliberately NOT included.",
  footerLeft: FOOT, page: p(19),
}).addNotes(
  "Show the real file. The NOT-included question is worth dwelling on: their warm-up agent invented file loading, windowing and saving because nothing told it to stop. Scope is a decision, and it is theirs."
);

/* 20 */ codeSlide({
  eyebrow: "Section 04",
  title: "Gate 2 — Spec, and you approve it",
  code: [
    "# aidlc/requirements.md",
    "",
    "3. Report the correct amplitude",
    "   check: a tone entered at 1.0",
    "   reads back as 1.0, +/- 0.001",
    "",
    "5. Handle a constant offset",
    "   check: a DC offset of 2.0",
    "   appears at 0 Hz as 2.0,",
    "   not 4.0",
  ].join("\n"),
  paras: [
    "The agent drafts these; you read every line and fix what is wrong. It is far better at the requirement than at the check beside it.",
    "Every requirement carries something you can run. A requirement you cannot check by running something is not a requirement yet.",
  ],
  prompt: "Reply “approved” only when every check on the slide could actually fail.",
  footerLeft: FOOT, page: p(20),
}).addNotes(
  "Requirement 5 is the trap that catches everyone, including the agent: the DC term must not be doubled. Ask the room how they would have written the check for requirement 3 — most say “the peak is in the right place”, which is exactly the check that misses a factor of five hundred."
);

/* 21 */ codeSlide({
  eyebrow: "Section 04",
  title: "Gate 3 — Plan, one file per task",
  code: [
    "# aidlc/tasks.md",
    "",
    "1. The maths: build a signal,",
    "   take its spectrum, find the",
    "   strongest frequency",
    "   -> core/spectrum.py",
    "",
    "2. The screen: two tones in,",
    "   two charts out",
    "   -> pages/2_Spectrum_...py",
  ].join("\n"),
  paras: [
    "Design and a task list, and every task names the ONE file it is allowed to touch. Working alone today that looks like bookkeeping.",
    "In Session 2 it is the whole trick: four people build at once and never touch the same file, so there is nothing to merge.",
  ],
  prompt: "One task, one owner, one file.",
  footerLeft: FOOT, page: p(21),
}).addNotes(
  "Approve the plan, not the code — no code exists yet. Flag forward to Session 2 explicitly: this is the rule that makes group work survivable without anyone having to learn git branching in an afternoon."
);

/* 22 */ codeSlide({
  eyebrow: "Section 04",
  title: "Gate 4 — Build, one task at a time",
  code: [
    "$ pytest tests/test_spectrum.py",
    "7 failed",
    "",
    "   agent edits core/spectrum.py",
    "   you read the diff",
    "",
    "$ pytest tests/test_spectrum.py",
    "7 passed",
    "",
    "$ git add -A && git commit",
  ].join("\n"),
  paras: [
    "The only gate with no document. One task: the agent edits a single file, you run the tests, you read the diff, you commit.",
    "Never let it run three tasks at once. When something breaks you want one small change in front of you, not three.",
  ],
  prompt: "Green tests and a diff you have actually read. Then the next task.",
  footerLeft: FOOT, page: p(22),
}).addNotes(
  "Commit every time the tests go green — that is what makes “git checkout the file” a safe escape hatch when the agent later mangles something. The failure mode to name now: approving a diff without reading it, which feels productive and is how the DC bug gets in."
);

/* 23 */ codeSlide({
  eyebrow: "Section 04",
  title: "One command turns them on",
  code: [
    "$ cp .clinerules.gates .clinerules",
    "",
    "# .clinerules",
    "",
    "Gate 2 - Spec. Before any code",
    "exists, aidlc/requirements.md",
    "must list numbered requirements,",
    "each with an acceptance criterion",
    "that can be checked by running",
    "something. Draft it, then STOP",
    "and ask for approval.",
  ].join("\n"),
  paras: [
    "In Round 1 your agent had no process rules, which is why it went straight to code. This file is the difference, and it was in your repository the whole time.",
    "Same agent, same model, same request. Copy it into place, start a new task, and watch it refuse you.",
  ],
  prompt: "Plain English, in a plain file. By Session 2 you will be editing it.",
  footerLeft: FOOT, page: p(23),
}).addNotes(
  "Do the copy live, on the projector, and re-ask the Round 1 question so they watch the same agent refuse it. That before-and-after is the argument of the whole session, and it costs thirty seconds. Then open the file: the rules are plain English and they can edit them. Sixty of you and one of me, so the file holds the line rather than me."
);

/* 24 */ twoColumnSlide({
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
  footerLeft: FOOT, page: p(24),
}).addNotes(
  "This is where the software engineering content enters, and it should feel like a reveal. They have not been given four arbitrary hoops; they have walked the standard lifecycle, which predates all of this by fifty years."
);

/* 25 */ bodySlide({
  eyebrow: "Section 04",
  title: "The words used in industry",
  bullets: [
    ["Intent.", "The business goal, before anyone has decided how to build it. Your Gate 1."],
    ["Units.", "The independent pieces an intent breaks into. Next week each of you owns one."],
    ["Bolts.", "Build cycles measured in hours rather than the two to six weeks of a sprint."],
    "From AI-DLC, published by AWS in 2025. Its one rule: the AI proposes, and a human approves.",
  ],
  footerLeft: FOOT, page: p(25),
}).addNotes(
  "Credit AWS explicitly; the paper is in the homework. Do not oversell it: AI-DLC targets large systems with many teams, and what they run today is a shrunk version. Say that plainly."
);

/* 26 */ dividerSlide({
  n: 5,
  name: "Lab 1 — the same app, done properly",
  framing: "Delete the warm-up and build it again through the gates. Instructions in labs/LAB1.md. 70 minutes.",
}).addNotes(
  "Say the timebox rule out loud before they start: fifteen minutes stuck on one task, then restore the reference and move on. Nobody loses marks for that."
);

/* 27 */ figureSlide({
  eyebrow: "Workshop 05",
  title: "What you are building",
  image: "figures/fig-spectrum.png",
  paras: [
    "Two sine waves in, and a chart that finds them again: spikes at exactly the frequencies you chose, at exactly the heights you set.",
    "The heights are the check. A spectrum can put every spike in the right place and still be wrong by a factor of five hundred.",
  ],
  figSource: "Fig. 5 — output of pages/2_Spectrum_Analyzer.py",
  footerLeft: FOOT, page: p(27),
}).addNotes(
  "The first sight of the thing they build all day. Point at the spike heights: 1.0 and 0.5 are the numbers they typed in - that equality is the entire lab. If it looks unimpressive, good: the point is that correctness, not spectacle, is what they are chasing."
);

/* 28 */ twoColumnSlide({
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
  footerLeft: FOOT, page: p(28),
}).addNotes(
  "Read this out as the acceptance criteria, because that is what it is. The height requirement is the one they will skip and the one the tests will catch: a chart with both spikes in the right place, five hundred times too short, looks entirely convincing."
);

/* 29 */ codeSlide({
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
  footerLeft: FOOT, page: p(29),
}).addNotes(
  "Show the real test file on screen. Ask them to predict which of the seven tests would still pass if the scaling were wrong. Answer: all but two."
);

/* 30 */ bodySlide({
  eyebrow: "Section 06",
  title: "Read the reference before you leave",
  bullets: [
    ["Everyone does this,", "whether your own version works or not. The prompts are in labs/EXPLAIN.md."],
    ["Ask it to break the code.", "Change the 2/n to 1/n, run the tests, watch which two fail, then change it back."],
    ["Nothing here edits your work,", "so none of it can break your project. Explaining is the safest thing an agent does."],
    "Reading code you did not write, with an AI explaining it, is the most common way these tools are used at work.",
  ],
  footerLeft: FOOT, page: p(30),
}).addNotes(
  "Last fifteen minutes, everyone, whether or not their app worked. Insist on the mutation exercise: two tests fail, the peak-location test stays green, and the chart still looks perfectly reasonable."
);

/* 31 */ bodySlide({
  eyebrow: "Section 06",
  title: "The files a person writes at work",
  bullets: [
    ["Open the four you approved.", "aidlc/intent.md, requirements.md, design.md and tasks.md — read them as one set, in order."],
    ["In a real team a person writes these.", "A product owner or tech lead drafts the intent and spec. The agent drafting them is a start, not a replacement."],
    ["Which is why you approved each one.", "Everything built today came out of those four files. A wrong line there becomes a wrong app, quickly and cheaply."],
    "labs/PROMPTS.md explains why each prompt is worded the way it is. Read it before Session 2 — you will be writing your own.",
  ],
  footerLeft: FOOT, page: p(31),
}).addNotes(
  "The closing idea of the session, and the bridge to Session 2. Say plainly that the documents, not the code, were the work today — the code was the cheap part, and it will only get cheaper. Anyone whose app did not run still has four documents they can show, and that is a real deliverable."
);

/* 32 */ takeawaysSlide({
  eyebrow: "Session 01",
  lines: [
    "An agent is a harness driving a model. Knowing which half broke is half the fix.",
    "A requirement you cannot check by running something is not a requirement yet.",
    "Looking right and being right differ, and only one of them survives a test.",
  ],
  footerLeft: FOOT, page: p(32),
}).addNotes(
  "Leave this up for a moment; this is the slide they photograph. Then homework, then the closing slide for questions."
);

/* 33 */ closingSlide({
  question: "What did your agent get wrong?",
  reading: "Finish and deploy Lab 1 if it is not live yet",
  deadline: "Read the AI-DLC notes before Session 2",
  office: "next session · teams of four · bring a project idea",
  contact: "Your Name · you@university.ac.th",
  page: p(33),
}).addNotes(
  "Leave up during questions. Stress the log: three things the agent got wrong. Anyone who writes 'it all worked fine' did not look hard enough, and it is thirty per cent of the individual mark."
);

const file = "Session 1 - Meet Your Agent.pptx";
await pres.writeFile({ fileName: file });
console.log(`Wrote ${file} — ${pres.slides.length} slides`);
console.log("Fonts: Libre Franklin (sans), IBM Plex Mono (mono). No substitutions made by the generator.");
