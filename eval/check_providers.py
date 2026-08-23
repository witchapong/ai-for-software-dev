"""Test every configured provider and print what actually works.

Usage:  template/.venv/bin/python eval/check_providers.py

Reports each provider's status and, for Mistral, its live rate limits pulled
from the API's own response headers. Never prints a key.
"""

import json
import os
import urllib.request
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / "template" / ".env")
PLACEHOLDER = "paste-your-key-here"


def short(error: Exception) -> str:
    text = str(error)
    if "'message': '" in text:
        return text.split("'message': '")[-1].split("',")[0][:100]
    return text[:100]


def gemini(key: str) -> None:
    from google import genai

    client = genai.Client(api_key=key)
    for model in ("gemini-flash-latest", "gemini-3.6-flash", "gemini-2.5-flash"):
        try:
            reply = client.models.generate_content(
                model=model, contents="Reply with one word: ok"
            )
            print(f"  WORKS   {model:22} -> {reply.text.strip()[:15]!r}")
        except Exception as error:  # noqa: BLE001
            print(f"  blocked {model:22} -> {short(error)}")


def mistral(key: str) -> None:
    body = json.dumps(
        {
            "model": "mistral-medium-latest",
            "max_tokens": 5,
            "messages": [{"role": "user", "content": "ok"}],
        }
    ).encode()
    request = urllib.request.Request(
        "https://api.mistral.ai/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            headers = response.headers
            print("  WORKS   mistral-medium-latest")
            tpm = headers.get("x-ratelimit-limit-tokens-minute")
            rpm = headers.get("x-ratelimit-limit-req-minute")
            if tpm and rpm:
                print(f"          live limits: {int(tpm):,} tokens/min, {rpm} requests/min")
                print(f"          at ~8,200 tokens per agentic request that is "
                      f"~{int(tpm) // 8200} requests/min")
    except Exception as error:  # noqa: BLE001
        print(f"  blocked mistral-medium-latest -> {short(error)}")


def main() -> None:
    for name, env_name, check in (
        ("Google AI Studio", "GEMINI_API_KEY", gemini),
        ("Mistral", "MISTRAL_API_KEY", mistral),
    ):
        key = (os.environ.get(env_name) or "").strip()
        print(f"\n{name}")
        if not key or key == PLACEHOLDER:
            print(f"  no {env_name} set")
            continue
        check(key)
    print()


if __name__ == "__main__":
    main()
