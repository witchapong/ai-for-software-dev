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

**Brand marks are the one exception, and only under the rules below.** The ban is
on *decorative* icons. A brand mark that names a tool the slide is already about
carries information, in the same role as a figure's source line.

## Brand marks

A row of tool logos, right-aligned on the eyebrow baseline. It answers "which
tool is this slide about?" at a glance, on a deck whose subject is tools.

The element is deliberately rigid, because the thing that makes an icon
decoration is discretion about where it goes:

- **Monochrome `--ink-muted`. Never brand colours.** A dozen brand hues on warm
  paper breaks both the two-background rule and the single-accent rule.
- **One fixed size, 32px square**, from a 24x24 viewBox, so every mark occupies
  an identical box whatever its drawn shape.
- **Right-aligned to the right margin, on the eyebrow row**, 22px apart. Never
  anywhere else on the slide, never inline with body text.
- **Six per slide at most.**
- **Only where the slide's own body text names the tool.** A mark is a label for
  something already said, never a substitute for saying it.
- **Never on the title slide, a section divider, or the closing slide.**

Paths come from `simple-icons` (CC0); the trademarks remain their owners' and
are used nominatively, exactly as naming the tool in prose would be.

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

## Deck mechanics (HTML reference deck)

Slides are static inline-styled `<section data-label="…">` children of
`<deck-stage width="1920" height="1080">`; speaker notes go in
`data-speaker-notes` on the section. Don't set position/size on sections — the
stage does it. Write literal markup per slide, not loops or components, so every
line stays directly editable.

---

# Building .pptx with PptxGenJS

