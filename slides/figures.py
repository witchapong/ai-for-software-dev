#!/usr/bin/env python3
"""Figures for the lecture decks — figs 1-4 Session 1, 5-8 Session 2, 9-11 Session 3.

Writes eleven PNGs into slides/figures/, in the deck palette (SLIDE-STYLE.md):
paper, paper-2, ink, ink-muted, hairline, and ochre used sparingly as the one
accent per figure.

Run with the template virtualenv, which has numpy and matplotlib:

    /Users/witchapongdaroontham/Desktop/dev/ai-for-software-dev/template/.venv/bin/python figures.py
"""

import math
import os
import sys

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
from matplotlib.patches import FancyArrowPatch, Rectangle  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "figures")
TEMPLATE = os.path.join(os.path.dirname(HERE), "template")

# ---- palette (the deck's, exactly) ----
PAPER = "#FCFBF8"      # figure background
PAPER_2 = "#F5F2EC"    # box fills
INK = "#332F2A"        # text, box strokes, arrows
MUTED = "#77726A"      # secondary labels
HAIRLINE = "#E1DED7"   # frames, spine lines
OCHRE = "#A87A2E"      # one accent per figure

DPI = 200

plt.rcParams.update({
    "font.family": "monospace",
    "font.monospace": ["Menlo", "DejaVu Sans Mono", "Courier New"],
    "figure.facecolor": PAPER,
    "savefig.facecolor": PAPER,
    "axes.facecolor": PAPER,
    "text.color": INK,
    "axes.edgecolor": HAIRLINE,
    "axes.labelcolor": MUTED,
    "xtick.color": MUTED,
    "ytick.color": MUTED,
    "grid.color": HAIRLINE,
    "axes.grid": False,
})


# ---------------------------------------------------------------- primitives

def canvas(w_in, h_in):
    """A borderless drawing surface: x runs 0..100, y keeps units square."""
    fig = plt.figure(figsize=(w_in, h_in), dpi=DPI)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100 * h_in / w_in)
    ax.set_facecolor(PAPER)
    ax.axis("off")
    return fig, ax


def box(ax, cx, cy, w, h, lw=1.8):
    ax.add_patch(Rectangle((cx - w / 2.0, cy - h / 2.0), w, h,
                           facecolor=PAPER_2, edgecolor=INK,
                           linewidth=lw, joinstyle="miter", zorder=2))


def txt(ax, x, y, s, size, color=INK, ha="center", va="center", zorder=5):
    ax.text(x, y, s, fontsize=size, color=color, ha=ha, va=va, zorder=zorder)


def arrow(ax, p0, p1, style="-|>", color=INK, lw=1.8, rad=0.0,
          ls="solid", scale=26, zorder=3):
    ax.add_patch(FancyArrowPatch(p0, p1, arrowstyle=style, color=color,
                                 linewidth=lw, linestyle=ls,
                                 mutation_scale=scale, shrinkA=0, shrinkB=0,
                                 connectionstyle="arc3,rad=%s" % rad,
                                 joinstyle="miter", zorder=zorder))


def dot(ax, x, y, color=OCHRE, size=11, zorder=4):
    ax.plot([x], [y], marker="o", markersize=size, color=color,
            markeredgewidth=0, linestyle="none", zorder=zorder)


def dashed_arc(ax, p0, p1, rad, color=INK, lw=1.6, scale=22):
    """A dashed curve with a solid head.

    A dashed FancyArrowPatch dashes its arrowhead outline too, which notches
    the head. Draw the curve and the head as separate objects instead.
    """
    (x0, y0), (x1, y1) = p0, p1
    dx, dy = x1 - x0, y1 - y0
    cx = (x0 + x1) / 2.0 + rad * dy
    cy = (y0 + y1) / 2.0 - rad * dx
    t = np.linspace(0.0, 0.90, 80)
    bx = (1 - t) ** 2 * x0 + 2 * t * (1 - t) * cx + t ** 2 * x1
    by = (1 - t) ** 2 * y0 + 2 * t * (1 - t) * cy + t ** 2 * y1
    ax.plot(bx, by, color=color, lw=lw, linestyle=(0, (5, 4)),
            solid_capstyle="butt", zorder=3)
    ax.add_patch(FancyArrowPatch((bx[-1], by[-1]), (x1, y1), arrowstyle="-|>",
                                 color=color, linewidth=lw,
                                 mutation_scale=scale, shrinkA=0, shrinkB=0,
                                 joinstyle="miter", zorder=3))


