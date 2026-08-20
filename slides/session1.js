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
  twoColumnSlide, codeSlide, takeawaysSlide, closingSlide,
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

/* 04 */ twoColumnSlide({
  eyebrow: "Section 01",
  title: "Harness and model",
  left: {
    label: "Harness — Cline",
    lead: "The program running inside your editor. It reads your files, decides what to send, applies the edits, and runs the commands.",
    secondary: "It has no intelligence of its own. It is plumbing, and plumbing is where a surprising number of failures live.",
  },
  right: {
    label: "Model — Gemini, Mistral",
    lead: "A service somewhere else that receives text and predicts what text should come next. It never sees your disk.",
    secondary: "You can swap it for another in three clicks. You will do exactly that when a free allowance runs out.",
  },
  footerLeft: FOOT, page: p(4),
}).addNotes(
  "The single most useful distinction in the course. When something goes wrong they must ask which half broke: rate limited is a model problem, Diff Edit Failed is a harness problem."
);

/* 05 */ bodySlide({
  eyebrow: "Section 01",
  title: "The loop the agent runs",
  bullets: [
    ["Read.", "The harness opens the files it thinks are relevant and puts their contents into the message."],
    ["Plan and edit.", "The model replies with a change to make, and the harness writes it to disk."],
    ["Run and observe.", "The harness runs your tests, reads the output, and sends the result back."],
    "Then it goes round again. One sentence from you becomes four to ten trips through this loop.",
  ],
  footerLeft: FOOT, page: p(5),
}).addNotes(
  "Walk the loop out loud with a concrete example: add a plot of the frequency response. Read the file, propose the edit, apply, run, read the error, go round again. The last line sets up the quota slide."
);

/* 06 */ dividerSlide({
  n: 2,
  name: "What it costs, and why it fails",
  framing: "Three limits you will meet before lunch, and the reason none of them are bugs.",
}).addNotes(
  "This section is the one that changes their behaviour. Everything here is a constraint they hit today, not theory."
);

/* 07 */ bodySlide({
  eyebrow: "Section 02",
  title: "Context and its limits",
  bullets: [
    ["The model has no memory.", "Between one request and the next it retains nothing at all."],
    ["So everything is re-sent.", "Every request carries the whole conversation and every file read so far."],
    ["The context window is the ceiling", "on how much can be re-sent at once. Past it, the earliest parts fall away."],
    "A long conversation therefore makes an agent worse, not better. Start a new task for each feature.",
  ],
  footerLeft: FOOT, page: p(7),
}).addNotes(
  "The counter-intuitive point is the last one. Students assume a long conversation means the agent understands more; it means the opposite. The practical instruction is: start a new task per feature."
);

/* 08 */ codeSlide({
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
  footerLeft: FOOT, page: p(8),
}).addNotes(
  "Do this arithmetic on the board with them rather than reading it. The number that lands is roughly one lab session per day on one account. Then the bridge into the gates."
);

/* 09 */ bodySlide({
  eyebrow: "Section 02",
  title: "Why an agent invents things",
  bullets: [
    ["It predicts, it does not look up.", "The reply is the text most likely to follow your request, not a fact retrieved from anywhere."],
    ["A plausible function looks real.", "A library call that ought to exist looks exactly like one that does."],
    ["It cannot warn you.", "Not knowing and knowing feel identical from the inside, so both come out equally confident."],
    "Which leaves one rule: you check by running something, never by reading something that sounds right.",
  ],
  footerLeft: FOOT, page: p(9),
}).addNotes(
  "The key sentence is the third. A model cannot report not-knowing, because from the inside it looks the same as knowing. Hence the rule for the whole course: verify by running."
);

/* 10 */ dividerSlide({
  n: 3,
  name: "Warm-up — build it by asking",
  framing: "No plan, no specification. Ask for the whole thing and see what arrives. 25 minutes.",
}).addNotes(
  "Say plainly: this round is meant to go badly, and going badly is the useful part. Do not rescue anyone during it."
);

/* 11 */ codeSlide({
  eyebrow: "Workshop 03",
  title: "Paste this, then watch",
  code: [
    "Build me a spectrum analyser",
    "in Streamlit that adds two",
    "sine waves together and plots",
    "the frequency spectrum.",
  ].join("\n"),
  paras: [
    "Accept whatever it gives you. Do not plan, do not correct it, do not write anything down first.",
    "Set tone A to amplitude 1.0. Does the spike on the chart actually reach 1.0?",
  ],
  prompt: "If a classmate asked whether your app is correct, could you show them why?",
  footerLeft: FOOT, page: p(11),
}).addNotes(
  "Read the two questions aloud before they start; they are the point of the exercise, not the app. Circulate but do not help. Stop everyone at 25 minutes, especially anyone mid-flow."
);

/* 12 */ dividerSlide({
  n: 4,
  name: "The Four Gates",
  framing: "The same request, routed through four points where a person decides.",
}).addNotes(
  "Resume after the warm-up. Take three answers out loud before advancing, especially from anyone whose app looked finished. Most will not have checked the amplitude."
);

