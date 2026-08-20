# Workshop Materials Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build every artifact needed to run the 3-session "AI for Software Development" workshop — a student-facing template repository, lab briefs, project briefs, lecture decks, and instructor materials.

**Architecture:** Two repositories. This repo (`ai-for-software-dev`) holds instructor materials: spec, plan, slides, rubric, pilot checklist. A second published repo (`ai-workshop-template`) is the GitHub *template repository* students clone with "Use this template" — it carries the devcontainer, the `.clinerules` gate rules, the Streamlit skeleton, lab instructions, and project briefs. The template is developed here under `template/` and published in the final task. Completed lab solutions ship as branches on the published template (`solution/lab1`, `solution/lab3`), giving stuck students a known-good reference without needing a third repo.

**Tech Stack:** Python 3.11, Streamlit, NumPy, Matplotlib, google-genai, pytest, GitHub Codespaces (devcontainer), Cline (`saoudrizwan.claude-dev`), GitHub Actions.

## Global Constraints

- Python **3.11** (devcontainer image `mcr.microsoft.com/devcontainers/python:3.11`).
- Dependencies are **exactly pinned**, and the list is closed: `streamlit==1.61.1`, `numpy==2.5.2`, `matplotlib==3.11.1`, `google-genai==2.18.1`, `python-dotenv==1.2.3`, `pytest==9.1.1`. No pandas. No other package may be added.
- **No secrets in the repo, ever.** Keys are read from environment via `.env`, which is git-ignored. `.env.example` carries placeholder names only.
- All code lives under `template/` in this repo until the publish task.
- Tests run from the `template/` directory: `cd template && pytest`.
- Tests requiring network are marked `@pytest.mark.live` and excluded from CI.
- **One file per owner:** no task creates a file another task also modifies, except where explicitly stated.
- All student-facing prose is **plain language** — every technical term defined at first use. The audience has completed one introductory Python course.
- Student-facing text must not assume a teaching assistant is available.

---

## File Structure

**Template repository** (`template/`, published as `ai-workshop-template`):

| Path | Responsibility |
|---|---|
| `.devcontainer/devcontainer.json` | Identical environment for all students; pre-installs Cline |
| `.clinerules` | Four Gates rules the agent obeys on every request |
| `.env.example` | Placeholder key names; the real `.env` is git-ignored |
| `.gitignore` | Blocks `.env`, `data/`, Python artifacts |
| `pytest.ini` | Adds repo root to import path; registers the `live` marker |
| `requirements.txt` | The six pinned dependencies |
| `check_setup.py` | Pre-work verification: Python version, imports, keys, live API call |
| `app.py` | Streamlit entry point: title and navigation. Nobody's "own" file |
| `pages/1_Home.py` | Example feature page showing the one-file-per-feature pattern |
| `core/models.py` | Example dataclass with `to_dict`/`from_dict` round trip |
| `core/storage.py` | CSV persistence: `load`, `save`, `append` |
| `core/llm.py` | Stub in `main`; implemented on `solution/lab3` |
| `core/spectrum.py` | Does **not** exist on `main`; built by students, shipped on `solution/lab1` |
| `tests/` | One test module per `core/` module |
| `aidlc/{intent,requirements,design,tasks}.md` | The Four Gates artifact templates |
| `labs/LAB1.md`, `labs/LAB2.md`, `labs/LAB3.md` | Student lab instructions |
| `labs/PROMPTS.md` | Copy-paste gate prompts, validated by the Task 9A loop |
| `labs/EXPLAIN.md` | Prompts for understanding the reference app — the fallback path |
| `briefs/*.md` | Five pre-vetted group project briefs |
| `session3/corpus/*.md` | Five component datasheet excerpts for the retrieval lab |
| `README.md` | First-day orientation and setup |
| `TROUBLESHOOTING.md` | "If X breaks, do Y" — the no-TA safety net |
| `.github/workflows/ci.yml` | Runs pytest on push and pull request |

**Instructor repository** (this repo):

| Path | Responsibility |
|---|---|
| `slides/deck.js` | The ten layout recipes from `SLIDE-STYLE.md`, shared by every deck |
| `slides/sessionN.js` | Content for one deck: recipe, text, speaker note |
| `slides/Session N - <name>.pptx` | The generated deck |
| `instructor/rubric.md` | Assessment rubric |
| `instructor/peer-score-form.md` | One-page demo-day peer scoring form |
| `instructor/ai-collaboration-log.md` | Individual submission template |
| `instructor/pilot-checklist.md` | The 8 pre-flight checks from spec §10 |
| `instructor/dry-run-findings.md` | Consolidated findings from all three lab dry-runs |
| `eval/prompts/`, `eval/run_lab1.sh` | The authored golden prompts and the runner |
| `eval/check_gate.py`, `eval/restore_golden.py`, `eval/score.py` | Per-gate scoring, golden restore, aggregation |
| `eval/golden/lab1/` | **Captured** golden gate artifacts — published to `solution/lab1` |
| `eval/REPORT.md` | Measured pass rates per model — the evidence behind the model choice |
| `scripts/publish-template.sh` | Publishes `template/` to the student repo |

---

## Task 1: Template skeleton and development environment

**Files:**
- Create: `template/requirements.txt`, `template/pytest.ini`, `template/.gitignore`, `template/.env.example`, `template/.devcontainer/devcontainer.json`, `template/.github/workflows/ci.yml`, `template/core/__init__.py`, `template/tests/__init__.py`

**Interfaces:**
- Consumes: nothing
- Produces: a working Python environment where `cd template && pytest` runs and collects zero tests without error.

- [ ] **Step 1: Create the dependency and pytest configuration**

`template/requirements.txt`:
```
streamlit==1.61.1
numpy==2.5.2
matplotlib==3.11.1
google-genai==2.18.1
python-dotenv==1.2.3
pytest==9.1.1
```

`template/pytest.ini`:
```ini
[pytest]
pythonpath = .
testpaths = tests
markers =
    live: test makes a real network call and needs an API key
```

- [ ] **Step 2: Create the ignore and environment files**

`template/.gitignore`:
```
.env
data/
__pycache__/
*.py[cod]
.pytest_cache/
.venv/
.DS_Store
```

`template/.env.example`:
```
# Copy this file to .env and paste your own keys in.
# NEVER commit .env — it is listed in .gitignore for a reason.

# Get one free at https://aistudio.google.com/apikey
GEMINI_API_KEY=paste-your-key-here

# Optional backup. Get one free at https://console.mistral.ai
MISTRAL_API_KEY=
```

- [ ] **Step 3: Create the devcontainer**

`template/.devcontainer/devcontainer.json`:
```json
{
  "name": "AI Workshop",
  "image": "mcr.microsoft.com/devcontainers/python:3.11",
  "customizations": {
    "vscode": {
      "extensions": [
        "saoudrizwan.claude-dev",
        "ms-python.python"
      ]
    }
  },
  "postCreateCommand": "pip install --no-cache-dir -r requirements.txt && cp -n .env.example .env",
  "forwardPorts": [8501],
  "portsAttributes": {
    "8501": {
      "label": "Streamlit app",
      "onAutoForward": "openPreview"
    }
  }
}
```

- [ ] **Step 4: Create the CI workflow**

`template/.github/workflows/ci.yml`:
```yaml
name: tests

on: [push, pull_request]

jobs:
  pytest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: pytest -m "not live" -v
```

- [ ] **Step 5: Create empty package markers**

Create `template/core/__init__.py` and `template/tests/__init__.py`, both empty files.

- [ ] **Step 6: Verify the environment works**

Run: `cd template && pip install -r requirements.txt && pytest`
Expected: `no tests ran` — collection succeeds with zero tests and no import errors.

- [ ] **Step 7: Commit**

```bash
git add template/
git commit -m "feat: scaffold workshop template environment"
```

---

## Task 2: `core/models.py` — the example data shape

Students copy this pattern for their own project's data. It exists to demonstrate the `to_dict`/`from_dict` round trip that `storage.py` depends on.

**Files:**
- Create: `template/core/models.py`
- Test: `template/tests/test_models.py`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `new_id() -> str` — a short unique identifier
  - `@dataclass Item` with fields `id: str`, `name: str`, `note: str`
  - `Item.to_dict(self) -> dict[str, str]`
  - `Item.from_dict(cls, data: dict[str, str]) -> Item`

- [ ] **Step 1: Write the failing test**

`template/tests/test_models.py`:
```python
from core.models import Item, new_id


def test_item_round_trips_through_dict():
    item = Item(id="abc123", name="Oscilloscope", note="Bench 4")
    restored = Item.from_dict(item.to_dict())
    assert restored == item


def test_to_dict_returns_only_strings():
    item = Item(id="abc123", name="Oscilloscope", note="Bench 4")
    assert all(isinstance(v, str) for v in item.to_dict().values())


def test_new_id_is_unique():
    assert new_id() != new_id()


def test_new_id_is_short_and_printable():
    value = new_id()
    assert len(value) == 8
    assert value.isalnum()
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd template && pytest tests/test_models.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'core.models'`

- [ ] **Step 3: Write the implementation**

`template/core/models.py`:
```python
"""Example data shape. Copy this pattern for your own project's data.

A dataclass describes ONE thing your app stores — a booking, a part, a reading.
`to_dict` and `from_dict` convert it to and from the plain dictionaries that
core/storage.py writes to CSV files.
"""

import uuid
from dataclasses import dataclass, asdict


def new_id() -> str:
    """Return a short unique identifier, e.g. '3f2a9c01'."""
    return uuid.uuid4().hex[:8]


@dataclass
class Item:
    """One row of example data. Replace this with your own."""

    id: str
    name: str
    note: str

    def to_dict(self) -> dict[str, str]:
        """Convert to a plain dictionary of strings, ready for storage."""
        return {key: str(value) for key, value in asdict(self).items()}

    @classmethod
    def from_dict(cls, data: dict[str, str]) -> "Item":
        """Rebuild an Item from a dictionary read back out of storage."""
        return cls(id=data["id"], name=data["name"], note=data["note"])
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd template && pytest tests/test_models.py -v`
Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add template/core/models.py template/tests/test_models.py
git commit -m "feat: add example Item model with dict round trip"
```

---

## Task 3: `core/storage.py` — CSV persistence

Deliberately CSV, not a database: students can open the file and see their data, which makes storage concrete rather than magic.

**Files:**
- Create: `template/core/storage.py`
- Test: `template/tests/test_storage.py`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `load(name: str, data_dir: Path | None = None) -> list[dict[str, str]]`
  - `save(name: str, records: list[dict[str, str]], data_dir: Path | None = None) -> None`
  - `append(name: str, record: dict[str, str], data_dir: Path | None = None) -> None`
  - Files are written to `data/<name>.csv`. `data_dir` exists so tests can use a temporary folder.

- [ ] **Step 1: Write the failing test**

`template/tests/test_storage.py`:
```python
import pytest

from core.storage import load, save, append


def test_load_returns_empty_list_when_file_missing(tmp_path):
    assert load("nothing", data_dir=tmp_path) == []


def test_save_then_load_round_trips(tmp_path):
    records = [
        {"id": "1", "name": "Scope", "note": "Bench 4"},
        {"id": "2", "name": "Meter", "note": "Bench 1"},
    ]
    save("kit", records, data_dir=tmp_path)
    assert load("kit", data_dir=tmp_path) == records


def test_append_adds_to_existing_file(tmp_path):
    save("kit", [{"id": "1", "name": "Scope"}], data_dir=tmp_path)
    append("kit", {"id": "2", "name": "Meter"}, data_dir=tmp_path)
    assert load("kit", data_dir=tmp_path) == [
        {"id": "1", "name": "Scope"},
        {"id": "2", "name": "Meter"},
    ]


def test_append_creates_file_when_missing(tmp_path):
    append("fresh", {"id": "1", "name": "Scope"}, data_dir=tmp_path)
    assert load("fresh", data_dir=tmp_path) == [{"id": "1", "name": "Scope"}]


def test_save_empty_list_produces_empty_load(tmp_path):
    save("kit", [], data_dir=tmp_path)
    assert load("kit", data_dir=tmp_path) == []


def test_append_rejects_record_with_different_columns(tmp_path):
    save("kit", [{"id": "1", "name": "Scope"}], data_dir=tmp_path)
    with pytest.raises(ValueError, match="columns"):
        append("kit", {"id": "2", "colour": "blue"}, data_dir=tmp_path)
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd template && pytest tests/test_storage.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'core.storage'`

- [ ] **Step 3: Write the implementation**

`template/core/storage.py`:
```python
"""Save and load records as CSV files in the data/ folder.

Each "name" is one table. load("bookings") reads data/bookings.csv and gives
you a list of dictionaries. Open the file in the editor any time to see
exactly what your app has stored — there is no hidden database.
"""

import csv
from pathlib import Path

DEFAULT_DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _path_for(name: str, data_dir: Path | None) -> Path:
    directory = Path(data_dir) if data_dir is not None else DEFAULT_DATA_DIR
    directory.mkdir(parents=True, exist_ok=True)
    return directory / f"{name}.csv"


def load(name: str, data_dir: Path | None = None) -> list[dict[str, str]]:
    """Read every record. Returns [] if nothing has been saved yet."""
    path = _path_for(name, data_dir)
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def save(name: str, records: list[dict[str, str]], data_dir: Path | None = None) -> None:
    """Overwrite everything with the given records."""
    path = _path_for(name, data_dir)
    if not records:
        path.write_text("", encoding="utf-8")
        return
    columns = list(records[0].keys())
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(records)


def append(name: str, record: dict[str, str], data_dir: Path | None = None) -> None:
    """Add one record to the end, keeping existing records."""
    existing = load(name, data_dir)
    if existing and set(record.keys()) != set(existing[0].keys()):
        raise ValueError(
            f"columns do not match: {name}.csv has {sorted(existing[0])}, "
            f"you gave {sorted(record)}"
        )
    save(name, existing + [record], data_dir)
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd template && pytest tests/test_storage.py -v`
Expected: 6 passed

- [ ] **Step 5: Commit**

```bash
git add template/core/storage.py template/tests/test_storage.py
git commit -m "feat: add CSV storage helpers"
```

---

## Task 4: `check_setup.py` — the pre-work verification script

Students run this before Session 1. It converts setup failure from a classroom emergency into an email the instructor can answer in advance.

**Files:**
- Create: `template/check_setup.py`
- Test: `template/tests/test_check_setup.py`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `check_python_version() -> tuple[bool, str]`
  - `check_imports() -> tuple[bool, str]`
  - `check_env(environ: dict[str, str]) -> tuple[bool, str]`
  - `main() -> int` — prints results, returns 0 on success and 1 on failure
  - Each check returns `(passed, human_readable_message)`.

- [ ] **Step 1: Write the failing test**

`template/tests/test_check_setup.py`:
```python
from check_setup import check_env, check_imports, check_python_version


def test_python_version_passes_on_supported_version():
    passed, message = check_python_version()
    assert passed is True
    assert "3.11" in message or "3.1" in message


def test_imports_pass_when_dependencies_installed():
    passed, message = check_imports()
    assert passed is True, message


def test_env_fails_when_no_key_present():
    passed, message = check_env({})
    assert passed is False
    assert "GEMINI_API_KEY" in message


def test_env_fails_when_key_is_still_the_placeholder():
    passed, message = check_env({"GEMINI_API_KEY": "paste-your-key-here"})
    assert passed is False
    assert "placeholder" in message.lower()


def test_env_passes_when_gemini_key_present():
    passed, _ = check_env({"GEMINI_API_KEY": "AIzaSyRealLookingKey123"})
    assert passed is True


def test_env_passes_when_only_mistral_key_present():
    passed, _ = check_env({"MISTRAL_API_KEY": "realmistralkey123"})
    assert passed is True
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd template && pytest tests/test_check_setup.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'check_setup'`

- [ ] **Step 3: Write the implementation**

`template/check_setup.py`:
```python
"""Run this before the first session:  python check_setup.py

It checks four things and tells you exactly what to fix if any of them fail.
Do not come to class until this prints "ALL CHECKS PASSED".
"""

import os
import sys

PLACEHOLDER = "paste-your-key-here"
REQUIRED_PACKAGES = ["streamlit", "numpy", "matplotlib", "google.genai", "dotenv", "pytest"]


def check_python_version() -> tuple[bool, str]:
    """Python must be 3.11 or newer."""
    major, minor = sys.version_info[:2]
    found = f"{major}.{minor}"
    if (major, minor) >= (3, 11):
        return True, f"Python {found}"
    return False, (
        f"Python {found} is too old. This project needs 3.11 or newer. "
        "If you are in a Codespace, rebuild the container: "
        "Command Palette > Codespaces: Rebuild Container."
    )


