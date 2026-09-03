# AI for Software Development — project template

This is the starting point for every lab and project in the workshop.

## Before the first session (about 20 minutes)

Do this at home. If it fails, message the class channel — do not wait until
class, because 60 people cannot be unblocked at once.

1. **Create a GitHub account** at https://github.com/signup using a personal
   email address.
2. **Get free AI keys — two if you can.** Free tiers refuse service without
   warning, and when one does you switch to the other and keep working instead
   of losing the session. **One key is enough to start**, so if a signup blocks
   you — managed university account, no phone number, wrong region — take the
   one you have and carry on. `check_setup.py` will warn about it, not stop you.
   - Gemini: https://aistudio.google.com/apikey → "Create API key"
   - Mistral: https://console.mistral.ai → API keys → create one

   A key is a password. Do not share it, do not paste it into a chat, and do
   not put it in a `.py` file.
3. **Make your own copy of this project.** Click the green **Use this
   template** button at the top of this page, then **Create a new
   repository**. Give it any name. Set it to **Public**, and leave
   **"Include all branches"** switched **off** — you do not need the solution
   branches in your copy, and step 8 gets you to them when you do.
4. **Open it in a Codespace.** On your new repository, click **Code** >
   **Codespaces** > **Create codespace on main**. A full code editor opens in
   your browser. First launch takes two to three minutes.
5. **Paste your keys in.** Open the file called `.env` in the editor. Replace
   the placeholder text on both lines with your two keys. Save with Ctrl+S,
   then **close the `.env` tab** — you will be sharing this screen later, and
   a key on screen is a key shared.
6. **Check everything works.** In the terminal at the bottom, run:

   ```
   python check_setup.py
   ```

   Keep fixing what it reports until it prints `ALL CHECKS PASSED`, or
   `READY` if it leaves you a `[WARN]`. A `[WARN]` is advice, not a blocker —
   you can start the lab with one.
7. **Point Cline at a model.** This is a separate step from `.env`, and
   skipping it is the most common way to arrive unable to work. `.env` holds
   keys for the *app*; Cline is a different program with its own settings.

   - Click the **Cline icon** — the robot, near the bottom of the strip of
     icons down the far left. The icons are unlabelled; hover to check.
   - Cline opens on **"How will you use Cline?"**. It has already ticked
     **Absolutely Free** for you. **Do not take it.** Choose
     **Bring my own API key** — the free option signs you into Cline's own
     service and never touches the key you just made.
   - Provider: **Mistral** (or Google Gemini). Paste the matching key.
   - Model: pick one whose name starts with **`devstral`** if you see one —
     they are Mistral's coding models. Otherwise **`mistral-medium`**. The
     names carry a date, like `devstral-2512`. Some entries do say "latest",
     but the dated coding models are the ones you want.
   - Type **hello** at it and check you get a reply.

   > **Check the model name after any window reload.** It is the small grey
   > text at the bottom of the Cline box, and Cline can quietly reset it.
   >
   > What matters is **whose** model it is, not the price shown. Cline lists a
   > price per million tokens for everything; on a free key you are rate-limited,
   > not billed. But if the name stops looking like a Mistral one — anything
   > with `zai`, `anthropic`, `openai`, `claude`, `gpt` in it — it has jumped to
   > a provider you have no key for. Set it back to a Mistral model. If
   > `devstral` has vanished from the list, which happens, `mistral-medium` is
   > the one to take.

8. **Make the reference reachable.** In the terminal:

   ```
   git remote add reference https://github.com/witchapong/ai-workshop-template.git
   git fetch reference
   ```

   Your repository was made with "Use this template", which copies only `main`.
   The worked solutions live on branches of the template itself, and this is
   what lets you pull one in when you are stuck. Do it now, while nothing is
   going wrong — you will want it at the moment you least want to debug a
   second thing. Repeat it if you ever create a new Codespace.
9. **Post "setup done" in the class channel.**

## Closing it, and coming back

**Close the tab whenever you like.** Your Codespace stops on its own after
about thirty minutes of inactivity, and stopping is safe: your files, your
uncommitted edits, your `.env` and Cline's settings are all still there when
you come back. A stopped Codespace also stops using your free hours.

**To get back in:** https://github.com/codespaces — your Codespace is listed
by name; click it. You can also reach it from your repository under
**Code → Codespaces**. Bookmark the first one; you will use it every week.

Two things worth knowing:

- **Stopping is not deleting.** Deleting is the destructive one — `.env` is
  git-ignored so it is never pushed, and Cline's configuration lives inside
  the Codespace. Delete it and you set up both keys and your agent again from
  scratch. Only delete if something is genuinely broken.
- **Unused Codespaces are removed after about thirty days.** That is longer
  than this course, but push your work anyway — GitHub is where it is safe,
  not the Codespace.

## What is in here

| Folder | What it is for |
|---|---|
| `aidlc/` | The four planning documents you fill in before writing code |
| `pages/` | One file per feature. This is how your team works in parallel |
| `core/` | Shared code: your data shapes, saving and loading, AI calls |
| `tests/` | Automated checks that your code still works |
| `labs/` | Instructions and prompts for each lab session |
| `briefs/` | The project ideas you can choose from |

## Running your app

```
streamlit run app.py
```

A preview opens automatically. If it does not, look for the **Ports** tab and
click the globe icon next to port 8501.

## Running your tests

```
pytest
```

## Something is broken

See `TROUBLESHOOTING.md`. Give it a real try for ten minutes before asking.
