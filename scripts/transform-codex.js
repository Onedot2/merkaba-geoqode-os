#!/usr/bin/env node

import {
  StormMerkabaTransformCodex,
  CANONICAL_ARCHITECTURE,
} from "../geo/index.js";

const codex = new StormMerkabaTransformCodex();
const result = codex.executeCodex();

console.log("=== MERKABA Canonical Codex Upgrade ===");
console.log(`Architecture: ${CANONICAL_ARCHITECTURE}`);
console.log(`Status: ${result.status}`);
console.log(`Certificate: ${result.phases.validation.certificate}`);
console.log("");
console.log(result.log.join("\n"));
console.log("");
console.log(
  JSON.stringify(
    {
      ok: result.ok,
      status: result.status,
      architecture: result.architecture,
      coherenceIndex: result.phases.mitigation.coherenceIndex,
      bridgeLayer: result.phases.resonance.bridgeLayer,
      overlay: result.phases.overlay.subsystemProgress,
      certificate: result.phases.validation.certificate,
    },
    null,
    2,
  ),
);
