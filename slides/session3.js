/**
 * Session 3 — "Put a model inside it"
 *
 * Content only. Every layout comes from deck.js, which transcribes the recipes
 * in SLIDE-STYLE.md. If a slide will not fit one of those recipes, split the
 * content — do not add a layout.
 *
 * Build:  node session3.js
 */

import {
  pres, titleSlide, agendaSlide, dividerSlide, bodySlide,
  twoColumnSlide, figureSlide, codeSlide, takeawaysSlide, closingSlide,
} from "./deck.js";

const FOOT = "AI for Software Development · Session 3";
const p = n => String(n).padStart(2, "0");

/* 01 */ titleSlide({
  course: "AI for Software Development · 3rd Year EE",
  title: "Put a model inside it",
  subtitle: "Session 3 — building software on a language model, then showing what you made",
  presenter: "Your Name · Department of Electrical Engineering",
  date: "Session 3 of 3",
}).addNotes(
  "Cover. Today they add the kind of feature that was not economic to build two years ago, and then they present. Say the timing plainly: demos start at two o'clock whatever state anything is in, so whatever works at 1:55 is what they show."
);

/* 02 */ agendaSlide({
  eyebrow: "Session 03",
  items: [
    "Software with a model inside",
    "How to ask for what you want",
    "Examples, and when they pay",
    "Making a prompt better on purpose",
    "Lab 3 — the Intake Desk",
    "Transfer, then demos",
  ],
  footerLeft: FOOT, page: p(2),
}).addNotes(
  "Items 5 and 6 are the bulk of the afternoon. The first four exist to make the lab mean something rather than be typing practice. Keep the lecture to twenty-five minutes; the clock is the enemy today."
);

/* 03 */ dividerSlide({
  n: 1,
  name: "Software with a model inside",
  framing: "What it is actually good for, and what must stay in your code.",
}).addNotes(
  "Set expectations against what they have seen online: this is not about chatbots. The category that matters commercially is turning human mess into machine structure, and that is what they will build."
);

/* 04 */ figureSlide({
  eyebrow: "Section 01",
  title: "The shape of it",
  image: "figures/fig-llm-software.png",
  paras: [
    "Messy human input goes in. The model reads it and fills a shape you defined. From there it is ordinary software: your code totals it, stores it, decides what to do.",
    "The model is an adapter between language and data. It is not the application, and it never touches the money.",
  ],
  figSource: "Fig. 9 — an adapter, not an oracle",
  footerLeft: FOOT, page: p(4),
}).addNotes(
  "The single most useful mental model of the day. Ask the room what the model is NOT doing in this picture: no arithmetic, no storage, no decisions. Everything that must be right every time lives to the right of it."
);

/* 05 */ twoColumnSlide({
  eyebrow: "Section 01",
  title: "Which half does what",
  left: {
    label: "Give the model",
    lead: "Reading language nobody standardised: chat messages, emails, receipts, notes. Deciding which of your categories something belongs to. Explaining something in plain words.",
    secondary: "Things where being roughly right most of the time is genuinely useful, and where a person can check.",
  },
  right: {
    label: "Keep in your code",
    lead: "Arithmetic. Money. Anything that must be identical every time it runs. Anything a regulator, an accountant or an exam board would ask you to prove.",
    secondary: "The Intake Desk extracts with a model and totals with Python. That line is not fussiness — it is the design.",
  },
  footerLeft: FOOT, page: p(5),
}).addNotes(
  "Make them place their own project's AI feature on this split before they touch the lab. If a team cannot say which half their feature belongs to, that is the conversation to have now rather than at four o'clock."
);

/* 06 */ bodySlide({
  eyebrow: "Section 01",
  title: "Why this is new",
  bullets: [
    ["Before, this needed a parser.", "Somebody wrote rules for every phrasing, and a phrasing nobody predicted broke it. Most such software was never written, because it was not worth writing."],
    ["Now it is a function call.", "Whole categories of small business software became economic in about two years."],
    ["The hard part moved.", "It is no longer “can we read this?” but “how do we know it read it right?”"],
    "That question is what the rest of today is about.",
  ],
  footerLeft: FOOT, page: p(6),
}).addNotes(
  "This is the business insight and it is worth landing slowly. The value is not the chat box everyone has seen; it is that the parser problem stopped being expensive, so software nobody could justify writing is now a weekend."
);

/* 07 */ dividerSlide({
  n: 2,
  name: "How to ask for what you want",
  framing: "The prompt that runs the café desk, taken apart.",
}).addNotes(
  "We are about to read the actual prompt out of the code they are going to run in an hour. Not a toy, not a paraphrase — the thing itself."
);

