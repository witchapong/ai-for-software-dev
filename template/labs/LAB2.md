# Lab 2 — Design and build a product as a team

Your team is three or four people. **What you build today is your group
project.** You will keep working on it during the week and demo it in
Session 3. There is no separate project brief coming later — this is it.

## What good looks like (3 minutes, before you start)

Read the gate documents from Lab 1 — the app you built last week:

```
git show origin/solution/lab1:aidlc/requirements.md
git show origin/solution/lab1:aidlc/tasks.md
```

Notice two things. Every acceptance criterion names a number or an exact
behaviour; none of them say "works correctly". And every task in `tasks.md`
owns exactly one file.

Yours will describe something completely different. It should have the same
shape.

**There is no reference version of your project to fall back on.** Lab 1 had
one because everyone built the same app. Yours is unique, so what transfers is
the shape, not the content.

## Part 0 — Set up the team repository (10 minutes)

1. Pick a brief from `briefs/`. Read its **hard part** section before choosing —
   that is the bit that will take the longest.
2. **One person** clicks "Use this template" to create the team repository,
   then adds the others: Settings > Collaborators > Add people.
3. **Everyone else** opens their own Codespace on that shared repository.

Everyone codes at the same time, on their own machine, with their own agent and
their own free allowance. Four accounts means four times the quota.

## Part 1 — Think together (25 minutes)

**All of you at one screen. One person drives, and it is not the fastest typist.**

Work through Gates 1, 2 and 3 as a group, using the prompts in `PROMPTS.md`
adapted to your project. Argue about the requirements now. It is a hundred
times cheaper than arguing about them after the code exists.

**Your intent must include one twist** — a feature or variation of your own
invention that is not in the brief. Small is fine. If another team picks the
same brief, your twist and your hard-part rule are what make your project
yours.

When you fill in `aidlc/tasks.md`, obey the one rule:

> **Every task names exactly ONE owner and touches exactly ONE file that no
> other task touches.**

If two tasks want the same file, they are one task, or the file needs
splitting. Do not skip past this — it is the difference between four people
working and four people waiting.

**Before you leave this part**, every person should be able to say out loud:
"I own `pages/N_Something.py`, and when I am done it will do X."

Five people? Then one of you owns `core/rules.py` instead of a page — agree its
exact function signature now, write it into `design.md`, and the page owners
code against it before it exists. That is the same trick `tests/test_spectrum.py`
played on you in Lab 1: the contract comes first.

## Part 2 — Build in parallel (50 minutes)

**Back to your own machines. Everyone builds at the same time.**

```
git checkout -b your-name-feature-name
```

Work through Gate 4 on **your** task only, in **your** file only. When your
tests pass:

```
git add -A
git commit -m "what you did"
git push -u origin your-name-feature-name
```

Then open a pull request — a request to merge your work into the team's main
copy. The **GitHub Pull Requests** icon in the sidebar does this with clicks:
publish your branch, create the pull request, done. No terminal needed. You can
also ask Cline to run the git commands for you — that is a legitimate use of
your agent.

**If your team is drowning in git**, here is the sanctioned fallback: everyone
works directly on `main`, runs `git pull` before starting and pushes when tests
pass. The one-file-per-owner rule means you will almost never conflict even
there. Review still happens — read your partner's commits on GitHub instead of
a pull request. You lose the ceremony, not the lesson.

**The agent will be slow.** Roughly twenty seconds between steps, because the
free allowance is 25,000 tokens a minute and each step spends about eight
thousand. That is the limit working, not a fault. Use the waiting to read the
diff it just produced.

**If you are stuck for fifteen minutes**, stop prompting and ask a teammate.
A second pair of eyes beats a sixth reprompt, and your quota is finite.

## Part 3 — Review each other (25 minutes)

Pair up. Open your partner's pull request and read every changed line. You are
looking for:

- Something that does not do what the requirement says
- A test that would still pass if the code were broken
- A function invented out of thin air that does not exist
- Code silently deleted to make an error go away
- **An agent that reported success without running the tests** — this happened
  in our own trials, and the summary sounded completely confident

Leave at least two comments. Approve and merge only when you are satisfied.

Reviewing code you did not write **is the job now**. Take it seriously.

## Part 4 — Ship and plan (15 minutes)

Deploy at https://share.streamlit.io — sign in with GitHub, pick the team
repository, set the main file to `app.py`, click Deploy.

Then agree, in writing in `aidlc/tasks.md`, who does what before Session 3.
Anything not written down did not get agreed.

## Working during the week

The project continues between sessions, mostly not in the same room. The
protocol that keeps four people from trampling each other:

- **`aidlc/tasks.md` is the coordination board.** Before touching anything,
  check it. When you claim or finish a task, edit it and push.
- **Pull before you start. Push when your tests pass.** Every time.
- **Never leave `main` broken overnight.** If your tests fail, do not push to
  main — push your branch instead and say so in the group chat.
- **Stuck for fifteen minutes? Post the error in the group chat.** A teammate
  who solved it yesterday beats an agent guessing today.
- The agent is not shared: everyone has their own allowance in their own
  Codespace. Your teammate's quota does not pay for your session.

## You are done when

- [ ] All four gate documents are filled in and approved
- [ ] Every member has at least one merged pull request
- [ ] Every pull request was reviewed by someone who did not write it
- [ ] `pytest` passes on main
- [ ] The app is live at a public URL
- [ ] The next week's tasks are written down with owners

## If your team is not four people

See "Scaling to your team size" in `briefs/README.md`. The short version: two
people build the core loop only; three cut a page; five extract the hard-part
rule into `core/rules.py` owned by the fifth person, who writes its tests while
the page owners build against the agreed signature.

Whatever you do, never have two people share one file — that is the one thing
this whole structure exists to prevent.
