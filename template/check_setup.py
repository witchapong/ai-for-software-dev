"""Run this before the first session:  python check_setup.py

It checks four things and tells you exactly what to fix if any of them fail.
Do not come to class until this prints "ALL CHECKS PASSED".
"""

import os
import sys

PLACEHOLDER = "paste-your-key-here"
# Model names go stale and models get busy, so try several. Both failure modes
# were seen within three days in August 2026: gemini-2.5-flash was retired for
# new accounts, and gemini-flash-latest returned "high demand" while a pinned
# version answered fine. A list survives both.
GEMINI_MODELS = ["gemini-flash-latest", "gemini-3.6-flash", "gemini-3.5-flash"]
MISTRAL_MODEL = "mistral-medium-latest"
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
    # Pass if EITHER provider has a real key. Returning on the first
    # placeholder meant a student with only a Mistral key was told "no key
    # found" on one line and "Mistral replied" on the next.
    names = ("GEMINI_API_KEY", "MISTRAL_API_KEY")
    usable = [n for n in names if (environ.get(n) or "").strip() not in ("", PLACEHOLDER)]
    if usable:
        return True, " and ".join(usable) + (" is set" if len(usable) == 1 else " are set")
    placeholders = [n for n in names if (environ.get(n) or "").strip() == PLACEHOLDER]
    if placeholders:
        return False, (
            f"{' and '.join(placeholders)} still contains the placeholder text. "
            f"Open .env and replace '{PLACEHOLDER}' with a key you created."
        )
    return False, (
        "No API key found. Copy .env.example to .env, then paste your key into "
        "GEMINI_API_KEY. Get one free at https://aistudio.google.com/apikey"
    )


def check_second_provider(environ: dict[str, str]) -> tuple[bool, str]:
    """Both keys, or you lose the lab the first time a free tier says no.

    One working provider is enough to pass setup, so this is deliberately the
    only check that can fail while everything else is green. It is a warning
    with teeth: free tiers return 503 "high demand" without notice, and a
    student with one key has nothing to switch to.
    """
    configured = [
        name
        for name in ("GEMINI_API_KEY", "MISTRAL_API_KEY")
        if (environ.get(name) or "").strip() not in ("", PLACEHOLDER)
    ]
    if len(configured) >= 2:
        return True, "both providers configured - you can switch if one refuses"
    missing = "MISTRAL_API_KEY" if "MISTRAL_API_KEY" not in configured else "GEMINI_API_KEY"
    where = (
        "https://console.mistral.ai"
        if missing == "MISTRAL_API_KEY"
        else "https://aistudio.google.com/apikey"
    )
    return False, (
        f"only one provider is set. Add {missing} to .env - free at {where}. "
        "When a provider refuses service mid-lab, the second key is how you "
        "carry on instead of stopping."
    )


def _diagnose(error: Exception, provider: str) -> str:
    """Turn a provider error into advice that is actually actionable.

    "Your key is wrong" is the wrong answer most of the time. A retired model
    and an exhausted allowance both look like failures, and neither is fixed by
    making a new key.
    """
    text = str(error)
    if "no longer available" in text or "NOT_FOUND" in text or "404" in text:
        return (
            f"{provider}: that model has been retired. Your key is fine. "
            "Tell your instructor - the model name in this file needs updating."
        )
    if "credits" in text.lower() or "RESOURCE_EXHAUSTED" in text or "429" in text:
        return (
            f"{provider}: the free allowance is exhausted or the account is "
            "flagged. Your key is fine. Use the other provider today."
        )
    if "API key" in text or "401" in text or "403" in text or "UNAUTHENTICATED" in text:
        return (
            f"{provider}: the key was rejected. Check for a stray space, or "
            "create a new one."
        )
    return f"{provider}: {text[:160]}"


def _try_gemini(key: str) -> tuple[bool, str]:
    import logging

    from google import genai

    # The SDK logs an "automatic function calling is not recommended" warning on
    # every generate_content call. It is advice for a feature we do not use, but
    # it prints above the PASS/FAIL list, and a student in minute five reads any
    # unexplained red text as a broken setup. Quiet it.
    logging.getLogger("google_genai").setLevel(logging.ERROR)

    client = genai.Client(api_key=key)
    last = None
    for model in GEMINI_MODELS:
        try:
            client.models.generate_content(
                model=model, contents="Reply with the single word: ok"
            )
            return True, f"Gemini replied ({model})"
        except Exception as error:  # noqa: BLE001 - try the next model, keep the reason
            last = error
    raise last


def _try_mistral(key: str) -> tuple[bool, str]:
    import json
    import urllib.request

    body = json.dumps(
        {
            "model": MISTRAL_MODEL,
            "max_tokens": 8,
            "messages": [{"role": "user", "content": "Reply with the single word: ok"}],
        }
    ).encode()
    request = urllib.request.Request(
        "https://api.mistral.ai/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    urllib.request.urlopen(request, timeout=45).read()
    return True, f"Mistral replied ({MISTRAL_MODEL})"


def check_live_call() -> tuple[bool, str]:
    """Make one real request. You need ONE provider working, not both."""
    attempts = [
        ("Gemini", "GEMINI_API_KEY", _try_gemini),
        ("Mistral", "MISTRAL_API_KEY", _try_mistral),
    ]
    notes = []
    for provider, env_name, call in attempts:
        key = (os.environ.get(env_name) or "").strip()
        if not key or key == PLACEHOLDER:
            continue
        try:
            return call(key)
        except Exception as error:  # noqa: BLE001 - students must see the real reason
            notes.append(_diagnose(error, provider))
    if not notes:
        return False, "Skipped — no usable key to test"
    return False, "no provider answered.\n   " + "\n   ".join(notes)


def main() -> int:
    from dotenv import load_dotenv

    load_dotenv()

    # Each check runs and prints in turn. Building the list eagerly meant the
    # network call happened before ANY line was printed, so the terminal sat
    # blank for ten or twenty seconds and read as a hang. It is the first thing
    # a student ever runs; it has to look alive.
    checks = [
        ("Python version", check_python_version),
        ("Packages", check_imports),
        ("API key present", lambda: check_env(dict(os.environ))),
        ("API key works", check_live_call),
        ("Backup provider", lambda: check_second_provider(dict(os.environ))),
    ]

    print()
    all_passed = True
    for label, run in checks:
        if label == "API key works":
            print("  ...  asking a provider to answer. This takes a few seconds.",
                  flush=True)
        passed, message = run()
        mark = "PASS" if passed else "FAIL"
        print(f"[{mark}] {label}: {message}", flush=True)
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
