const s = `mkFinding(
  "HIGH",
  drone,
  "7.83 Hz Schumann stale frequency detected",
  \`Replace with BASE_FREQUENCY_HZ = 72 Hz\`,
  code.match(re)?.[0]?.trim().slice(0, 80),
)`;
const sanitized = s
  .replace(/\/\*[\s\S]*?\*\//g, "/**/")
  .replace(/\/\/[^\n]*/g, "//")
  .replace(/\x22(?:[^\x22\\]|\\.)*\x22/g, "\x22\x22")
  .replace(/\x27(?:[^\x27\\]|\\.)*\x27/g, "\x27\x27");
console.log("sanitized:", JSON.stringify(sanitized));
console.log("contains 7.83:", /7\.83/.test(sanitized));
