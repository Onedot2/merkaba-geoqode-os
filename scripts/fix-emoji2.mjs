import { readFileSync, writeFileSync } from "fs";
let html = readFileSync("public/index.html", "utf8");

// CRLF-aware fixes for the 8 remaining instances
const fixes = [
  // 1-3: 1.5rem card icons — distinguish by following heading (AI Platform, VR Platform, Developer OS)
  [
    'margin-bottom: 0.5rem">\?\?</div>\r\n            <div\r\n              style="\r\n                font-weight: 700;\r\n                font-size: 0.9rem;\r\n                margin-bottom: 0.35rem;\r\n              "\r\n            >\r\n              AI Platform',
    'margin-bottom: 0.5rem">🤖</div>\r\n            <div\r\n              style="\r\n                font-weight: 700;\r\n                font-size: 0.9rem;\r\n                margin-bottom: 0.35rem;\r\n              "\r\n            >\r\n              AI Platform',
  ],
  [
    'margin-bottom: 0.5rem">\?\?</div>\r\n            <div\r\n              style="\r\n                font-weight: 700;\r\n                font-size: 0.9rem;\r\n                margin-bottom: 0.35rem;\r\n              "\r\n            >\r\n              VR Platform',
    'margin-bottom: 0.5rem">🥽</div>\r\n            <div\r\n              style="\r\n                font-weight: 700;\r\n                font-size: 0.9rem;\r\n                margin-bottom: 0.35rem;\r\n              "\r\n            >\r\n              VR Platform',
  ],
  [
    'margin-bottom: 0.5rem">\?\?</div>\r\n            <div\r\n              style="\r\n                font-weight: 700;\r\n                font-size: 0.9rem;\r\n                margin-bottom: 0.35rem;\r\n              "\r\n            >\r\n              Developer OS',
    'margin-bottom: 0.5rem">🧠</div>\r\n            <div\r\n              style="\r\n                font-weight: 700;\r\n                font-size: 0.9rem;\r\n                margin-bottom: 0.35rem;\r\n              "\r\n            >\r\n              Developer OS',
  ],

  // 4-6: 2rem feature card icons (WebXR Theatre, GeoQode Lab, Live Events)
  [
    'margin-bottom: 0.8rem">\?\?</div>\r\n            <div\r\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\r\n            >\r\n              WebXR Theatre',
    'margin-bottom: 0.8rem">🎬</div>\r\n            <div\r\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\r\n            >\r\n              WebXR Theatre',
  ],
  [
    'margin-bottom: 0.8rem">\?\?</div>\r\n            <div\r\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\r\n            >\r\n              GeoQode Lab',
    'margin-bottom: 0.8rem">🔬</div>\r\n            <div\r\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\r\n            >\r\n              GeoQode Lab',
  ],
  [
    'margin-bottom: 0.8rem">\?\?</div>\r\n            <div\r\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\r\n            >\r\n              Live Events',
    'margin-bottom: 0.8rem">🎟️</div>\r\n            <div\r\n              style="font-size: 1rem; font-weight: 800; margin-bottom: 0.4rem"\r\n            >\r\n              Live Events',
  ],

  // 7-8: CTA buttons
  [
    "            \?\? Explore VR Hub\r\n          </a>",
    "            🥽 Explore VR Hub\r\n          </a>",
  ],
  [
    "            \?\? Build an Experience \?\r\n          </a>",
    "            🛠️ Build an Experience →\r\n          </a>",
  ],
];

let fixed = 0,
  missed = 0;
for (const [from, to] of fixes) {
  if (html.includes(from)) {
    html = html.replace(from, to);
    fixed++;
    console.log("✅", from.substring(0, 55).replace(/\r\n/g, "↵"));
  } else {
    missed++;
    console.log("❌", from.substring(0, 55).replace(/\r\n/g, "↵"));
  }
}

writeFileSync("public/index.html", html, "utf8");
console.log(`\nFixed: ${fixed}, Missed: ${missed}`);
const remaining = (html.match(/\?\?/g) || []).length;
console.log("Remaining ?? instances:", remaining);
