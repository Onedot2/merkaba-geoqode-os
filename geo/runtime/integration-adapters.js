// geo/runtime/integration-adapters.js
// Unified adapters for cross-repo orchestration benchmarks.

function fileUrl(relativePath) {
  return new URL(relativePath, import.meta.url).href;
}

function avg(list) {
  if (!list.length) return 0;
  return list.reduce((sum, value) => sum + value, 0) / list.length;
}

function createNoopAdapters(mode = "off") {
  return {
    mode,
    qdd: {
      async decide() {
        return { mode, decision: "noop" };
      },
    },
    governance: {
      async evaluate() {
        return { mode, throttle: 1 };
      },
    },
    swarm: {
      async allocate() {
        return { mode, workers: 1, parallelLane: 0 };
      },
    },
    diagnostics() {
      return {
        mode,
        notes: "No-op adapters active",
      };
    },
    async teardown() {
      return;
    },
  };
}

function createSimulatedAdapters() {
  const qddScores = [];
  const governanceThrottles = [];
  const swarmWorkers = [];

  return {
    mode: "simulated",
    qdd: {
      async decide(context) {
        const score = Number(
          (
            ((context.decision.dimension * 1.618 + context.stepIndex * 0.5) %
              10) /
            10
          ).toFixed(4),
        );
        qddScores.push(score);
        return {
          mode: "simulated",
          qddScore: score,
          policy: score > 0.5 ? "expand" : "stabilize",
        };
      },
    },
    governance: {
      async evaluate(context) {
        const throttle = Number(
          (1 - Math.min(0.25, (context.stepIndex % 12) / 120)).toFixed(4),
        );
        governanceThrottles.push(throttle);
        return {
          mode: "simulated",
          throttle,
          governanceLane: context.decision.lane,
        };
      },
    },
    swarm: {
      async allocate(context) {
        const workers = Math.max(
          1,
          Math.min(8, Math.ceil(context.decision.priority * 2)),
        );
        swarmWorkers.push(workers);
        return {
          mode: "simulated",
          workers,
          parallelLane: context.decision.dimension % 4,
        };
      },
    },
    diagnostics() {
      return {
        mode: "simulated",
        qddAvgScore: Number(avg(qddScores).toFixed(4)),
        governanceAvgThrottle: Number(avg(governanceThrottles).toFixed(4)),
        swarmAvgWorkers: Number(avg(swarmWorkers).toFixed(4)),
      };
    },
    async teardown() {
      return;
    },
  };
}

export async function createUnifiedIntegrationAdapters(options = {}) {
  const mode = String(options.mode || "off").toLowerCase();

  if (mode === "off") {
    return createNoopAdapters("off");
  }

  if (mode === "simulated") {
    return createSimulatedAdapters();
  }

  if (mode !== "real") {
    return createNoopAdapters("off");
  }

  const diagnostics = {
    mode: "real",
    qdd: "unavailable",
    governance: "unavailable",
    swarm: "unavailable",
    warnings: [],
  };

  let orchestrator = null;
  let brain = null;
  let swarm = null;

  try {
    const qddModulePath =
      options.qddModuleUrl ||
      fileUrl(
        "../../../pwai-controller/src/core/q-dd-orchestrator-integration.js",
      );
    const qddModule = await import(qddModulePath);
    const QDDClass = qddModule.S4AiQDDOrchestrator || qddModule.default;
    orchestrator = new QDDClass({ enabled: false, verbose: false });
    diagnostics.qdd = "loaded";
  } catch (error) {
    diagnostics.warnings.push(`QDD adapter fallback: ${error.message}`);
  }

  try {
    const brainModulePath =
      options.governanceModuleUrl ||
      fileUrl("../../../pwai-api-service/agent-core/brain.js");
    const brainModule = await import(brainModulePath);
    const BrainClass = brainModule.default;
    brain = new BrainClass({ loopInterval: 3600000, researchFrequency: 9999 });
    diagnostics.governance = "loaded";
  } catch (error) {
    diagnostics.warnings.push(`Governance adapter fallback: ${error.message}`);
  }

  try {
    const swarmModulePath =
      options.swarmModuleUrl ||
      fileUrl("../../../pwai-ai-worker/src/core/swarm-orchestrator.js");
    const swarmModule = await import(swarmModulePath);
    const SwarmClass = swarmModule.default;
    swarm = new SwarmClass();
    swarm.initializeDefaultSwarm();
    diagnostics.swarm = "loaded";
  } catch (error) {
    diagnostics.warnings.push(`Swarm adapter fallback: ${error.message}`);
  }

  return {
    mode: "real",
    qdd: {
      async decide() {
        if (
          !orchestrator ||
          typeof orchestrator.gatherSystemState !== "function"
        ) {
          return { mode: "real", decision: "fallback-no-qdd" };
        }

        const state = await orchestrator.gatherSystemState();
        const cpu = Number(state?.metrics?.cpu || 0);
        return {
          mode: "real",
          decision: cpu > 70 ? "stabilize" : "expand",
          cpu,
        };
      },
    },
    governance: {
      async evaluate() {
        if (!brain || typeof brain.decideFocus !== "function") {
          return { mode: "real", throttle: 1, focus: "fallback-no-governance" };
        }

        const focus = await brain.decideFocus();
        return {
          mode: "real",
          throttle: focus?.priority === "high" ? 0.95 : 1,
          focus: focus?.name || "unknown",
        };
      },
    },
    swarm: {
      async allocate(context) {
        if (!swarm || typeof swarm.getSwarmMetrics !== "function") {
          return { mode: "real", workers: 1, parallelLane: 0 };
        }

        const typeMap = {
          EMIT_STMT: "optimization",
          DETECT_STMT: "research",
          QBIT_STMT: "testing",
          ACTION_STMT: "deployment",
          TRIGGER_STMT: "code-review",
        };
        const taskType = typeMap[context.decision.statementType] || "research";
        await swarm.submitTask({
          type: taskType,
          query: "merkaba-lattice-benchmark",
        });
        const metrics = swarm.getSwarmMetrics();
        return {
          mode: "real",
          workers: metrics.totalAgents,
          parallelLane: metrics.tasksProcessed % 4,
          swarmHealth: metrics.swarmHealth,
        };
      },
    },
    diagnostics() {
      return diagnostics;
    },
    async teardown() {
      if (swarm && typeof swarm.terminate === "function") {
        swarm.terminate();
      }
      return;
    },
  };
}

export function resolveAdapterMode(input) {
  const mode = String(input || "off").toLowerCase();
  if (mode === "off" || mode === "simulated" || mode === "real") {
    return mode;
  }
  return "off";
}

export default {
  createUnifiedIntegrationAdapters,
  resolveAdapterMode,
};
