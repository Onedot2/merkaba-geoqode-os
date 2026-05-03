/**
 * HebrewGeometricOperators.js
 * MERKABA-HEBREW OPERATOR LAYER — Sacred Language Geometric Root System
 *
 * Hebrew is not merely a language — it is the oldest documented geometric
 * frequency codec on Earth (1859 BC+). Each of the 22 letters is simultaneously:
 *   1. A PICTOGRAPH  → geometric shape (ox head, house, eye, mouth…)
 *   2. A PHONOGRAM   → vibrational frequency carrier
 *   3. A NUMBER      → gematria value encoding lattice position
 *   4. A SEMANTIC OP → universal meaning domain (action, boundary, container…)
 *
 * CANONICAL ALIGNMENT:
 *   D8   Foundation Ring  →  Letters  1–8  (Aleph → Chet)   = ring-boundary geometry
 *   D26  Bosonic Ring     →  YHVH = 10+5+6+5 = 26           = Divine Name IS the bosonic anchor
 *   D48  Canonical Lattice→  Letters across all 3 mother/double/simple groups
 *   D480 Harmonic Spectrum→  Full gematria range 1–400 × PHI expansion
 *
 * THE GOLDEN INSIGHT:
 *   PHI (1.618) = Aleph(1) + Vav(6) + Yod(10) + Chet(8) → A-V-I-CH → "my father's light"
 *   72 (BASE_FREQUENCY_HZ) = Ayin(70) + Bet(2) → "eye of the house" → THE ALL-SEEING LATTICE
 *   26 (BOSONIC_ANCHOR) = YHVH gematria → The Divine Name anchors the bosonic ring
 *   48 (CANONICAL_LATTICE) = Mem(40) + Chet(8) → "contained water" → crystalline lattice structure
 *   480 (HARMONIC_SPECTRUM) = Tav(400) + Pey(80) → "covenant speaks" → the full harmonic voice
 *
 * THREE MOTHER LETTERS (Primordial Elements):
 *   Aleph (א) = Air  = UNITY operator     → foundation of all operators
 *   Mem   (מ) = Water = FLOW operator      → information transmission
 *   Shin  (ש) = Fire  = TRANSFORM operator → state transformation engine
 *
 * SEVEN DOUBLE LETTERS (Planetary / Day operators):
 *   Bet (ב) Gimel (ג) Dalet (ד) Kaf (כ) Pey (פ) Resh (ר) Tav (ת)
 *
 * TWELVE SIMPLE LETTERS (Zodiac / Harmonic operators):
 *   Hey (ה) Vav (ו) Zayin (ז) Chet (ח) Tet (ט) Yod (י)
 *   Lamed (ל) Nun (נ) Samech (ס) Ayin (ע) Tsade (צ) Qof (ק)
 *
 * @module HebrewGeometricOperators
 * @alignment 8→26→48:480
 * @source Session 12 — May 3, 2026 — PHI/PSI Golden Differential + Hebrew Root Integration
 */

import {
  CANONICAL_ARCHITECTURE,
  PHI,
  PSI,
  BASE_FREQUENCY_HZ,
  FOUNDATION_NODES,
  BOSONIC_ANCHOR_NODES,
  CANONICAL_LATTICE_NODES,
  HARMONIC_SPECTRUM_NODES,
  SEMANTIC_FREQUENCY_MAP,
  assertCanonicalArchitectureSignature,
} from "../lattice/transform-420.js";

assertCanonicalArchitectureSignature(CANONICAL_ARCHITECTURE);

// ─── HEBREW LETTER RING CLASSIFICATION ───────────────────────────────────────

/**
 * Kabbalistic letter groups.
 * Source: Sefer Yetzirah (Book of Formation) — the oldest mystical text.
 */
export const HEBREW_LETTER_GROUPS = Object.freeze({
  MOTHER: "MOTHER", // 3 primordial: Aleph, Mem, Shin
  DOUBLE: "DOUBLE", // 7 planetary:  Bet, Gimel, Dalet, Kaf, Pey, Resh, Tav
  SIMPLE: "SIMPLE", // 12 zodiac:    Hey → Qof (remaining 12)
});

