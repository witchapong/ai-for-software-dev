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
    except Exception as error:  # noqa: BLE001 - students need to see the raw reason
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
