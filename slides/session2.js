/**
 * Session 2 — "Build as a team"
 *
 * Content only. Every layout comes from deck.js, which transcribes the recipes
 * in SLIDE-STYLE.md. If a slide will not fit one of those recipes, split the
 * content — do not add a layout.
 *
 * Build:  node session2.js
 */

import {
  pres, titleSlide, agendaSlide, dividerSlide, bodySlide,
  twoColumnSlide, figureSlide, codeSlide, takeawaysSlide, closingSlide,
} from "./deck.js";

const FOOT = "AI for Software Development · Session 2";
const p = n => String(n).padStart(2, "0");

/* 01 */ titleSlide({
  course: "AI for Software Development · 3rd Year EE",
  title: "Build as a team",
  subtitle: "Session 2 — designing a product and building it in parallel, four agents at once",
  presenter: "Your Name · Department of Electrical Engineering",
  date: "Session 2 of 3",
}).addNotes(
  "Cover. Hold it while the teams settle into their fours. The promise, said once and plainly: you leave today with a running product, a team that built it in parallel rather than in a queue, and the week's work written down in a file everyone can see."
);

/* 02 */ agendaSlide({
  eyebrow: "Session 02",
  items: [
    "From one agent to four",
    "Requirements and data",
    "Ownership and branches",
    "Think together — Gates 1 to 3",
    "Build in parallel",
    "Review, ship, plan the week",
  ],
  footerLeft: FOOT, page: p(2),
}).addNotes(
  "Items 04 and 05 are the bulk of today — twenty-five minutes arguing on one screen, then fifty minutes building on four. Everything before them exists to make the parallel part possible. Say that out loud so nobody treats the first half hour as warm-up."
);

/* 03 */ bodySlide({
  eyebrow: "Session 02",
  title: "From one agent to four",
  bullets: [
    ["Last week you drove one agent", "through five gates, alone. The gates do not change today — the headcount does."],
    ["Four people, four agents, four allowances,", "one repository. Each of you brings your own Codespace and your own quota."],
    ["The danger is not git.", "It is two people editing one file. Everything today is built to make that impossible."],
    "Software this size is a team sport, and the team structure is decided before the first prompt.",
  ],
  footerLeft: FOOT, page: p(3),
}).addNotes(
  "Open by asking who finished Lab 1 and who is still deploying; you need to know before the teams split. The reassurance to give: the gates are the same five they already ran, only four of them run at once. The warning to give: the fix for collisions is structural, decided in the next half hour, not a git skill they can acquire under pressure."
);

/* 04 */ dividerSlide({
  n: 2,
  name: "From idea to product plan",
  framing: "Requirements, data, and the argument you have before any code exists.",
}).addNotes(
  "Divider. The line worth saying here: the cheapest argument your team will ever have is the one at the gates, when changing your mind costs a sentence instead of a rewrite. Everything after this section is more expensive to change."
);

/* 05 */ twoColumnSlide({
  eyebrow: "Section 02",
  title: "Vague and checkable",
  left: {
    label: "Vague",
    lead: "“Booking works correctly.” “The app is easy to use.” You cannot run either sentence, so you cannot know when you are done.",
    secondary: "Vague requirements do not fail — they linger. The agent fills the gaps with guesses and you approve them without noticing.",
  },
  right: {
    label: "Checkable",
    lead: "“A ride with 3 seats refuses the 4th booking, and the message says it is full.” You can run that sentence.",
    secondary: "Every requirement your team writes today needs an input, an action, and a visible result. That is Gate 2's whole job.",
  },
  footerLeft: FOOT, page: p(5),
}).addNotes(
  "Take two or three answers on why the left column is vague before you advance the point yourself. The right one names an input, an action and a refusal you could trigger live in front of them. Send them back to this slide whenever a requirement they write today has no verb you can run."
);

