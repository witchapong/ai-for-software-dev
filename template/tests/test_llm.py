import pytest

from core.llm import ask, ask_structured


def test_ask_is_not_implemented_yet():
    with pytest.raises(NotImplementedError, match="LAB3"):
        ask("What is a resistor?")


def test_ask_structured_is_not_implemented_yet():
    with pytest.raises(NotImplementedError, match="LAB3"):
        ask_structured("What is a resistor?", schema={"type": "object"})