def check_imports() -> tuple[bool, str]:
    """Every required package must be importable."""
    import importlib

    missing = []
    for package in REQUIRED_PACKAGES:
        try:
            importlib.import_module(package)
        except ImportError:
            missing.append(package)
    if not missing:
        return True, f"All {len(REQUIRED_PACKAGES)} packages installed"
    return False, (
        f"Missing packages: {', '.join(missing)}. "
        "Fix it by running:  pip install -r requirements.txt"
    )


def check_env(environ: dict[str, str]) -> tuple[bool, str]:
    """At least one usable API key must be set."""
    for name in ("GEMINI_API_KEY", "MISTRAL_API_KEY"):
        value = (environ.get(name) or "").strip()
        if not value:
            continue
        if value == PLACEHOLDER:
            return False, (
                f"{name} is still the placeholder text. Open .env and replace "
                f"'{PLACEHOLDER}' with the key you created."
            )
        return True, f"{name} is set"
    return False, (
        "No API key found. Copy .env.example to .env, then paste your key into "
        "GEMINI_API_KEY. Get one free at https://aistudio.google.com/apikey"
    )


def check_live_call() -> tuple[bool, str]:
    """Make one real request, to prove the key actually works."""
    key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    if not key or key == PLACEHOLDER:
        return False, "Skipped — no usable GEMINI_API_KEY to test"
    try:
        from google import genai

        client = genai.Client(api_key=key)
        client.models.generate_content(
            model="gemini-2.5-flash", contents="Reply with the single word: ok"
        )
        return True, "Live API call succeeded"
    except Exception as error:  # noqa: BLE001 - we want to show students the raw reason
        return False, (
            f"The API rejected the request: {error}\n"
            "   Most likely your key is wrong or was copied with extra spaces. "
            "Create a new one at https://aistudio.google.com/apikey"
        )


def main() -> int:
    from dotenv import load_dotenv

    load_dotenv()

    checks = [
        ("Python version", check_python_version()),
        ("Packages", check_imports()),
        ("API key present", check_env(dict(os.environ))),
        ("API key works", check_live_call()),
    ]

    print()
    all_passed = True
    for label, (passed, message) in checks:
        mark = "PASS" if passed else "FAIL"
        print(f"[{mark}] {label}: {message}")
        all_passed = all_passed and passed

    print()
    if all_passed:
        print("ALL CHECKS PASSED - you are ready for the session.")
        return 0
    print("Some checks failed. Fix the items marked FAIL above, then run this again.")
    print("Still stuck after 10 minutes? See TROUBLESHOOTING.md")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd template && pytest tests/test_check_setup.py -v`
Expected: 6 passed

- [ ] **Step 5: Verify the script runs end to end**

Run: `cd template && python check_setup.py`
Expected: exit code 1, with `[FAIL] API key present` (no `.env` exists yet) and every other check passing. This confirms the failure path prints useful guidance.

- [ ] **Step 6: Commit**

```bash
git add template/check_setup.py template/tests/test_check_setup.py
git commit -m "feat: add pre-work setup verification script"
```

---

## Task 5: `core/llm.py` stub and the Streamlit skeleton

**Files:**
- Create: `template/core/llm.py`, `template/app.py`, `template/pages/1_Home.py`
- Test: `template/tests/test_llm.py`

**Interfaces:**
- Consumes: `core.storage.load`, `core.storage.append`, `core.models.Item`, `core.models.new_id`
- Produces:
  - `ask(question: str, context: str = "", client=None) -> str` — raises `NotImplementedError` on `main`
  - `ask_structured(question: str, schema: dict, context: str = "", client=None) -> dict` — raises `NotImplementedError` on `main`
  - Both are implemented in Task 13 on the `solution/lab3` branch. The `client` parameter exists so tests can inject a fake and never touch the network.

- [ ] **Step 1: Write the failing test**

`template/tests/test_llm.py`:
```python
import pytest

from core.llm import ask, ask_structured


def test_ask_is_not_implemented_yet():
    with pytest.raises(NotImplementedError, match="LAB3"):
        ask("What is a resistor?")


def test_ask_structured_is_not_implemented_yet():
    with pytest.raises(NotImplementedError, match="LAB3"):
        ask_structured("What is a resistor?", schema={"type": "object"})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd template && pytest tests/test_llm.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'core.llm'`

- [ ] **Step 3: Write the stub**

`template/core/llm.py`:
```python
"""Where your app talks to a language model.

This file is deliberately empty until Session 3. Leaving the slot here means
you can add an AI feature later without rearranging anything you have built.
"""

NOT_YET = "You build this in Session 3. See labs/LAB3.md."


def ask(question: str, context: str = "", client=None) -> str:
    """Ask a question in plain language and get plain text back."""
    raise NotImplementedError(NOT_YET)


def ask_structured(question: str, schema: dict, context: str = "", client=None) -> dict:
    """Ask a question and get an answer in a fixed shape you specify."""
    raise NotImplementedError(NOT_YET)
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd template && pytest tests/test_llm.py -v`
Expected: 2 passed

- [ ] **Step 5: Write the Streamlit entry point**

`template/app.py`:
```python
"""Start here. Run the app with:  streamlit run app.py

Streamlit turns every file in the pages/ folder into a tab automatically.
That is why one feature = one file in pages/ = one person's work.
"""

import streamlit as st

st.set_page_config(page_title="My Project", page_icon="*", layout="wide")

st.title("My Project")
st.write(
    "Replace this text with what your project does. "
    "Use the sidebar to move between features."
)
st.info("Each feature lives in its own file in the pages/ folder.")
```

- [ ] **Step 6: Write the example page**

`template/pages/1_Home.py`:
```python
"""Example feature page. Copy this file as the starting point for your own.

The number at the front of the filename sets the order in the sidebar.
"""

import streamlit as st

from core.models import Item, new_id
from core.storage import append, load

st.title("Example: a list of things")
st.caption("Delete this page once you have built your own.")

with st.form("add_item"):
    name = st.text_input("Name")
    note = st.text_input("Note")
    submitted = st.form_submit_button("Add")

if submitted and name:
    append("items", Item(id=new_id(), name=name, note=note).to_dict())
    st.success(f"Added {name}")

items = load("items")
if items:
    st.dataframe(items, use_container_width=True)
else:
    st.write("Nothing saved yet. Add something above.")
```

- [ ] **Step 7: Verify the app starts**

Run: `cd template && streamlit run app.py --server.headless true --server.port 8501`
Expected: starts without error and prints a local URL. Open it, add an item on the Home page, confirm it appears in the table, confirm `template/data/items.csv` now exists. Stop with Ctrl+C.

- [ ] **Step 8: Commit**

```bash
git add template/core/llm.py template/tests/test_llm.py template/app.py template/pages/1_Home.py
git commit -m "feat: add Streamlit skeleton and LLM stub"
```

---

## Task 6: `.clinerules` — the gate rules the agent obeys

The single highest-leverage artifact in the workshop. With 30–60 students and no teaching assistants, the instructor cannot enforce process by walking the room, so the tool enforces it.

**Files:**
- Create: `template/.clinerules`

**Interfaces:**
- Consumes: the `aidlc/` filenames created in Task 7 — the paths named here must match exactly.
- Produces: agent behaviour relied on by every lab.

- [ ] **Step 1: Write the rules file**

`template/.clinerules`:
```markdown
# How you must work on this project

You are working with a student who is learning software engineering.
They have completed one introductory Python course. Follow the Four Gates
below and never skip ahead, even if the student asks you to.

## The Four Gates

**Gate 1 — Intent.** If `aidlc/intent.md` still contains the placeholder
text, ask the student to fill it in first. Write no code.

**Gate 2 — Spec.** Before any code exists, `aidlc/requirements.md` must list
numbered requirements, each with an acceptance criterion that can be checked
by running something. Draft it, then STOP and ask for approval. Do not write
code until the student replies with "approved".

**Gate 3 — Plan.** Before any code exists, `aidlc/design.md` and
`aidlc/tasks.md` must exist. Every task in `tasks.md` must name exactly ONE
owner and touch exactly ONE file that no other task touches. Draft both, then
STOP and ask for approval.

**Gate 4 — Build.** Implement ONE task at a time. After each task: run the
tests, report the result honestly, and STOP. Do not begin the next task
until asked.

## Coding rules

- Python 3.11 and Streamlit only.
- Do not add a dependency without asking first. The approved list is in
  `requirements.txt` and it is closed.
- One feature = one file in `pages/`. Never edit a file that `aidlc/tasks.md`
  assigns to a different owner.
- Every function in `core/` needs a test in `tests/`.
- Keep diffs small. Never rewrite a whole file when an edit will do.
- Never put an API key in code. Read it from the environment.
- If a requirement is ambiguous, ask. Do not guess and carry on.

## Teaching rules

- Before doing anything, say what you are about to do in two sentences.
- Explain any term the student may not know, the first time you use it.
- When you finish a task, state plainly what you did NOT test.
- If you are unsure whether something works, say so. Never claim success you
  have not verified by running something.
```

- [ ] **Step 2: Verify the referenced paths**

Run: `grep -o 'aidlc/[a-z]*\.md' template/.clinerules | sort -u`
Expected: exactly `aidlc/design.md`, `aidlc/intent.md`, `aidlc/requirements.md`, `aidlc/tasks.md`. These must match the files created in Task 7.

- [ ] **Step 3: Commit**

```bash
git add template/.clinerules
git commit -m "feat: add Four Gates agent rules"
```

---

## Task 7: The `aidlc/` gate templates

**Files:**
- Create: `template/aidlc/intent.md`, `template/aidlc/requirements.md`, `template/aidlc/design.md`, `template/aidlc/tasks.md`

**Interfaces:**
- Consumes: filenames fixed by Task 6's `.clinerules`
- Produces: the artifacts students fill in at Gates 1–3

- [ ] **Step 1: Write `template/aidlc/intent.md`**

```markdown
# Gate 1 — Intent

<!-- PLACEHOLDER: replace every line below. Your agent will refuse to write
     code while this placeholder text is still here. -->

**Who is this for?**
PLACEHOLDER — describe one real person and their situation in one sentence.

**What problem does it solve?**
PLACEHOLDER — what is annoying or slow for them today?

**What does "done" look like?**
PLACEHOLDER — describe the moment you would call this finished. Be concrete:
"a student can book a bench for a two-hour slot and see it in their list."

**What is deliberately NOT included?**
PLACEHOLDER — name at least two things you are choosing not to build. This
matters more than it looks: it is what stops the agent inventing scope.
```

- [ ] **Step 2: Write `template/aidlc/requirements.md`**

```markdown
# Gate 2 — Requirements

Your agent drafts this. You correct it and approve it.

A requirement is only finished when its acceptance criterion can be **checked
by running something**. "The app should be user friendly" cannot be checked.
"Booking a taken slot shows the message 'already booked'" can.

| # | Requirement | Acceptance criterion (how we check it) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

**Approved by:** (your name)
**Date:**
```

- [ ] **Step 3: Write `template/aidlc/design.md`**

```markdown
# Gate 3 — Design

Your agent drafts this. You correct it and approve it.

## What data do we store?

One row per _______. Columns:

| Column | Meaning | Example |
|---|---|---|
| id | unique identifier | 3f2a9c01 |
| | | |

## What are the screens?

| Page file | What the user does here |
|---|---|
| `pages/1_....py` | |
| `pages/2_....py` | |

## How does data move?

Describe in three sentences what happens when a user does the main action:
what they type, what gets saved, what they see next.

**Approved by:**
**Date:**
```

- [ ] **Step 4: Write `template/aidlc/tasks.md`**

```markdown
# Gate 3 — Task list

Your agent drafts this. You correct it and approve it.

**The one rule that matters:** every task names exactly ONE owner and touches
exactly ONE file that no other task touches. This is what lets four people
build at the same time without their work colliding.

| # | Task | Owner | The ONE file it touches | Done? |
|---|---|---|---|---|
| 1 | | | `pages/1_....py` | |
| 2 | | | `pages/2_....py` | |
| 3 | | | `core/models.py` | |
| 4 | | | `core/storage.py` | |

**Approved by:**
**Date:**
```

- [ ] **Step 5: Commit**

```bash
git add template/aidlc/
git commit -m "feat: add Four Gates artifact templates"
```

---

## Task 8: `README.md` and `TROUBLESHOOTING.md`

`TROUBLESHOOTING.md` is the no-TA safety net. Every entry must be answerable by a student without the instructor.

**Files:**
- Create: `template/README.md`, `template/TROUBLESHOOTING.md`

**Interfaces:**
- Consumes: `check_setup.py` from Task 4, the devcontainer from Task 1
- Produces: the setup path students follow during pre-work

- [ ] **Step 1: Write `template/README.md`**

```markdown
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
| `labs/` | Instructions for each lab session |
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
```

- [ ] **Step 2: Write `template/TROUBLESHOOTING.md`**

```markdown
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

**My Codespace will not start, or is stuck**
Go to https://github.com/codespaces, find yours, click the three dots, choose
**Stop**, then open it again. If that fails, delete it and create a new one —
your work is safe as long as you have pushed it.

## The agent

**Cline says I am rate limited, or requests keep failing**
You have hit the free limit for that model. Open Cline's settings (gear icon),
switch the provider from Mistral to Google Gemini (or back), and continue.
This is why you set up two keys.

**Cline refuses to write code and keeps asking for `requirements.md`**
That is correct behaviour, not a bug. Fill in `aidlc/intent.md`, let it draft
`aidlc/requirements.md`, read it, then reply "approved".

**Cline rewrote a file and broke everything**
Do not panic and do not try to fix it by prompting. In the terminal:
`git checkout -- path/to/the/file.py` puts that file back to the last commit.
This is why you commit after every working step.

**The agent is going in circles on the same error**
Stop it. Start a NEW task instead of continuing the conversation — a long
conversation makes the agent worse, not better. Tell it what you already
tried.

## The app

**`streamlit run app.py` shows "command not found"**
Run `pip install -r requirements.txt` first.

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

**Git says there is a merge conflict**
Two people edited the same file, which the one-file-per-owner rule exists to
prevent. Tell your team, agree who owns that file, and have the other person
undo their change to it with `git checkout --theirs path/to/file.py`.

**I accidentally committed my `.env` file**
Tell the instructor immediately and create a new API key at
https://aistudio.google.com/apikey — the old one must be treated as leaked.
```

- [ ] **Step 3: Commit**

```bash
git add template/README.md template/TROUBLESHOOTING.md
git commit -m "docs: add student README and troubleshooting guide"
```

---

## Task 9: Lab 1 brief and the spectrum analyser solution

Lab 1's value rests on one property: the acceptance criteria are checkable
against maths the student already trusts, **and** the most likely failure is
one they can spot with their eyes. A signal built from a 1.0 V tone must show
a spike of height 1.0. Every common scaling mistake still produces peaks in
the right *places* — only the *heights* betray it. That is the workshop's
central skill in a single chart.

**Files:**
- Create: `template/labs/LAB1.md`
- Create (ships on published `main`): `template/tests/test_spectrum.py`
- Create (on `solution/lab1` branch only, in Task 15): `template/core/spectrum.py`, `template/pages/2_Spectrum_Analyzer.py`

> **Why the test file ships on `main` while the implementation does not.**
> "Make these failing tests pass" is a far more reliable instruction to an
> agent than "build something meeting these requirements", because success is
> unambiguous and the agent can check its own work by running something.
> Students still write acceptance criteria in their own words at Gate 2 — they
> then open the provided tests and compare. Seeing "the amplitudes should be
> right" next to `== pytest.approx(1.0, abs=0.001)` teaches what *checkable*
> means better than any slide.

**Interfaces:**
- Consumes: nothing
- Produces the solution signatures students' work is measured against:
  - `make_signal(components: list[tuple[float, float]], fs: float, duration: float) -> tuple[np.ndarray, np.ndarray]` returning `(times, signal)`; `components` is a list of `(frequency_hz, amplitude)` pairs
  - `spectrum(signal: np.ndarray, fs: float) -> tuple[np.ndarray, np.ndarray]` returning `(freqs, magnitudes)`
  - `peak_frequency(freqs: np.ndarray, magnitudes: np.ndarray) -> float`

- [ ] **Step 1: Write the reference implementation**

`template/core/spectrum.py`:
```python
"""Build signals out of sine waves and look at their frequency content."""

import numpy as np


def make_signal(
    components: list[tuple[float, float]], fs: float, duration: float
) -> tuple[np.ndarray, np.ndarray]:
    """Add sine waves together.

    components is a list of (frequency in hertz, amplitude) pairs.
    fs is the sampling rate in samples per second.
    Returns the time values and the signal values.
    """
    if fs <= 0 or duration <= 0:
        raise ValueError("sampling rate and duration must both be positive")
    times = np.arange(0, duration, 1.0 / fs)
    signal = np.zeros_like(times)
    for frequency_hz, amplitude in components:
        signal += amplitude * np.sin(2 * np.pi * frequency_hz * times)
    return times, signal


