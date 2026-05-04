import { readFileSync, writeFileSync } from "fs";

let html = readFileSync("public/index.html", "utf8");

const fixes = [
  // 1. Nav: VR Hub
  ["        >\?\? VR Hub</a", "        >🥽 VR Hub</a"],

  // 2. AI Platform card icon
  [
    'margin-bottom: 0.5rem">\?\?</div>\n            <div\n              style="\n                font-weight: 700;\n                font-size: 0.9rem;\n                margin-bottom: 0.35rem;\n              "\n            >\n              AI Platform',
    'margin-bottom: 0.5rem">🤖</div>\n            <div\n              style="\n                font-weight: 700;\n                font-size: 0.9rem;\n                margin-bottom: 0.35rem;\n              "\n            >\n              AI Platform',
  ],

  // 3. VR Platform card icon
  [
    'margin-bottom: 0.5rem">\?\?</div>\n            <div\n              style="\n                font-weight: 700;\n                font-size: 0.9rem;\n                margin-bottom: 0.35rem;\n              "\n            >\n              VR Platform',
    'margin-bottom: 0.5rem">🥽</div>\n            <div\n              style="\n                font-weight: 700;\n                font-size: 0.9rem;\n                margin-bottom: 0.35rem;\n              "\n            >\n              VR Platform',
  ],

  // 4. Developer OS card icon
  [
    'margin-bottom: 0.5rem">\?\?</div>\n            <div\n              style="\n                font-weight: 700;\n                font-size: 0.9rem;\n                margin-bottom: 0.35rem;\n              "\n            >\n              Developer OS',
    'margin-bottom: 0.5rem">🧠</div>\n            <div\n              style="\n                font-weight: 700;\n                font-size: 0.9rem;\n                margin-bottom: 0.35rem;\n              "\n            >\n              Developer OS',
  ],

  // 5. Explore VR Worlds CTA
  [">\?\? Explore VR Worlds \?</a", ">🌐 Explore VR Worlds →</a"],

  // 6. AIOS VR Platform badge
  ["\?\? AIOS VR Platform \uFFFD Live Now", "⚡ AIOS VR Platform — Live Now"],

  // 7-15. VR Hub category pill links
  [">\?\? Cinema</a", ">🎬 Cinema</a"],
  [">\?\? Enterprise</a", ">💼 Enterprise</a"],
  [">\?\? Lab</a", ">🔬 Lab</a"],
  [">\?\? Arcade</a", ">🎮 Arcade</a"],
  [">\?\? Wellness</a", ">🌿 Wellness</a"],
  [">\?\? Social</a", ">💬 Social</a"],
  [">\?\?\? Creator</a", ">✏️ Creator</a"],
  [">\?\? Education</a", ">📚 Education</a"],
  [">\?\? Art &amp; Music</a", ">🎨 Art &amp; Music</a"],

  // 16a. Feature card: WebXR Theatre (2rem icon)
  [
    'margin-bottom: 0.8rem">\?\?</div>\n            <div\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\n            >\n              WebXR Theatre',
    'margin-bottom: 0.8rem">🎬</div>\n            <div\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\n            >\n              WebXR Theatre',
  ],

  // 16b. Feature card: GeoQode Lab
  [
    'margin-bottom: 0.8rem">\?\?</div>\n            <div\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\n            >\n              GeoQode Lab',
    'margin-bottom: 0.8rem">🔬</div>\n            <div\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\n            >\n              GeoQode Lab',
  ],

  // 16c. Feature card: Live Events
  [
    'margin-bottom: 0.8rem">\?\?</div>\n            <div\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\n            >\n              Live Events',
    'margin-bottom: 0.8rem">🎟️</div>\n            <div\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\n            >\n              Live Events',
  ],

  // 17-18. CTA buttons (unique surrounding text)
  [
    "            \?\? Explore VR Hub\n          </a>",
    "            🥽 Explore VR Hub\n          </a>",
  ],
  [
    "            \?\? Build an Experience \?\n          </a>",
    "            🛠️ Build an Experience →\n          </a>",
  ],

  // 19-21. Footer links
  [
    'href="/aiosdream">\?\? AIOSdream</a>',
    'href="/aiosdream">✨ AIOSdream</a>',
  ],
  [
    'href="/plaistore">\?\?\? PLAIstore</a>',
    'href="/plaistore">🛍️ PLAIstore</a>',
  ],
];

let fixed = 0;
let missed = 0;
for (const [from, to] of fixes) {
  if (html.includes(from)) {
    html = html.replace(from, to);
    fixed++;
    console.log("✅ Fixed:", from.substring(0, 55).replace(/\n/g, " "));
  } else {
    missed++;
    console.log("❌ MISS: ", from.substring(0, 55).replace(/\n/g, " "));
  }
}

// Also fix remaining lone ? chars in "Enter Theatre ?" / "Open Lab ?" / "View Events ?"
const trailingArrows = [
  ["Enter Theatre \?</a", "Enter Theatre →</a"],
  ["Open Lab \?</a", "Open Lab →</a"],
  ["View Events \?</a", "View Events →</a"],
  ["GitHub \?</a", "GitHub →</a"],
  ["AI Evaluation \?</a", "AI Evaluation →</a"],
];
for (const [from, to] of trailingArrows) {
  if (html.includes(from)) {
    html = html.replace(
      new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      to,
    );
    fixed++;
    console.log("✅ Fixed arrow:", from);
  }
}

// Fix the corrupted em-dash / replacement char in "no app install — 24/7" type text
// ï¿½ in latin1 = U+FFFD replacement char = was originally — or similar
html = html.replace(/\u{FFFD}/gu, "—");

writeFileSync("public/index.html", html, "utf8");
console.log(`\nDone. Fixed: ${fixed}, Missed: ${missed}`);

// Verify
const remaining = (html.match(/\?\?/g) || []).length;
console.log("Remaining ?? instances:", remaining);