# ------------------------------------------------------ fig 1 — the architecture

def fig_harness_model():
    fig, ax = canvas(9.66, 7.2)

    ROW = 51.0          # the spine every box centres on
    TOP, BOT = 66.0, 36.0
    MID = (TOP + BOT) / 2
    HARNESS_X, MODEL_X = 35.5, 84.75

    # YOU
    box(ax, 4.75, ROW, 7.5, 8.0)
    txt(ax, 4.75, ROW, "YOU", 17)

    # YOU -> CLINE
    arrow(ax, (8.5, ROW), (24.0, ROW))
    txt(ax, 16.25, ROW + 3.4, "instruction", 12.5, color=MUTED)

    # CLINE, the harness
    box(ax, HARNESS_X, MID, 23.0, TOP - BOT)
    txt(ax, HARNESS_X, 61.5, "CLINE", 21)
    txt(ax, HARNESS_X, 57.0, "THE HARNESS", 13, color=MUTED)
    for i, line in enumerate(("reads your files",
                              "applies the edits",
                              "runs the commands")):
        txt(ax, HARNESS_X, 49.5 - i * 4.5, line, 12.5, color=MUTED)

    # CLINE <-> your files
    arrow(ax, (HARNESS_X, BOT), (HARNESS_X, 26.0), style="<|-|>")
    box(ax, HARNESS_X, 22.0, 20.0, 8.0)
    txt(ax, HARNESS_X, 22.0, "YOUR FILES", 13.5)
    txt(ax, HARNESS_X, 12.5, "runs in your Codespace", 12.5, color=MUTED)

    # CLINE <-> the model
    arrow(ax, (47.0, ROW), (70.75, ROW), style="<|-|>")
    txt(ax, 58.875, ROW + 3.4, "text in · text out", 12.5, color=MUTED)

    # THE MODEL
    box(ax, MODEL_X, MID, 28.0, TOP - BOT)
    txt(ax, MODEL_X, 61.5, "THE MODEL", 21)
    txt(ax, MODEL_X, 57.0, "MISTRAL · GEMINI", 13, color=MUTED)
    txt(ax, MODEL_X, 48.5, "predicts the next words", 12.5, color=MUTED)
    txt(ax, MODEL_X, 42.5, "never sees your disk", 12.5, color=MUTED)

    # the one accent
    arrow(ax, (MODEL_X, 30.0), (MODEL_X, 35.4), color=OCHRE, lw=1.6, scale=22)
    txt(ax, MODEL_X, 27.0, "swap it in three clicks", 13.5, color=OCHRE)

    save(fig, "fig-harness-model.png")


# ------------------------------------------------------------ fig 2 — the cycle