This is the primary build path. Generate the deck programmatically with
[PptxGenJS](https://gitbrent.github.io/PptxGenJS/); do not hand-author HTML unless
asked.

```
npm i pptxgenjs
```

## Units

The design is specified in 1920 × 1080 CSS px. A 16:9 slide is 13.333 × 7.5 in =
960 × 540 pt, so the conversions are exact:

```
position / size:  inches = px / 144
font size:        points = px / 2
letter-spacing:   charSpacing (pt) = em * fontPx / 2
```

Always derive geometry from the px values in this document through `px()` / `pt()`
— never retype converted numbers, or the layouts drift apart.

```js
import PptxGenJS from "pptxgenjs";

const px = v => v / 144;   // px -> inches
const pt = v => v / 2;     // px -> points

const pres = new PptxGenJS();
pres.defineLayout({ name: "DECK", width: px(1920), height: px(1080) });
pres.layout = "DECK";
```

## Palette

PptxGenJS takes hex without the `#`:

```js
const PAPER     = "FCFBF8";  // default slide background
const PAPER_2   = "F5F2EC";  // dividers, takeaways, code blocks
const INK       = "332F2A";  // all body text
const INK_MUTED = "77726A";  // secondary lines, captions
const FOOTER_C  = "99948B";  // footer text only
const HAIRLINE  = "E1DED7";  // 1px rules, figure borders
const ACCENT    = "A87A2E";  // ochre
const INK_BG    = "332F2A";  // full-bleed image slide background
const ON_INK    = "FCFBF8";
const ON_INK_2  = "B4AFA6";
```

## Fonts

```js
const SANS = "Libre Franklin";
const MONO = "IBM Plex Mono";
```

Set `fontFace` on every text call — nothing is inherited. If the target machine may
lack these, fall back to `"Helvetica Neue"` / `"Consolas"` and say so in the run
output.

## Type scale

| role | px | pt | bold |
|---|---|---|---|
| cover title | 96 | 48 | yes |
| divider, closing | 80 | 40 | yes |
| slide title | 56 | 28 | yes |
| cover subtitle | 40 | 20 | no |
| takeaway line | 36 | 18 | no |
| body | 34 | 17 | no |
| column body | 32 | 16 | no |
| code | 28 | 14 | mono |
| eyebrow, footer | 24 | 12 | mono, charSpacing 1.7, uppercase |

PowerPoint has no weight axis: `bold: true` stands in for the 600 weight, and
300/400 are both plain.

## Geometry

```js
const M_X = 88, M_TOP = 56, M_TOP_LG = 96, M_BOT = 48;
const W = 1920 - 2 * M_X;          // 1744, content width
const TITLE_Y  = M_TOP + 44;
const RULE_Y   = M_TOP + 130;      // hairline under the title
const BODY_Y   = RULE_Y + 52;      // content starts here
const FOOTER_Y = 1080 - M_BOT - 34;
const BODY_H   = FOOTER_Y - BODY_Y;   // 1744 × 812 content box
```

## Building blocks

```js
const slide = (bg = PAPER) => {
  const s = pres.addSlide();
  s.background = { color: bg };
  return s;
};

/** runs: a string, or [[text, bold], ...] for mixed emphasis. */
const text = (s, x, y, w, h, runs, size, o = {}) => {
  const {
    color = INK, font = SANS, bold = false, line = 1.45,
    align = "left", valign = "top", space, caps = false,
  } = o;
  const body = (typeof runs === "string" ? [[runs, bold]] : runs).map(
    ([t, b]) => ({ text: caps ? t.toUpperCase() : t, options: { bold: !!b } })
  );
  s.addText(body, {
    x: px(x), y: px(y), w: px(w), h: px(h),
    fontFace: font, fontSize: pt(size), color, bold,
    lineSpacingMultiple: line, align, valign,
    charSpacing: space ? (space * size) / 2 : 0,
    margin: 0, shadow: { type: "none" },
  });
};

const rule = (s, x, y, w, color = HAIRLINE, thickness = 1) =>
  s.addShape(pres.ShapeType.rect, {
    x: px(x), y: px(y), w: px(w), h: px(thickness),
    fill: { color }, line: { type: "none" }, shadow: { type: "none" },
  });

const eyebrow = (s, label, color = INK_MUTED) =>
  text(s, M_X, M_TOP, W, 34, label, 24,
       { color, font: MONO, space: 0.14, caps: true });

const footer = (s, left, page) => {
  text(s, M_X, FOOTER_Y, W - 200, 34, left, 24, { color: FOOTER_C, font: MONO });
  text(s, 1920 - M_X - 200, FOOTER_Y, 200, 34, page, 24,
       { color: FOOTER_C, font: MONO, align: "right" });
};

/** Standard content-slide frame: eyebrow, title, hairline, footer. */
const chrome = (s, eyebrowText, title, footerLeft, page) => {
  eyebrow(s, eyebrowText);
  text(s, M_X, TITLE_Y, W, 80, title, 56, { bold: true, line: 1.1 });
  rule(s, M_X, RULE_Y, W);
  footer(s, footerLeft, page);
};

/** Stand-in for an image the user will drop in. */
const placeholder = (s, x, y, w, h, label) => {
  s.addShape(pres.ShapeType.rect, {
    x: px(x), y: px(y), w: px(w), h: px(h),
    fill: { color: PAPER_2 }, line: { color: HAIRLINE, width: 0.5 },
    shadow: { type: "none" },
  });
  text(s, x, y + h / 2 - 20, w, 40, label, 26,
       { color: INK_MUTED, font: MONO, align: "center", space: 0.08, caps: true });
};
```

Pass `shadow: { type: "none" }` on every shape and text box — the default theme adds
a drop shadow, which this system forbids.

Two footguns these blocks work around, both found by rendering rather than reading:

- **`line: { width: 0 }` does not remove an outline.** PptxGenJS reads width 0 as
  "use the default" and writes a 1pt `#333333` border. On a 1px-tall rule that
  border *is* the entire shape, so every hairline renders near-black. Only
  `line: { type: "none" }` suppresses it.
- **PowerPoint has no flow layout.** A fixed vertical step per item overlaps the
  next one as soon as a line wraps, so `bodySlide`, `takeawaysSlide`, and the
  caption columns of `figureSlide` and `codeSlide` all step by wrapped height. Keep the character estimates conservative: under-counting
  costs a slightly generous gap, over-counting costs an overlap.

## Layout recipes

Each adds one slide. Content-slide bodies live in `(M_X, BODY_Y, W, BODY_H)`.

```js
export const titleSlide = ({ course, title, subtitle, presenter, date }) => {
  const s = slide();
  text(s, M_X, M_TOP_LG, W, 40, course, 26,
       { color: ACCENT, font: MONO, space: 0.14, caps: true });
  text(s, M_X, 470, 1400, 220, title, 96, { bold: true, line: 1.05 });
  text(s, M_X, 700, 1400, 120, subtitle, 40, { color: INK_MUTED, line: 1.3 });
  rule(s, M_X, 1080 - M_BOT - 60, W);
  text(s, M_X, FOOTER_Y, 1200, 34, presenter, 26, { color: INK_MUTED, font: MONO });
  text(s, 1920 - M_X - 400, FOOTER_Y, 400, 34, date, 26,
       { color: INK_MUTED, font: MONO, align: "right" });
  return s;
};

/** items: up to 6 strings. Numbered 01.., read down left then down right. */
export const agendaSlide = ({ eyebrow: eb, items, footerLeft, page }) => {
  const s = slide();
  chrome(s, eb, "Agenda", footerLeft, page);
  const colW = (W - 80) / 2;
  items.slice(0, 6).forEach((item, i) => {
    const cx = M_X + (i % 2) * (colW + 80);
    const cy = BODY_Y + Math.floor(i / 2) * 108;
    text(s, cx, cy, 60, 40, String(i + 1).padStart(2, "0"), 26,
         { color: ACCENT, font: MONO });
    text(s, cx + 60, cy - 4, colW - 60, 90, item, 34, { line: 1.35 });
  });
  return s;
};

export const dividerSlide = ({ n, name, framing }) => {
  const s = slide(PAPER_2);
  text(s, M_X, 360, W, 40, `SECTION ${String(n).padStart(2, "0")}`, 26,
       { color: ACCENT, font: MONO, space: 0.14 });
  text(s, M_X, 420, 1300, 190, name, 80, { bold: true, line: 1.08 });
  text(s, M_X, 640, 1100, 100, framing, 34, { color: INK_MUTED, line: 1.4 });
  return s;
};

/** bullets: up to 4. Each is a string, or [lead, rest] with lead bolded
 *  — use the pair form when the line defines a term. */
export const bodySlide = ({ eyebrow: eb, title, bullets, footerLeft, page }) => {
  const s = slide();
  chrome(s, eb, title, footerLeft, page);
  const BULLET_W = 1500 - 58;
  const CHARS_PER_LINE = 78;          // 34px sans in a 1442px box
  const LINE_H = 34 * 1.45;
  let y = BODY_Y;
  bullets.slice(0, 4).forEach(b => {
    const runs = typeof b === "string" ? [[b, false]] : [[b[0] + " ", true], [b[1], false]];
    const rows = Math.max(1, Math.ceil(runs.reduce((n, [r]) => n + r.length, 0) / CHARS_PER_LINE));
    text(s, M_X, y, 30, 50, "\u2014", 34, { color: ACCENT, line: 1.4 });
    text(s, M_X + 58, y, BULLET_W, rows * LINE_H + 20, runs, 34, { line: 1.45 });
    y += rows === 1 ? 90 : rows * LINE_H + 40;
  });
  return s;
};

/** left/right: { label, lead, secondary } */
export const twoColumnSlide = ({ eyebrow: eb, title, left, right, footerLeft, page }) => {
  const s = slide();
  chrome(s, eb, title, footerLeft, page);
  const colW = (W - 80) / 2;
  [left, right].forEach((col, i) => {
    const cx = M_X + i * (colW + 80);
    text(s, cx, BODY_Y, colW, 40, col.label, 26,
         { color: ACCENT, font: MONO, space: 0.1, caps: true });
    text(s, cx, BODY_Y + 64, colW, 200, col.lead, 32, { line: 1.45 });
    text(s, cx, BODY_Y + 260, colW, 200, col.secondary, 32,
         { color: INK_MUTED, line: 1.45 });
  });
  return s;
};

export const fullBleedSlide = ({ caption, source, image }) => {
  const s = slide(INK_BG);
  const bandH = 150, imgH = 1080 - bandH;
  if (image) {
    s.addImage({ path: image, x: 0, y: 0, w: px(1920), h: px(imgH),
                 sizing: { type: "cover", w: px(1920), h: px(imgH) } });
  } else {
    placeholder(s, 0, 0, 1920, imgH, "Drop image \u2014 1920 \u00d7 930, full bleed");
  }
  text(s, M_X, imgH + 34, 1200, 90, caption, 34,
       { color: ON_INK, bold: true, line: 1.3 });
  text(s, 1920 - M_X - 500, imgH + 40, 500, 34, source, 24,
       { color: ON_INK_2, font: MONO, align: "right" });
  return s;
};

/** paras: up to 2. Image is aspect-fit — never cropped. */
export const figureSlide = ({ eyebrow: eb, title, paras, figSource, image, footerLeft, page }) => {
  const s = slide();
  chrome(s, eb, title, footerLeft, page);
  const figW = (W - 64) * 0.575, figH = BODY_H - 40;
  const tx = M_X + figW + 64, tw = W - figW - 64;
  if (image) {
    s.addImage({ path: image, x: px(M_X), y: px(BODY_Y), w: px(figW), h: px(figH),
                 sizing: { type: "contain", w: px(figW), h: px(figH) } });
  } else {
    placeholder(s, M_X, BODY_Y, figW, figH, "Drop figure \u2014 aspect-fit, no crop");
  }
  // Same deliberate deviation as bodySlide: fixed 210px slots collide when the
  // first caption paragraph wraps to four lines. Step by wrapped height.
  // 40 chars/line is deliberately conservative for the ~714px column.
  const FIG_CHARS = 40, FIG_LINE = 32 * 1.45;
  let py = BODY_Y;
  paras.slice(0, 2).forEach((p, i) => {
    const rows = Math.max(1, Math.ceil(p.length / FIG_CHARS));
    text(s, tx, py, tw, rows * FIG_LINE + 20, p, 32,
         { color: i === 0 ? INK : INK_MUTED, line: 1.45 });
    py += rows * FIG_LINE + 40;
  });
  text(s, tx, FOOTER_Y - 60, tw, 34, figSource, 24, { color: FOOTER_C, font: MONO });
  return s;
};

/** code: a string with newlines, <= 12 lines. */
> **Extension, added Sep 2026.** Inside a `codeSlide`'s `code` string,
> `**text**` marks a bold run. PowerPoint cannot mix weights within one run,
> so each line is split into runs and only the last carries `breakLine`. Lines
> with no marker render exactly as before. Used to make the label column of the
> Four Gates slides scannable; nothing else relies on it.

export const codeSlide = ({ eyebrow: eb, title, code, paras, prompt, footerLeft, page }) => {
  const s = slide();
  chrome(s, eb, title, footerLeft, page);
  const codeW = (W - 56) * 0.608, codeH = BODY_H - 40;
  s.addShape(pres.ShapeType.rect, {
    x: px(M_X), y: px(BODY_Y), w: px(codeW), h: px(codeH),
    fill: { color: PAPER_2 }, line: { color: HAIRLINE, width: 0.5 },
    shadow: { type: "none" },
  });
  s.addText(code.split("\n").slice(0, 12).map(t => ({ text: t, options: { breakLine: true } })), {
    x: px(M_X + 38), y: px(BODY_Y + 34), w: px(codeW - 76), h: px(codeH - 68),
    fontFace: MONO, fontSize: pt(28), color: INK,
    lineSpacingMultiple: 1.6, margin: 0, valign: "top", shadow: { type: "none" },
  });
  const tx = M_X + codeW + 56, tw = W - codeW - 56;
  // Wrapped-height flow, as figureSlide. 34 chars/line for the ~662px column.
  const CODE_CHARS = 34, CODE_LINE = 32 * 1.45;
  let py = BODY_Y;
  paras.slice(0, 2).forEach((p, i) => {
    const rows = Math.max(1, Math.ceil(p.length / CODE_CHARS));
    text(s, tx, py, tw, rows * CODE_LINE + 20, p, 32,
         { color: i === 0 ? INK : INK_MUTED, line: 1.45 });
    py += rows * CODE_LINE + 40;
  });
  rule(s, tx, FOOTER_Y - 150, 2, ACCENT, 110);          // accent left rule
  text(s, tx + 26, FOOTER_Y - 145, tw - 26, 110, prompt, 30, { line: 1.4 });
  return s;
};

/** lines: exactly 3, in the order taught. */
export const takeawaysSlide = ({ eyebrow: eb, lines, footerLeft, page }) => {
  const s = slide(PAPER_2);
  chrome(s, eb, "What to take away", footerLeft, page);
  const TAKE_W = 1560 - 70;
  const TAKE_CHARS = 80;              // 36px sans in a 1490px box
  const TAKE_LINE = 36 * 1.4;
  let y = BODY_Y;
  lines.slice(0, 3).forEach((ln, i) => {
    const rows = Math.max(1, Math.ceil(ln.length / TAKE_CHARS));
    text(s, M_X, y, 70, 50, String(i + 1).padStart(2, "0"), 34,
         { color: ACCENT, font: MONO });
    text(s, M_X + 70, y - 2, TAKE_W, rows * TAKE_LINE + 20, ln, 36, { line: 1.4 });
    y += rows * TAKE_LINE + 44;
  });
  return s;
};

export const closingSlide = ({ question, reading, deadline, office, contact, page }) => {
  const s = slide();
  text(s, M_X, M_TOP_LG, W, 40, "Questions", 26,
       { color: ACCENT, font: MONO, space: 0.14, caps: true });
  const colW = (W - 80) / 2, rx = M_X + colW + 80;
  text(s, M_X, 480, colW, 240, question, 80, { bold: true, line: 1.08 });
  // Wrapped-height flow, as in bodySlide. A fixed 66px step assumes every line
  // is one line; a deadline long enough to wrap then runs underneath `office`.
  // 66px is preserved exactly for the single-line case.
  const C_CPL = 47;                   // 32px sans in an 832px column, measured
  const C_LINE_H = 32 * 1.45;
  let cy = 560;
  [reading, deadline].forEach(ln => {
    const rows = Math.max(1, Math.ceil(ln.length / C_CPL));
    text(s, rx, cy, colW, rows * C_LINE_H + 16, ln, 32, { line: 1.45 });
    cy += rows === 1 ? 66 : rows * C_LINE_H + 20;
  });
  text(s, rx, cy + 18, colW, 40, office, 26, { color: INK_MUTED, font: MONO });
  rule(s, M_X, 1080 - M_BOT - 60, W);
  text(s, M_X, FOOTER_Y, 1200, 34, contact, 24, { color: INK_MUTED, font: MONO });
  text(s, 1920 - M_X - 200, FOOTER_Y, 200, 34, page, 24,
       { color: INK_MUTED, font: MONO, align: "right" });
  return s;
};
```

## Speaker notes

```js
s.addNotes("One or two sentences of delivery guidance.");
```

Write a note for every slide. Notes carry delivery guidance, not the slide's text
read back.

## Saving

```js
await pres.writeFile({ fileName: "deck.pptx" });
```

In the browser, `pres.writeFile()` triggers a download; in Node it writes to disk.
For a buffer, use `await pres.write({ outputType: "nodebuffer" })`.

## Rules for generated decks

- Use only the recipes above. A slide that fits none of them means the content
  needs splitting, not a new layout.
- Respect the per-layout limits: 4 bullets, 6 agenda items, 3 takeaways, 12 code
  lines, one idea per slide.
- Add no shapes, dividers, icons, or emphasis these recipes don't produce. No
  shadows, gradients, rounded corners, or coloured fills behind text. Brand
  marks are the single exception, under the rules in **Brand marks** above.
- **Never rely on column alignment inside a code block.** Space-padded ASCII
  tables need a real monospace font; a renderer that substitutes one collapses
  them into ragged text. Group the lines instead, so no line depends on lining
  up with another.
- Leave the lower part of the content box empty when the content ends there.
- Section dividers and the takeaways slide are the only `PAPER_2` slides; the
  full-bleed image slide is the only `INK_BG` slide.
- Page numbers are zero-padded strings (`"04"`), and the footer's left text is
  identical on every content slide in a deck.
- Report the slide count and any font that had to be substituted.
