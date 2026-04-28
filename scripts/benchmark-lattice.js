// scripts/benchmark-lattice.js
// Benchmarks legacy scheduler vs lattice-driven scheduler with unified integration adapters.

import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import MerkabageoqodeOS from "../geo/index.js";
import {
  createUnifiedIntegrationAdapters,
  resolveAdapterMode,
} from "../geo/runtime/integration-adapters.js";

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(
    sorted.length - 1,
    Math.ceil((p / 100) * sorted.length) - 1,
  );
  return sorted[idx];
}

function buildProgram(statementCount = 240) {
  const colors = ["blue", "green", "amber", "violet", "indigo"];
  const harmonics = [1, 2, 3, 5, 8];

  const lines = ["Program UnifiedBenchmark {"];
  for (let i = 0; i < statementCount; i += 1) {
    const color = colors[i % colors.length];
    const harmonic = harmonics[i % harmonics.length];
    const wave = 432 + (i % 5) * 24;

    lines.push(`  Node.emit(Δ[${color}], Φ[${harmonic}]);`);
    lines.push("  Node.detect(⊗, ⧉);");
    lines.push(`  Water.qbit(~wave(${wave}Hz), Φ[${harmonic}]);`);

    if (i % 4 === 0) {
      lines.push(`  Trigger:Compliance.Pass(${i});`);
      lines.push(`  Action:StabilizeLane(${i});`);
    }
  }
  lines.push('  Log("Unified benchmark complete");');
  lines.push("}");
  return lines.join("\n");
}

async function runCase({
  schedulerMode,
  integrationMode,
  lowOverheadBaseMode,
  adapterSampleEveryN,
  adapterShadowEveryN,
  iterations,
  statementCount,
}) {
  const resolvedIntegrationMode = resolveAdapterMode(integrationMode);
  const adapters = await createUnifiedIntegrationAdapters({
    mode: resolvedIntegrationMode,
  });

  const os = new MerkabageoqodeOS({
    engine: {
      schedulerMode,
      integrationMode: resolvedIntegrationMode,
      lowOverheadBaseMode,
      integrationAdapters: adapters,
      adapterSampleEveryN,
      adapterShadowEveryN,
      silent: true,
    },
  });

  const originalLog = console.log;
  const originalError = console.error;
  console.log = () => {};
  console.error = () => {};

  const program = buildProgram(statementCount);
  const runTimes = [];
  const schedulerLatency = [];
  const adapterCalls = {
    qdd: 0,
    governance: 0,
    swarm: 0,
    sampledSyncCalls: 0,
    cachedDecisions: 0,
    shadowScheduled: 0,
    shadowCompleted: 0,
    shadowSkippedBusy: 0,
  };

  let statementsExecuted = 0;
  let totalDecisions = 0;

  try {
    for (let i = 0; i < iterations; i += 1) {
      const start = performance.now();
      const output = await os.run(program, {
        schedulerMode,
        integrationMode: resolvedIntegrationMode,
        lowOverheadBaseMode,
        adapterSampleEveryN,
        adapterShadowEveryN,
        silent: true,
      });
      const elapsed = performance.now() - start;
      runTimes.push(elapsed);

      if (!output.success) {
        throw new Error(`Benchmark run failed: ${output.error}`);
      }

      const scheduler = output.result?.scheduler || {};
      schedulerLatency.push(scheduler.averageDecisionLatencyMs || 0);
      totalDecisions += scheduler.decisions || 0;
      statementsExecuted +=
        (scheduler.decisionsByType?.EMIT_STMT || 0) +
        (scheduler.decisionsByType?.DETECT_STMT || 0) +
        (scheduler.decisionsByType?.QBIT_STMT || 0) +
        (scheduler.decisionsByType?.LOG_STMT || 0) +
        (scheduler.decisionsByType?.TRIGGER_STMT || 0) +
        (scheduler.decisionsByType?.ACTION_STMT || 0);

      adapterCalls.qdd += scheduler.adapter?.qddCalls || 0;
      adapterCalls.governance += scheduler.adapter?.governanceCalls || 0;
      adapterCalls.swarm += scheduler.adapter?.swarmCalls || 0;
      adapterCalls.sampledSyncCalls += scheduler.adapter?.sampledSyncCalls || 0;
      adapterCalls.cachedDecisions += scheduler.adapter?.cachedDecisions || 0;
      adapterCalls.shadowScheduled += scheduler.adapter?.shadowScheduled || 0;
      adapterCalls.shadowCompleted += scheduler.adapter?.shadowCompleted || 0;
      adapterCalls.shadowSkippedBusy +=
        scheduler.adapter?.shadowSkippedBusy || 0;
    }
  } finally {
    console.log = originalLog;
    console.error = originalError;
    await adapters.teardown?.();
  }

  const totalMs = runTimes.reduce((sum, value) => sum + value, 0);
  const throughputStatementsPerSec = statementsExecuted / (totalMs / 1000);

  return {
    schedulerMode,
    integrationMode: resolvedIntegrationMode,
    lowOverheadBaseMode,
    adapterSampleEveryN,
    adapterShadowEveryN,
    iterations,
    statementCount,
    totals: {
      totalMs: Number(totalMs.toFixed(3)),
      statementsExecuted,
      decisions: totalDecisions,
      throughputStatementsPerSec: Number(throughputStatementsPerSec.toFixed(3)),
      adapterCalls,
    },
    latencyMs: {
      avgRunMs: Number((totalMs / iterations).toFixed(3)),
      p95RunMs: Number(percentile(runTimes, 95).toFixed(3)),
      avgDecisionMs: Number(
        (
          schedulerLatency.reduce((sum, value) => sum + value, 0) /
          Math.max(1, schedulerLatency.length)
        ).toFixed(6),
      ),
    },
    adapterMetrics: {
      sampledSyncCalls: adapterCalls.sampledSyncCalls,
      cachedDecisions: adapterCalls.cachedDecisions,
      shadowScheduled: adapterCalls.shadowScheduled,
      shadowCompleted: adapterCalls.shadowCompleted,
      shadowSkippedBusy: adapterCalls.shadowSkippedBusy,
    },
    adapterDiagnostics: adapters.diagnostics?.() || null,
  };
}