def fig_agent_loop():
    fig, ax = canvas(9.66, 7.2)

    CX, CY, R = 50.0, 38.0, 25.0
    BW, BH = 15.0, 6.5
    DELTA = 22.0        # degrees of clearance each side of a node

    nodes = [
        ("READ", "your files", 90.0),
        ("PLAN", "the model decides", 18.0),
        ("EDIT", "writes to disk", -54.0),
        ("RUN", "tests execute", -126.0),
        ("OBSERVE", "reads the output", -198.0),
    ]

    def on_circle(deg):
        r = math.radians(deg)
        return CX + R * math.cos(r), CY + R * math.sin(r)

    # arcs first, so the boxes sit on top of anything that grazes them
    for i in range(len(nodes)):
        a0 = nodes[i][2] - DELTA
        a1 = nodes[i][2] - 72.0 + DELTA
        closing = i == len(nodes) - 1          # OBSERVE -> READ
        arrow(ax, on_circle(a0), on_circle(a1), rad=-0.14,
              color=OCHRE if closing else INK,
              lw=1.9 if closing else 1.8, scale=24)

    for label, gloss, deg in nodes:
        x, y = on_circle(deg)
        box(ax, x, y, BW, BH)
        txt(ax, x, y, label, 16)
        txt(ax, x, y - BH / 2 - 2.8, gloss, 13, color=MUTED)

    # the hub sits below the ring's centre, clear of the side glosses, so the
    # two do not read as one line of text
    txt(ax, CX, 36.5, "one instruction", 18)
    txt(ax, CX, 31.0, "≈ 4–10 laps", 18)

    save(fig, "fig-agent-loop.png")


# --------------------------------------------------------- fig 3 — the pipeline

def fig_four_gates():
    fig, ax = canvas(9.66, 6.9)

    SPINE = 38.0
    BW, BH = 13.0, 9.0
    stations = [
        (10.0, "INTENT", "you write it"),
        (30.0, "SPEC", "agent drafts"),
        (50.0, "PLAN", "agent drafts"),
        (70.0, "BUILD", "one task at a time"),
        (90.0, "SHIP", "public URL"),
    ]

    ax.plot([3.5, 96.5], [SPINE, SPINE], color=HAIRLINE, lw=1.6,
            solid_capstyle="butt", zorder=1)

    for x, label, gloss in stations:
        box(ax, x, SPINE, BW, BH)
        txt(ax, x, SPINE, label, 16)
        txt(ax, x, SPINE - BH / 2 - 4.5, gloss, 13, color=MUTED)

    for x in (20.0, 40.0, 60.0, 80.0):
        dot(ax, x, SPINE)

    # build loops back to plan
    dashed_arc(ax, (70.0, SPINE + BH / 2 + 2.0), (50.0, SPINE + BH / 2 + 2.0),
               rad=0.4)
    txt(ax, 60.0, SPINE + 13.5, "next unit", 13)

    # legend, bottom left
    dot(ax, 5.0, 18.5)
    txt(ax, 7.6, 18.5, "= you approve", 13, color=MUTED, ha="left")

    save(fig, "fig-four-gates.png")


# ------------------------------------------------------- fig 4 — the real thing

def fig_spectrum():
    sys.path.insert(0, TEMPLATE)
    from core.spectrum import make_signal, spectrum

    FS, DURATION = 1000.0, 1.0
    times, signal = make_signal([(50.0, 1.0), (120.0, 0.5)], FS, DURATION)
    freqs, magnitudes = spectrum(signal, FS)

    fig, (top, bottom) = plt.subplots(2, 1, figsize=(9.66, 7.2), dpi=DPI)

    top.plot(times[:200], signal[:200], color=INK, linewidth=1.6)
    top.set_xlabel("Time (seconds)", fontsize=12.5)
    top.set_ylabel("Amplitude", fontsize=12.5)
    top.set_title("THE SIGNAL", fontsize=15, color=INK, loc="left", pad=10)

    _, stems, base = bottom.stem(freqs, magnitudes, markerfmt=" ", basefmt=" ")
    plt.setp(stems, color=INK, linewidth=1.6)
    plt.setp(base, visible=False)
    bottom.set_xlim(0, 240)
    bottom.set_ylim(0, 1.2)
    bottom.set_xlabel("Frequency (Hz)", fontsize=12.5)
    bottom.set_ylabel("Amplitude", fontsize=12.5)
    bottom.set_title("WHAT IT IS MADE OF", fontsize=15, color=INK, loc="left",
                     pad=10)

    bottom.annotate("1.0 — exactly what you set", xy=(52, 1.0),
                    xytext=(78, 0.87), fontsize=13, color=OCHRE,
                    ha="left", va="center",
                    arrowprops=dict(arrowstyle="-|>", color=OCHRE, lw=1.6,
                                    shrinkA=2, shrinkB=2))
    bottom.annotate("0.5", xy=(122, 0.5), xytext=(142, 0.63), fontsize=13,
                    color=OCHRE, ha="left", va="center",
                    arrowprops=dict(arrowstyle="-|>", color=OCHRE, lw=1.6,
                                    shrinkA=2, shrinkB=2))

    for ax in (top, bottom):
        ax.set_facecolor(PAPER)
        ax.grid(True, color=HAIRLINE, linewidth=0.9)
        ax.set_axisbelow(True)
        for spine in ax.spines.values():
            spine.set_color(HAIRLINE)
            spine.set_linewidth(1.2)
        ax.tick_params(labelsize=12, colors=MUTED, length=3, width=1.0)

    fig.tight_layout(pad=1.6)
    save(fig, "fig-spectrum.png")