def spectrum(signal: np.ndarray, fs: float) -> tuple[np.ndarray, np.ndarray]:
    """Return the frequencies present in the signal and how strong each one is.

    The scaling matters. numpy gives back unscaled numbers, so a one volt sine
    would show up as five hundred. Multiplying by 2/n converts them back into
    the amplitudes you actually put in. The nought hertz term is not doubled,
    because it is not part of a pair.
    """
    n = len(signal)
    if n == 0:
        raise ValueError("signal is empty")
    coefficients = np.fft.rfft(signal)
    magnitudes = 2.0 * np.abs(coefficients) / n
    magnitudes[0] = np.abs(coefficients[0]) / n
    freqs = np.fft.rfftfreq(n, 1.0 / fs)
    return freqs, magnitudes


def peak_frequency(freqs: np.ndarray, magnitudes: np.ndarray) -> float:
    """The frequency with the most energy in it."""
    return float(freqs[np.argmax(magnitudes)])
```

- [ ] **Step 2: Write the tests**

`template/tests/test_spectrum.py`:
```python
import numpy as np
import pytest

from core.spectrum import make_signal, peak_frequency, spectrum

FS = 1000.0
DURATION = 1.0


def test_a_50_hz_sine_peaks_at_50_hz():
    _, signal = make_signal([(50.0, 1.0)], FS, DURATION)
    freqs, magnitudes = spectrum(signal, FS)
    assert peak_frequency(freqs, magnitudes) == pytest.approx(50.0)


def test_a_one_volt_sine_shows_an_amplitude_of_one():
    _, signal = make_signal([(50.0, 1.0)], FS, DURATION)
    freqs, magnitudes = spectrum(signal, FS)
    assert magnitudes[np.argmax(magnitudes)] == pytest.approx(1.0, abs=0.001)


def test_two_tones_each_show_their_own_amplitude():
    _, signal = make_signal([(50.0, 1.0), (120.0, 0.5)], FS, DURATION)
    freqs, magnitudes = spectrum(signal, FS)
    assert magnitudes[freqs == 50.0][0] == pytest.approx(1.0, abs=0.001)
    assert magnitudes[freqs == 120.0][0] == pytest.approx(0.5, abs=0.001)


def test_a_constant_offset_appears_at_zero_hz():
    _, signal = make_signal([(50.0, 1.0)], FS, DURATION)
    freqs, magnitudes = spectrum(signal + 2.0, FS)
    assert magnitudes[0] == pytest.approx(2.0, abs=0.001)


def test_the_frequency_axis_stops_at_half_the_sampling_rate():
    _, signal = make_signal([(50.0, 1.0)], FS, DURATION)
    freqs, _ = spectrum(signal, FS)
    assert freqs[0] == 0.0
    assert freqs[-1] == pytest.approx(FS / 2)


def test_one_second_of_signal_gives_one_hertz_resolution():
    _, signal = make_signal([(50.0, 1.0)], FS, DURATION)
    freqs, _ = spectrum(signal, FS)
    assert freqs[1] - freqs[0] == pytest.approx(1.0)


def test_a_negative_sampling_rate_is_rejected():
    with pytest.raises(ValueError, match="positive"):
        make_signal([(50.0, 1.0)], -1000.0, 1.0)
```

- [ ] **Step 3: Run the tests to verify they pass**

Run: `cd template && pytest tests/test_spectrum.py -v`
Expected: 7 passed

- [ ] **Step 4: Confirm the tests actually catch the scaling bugs**

A test that passes on broken code is worthless, and this suite's whole purpose
is to catch a specific class of bug. Verify it does, by breaking the code on
purpose three times.

Temporarily replace the `magnitudes = 2.0 * np.abs(coefficients) / n` line
with each of these, running `pytest tests/test_spectrum.py -q` after each:

| Broken line | Expected result |
|---|---|
| `magnitudes = np.abs(coefficients)` | 2 failed, 5 passed |
| `magnitudes = np.abs(coefficients) / n` | 2 failed, 5 passed |
| *(delete the `magnitudes[0] = ...` line)* | 1 failed, 6 passed |

Then restore the correct line and confirm 7 pass again.

Note what stays green in every broken case: `test_a_50_hz_sine_peaks_at_50_hz`.
The peaks are in the right places no matter how wrong the scaling is. That is
exactly why students are taught to check the numbers and not just the shape,
and it is worth saying out loud in the Session 1 debrief.

- [ ] **Step 5: Write the solution page**

`template/pages/2_Spectrum_Analyzer.py`:
```python
"""Lab 1 reference solution: a two-tone spectrum analyser."""

import matplotlib.pyplot as plt
import streamlit as st

from core.spectrum import make_signal, peak_frequency, spectrum

st.title("Spectrum Analyser")
st.caption("Build a signal from two sine waves and see what it is made of.")

fs = st.select_slider("Sampling rate (samples per second)", [500, 1000, 2000, 4000], 1000)

left, right = st.columns(2)
freq_a = left.number_input("Tone A frequency (Hz)", 1.0, float(fs) / 2, 50.0, step=1.0)
amp_a = left.number_input("Tone A amplitude", 0.0, 5.0, 1.0, step=0.1)
freq_b = right.number_input("Tone B frequency (Hz)", 1.0, float(fs) / 2, 120.0, step=1.0)
amp_b = right.number_input("Tone B amplitude", 0.0, 5.0, 0.5, step=0.1)

times, signal = make_signal([(freq_a, amp_a), (freq_b, amp_b)], fs, duration=1.0)
freqs, magnitudes = spectrum(signal, fs)

st.metric("Strongest frequency", f"{peak_frequency(freqs, magnitudes):,.1f} Hz")

figure, (top, bottom) = plt.subplots(2, 1, figsize=(7, 6))
top.plot(times[:200], signal[:200], linewidth=1)
top.set_xlabel("Time (seconds)")
top.set_ylabel("Amplitude")
top.set_title("The signal (first 200 samples)")
top.grid(alpha=0.3)

bottom.stem(freqs, magnitudes, markerfmt=" ", basefmt=" ")
bottom.set_xlim(0, min(fs / 2, max(freq_a, freq_b) * 2))
bottom.set_xlabel("Frequency (Hz)")
bottom.set_ylabel("Amplitude")
bottom.set_title("What it is made of")
bottom.grid(alpha=0.3)

figure.tight_layout()
st.pyplot(figure)

st.info(
    f"Check it yourself: tone A is {amp_a} at {freq_a:.0f} Hz. "
    "The spike should reach that height. If it does not, the scaling is wrong."
)
```

- [ ] **Step 6: Verify the page renders**

Run: `cd template && streamlit run app.py --server.headless true --server.port 8501`
Expected: a "Spectrum Analyzer" tab appears in the sidebar. With the defaults
(50 Hz at 1.0, 120 Hz at 0.5, sampling at 1000) the top chart shows a messy
repeating waveform and the bottom chart shows exactly two spikes — one at
50 Hz reaching 1.0, one at 120 Hz reaching 0.5. Read the heights off the axis
and confirm them by eye. Stop with Ctrl+C.

- [ ] **Step 7: Write the lab brief**

`template/labs/LAB1.md`:
```markdown
# Lab 1 — Build a spectrum analyser, twice

You will build the same app two ways. The comparison is the whole point.

A spectrum analyser takes a signal and tells you which frequencies it is made
of. You will build one that adds two sine waves together and then shows you
that it can find both of them again.

## Round 1: just ask for it (25 minutes)

Open Cline. Type:

> Build me a spectrum analyser in Streamlit that adds two sine waves together
> and plots the frequency spectrum.

Accept whatever it does. Do not plan. Do not write a spec. Try to get it
working. Note what happens.

When time is up, answer these in your AI collaboration log:
- Did it run first time?
- Set tone A to 1.0 amplitude. **Does the spike reach 1.0?** If you cannot
  tell from the chart, that is itself an answer.
- If a classmate asked "is this correct", could you show them why?

Now delete it: `git checkout -- .` and `rm -f pages/2_*.py`

## Round 2: the Four Gates (70 minutes)

Same app. Different route.

**Gate 1 — Intent (5 min).** Fill in `aidlc/intent.md` yourself. The agent
will not proceed until you do.

**Gate 2 — Spec (10 min).** Ask Cline to draft `aidlc/requirements.md`.
Read every line and fix what is wrong.

Now write, in your own words, how you would *check* that the spectrum your app
draws is correct. Write it down before reading on.

Then open `tests/test_spectrum.py`. Those tests were written for you — they are
the acceptance criteria your "customer" is handing over, and your app is
finished when they pass. Compare them to what you just wrote.

Most people write something like "the peaks should be in the right places".
The tests check that too — but they also check
`magnitudes[np.argmax(magnitudes)] == pytest.approx(1.0, abs=0.001)`, because
a spectrum can have every peak in exactly the right place and still be wrong
by a factor of five hundred. The gap between those two sentences is the whole
skill. Note it in your log.

Reply "approved" once `requirements.md` reflects what the tests actually
demand.

**Gate 3 — Plan (10 min).** Ask for `aidlc/design.md` and `aidlc/tasks.md`.
The maths belongs in `core/spectrum.py`; the screen belongs in
`pages/2_Spectrum_Analyzer.py`. Approve.

**Gate 4 — Build (40 min).** One task at a time. Your goal is simple: make
`pytest tests/test_spectrum.py` go green. After each task, run the tests and
look at the app. Commit every time the tests pass:

```
git add -A && git commit -m "what you just did"
```

**If a task is not working after 15 minutes, stop.** Do not keep prompting —
a long conversation makes the agent worse, not better. Restore the reference
version of whatever gate you are stuck at, read it, and carry on:

| Stuck at | Run this |
|---|---|
| Gate 2 | `git checkout origin/solution/lab1 -- aidlc/requirements.md` |
| Gate 3 | `git checkout origin/solution/lab1 -- aidlc/design.md aidlc/tasks.md` |
| Gate 4 task 1 | `git checkout origin/solution/lab1 -- core/spectrum.py` |
| Gate 4 task 2 | `git checkout origin/solution/lab1 -- pages/2_Spectrum_Analyzer.py` |

Those files are a reference run — one time the agent did the job well, saved so
you can pick it up rather than starting again. This is not cheating and it does
not cost you marks. Recognising a dead end and recovering from it is the skill
being assessed. Write down in your log what the agent was doing wrong and what
you tried.

**Gate 5 — Ship (15 min).** Push, then deploy at
https://share.streamlit.io — sign in with GitHub, pick your repository,
set the main file to `app.py`, click Deploy. Post your public URL.

## You are done when

- [ ] Two tones at 50 Hz and 120 Hz produce exactly two spikes, in those places
- [ ] A tone you set to amplitude 1.0 produces a spike that reaches 1.0
- [ ] `pytest` passes all seven tests
- [ ] Your app is live at a public URL

## If you finish early

- Add a third tone.
- Add random noise to the signal and watch a noise floor appear underneath the
  spikes. How much noise before you can no longer see the smaller tone?
- **Aliasing:** allow tone A above half the sampling rate. Set the sampling
  rate to 500 and tone A to 300 Hz. The spike appears at 200 Hz, not 300 —
  the frequency has "folded back". This is why sampling rate matters, and it
  is the single most important idea in digital signal processing.
- Export the spectrum as a CSV file.
```

- [ ] **Step 8: Commit**

```bash
git add template/labs/LAB1.md template/core/spectrum.py template/tests/test_spectrum.py template/pages/2_Spectrum_Analyzer.py
git commit -m "feat: add Lab 1 brief and spectrum analyser reference solution"
```

> **Note for Task 15:** `core/spectrum.py` and `pages/2_Spectrum_Analyzer.py`
> are the solution and must be removed from the published `main` branch, kept
> only on `solution/lab1`. `tests/test_spectrum.py` **stays on `main`** — it
> is the acceptance specification students are given, not an answer.

## Task 9A: Produce and certify the Lab 1 golden set

Everything in this plan rests on an untested assumption: that Cline driven by a
free-tier model can build Lab 1 from these prompts. This task replaces that
assumption with a measured pass rate, and produces the reference material
students fall back on when their own run goes wrong.

### The golden set has three parts

| Part | How produced | How fragile | Phase |
|---|---|---|---|
| **Build prompts** | **Authored** by us, then tuned against measurements | Fragile — needs the whole loop | A, C |
| **Golden artifacts** — `requirements.md`, `design.md`, `tasks.md` | **Captured** from a run that went well, then hand-polished | Varies every run; we freeze one good instance | C |
| **Explain prompts + reference app** | Authored; the app already exists from Task 9 | **Robust** — no file edits, small context | E |

The first two are the distinction that matters most. A **golden prompt** is a
script: we write it, and every student pastes identical words. A **golden
artifact** is a take: the agent composes it fresh each run and never the same
way twice, so we cannot author it — we run the lab, wait for a run whose
`requirements.md` is genuinely good, and save that actual file as the fallback.

The third part is the one that makes this task safe to time-box. See Phase E.

### Why gates are scored separately

Each gate consumes the previous gate's output, so failure compounds. A vague
`requirements.md` yields a confused `design.md`, which yields tasks that cannot
be built:

| Per-gate success | End-to-end across 4 gates |
|---|---|
| 95% | 81% |
| 90% | 66% |
| 85% | 52% |

At 85% per gate — optimistic for a free-tier model — half the class fails Lab 1,
and no amount of prompt polishing fixes that. **Per-gate recovery breaks the
multiplication**: a student restores one golden artifact and continues, so
damage is bounded to one gate instead of cascading.

That is why this task reports **two** numbers:

- **Unaided rate** — all four gates green with no intervention.
- **Assisted rate** — reaches a working, tested app when allowed to restore
  golden artifacts on failure. *This is the number that matters in a room of 60
  students with no teaching assistants.*

### Runs versus iterations

A **run** is one complete attempt at Lab 1, start to finish through all four
gates. It yields one data point. An **iteration** is one cycle of the
improvement loop: change something, measure, decide what to change next.

One run per iteration does not work, because the agent is non-deterministic —
you are estimating a probability, and one sample cannot estimate a probability.
If a gate's true rate is 70%, a single run reports success 70% of the time; if
the true rate is 30%, it still reports success 30% of the time. A lone "it
worked" is consistent with both, so you learn nothing you can act on.

Three runs also reveal *which* gate fails most often, which is what attribution
needs. With one run you see a single failure mode and may spend the next
iteration fixing a rare one.

**Three runs while iterating; five for the final measurement.** Three
distinguishes 0/3 from 3/3 but cannot separate 60% from 80% — fine for hunting
gross failures, not fine for the accept/reject decision.

### The five phases

| Phase | Budget | Purpose | Skipping it means |
|---|---|---|---|
| **A — Author** | Unbudgeted | Best-effort prompts, rules and harness | Phase C burns scarce quota on problems fixable for free |
| **B — Calibrate** | 1 run | Measure requests per run; compute the real budget | You budget on guesses, then discover runs cost 3× the assumption |
| **C — Improve** | **24 h** | Find and fix what you could not predict | You learn the real pass rate in Session 1, alongside your students |
| **D — Certify** | 2 hand-runs | Prove it in the environment students use | You certified the CLI; students use the extension |
| **E — Reference path** | ~2 h, **unconditional** | The fallback that cannot fail | A poor Phase C result leaves no fallback at all |

The ordering is forced. A before B, because there is no point measuring a draft
you know you will change. B before C, because the budget arithmetic depends on
the measurement. C before D, because hand-running 90-minute rehearsals on
materials still in flux wastes them. **E is independent of all of them**, which
is exactly what makes it the floor — write it during Phase C's dead time while
runs execute.

### What this eval proves, and what it does not

Phase C runs **inside a Codespace**, on the same container image students get,
which removes the entire "works on my machine" class of error. Two gaps remain
that no script can close:

| | Scripted eval | Real lab |
|---|---|---|
| Harness | Cline **CLI** | Cline **VS Code extension** |
| Approval | Separate scripted invocations | A human reads, then types "approved" |
| Between gates | Nothing | The student **edits** `requirements.md` before approving |

That third gap runs in your favour: a human-corrected spec is a *better* input
to Gate 3 than the raw one the script passes along, so Phase C probably
**understates** the real pass rate. Good direction to be wrong in — but
understating is not certifying. Phase D closes it.

**Expect this to possibly reverse the model choice.** Spec §4 picks Mistral for
token headroom, but headroom is worthless if the model cannot emit a
character-exact edit block. Cline's `replace_in_file` requires exactly that, and
malformed blocks cause documented retry loops that burn quota and produce
nothing.

**Files:**
- Create: `eval/README.md`, `eval/fixtures/intent.md`, `eval/prompts/01-gate2-spec.md`, `eval/prompts/02-gate3-plan.md`, `eval/prompts/03-gate4-maths.md`, `eval/prompts/04-gate4-page.md`
- Create: `eval/check_gate.py`, `eval/restore_golden.py`, `eval/run_lab1.sh`, `eval/score.py`
- Create (captured in Phase C): `eval/golden/lab1/{intent,requirements,design,tasks}.md`
- Create (generated, committed): `eval/REPORT.md`, `eval/results/`
- Create: `template/labs/PROMPTS.md`, `template/labs/EXPLAIN.md`
- Modify: `template/labs/LAB1.md` (Phase E closing activity), spec §4 if the winning model differs from Mistral, spec §6 Session 1 timings

**Interfaces:**
- Consumes: `template/` as built by Tasks 1–9. `template/tests/test_spectrum.py` is the scoring oracle *and* the interface contract — because it does `from core.spectrum import make_signal, peak_frequency, spectrum`, the agent physically cannot drift on module paths or function names.
- Depends on Task 15 having published the template at least once, so Phase B can open a Codespace on the students' actual container image.
- Produces: `eval/golden/lab1/` (published to `solution/lab1` by Task 15), `template/labs/PROMPTS.md`, `template/labs/EXPLAIN.md`, and `eval/REPORT.md`.

---

### Phase A — Author the materials and the harness (unbudgeted)

This is craft, not search: you are applying known principles, not exploring by
trial and error, so time-boxing it only produces worse craft. The economics also
favour spending here — **Phase A costs thinking time; Phase C costs quota**,
which is the scarce resource. Exhaust the cheap improvements before spending the
expensive ones.

The practical rule: do not enter Phase C with a first draft. Enter with your best
work, so the loop spends its budget on subtle failures you *could not* have
predicted rather than obvious ones you could have.

**Exit condition:** you cannot think of another improvement without data.

- [ ] **Step 1: Write the fixture and the four gate prompts**

`eval/fixtures/intent.md` — the Gate 1 artifact a student would write:
```markdown
# Gate 1 — Intent

