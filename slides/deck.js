/**
 * Deck library — the layout recipes from SLIDE-STYLE.md, transcribed literally.
 *
 * Do not add layouts here. A slide that fits none of these means the content
 * needs splitting, not a new layout.
 */

import PptxGenJS from "pptxgenjs";

const px = v => v / 144;   // px -> inches
const pt = v => v / 2;     // px -> points

export const pres = new PptxGenJS();
pres.defineLayout({ name: "DECK", width: px(1920), height: px(1080) });
pres.layout = "DECK";

/* ---- palette ---- */
export const PAPER     = "FCFBF8";
export const PAPER_2   = "F5F2EC";
export const INK       = "332F2A";
export const INK_MUTED = "77726A";
export const FOOTER_C  = "99948B";
export const HAIRLINE  = "E1DED7";
export const ACCENT    = "A87A2E";
export const INK_BG    = "332F2A";
export const ON_INK    = "FCFBF8";
export const ON_INK_2  = "B4AFA6";

/* ---- fonts ---- */
export const SANS = "Libre Franklin";
export const MONO = "IBM Plex Mono";

/* ---- geometry ---- */
const M_X = 88, M_TOP = 56, M_TOP_LG = 96, M_BOT = 48;
const W = 1920 - 2 * M_X;          // 1744, content width
const TITLE_Y  = M_TOP + 44;
const RULE_Y   = M_TOP + 130;      // hairline under the title
const BODY_Y   = RULE_Y + 52;      // content starts here
const FOOTER_Y = 1080 - M_BOT - 34;
const BODY_H   = FOOTER_Y - BODY_Y;   // 1744 x 812 content box

/* ---- building blocks ---- */
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

// DEVIATION from SLIDE-STYLE.md, deliberate: the guide's recipe uses
// `line: { width: 0 }`, but pptxgenjs reads width 0 as "use the default" and
// writes a 1pt #333333 outline. On a 1px-tall rule that outline is the entire
// shape, so every hairline rendered near-black. `line: { type: "none" }` emits
// an empty <a:ln> and no outline. Verified in the generated slide XML.
const rule = (s, x, y, w, color = HAIRLINE, thickness = 1) =>
  s.addShape(pres.ShapeType.rect, {
    x: px(x), y: px(y), w: px(w), h: px(thickness),
    fill: { color }, line: { type: "none" }, shadow: { type: "none" },
  });

const eyebrow = (s, label, color = INK_MUTED) =>
  text(s, M_X, M_TOP, W, 34, label, 24,
       { color, font: MONO, space: 0.14, caps: true });

/* ---- brand marks ------------------------------------------------------
 * DEVIATION 3 from SLIDE-STYLE.md, added at the author's request.
 *
 * The guide's Never list bans "decorative icons". These are not decorative:
 * a mark here names a tool the slide is already about, carrying the same
 * informational load as a figure's source line. To keep it from drifting
 * into ornament the element is deliberately rigid — monochrome INK_MUTED,
 * one fixed 32px square, right-aligned on the eyebrow baseline, six per
 * slide at most, and never on a slide whose body text does not name the
 * tool. Section dividers, the title and the closing slide take none.
 */
const BRAND_PX = 32, BRAND_GAP = 22, BRAND_MAX = 6;

const brands = (s, list = []) => {
  const use = list.slice(0, BRAND_MAX);
  const total = use.length * BRAND_PX + (use.length - 1) * BRAND_GAP;
  use.forEach((name, i) => {
    s.addImage({
      path: `icons/${name}.png`,
      x: px(1920 - M_X - total + i * (BRAND_PX + BRAND_GAP)),
      y: px(M_TOP + 1), w: px(BRAND_PX), h: px(BRAND_PX),
    });
  });
};

const footer = (s, left, page) => {
  text(s, M_X, FOOTER_Y, W - 200, 34, left, 24, { color: FOOTER_C, font: MONO });
  text(s, 1920 - M_X - 200, FOOTER_Y, 200, 34, page, 24,
       { color: FOOTER_C, font: MONO, align: "right" });
};

