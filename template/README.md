# AI for Software Development — project template

This is the starting point for every lab and project in the workshop.

## Before the first session (about 20 minutes)

Do this at home. If it fails, message the class channel — do not wait until
class, because 60 people cannot be unblocked at once.

1. **Create a GitHub account** at https://github.com/signup using a personal
   email address.
2. **Get a free AI key.** Go to https://aistudio.google.com/apikey, sign in
   with a Google account, click "Create API key", and copy it somewhere safe.
   A key is a password — do not share it or paste it into a chat.
3. **Make your own copy of this project.** Click the green **Use this
   template** button at the top of this page, then **Create a new
   repository**. Give it any name. Set it to **Public**.
4. **Open it in a Codespace.** On your new repository, click **Code** >
   **Codespaces** > **Create codespace on main**. A full code editor opens in
   your browser. First launch takes two to three minutes.
5. **Paste your key in.** Open the file called `.env` in the editor. Replace
   `paste-your-key-here` with the key you copied. Save with Ctrl+S.
6. **Check everything works.** In the terminal at the bottom, run:

   ```
   python check_setup.py
   ```

   Keep fixing what it reports until it prints `ALL CHECKS PASSED`.
7. **Post "setup done" in the class channel.**

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