function compare(baseCase, candidateCase) {
  const baseAvg = baseCase.latencyMs.avgRunMs;
  const candidateAvg = candidateCase.latencyMs.avgRunMs;
  const deltaMs = candidateAvg - baseAvg;
  const deltaPct = baseAvg > 0 ? (deltaMs / baseAvg) * 100 : 0;

  const baseThroughput = baseCase.totals.throughputStatementsPerSec;
  const candidateThroughput = candidateCase.totals.throughputStatementsPerSec;
  const throughputDeltaPct =
    baseThroughput > 0
      ? ((candidateThroughput - baseThroughput) / baseThroughput) * 100
      : 0;

  return {
    baseline: `${baseCase.schedulerMode}/${baseCase.integrationMode}`,
    candidate: `${candidateCase.schedulerMode}/${candidateCase.integrationMode}`,
    avgRunDeltaMs: Number(deltaMs.toFixed(3)),
    avgRunDeltaPct: Number(deltaPct.toFixed(3)),
    throughputDeltaPct: Number(throughputDeltaPct.toFixed(3)),
  };
}

async function main() {
  const iterations = Number.parseInt(
    process.env.MERKABA_BENCH_ITERATIONS || "8",
    10,
  );
  const statementCount = Number.parseInt(
    process.env.MERKABA_BENCH_STATEMENTS || "120",
    10,
  );
  const includeReal =
    process.env.MERKABA_BENCH_REAL === "true" ||
    process.argv.includes("--real");
  const sampleEveryN = Number.parseInt(
    process.env.MERKABA_ADAPTER_SAMPLE_EVERY_N || "16",
    10,
  );
  const shadowEveryN = Number.parseInt(
    process.env.MERKABA_ADAPTER_SHADOW_EVERY_N || "32",
    10,
  );

  const cases = [
    {
      schedulerMode: "legacy",
      integrationMode: "off",
      iterations,
      statementCount,
    },
    {
      schedulerMode: "lattice",
      integrationMode: "off",
      iterations,
      statementCount,
    },
    {
      schedulerMode: "lattice",
      integrationMode: "simulated",
      iterations,
      statementCount,
    },
    {
      schedulerMode: "lattice",
      integrationMode: "low-overhead-simulated",
      adapterSampleEveryN: sampleEveryN,
      adapterShadowEveryN: shadowEveryN,
      lowOverheadBaseMode: "simulated",
      iterations,
      statementCount,
    },
  ];

  if (includeReal) {
    cases.push({
      schedulerMode: "lattice",
      integrationMode: "low-overhead",
      adapterSampleEveryN: sampleEveryN,
      adapterShadowEveryN: shadowEveryN,
      lowOverheadBaseMode: "real",
      iterations,
      statementCount,
    });

    cases.push({
      schedulerMode: "lattice",
      integrationMode: "real",
      iterations,
      statementCount,
    });
  }

  const startedAt = new Date().toISOString();
  const results = [];

  for (const benchmarkCase of cases) {
    // Keep this output visible for operator confidence.
    console.log(
      `[benchmark] running ${benchmarkCase.schedulerMode}/${benchmarkCase.integrationMode}...`,
    );
    results.push(await runCase(benchmarkCase));
  }

  const baseline = results[0];
  const comparisons = results
    .slice(1)
    .map((candidate) => compare(baseline, candidate));

  const report = {
    startedAt,
    finishedAt: new Date().toISOString(),
    host: {
      platform: process.platform,
      node: process.version,
    },
    config: {
      iterations,
      statementCount,
      sampleEveryN,
      shadowEveryN,
      includeReal,
    },
    results,
    comparisons,
  };

  const outDir = path.join(process.cwd(), "STATUSREPORT", "benchmarks");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(
    outDir,
    `lattice-benchmark-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("\n=== MERKABA LATTICE BENCHMARK REPORT ===");
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nReport saved: ${outPath}`);
}

main().catch((error) => {
  console.error("Benchmark failed:", error);
  process.exit(1);
});
