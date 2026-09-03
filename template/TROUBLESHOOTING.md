# If something breaks

Work down this list. Each fix takes under two minutes. If you are still stuck
after ten minutes, ask a neighbour before asking the instructor — the person
next to you has probably hit the same thing.

## Setup

**`check_setup.py` says a package is missing**
Run `pip install -r requirements.txt` in the terminal, then run the check
again.

**`check_setup.py` says the API rejected the request**
Your key is wrong or was copied with an extra space. Create a fresh one at
https://aistudio.google.com/apikey, paste it into `.env`, save, try again.

**There is no `.env` file**
Run `cp .env.example .env` in the terminal, then paste your key in.

**`pytest` says some tests were "deselected"**
Deliberate, not broken. Later sessions' tests are hidden until you reach them,
so each lab shows you only its own failures. Session 3 switches its own on
with `pytest -m lab3`.

**My Codespace will not start, or is stuck**
Go to https://github.com/codespaces, find yours, click the three dots, choose
**Stop**, then open it again. **Try that twice before deleting anything.**

Deleting a Codespace is not free: `.env` is git-ignored so it is never pushed,
and Cline's settings live inside the Codespace too. A rebuild loses both keys
and your agent configuration, and you set those up again from scratch. Your
*code* is safe once pushed; your setup is not.

**`error: remote reference already exists`**
You already added it — at home, following the README. Skip that line and run
`git fetch reference` on its own.

**`error: Your local changes would be overwritten by checkout`**
You have edits you have not committed, and git will not throw them away
silently. Commit them first: `git add -A && git commit -m "wip"`, then run
your checkout again.

**My changes are not showing in the app**
Three things, in order. Is the browser tab pointing at the port the terminal
actually printed? A second `streamlit run` while the first is still going
lands on 8502, and your old tab is still watching 8501. Press `Ctrl+C`,
start it once, and open the URL it prints. If the port is right, hit **R** in
the app to rerun. If it is still wrong, you saved the file in a different
folder than the one you are running.

**Deploying to Streamlit Community Cloud failed, or is still building**
Builds take two to five minutes and everyone in the room is deploying at once,
so slow is normal. Check that you have **pushed** — the cloud builds from
GitHub, not from your Codespace — and that the main file is set to `app.py`.
If it has not finished by the end of the session, push your code and deploy at
home. The code and your four `aidlc/` documents are the deliverable; the URL
is a bonus.

## The agent

**Cline says `429` or "rate limit exceeded"**
You are asking too fast. Your quota is fine and switching providers wastes
your other key. **Wait about a minute** and let it retry.

**Cline says `503`, "high demand", or "unavailable"**
Different problem: that model is refusing everyone, and waiting will not help.
Open the model selector at the bottom of the Cline panel and **switch to your
other provider**. This is why you set up two keys.

**Cline has stopped responding and one command says "Running" forever**
You asked it to run the app. A web server never exits, so the agent is waiting
for a command that will never finish. Press `Ctrl+C` in the terminal, or run
`pkill -f "streamlit run"`, and it wakes up. Start servers yourself; agents are
for changing files.

**I clicked "Start New Task" and my code vanished**
When Cline writes a file it shows a diff with **Save** and **Reject** buttons.
Until you click Save, that work only exists in the preview — and starting a new
task throws it away silently. Your tests will go back to failing with no
explanation. Always click **Save** first. If you lost work this way, the agent
has to redo it; there is no undo.

**I pasted into the wrong pane and wrecked a file**
`git checkout -- path/to/the/file.py` puts that one file back to your last
commit. This works for anything: your mistakes, the agent's, a bad paste. It
is why you commit every time the tests pass.

**Cline refuses to write code and keeps asking for `requirements.md`**
In Round 2 of Lab 1, and in your group project, that is correct behaviour and
not a bug. Fill in `aidlc/intent.md`, let it draft `aidlc/requirements.md`,
read it, then reply "approved".

If it happens in **Round 1** of Lab 1, the gates are on when they should be
off. Run `mv .clinerules .clinerules.off` and start a new task.

**Cline writes code immediately and never asks me to approve anything**
The gates are off. You either skipped `cp .clinerules.gates .clinerules`, or
you ran it and a later `git checkout -- .` undid it because you did not
commit. Copy it again, commit it, and start a NEW Cline task — the rules are
read when a task begins, so the one already open is still using the old set.

**Cline rewrote a file and broke everything**
Do not panic and do not try to fix it by prompting. In the terminal:
`git checkout -- path/to/the/file.py` puts that file back to the last commit.
This is why you commit after every working step.

**The agent is going in circles on the same error**
Stop it. Start a NEW task instead of continuing the conversation — a long
conversation makes the agent worse, not better. Tell it what you already
tried.

**"Diff Edit Failed" keeps repeating**
The agent is trying to edit a file and cannot match the text it is looking
for. Stop it, start a new task, and ask it to rewrite the whole file in one
go rather than editing it.

## The app

**`streamlit run app.py` shows "command not found"**
Two causes, and the first is more common than you would think.

1. **Check the spelling.** It is `streamlit`, not `steamlit`. The missing "r"
   is the single most frequent typo in this workshop.
2. If the spelling is right, the packages did not install. Run
   `pip install -r requirements.txt`, watch for errors, and if it fails, tell
   your instructor what the error said.

**The preview is blank or will not open**
Open the **Ports** tab next to the terminal, find port 8501, click the globe
icon.

**`ModuleNotFoundError: No module named 'core'`**
You are running from the wrong folder. Run `pwd`. You must be in the folder
that contains `app.py`.

**My page does not appear in the sidebar**
The file must be inside `pages/` and end in `.py`. Restart Streamlit.

## Git and teamwork

**My teammate's changes are not showing up**
`git pull` first, then keep working.

**`git pull` says "no tracking information for the current branch"**
Your copy has lost track of where it came from. Fix it once with:
`git branch --set-upstream-to=origin/main main`

**Git says there is a merge conflict**
Two people edited the same file, which the one-file-per-owner rule exists to
prevent. Tell your team, agree who owns that file, and have the other person
undo their change to it with `git checkout --theirs path/to/file.py`.

**I accidentally committed my `.env` file**
Tell the instructor immediately and create a new API key at
https://aistudio.google.com/apikey — the old one must be treated as leaked.
