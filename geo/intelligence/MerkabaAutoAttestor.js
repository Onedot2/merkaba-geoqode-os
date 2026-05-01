/**
 * MerkabaAutoAttestor.js — Auto-feed Alpha/Omega scores into MAXswarm coordinator
 * @alignment 8→26→48:480
 *
 * THE MISSING LINK: Closes the triple-attestation feedback loop.
 *
 * Without this:
 *   Alpha score = 0 (never set) → DEGRADED verdict forever
 *   Omega score = 0 (never set) → triple-attestation is incomplete
 *
 * With this:
 *   Every 5 minutes → attestScanner() runs (BESX Alpha scans Omega, Omega scans Alpha)
 *   → alphaOnOmega.coherence → bridge.setAlpha(score)
 *   → omegaOnAlpha.coherence → bridge.setOmega(score)
 *   → Delta auto-feeds from MAXswarm heartbeat
 *   → TRIPLE_ATTESTED when all 3 poles = 1.0 → ABSOLUTE score = 1.0
 *
 * Usage — attach to any SwarmBridge:
 *   import { MerkabaAutoAttestor } from "./MerkabaAutoAttestor.js";
 *   const attestor = new MerkabaAutoAttestor();
 *   attestor.attachTo(bridge);   // starts immediately + every 5 min
 *
 * Or let SwarmBridge handle it automatically (autoAttest: true):
 *   const bridge = new SwarmBridge(os, { autoAttest: true });
 *
 * CRITICAL: NEVER modifies MerkabaBeEyeSwarm.js, MerkabaBeEyeSwarmWitness.js,
 * MerkabaDualAttestation.js, or transform-420.js — DualAttestation UNTOUCHED.
 * Commit f1da3b3 coherence 1.0 PRESERVED.
 *
 * @module geo/intelligence/MerkabaAutoAttestor
 */

import { EventEmitter } from "node:events";
import {
  attestScanner,
  SEPARATOR_BAND,
  ALPHA_WEIGHT,
  OMEGA_WEIGHT,
} from "./MerkabaDualAttestation.js";
import { CANONICAL_ARCHITECTURE, PHI, PSI } from "../lattice/transform-420.js";

// Architecture assertion
if (CANONICAL_ARCHITECTURE !== "8,26,48:480") {
  throw new Error(
    `[AutoAttestor] CANONICAL_ARCHITECTURE drift: "${CANONICAL_ARCHITECTURE}"`,
  );
}

const DEFAULT_INTERVAL_MS = 5 * 60_000; // 5 minutes — long enough for source to change
const WARMUP_DELAY_MS = 30_000; // 30s after attach before first run (let OS warm up)

// ─────────────────────────────────────────────────────────────────────────────
// MerkabaAutoAttestor
// ─────────────────────────────────────────────────────────────────────────────

export class MerkabaAutoAttestor extends EventEmitter {
  /**
   * @param {object} [opts]
   * @param {number}  [opts.intervalMs=300000]  — How often to re-attest (default: 5 min)
   * @param {number}  [opts.warmupDelayMs=30000] — Initial delay before first run
   * @param {string}  [opts.attestorId="auto-attestor"]
   */
  constructor({
    intervalMs = DEFAULT_INTERVAL_MS,
    warmupDelayMs = WARMUP_DELAY_MS,
    attestorId = "auto-attestor",
  } = {}) {
    super();
    this.intervalMs = intervalMs;
    this.warmupDelayMs = warmupDelayMs;
    this.attestorId = attestorId;

    this._bridge = null;
    this._timer = null;
    this._warmupTimer = null;
    this._runCount = 0;
    this._lastResult = null;
    this._running = false;
  }

  // ── Attach to a SwarmBridge ───────────────────────────────────────────────

