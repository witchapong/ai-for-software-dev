# Slide style rules — lecture & workshop template

Rules for generating slides in my personal template. Build at **1920 × 1080**, light
theme, minimal. Academic lecture / hands-on workshop. Follow this file literally;
do not introduce styling that isn't described here.

## Tokens

```css
--paper:      oklch(0.985 0.004 85);  /* #FCFBF8  default slide background */
--paper-2:    oklch(0.955 0.008 85);  /* #F5F2EC  section dividers, takeaways, code blocks */
--ink:        oklch(0.25 0.008 85);   /* #332F2A  all body text; bg of full-bleed slides */
--ink-muted:  oklch(0.5 0.01 85);     /* secondary lines, captions, footers */
--hairline:   oklch(0.89 0.006 85);   /* 1px rules, figure borders */
--accent:     oklch(0.55 0.12 65);    /* ochre — numbers, eyebrows, one rule per slide */
```

Two backgrounds only: `--paper` for content slides, `--paper-2` for section dividers
and the takeaways slide. `--ink` as a background is reserved for full-bleed image
slides. The accent is never a fill behind text and never larger than a rule or a
numeral.

## Type

- Sans: **Libre Franklin** (300 / 400 / 500 / 600) — everything spoken.
- Mono: **IBM Plex Mono** (400 / 500) — everything indexical: numbers, eyebrows,
  labels, code, footers, captions, sources.

```
cover title      96px / 600 / lh 1.05 / ls -0.02em
divider, closing 80px / 600 / lh 1.08
slide title      56px / 600 / lh 1.10
cover subtitle   40px / 300 / lh 1.30
takeaway line    36px / 400 / lh 1.40
body             34px / 400 / lh 1.45   ← floor for prose
column body      32px / 400 / lh 1.45
code             28px / mono / lh 1.60
eyebrow, footer  24px / mono / ls 0.14em / uppercase   ← absolute floor
```

Never go below 24px. Eyebrows and footers are uppercase mono; nothing else is
uppercase.

## Frame

```
padding: 56px 88px 48px        (title/divider/closing slides: 96px 88px 48px)
title block + 1px rule ≈ top 170px
footer line            ≈ 48px
content area           = 1744 × 812
```

The larger-than-usual content area comes from a **compact title zone**, not from
thin margins. Never reduce the 88px side margins to fit more in.

Standard content slide skeleton:

```html
<section data-label="…" style="box-sizing:border-box;background:oklch(0.985 0.004 85);
  color:oklch(0.25 0.008 85);font-family:'Libre Franklin',Helvetica,sans-serif;
  display:flex;flex-direction:column;padding:56px 88px 48px">
  <div style="font-family:'IBM Plex Mono',monospace;font-size:24px;letter-spacing:0.14em;
    text-transform:uppercase;color:oklch(0.55 0.01 85)">Section 02</div>
  <div style="font-size:56px;font-weight:600;line-height:1.1;margin-top:10px">Slide title</div>
  <div style="height:1px;background:oklch(0.89 0.006 85);margin-top:26px"></div>
  <div style="flex:1;padding-top:52px">…content…</div>
  <div style="display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;
    font-size:24px;color:oklch(0.62 0.01 85)">
    <div>Course · Deck title</div><div>04</div>
  </div>
</section>
```

## Grids and spacing

```
two-column        1fr 1fr        gap 80px
figure + text     1.35fr 1fr     gap 64px
code + text       1.55fr 1fr     gap 56px
agenda            1fr 1fr        gap 36px 80px
bullet list gap   34px
takeaway gap      44px
content top pad   44–56px below the title rule
```

## The ten layouts

1. **Title** — accent mono course line at top; title 96px + 40px/300 subtitle in the
   middle; presenter and date on a 1px rule at the foot. `justify-content:space-between`.
2. **Agenda** — two columns numbered 01–06 in accent mono, read down the left column
   then down the right. Max six items.
3. **Section divider** — `--paper-2`, vertically centred, no footer. Accent mono
   `SECTION 0N`, 80px name, one 34px/300 line of framing. Identical every time.
4. **Title + body** — em-dash markers in accent, four lines maximum, each one a
   sentence. Bold the first two or three words when the line defines a term.
5. **Two-column** — comparison. Accent mono label over each column; keep the two
   sides the same visual length.
6. **Full-bleed image** — image fills the frame; caption band on `--ink` beneath it
   with a 34px/500 caption left and a mono source right. Never text over the image.
7. **Figure + caption** — diagram aspect-fit inside a hairline frame (never cropped),
   explanation in the narrow column, `Fig. N — source` in mono pinned to the bottom.
8. **Code** — ≤ 12 lines, 28px mono, `--paper-2` with a hairline border,
   `white-space:pre`. Narrow column holds the explanation plus a workshop prompt on a
   2px accent left rule.
9. **Takeaways** — `--paper-2`, three lines at 36px numbered 01–03 in accent mono, in
   the order taught. This is the slide students photograph.
10. **Closing / Q&A** — one 80px question on the left; reading, deadlines and office
    hours on the right; contact line on a 1px rule at the foot.

## Copy

- One idea per slide. A slide needing a second title is two slides.
- Titles are topic noun-phrases (`Failure models and timing assumptions`) or plain
  declarative statements. Pick one style per deck and hold it. Read the titles alone
  and check they trace the lecture.
- No punchline titles, no manufactured tension, no "It's not X, it's Y", no
  imperative slogans.
- Bullets are sentences, not fragments strung with colons. Max four.
- Cite figures and data on the slide, in mono, at the foot.
- Never a paragraph on a slide; long prose belongs in the handout.

## Never

Gradients · shadows · rounded cards · coloured callout boxes · left-border accent
cards · emoji · clip art · decorative icons · text over photographs · a third
background colour · a second accent hue · anything below 24px · hand-drawn SVG
illustrations.

## Image placeholders

Until real assets exist, use a striped placeholder with a mono label saying what
belongs there:

```html
<div style="background:repeating-linear-gradient(135deg,oklch(0.945 0.006 85) 0 12px,
  oklch(0.915 0.006 85) 12px 24px);border:1px solid oklch(0.89 0.006 85);
  display:flex;align-items:center;justify-content:center">
  <div style="font-family:'IBM Plex Mono',monospace;font-size:26px;letter-spacing:0.08em;
    color:oklch(0.5 0.01 85)">DROP FIGURE — aspect-fit, no crop</div>
</div>
```

## Deck mechanics

Slides are static inline-styled `<section data-label="…">` children of
`<deck-stage width="1920" height="1080">`; speaker notes go in
`data-speaker-notes` on the section. Don't set position/size on sections — the
stage does it. Write literal markup per slide, not loops or components, so every
line stays directly editable.