/* 08 */ codeSlide({
  eyebrow: "Section 02",
  title: "The prompt behind the desk",
  code: [
    "You are the order desk of a small café.",
    "Turn each chat message into one order.",
    "",
    "- name must be copied EXACTLY from this",
    "  menu: {menu}. Never invent an item name.",
    "- qty is a whole number. Use 1 when the",
    "  customer names an item without a number.",
    "- pickup is 24-hour HH:MM. 3pm is 15:00,",
    "  noon is 12:00, 'after 4' is 16:00.",
    "- needs_review is true when you had to",
    "  guess. note says what you were unsure of.",
  ].join("\n"),
  paras: [
    "This is not a paraphrase. It is the prompt in core/intake.py, and it is the whole reason ten messy messages become ten clean rows.",
    "Read it as code, because it is code — the most load-bearing lines in that file are English.",
  ],
  prompt: "Every rule in it was added because something went wrong without it.",
  footerLeft: FOOT, page: p(8),
}).addNotes(
  "Open the real file alongside this if the clock allows. The point to land: prompts are source. They get reviewed, they get versioned, and a careless edit breaks production exactly like a careless edit anywhere else."
);

/* 09 */ figureSlide({
  eyebrow: "Section 02",
  title: "The five parts",
  image: "figures/fig-prompt-anatomy.png",
  paras: [
    "Role, vocabulary, format, defaults, escalation. Every prompt that survives contact with real input has these five, and most bad prompts are missing three of them.",
    "The most-skipped is the last: telling the model it is allowed to say it does not know.",
  ],
  figSource: "Fig. 10 — the same prompt, labelled",
  footerLeft: FOOT, page: p(9),
}).addNotes(
  "Walk the five in order. Then ask which ones they would have thought to write unprompted — escalation is the one nobody writes, and it is the one that turns a guessing machine into a system you can operate."
);

/* 10 */ bodySlide({
  eyebrow: "Section 02",
  title: "The rules that make rules work",
  bullets: [
    ["Resolve ambiguity by example, not adjective.", "“3pm is 15:00, noon is 12:00” beats “use a sensible time format” every time."],
    ["Constrain the vocabulary.", "Hand it your list and forbid invention, or your till grows two products called iced choc and Iced Chocolate."],
    ["Give permission to fail.", "A model with no way to say “not sure” will guess, confidently, and you will not be able to tell."],
    ["One instruction, one line.", "Long paragraphs get skimmed by models much as they do by people."],
  ],
  footerLeft: FOOT, page: p(10),
}).addNotes(
  "Every one of these came from a real failure while this lab was being built. The vocabulary rule is the expensive one: a menu missing the hot latte turned an order for twenty hot lattes into twenty iced ones."
);

/* 11 */ dividerSlide({
  n: 3,
  name: "Examples, and when they pay",
  framing: "Showing beats telling — at a price you should know before you pay it.",
}).addNotes(
  "Few-shot prompting: simultaneously the most useful trick in the box and the most over-used. Both halves get said here."
);

/* 12 */ codeSlide({
  eyebrow: "Section 03",
  title: "Few-shot: show, do not describe",
  code: [
    "Examples of correct output:",
    "",
    "message: \"iced choc x2, 15:45, Fai\"",
    "order:   customer: Fai",
    "         items: [Iced Chocolate x2]",
    "         pickup: \"15:45\"",
    "",
    "message: \"one green tea latte, after 4\"",
    "order:   customer: null, needs_review: true",
    "         note: \"no name given\"",
  ].join("\n"),
  paras: [
    "Two or three worked examples teach a format faster than any amount of description, and they are the only reliable way to pin down an edge case you keep losing.",
    "Notice the second one: an example of getting it right by refusing. Examples teach behaviour, not just shape.",
  ],
  prompt: "Show the model the case you keep failing, done correctly.",
  footerLeft: FOOT, page: p(12),
}).addNotes(
  "The second example is the important one and it is the one nobody writes. Most people show the model three successes and then wonder why it never admits defeat."
);

/* 13 */ bodySlide({
  eyebrow: "Section 03",
  title: "What examples cost",
  bullets: [
    ["They are tokens, every single call.", "Three examples in a prompt you send ten thousand times is three thousand examples paid for."],
    ["They bias hard.", "Show three coffee orders and it will read a cake order as coffee. Vary them or pay for it."],
    ["Our café prompt has none.", "It scores ten out of ten on the inbox without a single example — so adding some would be cost with no gain."],
    "Reach for examples when a rule keeps failing, not by default.",
  ],
  footerLeft: FOOT, page: p(13),
}).addNotes(
  "The honest position, and the one that separates people who have shipped from people who have read a blog post. Few-shot is a fix for a measured problem, not a default ingredient you sprinkle on everything."
);

/* 14 */ figureSlide({
  eyebrow: "Section 03",
  title: "Making it better on purpose",
  image: "figures/fig-prompt-loop.png",
  paras: [
    "Write messages whose answers you already know. Score the prompt against them. Change exactly one line, and score it again — kept if it helped, reverted if it did not.",
    "Never judge a prompt by one run. The same prompt on the same message answers differently on different days, which is why you measure many and never one.",
  ],
  figSource: "Fig. 11 — the loop that actually improves prompts",
  footerLeft: FOOT, page: p(14),
}).addNotes(
  "This is how the prompts in PROMPTS.md were written, including the ones they will paste today. Hammer the one-change-at-a-time rule: change three lines and a better score tells you nothing about which one earned it."
);

