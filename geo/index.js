// geo/index.js
// MERKABA_geoqode OS — Main Entry Point

import { Parser } from './grammar/parser.js';
import { ExecutionEngine } from './runtime/execution-engine.js';

/**
 * MERKABA_geoqode Operating System
 * Dedicated AI OS for GeoQode program execution
 */
export class MerkabageoqodeOS {
  constructor() {
    this.engine = new ExecutionEngine();
    this.version = '1.0.0';
    this.name = 'MERKABA_geoqode OS';
  }

  /**
   * Parse GeoQode source
   */
  parse(source) {
    const parser = new Parser(source);
    return parser.parse();
  }

  /**
   * Execute GeoQode program
   */
  async run(source) {
    return await this.engine.execute(source);
  }

  /**
   * Get status report
   */
  getStatusReport() {
    return this.engine.getStatusReport();
  }

  /**
   * Get execution result
   */
  getResult() {
    return this.engine.getResult();
  }

  /**
   * Reset OS state
   */
  reset() {
    this.engine.reset();
  }

  /**
   * Get system info
   */
  getSystemInfo() {
    return {
      name: this.name,
      version: this.version,
      engineReady: !!this.engine,
      lastStatusReport: this.engine.getStatusReport(),
    };
  }
}

// Default export
export default MerkabageoqodeOS;