/* 06 */ codeSlide({
  eyebrow: "Section 02",
  title: "What your app remembers",
  code: [
    "@dataclass",
    "class Booking:",
    "    id: str",
    "    ride_id: str",
    "    passenger_name: str",
    "",
    "# one row in data/bookings.csv:",
    "# id,ride_id,passenger_name",
    "# 3f2a9c01,ride_07,Ploy",
  ].join("\n"),
  paras: [
    "One dataclass per thing your app stores. The template's storage already turns it into CSV rows you can open and read — that part is written for you.",
    "Deciding the columns is a design argument, not typing. Have it at Gate 3, out loud, before any page exists.",
  ],
  prompt: "Your first team argument: what are the columns?",
  footerLeft: FOOT, page: p(6),
}).addNotes(
  "Open core/models.py on screen if the timing allows; seeing the real file lands better than the excerpt. The point they usually miss: choosing the columns IS the data model, and it is the one design decision no agent should make for them. Make each team say their columns aloud before they leave the mob session."
);

/* 07 */ figureSlide({
  eyebrow: "Section 02",
  title: "One file, one owner",
  image: "figures/fig-ownership-map.png",
  paras: [
    "Every task in your plan names one owner and one file no other task touches. Streamlit makes this natural: each file in pages/ is a tab in the app.",
    "Merge conflicts — two people editing the same lines — are how beginners drown in git. This rule does not manage that risk. It deletes it.",
  ],
  figSource: "Fig. 5 — the ownership map",
  footerLeft: FOOT, page: p(7),
}).addNotes(
  "The sentence to land: conflicts are prevented by structure, not by git skill. Point at the four tags and say that if two of them ever sit on the same box, the plan is wrong and no amount of careful merging will save it. This is the slide they should picture while writing tasks.md."
);

/* 08 */ figureSlide({
  eyebrow: "Section 02",
  title: "Branch, review, merge",
  image: "figures/fig-branch-merge.png",
  paras: [
    "A branch is your private copy of the project; your work cannot break anyone until it merges. A pull request asks the team to take it — and a teammate reads every line first.",
    "CI — continuous integration — runs pytest automatically on every push. A robot referee that never gets tired and never says “looks fine to me”.",
  ],
  figSource: "Fig. 6 — the road your code travels",
  footerLeft: FOOT, page: p(8),
}).addNotes(
  "Resist teaching commands here — the sidebar buttons in the editor do all of this, and a terminal demo will eat ten minutes. Teach the shape instead: private copy, request to merge, human read, robot check, then main. If anyone asks for the commands, point them at the lab sheet."
);

/* 09 */ dividerSlide({
  n: 3,
  name: "Think together",
  framing: "One screen, four brains, twenty-five minutes. Gates 1 to 3 as a group — then you split.",
}).addNotes(
  "Before they start, tell each team to pick one driver, and say explicitly that it should not be the fastest typist. The driver's job is to type what the team agrees, not to decide it. Set the timer visibly; twenty-five minutes is enough only if they stop debating the theme and start writing requirements."
);

/* 10 */ figureSlide({
  eyebrow: "Section 03",
  title: "The shape of today",
  image: "figures/fig-mob-parallel.png",
  paras: [
    "Argue together where arguing is cheap: intent, spec, plan, on one screen. Build alone where building is fast: your file, your agent, your branch.",
    "Then converge through review. Nothing reaches main unread, and the app deploys from main.",
  ],
  figSource: "Fig. 7 — mob the thinking, parallelise the building",
  footerLeft: FOOT, page: p(10),
}).addNotes(
  "This is the map of the whole day, so leave it up longer than it seems to need. Point at the left panel and say that is the next twenty-five minutes; point at the middle and say that is the fifty after it. Anyone who wanders off during the mob session has already lost the parallel part."
);