/* 15 */ dividerSlide({
  n: 4,
  name: "Lab 3 — the Intake Desk",
  framing: "Sixty-five minutes. A regex parser, a model, and a queue for a human.",
}).addNotes(
  "Fresh copy of the template, called lab3-practice — not their group project. A failed experiment here must not touch the app they demo in two hours. Full brief is in labs/LAB3.md."
);

/* 16 */ bodySlide({
  eyebrow: "Section 04",
  title: "Four checkpoints",
  bullets: [
    ["Run the rules parser.", "Ten real messages, four of them read correctly. Look at the six it misses and ask how many more rules you would need."],
    ["Ask in plain text.", "The answer will be correct and useless — a sentence, when your till needs fields."],
    ["Ask for a shape.", "One argument later, ten messy messages become ten rows. No regular expressions."],
    ["Score it, then plan for being wrong.", "Grade yourself against the answer key, and send what the model was unsure about to a human."],
  ],
  footerLeft: FOOT, page: p(16),
}).addNotes(
  "Checkpoint 1 is the one to protect when time gets tight. They must feel the old way fail before the new way means anything — skip it and the rest is just typing someone else's code."
);

/* 17 */ codeSlide({
  eyebrow: "Section 04",
  title: "Your job: attack the prompt",
  code: [
    "1. Write 5 messages the inbox does not",
    "   have. Make them hard.",
    "",
    "2. Write the correct answer for each.",
    "",
    "3. Score the current prompt on them.",
    "",
    "4. Change ONE line. Score again.",
    "",
    "5. Keep it or revert it. Repeat.",
  ].join("\n"),
  paras: [
    "The prompt in core/intake.py already scores ten out of ten on the ten messages you were given, so there is nothing to improve there. Bring it messages it has never seen.",
    "Order in Thai. Order something the menu nearly has. Change your mind mid-sentence. Then make the prompt handle it — and prove that you did.",
  ],
  prompt: "A prompt you cannot score is a prompt you cannot improve.",
  footerLeft: FOOT, page: p(17),
}).addNotes(
  "This is the real assignment of the lecture, and it is what separates a good log entry from a weak one. Winning looks like a measured before-and-after, not a prompt that sounds more impressive."
);

/* 18 */ dividerSlide({
  n: 5,
  name: "Then put it in your project",
  framing: "Twenty minutes. Every brief has an AI feature waiting, and it is this lab wearing different clothes.",
}).addNotes(
  "Optional but strongly encouraged. Say the stop rule out loud before they start: when the clock runs out they stop and demo what works, and nobody is penalised for it."
);

/* 19 */ twoColumnSlide({
  eyebrow: "Section 05",
  title: "Your brief already has the slot",
  left: {
    label: "The messy input",
    lead: "Carpool: “anyone driving Friday morning?” Sessions: “physics cramming thurs after lab, 5ish”. Bills: a pasted delivery receipt.",
    secondary: "Free text a person would understand instantly and your code cannot touch.",
  },
  right: {
    label: "The shape you want",
    lead: "Carpool: a date and a time window. Sessions: subject, date, start, end, place. Bills: items, amounts, who shares.",
    secondary: "core/llm.py has been an empty slot in your project since Session 1, for exactly this.",
  },
  footerLeft: FOOT, page: p(19),
}).addNotes(
  "Copy llm.py across, write their own schema, wire it to one page. Repeat the rule: a working project without the feature beats a broken one with it, and it always will."
);

/* 20 */ dividerSlide({
  n: 6,
  name: "Demos",
  framing: "Two rounds. Half of you present, half of you walk around and score. Then swap.",
}).addNotes(
  "Science fair, not lectures — this is why fifteen groups fit in forty-five minutes. The peer form asks what each team ADDED, which is where the twist and the stretch goals earn their marks."
);

/* 21 */ takeawaysSlide({
  eyebrow: "Session 03",
  lines: [
    "A model is an adapter between language and data, not the application.",
    "A prompt is source code: role, vocabulary, format, defaults, escalation.",
    "A prompt you cannot score is a prompt you cannot improve.",
  ],
  footerLeft: FOOT, page: p(21),
}).addNotes(
  "The photograph slide. Pause on it, and let the room actually take the picture before moving to the closing."
);

/* 22 */ closingSlide({
  question: "What will you build next?",
  reading: "Your app is live, and the repository is yours to keep",
  deadline: "AI collaboration log due — three things it got wrong, and how you caught them",
  office: "everything today runs on free tiers you already have",
  contact: "Your Name · you@university.ac.th",
  page: p(22),
}).addNotes(
  "Leave it up through the demos and questions. The last line is the one to say out loud: none of this needed a budget, an approval, or a licence — which means nothing is stopping them building the next one on Monday."
);

const file = "Session 3 - Put a Model Inside It.pptx";
await pres.writeFile({ fileName: file });
console.log(`Wrote ${file} — ${pres.slides.length} slides`);
console.log("Fonts: Libre Franklin (sans), IBM Plex Mono (mono). No substitutions made by the generator.");