**Who is this for?**
A second-year electronics student who has just met the Fourier transform and
wants to see what it actually does.

**What problem does it solve?**
Looking at a waveform on a screen tells you almost nothing about which
frequencies are inside it. Working that out by hand is not practical.

**What does "done" look like?**
I set two sine waves going, and immediately see both the combined waveform and
a chart showing exactly those two frequencies at exactly the amplitudes I
chose.

**What is deliberately NOT included?**
No loading of real audio or measurement files. No saving. No more than two
tones. No windowing options.
```

`eval/prompts/01-gate2-spec.md`:
```
Using the Four Gates in .clinerules: I have filled in aidlc/intent.md.
Read tests/test_spectrum.py first - those tests are the acceptance criteria.
Draft aidlc/requirements.md as a numbered table so every requirement matches
something those tests actually check. Then stop and wait for my approval.
Do not create any Python file yet.
```

`eval/prompts/02-gate3-plan.md`:
```
requirements.md is approved. Now draft aidlc/design.md and aidlc/tasks.md.
There are exactly two tasks. Task 1 owns core/spectrum.py and nothing else.
Task 2 owns pages/2_Spectrum_Analyzer.py and nothing else.
Then stop. Do not create any Python file yet.
```

`eval/prompts/03-gate4-maths.md`:
```
design.md and tasks.md are approved. Implement task 1 only.
Create core/spectrum.py with exactly these three functions:
  make_signal(components, fs, duration) -> (times, signal)
      components is a list of (frequency_hz, amplitude) pairs
  spectrum(signal, fs) -> (freqs, magnitudes)
  peak_frequency(freqs, magnitudes) -> float