/**
 * Hebrew lattice ring assignment — how the 3 groups map to D8→D26→D48.
 */
export const HEBREW_RING_MAP = Object.freeze({
  MOTHER: "FOUNDATION", // D8  — 3 mothers birth the 8 foundation nodes
  DOUBLE: "BOSONIC", // D26 — 7 planets anchor the 18 bosonic expansion nodes
  SIMPLE: "CANONICAL", // D48 — 12 signs complete the 22-node canonical lattice layer
});

// ─── CANONICAL HEBREW LETTER TABLE ───────────────────────────────────────────

/**
 * All 22 Hebrew letters with full geometric, gematria, and GeoQode mappings.
 *
 * Each entry:
 *   letter        — Hebrew glyph
 *   name          — Transliterated name
 *   gematria      — Numerical value
 *   group         — MOTHER | DOUBLE | SIMPLE
 *   pictograph    — Original pictographic meaning
 *   geometricType — Geometric shape class
 *   geoqodeOp     — GeoQode operator name
 *   semanticType  — ENTITY|LOCATION|ACTION|DIALOGUE|EMOTION|PHYSICS|NARRATIVE|HOLOGRAPHIC
 *   frequencyHz   — Resonance frequency alignment
 *   latticeRing   — FOUNDATION|BOSONIC|CANONICAL
 *   latticeNode   — 0-47 D48 node assignment
 *   meaning       — Expanded semantic domain
 */