/* 11 */ figureSlide({
  eyebrow: "Section 03",
  title: "Pick your brief by its hard part",
  image: "figures/fig-brief-menu.png",
  paras: [
    "Five briefs in briefs/, each themed on student life, each with one genuinely hard rule. Read the hard part before you choose — it is where your tests and your marks live.",
    "Two teams on the same brief is fine. Your twist — one invented feature, named in your intent — is what makes the project yours.",
  ],
  figSource: "Fig. 8 — five briefs, five traps",
  footerLeft: FOOT, page: p(11),
}).addNotes(
  "Push them to choose by the hard part rather than the theme; the theme is a week of fun and the hard part is the mark. Say plainly that two teams on one brief makes demo day more interesting, not less, because the twists will diverge. Give them three minutes to pick and then move on."
);

/* 12 */ codeSlide({
  eyebrow: "Section 03",
  title: "The task list that keeps you parallel",
  code: [
    "# aidlc/tasks.md",
    "",
    "| # | Task            | Owner | The ONE file        |",
    "|---|-----------------|-------|---------------------|",
    "| 1 | Post a ride     | A     | pages/1_Post.py     |",
    "| 2 | Browse and book | B     | pages/2_Browse.py   |",
    "| 3 | My rides        | C     | pages/3_Mine.py     |",
    "| 4 | Booking rule    | D     | core/rules.py       |",
  ].join("\n"),
  paras: [
    "The table your mob session must produce. One owner per row, one file per row, and no file appears twice.",
    "Before you split up, every person says out loud: “I own this file, and when I am done it will do X.”",
  ],
  prompt: "If two tasks want the same file, they are one task — or the file needs splitting.",
  footerLeft: FOOT, page: p(12),
}).addNotes(
  "Walk the room while they draft this and read the fourth column only. A file appearing twice is the single failure that will cost them the afternoon, and it costs one minute to fix now. Do not let a team scatter until every person has said their sentence aloud."
);

/* 13 */ dividerSlide({
  n: 4,
  name: "Build in parallel",
  framing: "Fifty minutes. Your machine, your agent, your file, your branch.",
}).addNotes(
  "Restate the timebox rule before they scatter, because it is the one they forget: fifteen minutes stuck means ask a teammate, not a sixth reprompt at the same agent. Nobody loses marks for asking. Start the timer where everyone can see it."
);

/* 14 */ bodySlide({
  eyebrow: "Section 04",
  title: "While the agent works",
  bullets: [
    ["Expect about twenty seconds between steps.", "The free allowance is 25,000 tokens a minute and each step spends about eight thousand. That is the limit working, not a fault."],
    ["Use the waiting to read the diff.", "You are the reviewer of first resort, and the diff is small right now."],
    ["Commit every time your tests pass.", "A green commit is a save point; the next experiment is free."],
    ["Fifteen minutes stuck? Ask a teammate.", "A second pair of eyes beats a sixth reprompt, and your quota is yours alone."],
  ],
  footerLeft: FOOT, page: p(14),
}).addNotes(
  "The throttle point is the one to spell out: sixty students watching a twenty-second pause will read it as breakage and start clicking. Say the arithmetic once — twenty-five thousand tokens a minute, eight thousand a step — and they will stop panicking. The commit habit is worth nagging about, because the students who lose work today are the ones who never made a save point."
);

/* 15 */ dividerSlide({
  n: 5,
  name: "Review each other",
  framing: "Twenty-five minutes. The job is reading code you did not write.",
}).addNotes(
  "Pair people across ownership deliberately: you review the file you did NOT build. Reviewing your own work finds nothing, and the whole point of the last hour was that nobody else touched your file. Announce the pairings rather than letting teams sort it out."
);

