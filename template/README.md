# AI for Software Development — project template

This is the starting point for every lab and project in the workshop.

## Before the first session (about 20 minutes)

Do this at home. If it fails, message the class channel — do not wait until
class, because 60 people cannot be unblocked at once.

1. **Create a GitHub account** at https://github.com/signup using a personal
   email address.
2. **Get TWO free AI keys.** You need both, and here is why: free tiers refuse
   service without warning, and when one does you switch to the other and keep
   working instead of losing the session.
   - Gemini: https://aistudio.google.com/apikey → "Create API key"
   - Mistral: https://console.mistral.ai → API keys → create one

   A key is a password. Do not share it, do not paste it into a chat, and do
   not put it in a `.py` file.
3. **Make your own copy of this project.** Click the green **Use this
   template** button at the top of this page, then **Create a new
   repository**. Give it any name. Set it to **Public**.
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

   Keep fixing what it reports until it prints `ALL CHECKS PASSED`.
7. **Point Cline at a model.** This is a separate step, and skipping it is the
   most common way to arrive unable to work. `.env` holds keys for the *app*;
   Cline is an extension with its own settings and its own copy of the key.
   - Click the **Cline icon** in the left sidebar
   - Choose provider **Google Gemini**, paste your Gemini key, pick any
     current **Flash** model
   - Add **Mistral** as a second provider, with model
     **`devstral-medium-latest`**
   - Type "hello" into Cline and confirm you get a reply
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
