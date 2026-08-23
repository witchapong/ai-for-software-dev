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

When you fill in `aidlc/tasks.md`, obey the one rule:

> **Every task names exactly ONE owner and touches exactly ONE file that no
> other task touches.**

If two tasks want the same file, they are one task, or the file needs
splitting. Do not skip past this — it is the difference between four people
working and four people waiting.

**Before you leave this part**, every person should be able to say out loud:
"I own `pages/N_Something.py`, and when I am done it will do X."

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

Then open a pull request on GitHub — a request to merge your work into the
team's main copy.

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

## You are done when

- [ ] All four gate documents are filled in and approved
- [ ] Every member has at least one merged pull request
- [ ] Every pull request was reviewed by someone who did not write it
- [ ] `pytest` passes on main
- [ ] The app is live at a public URL
- [ ] The next week's tasks are written down with owners

## If your team is three people

Cut a page. Do not have two people share one file — that is the one thing this
whole structure exists to prevent.
