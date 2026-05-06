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

  if (
    curriculumTopics.length === 0 &&
    subject &&
    (subject.code === "MATH-KSSM" || subject.name.toLowerCase().includes("math"))
  ) {
    curriculumTopics = await tx.subjectTopic.findMany({
      where: {
        subject: {
          code: "MATH-KSSM",
        },
        ...(mathLevelCode
          ? {
              level: {
                code: mathLevelCode,
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