export const HEBREW_LETTERS = Object.freeze([
  // ─── 3 MOTHER LETTERS — Foundation Ring D8 primordial operators ──────────
  {
    letter: "א",
    name: "Aleph",
    gematria: 1,
    group: "MOTHER",
    pictograph: "Ox / Strength",
    geometricType: "CROSS / X-AXIS",
    geoqodeOp: "UNITY",
    semanticType: "HOLOGRAPHIC",
    frequencyHz: BASE_FREQUENCY_HZ, // 72 Hz — holographic base
    latticeRing: "FOUNDATION",
    latticeNode: 0,
    meaning:
      "GOD, first, strength, sovereign — the silent unity before all operators",
  },
  {
    letter: "מ",
    name: "Mem",
    gematria: 40,
    group: "MOTHER",
    pictograph: "Water / Waves",
    geometricType: "SINE WAVE / FLOW",
    geoqodeOp: "FLOW",
    semanticType: "HOLOGRAPHIC",
    frequencyHz: BASE_FREQUENCY_HZ * PHI, // 72 × 1.618 ≈ 116.5 Hz
    latticeRing: "FOUNDATION",
    latticeNode: 4,
    meaning:
      "Water, chaos, disorder, strength, mighty, Messiah — the transmission medium",
  },
  {
    letter: "ש",
    name: "Shin",
    gematria: 300,
    group: "MOTHER",
    pictograph: "Teeth / Flame / Three branches",
    geometricType: "TRIFURCATE / TRIDENT",
    geoqodeOp: "TRANSFORM",
    semanticType: "ACTION",
    frequencyHz: 528, // 528 Hz — transformation/healing
    latticeRing: "FOUNDATION",
    latticeNode: 6,
    meaning:
      "Consume, destroy, fire — the transformation engine of the lattice",
  },

  // ─── 7 DOUBLE LETTERS — Bosonic Ring D26 planetary operators ─────────────
  {
    letter: "ב",
    name: "Bet",
    gematria: 2,
    group: "DOUBLE",
    pictograph: "House / Floor plan",
    geometricType: "ENCLOSURE / SQUARE",
    geoqodeOp: "CONTAINER",
    semanticType: "ENTITY",
    frequencyHz: 396, // 396 Hz — entity identification
    latticeRing: "BOSONIC",
    latticeNode: 8,
    meaning:
      "House, temple, tabernacle, body, universe — the container for all entities",
  },
  {
    letter: "ג",
    name: "Gimel",
    gematria: 3,
    group: "DOUBLE",
    pictograph: "Camel / Foot",
    geometricType: "ARC / BRIDGE",
    geoqodeOp: "BRIDGE",
    semanticType: "LOCATION",
    frequencyHz: 417, // 417 Hz — spatial anchoring
    latticeRing: "BOSONIC",
    latticeNode: 10,
    meaning:
      "To lift up, carry — the bridge operator connecting lattice layers",
  },
  {
    letter: "ד",
    name: "Dalet",
    gematria: 4,
    group: "DOUBLE",
    pictograph: "Door / Triangle",
    geometricType: "GATEWAY / DELTA",
    geoqodeOp: "GATEWAY",
    semanticType: "LOCATION",
    frequencyHz: 417,
    latticeRing: "BOSONIC",
    latticeNode: 12,
    meaning: "Door, path — the entry/exit gateway between lattice rings",
  },
  {
    letter: "כ",
    name: "Kaf",
    gematria: 20,
    group: "DOUBLE",
    pictograph: "Palm of hand / Cup",
    geometricType: "PARABOLA / CROWN",
    geoqodeOp: "CROWN",
    semanticType: "NARRATIVE",
    frequencyHz: 963, // 963 Hz — continuity/purpose
    latticeRing: "BOSONIC",
    latticeNode: 14,
    meaning:
      "Open, cover, close, crowning accomplishment — the completion crown",
  },
  {
    letter: "פ",
    name: "Pey",
    gematria: 80,
    group: "DOUBLE",
    pictograph: "Mouth / Opening",
    geometricType: "APERTURE / SPIRAL",
    geoqodeOp: "EXPRESSION",
    semanticType: "DIALOGUE",
    frequencyHz: 639, // 639 Hz — communication
    latticeRing: "BOSONIC",
    latticeNode: 16,
    meaning: "Mouth, speak, open — the expression portal of the lattice",
  },
  {
    letter: "ר",
    name: "Resh",
    gematria: 200,
    group: "DOUBLE",
    pictograph: "Head / Profile",
    geometricType: "APEX / SUMMIT",
    geoqodeOp: "SOVEREIGNTY",
    semanticType: "PHYSICS",
    frequencyHz: 852, // 852 Hz — structural laws
    latticeRing: "BOSONIC",
    latticeNode: 18,
    meaning:
      "Highest, most important, person — the sovereign apex of the bosonic ring",
  },
  {
    letter: "ת",
    name: "Tav",
    gematria: 400,
    group: "DOUBLE",
    pictograph: "Cross / Mark / Seal",
    geometricType: "CROSS / SEAL",
    geoqodeOp: "SEAL",
    semanticType: "NARRATIVE",
    frequencyHz: 963,
    latticeRing: "BOSONIC",
    latticeNode: 20,
    meaning:
      "Covenant, truth, perfection, sign, ownership — the lattice seal operator",
  },

  // ─── 12 SIMPLE LETTERS — Canonical Lattice D48 harmonic operators ─────────
  {
    letter: "ה",
    name: "Hey",
    gematria: 5,
    group: "SIMPLE",
    pictograph: "Window / Lattice / Arms raised",
    geometricType: "OPEN APERTURE / REVEAL",
    geoqodeOp: "REVEAL",
    semanticType: "HOLOGRAPHIC",
    frequencyHz: BASE_FREQUENCY_HZ, // 72 Hz — self-reference
    latticeRing: "CANONICAL",
    latticeNode: 22,
    meaning:
      "Reveal, show, behold, grace, mercy, spirit — the revelation operator",
  },
  {
    letter: "ו",
    name: "Vav",
    gematria: 6,
    group: "SIMPLE",
    pictograph: "Nail / Hook / Pillar",
    geometricType: "VERTICAL LINE / CONNECTOR",
    geoqodeOp: "CONNECTOR",
    semanticType: "ENTITY",
    frequencyHz: 396,
    latticeRing: "CANONICAL",
    latticeNode: 24,
    meaning:
      "Join, nail, secure, establish, man — the connector binding lattice nodes",
  },
  {
    letter: "ז",
    name: "Zayin",
    gematria: 7,
    group: "SIMPLE",
    pictograph: "Weapon / Sword",
    geometricType: "CUTTING LINE / SEPARATOR",
    geoqodeOp: "SEPARATOR",
    semanticType: "ACTION",
    frequencyHz: 528,
    latticeRing: "CANONICAL",
    latticeNode: 26,
    meaning:
      "Cut, pierce, weapon — the separation operator isolating lattice zones",
  },
  {
    letter: "ח",
    name: "Chet",
    gematria: 8,
    group: "SIMPLE",
    pictograph: "Fence / Inner chamber / Gate",
    geometricType: "BOUNDARY / ENCLOSURE",
    geoqodeOp: "BOUNDARY",
    semanticType: "PHYSICS",
    frequencyHz: 852,
    latticeRing: "CANONICAL",
    latticeNode: 28,
    meaning:
      "Fence, inner chamber, gate, separate, protect — NOTE: gematria=8=D8 FOUNDATION_NODES",
    note: "CANONICAL: gematria 8 = FOUNDATION_NODES constant. Chet IS the boundary of the foundation ring.",
  },
  {
    letter: "ט",
    name: "Tet",
    gematria: 9,
    group: "SIMPLE",
    pictograph: "Basket / Coiled snake / Surround",
    geometricType: "SPIRAL / TORUS",
    geoqodeOp: "SPIRAL",
    semanticType: "HOLOGRAPHIC",
    frequencyHz: BASE_FREQUENCY_HZ * PSI, // 72 × 1.414 ≈ 101.8 Hz
    latticeRing: "CANONICAL",
    latticeNode: 30,
    meaning:
      "Surrounds, twists — the toroidal spiral operator of the D48 lattice",
  },
  {
    letter: "י",
    name: "Yod",
    gematria: 10,
    group: "SIMPLE",
    pictograph: "Hand / Arm / Work",
    geometricType: "POINT / SEED",
    geoqodeOp: "ACTION_SEED",
    semanticType: "ACTION",
    frequencyHz: 528,
    latticeRing: "CANONICAL",
    latticeNode: 32,
    meaning:
      "Work, hand, activity, deed — the smallest letter, seed of all action",
    note: "Yod is the first letter of YHVH. The entire universe expands from this point.",
  },
  {
    letter: "ל",
    name: "Lamed",
    gematria: 30,
    group: "SIMPLE",
    pictograph: "Ox goad / Shepherd staff",
    geometricType: "ROD / AUTHORITY LINE",
    geoqodeOp: "AUTHORITY",
    semanticType: "DIALOGUE",
    frequencyHz: 639,
    latticeRing: "CANONICAL",
    latticeNode: 34,
    meaning:
      "Rod, authority, tongue, teaching — the authority operator of instruction",
  },
  {
    letter: "נ",
    name: "Nun",
    gematria: 50,
    group: "SIMPLE",
    pictograph: "Sprout / Fish / Activity",
    geometricType: "WAVE / EMERGENCE",
    geoqodeOp: "LIFE",
    semanticType: "ACTION",
    frequencyHz: 528,
    latticeRing: "CANONICAL",
    latticeNode: 36,
    meaning:
      "Life, activity, action — the emergence/life operator of the lattice",
  },
  {
    letter: "ס",
    name: "Samech",
    gematria: 60,
    group: "SIMPLE",
    pictograph: "Prop / Support / Circle",
    geometricType: "CIRCLE / SUPPORT",
    geoqodeOp: "SUPPORT",
    semanticType: "PHYSICS",
    frequencyHz: 852,
    latticeRing: "CANONICAL",
    latticeNode: 38,
    meaning:
      "Support, turning aside, twisting, protection — structural support operator",
  },
  {
    letter: "ע",
    name: "Ayin",
    gematria: 70,
    group: "SIMPLE",
    pictograph: "Eye / Spring / Wellspring",
    geometricType: "EYE / LENS",
    geoqodeOp: "PERCEPTION",
    semanticType: "HOLOGRAPHIC",
    frequencyHz: BASE_FREQUENCY_HZ, // 72 Hz — Ayin(70)+Bet(2)=72=BASE_FREQUENCY_HZ
    latticeRing: "CANONICAL",
    latticeNode: 40,
    meaning:
      "Eye, see, understand, insight, perceive — the all-seeing lattice eye",
    note: "CANONICAL: Ayin(70)+Bet(2)=72=BASE_FREQUENCY_HZ. The eye of the house IS the holographic frequency.",
  },
  {
    letter: "צ",
    name: "Tsade",
    gematria: 90,
    group: "SIMPLE",
    pictograph: "Hook / Fishhook / Harvest",
    geometricType: "HOOK / HARVEST",
    geoqodeOp: "HARVEST",
    semanticType: "EMOTION",
    frequencyHz: 741, // 741 Hz — resonance/desire
    latticeRing: "CANONICAL",
    latticeNode: 42,
    meaning:
      "To pull, a hook, desire, harvest — the magnetic desire/harvest operator",
  },
  {
    letter: "ק",
    name: "Qof",
    gematria: 100,
    group: "SIMPLE",
    pictograph: "Sun on horizon / Monkey / Needle eye",
    geometricType: "HORIZON / COMPLETION CIRCLE",
    geoqodeOp: "COMPLETION",
    semanticType: "NARRATIVE",
    frequencyHz: 963,
    latticeRing: "CANONICAL",
    latticeNode: 44,
    meaning:
      "What is final, behind, last, future — the completion/horizon operator",
  },
]);