# ------------------------------------------------ primitives for the session 2 set

def qbez(x0, y0, cx, cy, x1, y1, n=240):
    """Points along a quadratic Bezier — the branch curves in fig 6."""
    t = np.linspace(0.0, 1.0, n)
    bx = (1 - t) ** 2 * x0 + 2 * t * (1 - t) * cx + t ** 2 * x1
    by = (1 - t) ** 2 * y0 + 2 * t * (1 - t) * cy + t ** 2 * y1
    return bx, by


def curve(ax, x0, y0, cx, cy, x1, y1, color=INK, lw=1.8, zorder=2):
    bx, by = qbez(x0, y0, cx, cy, x1, y1)
    ax.plot(bx, by, color=color, lw=lw, solid_capstyle="round", zorder=zorder)


def bez_at(x0, y0, cx, cy, x1, y1, t):
    return ((1 - t) ** 2 * x0 + 2 * t * (1 - t) * cx + t ** 2 * x1,
            (1 - t) ** 2 * y0 + 2 * t * (1 - t) * cy + t ** 2 * y1)


# ------------------------------------------------------- fig 5 — the ownership map

def fig_ownership_map():
    fig, ax = canvas(9.66, 7.2)

    # the file nobody owns
    box(ax, 50.0, 66.0, 36.0, 8.0)
    txt(ax, 50.0, 66.0, "app.py", 15)
    txt(ax, 50.0, 58.5, "nobody's file — rarely edited", 11.5, color=MUTED)

    # one page per person: the tags are this figure's single accent
    pages = [(14.0, "pages/1_A.py", "OWNER A"),
             (38.0, "pages/2_B.py", "OWNER B"),
             (62.0, "pages/3_C.py", "OWNER C"),
             (86.0, "pages/4_D.py", "OWNER D")]
    for cx, name, owner in pages:
        box(ax, cx, 45.0, 21.0, 9.0)
        txt(ax, cx, 45.0, name, 12.5)
        txt(ax, cx + 10.5, 51.5, owner, 11.5, color=OCHRE, ha="right")

    # the shared core, and the tests every task adds to
    for cx, name, gloss in ((19.0, "core/models.py", "one owner"),
                            (50.0, "core/storage.py", "already written — leave it"),
                            (81.0, "tests/", "every task adds one")):
        box(ax, cx, 25.0, 28.0, 9.0)
        txt(ax, cx, 25.0, name, 12.5)
        txt(ax, cx, 17.0, gloss, 11.5, color=MUTED)

    # pages read the core — drawn thin so the boxes stay the subject
    for x0, x1 in ((14.0, 16.0), (38.0, 24.0), (62.0, 44.0), (86.0, 58.0)):
        arrow(ax, (x0, 40.5), (x1, 30.4), lw=1.2, scale=18)
    txt(ax, 23.5, 36.0, "uses", 11.5, color=MUTED)

    txt(ax, 3.0, 9.0, "one tag = one owner = no merge conflicts", 11.5,
        color=MUTED, ha="left")

    save(fig, "fig-ownership-map.png")


