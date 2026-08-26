#!/usr/bin/env python3
"""Figures for the Session 1 deck.

Writes four PNGs into slides/figures/, in the deck palette (SLIDE-STYLE.md):
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


# ------------------------------------------------------------------------ main

def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=DPI, facecolor=PAPER)
    plt.close(fig)
    print("%-28s %d x %d" % (name, fig.get_size_inches()[0] * DPI,
                             fig.get_size_inches()[1] * DPI))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    fig_harness_model()
    fig_agent_loop()
    fig_four_gates()
    fig_spectrum()
