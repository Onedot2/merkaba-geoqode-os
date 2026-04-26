// scripts/compliance-check.js
// Check program compliance

import fs from "fs";
import path from "path";
import { Parser } from "../geo/grammar/parser.js";
import { ExecutionEngine } from "../geo/runtime/execution-engine.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node scripts/compliance-check.js <program.geo>");
    process.exit(1);
  }

  const programFile = args[0];

  if (!fs.existsSync(programFile)) {
    console.error(`File not found: ${programFile}`);
    process.exit(1);
  }

  const source = fs.readFileSync(programFile, "utf-8");

  console.log(`\n🌌 GeoQode Compliance Checker`);
  console.log(`📝 Checking: ${path.basename(programFile)}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  try {
    const parser = new Parser(source);
    const ast = parser.parse();

    const engine = new ExecutionEngine();
    const isSyntaxValid = engine.compliance.validateSyntax(ast);

    if (!isSyntaxValid) {
      console.error("❌ Syntax validation failed");
      process.exit(1);
    }

    const execution = await engine.execute(source);
    const report = engine.compliance.getComplianceReport();

    console.log("✅ Compliance Check Complete\n");
    console.log("⚙️ Execution Summary:");
    console.log(
      JSON.stringify(
        {
          success: execution.success,
          emissions: execution.result?.emissions || 0,
          detections: execution.result?.detections || 0,
          qbits: execution.result?.qbits || 0,
          auditTrailHash: execution.auditTrailHash,
        },
        null,
        2,
      ),
    );
    console.log("");
    console.log("📋 Compliance Report:");
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
