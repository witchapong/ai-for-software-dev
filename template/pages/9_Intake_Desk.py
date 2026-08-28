"""Lab 3 reference solution: ten messy chat orders, two ways of reading them."""

import json
from pathlib import Path

import streamlit as st

from core.intake import extract_batch, load_menu, needs_review, order_total, score
from core.naive_parser import parse_all

SESSION3 = Path(__file__).resolve().parent.parent / "session3"

st.title("Intake Desk")
st.caption("Ten messy messages in. Ten clean rows out.")

inbox = json.loads((SESSION3 / "inbox.json").read_text(encoding="utf-8"))
answer_key = json.loads((SESSION3 / "answer_key.json").read_text(encoding="utf-8"))
menu = load_menu(SESSION3 / "menu.md")


def price(order: dict) -> str:
    """The order's cost in baht, or a warning when an item is not on the menu."""
    try:
        return f"{order_total(order, menu):,.0f}"
    except ValueError:
        return "not on the menu"


def show(orders: list[dict], with_totals: bool) -> dict:
    """One row per message, a tick or a cross against the answer key, and the marks."""
    result = score(orders, answer_key)
    rows = []
    for message, order in zip(inbox, orders):
        items = order.get("items") or []
        row = {
            "": "✗" if message["id"] in result["wrong_ids"] else "✓",
            "id": message["id"],
            "customer": order.get("customer", ""),
            "items": ", ".join(f"{i.get('qty')} x {i.get('name')}" for i in items),
            "pickup": order.get("pickup", ""),
        }
        if with_totals:
            row["total (baht)"] = price(order)
        rows.append(row)
    st.dataframe(rows, hide_index=True, width="stretch")

    columns = st.columns(4)
    columns[0].metric("Fully correct", f"{result['exact']} / {result['total']}")
    for column, field in zip(columns[1:], ("customer", "items", "pickup")):
        column.metric(field.title(), f"{result['by_field'][field]} / {result['total']}")
    return result


way = st.radio(
    "How should the desk read the inbox?",
    ["The old way (rules)", "The new way (model)"],
    horizontal=True,
)

if way == "The old way (rules)":
    st.write(
        "Regular expressions and a hand-written alias list. Nothing here is "
        "sabotaged - this is what twenty careful minutes buys you."
    )
    show([row["parsed"] or {} for row in parse_all(inbox)], with_totals=False)
else:
    st.write("One request, every message. Five lines replace the whole rules file.")
    if st.button("Read the inbox", type="primary"):
        try:
            with st.spinner("Asking the model to read all ten messages..."):
                orders = extract_batch([m["text"] for m in inbox], sorted(menu))
            for order, message in zip(orders, inbox):
                order["id"] = message["id"]
            st.session_state["orders"] = orders
        except RuntimeError as error:
            # No key, or no key the app can see. Say so plainly - a traceback
            # here tells a student nothing they can act on.
            st.error(str(error))
        except Exception as error:  # noqa: BLE001 - students must see the real reason
            st.error(f"The model call failed: {error}")
            st.caption(
                "Rate limit? Wait a minute and try again. Anything else, check "
                "TROUBLESHOOTING.md."
            )

    orders = st.session_state.get("orders")
    if orders:
        show(orders, with_totals=True)
        st.divider()
        st.subheader("Needs a human")
        flagged = needs_review(orders)
        if not flagged:
            st.success("Nothing escalated. Every order went straight through.")
        else:
            st.warning(f"{len(flagged)} of {len(orders)} orders stopped here.")
            st.dataframe(
                [
                    {"id": o["id"], "why": o.get("note") or "a field came back empty"}
                    for o in orders
                    if o.get("id") in flagged
                ],
                hide_index=True,
                width="stretch",
            )

with st.expander("Show the raw messages"):
    for message in inbox:
        st.text(f"{message['id']}  {message['text']}")