/** Standard content-slide frame: eyebrow, title, hairline, footer. */
const chrome = (s, eyebrowText, title, footerLeft, page, brandList) => {
  eyebrow(s, eyebrowText);
  brands(s, brandList);
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

/* ---- layout recipes ---- */

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
export const agendaSlide = ({ eyebrow: eb, items, footerLeft, page, brands: bl }) => {
  const s = slide();
  chrome(s, eb, "Agenda", footerLeft, page, bl);
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

/** bullets: up to 4. Each is a string, or [lead, rest] with lead bolded. */
export const bodySlide = ({ eyebrow: eb, title, bullets, footerLeft, page, brands: bl }) => {
  const s = slide();
  chrome(s, eb, title, footerLeft, page, bl);
  const BULLET_W = 1500 - 58;
  // DEVIATION from SLIDE-STYLE.md, deliberate: the guide steps a fixed 90px per
  // bullet. PowerPoint has no flow layout, so a bullet that wraps to two lines
  // overlaps the next one — visible in the first render of this deck. Step by
  // the wrapped height instead, keeping the guide's 34px gap between bullets.
  // 90px is preserved exactly for the single-line case.
  const CHARS_PER_LINE = 78;          // 34px sans in a 1442px box, measured
  const LINE_H = 34 * 1.45;           // the guide's body size and leading
  let y = BODY_Y;
  bullets.slice(0, 4).forEach(b => {
    const runs = typeof b === "string" ? [[b, false]] : [[b[0] + " ", true], [b[1], false]];
    const rows = Math.max(1, Math.ceil(runs.reduce((n, [r]) => n + r.length, 0) / CHARS_PER_LINE));
    text(s, M_X, y, 30, 50, "—", 34, { color: ACCENT, line: 1.4 });
    text(s, M_X + 58, y, BULLET_W, rows * LINE_H + 20, runs, 34, { line: 1.45 });
    y += rows === 1 ? 90 : rows * LINE_H + 40;
  });
  return s;
};

/** left/right: { label, lead, secondary } */
export const twoColumnSlide = ({ eyebrow: eb, title, left, right, footerLeft, page, brands: bl }) => {
  const s = slide();
  chrome(s, eb, title, footerLeft, page, bl);
  const colW = (W - 80) / 2;
  // Same fixed-step defect as bodySlide had: the guide starts `secondary` at a
  // constant +260, so a lead that wraps past four lines lands on top of it.
  // Step by the taller of the two leads instead — one baseline for both
  // columns, since the guide asks the sides to stay the same visual length.
  // 44 chars/line under-estimates the ~50 the column really holds; that errs
  // toward a generous gap. Short leads still sit at exactly +260, so every
  // existing two-column slide renders unchanged.
  const TC_CHARS = 44, TC_LINE = 32 * 1.45;
  const leadRows = Math.max(1,
    Math.ceil((left.lead || "").length / TC_CHARS),
    Math.ceil((right.lead || "").length / TC_CHARS));
  const secY = Math.max(BODY_Y + 260, BODY_Y + 64 + leadRows * TC_LINE + 28);
  [left, right].forEach((col, i) => {
    const cx = M_X + i * (colW + 80);
    text(s, cx, BODY_Y, colW, 40, col.label, 26,
         { color: ACCENT, font: MONO, space: 0.1, caps: true });
    text(s, cx, BODY_Y + 64, colW, 200, col.lead, 32, { line: 1.45 });
    text(s, cx, secY, colW, 200, col.secondary, 32,
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
    placeholder(s, 0, 0, 1920, imgH, "Drop image — 1920 × 930, full bleed");
  }
  text(s, M_X, imgH + 34, 1200, 90, caption, 34,
       { color: ON_INK, bold: true, line: 1.3 });
  text(s, 1920 - M_X - 500, imgH + 40, 500, 34, source, 24,
       { color: ON_INK_2, font: MONO, align: "right" });
  return s;
};

/** paras: up to 2. Image is aspect-fit — never cropped. */
export const figureSlide = ({ eyebrow: eb, title, paras, figSource, image, footerLeft, page, brands: bl }) => {
  const s = slide();
  chrome(s, eb, title, footerLeft, page, bl);
  const figW = (W - 64) * 0.575, figH = BODY_H - 40;
  const tx = M_X + figW + 64, tw = W - figW - 64;
  if (image) {
    s.addImage({ path: image, x: px(M_X), y: px(BODY_Y), w: px(figW), h: px(figH),
                 sizing: { type: "contain", w: px(figW), h: px(figH) } });
  } else {
    placeholder(s, M_X, BODY_Y, figW, figH, "Drop figure — aspect-fit, no crop");
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
export const codeSlide = ({ eyebrow: eb, title, code, paras, prompt, footerLeft, page, brands: bl }) => {
  const s = slide();
  chrome(s, eb, title, footerLeft, page, bl);
  const codeW = (W - 56) * 0.608, codeH = BODY_H - 40;
  s.addShape(pres.ShapeType.rect, {
    x: px(M_X), y: px(BODY_Y), w: px(codeW), h: px(codeH),
    fill: { color: PAPER_2 }, line: { color: HAIRLINE, width: 0.5 },
    shadow: { type: "none" },
  });
  // **like this** marks a bold run inside a code line. PowerPoint has no rich
  // text in a single run, so each line becomes one or more runs and only the
  // last carries breakLine. Lines with no marker behave exactly as before.
  // The 12-line cap used to silently drop whatever ran past it, which twice
  // shipped a card whose last line — the whole point of the slide — was gone.
  // Fail the build instead: a truncated slide is invisible, a thrown error
  // is not.
  const codeLines = code.split("\n");
  if (codeLines.length > 12) {
    throw new Error(
      `codeSlide "${title}": ${codeLines.length} code lines, max 12. ` +
      `Split the slide or shorten it — do not let it truncate.`);
  }
  const codeRuns = [];
  codeLines.forEach(line => {
    const runs = line.split(/\*\*(.+?)\*\*/g)
      .map((part, i) => ({ part, bold: i % 2 === 1 }))
      .filter(r => r.part !== "")
      .map(r => ({ text: r.part, options: { bold: r.bold } }));
    if (runs.length === 0) runs.push({ text: "", options: {} });
    runs[runs.length - 1].options.breakLine = true;
    codeRuns.push(...runs);
  });
  s.addText(codeRuns, {
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
export const takeawaysSlide = ({ eyebrow: eb, lines, footerLeft, page, brands: bl }) => {
  const s = slide(PAPER_2);
  chrome(s, eb, "What to take away", footerLeft, page, bl);
  // Same deliberate deviation as bodySlide: the guide's fixed 132px step gives
  // a 31px gap after a two-line takeaway and 82px after a one-line one. Step by
  // the wrapped height so the gap is the 44px the guide specifies, either way.
  const TAKE_W = 1560 - 70;
  const TAKE_CHARS = 80;              // 36px sans in a 1490px box, measured
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
  // Wrapped-height flow, as in bodySlide: a deadline long enough to wrap used
  // to run underneath the office line. 66px is preserved for single lines.
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
