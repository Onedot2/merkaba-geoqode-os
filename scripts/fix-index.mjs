import { readFileSync, writeFileSync } from "fs";
const f =
  "C:/Users/bradl/source/storm-ai/merkaba-geoqode-lattice/public/index.html";
let c = readFileSync(f, "utf8");
c = c.split('href="#founding-partner"').join('href="/waitlist"');
writeFileSync(f, c, "utf8");
const remaining = (c.match(/href="#founding-partner"/g) || []).length;
console.log("remaining #fp:", remaining);

// ── Fix copyright ──
c = c.replace(
  /[^\x00-\x7F\u00A0-\u00FF\u0100-\u02FF\u0370-\u03FF\u2000-\u22FF] 2026 Brains4Ai \/ AIOS\. Built by Brad Levitan\. All rights reserved\./g,
  "\u00A9 2026 Brains4Ai / AIOS. All rights reserved.",
);
// Fallback: match whatever byte is before '2026'
c = c.replace(
  /. 2026 Brains4Ai \/ AIOS\. Built by Brad Levitan\. All rights reserved\./,
  "\u00A9 2026 Brains4Ai / AIOS. All rights reserved.",
);

// ── Fix remaining #founding-partner href in explainer (Get AI on your site button) ──
c = c.replace(
  'href="#founding-partner"\n            style="\n              padding: 0.6rem 1.4rem;\n              background: rgba(255, 255, 255, 0.06)',
  'href="/waitlist"\n            style="\n              padding: 0.6rem 1.4rem;\n              background: rgba(255, 255, 255, 0.06)',
);
c = c.replace(/>Get AI on your site [^<]*<\/a/, ">Try It Free \u2192</a");

// ── Fix the "Skip the list — Get Founding Access" CTA ──
c = c.replace(
  'href="#founding-partner"\n            style="\n              display: inline-block;\n              background: linear-gradient(135deg, #00d4ff, #6366f1)',
  'href="/waitlist"\n            style="\n              display: inline-block;\n              background: linear-gradient(135deg, #00d4ff, #6366f1)',
);
c = c.replace(/>[?!] Skip the list[^<]*<\/a/, ">Join the Waitlist \u2192</a");
// Also fix the surrounding paragraph about "limited spots"
c = c.replace(
  "AIOS is in active development. Early access partners will shape the\n          platform",
  "AIOS is in active development. Early access partners shape the\n          platform",
);
c = c.replace("Spots are\n          limited.", "Open to everyone.");

// ── Fix JSON-LD description ──
c = c.replace(
  '"description": "An open, autonomous AI operating system built by Brad Levitan (Brains4Ai). Geometric lattice architecture (8',
  '"description": "AIOS \u2014 autonomous AI operating system by Brains4Ai. Geometric lattice architecture (8',
);

// ── Verify ──
const bradVisible = [];
const lines = c.split("\n");
lines.forEach((l, i) => {
  if (
    l.includes("Brad Levitan") &&
    !l.includes('"founder"') &&
    !l.includes('"author"') &&
    !l.includes('"description"')
  ) {
    bradVisible.push({ line: i + 1, text: l.trim().substring(0, 80) });
  }
});
const fpCount = (c.match(/href="#founding-partner"/g) || []).length;
console.log("Visible Brad Levitan (non-schema):", bradVisible);
console.log("#founding-partner hrefs:", fpCount);

writeFileSync(f, c, "utf8");
console.log("Saved OK");