/* 16 */ bodySlide({
  eyebrow: "Section 05",
  title: "What to look for",
  bullets: [
    ["A function that does not exist.", "Plausible-looking library calls the agent invented. They look exactly like real ones."],
    ["Code deleted to dodge an error.", "The failing part quietly removed, and the feature with it. The diff shows it; the summary will not."],
    ["Machinery nobody asked for.", "Classes, options and abstractions beyond the requirement. More code is more places to be wrong."],
    ["Success reported without running the tests.", "This happened in our own trials — the agent announced the tests passed and had never run them. Trust output, not summaries."],
  ],
  footerLeft: FOOT, page: p(16),
}).addNotes(
  "Tell the fourth bullet as the true story it is: it happened while building this course, and the summary sounded completely confident. That anecdote does more than the other three bullets combined. The rule underneath all four: read the diff and the test output, never the agent's account of them."
);

/* 17 */ codeSlide({
  eyebrow: "Section 05",
  title: "A test that tests nothing",
  code: [
    "def test_booking_works():",
    "    result = book_seat(ride, \"Ploy\")",
    "    assert result is not None",
    "",
    "# passes if book_seat returns an error string",
    "# passes if it returns the wrong ride",
    "# passes if it books a full ride",
  ].join("\n"),
  paras: [
    "This test passes for almost any implementation, including broken ones. It asserts that something came back, not that the right thing happened.",
    "Ask of every test your agent writes: what change to the code would make this fail? If the answer is “almost none”, it is decoration.",
  ],
  prompt: "Would this test fail if the code were broken? If not, it is not a test.",
  footerLeft: FOOT, page: p(17),
}).addNotes(
  "Ask the room what change to book_seat would make this test fail, and then wait through the silence rather than filling it. The silence is the lesson. Then give them the question to carry into their own repositories: what would have to break for this to go red?"
);

/* 18 */ dividerSlide({
  n: 6,
  name: "Ship, then plan the week",
  framing: "Deploy from main, then write down who does what before Session 3.",
}).addNotes(
  "The line that saves them a week: nothing agreed out loud exists. It goes in tasks.md with a name against it, or it did not happen. Hold the last ten minutes for this even if a team is mid-merge."
);

/* 19 */ bodySlide({
  eyebrow: "Section 06",
  title: "The week ahead",
  bullets: [
    ["tasks.md is the board.", "Claim work by writing your name; finish work by ticking it and pushing. Check it before touching anything."],
    ["Pull before you start, push when tests pass.", "Every session, every time. Never leave main broken overnight."],
    ["Your twist must exist before Session 3.", "One invented feature, built, not promised."],
    ["Session 3 adds an AI feature to this app,", "and ends with demos. What you ship this week is what you demo."],
  ],
  footerLeft: FOOT, page: p(19),
}).addNotes(
  "Lean on the demo pressure, because it is real and it is useful: whatever they ship this week is what stands in front of the room next week. The broken-main warning is worth repeating — one student pushing a red main on a Wednesday night blocks three others on Thursday. Ask each team to name the person who will check the board first."
);

/* 20 */ takeawaysSlide({
  eyebrow: "Session 02",
  lines: [
    "Arguments are cheapest at the gates, before any code exists.",
    "One file, one owner is why four agents can run at once.",
    "Reviewing code you did not write is the job now.",
  ],
  footerLeft: FOOT, page: p(20),
}).addNotes(
  "The photograph slide. Pause on it and stop talking for a few seconds so the phones come out. Then move to the closing slide and take questions against it."
);

/* 21 */ closingSlide({
  question: "What did your team decide?",
  reading: "Finish the week's tasks as written in tasks.md",
  deadline: "Log three things your agent got wrong, and how you caught them",
  office: "session 3 · your app gets an AI feature · demo day",
  contact: "Your Name · you@university.ac.th",
  page: p(21),
}).addNotes(
  "Leave this up for the whole question period. Repeat that the log is thirty per cent of the individual mark, and that it is individual — four identical logs from one team read as one log. Anyone who writes that nothing went wrong was not paying attention."
);

const file = "Session 2 - Build as a Team.pptx";
await pres.writeFile({ fileName: file });
console.log(`Wrote ${file} — ${pres.slides.length} slides`);
console.log("Fonts: Libre Franklin (sans), IBM Plex Mono (mono). No substitutions made by the generator.");
