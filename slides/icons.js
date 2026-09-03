/**
 * Brand marks for the deck.  Run:  node icons.js
 *
 * simple-icons publishes the SVG paths under CC0; the marks themselves remain
 * the trademarks of their owners and are used here only to identify the tools
 * the slides are about — the same nominative use as naming them in the text.
 *
 * They are rendered MONOCHROME in INK_MUTED, never in brand colours. Full
 * colour would drop a dozen new hues onto warm paper and break both the
 * two-background rule and the single-accent rule in SLIDE-STYLE.md.
 */
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { execFileSync } from "child_process";
import * as si from "simple-icons";

const COLOR = "77726A";   // INK_MUTED
const PX = 136;           // 4x the 34px placement size, for a crisp downscale

/* Only tools this deck actually names in its own body text. */
const SLUGS = [
  "cline", "cursor", "githubcopilot", "windsurf",
  "claude", "googlegemini", "mistralai", "ollama",
  "github", "streamlit", "python", "numpy", "pytest",
];

mkdirSync("icons", { recursive: true });
const tmp = "icons/_tmp.svg";
let n = 0;

for (const slug of SLUGS) {
  const icon = si["si" + slug[0].toUpperCase() + slug.slice(1)];
  if (!icon) { console.error(`MISSING icon: ${slug}`); process.exit(1); }
  writeFileSync(tmp,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ` +
    `width="${PX}" height="${PX}"><path fill="#${COLOR}" d="${icon.path}"/></svg>`);
  execFileSync("rsvg-convert",
    ["-w", String(PX), "-h", String(PX), "-o", `icons/${slug}.png`, tmp]);
  console.log(`  ${slug.padEnd(16)} ${icon.title}`);
  n++;
}
rmSync(tmp);
console.log(`Wrote ${n} brand marks to icons/ in #${COLOR}`);
