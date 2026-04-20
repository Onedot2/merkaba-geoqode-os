// tests/parser-extended.test.js
// Extended parser tests — covers all GeoQode syntax including fixed edge cases

import { describe, it, expect } from "vitest";
import { Parser } from "../geo/grammar/parser.js";
import { ExecutionEngine } from "../geo/runtime/execution-engine.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
function parse(source) {
  return new Parser(source).parse();
}

async function run(source) {
  return await new ExecutionEngine().execute(source);
}

// ─────────────────────────────────────────────────────────────────────────────
// Lexer / Tokenisation
// ─────────────────────────────────────────────────────────────────────────────
describe("Lexer", () => {
  it("should tokenise DOT in Node.emit", () => {
    const ast = parse("Program T { Node.emit(Δ[green], Φ[1]); }");
    expect(ast.statements[0].statements[0].type).toBe("EMIT_STMT");
  });

  it("should tokenise COLON in Step1: statement", () => {
    const ast = parse("Playbook P { Step1: Node.emit(Δ[green], Φ[1]); }");
    expect(ast.statements[0].type).toBe("PLAYBOOK");
  });

  it("should tokenise sonic ~wave(528Hz)", () => {
    const ast = parse("Program T { Water.qbit(~wave(528Hz), Φ[1]); }");
    expect(ast.statements[0].statements[0].type).toBe("QBIT_STMT");
  });

  it("should throw on unterminated string", () => {
    expect(() => parse('Program T { Log("unterminated); }')).toThrow();
  });

  it("should skip single-line comments", () => {
    const ast = parse(`
      Program T {
        // This is a comment
        Node.emit(Δ[green], Φ[1]);
      }
    `);
    const stmts = ast.statements[0].statements.filter(Boolean);
    expect(stmts.length).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Programs
// ─────────────────────────────────────────────────────────────────────────────
describe("Parser: Programs", () => {
  it("should parse Node.emit with all chromodynamic colors", () => {
    for (const color of ["red", "green", "blue", "amber", "violet"]) {
      const ast = parse(`Program T { Node.emit(Δ[${color}], Φ[1]); }`);
      const emit = ast.statements[0].statements[0];
      expect(emit.type).toBe("EMIT_STMT");
      expect(emit.chromodynamic.value).toBe(color);
    }
  });

  it("should parse Node.detect with TWO operators", () => {
    const ast = parse("Program T { Node.detect(⊗, ⧉); }");
    const detect = ast.statements[0].statements[0];
    expect(detect.type).toBe("DETECT_STMT");
    expect(detect.duality.symbol).toBe("⊗");
    expect(detect.octahedron.symbol).toBe("⧉");
  });

  it("should parse Node.detect with ONE operator (optional second arg)", () => {
    const ast = parse("Program T { Node.detect(⊗); }");
    const detect = ast.statements[0].statements[0];
    expect(detect.type).toBe("DETECT_STMT");
    expect(detect.duality.symbol).toBe("⊗");
    expect(detect.octahedron).toBeNull();
  });

  it("should parse Water.qbit statement", () => {
    const ast = parse("Program T { Water.qbit(~wave(432Hz), Φ[2]); }");
    const qbit = ast.statements[0].statements[0];
    expect(qbit.type).toBe("QBIT_STMT");
    expect(qbit.frequency.value).toContain("432Hz");
  });

  it("should parse Log statement", () => {
    const ast = parse('Program T { Log("Hello world"); }');
    const log = ast.statements[0].statements[0];
    expect(log.type).toBe("LOG_STMT");
    expect(log.message).toBe("Hello world");
  });

  it("should parse multi-statement program", () => {
    const ast = parse(`Program Multi {
      Node.emit(Δ[red], Φ[1]);
      Node.detect(⊗, ⧉);
      Water.qbit(~wave(528Hz), Φ[1]);
      Log("Done");
    }`);
    const stmts = ast.statements[0].statements.filter(Boolean);
    expect(stmts.length).toBe(4);
  });

  it("should parse document with both Program and Playbook", () => {
    const ast = parse(`
      Program Main { Node.emit(Δ[green], Φ[1]); }
      Playbook Sub { Node.emit(Δ[blue], Φ[2]); }
    `);
    expect(ast.statements.length).toBe(2);
    expect(ast.statements[0].type).toBe("PROGRAM");
    expect(ast.statements[1].type).toBe("PLAYBOOK");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Playbooks — all types
// ─────────────────────────────────────────────────────────────────────────────
describe("Parser: Playbooks", () => {
  it("should parse Step1/Step2/Step3/Step4 prefixed statements", () => {
    const ast = parse(`Playbook Migration {
      Step1: Node.emit(Δ[amber], Φ[1]);
      Step2: Node.detect(⊗, ⧉);
      Step3: Water.qbit(~wave(432Hz), Φ[1]);
      Step4: Log("Done");
    }`);
    const steps = ast.statements[0].steps.filter(Boolean);
    expect(steps.length).toBe(4);
  });

  it("should parse Metric: prefixed statements (adoption.geo)", () => {
    const ast = parse(`Playbook Adoption {
      Metric: Node.emit(Δ[blue], Φ[2]);
      Metric: Node.detect(⊗);
    }`);
    const steps = ast.statements[0].steps.filter(Boolean);
    expect(steps.some((s) => s && s.type === "EMIT_STMT")).toBe(true);
  });

  it("should parse Trigger with full dot-chain condition", () => {
    const ast = parse(`Playbook IR {
      Trigger: Compliance.Fail(SyntaxValidation);
      Action: Alert("Error");
    }`);
    const trigger = ast.statements[0].steps.find(
      (s) => s && s.type === "TRIGGER_STMT",
    );
    expect(trigger).toBeDefined();
    expect(trigger.actions.length).toBe(1);
  });

  it("should parse multiple Trigger blocks in one playbook", () => {
    const ast = parse(`Playbook IR {
      Trigger: Compliance.Fail(SyntaxValidation);
      Action: Alert("A");
      Trigger: Compliance.Fail(Repeatability);
      Action: Alert("B");
    }`);
    const triggers = ast.statements[0].steps.filter(
      (s) => s && s.type === "TRIGGER_STMT",
    );
    expect(triggers.length).toBe(2);
  });

  it("should parse Action with function-call body (Alert, Log, Escalate)", () => {
    const ast = parse(`Playbook IR {
      Trigger: SomeCondition;
      Action: Alert("Some message");
      Action: Escalate("Tier1");
      Action: Log("Logged");
    }`);
    const trigger = ast.statements[0].steps.find(
      (s) => s && s.type === "TRIGGER_STMT",
    );
    expect(trigger.actions.length).toBe(3);
    expect(trigger.actions[0].action).toBe("Alert");
    expect(trigger.actions[1].action).toBe("Escalate");
  });

  it("should parse Action with dot-chain body (Node.retest)", () => {
    const ast = parse(`Playbook IR {
      Trigger: SomeFail;
      Action: Node.retest(Δ[amber], Φ[1]);
    }`);
    const trigger = ast.statements[0].steps.find(
      (s) => s && s.type === "TRIGGER_STMT",
    );
    expect(trigger.actions.length).toBe(1);
    expect(trigger.actions[0].action).toBe("Node");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// End-to-end: all example + playbook .geo files execute without error
// ─────────────────────────────────────────────────────────────────────────────
describe("End-to-End: .geo file execution", () => {
  const geoFiles = [
    { label: "hello-geoqode.geo", file: "../examples/hello-geoqode.geo" },
    { label: "multi-frequency.geo", file: "../examples/multi-frequency.geo" },
    { label: "water-animation.geo", file: "../examples/water-animation.geo" },
    { label: "playbook/resonance.geo", file: "../geo/playbooks/resonance.geo" },
    { label: "playbook/migration.geo", file: "../geo/playbooks/migration.geo" },
    { label: "playbook/adoption.geo", file: "../geo/playbooks/adoption.geo" },
    { label: "playbook/incident.geo", file: "../geo/playbooks/incident.geo" },
  ];

  for (const { label, file } of geoFiles) {
    it(`should execute ${label} without error`, async () => {
      const source = fs.readFileSync(path.resolve(__dirname, file), "utf-8");
      const result = await run(source);
      expect(result.success).toBe(true);
    });
  }

  it("hello-geoqode.geo should produce 1 emission + 1 detection", async () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../examples/hello-geoqode.geo"),
      "utf-8",
    );
    const result = await run(source);
    expect(result.result.emissions).toBe(1);
    expect(result.result.detections).toBe(1);
  });

  it("multi-frequency.geo should produce 3 emissions + 3 QBITS", async () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../examples/multi-frequency.geo"),
      "utf-8",
    );
    const result = await run(source);
    expect(result.result.emissions).toBe(3);
    expect(result.result.qbits).toBe(3);
  });

  it("water-animation.geo should materialise QBITS in water pool", async () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "../examples/water-animation.geo"),
      "utf-8",
    );
    const result = await run(source);
    expect(result.result.qbits).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scripts — compliance-check and status-report smoke tests
// ─────────────────────────────────────────────────────────────────────────────
describe("Compliance: getComplianceReport() structure", () => {
  it("should include all required fields after a full run", async () => {
    const source = `Program T { Node.emit(Δ[green], Φ[1]); Node.detect(⊗, ⧉); }`;
    const engine = new ExecutionEngine();
    await engine.execute(source);
    const report = engine.compliance.getComplianceReport();

    expect(report.complianceState).toBeDefined();
    expect(report.complianceState.syntaxValidation).toBe(true);
    expect(report.complianceState.executionLogging).toBe(true);
    expect(report.complianceState.auditability).toBe(true);
    expect(report.complianceState.certifiability).toBe(true);
    expect(report.allCompliant).toBe(true);
    expect(report.merkabaDimensions.length).toBeGreaterThan(0);
  });

  it("should include correct dimension count for program with all operator types", async () => {
    const source = `Program Full {
      Node.emit(Δ[red], Φ[1]);
      Node.detect(⊗, ⧉);
      Water.qbit(~wave(528Hz), Φ[1]);
    }`;
    const engine = new ExecutionEngine();
    await engine.execute(source);
    const report = engine.compliance.getComplianceReport();
    // Tier 1 (syntax) + Tier 2 (emit/detect) + Tier 4 (QBIT)
    expect(report.merkabaDimensions.length).toBeGreaterThan(8);
  });

  it("statusReport should contain certification with certified=true", async () => {
    const engine = new ExecutionEngine();
    const result = await engine.execute(
      `Program T { Node.emit(Δ[green], Φ[1]); Node.detect(⊗, ⧉); }`,
    );
    expect(result.statusReport.certification.certified).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// EnterpriseCertifier + AuditTrail integration with real execution
// ─────────────────────────────────────────────────────────────────────────────
describe("Integration: EnterpriseCertifier with real execution", () => {
  it("should produce a structured certificate from execution result", async () => {
    const { EnterpriseCertifier } =
      await import("../geo/certification/enterprise-certifier.js");
    const source = `Program T {
      Node.emit(Δ[green], Φ[1]);
      Node.detect(⊗, ⧉);
      Water.qbit(~wave(528Hz), Φ[2]);
    }`;
    const engine = new ExecutionEngine();
    const execResult = await engine.execute(source);
    const complianceReport = engine.compliance.getComplianceReport();

    const certifier = new EnterpriseCertifier();
    const cert = certifier.certify(execResult, complianceReport, {
      name: "TestRun",
    });

    // Certificate structure must always be populated regardless of level
    expect(cert.certId).toBeDefined();
    expect(cert.level).toBeDefined();
    expect(typeof cert.certified).toBe("boolean");
    expect(cert.dimensionSummary.achieved).toBeGreaterThan(0);
    expect(cert.dimensionSummary.total).toBe(44);
    expect(cert.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(cert.auditTrailHash).toMatch(/^[a-f0-9]{64}$/);
    expect(cert.programMeta.name).toBe("TestRun");
  });

  it("should register certificate in internal registry", async () => {
    const { EnterpriseCertifier } =
      await import("../geo/certification/enterprise-certifier.js");
    const certifier = new EnterpriseCertifier();
    const cert = certifier.certify(
      {
        success: true,
        result: { emissions: 0, detections: 0, qbits: 0 },
        logs: [],
      },
      { merkabaDimensions: [1, 2, 3, 4, 5], allCompliant: true },
    );
    const lookup = certifier.getCertificate(cert.certId);
    expect(lookup).toBeDefined();
    expect(lookup.certId).toBe(cert.certId);
    expect(certifier.getRegistryStats().issued).toBe(1);
  });

  it("should return PLATINUM or GOLD level when all required dimensions achieved", async () => {
    const { EnterpriseCertifier, MERKABA_LATTICE } =
      await import("../geo/certification/enterprise-certifier.js");
    // Provide ALL 44 dimensions
    const allDimensions = Object.keys(MERKABA_LATTICE).map(Number);
    const certifier = new EnterpriseCertifier();
    const cert = certifier.certify(
      {
        success: true,
        result: { emissions: 5, detections: 5, qbits: 5 },
        logs: ["x"],
      },
      { merkabaDimensions: allDimensions, allCompliant: true },
      { name: "FullCoverage" },
    );
    expect(cert.certified).toBe(true);
    expect(["CROWN", "PLATINUM", "GOLD", "SILVER"]).toContain(cert.level);
  });
});