Write the whole file in one go rather than editing it repeatedly.
Every test in tests/test_spectrum.py must pass.
Run pytest tests/test_spectrum.py and report exactly what it printed.
```

`eval/prompts/04-gate4-page.md`:
```
Task 1 is done. Implement task 2 only. Create pages/2_Spectrum_Analyzer.py:
a Streamlit page with number inputs for two tones, each with a frequency in
hertz and an amplitude, plus a sampling rate. Import make_signal, spectrum and
peak_frequency from core.spectrum. Show the strongest frequency, then two
charts: the combined waveform against time, and the amplitude of each
frequency present. Write the whole file in one go.
Do not modify core/spectrum.py.
```

Four design choices in those prompts, each earning its place:

1. **Each prompt is a separate `cline` invocation**, so every gate is a fresh
   task. This mirrors the "start a new task per feature" rule the workshop
   teaches, and keeps context small — the documented mitigation for Cline's
   edit failures. State lives on disk in `aidlc/*.md`, not in the conversation.
2. **"Write the whole file in one go"** sidesteps `replace_in_file` entirely for
   new files. Whole-file writes cannot suffer a character-exact match failure.
3. **Exact signatures are stated** even though the tests already enforce them.
   Belt and braces: it removes a naming decision the agent would otherwise make.
4. **"Do not create any Python file yet"** is stated explicitly at Gates 2 and 3
   even though `.clinerules` says so. If the agent still writes code, that is a
   `.clinerules` failure and Round 3 will attribute it correctly.

---

- [ ] **Step 2: Write the per-gate checker**

End-to-end pass/fail tells you *that* a run broke, not *where*. This tells you
where.

`eval/check_gate.py`:
```python
"""Check whether one gate produced what it should have.

Usage: python check_gate.py <workdir> <gate-number>
Prints one JSON object: {"gate": N, "passed": bool, "problems": [...]}
"""

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

SPECTRUM = Path("core/spectrum.py")
STAMP = ".gate4a-hash"


def premature_code(work: Path) -> list[str]:
    """Solution files that exist before the gate allowing them."""
    found = []
    if (work / SPECTRUM).exists():
        found.append(str(SPECTRUM))
    found += [str(p.relative_to(work)) for p in work.glob("pages/[2-9]_*.py")]
    return found


def gate2(work: Path) -> list[str]:
    """Spec drafted. No code yet."""
    problems = []
    requirements = work / "aidlc" / "requirements.md"
    if not requirements.exists():
        return ["aidlc/requirements.md was not created"]
    text = requirements.read_text(encoding="utf-8", errors="replace")
    numbered = re.findall(r"^\s*\|?\s*(\d+)\s*[|.)]", text, re.M)
    if len(numbered) < 3:
        problems.append(f"only {len(numbered)} numbered requirements, expected 3 or more")
    if "amplitude" not in text.lower():
        problems.append("no mention of amplitude - the key acceptance criterion is missing")
    if "PLACEHOLDER" in text:
        problems.append("placeholder text was left in")
    if leaked := premature_code(work):
        problems.append(f"code written before the spec was approved: {leaked}")
    return problems


def gate3(work: Path) -> list[str]:
    """Design and task list drafted, one file per task. Still no code."""
    problems = []
    for name in ("design.md", "tasks.md"):
        if not (work / "aidlc" / name).exists():
            problems.append(f"aidlc/{name} was not created")
    tasks = work / "aidlc" / "tasks.md"
    if tasks.exists():
        text = tasks.read_text(encoding="utf-8", errors="replace")
        files = re.findall(r"[`\s|]([\w/]+\.py)", text)
        unique = sorted(set(files))
        if len(files) != len(unique):
            problems.append(f"a file is claimed by more than one task: {files}")
        if len(unique) < 2:
            problems.append(f"expected 2 owned files, found {unique}")
    if leaked := premature_code(work):
        problems.append(f"code written before the plan was approved: {leaked}")
    return problems


def gate4a(work: Path) -> list[str]:
    """The maths module exists and every test passes."""
    if not (work / SPECTRUM).exists():
        return ["core/spectrum.py was not created"]
    result = subprocess.run(
        [str(work / ".venv/bin/python"), "-m", "pytest", "tests/test_spectrum.py", "-q"],
        cwd=work, capture_output=True, text=True, timeout=180,
    )
    match = re.search(r"(\d+) passed", result.stdout)
    passed = int(match.group(1)) if match else 0
    # Record the file's fingerprint so gate 4b can prove it was left alone.
    (work / STAMP).write_text(
        hashlib.sha256((work / SPECTRUM).read_bytes()).hexdigest(), encoding="utf-8"
    )
    return [] if passed == 7 else [f"{passed}/7 tests pass"]


def gate4b(work: Path) -> list[str]:
    """The page exists, parses, uses the module, and did not edit it."""
    problems = []
    pages = sorted(work.glob("pages/[2-9]_*.py"))
    if not pages:
        return ["no new page was created in pages/"]
    text = pages[0].read_text(encoding="utf-8", errors="replace")
    try:
        compile(text, str(pages[0]), "exec")
    except SyntaxError as error:
        problems.append(f"page does not parse: {error}")
    if "core.spectrum" not in text:
        problems.append("page does not import from core.spectrum")
    stamp = work / STAMP
    if stamp.exists() and (work / SPECTRUM).exists():
        current = hashlib.sha256((work / SPECTRUM).read_bytes()).hexdigest()
        if current != stamp.read_text().strip():
            problems.append("core/spectrum.py was modified while building the page")
    return problems


CHECKS = {1: gate2, 2: gate3, 3: gate4a, 4: gate4b}


def main() -> None:
    work, gate = Path(sys.argv[1]), int(sys.argv[2])
    try:
        problems = CHECKS[gate](work)
    except Exception as error:  # a crashed check is a failed gate, not a crashed eval
        problems = [f"checker raised {type(error).__name__}: {error}"]
    print(json.dumps({"gate": gate, "passed": not problems, "problems": problems}))


if __name__ == "__main__":
    main()
```

- [ ] **Step 3: Write the golden restorer**

`eval/restore_golden.py`:
```python
"""Put a gate's golden artifacts into a working copy.

Usage: python restore_golden.py <workdir> <gate-number> <golden-dir>

This is exactly what a stuck student does with `git checkout`, so running the
eval in assisted mode measures the recovery path they will actually take.
"""

import shutil
import sys
from pathlib import Path

BY_GATE = {
    1: ["requirements.md"],
    2: ["design.md", "tasks.md"],
    3: [],  # code, not an aidlc artifact - restored from the solution branch
    4: [],
}


def main() -> None:
    work, gate, golden = Path(sys.argv[1]), int(sys.argv[2]), Path(sys.argv[3])
    for name in BY_GATE.get(gate, []):
        source = golden / name
        if source.exists():
            shutil.copy(source, work / "aidlc" / name)
            print(f"    restored aidlc/{name}")
    if gate == 3:
        source = golden.parent.parent.parent / "template" / "core" / "spectrum.py"
        if source.exists():
            shutil.copy(source, work / "core" / "spectrum.py")
            print("    restored core/spectrum.py")


if __name__ == "__main__":
    main()
```

- [ ] **Step 4: Write the runner**

`eval/run_lab1.sh`:
```bash
#!/usr/bin/env bash
# Run Lab 1 end to end for one model, scoring each gate as it goes.
# Usage: ./eval/run_lab1.sh <provider> <model> [runs] [strict|assisted]
#   strict   - no help; measures the unaided rate
#   assisted - restore golden artifacts after any failed gate; measures the
#              rate students will actually see, since they can do the same
set -euo pipefail

PROVIDER="$1"
MODEL="$2"
RUNS="${3:-5}"
MODE="${4:-strict}"
ROOT="$(git rev-parse --show-toplevel)"
TAG="${PROVIDER}-${MODEL//\//_}-${MODE}"
GOLDEN="$ROOT/eval/golden/lab1"
mkdir -p "$ROOT/eval/results"

for i in $(seq 1 "$RUNS"); do
  WORK="$(mktemp -d)"
  cp -R "$ROOT/template/." "$WORK/"
  # The agent must build these two. The tests stay.
  rm -f "$WORK/core/spectrum.py" "$WORK/pages/2_Spectrum_Analyzer.py"
  cp "$ROOT/eval/fixtures/intent.md" "$WORK/aidlc/intent.md"

  python3 -m venv "$WORK/.venv"
  "$WORK/.venv/bin/pip" -q install -r "$WORK/requirements.txt"

  LOG="$ROOT/eval/results/${TAG}-run${i}.jsonl"
  GATES="$ROOT/eval/results/${TAG}-run${i}.gates"
  : > "$LOG"
  : > "$GATES"
  START=$(date +%s)

  GATE=0
  for prompt in "$ROOT"/eval/prompts/*.md; do
    GATE=$((GATE + 1))
    echo "  [run $i] gate $GATE: $(basename "$prompt")"
    cline --json --auto-approve true -P "$PROVIDER" -m "$MODEL" -c "$WORK" \
      "$(cat "$prompt")" >> "$LOG" 2>&1 || echo "    (cline exited non-zero)"

    RESULT="$(python3 "$ROOT/eval/check_gate.py" "$WORK" "$GATE")"
    echo "$RESULT" >> "$GATES"
    echo "    $RESULT"

    if [ "$MODE" = "assisted" ] && ! echo "$RESULT" | grep -q '"passed": true'; then
      python3 "$ROOT/eval/restore_golden.py" "$WORK" "$GATE" "$GOLDEN"
    fi
  done

  echo "$(( $(date +%s) - START ))" > "$ROOT/eval/results/${TAG}-run${i}.seconds"
  ( cd "$WORK" && .venv/bin/python -m pytest tests/test_spectrum.py -q ) \
    > "$ROOT/eval/results/${TAG}-run${i}.pytest" 2>&1 || true
  echo "run $i: $(tail -1 "$ROOT/eval/results/${TAG}-run${i}.pytest")"

  # Keep the artifacts of green runs - Round 5 captures golden from these.
  if grep -q "7 passed" "$ROOT/eval/results/${TAG}-run${i}.pytest"; then
    mkdir -p "$ROOT/eval/results/${TAG}-run${i}-artifacts"
    cp "$WORK"/aidlc/*.md "$ROOT/eval/results/${TAG}-run${i}-artifacts/"
  fi
  rm -rf "$WORK"
done
```

- [ ] **Step 5: Write the scorer**

`eval/score.py`:
```python
"""Aggregate eval runs into a per-gate table and two headline rates."""

import json
import re
import statistics
from collections import Counter
from pathlib import Path

RESULTS = Path(__file__).parent / "results"
TOTAL_TESTS = 7
REQUEST_SUBTYPE = "api_req_started"  # confirmed in Round 0; change if different
GATE_NAMES = {1: "Gate 2 spec", 2: "Gate 3 plan", 3: "Gate 4 maths", 4: "Gate 4 page"}


def read_run(log: Path) -> dict:
    stem = log.stem
    subtypes: Counter = Counter()
    for line in log.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            message = json.loads(line)
        except json.JSONDecodeError:
            continue
        if key := (message.get("say") or message.get("ask")):
            subtypes[key] += 1

    gates = {}
    problems = []
    gates_file = RESULTS / f"{stem}.gates"
    if gates_file.exists():
        for line in gates_file.read_text(encoding="utf-8").splitlines():
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            gates[record["gate"]] = record["passed"]
            problems += record["problems"]

    report_path = RESULTS / f"{stem}.pytest"
    report = report_path.read_text(encoding="utf-8") if report_path.exists() else ""
    passed = int(match.group(1)) if (match := re.search(r"(\d+) passed", report)) else 0

    seconds_path = RESULTS / f"{stem}.seconds"
    seconds = int(seconds_path.read_text().strip()) if seconds_path.exists() else 0

    return {
        "model": stem.rsplit("-run", 1)[0],
        "gates": gates,
        "red_gates": sum(1 for ok in gates.values() if not ok),
        "green": passed == TOTAL_TESTS,
        "requests": subtypes.get(REQUEST_SUBTYPE, 0),
        "seconds": seconds,
        "problems": problems,
        "subtypes": subtypes,
    }


def main() -> None:
    runs = [read_run(log) for log in sorted(RESULTS.glob("*.jsonl"))]
    if not runs:
        print("No results found. Run eval/run_lab1.sh first.")
        return

    by_model: dict[str, list[dict]] = {}
    for run in runs:
        by_model.setdefault(run["model"], []).append(run)

    print("## Headline rates\n")
    print("| Model | Unaided (all gates green) | Working app | Median requests | Median minutes |")
    print("|---|---|---|---|---|")
    for model, group in sorted(by_model.items()):
        unaided = sum(1 for r in group if r["red_gates"] == 0)
        working = sum(1 for r in group if r["green"])
        n = len(group)
        print(
            f"| {model} | {unaided}/{n} ({unaided / n:.0%}) | {working}/{n} ({working / n:.0%}) "
            f"| {statistics.median(r['requests'] for r in group):.0f} "
            f"| {statistics.median(r['seconds'] for r in group) / 60:.1f} |"
        )

    print("\n## Where runs broke\n")
    print("| Model | " + " | ".join(GATE_NAMES.values()) + " |")
    print("|---|" + "---|" * len(GATE_NAMES))
    for model, group in sorted(by_model.items()):
        cells = []
        for gate in GATE_NAMES:
            ok = sum(1 for r in group if r["gates"].get(gate))
            cells.append(f"{ok}/{len(group)}")
        print(f"| {model} | " + " | ".join(cells) + " |")

    print("\n## Problems reported, most common first\n")
    tally = Counter(
        re.sub(r"\[.*?\]|\d+", "N", problem) for run in runs for problem in run["problems"]
    )
    for problem, count in tally.most_common(20):
        print(f"- ({count}x) {problem}")

    print("\n## Message subtypes seen (sanity check for REQUEST_SUBTYPE)\n")
    combined: Counter = Counter()
    for run in runs:
        combined.update(run["subtypes"])
    for name, count in combined.most_common(15):
        print(f"- `{name}`: {count}")


if __name__ == "__main__":
    main()
```


---

### Phase B — Calibrate (one run)

One unmeasured number governs the entire budget: requests per run. This plan has
been assuming roughly 60. If it is actually 150, then Gemini's 250-per-day
ceiling allows **one** run per day rather than four, three runs no longer fit in
a day, and the iteration structure has to change. Find that out now, not
halfway through an overnight loop.

This phase is **diagnostic, never evaluative**. N=1 says nothing about pass rate
— a single success is equally consistent with a 70% prompt and a 30% one.
Resisting the urge to draw conclusions from it is the discipline.

- [ ] **Step 6: Set up the eval inside a Codespace and probe the CLI**

Run the eval on the container students actually get, not on your laptop. This
removes the entire "works on my machine" class of error — same image, same
Python, same network path.

Open a Codespace on the **published template** (Task 15 must have run at least
once), then bring the eval scripts in alongside it:

```bash
# inside the Codespace terminal
gh repo clone witchapong/ai-for-software-dev ~/curriculum
cd ~/curriculum
npm i -g cline
cline --version
cline --help > eval/cli-help.txt
cline config --help >> eval/cli-help.txt 2>&1 || true
```

Then run one throwaway task with JSON output and inspect the message subtypes,
because the scorer counts model requests by subtype:

```bash
mkdir -p /tmp/cline-probe && cd /tmp/cline-probe
cline --json --auto-approve true "create a file hello.txt containing the word hello" \
  | tee /tmp/probe.jsonl
python3 -c "
import json, collections
c = collections.Counter()
for line in open('/tmp/probe.jsonl'):
    try: m = json.loads(line)
    except Exception: continue
    k = m.get('say') or m.get('ask')
    if k: c[k] += 1
print(c.most_common())
"
```

Record in `eval/README.md`: the exact provider identifier strings (for example
`gemini`, `mistral`) and the subtype marking one model request. If that subtype
is not `api_req_started`, update `REQUEST_SUBTYPE` in `eval/score.py`.

This step is also a smoke test. If the CLI cannot authenticate, Node is missing,
or `check_gate.py` crashes on real output, you learn it in twelve minutes.

- [ ] **Step 7: Run once, measure, and compute the real budget**

```bash
chmod +x eval/run_lab1.sh
./eval/run_lab1.sh <provider> <model> 1 strict
python3 eval/score.py
```

Take the measured requests-per-run figure and fill in this table for **both**
candidate models before going further:

| | Measured requests/run | Daily free ceiling | Runs affordable per day | Iterations in 24 h |
|---|---|---|---|---|
| Gemini 2.5 Flash | ? | 250 RPD | ? | ? |
| Mistral Experiment | ? | ~1B tokens/month, no daily cap | clock-limited | ? |

At the estimated ~60 requests per run this comes out as **4 runs/day on Gemini
(about one iteration) versus 6–8 iterations/day on Mistral**, which is why
Phase C tunes on the daily-unconstrained model and Phase D verifies the frozen
result on the other. If your measurement differs materially from 60, redo this
arithmetic before starting the clock.

**The disqualifying result:** if a single Lab 1 run does not fit inside one day's
free quota for a model, that model cannot run the workshop — exactly as
Antigravity was ruled out in spec §4.

---

### Phase C — Improve (24-hour budget)

Find and fix the failures Phase A could not predict.

**The cycle**, repeated until an exit condition fires:

1. Run 3 times
2. Score each gate separately
3. Attribute the *most common* failure to its cause
4. Change **one** thing
5. Commit the current best prompt set
6. Repeat

Changing one thing at a time is not fastidiousness — it is what makes
attribution possible. Change three and an improvement tells you nothing about
which caused it, so you cannot build on it. Committing every iteration gives the
loop its anytime property: there is always a valid, shippable prompt set on
disk, and you are never mid-flight with nothing.

**Three exit conditions:**

| Exit | What to do |
|---|---|
| Every gate ≥80% across 3 runs | Confirm with 5 runs, then freeze. **Stop early — do not spend budget you do not need.** |
| 24 hours elapsed | Ship the best-scoring set and lean harder on Phase E |
| **Two consecutive iterations with no improvement** | **Plateau.** More iterations will not help — the constraint is the model or the lab's size, not your wording. Stop and change one of those. |

The third condition prevents the most expensive mistake available: grinding
through twenty rewordings against a model that simply cannot do the task.

- [ ] **Step 8: Run one iteration**

```bash
rm -rf eval/results/*          # results from a previous prompt set are not comparable
./eval/run_lab1.sh <provider> <model> 3 strict
python3 eval/score.py
```

- [ ] **Step 9: Attribute the most common failure**

For each red gate, read that run's `.jsonl` log and assign a cause. The fix
differs entirely by cause, so this is where most of the value sits.

| Symptom | Cause | Fix |
|---|---|---|
| Wrote code at Gate 2 or 3 | `.clinerules` too weak | Strengthen the rules file — **not** the prompt |
| Requirements do not match the tests | Prompt | Make "read the tests first" more emphatic |
| "Diff Edit Failed" retry loops | File too large, or session too long | Insist on whole-file writes; split the file |
| Stalled asking a clarifying question | Prompt underspecified | Pre-answer the question in the prompt |
| Renamed a function, tests cannot import | Prompt | State the exact signature (already done — check it survived) |
| Invented a dependency | `.clinerules` | Restate the closed dependency list |
| Ran out of quota mid-run | Model | Different model, or shrink the lab |

Record the tally in `eval/README.md`. A cause appearing in more than a third of
red gates is the one to fix first.

- [ ] **Step 10: Change one thing, then loop back to Step 8**

Log each iteration in `eval/README.md` as one line: what you changed, and the
per-gate scores before and after. That log is what tells you a plateau has been
reached — without it, iteration six feels like progress when it is noise.

```bash
git add eval/prompts/ template/.clinerules eval/README.md
git commit -m "eval: iteration N - <what changed>"
```

Repeat Steps 8–10 until an exit condition fires.


#### Freeze and capture (end of Phase C)

- [ ] **Step 11: Capture the best run's artifacts**

Green runs saved their `aidlc/*.md` into `eval/results/<tag>-run<N>-artifacts/`.
Read them all and pick the best `requirements.md`, `design.md` and `tasks.md`.
They need not come from the same run.

```bash
mkdir -p eval/golden/lab1
cp eval/fixtures/intent.md eval/golden/lab1/intent.md
cp eval/results/<best-tag>-run<N>-artifacts/requirements.md eval/golden/lab1/
cp eval/results/<best-tag>-run<N>-artifacts/design.md eval/golden/lab1/
cp eval/results/<best-tag>-run<N>-artifacts/tasks.md eval/golden/lab1/
```

Then hand-polish. The captured file is a starting point, not a deliverable.
Check every one of these:

- Every requirement maps to something `tests/test_spectrum.py` actually checks.
- The amplitude criterion is present and stated numerically, not as "correct".
- `tasks.md` names exactly two tasks, one file each, with an owner column.
- No placeholder text, no invented scope, no dependency outside `requirements.txt`.
- A student who reads it learns the *shape* of a good spec, since this file
  doubles as the Session 2 worked example.

- [ ] **Step 12: Verify the golden set is self-consistent**

```bash
python3 - <<'PY'
import re, pathlib
golden = pathlib.Path("eval/golden/lab1")
tasks = (golden / "tasks.md").read_text()
files = sorted(set(re.findall(r"[`\s|]([\w/]+\.py)", tasks)))
assert files == ["core/spectrum.py", "pages/2_Spectrum_Analyzer.py"], files
requirements = (golden / "requirements.md").read_text().lower()
assert "amplitude" in requirements, "amplitude criterion missing"
assert "PLACEHOLDER" not in (golden / "requirements.md").read_text()
print("golden set is consistent:", files)
PY
```

- [ ] **Step 13: Write the student prompt library**

Create `template/labs/PROMPTS.md` with the four gate prompts **as finally worded
at the end of Phase C** — if the loop changed them, this file gets the changed
version and `eval/prompts/` matches, so the two never drift.

```markdown
# Prompts that work

Copy these. They are not suggestions — each was run repeatedly against the model
you are using, and these are the exact wordings that worked most often.

Improvise later, once you have seen what good looks like. On day one, use these.

## Gate 2 — ask for the spec
...
## Gate 3 — ask for the plan
...
## Gate 4, task 1 — the maths
...
## Gate 4, task 2 — the screen
...

## If a gate goes wrong

Do not keep prompting a confused agent. Restore the reference version of that
gate and carry on - it costs you nothing:

| Stuck at | Run this |
|---|---|
| Gate 2 | `git checkout origin/solution/lab1 -- aidlc/requirements.md` |
| Gate 3 | `git checkout origin/solution/lab1 -- aidlc/design.md aidlc/tasks.md` |
| Gate 4 task 1 | `git checkout origin/solution/lab1 -- core/spectrum.py` |
| Gate 4 task 2 | `git checkout origin/solution/lab1 -- pages/2_Spectrum_Analyzer.py` |
```

---

### Phase D — Certify on the real stack (2 hand-runs)

Phase C measured prompts and model inside the right container. It did not test
the interface students use, nor the human in the loop. This phase does.

- [ ] **Step 14: Measure the assisted rate**

```bash
rm -rf eval/results/*
./eval/run_lab1.sh <winning-provider> <winning-model> 5 assisted
python3 eval/score.py
```

Assisted mode restores a golden artifact whenever a gate fails and then
continues — exactly what a stuck student does with `git checkout`. **This is the
classroom-relevant number**, because per-gate recovery is what stops failure
compounding across four gates.

- [ ] **Step 15: Rehearse twice, by hand, in a real Codespace**

Open a Codespace on the published template with the **VS Code extension**, and
run Lab 1 as a student would: paste each prompt, read what comes back, correct
`requirements.md` by hand, type "approved", continue. Twice.

Two runs is enough because this checks for *categorical* breakage — "the
extension ignores `.clinerules`" — not for a rate. You already have the rate
from Phase C.

Record:

| Field | Why |
|---|---|
| Wall-clock to each gate | **The only trustworthy timings.** Phase C's clock is meaningless for session planning — the script never reads, thinks, or types. Check against the 70-minute Lab 1 budget in spec §6. |
| Whether the extension behaves as the CLI did | Phase C assumed it does. Verify. |
| Anything the script could not see | Approval wording, UI confusion, quota warnings mid-task |

If the extension diverges materially, say so in `eval/REPORT.md` — it means
future evals need re-validating against the extension, not merely re-running.

- [ ] **Step 16: Write the report and choose the model**

```bash
python3 eval/score.py > eval/REPORT.md
```

Then add beneath the generated tables:

1. **Chosen primary and backup model**, with the rates that justified it.
2. **Failure taxonomy** from Step 9, with counts.
3. **Measured requests for one Lab 1 run**, superseding the 100–200 estimate in spec §4.
4. **Iteration log** — what changed each cycle and what it bought.
5. **Rehearsal notes** from Step 15, including real timings.
6. **Go / no-go**: does the winning model reach 80% *assisted*?

A no-go here is survivable rather than fatal, because Phase E ships regardless.
State plainly in the report which of the three responses you are taking: shrink
Lab 1, add scaffolding, or accept the lower rate and lean on the reference path.

- [ ] **Step 17: Update the spec if the evidence disagrees with it**

If the winner is not Mistral, edit spec §4's tooling table and quota analysis to
match, and note that the change came from `eval/REPORT.md` rather than from
reasoning.

---

### Phase E — The reference path (fixed, unconditional)

**This phase runs regardless of how Phases B–D went.** It is the floor: if
Phase C plateaus at 40%, Lab 1 degrades to "attempt it, then study the reference
with the agent" — still a good lab. Without it, a poor result leaves the session
with no fallback and forces a redesign under time pressure.

Three properties make this the sturdiest component in the workshop:

- **It cannot hit the failure mode that threatens everything else.** Explaining
  edits no files, so Cline's character-exact `replace_in_file` matching is never
  invoked. Small context, few requests, tolerant of weak models.
- **It teaches the most common real use of these tools.** Reading unfamiliar
  code with an AI explaining it is what people actually do at work — more than
  greenfield generation.
- **It rescues the assessment.** A student who never got a working app can still
  write a substantive AI collaboration log entry.

Phase C has substantial dead time while runs execute. Write this during it.

- [ ] **Step 18: Write the explain prompts**

`template/labs/EXPLAIN.md`:
```markdown
# Understanding code you did not write

Reading unfamiliar code with an AI explaining it is the single most common way
working developers use these tools. It is also the fastest way to learn from a
solution that is better than yours.

First, bring the reference version into your project:

```
git checkout origin/solution/lab1 -- core/spectrum.py pages/2_Spectrum_Analyzer.py
```

Then work through these with Cline. **None of them change any code**, so none of
them can break your project.

## Understand it

> Explain what core/spectrum.py does, function by function, to someone who has
> done one Python course. Do not change any code.

> Walk me through what happens, step by step, when I enter 50 Hz at amplitude
> 1.0 and press the button. Name each function in the order it runs.

## Interrogate the tricky part

> Why is there a `2/n` in the spectrum function? What would the chart look like
> without it?

> Which line treats the 0 Hz term differently from the others, and what breaks
> if I delete it?

## Prove it to yourself

> Change the `2/n` to `1/n`, run pytest, and show me exactly which tests fail
> and why. Then change it back.

Do this one. Watching two tests fail — while the test that checks *where* the
peaks are stays green — is the entire lesson of this lab in thirty seconds.

## If you got your own version working

> Compare my core/spectrum.py to the reference version. What did each do
> differently? Does either have a bug the tests would not catch?

There is rarely one right answer. Finding out how else it could have been done
is worth as much as getting it working.
```

- [ ] **Step 19: Add the closing activity to the lab brief**

Everyone does this, not only students who got stuck. It levels the room before
Session 2, gives successful students a second solution to compare against, and
ensures every student has AI collaboration log material.

Add to the end of `template/labs/LAB1.md`, before "If you finish early":

```markdown
## Part 3 — Understand the reference (everyone, 15 minutes)

Whether or not your own version worked, finish by studying the reference
implementation with your agent. Follow `labs/EXPLAIN.md`.

If your app works: compare it to the reference and find one thing each version
does better.

If it does not: this is where you get the content. Understanding code you did
not write, with an AI explaining it, is a real skill and the most common way
these tools get used at work.

Either way, put one thing you learned here into your AI collaboration log.
```

- [ ] **Step 20: Spot-check the explain prompts and adjust Session 1 timings**

Run each explain prompt once against the winning model. They need no tuning loop
— no edits, small context — but confirm the model does not refuse, wander, or
silently modify a file. If the mutation prompt ("change `2/n` to `1/n`") leaves
the file changed, add an explicit "then change it back and confirm the tests
pass again" clause.

Then update spec §6's Session 1 table, which is currently full at 180 minutes.
Making room for Part 3 costs ten minutes:

| Block | Was | Now |
|---|---|---|
| Deploy to Streamlit Cloud | 15 | **10** |
| Debrief | 10 | — |
| **Study the reference + debrief** | — | **15** |

Deploying takes five to eight minutes once a student has done it; fifteen was
padding. The debrief folds into Part 3, which is a better debrief anyway because
everyone has just looked at the same code.

- [ ] **Step 21: Commit**

```bash
git add eval/ template/labs/ docs/superpowers/specs/
git commit -m "test: produce and certify the Lab 1 golden set"
```

---

## Task 10: The five project briefs and the Lab 2 runbook

**Files:**
- Create: `template/briefs/1-equipment-booking.md`, `template/briefs/2-inventory-bom.md`, `template/briefs/3-energy-tracker.md`, `template/briefs/4-project-matcher.md`, `template/briefs/5-solar-sizing.md`, `template/briefs/README.md`, `template/labs/LAB2.md`

**Interfaces:**
- Consumes: the `aidlc/` templates from Task 7
- Produces: the project options and the parallel-work protocol used in Session 2

- [ ] **Step 1: Write `template/briefs/README.md`**

```markdown
# Project briefs

Pick one. Each has been checked to fit the template, the time you have, and
the free tools we are using.

| # | Project | In one sentence |
|---|---|---|
| 1 | Lab Equipment Booking | Book benches and instruments so two people never turn up for the same oscilloscope |
| 2 | Component Inventory and BOM Helper | Track what parts are in stock and check whether a project can be built from them |
| 3 | Energy Usage and Tariff Tracker | Log appliance usage, work out the monthly bill, compare tariffs |
| 4 | Capstone Project Matcher | Post project ideas and find teammates with the skills you need |
| 5 | Solar Panel Sizing Service | Enter a site and a load, get a panel and battery recommendation you can save |

**Want to build your own idea?** Allowed, with one condition: get the
instructor to confirm it fits the template — pages, a data shape, saved
records, and optionally one AI feature. If your idea does not fit that shape,
it will not finish in the time available.

Every brief has an "AI feature" section. That is what you build in Session 3.
It is a bonus, not a requirement — a working project without it beats a
broken project with it.
```

- [ ] **Step 2: Write `template/briefs/1-equipment-booking.md`**

```markdown
# Brief 1 — Lab Equipment Booking

## The situation

The teaching lab has a handful of oscilloscopes, signal generators and power
supplies. Students turn up and find the one they need already in use. There
is a paper sign-up sheet that nobody can see until they walk to the lab.

## What you are building

A web app where a student can see what is free and book it for a time slot.

## Suggested pages (one per person)

| Page | What happens here |
|---|---|
| Browse equipment | A list of instruments and whether each is free right now |
| Make a booking | Pick an instrument, a date and a time slot, confirm |
| My bookings | See and cancel your own bookings |
| Admin | Add or remove instruments |

## Suggested data

One row per booking: `id`, `equipment_name`, `student_name`, `date`,
`start_time`, `end_time`.
One row per instrument: `id`, `name`, `location`, `notes`.

## The hard part (this is the interesting bit)

Two people must not be able to book the same instrument for overlapping
times. Write that as an acceptance criterion at Gate 2 and a test at Gate 4.

## AI feature for Session 3

Let a student type "I need a scope on Friday afternoon for two hours" and
turn that sentence into a filled-in booking form they confirm.
```

- [ ] **Step 3: Write `template/briefs/2-inventory-bom.md`**

```markdown
# Brief 2 — Component Inventory and BOM Helper

## The situation

A student society keeps a drawer of components. Nobody knows what is in it.
People buy parts that are already in the drawer, and start projects that
cannot be finished because one part is missing.

## What you are building

A web app that tracks stock and checks whether a project's parts list — its
bill of materials, or BOM — can be built from what is on hand.

## Suggested pages (one per person)

| Page | What happens here |
|---|---|
| Stock | Every part, how many there are, where it lives |
| Add or remove stock | Record parts arriving or being taken |
| Build check | Paste a parts list, see what is missing |
| Shortages | Everything below its minimum quantity |

## Suggested data

One row per part: `id`, `part_number`, `description`, `quantity`,
`minimum_quantity`, `location`.

## The hard part

Quantities must never go negative, and taking the last of something must show
up on the shortages page immediately.

## AI feature for Session 3

Let a user paste a messy parts list copied from a datasheet or a forum post,
and turn it into a clean table of part numbers and quantities.
```

- [ ] **Step 4: Write `template/briefs/3-energy-tracker.md`**

```markdown
# Brief 3 — Energy Usage and Tariff Tracker

## The situation

A household has no idea which appliances dominate the electricity bill, or
whether a different tariff would be cheaper.

## What you are building

A web app to log appliance usage, work out energy in kilowatt-hours and cost,
and compare tariffs side by side.

## Suggested pages (one per person)

| Page | What happens here |
|---|---|
| Appliances | Add appliances with their power rating in watts |
| Log usage | Record hours used on a date |
| Bill | Total kilowatt-hours and cost for a month |
| Compare tariffs | The same usage priced under two different tariffs |

## Suggested data

One row per appliance: `id`, `name`, `watts`.
One row per usage entry: `id`, `appliance_id`, `date`, `hours`.
One row per tariff: `id`, `name`, `cost_per_kwh`, `standing_charge`.

## The hard part

Kilowatt-hours equal watts times hours divided by 1000. Write a test for that
conversion — it is the number everything else depends on.

## AI feature for Session 3

Give the model the user's actual logged usage and ask for three specific
suggestions to cut the bill, each naming a real appliance from their data.
```

- [ ] **Step 5: Write `template/briefs/4-project-matcher.md`**

```markdown
# Brief 4 — Capstone Project Matcher

## The situation

Final-year students need project teammates. Right now this happens through
whoever you already know, so good ideas die for lack of a teammate who can do
the firmware.

## What you are building

A web app where students post project ideas and find teammates whose skills
fit.

## Suggested pages (one per person)

| Page | What happens here |
|---|---|
| Post an idea | Title, description, skills needed |
| Browse ideas | All open ideas, filterable by skill |
| My profile | Your name, your skills, what you are looking for |
| Matches | Ideas that need a skill you have |

## Suggested data

One row per student: `id`, `name`, `skills`, `looking_for`.
One row per idea: `id`, `title`, `description`, `skills_needed`, `posted_by`.

## The hard part

Skills are free text, so "PCB design", "pcb", and "PCB layout" must be
treated as the same thing. Decide how, and write a test for it.

## AI feature for Session 3

Read a student's free-text description of themselves and pull out a clean
list of skills, then explain in one sentence why a given idea matches them.
```

- [ ] **Step 6: Write `template/briefs/5-solar-sizing.md`**

```markdown
# Brief 5 — Solar Panel Sizing Service

## The situation

A homeowner wants solar panels but every quote assumes they already know how
many kilowatts they need.

## What you are building

A web app that takes a location, a rough daily electricity use and a budget,
and recommends a panel and battery size, saving each quote.

## Suggested pages (one per person)

| Page | What happens here |
|---|---|
| New estimate | Enter location, daily usage, budget |
| Recommendation | Suggested panel kilowatts, battery kilowatt-hours, reasoning |
| Saved quotes | Every estimate made so far |
| Assumptions | The sun-hours and prices used, editable |

## Suggested data

One row per quote: `id`, `location`, `daily_kwh`, `budget`, `panel_kw`,
`battery_kwh`, `created`.
One row per location: `name`, `peak_sun_hours`.

## The hard part

Panel size in kilowatts is roughly daily kilowatt-hours divided by peak sun
hours, divided by a system efficiency factor. Pick your factor, write it
down in `design.md`, and test the calculation.

## AI feature for Session 3

Explain the recommendation in plain language to someone with no electrical
background, and answer follow-up questions using a sizing guide document you
provide.
```

- [ ] **Step 7: Write `template/labs/LAB2.md`**

```markdown
# Lab 2 — Design and build a product as a team

Your team is 3 to 4 people. What you build today is your group project — you
will keep working on it during the week and demo it in Session 3.

## Before you start (10 minutes)

1. Pick a brief from `briefs/`.
2. **One person** clicks "Use this template" to create the team repository,
   then adds the others as collaborators: Settings > Collaborators > Add
   people.
3. **Everyone else** opens their own Codespace on that shared repository.
   Everyone codes at the same time, on their own machine, with their own
   agent and their own free quota.

## Part 1 — Think together (25 minutes)

**All of you at one screen. One person drives.**

Work through Gates 1, 2 and 3 as a group. Argue about the requirements now,
because it is a hundred times cheaper than arguing about them after the code
exists.

When you fill in `aidlc/tasks.md`, obey the one rule:

> Every task names exactly ONE owner and touches exactly ONE file that no
> other task touches.

If two tasks want the same file, they are one task, or the file needs
splitting. Do not skip past this — it is what stops your work colliding.

## Part 2 — Build in parallel (50 minutes)

**Back to your own machines. Everyone builds at the same time.**

```
git checkout -b your-name-feature-name
```

Now work through Gate 4 on **your** task only, in **your** file only. When
your tests pass:

```
git add -A
git commit -m "what you did"
git push -u origin your-name-feature-name
```

Then open a pull request on GitHub: a request to merge your work into the
team's main copy.

## Part 3 — Review each other (25 minutes)

Pair up. Open your partner's pull request and read every changed line. You
are looking for:

- Something that does not do what the requirement says
- A test that would still pass if the code were broken
- A function invented out of thin air that does not exist
- Code that was silently deleted to make an error go away

Leave at least two comments. Approve and merge only when you are satisfied.

Reviewing code you did not write **is the job now**. Take it seriously.

## Part 4 — Ship and plan (15 minutes)

Deploy at https://share.streamlit.io. Then agree, in writing in
`aidlc/tasks.md`, who does what before Session 3.

## You are done when

- [ ] All four gate documents are filled in and approved
- [ ] Every member has at least one merged pull request
- [ ] Every pull request was reviewed by someone who did not write it
- [ ] `pytest` passes on main
- [ ] The app is live at a public URL
```

- [ ] **Step 8: Dry-run the hardest brief and fix what breaks**

Lab 2 cannot be scored automatically — each team builds something different, so
there is no fixed acceptance test to check against. It gets a lighter version of
the Task 9A loop instead: run it yourself, three times, against **Brief 1 (Lab
Equipment Booking)** specifically, because its no-overlapping-bookings rule is
the hardest thing any brief asks for. If the agent handles that, the other four
are safe.

Use the model Task 9A chose and the prompt discipline from
`template/labs/PROMPTS.md`, adapted from "make these tests pass" to "build this
feature", since Lab 2 has no supplied tests.

Record for each run:

| Field | Why it matters |
|---|---|
| Time to finish Gates 1–3 as a group would | The Lab 2 plan allows 25 minutes. Confirm or cut. |
| Whether `tasks.md` respected one file per owner unprompted | If not, the prompt must say so explicitly |
| Whether the overlap rule survived into a test | The one genuinely hard requirement |
| Model requests used | Four students share a group repo but each has their own quota |
| Anything that took more than 15 minutes | Needs a timebox and a recovery line in `LAB2.md` |

Fold every fix back into `briefs/1-equipment-booking.md` and `labs/LAB2.md`.

- [ ] **Step 9: Point students at Lab 1's golden set as the worked example**

Groups need to see one complete, good set of gate documents before writing their
own. **Use Lab 1's golden set for this** — it is already produced by Task 9A,
students built that exact app the week before, and it gives away nothing about
anyone's project.

Add to `template/labs/LAB2.md`, immediately before Part 1:

```markdown
## What good looks like

Before you start, spend three minutes reading the gate documents from Lab 1:

```
git show origin/solution/lab1:aidlc/requirements.md
git show origin/solution/lab1:aidlc/tasks.md
```

That is a complete, working set for an app you have already built. Notice two
things. Every acceptance criterion names a number or an exact behaviour — none
of them say "works correctly". And every task in `tasks.md` owns exactly one
file.

Yours will describe something different. It should have the same shape.
```

Note the difference from Lab 1: your project is unique, so there is no golden
`requirements.md` to fall back on. What transfers is the **shape**, not the
content. State that in `LAB2.md` so nobody goes looking for a rescue file that
cannot exist.

- [ ] **Step 10: Commit**

```bash
git add template/briefs/ template/labs/LAB2.md instructor/
git commit -m "feat: add five project briefs, Lab 2 runbook and dry-run findings"
```

---

## Task 11: Session 3 retrieval corpus

**Files:**
- Create: `template/session3/corpus/lm7805.md`, `template/session3/corpus/ne555.md`, `template/session3/corpus/atmega328p.md`, `template/session3/corpus/lm358.md`, `template/session3/corpus/bc547.md`

**Interfaces:**
- Consumes: nothing
- Produces: the text corpus that `retrieve()` searches in Task 12. Each file must contain a `## Absolute Maximum Ratings` section with at least three specification lines, because the structured-output and evaluation steps depend on that shape.

- [ ] **Step 1: Write the five corpus files**

Each follows this exact structure. `template/session3/corpus/lm7805.md`:
```markdown
# LM7805 — 5 V Positive Voltage Regulator

## Description

Three-terminal positive voltage regulator providing a fixed 5 V output.
Includes internal thermal overload protection and short-circuit current
limiting. Requires no external components for basic operation, though input
and output capacitors improve stability.

## Absolute Maximum Ratings

- Input voltage: 35 V maximum
- Output current: 1.5 A maximum
- Operating junction temperature: 0 to 125 degrees Celsius
- Power dissipation: internally limited

## Electrical Characteristics

- Output voltage: 4.8 V to 5.2 V
- Dropout voltage: 2.0 V typical at 1 A
- Quiescent current: 5 mA typical
- Line regulation: 3 mV typical

## Typical Application Notes

Place a 0.33 microfarad capacitor on the input and a 0.1 microfarad capacitor
on the output, both close to the device. A heatsink is required above roughly
0.5 A of load current.
```

Write the remaining four with the same four section headings and comparable
detail:
- `ne555.md` — NE555 timer. Supply 4.5 V to 16 V, output current 200 mA,
  operating temperature 0 to 70 degrees Celsius, timing accuracy 1 percent
  typical, astable and monostable notes.
- `atmega328p.md` — 8-bit microcontroller. Supply 1.8 V to 5.5 V, DC current
  per I/O pin 40 mA, operating temperature −40 to 85 degrees Celsius,
  32 kilobytes flash, 2 kilobytes SRAM, 20 MHz maximum clock.
- `lm358.md` — dual operational amplifier. Supply 3 V to 32 V, input voltage
  range −0.3 V to 32 V, operating temperature 0 to 70 degrees Celsius, gain
  bandwidth product 1 MHz, single-supply operation notes.
- `bc547.md` — NPN transistor. Collector-emitter voltage 45 V, collector
  current 100 mA, power dissipation 500 milliwatts, DC current gain 110 to
  800, small-signal amplifier notes.

- [ ] **Step 2: Verify the structure is consistent**

Run: `grep -c "^## Absolute Maximum Ratings" template/session3/corpus/*.md`
Expected: every file reports `1`.

- [ ] **Step 3: Commit**

```bash
git add template/session3/corpus/
git commit -m "feat: add datasheet corpus for retrieval lab"
```

---

## Task 12: Lab 3 solution — retrieval, plain calls and structured output

Implemented on `main` during development, then moved to the `solution/lab3` branch in Task 15. Every test injects a fake client, so the suite never touches the network.

**Files:**
- Create: `template/core/retrieval.py`
- Modify: `template/core/llm.py` (replace the stubs from Task 5)
- Test: `template/tests/test_retrieval.py`, `template/tests/test_llm_solution.py`

**Interfaces:**
- Consumes: `template/session3/corpus/` from Task 11
- Produces:
  - `retrieve(query: str, corpus_dir: Path, k: int = 1) -> list[tuple[str, str]]` returning `(filename, text)` pairs, best match first
  - `ask(question: str, context: str = "", client=None) -> str`
  - `ask_structured(question: str, schema: dict, context: str = "", client=None) -> dict`
  - A client is any object with `.models.generate_content(model=..., contents=..., config=...)` returning an object with a `.text` attribute. This is the shape of `google.genai.Client`, so a fake is trivial to write.

- [ ] **Step 1: Write the failing retrieval test**

`template/tests/test_retrieval.py`:
```python
from pathlib import Path

import pytest

from core.retrieval import retrieve

CORPUS = Path(__file__).resolve().parent.parent / "session3" / "corpus"


def test_finds_the_regulator_document_for_a_regulator_question():
    results = retrieve("what is the maximum input voltage of the LM7805", CORPUS)
    assert results[0][0] == "lm7805.md"


def test_finds_the_timer_document_for_a_timer_question():
    results = retrieve("NE555 timer supply voltage range", CORPUS)
    assert results[0][0] == "ne555.md"


def test_returns_the_document_text_alongside_the_name():
    results = retrieve("LM7805 dropout voltage", CORPUS)
    assert "Dropout voltage" in results[0][1]


def test_returns_k_results():
    assert len(retrieve("voltage", CORPUS, k=3)) == 3


def test_returns_empty_list_for_an_empty_corpus(tmp_path):
    assert retrieve("anything", tmp_path) == []


def test_raises_for_a_missing_corpus_folder():
    with pytest.raises(FileNotFoundError):
        retrieve("anything", Path("/no/such/folder"))
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd template && pytest tests/test_retrieval.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'core.retrieval'`

- [ ] **Step 3: Write the retrieval implementation**

`template/core/retrieval.py`:
```python
"""Find which document is most likely to answer a question.

The model does not know anything about your files. Retrieval is how you hand
it the right piece of text before asking. This version scores documents by
counting shared words — crude, but it makes the idea visible, and you can read
every line of it.
"""

import re
from pathlib import Path

STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "for", "from", "how", "in",
    "is", "it", "of", "on", "or", "the", "to", "what", "when", "which", "with",
}


def _words(text: str) -> set[str]:
    return {
        word
        for word in re.findall(r"[a-z0-9]+", text.lower())
        if word not in STOP_WORDS and len(word) > 1
    }


def retrieve(query: str, corpus_dir: Path, k: int = 1) -> list[tuple[str, str]]:
    """Return the k documents most similar to the query, best first."""
    corpus_dir = Path(corpus_dir)
    if not corpus_dir.is_dir():
        raise FileNotFoundError(f"no corpus folder at {corpus_dir}")

    query_words = _words(query)
    scored = []
    for path in sorted(corpus_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        overlap = len(query_words & _words(text))
        scored.append((overlap, path.name, text))

    scored.sort(key=lambda row: (-row[0], row[1]))
    return [(name, text) for _, name, text in scored[:k]]
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd template && pytest tests/test_retrieval.py -v`
Expected: 6 passed

- [ ] **Step 5: Write the failing LLM test**

`template/tests/test_llm_solution.py`:
```python
import json

import pytest

from core.llm import ask, ask_structured


class FakeResponse:
    def __init__(self, text):
        self.text = text


class FakeModels:
    def __init__(self, text):
        self._text = text
        self.last_call = None

    def generate_content(self, *, model, contents, config=None):
        self.last_call = {"model": model, "contents": contents, "config": config}
        return FakeResponse(self._text)


class FakeClient:
    def __init__(self, text):
        self.models = FakeModels(text)


def test_ask_returns_the_model_text():
    client = FakeClient("A resistor limits current.")
    assert ask("What is a resistor?", client=client) == "A resistor limits current."


def test_ask_includes_the_context_in_the_prompt():
    client = FakeClient("ok")
    ask("What is the max input?", context="Input voltage: 35 V maximum", client=client)
    assert "35 V maximum" in client.models.last_call["contents"]


def test_ask_includes_the_question_in_the_prompt():
    client = FakeClient("ok")
    ask("What is the max input?", client=client)
    assert "What is the max input?" in client.models.last_call["contents"]


def test_ask_structured_parses_json_into_a_dictionary():
    client = FakeClient(json.dumps({"part": "LM7805", "max_input_v": 35}))
    result = ask_structured("Extract specs", schema={"type": "object"}, client=client)
    assert result == {"part": "LM7805", "max_input_v": 35}


def test_ask_structured_passes_the_schema_to_the_model():
    client = FakeClient("{}")
    schema = {"type": "object", "properties": {"part": {"type": "string"}}}
    ask_structured("Extract specs", schema=schema, client=client)
    assert client.models.last_call["config"]["response_schema"] == schema


def test_ask_structured_raises_a_clear_error_on_bad_json():
    client = FakeClient("I'm afraid I can't do that.")
    with pytest.raises(ValueError, match="did not return valid JSON"):
        ask_structured("Extract specs", schema={"type": "object"}, client=client)
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `cd template && pytest tests/test_llm_solution.py -v`
Expected: FAIL — `NotImplementedError` from the Task 5 stubs.

- [ ] **Step 7: Replace `core/llm.py` with the implementation**

`template/core/llm.py`:
```python
"""Where your app talks to a language model.

Two ways to ask:
  ask()            - question in, plain text out. Good for explanations.
  ask_structured() - question in, a fixed shape out. Good for anything your
                     code has to read afterwards.

Prefer ask_structured whenever another part of your program uses the answer.
Reading prose with code is guesswork; reading a known shape is not.
"""

import json
import os

MODEL = "gemini-2.5-flash"


def _default_client():
    from google import genai

    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not key:
        raise RuntimeError(
            "No GEMINI_API_KEY found. Put your key in .env, then restart the app."
        )
    return genai.Client(api_key=key)


def ask(question: str, context: str = "", client=None) -> str:
    """Ask a question in plain language and get plain text back."""
    client = client or _default_client()
    prompt = (
        "You are a careful electronics assistant. Answer using ONLY the "
        "reference text below. If the answer is not in it, say you do not know.\n\n"
        f"Reference text:\n{context}\n\n"
        f"Question: {question}"
    )
    return client.models.generate_content(model=MODEL, contents=prompt).text


def ask_structured(question: str, schema: dict, context: str = "", client=None) -> dict:
    """Ask a question and get the answer in the shape described by schema."""
    client = client or _default_client()
    prompt = (
        "Extract the requested information from the reference text below. "
        "Use ONLY what is in the text.\n\n"
        f"Reference text:\n{context}\n\n"
        f"Task: {question}"
    )
    config = {"response_mime_type": "application/json", "response_schema": schema}
    raw = client.models.generate_content(model=MODEL, contents=prompt, config=config).text
    try:
        return json.loads(raw)
    except json.JSONDecodeError as error:
        raise ValueError(
            f"The model did not return valid JSON. It said: {raw!r}"
        ) from error
```

- [ ] **Step 8: Run the full suite**

Run: `cd template && pytest -m "not live" -v`
Expected: all tests pass **except** `tests/test_llm.py`, which asserts the old stub behaviour. Delete `template/tests/test_llm.py` — it was scaffolding for Task 5 and is now superseded by `test_llm_solution.py`.

Run again: `cd template && pytest -m "not live" -v`
Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git rm template/tests/test_llm.py
git add template/core/retrieval.py template/core/llm.py template/tests/test_retrieval.py template/tests/test_llm_solution.py
git commit -m "feat: implement retrieval and LLM helpers for Lab 3"
```

---

## Task 13: Lab 3 assistant page, evaluation tests and brief

**Files:**
- Create: `template/pages/9_Assistant.py`, `template/tests/test_assistant_eval.py`, `template/labs/LAB3.md`

**Interfaces:**
- Consumes: `core.retrieval.retrieve`, `core.llm.ask`, `core.llm.ask_structured`
- Produces: the reference LLM feature students copy into their own project

- [ ] **Step 1: Write the assistant page**

`template/pages/9_Assistant.py`:
```python
"""Lab 3 reference solution: a question-answering assistant over datasheets."""

from pathlib import Path

import streamlit as st

from core.llm import ask, ask_structured
from core.retrieval import retrieve

CORPUS = Path(__file__).resolve().parent.parent / "session3" / "corpus"

SPEC_SCHEMA = {
    "type": "object",
    "properties": {
        "part_number": {"type": "string"},
        "specifications": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "value": {"type": "string"},
                },
                "required": ["name", "value"],
            },
        },
    },
    "required": ["part_number", "specifications"],
}

st.title("Datasheet Assistant")
st.caption("Ask about the components in session3/corpus/")

question = st.text_input("Your question", "What is the maximum input voltage of the LM7805?")
mode = st.radio("Answer as", ["Plain answer", "Table of specifications"], horizontal=True)

if st.button("Ask") and question:
    matches = retrieve(question, CORPUS, k=1)
    if not matches:
        st.error("No documents found in the corpus folder.")
        st.stop()

    source_name, source_text = matches[0]

    with st.spinner("Asking the model..."):
        if mode == "Plain answer":
            st.write(ask(question, context=source_text))
        else:
            try:
                data = ask_structured(question, SPEC_SCHEMA, context=source_text)
                st.subheader(data["part_number"])
                st.dataframe(data["specifications"], use_container_width=True)
            except ValueError as error:
                st.error(str(error))

    st.caption(f"Source: {source_name}")
    with st.expander("Show the text the model was given"):
        st.text(source_text)
```

- [ ] **Step 2: Write the evaluation tests**

`template/tests/test_assistant_eval.py`:
```python
"""Evaluation: does the assistant actually get the right answers?

A prompt is code. These tests run it against known questions. They are marked
"live" because they make real API calls, so they do not run in CI.

Run them yourself with:  pytest -m live -v
Run them twice. Notice that the answers are not always identical. That is
normal, and it is why you test behaviour rather than exact wording.
"""

from pathlib import Path

import pytest

from core.llm import ask
from core.retrieval import retrieve

CORPUS = Path(__file__).resolve().parent.parent / "session3" / "corpus"

CASES = [
    ("What is the maximum input voltage of the LM7805?", "35"),
    ("What is the maximum output current of the LM7805?", "1.5"),
    ("How much flash memory does the ATmega328P have?", "32"),
]


@pytest.mark.live
@pytest.mark.parametrize("question, expected_fragment", CASES)
def test_assistant_answers_correctly(question, expected_fragment):
    context = retrieve(question, CORPUS, k=1)[0][1]
    answer = ask(question, context=context)
    assert expected_fragment in answer


@pytest.mark.live
def test_assistant_admits_when_the_answer_is_not_in_the_documents():
    context = retrieve("LM7805", CORPUS, k=1)[0][1]
    answer = ask("What is the price of this part in Thai baht?", context=context)
    assert any(phrase in answer.lower() for phrase in ("do not know", "don't know", "not in"))
```

- [ ] **Step 3: Verify the offline suite still passes and live tests are excluded**

Run: `cd template && pytest -m "not live" -v`
Expected: all pass; the five live tests report as deselected.

- [ ] **Step 4: Write `template/labs/LAB3.md`**

```markdown
# Lab 3 — Put an AI feature inside an app

Everyone builds the **same** thing first. That is deliberate: if you get
stuck, the person next to you is on the same step.

Start from a **fresh** copy of the template — click "Use this template"
again, name it something like `lab3-practice`, and open a Codespace on it.
Do not do this inside your group project; you will copy the finished files
across at the end.

## Checkpoint 1 — A plain answer (15 minutes)

Ask Cline to implement `ask()` in `core/llm.py` so that it sends a question
to Gemini and returns the text of the reply.

Then build a page with a text box and a button that shows the answer.

**Done when:** you can ask "what is Ohm's law" and get a sensible reply.

**Now break it on purpose:** ask "what is the maximum input voltage of the
LM7805?" The model may answer confidently and be wrong, because it is
guessing from memory. That is the problem the next two checkpoints solve.

## Checkpoint 2 — A fixed shape instead of prose (20 minutes)

Prose is fine for a human to read. It is terrible for your code to read.
Instead of hoping the answer contains a number you can find, tell the model
exactly what shape to reply in.

Implement `ask_structured()` so it asks for JSON matching a schema you
provide, and returns it as a Python dictionary.

Then show the result as a table.

**Done when:** asking for the specifications of a part gives you a table,
not a paragraph.

**Also do this:** make the model fail. Ask it something the schema cannot
express and watch what happens. Your code must show a clear error rather
than crash.

## Checkpoint 3 — Give it your documents (20 minutes)

The model has never seen `session3/corpus/`. Retrieval means finding the
right document first and handing it over with the question.

Implement `retrieve()` in `core/retrieval.py`: score each file in the corpus
by how many words it shares with the question, return the best one.

Then wire it in: retrieve first, pass the text as context, and show which
file the answer came from.

**Done when:** the LM7805 question is answered correctly **and** the page
shows `lm7805.md` as the source.

Ask a question about something not in the corpus. It should say it does not
know. If it invents an answer instead, your prompt needs to be stricter.

## Checkpoint 4 — Test the prompt (10 minutes)

A prompt is code, so test it. Write three questions with answers you can
verify yourself, and assert the reply contains the right value.

```
pytest -m live -v
```

**Run it twice.** The wording changes between runs even though nothing in
your code changed. This is called non-determinism, and it is why you assert
on the important content rather than the exact sentence.

**Done when:** your three tests pass, and you can explain to a classmate why
they might pass now and fail in an hour.

## Transfer it to your project (20 minutes)

Optional but recommended. In your group project repository, copy across:

- `core/llm.py`
- `core/retrieval.py` (only if your feature needs your own documents)
- Your assistant page, renamed to fit your project

Then adapt it to the AI feature named in your brief.

**If time runs out, stop and demo what you have.** A working project without
an AI feature beats a broken one with it.
```

- [ ] **Step 5: Add per-checkpoint recovery to the lab brief**

Lab 3 sits between Labs 1 and 2: each checkpoint has a fixed target, so golden
code exists for every one, and each is independently recoverable. Unlike Lab 1,
there are no gate documents to restore — the artifacts here are code files.

Add to `template/labs/LAB3.md`, immediately before "Transfer it to your project":

```markdown
## If a checkpoint will not work

Each checkpoint is independent. If one defeats you, take the reference version
and carry on to the next — you lose nothing, and the later checkpoints are the
more interesting ones.

| Stuck at | Run this |
|---|---|
| Checkpoint 1 or 2 | `git checkout origin/solution/lab3 -- core/llm.py` |
| Checkpoint 3 | `git checkout origin/solution/lab3 -- core/retrieval.py` |
| The page itself | `git checkout origin/solution/lab3 -- pages/9_Assistant.py` |
| Checkpoint 4 | `git checkout origin/solution/lab3 -- tests/test_assistant_eval.py` |

Then read what you just restored. Reading working code you did not write is
worth as much as writing it.
```

- [ ] **Step 6: Dry-run the four checkpoints and time them**

Run all four checkpoints yourself on the model Task 9A chose, twice. Each has a
fixed target, so score them individually rather than end to end:

| Checkpoint | Passes when |
|---|---|
| 1 | `ask()` returns text from a real call |
| 2 | `ask_structured()` returns a dict matching the schema, and a deliberate bad request raises `ValueError` rather than crashing |
| 3 | The LM7805 question is answered correctly **and** the page names `lm7805.md` as the source |
| 4 | `pytest -m live` runs and reports — pass or fail, it ran |

Checkpoint 4 is inherently flaky: it is a language model judging a language
model. Score it as "the eval ran and reported", not "every case passed". A
student watching a case pass and then fail has learned the lesson the checkpoint
exists to teach.

Record time per checkpoint against the 15/20/20/10-minute budget, and fold any
overrun back into `LAB3.md` by cutting scope rather than hoping students are
faster than you.

- [ ] **Step 7: Add the reference-study closing to Lab 3**

Lab 3 gets the same fallback as Lab 1, for the same reason: a student whose
build fails should end the session having understood the pattern, not having
nothing. Add to `template/labs/LAB3.md`, immediately before "Transfer it to your
project":

```markdown
## Understand what you just built (or did not)

Take the reference version and have your agent walk you through it. This edits
nothing, so it cannot break anything:

```
git checkout origin/solution/lab3 -- core/llm.py core/retrieval.py
```

> Explain core/retrieval.py to me. How does it decide which document is the
> right one, and where would that method fall down?

> In core/llm.py, what does response_schema actually do? What would happen if I
> asked for a schema the answer does not fit?

> Show me the exact line that stops the model answering from memory instead of
> from the document I gave it.

That last one matters most. It is the difference between an assistant that cites
your data and one that invents plausible answers.
```

- [ ] **Step 8: Commit**

```bash
git add template/pages/9_Assistant.py template/tests/test_assistant_eval.py template/labs/LAB3.md
git commit -m "feat: add Lab 3 assistant page, evaluation tests, brief and recovery paths"
```

---

## Task 14: Instructor materials

**Files:**
- Create: `instructor/rubric.md`, `instructor/peer-score-form.md`, `instructor/ai-collaboration-log.md`, `instructor/pilot-checklist.md`

**Interfaces:**
- Consumes: spec §7 (assessment) and §10 (pilot checklist)
- Produces: instructor-only documents; these stay in this repository and are never copied into the template

- [ ] **Step 1: Write `instructor/rubric.md`**

Transcribe spec §7 verbatim into a standalone marking sheet: the six group
criteria with their weights (spec quality 20%, design and decomposition 15%,
collaboration 20%, working software 20%, testing and review quality 15%,
demo and reflection 10%) totalling 70%, plus the individual AI collaboration
log at 30%. For each criterion add three descriptor bands — excellent, adequate,
weak — written as observable evidence. Example for "Collaboration": *excellent —
every member has at least two merged pull requests and has left substantive
review comments on someone else's; adequate — every member has at least one
merged pull request; weak — one member authored most commits.*

- [ ] **Step 2: Write `instructor/peer-score-form.md`**

A single page students complete for each group they visit during demos:
group name, project name, three scores from 1 to 5 (does it work / is the
problem worth solving / could you explain how it was built), and one free-text
line: "the best thing about this project". Fits on one side of A4.

- [ ] **Step 3: Write `instructor/ai-collaboration-log.md`**

The individual submission template. One page, three entries — one per session.
Each entry: what you asked the agent to do, what it got wrong, how you noticed,
what you changed about the way you prompt. Include a filled-in worked example
from Session 1 so students can see the expected depth, and state the rule that
"it worked fine" is not an acceptable entry — if nothing went wrong, they did
not look hard enough.

- [ ] **Step 4: Write `instructor/pilot-checklist.md`**

Transcribe the eight checks from spec §10 as a runbook with a pass/fail box
and a "what to do if it fails" line for each. Mark checks 2 (Cline runs inside
a browser Codespace) and 4 (Streamlit forwarded preview URL opens through the
campus network) as blocking — if either fails, the browser-only approach is
dead and the fallback is local VS Code plus Cline, which changes the install
request handed to lab staff.

- [ ] **Step 5: Write `instructor/dry-run-findings.md`**

The dry-runs themselves belong to the tasks that build each lab — Task 9A
Round 6 for Lab 1, Task 10 Step 8 for Lab 2, Task 13 Step 6 for Lab 3. This
file is where their findings are consolidated into one place you can act on.

One section per lab, each recording:

| Field | What it feeds |
|---|---|
| Measured time to each gate or checkpoint | Confirms or breaks the session timings in spec §6 |
| Model requests used | Confirms the quota budget holds for a 2-hour lab |
| Every point the agent went wrong, and the fix | New entries in `TROUBLESHOOTING.md` |
| Any prompt that needed rewording | Folded back into `template/labs/PROMPTS.md` |
| Anything that took over 15 minutes | Needs a timebox and a recovery line in that lab brief |

Close with a single table: allotted time versus measured time per lab. **If a
lab overran by more than 20%, cut scope from the brief** rather than assuming
students will be faster than you. They will not be — they are learning the tool
and the method at the same time, and you are not.

- [ ] **Step 6: Commit**

```bash
git add instructor/
git commit -m "docs: add rubric, peer score form, log template, pilot checklist and dry-run findings"
```

---

## Task 15: Publish the template repository with solution branches

The published `main` must **not** contain the Lab 1 or Lab 3 solutions — those
go on branches. This is the last task because it is the only one that touches
GitHub.

**Files:**
- Create: `scripts/publish-template.sh`

**Interfaces:**
- Consumes: everything under `template/`
- Produces: the published repository `witchapong/ai-workshop-template`, marked as a GitHub template repository, with branches `main`, `solution/lab1`, `solution/lab3`

- [ ] **Step 1: Write the publish script**

`scripts/publish-template.sh`:
```bash
#!/usr/bin/env bash
# Publish template/ as the student-facing template repository.
# Run from the repository root. Safe to re-run: it force-updates branches.
set -euo pipefail

REPO="ai-workshop-template"
OWNER="$(gh api user --jq .login)"
WORK="$(mktemp -d)"
REPO_ROOT="$(pwd)"

echo "Staging template/ into $WORK"
cp -R template/. "$WORK/"
cd "$WORK"

git init -q -b main
git add -A
git commit -q -m "Workshop project template"

# Solution branches carry the reference implementations.
git branch solution/lab1
git branch solution/lab3

# solution/lab1 also carries the golden gate artifacts - the captured
# requirements/design/tasks a stuck student restores with git checkout.
if [ -d "$REPO_ROOT/eval/golden/lab1" ]; then
  git checkout -q solution/lab1
  cp "$REPO_ROOT"/eval/golden/lab1/*.md aidlc/
  git add aidlc/
  git commit -q -m "Add golden gate artifacts for Lab 1"
  git checkout -q main
else
  echo "WARNING: eval/golden/lab1 not found - publishing without golden artifacts."
  echo "         Students will have no gate recovery path. Finish Task 9A first."
fi

# main must not ship the answers.
# NOTE: tests/test_spectrum.py deliberately stays — it is the acceptance
# specification students are given, not an answer.
git rm -q core/spectrum.py pages/2_Spectrum_Analyzer.py \
          core/retrieval.py pages/9_Assistant.py tests/test_assistant_eval.py \
          tests/test_llm_solution.py
git checkout -q "$(git rev-parse HEAD)" -- core/llm.py 2>/dev/null || true
git commit -q -m "Remove reference solutions from main"

if ! gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  gh repo create "$OWNER/$REPO" --public \
    --description "Student project template for the AI for Software Development workshop"
fi

git remote add origin "https://github.com/$OWNER/$REPO.git"
git push -q --force origin main solution/lab1 solution/lab3

gh repo edit "$OWNER/$REPO" --enable-issues=false --template
echo "Published: https://github.com/$OWNER/$REPO"
```

- [ ] **Step 2: Restore the LLM stub on main**

The publish script removes solution files but `core/llm.py` on `main` must be
the **stub** from Task 5, not the implementation from Task 12. Replace the
fragile `git checkout` line in the script with an explicit rewrite. Edit
`scripts/publish-template.sh`, replacing the `git checkout -q ...` line with:

```bash
cat > core/llm.py <<'STUB'
"""Where your app talks to a language model.

This file is deliberately empty until Session 3. Leaving the slot here means
you can add an AI feature later without rearranging anything you have built.
"""

NOT_YET = "You build this in Session 3. See labs/LAB3.md."


def ask(question: str, context: str = "", client=None) -> str:
    """Ask a question in plain language and get plain text back."""
    raise NotImplementedError(NOT_YET)


def ask_structured(question: str, schema: dict, context: str = "", client=None) -> dict:
    """Ask a question and get an answer in a fixed shape you specify."""
    raise NotImplementedError(NOT_YET)
STUB
git add core/llm.py
```

- [ ] **Step 3: Make the script executable and run it**

Run: `chmod +x scripts/publish-template.sh && ./scripts/publish-template.sh`
Expected: prints `Published: https://github.com/<owner>/ai-workshop-template`

- [ ] **Step 4: Verify the published main has no solutions but does have the acceptance tests**

Run:
```bash
PATHS=$(gh api "repos/$(gh api user --jq .login)/ai-workshop-template/git/trees/main?recursive=1" \
  --jq '.tree[].path')
echo "$PATHS" | grep -E 'core/spectrum\.py|core/retrieval\.py|9_Assistant|test_llm_solution|test_assistant_eval' \
  && echo "PROBLEM: a solution file leaked onto main" || echo "no solutions on main - good"
echo "$PATHS" | grep -q 'tests/test_spectrum\.py' \
  && echo "acceptance tests present - good" || echo "PROBLEM: acceptance tests missing"
```
Expected: `no solutions on main - good` followed by `acceptance tests present - good`

- [ ] **Step 5: Verify the solution branches do have them**

Run:
```bash
gh api "repos/$(gh api user --jq .login)/ai-workshop-template/git/trees/solution/lab1?recursive=1" \
  --jq '.tree[].path' | grep -cE 'core/spectrum\.py|2_Spectrum_Analyzer\.py'
```
Expected: `2` (`core/spectrum.py` and `pages/2_Spectrum_Analyzer.py`)

- [ ] **Step 6: Verify it is usable as a template**

Open `https://github.com/<owner>/ai-workshop-template` in a browser.
Expected: a green **Use this template** button appears. Click it, create a
throwaway repository, open a Codespace on it, and confirm Cline appears in the
sidebar and `python check_setup.py` runs. Delete the throwaway repository
afterwards.

- [ ] **Step 7: Commit**

```bash
git add scripts/publish-template.sh
git commit -m "feat: add template publish script"
```

---

## Task 16: Lecture decks

Written last because the demos in them reference code that must already exist.

**Files:**
- Exists already: `slides/deck.js` (the ten recipes), `slides/package.json`
- Create: `slides/session2.js`, `slides/session3.js`
- Generated: `slides/Session N - <name>.pptx`

**Format.** Decks are `.pptx`, generated with **PptxGenJS**. `slides/deck.js`
transcribes the ten layout recipes from `SLIDE-STYLE.md`; a `sessionN.js` file
supplies content only — which recipe, what text, what speaker note. Never define
layout in a content file, and never hand-author HTML. If a slide fits none of
the ten recipes, split the content rather than adding a layout.

Session 1 is built; copy `slides/session1.js` as the starting shape.

**Verify each deck** with the three-step QA in `CLAUDE.md` — schema validation,
`markitdown` content check, and a Keynote render inspected slide by slide. All
three, every time. Text overflow and overlapping elements are the defects to
hunt first; both appeared in Session 1's first render.

**Interfaces:**
- Consumes: every artifact above — slides must not reference anything that does not exist
- Produces: nothing downstream

- [ ] **Step 1: Write `slides/session1.js`** *(done — see `slides/session1.js`)*

Built and verified. 22 slides covering two lecture blocks totalling 40 minutes
plus a 5-minute live demo, with the warm-up and Lab 1 briefs slotted between
them. Content below is what shipped.

*Block 1 — How an agent works (20 min):* what a language model actually does
(predicts the next token, has no memory between calls); harness versus model,
and why swapping either is a configuration change; the read-plan-edit-run-observe
loop drawn as a cycle; the context window and why long conversations get worse,
not better; tokens, requests and quota, with the amplification arithmetic from
spec §4 shown explicitly (one instruction becomes four to ten requests); why
models fabricate, with a worked example of a plausible non-existent function.

*Block 2 — Why vibe coding broke (20 min):* run immediately after the warm-up
lab, opening with what students just experienced; the Four Gates table from
spec §3; each gate mapped to the classical software lifecycle stage it
replaces; AI-DLC vocabulary — intent, units, bolts, "AI proposes, human
approves" — credited to AWS with the Google Maps analogy from the existing
lecture notes; closing slide: the quota discipline line, "prompt like an
engineer, not a slot machine".

- [ ] **Step 2: Write `slides/session2.js`**

Two blocks totalling 45 minutes.

*Block 3 — Design and decomposition (30 min):* turning an intent into
requirements; what makes an acceptance criterion checkable, with three
before-and-after examples of vague versus testable; what a data model is,
built live from Brief 1; the anatomy of a Streamlit app — pages, state,
storage; why one file per owner makes parallel work possible, and the direct
line from that to AI-DLC's units and bounded contexts; version control as a
mental model — branch, pull request, review, merge — drawn as a diagram, not
as commands; what continuous integration does and why the tests run on push.

*Block 4 — Reviewing code you did not write (15 min):* delivered immediately
before the review block; the five AI failure modes with a real code example of
each — a hallucinated API call, a silent fallback that hides an error, code
quietly deleted to make a test pass, unnecessary abstraction, and a test that
asserts nothing; a four-question review checklist students apply to their
partner's pull request.

- [ ] **Step 3: Write `slides/session3.js`**

Two blocks totalling 40 minutes.

*Block 5 — Building with language models (25 min):* system prompt versus user
prompt; structured output and the rule that anything your code reads must have
a shape, demonstrated with `SPEC_SCHEMA` from Task 13; tool calling in one
slide, as context only; retrieval-augmented generation explained as "the model
has never seen your files, so hand them over", with the `retrieve` function
shown; evaluating a prompt like code, using `test_assistant_eval.py`;
guardrails and what to do when the model refuses or invents; cost, latency and
privacy — including why the classroom rule is no personal data in prompts;
non-determinism and designing around it.

*Closing (15 min):* what students can now do unaided; when not to use AI —
problems where the specification is the hard part, safety-critical work,
anything where you cannot check the answer; security — keys, secrets, and what
to do about a leaked one; academic honesty and disclosing AI use; vendor risk,
using the 2026 free-tier collapse from spec §4 as the worked example; where to
go next.

- [ ] **Step 4: Verify no slide references a missing artifact**

Slides name real files — `labs/LAB1.md`, `tests/test_spectrum.py`, `.clinerules`.
Check every one of them exists:

```bash
grep -ohE '(template/|labs/|tests/|core/|pages/|aidlc/)[A-Za-z0-9_/-]+\.[A-Za-z]+' slides/session*.js \
  | sed 's|^template/||' | sort -u | while read -r p; do
  [ -e "template/$p" ] || echo "MISSING: $p"
done
```
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add slides/
git commit -m "docs: add lecture decks for all three sessions"
```

---

## Self-Review

**Spec coverage.** Every section of the design spec maps to a task: §3 Four
Gates → Tasks 6 and 7; §4 tooling → Task 1; §5 scaffolding → Tasks 1–8;
§6 Session 1 → Tasks 9 and 16; §6 Session 2 → Tasks 10 and 16; §6 Session 3 →
Tasks 11, 12, 13 and 16; §7 assessment → Task 14; §8 lab-staff requirements →
already complete in the spec, no build work needed; §9 risk register →
mitigations land in Task 8 (`TROUBLESHOOTING.md`) and Task 15 (solution
branches); §10 pilot checklist → Task 14.

**Deviation from the spec, deliberate.** The spec's §8 instructor pre-work
names a separate "Session 3 reference repository". This plan consolidates it
into `solution/lab3` on the single template repository. One repository is less
to maintain and less for students to confuse, and the spec separately asks for
known-good checkpoint branches anyway — the branch satisfies both needs. If a
standalone reference repo turns out to be wanted, it is a five-minute fork of
that branch.

**Type consistency.** `ask` and `ask_structured` keep identical signatures
across the Task 5 stub, the Task 12 implementation and the Task 15 republished
stub. `retrieve` returns `list[tuple[str, str]]` in Task 12 and is consumed
that way in Task 13. In Task 9, `make_signal` returns `(times, signal)` and
`spectrum` returns `(freqs, magnitudes)`; both are unpacked in that order on
the solution page and in every test. Storage's
`load`/`save`/`append` signatures match between Task 3 and their use in
Task 5's `pages/1_Home.py`.

**Verification coverage.** Three tiers, matched to how automatable each lab is:

| Lab | How it is verified | Where |
|---|---|---|
| 1 | Fully scripted, per-gate scored, 5 runs per revision, then rehearsed twice in a real Codespace | Task 9A |
| 2 | Manual dry-run, 3 times, against Brief 1 — the hardest brief | Task 10 Step 8 |
| 3 | Manual dry-run, twice, scored per checkpoint | Task 13 Step 6 |

Plus Task 14's pilot checklist for the environment itself. Together these
replace the plan's two largest untested assumptions — that a free model can
drive Cline to a working app, and that the session timings in spec §6 are
achievable — with measurements.

**Two headline numbers, not one.** Task 9A reports the *unaided* rate (all
gates green, no help) and the *assisted* rate (golden artifacts restorable on
failure). The second is the classroom-relevant figure, because per-gate
recovery is what stops failure compounding across four gates — at 85% per gate,
unaided end-to-end is only 52%, while a single recovery brings it back into
usable territory.

**The golden set has three parts, produced three ways.** Prompts are *authored*
and frozen (`eval/prompts/` → `template/labs/PROMPTS.md`). Gate artifacts are
*captured* from a good run, hand-polished, and published to `solution/lab1`
(`eval/golden/lab1/`). The reference app and its explain prompts already exist
from Task 9 and need only publishing (`template/labs/EXPLAIN.md`).

Coverage differs by lab, and the gaps are deliberate:

| | Build prompts | Gate artifacts | Reference + explain |
|---|---|---|---|
| Lab 1 | Yes, eval-tuned | Yes, on `solution/lab1` | Yes |
| Lab 2 | Adapted, dry-run checked | **No — impossible by design** | Lab 1's set, as a worked example |
| Lab 3 | Yes, dry-run checked | Not applicable (code, not gate docs) | Yes, per checkpoint |

Lab 2 can have no rescue artifact because every team's project is unique; only
the *shape* of Lab 1's artifacts transfers. Task 10 Step 9 says so explicitly,
so nobody hunts for a file that cannot exist.

**Phase E is why the time-box is safe to bound.** Phases B–D can all disappoint —
a plateau at 40%, a model that will not behave, a budget that expires — and the
workshop still works, because Lab 1 degrades to "attempt it, then study the
reference with the agent" rather than to nothing. Phase E therefore runs
unconditionally and is written during Phase C's dead time. It is also the
sturdiest component in the plan: explaining code edits no files, so it never
invokes the character-exact `replace_in_file` matching that threatens every
other path.

**Known scaffolding churn.** `template/tests/test_llm.py` is written in Task 5
to pin the stub's behaviour and deleted in Task 12 when the stub is replaced.
This is intentional and called out in Task 12 Step 8, not an oversight.

---

## Suggested build order

The tasks are ordered so the workshop can be piloted before it is finished.

| Milestone | Tasks | Unblocks |
|---|---|---|
| **Pilot-ready** | 1–8, 15 | Run the spec §10 pilot on a lab PC. Do this first — checks 2 and 4 can invalidate the whole browser-only approach. |
| **Lab 1 built** | 9 | Gives the eval something to measure |
| **Evidence gate** | **9A** | **The longest task in the plan.** Five phases: author, calibrate, improve (24 h), certify, reference path. Picks the model on data, measures real request counts, and produces the tested prompt library, the golden gate artifacts, and the explain-the-reference fallback. |
| **Session 1 ready** | 16 (deck 1) | First session can run |
| **Session 2 ready** | 10 (includes the Brief 1 dry-run), 16 (deck 2) | Second session can run |
| **Session 3 ready** | 11, 12, 13 (includes the checkpoint dry-run), 16 (deck 3) | Third session can run |
| **Grading ready** | 14 | Marking can begin |

**Two gates, and they fail differently.** The lab-PC pilot answers "can this
run here at all" — if Cline will not load in a browser Codespace or the
campus proxy strips the WebSocket connections Streamlit needs, the whole
browser-only approach dies and the install request changes. Task 9A answers a
separate question: "does the agent actually produce working software from
these prompts." Passing one tells you nothing about the other, so run both.

If Task 9A shows no free model reaching roughly 80% green, do not proceed to
Tasks 10–13 as written. The options at that point are: shrink Lab 1 further,
give the agent more scaffolding, or accept a lower unaided pass rate and lean
harder on golden branches. All three are survivable — but that is a decision
to take with the numbers in hand, not to discover during Session 1.

Task 15 appears early deliberately: run it with whatever exists to prove
publishing works, then re-run it after each milestone — the script is
idempotent and force-updates all three branches.