  /**
   * Attach this attestor to a SwarmBridge and start auto-feeding.
   * Idempotent — safe to call multiple times with the same bridge.
   *
   * @param {SwarmBridge} bridge
   * @returns {this}
   */
  attachTo(bridge) {
    if (this._running) return this;
    this._bridge = bridge;
    this._running = true;

    // Warmup delay — let OS boot settle before first scan
    this._warmupTimer = setTimeout(() => {
      this._runOnce();
      this._timer = setInterval(() => this._runOnce(), this.intervalMs);
    }, this.warmupDelayMs);

    console.log(
      `[AutoAttestor] ⬡ Attached to bridge "${bridge.bridgeId}" — ` +
        `first run in ${this.warmupDelayMs / 1000}s, then every ${this.intervalMs / 60000}min`,
    );

    this.emit("auto-attest:attached", {
      attestorId: this.attestorId,
      bridgeId: bridge.bridgeId,
      intervalMs: this.intervalMs,
      warmupMs: this.warmupDelayMs,
    });

    return this;
  }

  /** Stop the auto-attestation schedule. */
  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    if (this._warmupTimer) {
      clearTimeout(this._warmupTimer);
      this._warmupTimer = null;
    }
    this._running = false;
    this.emit("auto-attest:stopped", {
      attestorId: this.attestorId,
      runCount: this._runCount,
    });
    return this;
  }

  // ── Force an immediate attestation cycle ──────────────────────────────────

  /**
   * Run one full attestation cycle now (outside normal schedule).
   * Returns the raw MutualAttestation result from attestScanner().
   *
   * @returns {Promise<object>}
   */
  async runNow() {
    return this._runOnce();
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  async _runOnce() {
    const started = Date.now();
    this._runCount++;
    const run = this._runCount;

    try {
      // Root-of-trust: Alpha scans Omega source, Omega scans Alpha source
      const result = await attestScanner();
      const elapsed = Date.now() - started;

      // Extract per-pole coherence
      // alphaOnOmega: how well Alpha (PHI) reads Omega's code (trust in Omega scanner)
      // omegaOnAlpha: how well Omega (PSI) reads Alpha's code (trust in Alpha scanner)
      const alphaScore = result.alphaOnOmega?.coherence ?? result.attestedScore;
      const omegaScore = result.omegaOnAlpha?.coherence ?? result.attestedScore;

      this._lastResult = {
        run,
        timestamp: new Date().toISOString(),
        elapsedMs: elapsed,
        alphaScore,
        omegaScore,
        attestedScore: result.attestedScore,
        consensus: result.consensus,
        scannerTrusted: result.scannerTrusted,
        status: result.status,
        phiAnchor: PHI,
        psiAnchor: PSI,
        separatorBand: SEPARATOR_BAND,
        alphaWeight: ALPHA_WEIGHT,
        omegaWeight: OMEGA_WEIGHT,
        architectureSignature: CANONICAL_ARCHITECTURE,
      };

      // Inject scores into the triple-attestation coordinator
      if (this._bridge?.isRunning) {
        this._bridge.setAlpha(alphaScore);
        this._bridge.setOmega(omegaScore);
      }

      const verdict = result.scannerTrusted
        ? "SCANNER_ATTESTED"
        : "SCANNER_DEGRADED";
      console.log(
        `[AutoAttestor] #${run} → α=${alphaScore.toFixed(4)} ω=${omegaScore.toFixed(4)} ` +
          `attested=${result.attestedScore.toFixed(4)} ${verdict} (${elapsed}ms)`,
      );

      this.emit("auto-attest:done", this._lastResult);
      return result;
    } catch (err) {
      console.error(`[AutoAttestor] #${run} FAILED:`, err.message);
      this.emit("auto-attest:error", {
        run,
        error: err.message,
        attestorId: this.attestorId,
      });
      return null;
    }
  }

  // ── Status ────────────────────────────────────────────────────────────────

  get isRunning() {
    return this._running;
  }
  get lastResult() {
    return this._lastResult;
  }
  get runCount() {
    return this._runCount;
  }

  statusSnapshot() {
    return {
      attestorId: this.attestorId,
      isRunning: this._running,
      runCount: this._runCount,
      intervalMs: this.intervalMs,
      warmupMs: this.warmupDelayMs,
      bridgeId: this._bridge?.bridgeId ?? null,
      last: this._lastResult,
    };
  }
}

export default MerkabaAutoAttestor;