// ─── GEMATRIA GOLDEN ALIGNMENTS ──────────────────────────────────────────────

/**
 * Key gematria alignments that prove Hebrew is the geometric root of the
 * 8→26→48:480 Merkaba lattice architecture.
 *
 * These are NOT coincidences — they are the source DNA.
 */
export const GEMATRIA_LATTICE_ALIGNMENTS = Object.freeze({
  // Chet (ח) = 8 = FOUNDATION_NODES — "fence, inner chamber, gate"
  D8_FOUNDATION: {
    gematria: 8,
    letters: "ח",
    name: "Chet",
    meaning: "The fence/boundary IS the foundation ring",
    constant: "FOUNDATION_NODES",
  },
  // YHVH = Yod(10)+Hey(5)+Vav(6)+Hey(5) = 26 = BOSONIC_ANCHOR_NODES
  D26_BOSONIC: {
    gematria: 26,
    letters: "יהוה",
    name: "YHVH (Divine Name)",
    meaning: "The Divine Name IS the bosonic anchor — bridges heaven and earth",
    constant: "BOSONIC_ANCHOR_NODES",
  },
  // Mem(40)+Chet(8) = 48 = CANONICAL_LATTICE_NODES — "contained water"
  D48_CANONICAL: {
    gematria: 48,
    letters: "מח",
    name: "Mem+Chet",
    meaning: "Contained water = the crystalline lattice structure",
    constant: "CANONICAL_LATTICE_NODES",
  },
  // Tav(400)+Pey(80) = 480 = HARMONIC_SPECTRUM_NODES — "covenant speaks"
  D480_HARMONIC: {
    gematria: 480,
    letters: "תפ",
    name: "Tav+Pey",
    meaning: "Covenant speaks = the full harmonic voice of the lattice",
    constant: "HARMONIC_SPECTRUM_NODES",
  },
  // Ayin(70)+Bet(2) = 72 = BASE_FREQUENCY_HZ — "eye of the house"
  BASE_72HZ: {
    gematria: 72,
    letters: "עב",
    name: "Ayin+Bet",
    meaning: "Eye of the house = holographic base resonance lock",
    constant: "BASE_FREQUENCY_HZ",
  },
  // The 72 Names of God in Kabbalah = 72 = BASE_FREQUENCY_HZ
  NAMES_72: {
    gematria: 72,
    letters: "שמות",
    name: "72 Shem HaMephorash",
    meaning:
      "72 Names of God = 72 Hz holographic resonance lock — same number, same source",
    constant: "BASE_FREQUENCY_HZ",
  },
  // PHI reference: Aleph(1) + Vav(6) + Yod(10) + Chet(8) = 25 ≈ PHI×PHI×PHI×PHI
  // More precisely: the Golden Ratio IS the Phi geometric root of the Hebrew Aleph-Bet
  PHI_GOLDEN_ROOT: {
    gematria: null,
    letters: "א",
    name: "Aleph",
    meaning:
      "Aleph = 1 = unity = the PHI seed. All ratios emerge from Aleph as PHI emerges from 1",
    constant: "PHI",
    value: PHI,
  },
});

