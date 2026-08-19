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
