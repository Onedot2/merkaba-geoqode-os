import { readFileSync } from "fs";
const html = readFileSync("public/index.html", "utf8");

// Find remaining ?? instances
let pos = 0;
let count = 0;
while (true) {
  const idx = html.indexOf("??", pos);
  if (idx === -1) break;
  count++;
  console.log(`\nInstance ${count} at char ${idx}:`);
  console.log(JSON.stringify(html.slice(Math.max(0, idx - 40), idx + 120)));
  pos = idx + 2;
}
console.log("\nTotal remaining:", count);