# ------------------------------------------------------ fig 6 — the road to main

def fig_branch_merge():
    fig, ax = canvas(9.66, 7.2)

    MAIN = 42.0

    # main itself
    ax.plot([11.0, 77.5], [MAIN, MAIN], color=INK, lw=4.5,
            solid_capstyle="butt", zorder=1)
    txt(ax, 3.0, MAIN, "MAIN", 16, ha="left")

    branches = [
        # x_out, ctrl_x, ctrl_y, x_in, label, label_y
        (17.0, 27.5, 68.0, 38.0, "branch: a-booking-page", 60.5),
        (22.0, 42.0, 14.0, 62.0, "branch: b-browse-page", 22.5),
    ]
    for x0, cx, cy, x1, label, ly in branches:
        curve(ax, x0, MAIN, cx, cy, x1, MAIN)
        for t in (0.25, 0.5, 0.75):
            px_, py_ = bez_at(x0, MAIN, cx, cy, x1, MAIN, t)
            dot(ax, px_, py_, color=INK, size=6)
        txt(ax, (x0 + x1) / 2.0, ly, label, 12.5)

    for x1 in (38.0, 62.0):
        box(ax, x1, MAIN, 8.5, 5.2)
        txt(ax, x1, MAIN, "PR", 13)
        dot(ax, x1 + 6.75, MAIN, size=9)          # the accent: a human read it
        txt(ax, x1 + 6.0, 37.0, "CI: pytest runs", 10.5, color=MUTED)

    box(ax, 86.0, MAIN, 17.0, 8.0)
    txt(ax, 86.0, MAIN, "DEPLOY", 15)

    dot(ax, 4.0, 8.0, size=9)
    txt(ax, 7.0, 8.0, "= a teammate reads every line before it merges", 11.5,
        color=MUTED, ha="left")

    save(fig, "fig-branch-merge.png")


# --------------------------------------------------------- fig 7 — the shape of today

def fig_mob_parallel():
    fig, ax = canvas(9.66, 7.2)

    # phase 1 — everyone on one screen
    box(ax, 12.5, 45.5, 23.0, 30.0)
    txt(ax, 12.5, 53.0, "ONE SCREEN", 14)
    for x in (8.0, 11.0, 14.0, 17.0):
        dot(ax, x, 46.0, color=INK, size=6.5)
    txt(ax, 12.5, 38.0, "intent · spec · plan", 10, color=MUTED)

    # phase 2 — one machine, one file, one branch each. The gloss sits inside
    # its box: set below it, it reads as belonging to the box underneath.
    rows = [(62.0, "CODESPACE A", 57.0), (51.0, "CODESPACE B", 55.0),
            (40.0, "CODESPACE C", 53.0), (29.0, "CODESPACE D", 51.0)]
    for cy, label, target in rows:
        arrow(ax, (24.5, 45.5), (30.5, cy), lw=1.4, scale=20)
        box(ax, 48.0, cy, 34.0, 9.0)
        txt(ax, 48.0, cy + 1.7, label, 13)
        txt(ax, 48.0, cy - 2.3, "own agent · own file · own branch", 10,
            color=MUTED)
        # each arrow lands on its own point of the PR box's edge, or four
        # arrowheads stack into one black blob
        arrow(ax, (65.5, cy), (73.0, target), lw=1.4, scale=20)

    # phase 3 — converge through review, then main
    box(ax, 85.0, 54.0, 23.0, 9.0)
    dot(ax, 77.0, 54.0, size=10)                  # the accent: one review
    txt(ax, 87.0, 54.0, "PULL REQUESTS", 12.5)
    arrow(ax, (85.0, 49.5), (85.0, 41.0), lw=1.6, scale=22)
    box(ax, 85.0, 36.0, 23.0, 9.0)
    txt(ax, 85.0, 36.0, "MAIN → DEPLOY", 12.5)

    for cx, caption in ((13.0, "argue together · 25 min"),
                        (48.0, "build alone · 50 min"),
                        (85.0, "converge · 25 min")):
        txt(ax, cx, 13.0, caption, 10.5, color=MUTED)

    save(fig, "fig-mob-parallel.png")


