"""Check whether one gate produced what it should have.

Usage: python check_gate.py <workdir> <gate-number>
Prints one JSON object: {"gate": N, "passed": bool, "problems": [...]}

End-to-end pass/fail tells you THAT a run broke, not WHERE. This tells you
where. The "no .py file yet" checks at gates 1 and 2 are the important ones:
they measure whether the gates are actually holding, which is the whole premise
of the method.
"""

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

SPECTRUM = Path("core/spectrum.py")
STAMP = ".gate4a-hash"


def untouched(text: str) -> bool:
    """True if a gate document is still the shipped template, not a filled-in one.

    The templates carry recognisable stand-ins: PLACEHOLDER prose, `....py`
    filenames, `_______` blanks, and table rows whose cells are empty. Without
    this, a run that never wrote anything scores as a pass, because the empty
    template still has numbered rows and plausible filenames in it.
    """
    if "PLACEHOLDER" in text or "...." in text or "_______" in text:
        return True
    rows = re.findall(r"^\|\s*\d+\s*\|(.*)$", text, re.M)
    filled = [r for r in rows if any(c.strip() for c in r.split("|")[:-1])]
    return bool(rows) and not filled


def premature_code(work: Path) -> list[str]:
    """Solution files that exist before the gate that allows them."""
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
    if untouched(text):
        problems.append("requirements.md is still the untouched template")
    leaked = premature_code(work)
    if leaked:
        problems.append(f"code written before the spec was approved: {leaked}")
    return problems


def gate3(work: Path) -> list[str]:
    """Design and task list drafted, one file per task. Still no code."""
    problems = []
    for name in ("design.md", "tasks.md"):
        if not (work / "aidlc" / name).exists():
            problems.append(f"aidlc/{name} was not created")
    design = work / "aidlc" / "design.md"
    if design.exists() and untouched(design.read_text(encoding="utf-8", errors="replace")):
        problems.append("design.md is still the untouched template")
    tasks = work / "aidlc" / "tasks.md"
    if tasks.exists():
        text = tasks.read_text(encoding="utf-8", errors="replace")
        if untouched(text):
            problems.append("tasks.md is still the untouched template")
        files = re.findall(r"[`\s|]([\w/]+\.py)", text)
        unique = sorted(set(files))
        if len(files) != len(unique):
            problems.append(f"a file is claimed by more than one task: {files}")
        if len(unique) < 2:
            problems.append(f"expected 2 owned files, found {unique}")
    leaked = premature_code(work)
    if leaked:
        problems.append(f"code written before the plan was approved: {leaked}")
    return problems


def gate4a(work: Path) -> list[str]:
    """The maths module exists and every test passes."""
    if not (work / SPECTRUM).exists():
        return ["core/spectrum.py was not created"]
    python = work / ".venv" / "bin" / "python"
    if not python.exists():
        python = Path(sys.executable)
    try:
        result = subprocess.run(
            [str(python), "-m", "pytest", "tests/test_spectrum.py", "-q"],
            cwd=work, capture_output=True, text=True, timeout=180,
        )
    except subprocess.TimeoutExpired:
        return ["pytest timed out after 180s"]
    match = re.search(r"(\d+) passed", result.stdout)
    passed = int(match.group(1)) if match else 0
    # Fingerprint the file so gate 4b can prove task 2 left it alone.
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