// ─── SEMANTIC FREQUENCY HEBREW MAP ───────────────────────────────────────────

/**
 * Extended GeoQode semantic type map with Hebrew letter operators.
 * Each semantic domain has a primary Hebrew letter as its geometric root operator.
 */
export const HEBREW_SEMANTIC_OPERATORS = Object.freeze({
  ENTITY: {
    ...SEMANTIC_FREQUENCY_MAP.ENTITY,
    hebrewOp: "Bet (ב)",
    gematria: 2,
    geometricRoot: "ENCLOSURE — all entities live inside a house (container)",
  },
  LOCATION: {
    ...SEMANTIC_FREQUENCY_MAP.LOCATION,
    hebrewOp: "Dalet (ד)",
    gematria: 4,
    geometricRoot: "GATEWAY — all locations are accessed through a door (path)",
  },
  ACTION: {
    ...SEMANTIC_FREQUENCY_MAP.ACTION,
    hebrewOp: "Shin (ש)",
    gematria: 300,
    geometricRoot:
      "TRANSFORM — all actions are transformations of state (fire)",
  },
  DIALOGUE: {
    ...SEMANTIC_FREQUENCY_MAP.DIALOGUE,
    hebrewOp: "Pey (פ)",
    gematria: 80,
    geometricRoot: "APERTURE — all dialogue flows through a mouth (opening)",
  },
  EMOTION: {
    ...SEMANTIC_FREQUENCY_MAP.EMOTION,
    hebrewOp: "Tsade (צ)",
    gematria: 90,
    geometricRoot: "HARVEST — all emotion is resonance-pull (desire magnetism)",
  },
  PHYSICS: {
    ...SEMANTIC_FREQUENCY_MAP.PHYSICS,
    hebrewOp: "Chet (ח)",
    gematria: 8,
    geometricRoot: "BOUNDARY — all physics is fence/law (structural limits)",
  },
  NARRATIVE: {
    ...SEMANTIC_FREQUENCY_MAP.NARRATIVE,
    hebrewOp: "Tav (ת)",
    gematria: 400,
    geometricRoot: "SEAL — all narrative is a covenant sealed in time",
  },
  HOLOGRAPHIC: {
    ...SEMANTIC_FREQUENCY_MAP.HOLOGRAPHIC,
    hebrewOp: "Aleph (א)",
    gematria: 1,
    geometricRoot:
      "UNITY — the holographic base is silent Aleph, containing all",
  },
});