# ------------------------------------------------------------ fig 8 — the brief menu

def fig_brief_menu():
    fig, ax = canvas(9.66, 7.2)

    briefs = [
        (12.0, "CARPOOL",   "seats never",     "oversold"),
        (31.0, "SESSIONS",  "no overlapping",  "commitments"),
        (50.0, "TUTORING",  "'calc 2' equals", "'Calculus II'"),
        (69.0, "ROOMMATES", "score(A,B) =",    "score(B,A)"),
        (88.0, "BILLS",     "every satang",    "accounted for"),
    ]
    for cx, name, g1, g2 in briefs:
        box(ax, cx, 56.0, 16.0, 11.0)
        txt(ax, cx, 56.0, name, 13)
        txt(ax, cx, 46.5, g1, 10.5, color=MUTED)
        txt(ax, cx, 42.8, g2, 10.5, color=MUTED)

    ax.plot([4.0, 96.0], [35.0, 35.0], color=HAIRLINE, lw=1.6,
            solid_capstyle="butt", zorder=1)

    txt(ax, 50.0, 28.5,
        "each hides one bug that looks fine on screen — only a test catches it",
        13, color=OCHRE)

    txt(ax, 96.0, 17.5, "your twist: one invented feature, named at Gate 1",
        11, color=MUTED, ha="right")

    save(fig, "fig-brief-menu.png")


# ---------------------------------------- primitives for the session 3 set

# Menlo has no Thai glyphs, and one example line in fig 9 is a Thai order.
# Matplotlib falls back glyph by glyph when it is handed a list of families,
# so the Latin text still sets in Menlo and only the Thai borrows Thonburi.
THAI_STACK = ["Menlo", "Thonburi", "DejaVu Sans Mono"]


def txt_mixed(ax, x, y, s, size, color=INK, ha="center", va="center"):
    """txt(), but with a font stack that covers Thai."""
    ax.text(x, y, s, fontsize=size, color=color, ha=ha, va=va, zorder=5,
            family=THAI_STACK)


def ghost_box(ax, cx, cy, w, h, lw=1.4):
    """A box drawn in muted outline — something outside the main flow."""
    ax.add_patch(Rectangle((cx - w / 2.0, cy - h / 2.0), w, h,
                           facecolor=PAPER, edgecolor=MUTED,
                           linewidth=lw, joinstyle="miter", zorder=2))


def leader(ax, x0, x1, y, color=INK, lw=1.0):
    """A hairline pointing from an annotation back into the thing annotated."""
    ax.plot([x0, x1], [y, y], color=color, lw=lw, solid_capstyle="butt",
            zorder=4)


# ------------------------------------------- fig 9 — software with a model inside

