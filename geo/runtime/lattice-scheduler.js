// geo/runtime/lattice-scheduler.js
// Lattice-driven scheduler for GeoQode runtime decisions.

import { performance } from "node:perf_hooks";
import { CANONICAL_LATTICE_NODES, PHI } from "../lattice/transform-420.js";

const DEFAULT_TYPE_TO_DIMENSION = Object.freeze({
  EMIT_STMT: 8,
  DETECT_STMT: 26,
  QBIT_STMT: 48,
  LOG_STMT: 12,
  TRIGGER_STMT: 34,
  ACTION_STMT: 40,
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeMode(mode) {
  const normalized = String(mode || "legacy")
    .trim()
    .toLowerCase();
  return normalized === "lattice" ? "lattice" : "legacy";
}

function safeAverage(total, count) {
  return count > 0 ? total / count : 0;
}

export class LatticeScheduler {
  constructor(options = {}) {
    this.mode = normalizeMode(options.mode);
    this.integrationMode = String(
      options.integrationMode || "off",
    ).toLowerCase();
    this.adapters = options.adapters || null;
    this.typeToDimension = {
      ...DEFAULT_TYPE_TO_DIMENSION,
      ...(options.typeToDimension || {}),
    };
    this.resetMetrics();
  }

  setMode(mode) {
    this.mode = normalizeMode(mode);
  }

  resetMetrics() {
    this.metrics = {
      mode: this.mode,
      integrationMode: this.integrationMode,
      decisions: 0,
      decisionsByType: {},
      decisionLatencyMsTotal: 0,
      averageDecisionLatencyMs: 0,
      lanes: {
        FOUNDATION: 0,
        BOSONIC: 0,
        CANONICAL: 0,
      },
      adapter: {
        qddCalls: 0,
        qddLatencyMsTotal: 0,
        governanceCalls: 0,
        governanceLatencyMsTotal: 0,
        swarmCalls: 0,
        swarmLatencyMsTotal: 0,
      },
    };
  }

  getMetrics() {
    const snapshot = structuredClone(this.metrics);
    snapshot.mode = this.mode;
    snapshot.averageDecisionLatencyMs = safeAverage(
      this.metrics.decisionLatencyMsTotal,
      this.metrics.decisions,
    );
    snapshot.adapter.qddAvgLatencyMs = safeAverage(
      this.metrics.adapter.qddLatencyMsTotal,
      this.metrics.adapter.qddCalls,
    );
    snapshot.adapter.governanceAvgLatencyMs = safeAverage(
      this.metrics.adapter.governanceLatencyMsTotal,
      this.metrics.adapter.governanceCalls,
    );
    snapshot.adapter.swarmAvgLatencyMs = safeAverage(
      this.metrics.adapter.swarmLatencyMsTotal,
      this.metrics.adapter.swarmCalls,
    );
    return snapshot;
  }

  getLaneForDimension(dimension) {
    if (dimension <= 8) return "FOUNDATION";
    if (dimension <= 26) return "BOSONIC";
    return "CANONICAL";
  }

  computeDimension(statement, context) {
    const base = this.typeToDimension[statement?.type] || 1;
    const harmonic = Number.parseFloat(statement?.harmonic?.value || "1") || 1;
    const seed =
      base +
      context.stepIndex * 7 +
      context.programSize * 3 +
      Math.round(harmonic * 5);
    return ((seed - 1) % CANONICAL_LATTICE_NODES) + 1;
  }

  async maybeRunUnifiedAdapters(decision, context) {
    const output = {
      qdd: null,
      governance: null,
      swarm: null,
    };

    if (!this.adapters || this.integrationMode === "off") {
      return output;
    }

    const adapterContext = {
      ...context,
      decision,
    };

    if (this.adapters.qdd?.decide) {
      const qddStart = performance.now();
      output.qdd = await this.adapters.qdd.decide(adapterContext);
      this.metrics.adapter.qddCalls += 1;
      this.metrics.adapter.qddLatencyMsTotal += performance.now() - qddStart;
    }

    if (this.adapters.governance?.evaluate) {
      const governanceStart = performance.now();
      output.governance =
        await this.adapters.governance.evaluate(adapterContext);
      this.metrics.adapter.governanceCalls += 1;
      this.metrics.adapter.governanceLatencyMsTotal +=
        performance.now() - governanceStart;
    }

    if (this.adapters.swarm?.allocate) {
      const swarmStart = performance.now();
      output.swarm = await this.adapters.swarm.allocate(adapterContext);
      this.metrics.adapter.swarmCalls += 1;
      this.metrics.adapter.swarmLatencyMsTotal +=
        performance.now() - swarmStart;
    }

    return output;
  }

  async decide(statement, context) {
    const decisionStart = performance.now();
    const statementType = statement?.type || "UNKNOWN";
    const safeContext = {
      stepIndex: context?.stepIndex || 0,
      cycle: context?.cycle || 0,
      nodePoolSize: context?.nodePoolSize || 1,
      waterPoolSize: context?.waterPoolSize || 1,
      programSize: context?.programSize || 1,
    };

    const dimension = this.computeDimension(statement, safeContext);
    const lane = this.getLaneForDimension(dimension);
    const laneBias =
      lane === "FOUNDATION" ? 0.85 : lane === "BOSONIC" ? 1.0 : 1.15;

    let decision = {
      mode: this.mode,
      statementType,
      dimension,
      lane,
      priority: 1,
      nodeIndex: safeContext.stepIndex % safeContext.nodePoolSize,
      waterIndex: safeContext.stepIndex % safeContext.waterPoolSize,
      context: {
        ...safeContext,
      },
    };

    if (this.mode === "lattice") {
      decision = {
        ...decision,
        priority: Number(
          clamp(
            (dimension / CANONICAL_LATTICE_NODES) * PHI * laneBias,
            0.25,
            2.0,
          ).toFixed(4),
        ),
        nodeIndex: (dimension + safeContext.cycle) % safeContext.nodePoolSize,
        waterIndex:
          (dimension * 2 + safeContext.stepIndex) % safeContext.waterPoolSize,
      };

      const adapterResults = await this.maybeRunUnifiedAdapters(
        decision,
        safeContext,
      );
      decision.adapter = adapterResults;

      // Optional adapter influence over routing.
      if (adapterResults.swarm?.parallelLane !== undefined) {
        const laneShift = Number(adapterResults.swarm.parallelLane) || 0;
        decision.nodeIndex =
          (decision.nodeIndex + laneShift) % safeContext.nodePoolSize;
      }

      if (
        adapterResults.governance?.throttle &&
        adapterResults.governance.throttle < 1
      ) {
        decision.priority = Number(
          (decision.priority * adapterResults.governance.throttle).toFixed(4),
        );
      }
    }

    this.metrics.decisions += 1;
    this.metrics.decisionsByType[statementType] =
      (this.metrics.decisionsByType[statementType] || 0) + 1;
    this.metrics.lanes[lane] += 1;

    const decisionLatency = performance.now() - decisionStart;
    this.metrics.decisionLatencyMsTotal += decisionLatency;
    this.metrics.averageDecisionLatencyMs = safeAverage(
      this.metrics.decisionLatencyMsTotal,
      this.metrics.decisions,
    );

    return decision;
  }
}

export default LatticeScheduler;
