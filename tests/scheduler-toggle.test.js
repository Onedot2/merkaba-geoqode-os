// tests/scheduler-toggle.test.js

import { describe, it, expect } from "vitest";
import { ExecutionEngine } from "../geo/runtime/execution-engine.js";
import { createUnifiedIntegrationAdapters } from "../geo/runtime/integration-adapters.js";

const PROGRAM = `Program SchedulerToggle {
  Node.emit(Δ[blue], Φ[2]);
  Node.detect(⊗, ⧉);
  Water.qbit(~wave(528Hz), Φ[3]);
  Trigger:Compliance.Pass(1);
  Action:StabilizeLane(1);
  Log("done");
}`;

describe("ExecutionEngine scheduler toggle", () => {
  it("runs in legacy scheduler mode with decision telemetry", async () => {
    const engine = new ExecutionEngine({
      schedulerMode: "legacy",
      integrationMode: "off",
      silent: true,
    });

    const output = await engine.execute(PROGRAM, {
      schedulerMode: "legacy",
      integrationMode: "off",
      silent: true,
    });

    expect(output.success).toBe(true);
    expect(output.result.scheduler.mode).toBe("legacy");
    expect(output.result.scheduler.decisions).toBeGreaterThan(0);
    expect(output.result.scheduler.adapter.qddCalls).toBe(0);
  });

  it("runs in lattice mode with simulated unified adapters", async () => {
    const adapters = await createUnifiedIntegrationAdapters({
      mode: "simulated",
    });
    const engine = new ExecutionEngine({
      schedulerMode: "lattice",
      integrationMode: "simulated",
      integrationAdapters: adapters,
      silent: true,
    });

    const output = await engine.execute(PROGRAM, {
      schedulerMode: "lattice",
      integrationMode: "simulated",
      silent: true,
    });

    expect(output.success).toBe(true);
    expect(output.result.scheduler.mode).toBe("lattice");
    expect(output.result.scheduler.decisions).toBeGreaterThan(0);
    expect(output.result.scheduler.adapter.qddCalls).toBeGreaterThan(0);
    expect(output.result.scheduler.adapter.governanceCalls).toBeGreaterThan(0);
    expect(output.result.scheduler.adapter.swarmCalls).toBeGreaterThan(0);
    expect(output.result.integration.mode).toBe("simulated");

    await adapters.teardown();
  });
});