def fig_llm_software():
    fig, ax = canvas(9.66, 7.2)

    BOX_W, BOX_H, ROW = 18.0, 9.0, 58.0
    XS = [12.0, 37.33, 62.67, 88.0]          # 4 boxes, 3 gaps, 3-unit margins
    GLOSS = [49.6, 46.4, 43.2]               # three slots beneath every box

    for cx, label in zip(XS, ("MESSY INPUT", "THE MODEL",
                              "STRUCTURED DATA", "YOUR CODE")):
        box(ax, cx, ROW, BOX_W, BOX_H)
        txt(ax, cx, ROW, label, 12.5)

    for i in range(3):                        # the pipeline itself
        arrow(ax, (XS[i] + BOX_W / 2 + 0.6, ROW),
              (XS[i + 1] - BOX_W / 2 - 0.6, ROW), lw=1.8, scale=24)

    # 1 — what the customers actually send
    for line, y in zip(("2 iced lattes 3pm — Ploy",
                        "ลาเต้ร้อน 20 แก้ว",
                        "a black coffee thanks"), GLOSS):
        txt_mixed(ax, XS[0], y, line, 9.5, color=MUTED)

    # 2 — the model, and 4 — your code
    for cx, lines in ((XS[1], ("reads language,", "fills a shape")),
                      (XS[3], ("totals, storage,", "rules, screens"))):
        for line, y in zip(lines, GLOSS):
            txt(ax, cx, y, line, 10, color=MUTED)

    # 3 — the shape the model fills
    for line, y in zip(("{ customer,", "  items[], pickup }"), GLOSS):
        txt(ax, XS[2], y, line, 10, color=MUTED)

    # the bracket under stages 2 and 3
    bx0, bx1, by = XS[1] - BOX_W / 2, XS[2] + BOX_W / 2, 39.5
    ax.plot([bx0, bx0, bx1, bx1], [by + 1.6, by, by, by + 1.6],
            color=MUTED, lw=1.4, solid_capstyle="butt", zorder=2)
    txt(ax, (bx0 + bx1) / 2, 35.5, "the adapter", 12, color=MUTED)

    # the one accent: the half of the system that must never guess
    for line, y in zip(("arithmetic, money", "and decisions", "stay here"),
                       (39.5, 36.3, 33.1)):
        txt(ax, XS[3], y, line, 10.5, color=OCHRE)

    ax.plot([4.0, 96.0], [25.0, 25.0], color=HAIRLINE, lw=1.6,
            solid_capstyle="butt", zorder=1)
    txt(ax, 50.0, 18.0, "the model never touches the till", 13, color=MUTED)

    save(fig, "fig-llm-software.png")


# ------------------------------------------------- fig 10 — the parts of a prompt

def fig_prompt_anatomy():
    fig, ax = canvas(9.66, 7.2)

    # the prompt, abbreviated to fit. The pickup rule is lifted above the qty
    # rule so the five labels can run top to bottom without their leader lines
    # crossing; core/intake.py has them the other way round.
    LINES = [
        "You are the order desk of a small café.",
        "Turn each chat message into one order.",
        "- name must be copied EXACTLY from",
        "  this menu: Espresso, Americano, ...",
        "  Never invent an item name.",
        "- pickup is 24-hour HH:MM. 3pm is",
        "  15:00, noon is 12:00.",
        "- qty is a whole number. Use 1 when",
        "  the customer names no number.",
        "- needs_review is true when you had",
        "  to guess. note says what.",
    ]
    TOP, STEP = 59.5, 3.6
    box(ax, 29.5, 41.5, 53.0, 45.0)
    for i, line in enumerate(LINES):
        txt_mixed(ax, 6.5, TOP - i * STEP, line, 13, ha="left")

    # one label per part, each pinned to the line it names
    labels = [
        (1, "ROLE", "who is reading this"),
        (4, "VOCABULARY", "the only values allowed"),
        (6, "FORMAT", "ambiguity resolved by example"),
        (8, "DEFAULTS", "what to do when unsure"),
        (10, "ESCALATION", "permission to say “not sure”"),
    ]
    for n, name, gloss in labels:
        y = TOP - (n - 1) * STEP
        leader(ax, 52.0, 60.5, y)
        txt(ax, 62.0, y + 1.7, name, 12.5, ha="left")
        txt(ax, 62.0, y - 1.7, gloss, 10.5, color=MUTED, ha="left")

    txt(ax, 29.5, 13.5,
        "notice what is missing: not one example of a finished order",
        11, color=OCHRE)

    save(fig, "fig-prompt-anatomy.png")


