import { Prisma } from "@prisma/client";

type TxClient = Prisma.TransactionClient;

type StudyPlanTopicSeed = {
  topicKey: string;
  topicLabel: string;
  approved: boolean;
};

type RevisionTopicInput = {
  topicKey: string;
  topicLabel: string;
  accessApproved: boolean;
  sequenceOrder: number;
};

type StudyPlanTopicOptions = {
  levelHint?: string | null;
};

const mathStarterConfigByLevel = {
  "FORM-1": [
    { code: "A1", approved: true },
    { code: "B1", approved: true },
    { code: "B2", approved: false },
  ],
  "FORM-2": [
    { code: "A1", approved: true },
    { code: "A2", approved: true },
    { code: "C2", approved: false },
  ],
  "FORM-3": [
    { code: "A1", approved: true },
    { code: "B1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-4": [
    { code: "A1", approved: true },
    { code: "A2", approved: true },
    { code: "C2", approved: false },
  ],
  "FORM-5": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D2", approved: false },
  ],
} as const;

type MathCurriculumLevelCode = keyof typeof mathStarterConfigByLevel;

const englishStarterConfigByLevel = {
  "FORM-1": [
    { code: "A1", approved: true },
    { code: "B2", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-2": [
    { code: "A1", approved: true },
    { code: "B1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-3": [
    { code: "A1", approved: true },
    { code: "B1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-4": [
    { code: "A1", approved: true },
    { code: "B1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-5": [
    { code: "A1", approved: true },
    { code: "B1", approved: true },
    { code: "D1", approved: false },
  ],
} as const;

type EnglishCurriculumLevelCode = keyof typeof englishStarterConfigByLevel;

const bahasaMelayuStarterConfigByLevel = {
  "FORM-1": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-2": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-3": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-4": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-5": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D1", approved: false },
  ],
} as const;

type BahasaMelayuCurriculumLevelCode =
  keyof typeof bahasaMelayuStarterConfigByLevel;

const scienceStarterConfigByLevel = {
  "FORM-1": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-2": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D2", approved: false },
  ],
  "FORM-3": [
    { code: "A1", approved: true },
    { code: "C1", approved: true },
    { code: "D2", approved: false },
  ],
  "FORM-4": [
    { code: "A1", approved: true },
    { code: "C2", approved: true },
    { code: "D1", approved: false },
  ],
  "FORM-5": [
    { code: "A1", approved: true },
    { code: "C2", approved: true },
    { code: "D2", approved: false },
  ],
} as const;

type ScienceCurriculumLevelCode = keyof typeof scienceStarterConfigByLevel;

const legacyMathTopicAliases: Record<string, string> = {
  foundations: "A1",
  "concept-foundations": "A1",
  "rational-numbers": "A1",
  "patterns-and-sequences": "A1",
  "guided-practice": "B1",
  "algebraic-language": "B1",
  revision: "B1",
  "linear-equations": "B2",
  "expansion-and-factorisation": "A2",
  "expansion-and-factorization": "A2",
  "word-problems": "B2",
  ratios: "A4",
  "ratio-rate-proportion": "A4",
  coordinates: "C1",
  "linear-graphs-and-gradient": "C2",
  gradient: "C2",
  "indices-and-standard-form": "A1",
  indices: "A1",
  "scale-drawings": "B1",
  scales: "B1",
  "trigonometric-ratios": "B2",
  trigonometry: "B2",
  "angles-and-tangents-in-circles": "B3",
  "plans-and-elevations": "C1",
  loci: "C2",
  "straight-lines": "D1",
  "data-and-decision-making": "D2",
  quadratics: "A1",
  "quadratic-functions": "A1",
  "quadratic-expressions-and-functions": "A1",
  "quadratic-equations": "A2",
  "set-operations": "B1",
  logic: "B2",
  "logical-reasoning": "B2",
  networks: "B3",
  "graph-networks": "B3",
  "linear-inequalities-in-two-variables": "C1",
  "motion-graphs": "C2",
  dispersion: "D1",
  "measures-of-dispersion": "D1",
  "combined-events-probability": "D2",
  probability: "D2",
  budgeting: "D3",
  "financial-management": "D3",
  variations: "A1",
  variation: "A1",
  matrices: "A2",
  congruence: "B1",
  enlargement: "B2",
  "combined-transformations": "B3",
  "trigonometric-functions-and-graphs": "C1",
  "trigonometric-functions": "C1",
  "trig-functions": "C1",
  "trig-graphs": "C1",
  "grouped-data-dispersion": "D1",
  "grouped-data": "D1",
  "grouped-dispersion": "D1",
  "measures-of-dispersion-for-grouped-data": "D1",
  modelling: "D2",
  modeling: "D2",
  "mathematical-modelling": "D2",
  "mathematical-modeling": "D2",
  insurance: "D3",
  taxation: "D3",
  tax: "D3",
  "insurance-and-taxation": "D3",
};

const legacyEnglishTopicAliases: Record<string, string> = {
  reading: "A1",
  "reading-comprehension": "A1",
  "main-ideas": "A1",
  "main-ideas-and-explicit-information": "A1",
  "explicit-information": "A1",
  comparison: "A1",
  "compare-main-ideas-and-supporting-details": "A1",
  inference: "A2",
  "supporting-evidence": "A2",
  "inference-and-supporting-evidence": "A2",
  tone: "A2",
  viewpoint: "A2",
  "point-of-view": "A2",
  "inference-tone-and-point-of-view": "A2",
  reference: "A3",
  "context-clues": "A3",
  "reference-and-context-clues": "A3",
  sequence: "A3",
  organisation: "A3",
  organization: "A3",
  "reference-sequence-and-text-organisation": "A3",
  "reference-sequence-and-text-organization": "A3",
  grammar: "B2",
  "parts-of-speech": "B1",
  "sentence-roles": "B1",
  "parts-of-speech-and-sentence-roles": "B1",
  "tense-consistency": "B1",
  "tense-consistency-and-sentence-control": "B1",
  tenses: "B2",
  "subject-verb-agreement": "B2",
  "tenses-and-subject-verb-agreement": "B2",
  modals: "B2",
  questions: "B2",
  "modals-questions-and-functional-grammar": "B2",
  sentences: "B3",
  "sentence-construction": "B3",
  "sentence-construction-and-transformation": "B3",
  clauses: "B3",
  connectors: "B3",
  "clauses-connectors-and-sentence-variety": "B3",
  vocabulary: "C1",
  "vocabulary-in-context": "C1",
  "vocabulary-precision": "C1",
  "vocabulary-precision-in-context": "C1",
  "word-choice": "C2",
  "word-relationships": "C2",
  "word-choice-and-relationships": "C2",
  "word-formation": "C2",
  "word-formation-and-lexical-relationships": "C2",
  writing: "D1",
  "paragraph-writing": "D1",
  "sentence-to-paragraph-writing": "D1",
  coherence: "D1",
  "paragraph-development": "D1",
  "paragraph-development-and-coherence": "D1",
  "guided-writing": "D2",
  "functional-writing": "D2",
  "guided-and-functional-writing": "D2",
  "guided-short-responses": "D2",
  "guided-short-responses-and-functional-writing": "D2",
  evidence: "A1",
  "evidence-based-comprehension": "A1",
  attitude: "A2",
  purpose: "A2",
  message: "A2",
  "attitude-purpose-and-message": "A2",
  summary: "A3",
  structure: "A3",
  "text-structure": "A3",
  "summary-sequence-and-text-structure": "A3",
  editing: "B1",
  "error-correction": "B1",
  "sentence-accuracy": "B1",
  "sentence-accuracy-and-error-correction": "B1",
  reported: "B2",
  "reported-meaning": "B2",
  "question-forms": "B2",
  "reported-meaning-and-question-forms": "B2",
  flow: "B3",
  "editing-for-flow": "B3",
  "clause-control": "B3",
  "clause-control-and-editing-for-flow": "B3",
  figurative: "C1",
  implied: "C1",
  "figurative-and-implied-meaning": "C1",
  register: "C2",
  precision: "C2",
  "word-form": "C2",
  "register-word-form-and-precision": "C2",
  "multi-paragraph": "D1",
  "multi-paragraph-response-writing": "D1",
  "guided-extended-writing": "D2",
  "guided-extended-and-functional-writing": "D2",
  synthesis: "A1",
  comparison: "A1",
  "evidence-synthesis": "A1",
  "evidence-synthesis-and-comparison": "A1",
  craft: "A2",
  "writer-craft": "A2",
  "viewpoint-tone-and-writer-craft": "A2",
  evaluation: "A3",
  "text-links": "A3",
  "summary-evaluation-and-text-links": "A3",
  style: "B1",
  "editing-for-accuracy-and-style": "B1",
  transformation: "B2",
  reformulation: "B2",
  "sentence-transformation": "B2",
  "sentence-transformation-and-reformulation": "B2",
  argument: "B3",
  cohesive: "B3",
  "argument-language": "B3",
  "argument-language-and-cohesive-control": "B3",
  connotation: "C1",
  "figurative-effect": "C1",
  "connotation-and-figurative-effect": "C1",
  audience: "C2",
  "register-audience-and-precision": "C2",
  essay: "D1",
  "essay-structure": "D1",
  "extended-response": "D1",
  "extended-response-and-essay-structure": "D1",
  exam: "D2",
  "exam-task": "D2",
  "exam-task-and-functional-writing": "D2",
  synthesis: "A1",
  "cross-text": "A1",
  "cross-text-comparison": "A1",
  "synthesis-evaluation-and-cross-text-comparison": "A1",
  intention: "A2",
  perspective: "A2",
  "writer-intention": "A2",
  "tone-perspective-and-writer-intention": "A2",
  "summary-precision": "A3",
  "critical-response": "A3",
  "summary-precision-and-critical-response": "A3",
  clarity: "B1",
  "advanced-editing": "B1",
  "advanced-editing-for-accuracy-and-clarity": "B1",
  "meaning-control": "B2",
  "transformation-reformulation-and-meaning-control": "B2",
  cohesion: "B3",
  "paragraph-control": "B3",
  "cohesion-argument-and-paragraph-control": "B3",
  nuance: "C1",
  "figurative-interpretation": "C1",
  "nuance-connotation-and-figurative-interpretation": "C1",
  voice: "C2",
  "audience-awareness": "C2",
  "register-voice-and-audience-awareness": "C2",
  discursive: "D1",
  "discursive-writing": "D1",
  "extended-essay": "D1",
  "discursive-and-extended-essay-writing": "D1",
  directed: "D2",
  "directed-writing": "D2",
  "directed-functional-and-exam-task-writing": "D2",
  revision: "C1",
};

const legacyBahasaMelayuTopicAliases: Record<string, string> = {
  mendengar: "A1",
  lisan: "A1",
  arahan: "A1",
  maklumat: "A1",
  "mendengar-maklumat-dan-arahan": "A1",
  "menilai-maklumat": "A1",
  "mendengar-dan-menilai-maklumat": "A1",
  "menyaring-maklumat": "A1",
  "mendengar-menilai-dan-menyaring-maklumat": "A1",
  bertutur: "A2",
  respons: "A2",
  "bertutur-untuk-maklumat-dan-respons": "A2",
  pendapat: "A2",
  hujah: "A2",
  "memberi-pendapat": "A2",
  "bertutur-memberi-pendapat-dan-hujah-ringkas": "A2",
  perbincangan: "A2",
  "bertutur-untuk-perbincangan-dan-hujah-ringkas": "A2",
  membaca: "B1",
  pemahaman: "B1",
  "idea-utama": "B1",
  literal: "B1",
  "memahami-idea-utama-dan-maklumat-literal": "B1",
  bukti: "B1",
  "bukti-teks": "B1",
  "mengenal-pasti-idea-utama-butiran-dan-bukti-teks": "B1",
  "penilaian-teks": "B1",
  "bukti-idea-utama-dan-penilaian-teks": "B1",
  inferens: "B2",
  konteks: "B2",
  urutan: "B2",
  "inferens-makna-konteks-dan-urutan": "B2",
  "sudut-pandang": "B2",
  tersirat: "B2",
  "inferens-sudut-pandang-dan-maksud-tersirat": "B2",
  nada: "B2",
  "inferens-nada-dan-sudut-pandang": "B2",
  ringkasan: "B3",
  rumusan: "B3",
  "respons-teks": "B3",
  "ringkasan-ringkas-dan-respons-teks": "B3",
  perbandingan: "B3",
  "ringkasan-dan-perbandingan-maklumat": "B3",
  sintesis: "B3",
  "rumusan-dan-sintesis-maklumat": "B3",
  ayat: "C1",
  tatabahasa: "C1",
  "pembinaan-ayat": "C1",
  "pembinaan-ayat-dan-tatabahasa-asas": "C1",
  penyuntingan: "C1",
  "penyuntingan-ayat": "C1",
  "penyuntingan-ayat-dan-ketepatan-tatabahasa": "C1",
  frasa: "C1",
  "kesalahan-lazim": "C1",
  "penyuntingan-ayat-frasa-dan-kesalahan-lazim": "C1",
  imbuhan: "C2",
  "golongan-kata": "C2",
  penggunaan: "C2",
  "imbuhan-golongan-kata-dan-penggunaan": "C2",
  apitan: "C2",
  "penanda-wacana": "C2",
  "imbuhan-apitan-dan-penanda-wacana": "C2",
  "struktur-kata": "C2",
  "hubungan-wacana": "C2",
  "imbuhan-struktur-kata-dan-hubungan-wacana": "C2",
  peribahasa: "C3",
  "kosa-kata": "C3",
  "keindahan-bahasa": "C3",
  "peribahasa-kosa-kata-dan-keindahan-bahasa": "C3",
  "gaya-bahasa": "C3",
  "kosa-kata-tepat": "C3",
  "kosa-kata-tepat-peribahasa-dan-gaya-bahasa": "C3",
  diksi: "C3",
  "keberkesanan-bahasa": "C3",
  "diksi-peribahasa-dan-keberkesanan-bahasa": "C3",
  perenggan: "D1",
  penulisan: "D1",
  karangan: "D1",
  "membina-ayat-dan-perenggan": "D1",
  huraian: "D1",
  kohesi: "D1",
  "membina-perenggan-huraian-dan-kohesi": "D1",
  "perenggan-hujah": "D1",
  "pengembangan-isi": "D1",
  "perenggan-hujah-dan-pengembangan-isi": "D1",
  berpandu: "D2",
  fungsional: "D2",
  "penulisan-berpandu": "D2",
  "penulisan-berpandu-dan-respons-fungsional": "D2",
  format: "D2",
  "kejelasan-isi": "D2",
  "penulisan-berpandu-format-dan-kejelasan-isi": "D2",
  tugas: "D2",
  "tugas-fungsional": "D2",
  "penulisan-berpandu-respons-dan-tugas-fungsional": "D2",
  merumus: "A1",
  "pelbagai-sumber": "A1",
  "mendengar-menilai-dan-merumus-maklumat-pelbagai-sumber": "A1",
  formal: "A2",
  "respons-formal": "A2",
  "bertutur-untuk-perbincangan-hujah-dan-respons-formal": "A2",
  kritis: "B1",
  "penilaian-kritis": "B1",
  "idea-bukti-dan-penilaian-kritis-teks": "B1",
  perspektif: "B2",
  teknik: "B2",
  "teknik-penyampaian": "B2",
  "nada-perspektif-dan-teknik-penyampaian": "B2",
  bandingan: "B3",
  "sintesis-respons": "B3",
  "rumusan-bandingan-dan-sintesis-respons": "B3",
  petikan: "C1",
  "ketepatan-struktur": "C1",
  "penyuntingan-ayat-petikan-dan-ketepatan-struktur": "C1",
  "tatabahasa-lanjutan": "C2",
  kegramatisan: "C2",
  "tatabahasa-lanjutan-wacana-dan-kegramatisan": "C2",
  laras: "C3",
  "laras-bahasa": "C3",
  "diksi-laras-bahasa-dan-keberkesanan-ungkapan": "C3",
  "karangan-hujah": "D1",
  "pengolahan-idea": "D1",
  "karangan-hujah-dan-pengolahan-idea": "D1",
  berformat: "D2",
  "penulisan-berformat": "D2",
  "penulisan-berformat-respons-dan-tugasan-fungsional": "D2",
  "maklumat-kritis": "A1",
  "mendengar-menilai-dan-merumus-maklumat-kritis": "A1",
  balasan: "A2",
  "respons-matang": "A2",
  "bertutur-untuk-hujah-balasan-dan-respons-matang": "A2",
  "respons-kritis": "B1",
  "bukti-penilaian-dan-respons-kritis-teks": "B1",
  "kesan-penyampaian": "B2",
  "nada-sudut-pandang-dan-kesan-penyampaian": "B2",
  "perbandingan-respons": "B3",
  "rumusan-sintesis-dan-perbandingan-respons": "B3",
  "kejelasan-maksud": "C1",
  "penyuntingan-petikan-dan-kejelasan-maksud": "C1",
  "kegramatisan-lanjutan": "C2",
  "tatabahasa-wacana-dan-kegramatisan-lanjutan": "C2",
  "keberkesanan-bahasa": "C3",
  "laras-diksi-dan-keberkesanan-bahasa": "C3",
  matang: "D1",
  tersusun: "D1",
  "karangan-hujah-matang": "D1",
  "karangan-hujah-matang-dan-pengembangan-tersusun": "D1",
  "kawalan-tugasan": "D2",
  "penulisan-berformat-respons-dan-kawalan-tugasan": "D2",
};

const legacyScienceTopicAliases: Record<string, string> = {
  investigation: "A1",
  inquiry: "A1",
  variables: "A1",
  "scientific-investigation": "A1",
  "scientific-investigation-and-variables": "A1",
  "experimental-design": "A1",
  "data-interpretation": "A1",
  "experimental-design-and-data-interpretation": "A1",
  measurement: "A2",
  apparatus: "A2",
  safety: "A2",
  "lab-safety": "A2",
  "measurement-apparatus-and-lab-safety": "A2",
  models: "A2",
  "scientific-communication": "A2",
  "observation-models-and-scientific-communication": "A2",
  cells: "B1",
  cell: "B1",
  "cell-structure": "B1",
  "cell-structure-and-organisation": "B1",
  nutrition: "B1",
  "human-health": "B1",
  "nutrition-and-human-health": "B1",
  respiration: "B2",
  photosynthesis: "B2",
  "respiration-and-photosynthesis": "B2",
  "respiration-and-photosynthesis-foundations": "B2",
  biodiversity: "B2",
  classification: "B2",
  "biodiversity-and-classification": "B2",
  ecosystems: "B3",
  ecosystem: "B3",
  interdependence: "B3",
  "ecosystems-and-interdependence": "B3",
  balance: "B3",
  "dynamic-ecosystems": "B3",
  "dynamic-ecosystems-and-balance": "B3",
  matter: "C1",
  particles: "C1",
  "states-of-matter": "C1",
  "states-of-matter-and-particle-arrangement": "C1",
  force: "C1",
  motion: "C1",
  "force-and-motion": "C1",
  heat: "C2",
  thermal: "C2",
  "thermal-change": "C2",
  "heat-and-thermal-change": "C2",
  energy: "C2",
  work: "C2",
  efficiency: "C2",
  "energy-work-and-efficiency": "C2",
  light: "C3",
  reflection: "C3",
  optics: "C3",
  "light-reflection-and-basic-optics": "C3",
  electricity: "C3",
  circuits: "C3",
  "simple-circuits": "C3",
  "electricity-and-simple-circuits": "C3",
  earth: "D1",
  water: "D1",
  weather: "D1",
  "earth-water-and-weather-systems": "D1",
  "earth-processes": "D1",
  "space-awareness": "D1",
  "earth-processes-resources-and-space-awareness": "D1",
  resources: "D2",
  sustainability: "D2",
  technology: "D2",
  "resources-sustainability-and-simple-technology": "D2",
  "environmental-responsibility": "D2",
  "applied-technology": "D2",
  "environmental-responsibility-and-applied-technology": "D2",
  evidence: "A1",
  "evidence-quality": "A1",
  "experimental-reasoning": "A1",
  "evidence-quality-and-experimental-reasoning": "A1",
  systems: "A2",
  "systems-thinking": "A2",
  "scientific-explanation": "A2",
  "models-systems-and-scientific-explanation": "A2",
  coordination: "B1",
  response: "B1",
  "coordination-and-response": "B1",
  "coordination-and-response-in-living-things": "B1",
  reproduction: "B2",
  growth: "B2",
  variation: "B2",
  "reproduction-growth-and-variation": "B2",
  adaptation: "B3",
  survival: "B3",
  "population-change": "B3",
  "adaptation-survival-and-population-change": "B3",
  density: "C1",
  pressure: "C1",
  "material-behaviour": "C1",
  "density-pressure-and-material-behaviour": "C1",
  sound: "C2",
  waves: "C2",
  "signal-transfer": "C2",
  "sound-waves-and-signal-transfer": "C2",
  magnetism: "C3",
  electromagnetic: "C3",
  "electromagnetic-applications": "C3",
  "magnetism-and-electromagnetic-applications": "C3",
  climate: "D1",
  "earth-change": "D1",
  "climate-systems-and-earth-change": "D1",
  "human-impact": "D2",
  "sustainable-solutions": "D2",
  "human-impact-resources-and-sustainable-solutions": "D2",
  reliability: "A1",
  "data-reliability": "A1",
  justification: "A1",
  "scientific-justification": "A1",
  "data-reliability-and-scientific-justification": "A1",
  "investigation-design": "A2",
  "cell-processes": "B1",
  immunity: "B2",
  genetics: "B3",
  atoms: "C1",
  atomic: "C1",
  "atomic-structure": "C1",
  "atomic-structure-and-material-properties": "C1",
  "chemical-change": "C2",
  reactions: "C2",
  "reaction-evidence": "C2",
  "chemical-change-and-reaction-evidence": "C2",
  electricity: "C3",
  power: "C3",
  "power-use": "C3",
  "energy-transfer-electricity-and-power-use": "C3",
  "climate-influence": "D1",
  "earth-systems": "D1",
  "earth-systems-space-and-climate-influence": "D1",
  "sustainable-decisions": "D2",
  "technology-resources-and-sustainable-decisions": "D2",
  argument: "A1",
  "scientific-argument": "A1",
  "evidence-evaluation": "A1",
  "evidence-evaluation-and-scientific-argument": "A1",
  "decision-making": "A2",
  "investigation-quality": "A2",
  "investigation-quality-and-decision-making": "A2",
  homeostasis: "B1",
  coordination: "B1",
  "homeostasis-coordination-and-response": "B1",
  inheritance: "B2",
  continuity: "B2",
  "inheritance-variation-and-biological-continuity": "B2",
  "public-science": "B3",
  disease: "B3",
  "health-choices-disease-and-public-science": "B3",
  reactions: "C1",
  "reaction-systems": "C1",
  "reaction-systems-and-material-change": "C1",
  "force-energy": "C2",
  "motion-in-systems": "C2",
  "force-energy-and-motion-in-systems": "C2",
  radiation: "C3",
  "technology-applications": "C3",
  "electricity-radiation-and-technology-applications": "C3",
  "global-systems": "D1",
  "environmental-change": "D1",
  "global-systems-climate-and-environmental-change": "D1",
  innovation: "D2",
  futures: "D2",
  "sustainable-futures": "D2",
  "resources-innovation-and-sustainable-futures": "D2",
};

export function normalizeTopicToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveMathCurriculumLevelCode(
  levelHint?: string | null,
): MathCurriculumLevelCode {
  const normalized = normalizeTopicToken(levelHint ?? "");

  if (
    normalized.includes("form-5") ||
    normalized.includes("tingkatan-5") ||
    normalized === "f5" ||
    normalized === "5"
  ) {
    return "FORM-5";
  }

  if (
    normalized.includes("form-4") ||
    normalized.includes("tingkatan-4") ||
    normalized === "f4" ||
    normalized === "4"
  ) {
    return "FORM-4";
  }

  if (
    normalized.includes("form-3") ||
    normalized.includes("tingkatan-3") ||
    normalized === "f3" ||
    normalized === "3"
  ) {
    return "FORM-3";
  }

  if (
    normalized.includes("form-2") ||
    normalized.includes("tingkatan-2") ||
    normalized === "f2" ||
    normalized === "2"
  ) {
    return "FORM-2";
  }

  return "FORM-1";
}

export function resolveEnglishCurriculumLevelCode(
  levelHint?: string | null,
): EnglishCurriculumLevelCode {
  const normalized = normalizeTopicToken(levelHint ?? "");

  if (
    normalized.includes("form-5") ||
    normalized.includes("tingkatan-5") ||
    normalized === "f5" ||
    normalized === "5"
  ) {
    return "FORM-5";
  }

  if (
    normalized.includes("form-4") ||
    normalized.includes("tingkatan-4") ||
    normalized === "f4" ||
    normalized === "4"
  ) {
    return "FORM-4";
  }

  if (
    normalized.includes("form-3") ||
    normalized.includes("tingkatan-3") ||
    normalized === "f3" ||
    normalized === "3"
  ) {
    return "FORM-3";
  }

  if (
    normalized.includes("form-2") ||
    normalized.includes("tingkatan-2") ||
    normalized === "f2" ||
    normalized === "2"
  ) {
    return "FORM-2";
  }

  return "FORM-1";
}

export function resolveBahasaMelayuCurriculumLevelCode(
  levelHint?: string | null,
): BahasaMelayuCurriculumLevelCode {
  const normalized = normalizeTopicToken(levelHint ?? "");

  if (
    normalized.includes("form-5") ||
    normalized.includes("tingkatan-5") ||
    normalized === "f5" ||
    normalized === "5"
  ) {
    return "FORM-5";
  }

  if (
    normalized.includes("form-4") ||
    normalized.includes("tingkatan-4") ||
    normalized === "f4" ||
    normalized === "4"
  ) {
    return "FORM-4";
  }

  if (
    normalized.includes("form-3") ||
    normalized.includes("tingkatan-3") ||
    normalized === "f3" ||
    normalized === "3"
  ) {
    return "FORM-3";
  }

  if (
    normalized.includes("form-2") ||
    normalized.includes("tingkatan-2") ||
    normalized === "f2" ||
    normalized === "2"
  ) {
    return "FORM-2";
  }

  return "FORM-1";
}

export function resolveScienceCurriculumLevelCode(
  levelHint?: string | null,
): ScienceCurriculumLevelCode {
  const normalized = normalizeTopicToken(levelHint ?? "");

  if (
    normalized.includes("form-5") ||
    normalized.includes("tingkatan-5") ||
    normalized === "f5" ||
    normalized === "5"
  ) {
    return "FORM-5";
  }

  if (
    normalized.includes("form-4") ||
    normalized.includes("tingkatan-4") ||
    normalized === "f4" ||
    normalized === "4"
  ) {
    return "FORM-4";
  }

  if (
    normalized.includes("form-3") ||
    normalized.includes("tingkatan-3") ||
    normalized === "f3" ||
    normalized === "3"
  ) {
    return "FORM-3";
  }

  if (
    normalized.includes("form-2") ||
    normalized.includes("tingkatan-2") ||
    normalized === "f2" ||
    normalized === "2"
  ) {
    return "FORM-2";
  }

  return "FORM-1";
}

export function resolveMathTopicAliasCode(
  topicKey: string,
  topicLabel: string,
) {
  const rawKey = normalizeTopicToken(topicKey);
  const rawLabel = normalizeTopicToken(topicLabel);

  return legacyMathTopicAliases[rawKey] ?? legacyMathTopicAliases[rawLabel];
}

export function resolveEnglishTopicAliasCode(
  topicKey: string,
  topicLabel: string,
) {
  const rawKey = normalizeTopicToken(topicKey);
  const rawLabel = normalizeTopicToken(topicLabel);

  return legacyEnglishTopicAliases[rawKey] ?? legacyEnglishTopicAliases[rawLabel];
}

export function resolveBahasaMelayuTopicAliasCode(
  topicKey: string,
  topicLabel: string,
) {
  const rawKey = normalizeTopicToken(topicKey);
  const rawLabel = normalizeTopicToken(topicLabel);

  return (
    legacyBahasaMelayuTopicAliases[rawKey] ??
    legacyBahasaMelayuTopicAliases[rawLabel]
  );
}

export function resolveScienceTopicAliasCode(
  topicKey: string,
  topicLabel: string,
) {
  const rawKey = normalizeTopicToken(topicKey);
  const rawLabel = normalizeTopicToken(topicLabel);

  return legacyScienceTopicAliases[rawKey] ?? legacyScienceTopicAliases[rawLabel];
}

export function resolveCurriculumLevelCodeForSubject(
  subjectCode: string | null | undefined,
  subjectName: string | null | undefined,
  levelHint?: string | null,
) {
  const normalizedName = (subjectName ?? "").toLowerCase();

  if (subjectCode === "MATH-KSSM" || normalizedName.includes("math")) {
    return resolveMathCurriculumLevelCode(levelHint);
  }

  if (subjectCode === "ENG-KSSM" || normalizedName.includes("english")) {
    return resolveEnglishCurriculumLevelCode(levelHint);
  }

  if (
    subjectCode === "BM-KSSM" ||
    normalizedName.includes("bahasa melayu") ||
    normalizedName.includes("melayu")
  ) {
    return resolveBahasaMelayuCurriculumLevelCode(levelHint);
  }

  if (subjectCode === "SCI-KSSM" || normalizedName.includes("science")) {
    return resolveScienceCurriculumLevelCode(levelHint);
  }

  return undefined;
}

export function resolveTopicAliasCodeForSubject(
  subjectCode: string | null | undefined,
  subjectName: string | null | undefined,
  topicKey: string,
  topicLabel: string,
) {
  const normalizedName = (subjectName ?? "").toLowerCase();

  if (subjectCode === "MATH-KSSM" || normalizedName.includes("math")) {
    return resolveMathTopicAliasCode(topicKey, topicLabel);
  }

  if (subjectCode === "ENG-KSSM" || normalizedName.includes("english")) {
    return resolveEnglishTopicAliasCode(topicKey, topicLabel);
  }

  if (
    subjectCode === "BM-KSSM" ||
    normalizedName.includes("bahasa melayu") ||
    normalizedName.includes("melayu")
  ) {
    return resolveBahasaMelayuTopicAliasCode(topicKey, topicLabel);
  }

  if (subjectCode === "SCI-KSSM" || normalizedName.includes("science")) {
    return resolveScienceTopicAliasCode(topicKey, topicLabel);
  }

  return undefined;
}

export async function getDefaultStudyPlanTopicsForSubject(
  tx: TxClient,
  subject: { id: string; code: string; name: string },
  options?: StudyPlanTopicOptions,
): Promise<StudyPlanTopicSeed[]> {
  const normalizedName = subject.name.toLowerCase();

  if (subject.code === "MATH-KSSM" || normalizedName.includes("math")) {
    const levelCode = resolveMathCurriculumLevelCode(options?.levelHint);
    const starterConfig = mathStarterConfigByLevel[levelCode];
    const starterCodes = starterConfig.map((topic) => topic.code);
    let curriculumTopics = await tx.subjectTopic.findMany({
      where: {
        subjectId: subject.id,
        level: {
          code: levelCode,
        },
        code: {
          in: starterCodes,
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    if (curriculumTopics.length === 0) {
      curriculumTopics = await tx.subjectTopic.findMany({
        where: {
          subject: {
            code: "MATH-KSSM",
          },
          level: {
            code: levelCode,
          },
          code: {
            in: starterCodes,
          },
        },
        select: {
          id: true,
          code: true,
          name: true,
        },
      });
    }

    const byCode = new Map(curriculumTopics.map((topic) => [topic.code, topic]));
    const starterTopics = starterConfig
      .map(({ code, approved }) => ({ topic: byCode.get(code), approved }))
      .filter(
        (entry): entry is {
          topic: { id: string; code: string; name: string };
          approved: boolean;
        } => entry.topic !== undefined,
      )
      .map(({ topic, approved }) => ({
        topicKey: topic.id,
        topicLabel: topic.name,
        approved,
      }));

    if (starterTopics.length > 0) {
      return starterTopics;
    }

    const fallbackTopics = starterConfig
      .map(({ code }) => byCode.get(code))
      .filter(
        (topic): topic is { id: string; code: string; name: string } =>
          topic !== undefined,
      )
      .map((topic) => ({
        topicKey: topic.id,
        topicLabel: topic.name,
        approved: true,
      }));

    if (fallbackTopics.length > 0) {
      return fallbackTopics;
    }
  }

  if (subject.code === "ENG-KSSM" || normalizedName.includes("english")) {
    const levelCode = resolveEnglishCurriculumLevelCode(options?.levelHint);
    const starterConfig = englishStarterConfigByLevel[levelCode];
    const starterCodes = starterConfig.map((topic) => topic.code);
    let curriculumTopics = await tx.subjectTopic.findMany({
      where: {
        subjectId: subject.id,
        level: {
          code: levelCode,
        },
        code: {
          in: starterCodes,
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    if (curriculumTopics.length === 0) {
      curriculumTopics = await tx.subjectTopic.findMany({
        where: {
          subject: {
            code: "ENG-KSSM",
          },
          level: {
            code: levelCode,
          },
          code: {
            in: starterCodes,
          },
        },
        select: {
          id: true,
          code: true,
          name: true,
        },
      });
    }

    const byCode = new Map(curriculumTopics.map((topic) => [topic.code, topic]));
    const starterTopics = starterConfig
      .map(({ code, approved }) => ({ topic: byCode.get(code), approved }))
      .filter(
        (entry): entry is {
          topic: { id: string; code: string; name: string };
          approved: boolean;
        } => entry.topic !== undefined,
      )
      .map(({ topic, approved }) => ({
        topicKey: topic.id,
        topicLabel: topic.name,
        approved,
      }));

    if (starterTopics.length > 0) {
      return starterTopics;
    }

    const fallbackTopics = starterConfig
      .map(({ code }) => byCode.get(code))
      .filter(
        (topic): topic is { id: string; code: string; name: string } =>
          topic !== undefined,
      )
      .map((topic) => ({
        topicKey: topic.id,
        topicLabel: topic.name,
        approved: true,
      }));

    if (fallbackTopics.length > 0) {
      return fallbackTopics;
    }
  }

  if (
    subject.code === "BM-KSSM" ||
    normalizedName.includes("bahasa melayu") ||
    normalizedName.includes("melayu")
  ) {
    const levelCode = resolveBahasaMelayuCurriculumLevelCode(options?.levelHint);
    const starterConfig = bahasaMelayuStarterConfigByLevel[levelCode];
    const starterCodes = starterConfig.map((topic) => topic.code);
    let curriculumTopics = await tx.subjectTopic.findMany({
      where: {
        subjectId: subject.id,
        level: {
          code: levelCode,
        },
        code: {
          in: starterCodes,
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    if (curriculumTopics.length === 0) {
      curriculumTopics = await tx.subjectTopic.findMany({
        where: {
          subject: {
            code: "BM-KSSM",
          },
          level: {
            code: levelCode,
          },
          code: {
            in: starterCodes,
          },
        },
        select: {
          id: true,
          code: true,
          name: true,
        },
      });
    }

    const byCode = new Map(curriculumTopics.map((topic) => [topic.code, topic]));
    const starterTopics = starterConfig
      .map(({ code, approved }) => ({ topic: byCode.get(code), approved }))
      .filter(
        (entry): entry is {
          topic: { id: string; code: string; name: string };
          approved: boolean;
        } => entry.topic !== undefined,
      )
      .map(({ topic, approved }) => ({
        topicKey: topic.id,
        topicLabel: topic.name,
        approved,
      }));

    if (starterTopics.length > 0) {
      return starterTopics;
    }

    const fallbackTopics = starterConfig
      .map(({ code }) => byCode.get(code))
      .filter(
        (topic): topic is { id: string; code: string; name: string } =>
          topic !== undefined,
      )
      .map((topic) => ({
        topicKey: topic.id,
        topicLabel: topic.name,
        approved: true,
      }));

    if (fallbackTopics.length > 0) {
      return fallbackTopics;
    }
  }

  if (subject.code === "SCI-KSSM" || normalizedName.includes("science")) {
    const levelCode = resolveScienceCurriculumLevelCode(options?.levelHint);
    const starterConfig = scienceStarterConfigByLevel[levelCode];
    const starterCodes = starterConfig.map((topic) => topic.code);
    let curriculumTopics = await tx.subjectTopic.findMany({
      where: {
        subjectId: subject.id,
        level: {
          code: levelCode,
        },
        code: {
          in: starterCodes,
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    if (curriculumTopics.length === 0) {
      curriculumTopics = await tx.subjectTopic.findMany({
        where: {
          subject: {
            code: "SCI-KSSM",
          },
          level: {
            code: levelCode,
          },
          code: {
            in: starterCodes,
          },
        },
        select: {
          id: true,
          code: true,
          name: true,
        },
      });
    }

    const byCode = new Map(curriculumTopics.map((topic) => [topic.code, topic]));
    const starterTopics = starterConfig
      .map(({ code, approved }) => ({ topic: byCode.get(code), approved }))
      .filter(
        (entry): entry is {
          topic: { id: string; code: string; name: string };
          approved: boolean;
        } => entry.topic !== undefined,
      )
      .map(({ topic, approved }) => ({
        topicKey: topic.id,
        topicLabel: topic.name,
        approved,
      }));

    if (starterTopics.length > 0) {
      return starterTopics;
    }

    const fallbackTopics = starterConfig
      .map(({ code }) => byCode.get(code))
      .filter(
        (topic): topic is { id: string; code: string; name: string } =>
          topic !== undefined,
      )
      .map((topic) => ({
        topicKey: topic.id,
        topicLabel: topic.name,
        approved: true,
      }));

    if (fallbackTopics.length > 0) {
      return fallbackTopics;
    }
  }

  return [
    { topicKey: "foundations", topicLabel: "Core Foundations", approved: true },
    { topicKey: "guided-practice", topicLabel: "Guided Practice", approved: true },
    { topicKey: "revision", topicLabel: "Revision Practice", approved: false },
  ];
}

export async function normalizeRevisionTopicsForSubject(
  tx: TxClient,
  subjectId: string,
  revisionTopics: RevisionTopicInput[],
  options?: StudyPlanTopicOptions,
) {
  const subject = await tx.subject.findUnique({
    where: { id: subjectId },
    select: { code: true, name: true },
  });

  const curriculumLevelCode = subject
    ? resolveCurriculumLevelCodeForSubject(
        subject.code,
        subject.name,
        options?.levelHint,
      )
    : undefined;

  let curriculumTopics = await tx.subjectTopic.findMany({
    where: {
      subjectId,
      ...(curriculumLevelCode
        ? {
            level: {
              code: curriculumLevelCode,
            },
          }
        : {}),
    },
    select: {
      id: true,
      code: true,
      name: true,
    },
  });

  if (curriculumTopics.length === 0 && subject) {
    curriculumTopics = await tx.subjectTopic.findMany({
      where: {
        subject: {
          code: subject.code,
        },
        ...(curriculumLevelCode
          ? {
              level: {
                code: curriculumLevelCode,
              },
            }
          : {}),
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });
  }

  if (curriculumTopics.length === 0) {
    return revisionTopics;
  }

  const byId = new Map(curriculumTopics.map((topic) => [topic.id, topic]));
  const byCode = new Map(
    curriculumTopics.map((topic) => [topic.code.toLowerCase(), topic]),
  );
  const byName = new Map(
    curriculumTopics.map((topic) => [normalizeTopicToken(topic.name), topic]),
  );

  return revisionTopics.map((topic) => {
    const rawKey = normalizeTopicToken(topic.topicKey);
    const rawLabel = normalizeTopicToken(topic.topicLabel);
    const aliasCode = resolveTopicAliasCodeForSubject(
      subject?.code,
      subject?.name,
      topic.topicKey,
      topic.topicLabel,
    );

    const matchedTopic =
      byId.get(topic.topicKey) ??
      byCode.get(topic.topicKey.toLowerCase()) ??
      byName.get(rawKey) ??
      byName.get(rawLabel) ??
      (aliasCode ? byCode.get(aliasCode.toLowerCase()) : undefined);

    if (!matchedTopic) {
      return topic;
    }

    return {
      ...topic,
      topicKey: matchedTopic.id,
      topicLabel: matchedTopic.name,
    };
  });
}

export async function normalizeTopicReferenceForSubject(
  tx: TxClient,
  subjectId: string,
  topicKey: string,
  topicLabel: string,
  options?: StudyPlanTopicOptions,
) {
  const [normalized] = await normalizeRevisionTopicsForSubject(tx, subjectId, [
    {
      topicKey,
      topicLabel,
      accessApproved: true,
      sequenceOrder: 1,
    },
  ], options);

  return normalized
    ? {
        topicKey: normalized.topicKey,
        topicLabel: normalized.topicLabel,
      }
    : {
        topicKey,
        topicLabel,
      };
}