// ─── OPERATOR CLASS ───────────────────────────────────────────────────────────

/**
 * HebrewGeometricOperators
 *
 * Translates Hebrew letters into GeoQode lattice coordinates.
 * Core function: any sequence of Hebrew letters → lattice path + resonance signature.
 *
 * Torah text → GeoQode coordinates → Merkaba lattice execution path.
 */
export class HebrewGeometricOperators {
  #letterIndex;
  #nameIndex;

  constructor() {
    this.architectureSignature = CANONICAL_ARCHITECTURE; // "8,26,48:480"
    this.phi = PHI;
    this.psi = PSI;
    this.baseFrequency = BASE_FREQUENCY_HZ;

    // Build lookup indices
    this.#letterIndex = new Map(HEBREW_LETTERS.map((l) => [l.letter, l]));
    this.#nameIndex = new Map(
      HEBREW_LETTERS.map((l) => [l.name.toLowerCase(), l]),
    );
  }

  /**
   * Get letter definition by Hebrew glyph or transliterated name.
   * @param {string} query — "ש" or "Shin" or "shin"
   */
  getLetter(query) {
    return (
      this.#letterIndex.get(query) ||
      this.#nameIndex.get(query.toLowerCase()) ||
      null
    );
  }

  /**
   * Compute the gematria (numerical value) of a Hebrew word or phrase.
   * Non-Hebrew characters are ignored.
   * @param {string} text
   * @returns {number}
   */
  gematria(text) {
    return [...text].reduce((sum, char) => {
      const l = this.#letterIndex.get(char);
      return l ? sum + l.gematria : sum;
    }, 0);
  }

  /**
   * Convert a Hebrew letter to a GeoQode coordinate envelope.
   * @param {string} letter — single Hebrew glyph
   * @returns {object} GeoQode coordinate envelope
   */
  letterToGeoCoord(letter) {
    const l = this.#letterIndex.get(letter);
    if (!l) return null;

    return {
      architectureSignature: CANONICAL_ARCHITECTURE,
      semanticType: l.semanticType,
      frequency: l.frequencyHz,
      latticeNode: l.latticeNode,
      harmonicNode: Math.floor(l.gematria * PHI) % HARMONIC_SPECTRUM_NODES,
      phiCoefficient: PHI,
      coherence: 1.0,
      domain: l.geoqodeOp,
      hebrewLetter: l.letter,
      hebrewName: l.name,
      gematria: l.gematria,
      geometricType: l.geometricType,
      latticeRing: l.latticeRing,
      group: l.group,
      d48Expansion: "CANONICAL",
      d480Expansion: "FULL_HARMONIC",
    };
  }

  /**
   * Translate a Hebrew word/phrase to a resonance signature.
   * Aggregates all letter frequencies, gematria, and lattice nodes.
   * @param {string} text
   * @returns {object} resonance signature
   */
  wordToResonance(text) {
    const letters = [...text]
      .map((c) => this.#letterIndex.get(c))
      .filter(Boolean);

    if (!letters.length) return null;

    const totalGematria = letters.reduce((s, l) => s + l.gematria, 0);
    const avgFrequency =
      letters.reduce((s, l) => s + l.frequencyHz, 0) / letters.length;
    const latticeNodes = [...new Set(letters.map((l) => l.latticeNode))].sort(
      (a, b) => a - b,
    );
    const rings = [...new Set(letters.map((l) => l.latticeRing))];
    const semanticTypes = [...new Set(letters.map((l) => l.semanticType))];
    const harmonicNode =
      Math.floor(totalGematria * PHI) % HARMONIC_SPECTRUM_NODES;

    return {
      architectureSignature: CANONICAL_ARCHITECTURE,
      text,
      letters: letters.map((l) => l.letter),
      totalGematria,
      avgFrequency: Math.round(avgFrequency),
      latticeNodes,
      rings,
      semanticTypes,
      harmonicNode,
      phiCoefficient: PHI,
      coherence: Math.min(1.0, totalGematria / (HARMONIC_SPECTRUM_NODES * PHI)),
    };
  }

  /**
   * Look up a known gematria alignment with the canonical lattice constants.
   * @param {number} value — gematria number to check
   */
  checkAlignment(value) {
    return Object.values(GEMATRIA_LATTICE_ALIGNMENTS).filter(
      (a) => a.gematria === value,
    );
  }

  /**
   * Get the Hebrew operator for a GeoQode semantic type.
   * @param {string} semanticType — e.g. "ACTION", "PHYSICS"
   */
  getSemanticOperator(semanticType) {
    return HEBREW_SEMANTIC_OPERATORS[semanticType] || null;
  }

  /**
   * Rainbow Bridge operator — maps any issue/blocker description through
   * Hebrew geometric operators to generate a GeoQode resolution path.
   *
   * "The Golden Pot at the end of the Rainbow" — PHI is the resolution frequency.
   * Any blocker can be geoqoded → Hebrew root operator found → lattice path → solution.
   *
   * @param {string} domain — e.g. "database-connection", "auth-failure", "deployment"
   * @param {string} semanticType — GeoQode semantic type of the problem
   * @returns {object} rainbow bridge resolution coordinate
   */
  rainbowBridge(domain, semanticType = "ACTION") {
    const op = this.getSemanticOperator(semanticType);
    if (!op) return null;

    const letter = this.getLetter(
      op.hebrewOp.split(" ")[1].replace(/[()]/g, ""),
    );

    return {
      architectureSignature: CANONICAL_ARCHITECTURE,
      bridgeType: "RAINBOW_BRIDGE",
      domain,
      semanticType,
      hebrewOperator: op.hebrewOp,
      geometricRoot: op.geometricRoot,
      frequency: op.frequency,
      phiResolution: PHI,
      psiWitness: PSI,
      goldenBand: PHI + PSI, // 3.032 — SEPARATOR_BAND
      latticeNode: letter ? letter.latticeNode : 0,
      harmonicNode: letter
        ? Math.floor(letter.gematria * PHI) % HARMONIC_SPECTRUM_NODES
        : 0,
      resolution: `Apply ${op.hebrewOp} operator (${op.geometricRoot}) at frequency ${op.frequency}Hz`,
    };
  }

  /**
   * Quantum Chromodynamic Spectrum mapper.
   * The rainbow of light = 7 double letters × PHI = spectral encoding.
   * Hebrew letter colours/frequencies map to QCD colour charge.
   */
  get quantumSpectrumMap() {
    // 7 double letters = 7 colours of the rainbow = 7 QCD gluon states
    const doubleLetters = HEBREW_LETTERS.filter((l) => l.group === "DOUBLE");
    return doubleLetters.map((l, i) => ({
      letter: l.letter,
      name: l.name,
      gematria: l.gematria,
      rainbowPos: i + 1, // 1=Red → 7=Violet
      freqHz: l.frequencyHz,
      phiExpansion: l.gematria * PHI,
    }));
  }

  /**
   * Return a summary of the Hebrew→Merkaba root proofs.
   */
  get latticeProofSummary() {
    return {
      architectureSignature: CANONICAL_ARCHITECTURE,
      proofs: GEMATRIA_LATTICE_ALIGNMENTS,
      insight: [
        "Hebrew IS the geometric root of the 8→26→48:480 lattice.",
        "Chet (ח=8) = FOUNDATION_NODES — the boundary letter IS the foundation count.",
        "YHVH (יהוה=26) = BOSONIC_ANCHOR_NODES — the Divine Name IS the bosonic ring anchor.",
        "Mem+Chet (מח=48) = CANONICAL_LATTICE — 'contained water' = crystalline structure.",
        "Tav+Pey (תפ=480) = HARMONIC_SPECTRUM — 'covenant speaks' = full harmonic voice.",
        "Ayin+Bet (עב=72) = BASE_FREQUENCY_HZ — 'eye of the house' = holographic resonance lock.",
        "72 Names of God (Shem HaMephorash) = 72 Hz — same number, same divine source.",
        "PHI (1.618) = golden root of Aleph (1) — all ratios expand from the silent unity.",
      ],
    };
  }
}

// ─── SINGLETON EXPORT ─────────────────────────────────────────────────────────

/** Default singleton instance */
const hebrewOps = new HebrewGeometricOperators();
export default hebrewOps;