/* 13 */ twoColumnSlide({
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
  footerLeft: FOOT, page: p(13),
}).addNotes(
  "Keep this fair to the left column. Asking directly is genuinely faster and correct often enough to feel fine, which is exactly why it is dangerous. The difference is not speed, it is whether you can tell."
);

/* 14 */ bodySlide({
  eyebrow: "Section 04",
  title: "Four gates, four decisions",
  bullets: [
    ["Intent.", "You write one paragraph: who it is for, what problem it solves, what finished looks like."],
    ["Spec.", "The agent drafts requirements. Each needs a criterion you can check by running something."],
    ["Plan.", "The agent proposes files and a task list. One task owns one file, and no file has two owners."],
    ["Build.", "One task at a time. Tests run, you read the diff, and only then does the next task start."],
  ],
  footerLeft: FOOT, page: p(14),
}).addNotes(
  "Stress that Gate 1 is the only one they write themselves; the agent drafts 2 and 3 and they approve. Approving without reading is the failure mode to warn about now."
);

/* 15 */ codeSlide({
  eyebrow: "Section 04",
  title: "The gates live in a file",
  code: [
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
    "Your agent reads this file before every single request, and obeys it.",
    "Ask it to skip ahead today and it will refuse. That refusal is the file working.",
  ],
  prompt: "Open it now. It is plain English, and by Session 2 you will be editing it.",
  footerLeft: FOOT, page: p(15),
}).addNotes(
  "Open the real .clinerules in the editor here, not just the slide. The point that surprises them: the rules are plain English in a plain file, and they can edit them. Sixty of you and one of me, so the tool holds the line."
);

/* 16 */ twoColumnSlide({
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
  footerLeft: FOOT, page: p(16),
}).addNotes(
  "This is where the software engineering content enters, and it should feel like a reveal. They have not been given four arbitrary hoops; they have walked the standard lifecycle, which predates all of this by fifty years."
);

/* 17 */ bodySlide({
  eyebrow: "Section 04",
  title: "The words used in industry",
  bullets: [
    ["Intent.", "The business goal, before anyone has decided how to build it. Your Gate 1."],
    ["Units.", "The independent pieces an intent breaks into. Next week each of you owns one."],
    ["Bolts.", "Build cycles measured in hours rather than the two to six weeks of a sprint."],
    "From AI-DLC, published by AWS in 2025. Its one rule: the AI proposes, and a human approves.",
  ],
  footerLeft: FOOT, page: p(17),
}).addNotes(
  "Credit AWS explicitly; the paper is in the homework. Do not oversell it: AI-DLC targets large systems with many teams, and what they run today is a shrunk version. Say that plainly."
);

/* 18 */ dividerSlide({
  n: 5,
  name: "Lab 1 — the same app, done properly",
  framing: "Delete the warm-up and build it again through the gates. Instructions in labs/LAB1.md. 70 minutes.",
}).addNotes(
  "Say the timebox rule out loud before they start: fifteen minutes stuck on one task, then restore the reference and move on. Nobody loses marks for that."
);

/* 19 */ codeSlide({
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
  footerLeft: FOOT, page: p(19),
}).addNotes(
  "Show the real test file on screen. Ask them to predict which of the seven tests would still pass if the scaling were wrong. Answer: all but two."
);

/* 20 */ bodySlide({
  eyebrow: "Section 06",
  title: "Read the reference before you leave",
  bullets: [
    ["Everyone does this,", "whether your own version works or not. The prompts are in labs/EXPLAIN.md."],
    ["Ask it to break the code.", "Change the 2/n to 1/n, run the tests, watch which two fail, then change it back."],
    ["Nothing here edits your work,", "so none of it can break your project. Explaining is the safest thing an agent does."],
    "Reading code you did not write, with an AI explaining it, is the most common way these tools are used at work.",
  ],
  footerLeft: FOOT, page: p(20),
}).addNotes(
  "Last fifteen minutes, everyone, whether or not their app worked. Insist on the mutation exercise: two tests fail, the peak-location test stays green, and the chart still looks perfectly reasonable."
);

/* 21 */ takeawaysSlide({
  eyebrow: "Session 01",
  lines: [
    "An agent is a harness driving a model. Knowing which half broke is half the fix.",
    "A requirement you cannot check by running something is not a requirement yet.",
    "Looking right and being right differ, and only one of them survives a test.",
  ],
  footerLeft: FOOT, page: p(21),
}).addNotes(
  "Leave this up for a moment; this is the slide they photograph. Then homework, then the closing slide for questions."
);

/* 22 */ closingSlide({
  question: "What did your agent get wrong?",
  reading: "Finish and deploy Lab 1 if it is not live yet",
  deadline: "Read the AI-DLC notes before Session 2",
  office: "next session · teams of four · bring a project idea",
  contact: "Your Name · you@university.ac.th",
  page: p(22),
}).addNotes(
  "Leave up during questions. Stress the log: three things the agent got wrong. Anyone who writes 'it all worked fine' did not look hard enough, and it is thirty per cent of the individual mark."
);

const file = "Session 1 - Meet Your Agent.pptx";
await pres.writeFile({ fileName: file });
console.log(`Wrote ${file} — ${pres.slides.length} slides`);
console.log("Fonts: Libre Franklin (sans), IBM Plex Mono (mono). No substitutions made by the generator.");