# ------------------------------------------------ fig 11 — improving on purpose

def fig_prompt_loop():
    fig, ax = canvas(9.66, 7.2)

    BW, BH = 27.0, 11.0
    LX, RX, TY, BY = 16.0, 54.0, 58.0, 36.0
    stages = [
        (LX, TY, "WRITE A TEST SET", "messages with known answers"),
        (RX, TY, "MEASURE", "score, do not eyeball"),
        (RX, BY, "CHANGE ONE THING", "one line, one run"),
        (LX, BY, "MEASURE AGAIN", "kept or reverted?"),
    ]
    for cx, cy, label, gloss in stages:
        box(ax, cx, cy, BW, BH)
        txt(ax, cx, cy + 2.4, label, 13)
        txt(ax, cx, cy - 2.6, gloss, 10, color=MUTED)

    # clockwise: write -> measure -> change -> measure again
    arrow(ax, (LX + BW / 2 + 0.6, TY), (RX - BW / 2 - 0.6, TY), scale=24)
    arrow(ax, (RX, TY - BH / 2 - 0.6), (RX, BY + BH / 2 + 0.6), scale=24)
    arrow(ax, (RX - BW / 2 - 0.6, BY + 2.8), (LX + BW / 2 + 0.6, BY + 2.8),
          scale=24)

    # the one accent: the edge you travel over and over
    arrow(ax, (LX + BW / 2 + 0.6, BY - 2.8), (RX - BW / 2 - 0.6, BY - 2.8),
          color=OCHRE, lw=1.9, scale=24)
    txt(ax, (LX + RX) / 2, 27.5, "keep looping", 10.5, color=OCHRE)

    # and the way out, off to one side
    ghost_box(ax, 85.0, 17.0, 20.0, 9.0)
    txt(ax, 85.0, 17.0, "SHIP IT", 13, color=MUTED)
    dashed_arc(ax, (LX, BY - BH / 2 - 0.4), (74.6, 17.2), 0.16,
               color=MUTED, lw=1.5)
    txt(ax, 57.0, 21.5, "when it stops improving", 10.5, color=MUTED)

    txt(ax, 50.0, 6.5,
        "same prompt, two runs, two answers — so measure many, never one",
        11, color=MUTED)

    save(fig, "fig-prompt-loop.png")


# ------------------------------------------------------------------------ main

def _trim(path, margin=28):
    """Crop the saved PNG to what was actually drawn, plus a small margin.

    figureSlide aspect-fits the image inside a fixed frame, so any blank band
    a figure leaves around its content is paid for twice: once as empty pixels
    and again as a smaller rendering of everything else. Trimming to the ink
    lets the content fill the frame, which is the difference between annotation
    labels that read from the back row and labels that do not.
    """
    from PIL import Image

    image = Image.open(path).convert("RGB")
    grey = np.array(image.convert("L"))
    rows = np.where((grey < 235).any(axis=1))[0]
    columns = np.where((grey < 235).any(axis=0))[0]
    if rows.size == 0 or columns.size == 0:
        return
    top = max(0, rows.min() - margin)
    bottom = min(grey.shape[0], rows.max() + margin)
    left = max(0, columns.min() - margin)
    right = min(grey.shape[1], columns.max() + margin)
    image.crop((left, top, right, bottom)).save(path)


def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=DPI, facecolor=PAPER)
    plt.close(fig)
    _trim(path)
    from PIL import Image

    with Image.open(path) as trimmed:
        print("%-28s %d x %d" % (name, trimmed.width, trimmed.height))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    fig_harness_model()
    fig_agent_loop()
    fig_four_gates()
    fig_spectrum()
    fig_ownership_map()
    fig_branch_merge()
    fig_mob_parallel()
    fig_brief_menu()
    fig_llm_software()
    fig_prompt_anatomy()
    fig_prompt_loop()
