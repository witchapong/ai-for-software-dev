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
