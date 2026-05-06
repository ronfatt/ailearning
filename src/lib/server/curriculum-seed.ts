import {
  ContentStatus,
  DifficultyBand,
  InterventionTriggerType,
  LessonModuleType,
  MasteryEdgeType,
  MasteryNodeType,
  PrismaClient,
  QuestionDifficulty,
  QuestionFormat,
  QuestionPoolType,
  RevisionScheduleType,
} from "@prisma/client";

const curriculumIds = {
  subjectMath: "curriculum_subject_math_kssm",
  subjectEnglish: "curriculum_subject_english_kssm",
  levelForm1: "curriculum_level_math_form1",
  levelForm2: "curriculum_level_math_form2",
  levelForm3: "curriculum_level_math_form3",
  levelForm4: "curriculum_level_math_form4",
  levelForm5: "curriculum_level_math_form5",
  levelEnglishForm1: "curriculum_level_english_form1",
  levelEnglishForm2: "curriculum_level_english_form2",
  levelEnglishForm3: "curriculum_level_english_form3",
  levelEnglishForm4: "curriculum_level_english_form4",
  levelEnglishForm5: "curriculum_level_english_form5",
  domainForm1Number: "curriculum_domain_f1_number",
  domainForm1Algebra: "curriculum_domain_f1_algebra",
  domainForm1Geometry: "curriculum_domain_f1_geometry",
  domainForm1Data: "curriculum_domain_f1_data",
  domainForm2Patterns: "curriculum_domain_f2_patterns",
  domainForm2Geometry: "curriculum_domain_f2_geometry",
  domainForm2Graphs: "curriculum_domain_f2_graphs",
  domainForm2Data: "curriculum_domain_f2_data",
  domainForm3Number: "curriculum_domain_f3_number",
  domainForm3Geometry: "curriculum_domain_f3_geometry",
  domainForm3Spatial: "curriculum_domain_f3_spatial",
  domainForm3Graphs: "curriculum_domain_f3_graphs",
  domainForm4Algebra: "curriculum_domain_f4_algebra",
  domainForm4Reasoning: "curriculum_domain_f4_reasoning",
  domainForm4Graphs: "curriculum_domain_f4_graphs",
  domainForm4Applied: "curriculum_domain_f4_applied",
  domainForm5Algebra: "curriculum_domain_f5_algebra",
  domainForm5Geometry: "curriculum_domain_f5_geometry",
  domainForm5Trig: "curriculum_domain_f5_trig",
  domainForm5Applied: "curriculum_domain_f5_applied",
  domainEnglishForm1Reading: "curriculum_domain_eng_f1_reading",
  domainEnglishForm1Grammar: "curriculum_domain_eng_f1_grammar",
  domainEnglishForm1Vocabulary: "curriculum_domain_eng_f1_vocabulary",
  domainEnglishForm1Writing: "curriculum_domain_eng_f1_writing",
  domainEnglishForm2Reading: "curriculum_domain_eng_f2_reading",
  domainEnglishForm2Grammar: "curriculum_domain_eng_f2_grammar",
  domainEnglishForm2Vocabulary: "curriculum_domain_eng_f2_vocabulary",
  domainEnglishForm2Writing: "curriculum_domain_eng_f2_writing",
  domainEnglishForm3Reading: "curriculum_domain_eng_f3_reading",
  domainEnglishForm3Grammar: "curriculum_domain_eng_f3_grammar",
  domainEnglishForm3Vocabulary: "curriculum_domain_eng_f3_vocabulary",
  domainEnglishForm3Writing: "curriculum_domain_eng_f3_writing",
  domainEnglishForm4Reading: "curriculum_domain_eng_f4_reading",
  domainEnglishForm4Grammar: "curriculum_domain_eng_f4_grammar",
  domainEnglishForm4Vocabulary: "curriculum_domain_eng_f4_vocabulary",
  domainEnglishForm4Writing: "curriculum_domain_eng_f4_writing",
  domainEnglishForm5Reading: "curriculum_domain_eng_f5_reading",
  domainEnglishForm5Grammar: "curriculum_domain_eng_f5_grammar",
  domainEnglishForm5Vocabulary: "curriculum_domain_eng_f5_vocabulary",
  domainEnglishForm5Writing: "curriculum_domain_eng_f5_writing",
} as const;

type SubjectSeed = {
  id: string;
  code: string;
  name: string;
  description: string;
};

type LevelSeed = {
  id: string;
  code: string;
  formLabel: string;
  ageBand: string;
  track: string;
  examStage: string;
  curriculumFramework: string;
  sequenceOrder: number;
};

type DomainSeed = {
  id: string;
  code: string;
  name: string;
  description: string;
  sequenceOrder: number;
};

type TopicSeed = {
  id: string;
  domainId: string;
  code: string;
  name: string;
  summary: string;
  prerequisiteSummary?: string;
  sequenceOrder: number;
  estimatedLearningMinutes: number;
  estimatedRevisionCycles: number;
};

type MasteryNodeSeed = {
  id: string;
  topicId: string;
  code: string;
  nodeType: MasteryNodeType;
  title: string;
  learningObjective: string;
  difficultyBand?: DifficultyBand;
  sequenceOrder: number;
  masteryThreshold?: number;
  hintDependencyLimit?: number;
  retryLimit?: number;
  retentionReviewDays?: number;
};

type MisconceptionSeed = {
  topicId: string;
  code: string;
  label: string;
  description: string;
  remedialStrategy: string;
};

type MasteryEdgeSeed = {
  fromNodeId: string;
  toNodeId: string;
  edgeType?: MasteryEdgeType;
};

const curriculumSubjects: SubjectSeed[] = [
  {
    id: curriculumIds.subjectMath,
    code: "MATH-KSSM",
    name: "Mathematics",
    description:
      "KSSM mathematics curriculum with mastery-driven AI tutoring and tutor intervention hooks.",
  },
  {
    id: curriculumIds.subjectEnglish,
    code: "ENG-KSSM",
    name: "English",
    description:
      "KSSM English curriculum with mastery-based reading, language, vocabulary, and writing support.",
  },
];

const form1Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainForm1Number,
    code: "A",
    name: "Number and Arithmetic",
    description: "Rational numbers, factorisation, powers, roots, and ratio foundations.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainForm1Algebra,
    code: "B",
    name: "Algebra Foundations",
    description: "Variables, expressions, equations, and inequalities for early algebra fluency.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainForm1Geometry,
    code: "C",
    name: "Geometry and Measurement",
    description: "Angles, polygons, measurement, area, and Pythagoras.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainForm1Data,
    code: "D",
    name: "Sets and Data",
    description: "Set logic, data representation, and simple interpretation skills.",
    sequenceOrder: 4,
  },
];

const form1Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_f1_a1_rational_numbers",
    domainId: curriculumIds.domainForm1Number,
    code: "A1",
    name: "Rational Numbers",
    summary: "Understand, compare, and operate with positive and negative rational numbers.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f1_a2_factors_and_multiples",
    domainId: curriculumIds.domainForm1Number,
    code: "A2",
    name: "Factors and Multiples",
    summary: "Use factorisation, HCF, and LCM accurately in arithmetic and context tasks.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f1_a3_powers_and_roots",
    domainId: curriculumIds.domainForm1Number,
    code: "A3",
    name: "Powers and Roots",
    summary: "Recognise and apply square, cube, and root relationships.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 90,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f1_a4_ratio_rate_proportion",
    domainId: curriculumIds.domainForm1Number,
    code: "A4",
    name: "Ratio, Rate and Proportion",
    summary: "Compare quantities, simplify ratios, and solve proportional relationships.",
    sequenceOrder: 4,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f1_b1_algebraic_language",
    domainId: curriculumIds.domainForm1Algebra,
    code: "B1",
    name: "Algebraic Language",
    summary: "Translate between words and algebraic expressions with confidence.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f1_b2_linear_equations",
    domainId: curriculumIds.domainForm1Algebra,
    code: "B2",
    name: "Linear Equations",
    summary: "Form and solve simple linear equations, including contextual problems.",
    prerequisiteSummary: "Rational number operations and algebraic expressions.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f1_b3_linear_inequalities",
    domainId: curriculumIds.domainForm1Algebra,
    code: "B3",
    name: "Linear Inequalities",
    summary: "Solve and represent simple inequalities on number lines and in context.",
    prerequisiteSummary: "Linear equations and rational number comparison.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f1_c1_lines_and_angles",
    domainId: curriculumIds.domainForm1Geometry,
    code: "C1",
    name: "Lines and Angles",
    summary: "Recognise line relationships and basic angle rules.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 90,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f1_c2_basic_polygons",
    domainId: curriculumIds.domainForm1Geometry,
    code: "C2",
    name: "Basic Polygons",
    summary: "Classify polygons and recognise their key properties.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 90,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f1_c3_perimeter",
    domainId: curriculumIds.domainForm1Geometry,
    code: "C3",
    name: "Perimeter",
    summary: "Find perimeter of simple and composite shapes accurately.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 70,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f1_c4_area",
    domainId: curriculumIds.domainForm1Geometry,
    code: "C4",
    name: "Area",
    summary: "Use area formulas for basic shapes and solve measurement problems.",
    sequenceOrder: 4,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f1_c5_pythagoras",
    domainId: curriculumIds.domainForm1Geometry,
    code: "C5",
    name: "Pythagoras’ Theorem",
    summary: "Solve right-triangle side-length problems and identify right-triangle logic.",
    prerequisiteSummary: "Squares, square roots, and basic triangle knowledge.",
    sequenceOrder: 5,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f1_d1_sets",
    domainId: curriculumIds.domainForm1Data,
    code: "D1",
    name: "Introduction to Sets",
    summary: "Represent simple sets, subsets, complements, and Venn diagrams.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 80,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f1_d2_data_handling",
    domainId: curriculumIds.domainForm1Data,
    code: "D2",
    name: "Data Handling",
    summary: "Read and interpret tables and basic data displays.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 90,
    estimatedRevisionCycles: 2,
  },
];

const masteryNodes: MasteryNodeSeed[] = [
  {
    id: "RN-01",
    topicId: "curriculum_topic_f1_a1_rational_numbers",
    code: "RN-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify positive and negative rational numbers",
    learningObjective: "Recognise integers, fractions, and decimals with signs.",
    sequenceOrder: 1,
  },
  {
    id: "RN-02",
    topicId: "curriculum_topic_f1_a1_rational_numbers",
    code: "RN-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Compare and order rational numbers",
    learningObjective: "Order signed rational numbers correctly on a number line.",
    sequenceOrder: 2,
  },
  {
    id: "RN-03",
    topicId: "curriculum_topic_f1_a1_rational_numbers",
    code: "RN-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Perform mixed rational number operations",
    learningObjective: "Add, subtract, multiply, and divide signed rational numbers.",
    sequenceOrder: 3,
    masteryThreshold: 85,
  },
  {
    id: "RN-04",
    topicId: "curriculum_topic_f1_a1_rational_numbers",
    code: "RN-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Solve contextual rational number problems",
    learningObjective: "Use rational numbers in temperature, debt, and directional contexts.",
    sequenceOrder: 4,
  },
  {
    id: "FM-01",
    topicId: "curriculum_topic_f1_a2_factors_and_multiples",
    code: "FM-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify factors and prime numbers",
    learningObjective: "Recognise factors and classify prime numbers accurately.",
    sequenceOrder: 1,
  },
  {
    id: "FM-02",
    topicId: "curriculum_topic_f1_a2_factors_and_multiples",
    code: "FM-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Perform prime factorisation",
    learningObjective: "Break numbers into prime factors systematically.",
    sequenceOrder: 2,
  },
  {
    id: "FM-03",
    topicId: "curriculum_topic_f1_a2_factors_and_multiples",
    code: "FM-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Find HCF and LCM",
    learningObjective: "Use factorisation to determine HCF and LCM correctly.",
    sequenceOrder: 3,
  },
  {
    id: "FM-04",
    topicId: "curriculum_topic_f1_a2_factors_and_multiples",
    code: "FM-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use HCF and LCM in context",
    learningObjective: "Choose HCF or LCM correctly in scheduling and grouping problems.",
    sequenceOrder: 4,
  },
  {
    id: "PW-01",
    topicId: "curriculum_topic_f1_a3_powers_and_roots",
    code: "PW-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise square and cube numbers",
    learningObjective: "Identify square numbers, cube numbers, and their patterns.",
    sequenceOrder: 1,
  },
  {
    id: "PW-02",
    topicId: "curriculum_topic_f1_a3_powers_and_roots",
    code: "PW-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Find square roots and cube roots",
    learningObjective: "Evaluate simple square roots and cube roots correctly.",
    sequenceOrder: 2,
  },
  {
    id: "PW-03",
    topicId: "curriculum_topic_f1_a3_powers_and_roots",
    code: "PW-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Estimate roots and compare magnitudes",
    learningObjective: "Estimate square roots and compare power relationships logically.",
    sequenceOrder: 3,
  },
  {
    id: "PW-04",
    topicId: "curriculum_topic_f1_a3_powers_and_roots",
    code: "PW-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use powers and roots in context",
    learningObjective: "Apply square and cube relationships in geometry and measurement situations.",
    sequenceOrder: 4,
  },
  {
    id: "RP-01",
    topicId: "curriculum_topic_f1_a4_ratio_rate_proportion",
    code: "RP-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Read and simplify ratios",
    learningObjective: "Represent and simplify ratios correctly.",
    sequenceOrder: 1,
  },
  {
    id: "RP-02",
    topicId: "curriculum_topic_f1_a4_ratio_rate_proportion",
    code: "RP-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Work with equivalent ratios",
    learningObjective: "Scale ratios up and down while preserving relationship.",
    sequenceOrder: 2,
  },
  {
    id: "RP-03",
    topicId: "curriculum_topic_f1_a4_ratio_rate_proportion",
    code: "RP-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Solve rate and proportion questions",
    learningObjective: "Calculate rate and solve simple proportional relationships.",
    sequenceOrder: 3,
  },
  {
    id: "RP-04",
    topicId: "curriculum_topic_f1_a4_ratio_rate_proportion",
    code: "RP-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use ratio in word problems",
    learningObjective: "Interpret and solve real-life ratio and scale situations.",
    sequenceOrder: 4,
  },
  {
    id: "AL-01",
    topicId: "curriculum_topic_f1_b1_algebraic_language",
    code: "AL-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify variables, constants, and terms",
    learningObjective: "Distinguish the basic parts of algebraic expressions.",
    sequenceOrder: 1,
  },
  {
    id: "AL-02",
    topicId: "curriculum_topic_f1_b1_algebraic_language",
    code: "AL-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Combine like terms",
    learningObjective: "Simplify algebraic expressions by combining like terms.",
    sequenceOrder: 2,
  },
  {
    id: "AL-03",
    topicId: "curriculum_topic_f1_b1_algebraic_language",
    code: "AL-03",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Translate statements into algebra",
    learningObjective: "Turn verbal phrases into algebraic expressions.",
    sequenceOrder: 3,
  },
  {
    id: "LE-01",
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "LE-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify variables and constants in equations",
    learningObjective: "Recognise the structure of a simple linear equation.",
    sequenceOrder: 1,
  },
  {
    id: "LE-02",
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "LE-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Solve one-step equations",
    learningObjective: "Use inverse operations to solve one-step linear equations.",
    sequenceOrder: 2,
  },
  {
    id: "LE-03",
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "LE-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Solve two-step equations",
    learningObjective: "Solve equations requiring two inverse operations.",
    sequenceOrder: 3,
    masteryThreshold: 85,
  },
  {
    id: "LE-04",
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "LE-04",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Solve equations with brackets",
    learningObjective: "Expand or simplify before solving equations with brackets.",
    sequenceOrder: 4,
    difficultyBand: DifficultyBand.STRETCH,
  },
  {
    id: "LE-05",
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "LE-05",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Translate word problems into equations",
    learningObjective: "Convert verbal situations into linear equations.",
    sequenceOrder: 5,
  },
  {
    id: "LE-06",
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "LE-06",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Solve contextual linear equation problems",
    learningObjective: "Solve short real-life problems using linear equations.",
    sequenceOrder: 6,
  },
  {
    id: "LE-07",
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "LE-07",
    nodeType: MasteryNodeType.RETENTION,
    title: "Retain linear equation fluency",
    learningObjective: "Re-solve linear equation tasks after spaced review.",
    sequenceOrder: 7,
  },
  {
    id: "LI-01",
    topicId: "curriculum_topic_f1_b3_linear_inequalities",
    code: "LI-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Read inequality symbols and statements",
    learningObjective: "Interpret <, >, ≤, and ≥ correctly in numeric and algebraic statements.",
    sequenceOrder: 1,
  },
  {
    id: "LI-02",
    topicId: "curriculum_topic_f1_b3_linear_inequalities",
    code: "LI-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Solve simple linear inequalities",
    learningObjective: "Solve one-step and two-step linear inequalities accurately.",
    sequenceOrder: 2,
  },
  {
    id: "LI-03",
    topicId: "curriculum_topic_f1_b3_linear_inequalities",
    code: "LI-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Represent inequalities on number lines",
    learningObjective: "Show inequality solutions clearly using number-line notation.",
    sequenceOrder: 3,
  },
  {
    id: "LI-04",
    topicId: "curriculum_topic_f1_b3_linear_inequalities",
    code: "LI-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use inequalities in context",
    learningObjective: "Model short real-life limits and ranges using inequalities.",
    sequenceOrder: 4,
  },
  {
    id: "LA-01",
    topicId: "curriculum_topic_f1_c1_lines_and_angles",
    code: "LA-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify line and angle types",
    learningObjective: "Recognise common line relationships and basic angle types.",
    sequenceOrder: 1,
  },
  {
    id: "LA-02",
    topicId: "curriculum_topic_f1_c1_lines_and_angles",
    code: "LA-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Use straight-line and point angle rules",
    learningObjective: "Calculate unknown angles using angles on a line and around a point.",
    sequenceOrder: 2,
  },
  {
    id: "LA-03",
    topicId: "curriculum_topic_f1_c1_lines_and_angles",
    code: "LA-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Use vertically opposite and basic parallel-line logic",
    learningObjective: "Solve angle problems involving intersecting or parallel lines.",
    sequenceOrder: 3,
  },
  {
    id: "LA-04",
    topicId: "curriculum_topic_f1_c1_lines_and_angles",
    code: "LA-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Apply angle rules in diagrams",
    learningObjective: "Use angle relationships to justify or solve geometric diagrams.",
    sequenceOrder: 4,
  },
  {
    id: "PG-01",
    topicId: "curriculum_topic_f1_c2_basic_polygons",
    code: "PG-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Classify common polygons",
    learningObjective: "Name and classify polygons by number of sides and key properties.",
    sequenceOrder: 1,
  },
  {
    id: "PG-02",
    topicId: "curriculum_topic_f1_c2_basic_polygons",
    code: "PG-02",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Distinguish regular and irregular polygons",
    learningObjective: "Identify whether polygons are regular or irregular and explain why.",
    sequenceOrder: 2,
  },
  {
    id: "PG-03",
    topicId: "curriculum_topic_f1_c2_basic_polygons",
    code: "PG-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Recognise symmetry in polygons",
    learningObjective: "Identify lines of symmetry and simple polygon properties correctly.",
    sequenceOrder: 3,
  },
  {
    id: "PG-04",
    topicId: "curriculum_topic_f1_c2_basic_polygons",
    code: "PG-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use polygon properties in sorting tasks",
    learningObjective: "Compare and sort polygons using shape properties and symmetry clues.",
    sequenceOrder: 4,
  },
  {
    id: "PE-01",
    topicId: "curriculum_topic_f1_c3_perimeter",
    code: "PE-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify perimeter as boundary length",
    learningObjective: "Distinguish perimeter from other measures such as area.",
    sequenceOrder: 1,
  },
  {
    id: "PE-02",
    topicId: "curriculum_topic_f1_c3_perimeter",
    code: "PE-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Find perimeter of basic and composite shapes",
    learningObjective: "Calculate perimeter using all relevant side lengths accurately.",
    sequenceOrder: 2,
  },
  {
    id: "PE-03",
    topicId: "curriculum_topic_f1_c3_perimeter",
    code: "PE-03",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Solve perimeter word problems",
    learningObjective: "Use perimeter in fencing, border, and path-length contexts.",
    sequenceOrder: 3,
  },
  {
    id: "AR-01",
    topicId: "curriculum_topic_f1_c4_area",
    code: "AR-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify correct area formula",
    learningObjective: "Choose the right area formula for common 2D shapes.",
    sequenceOrder: 1,
  },
  {
    id: "AR-02",
    topicId: "curriculum_topic_f1_c4_area",
    code: "AR-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Find area of triangles and parallelograms",
    learningObjective: "Calculate areas of triangles and parallelograms correctly.",
    sequenceOrder: 2,
  },
  {
    id: "AR-03",
    topicId: "curriculum_topic_f1_c4_area",
    code: "AR-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Find area of kites and trapeziums",
    learningObjective: "Calculate areas of kites and trapeziums accurately.",
    sequenceOrder: 3,
  },
  {
    id: "AR-04",
    topicId: "curriculum_topic_f1_c4_area",
    code: "AR-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Compare perimeter and area in context",
    learningObjective: "Decide whether perimeter or area is needed in real-life measurement problems.",
    sequenceOrder: 4,
  },
  {
    id: "AR-05",
    topicId: "curriculum_topic_f1_c4_area",
    code: "AR-05",
    nodeType: MasteryNodeType.RETENTION,
    title: "Retain area formula fluency",
    learningObjective: "Recall and reuse area formulas after spaced review.",
    sequenceOrder: 5,
  },
  {
    id: "PY-01",
    topicId: "curriculum_topic_f1_c5_pythagoras",
    code: "PY-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify right triangles and the hypotenuse",
    learningObjective: "Recognise the hypotenuse in a right-angled triangle.",
    sequenceOrder: 1,
  },
  {
    id: "PY-02",
    topicId: "curriculum_topic_f1_c5_pythagoras",
    code: "PY-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Use the Pythagoras formula",
    learningObjective: "Apply the Pythagoras theorem correctly in standard form.",
    sequenceOrder: 2,
  },
  {
    id: "PY-03",
    topicId: "curriculum_topic_f1_c5_pythagoras",
    code: "PY-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Find a missing side length",
    learningObjective: "Calculate a missing side in a right triangle.",
    sequenceOrder: 3,
  },
  {
    id: "PY-04",
    topicId: "curriculum_topic_f1_c5_pythagoras",
    code: "PY-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Solve Pythagoras word problems",
    learningObjective: "Use the theorem in distance and measurement contexts.",
    sequenceOrder: 4,
  },
  {
    id: "ST-01",
    topicId: "curriculum_topic_f1_d1_sets",
    code: "ST-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise and list sets correctly",
    learningObjective: "Define sets and list members using correct notation.",
    sequenceOrder: 1,
  },
  {
    id: "ST-02",
    topicId: "curriculum_topic_f1_d1_sets",
    code: "ST-02",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify subsets and complements",
    learningObjective: "Determine subset and complement relationships correctly.",
    sequenceOrder: 2,
  },
  {
    id: "ST-03",
    topicId: "curriculum_topic_f1_d1_sets",
    code: "ST-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Read and draw simple Venn diagrams",
    learningObjective: "Represent basic set relationships in Venn diagrams accurately.",
    sequenceOrder: 3,
  },
  {
    id: "ST-04",
    topicId: "curriculum_topic_f1_d1_sets",
    code: "ST-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use set language in context",
    learningObjective: "Model simple classification situations using set notation and Venn diagrams.",
    sequenceOrder: 4,
  },
  {
    id: "DH-01",
    topicId: "curriculum_topic_f1_d2_data_handling",
    code: "DH-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Read tables and basic charts",
    learningObjective: "Extract simple information accurately from tables and data displays.",
    sequenceOrder: 1,
  },
  {
    id: "DH-02",
    topicId: "curriculum_topic_f1_d2_data_handling",
    code: "DH-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Organise data clearly",
    learningObjective: "Sort and organise simple data into usable tables or displays.",
    sequenceOrder: 2,
  },
  {
    id: "DH-03",
    topicId: "curriculum_topic_f1_d2_data_handling",
    code: "DH-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Interpret trends in data displays",
    learningObjective: "Describe basic patterns and comparisons from charts or tables.",
    sequenceOrder: 3,
  },
  {
    id: "DH-04",
    topicId: "curriculum_topic_f1_d2_data_handling",
    code: "DH-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use data to make simple conclusions",
    learningObjective: "Draw sensible conclusions from simple data sets and displays.",
    sequenceOrder: 4,
  },
];

const misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_f1_a1_rational_numbers",
    code: "sign-order-confusion",
    label: "Sign ordering confusion",
    description: "Student treats negative numbers as larger because the magnitude is larger.",
    remedialStrategy: "Use vertical number-line comparison and temperature-based examples.",
  },
  {
    topicId: "curriculum_topic_f1_a2_factors_and_multiples",
    code: "hcf-lcm-mismatch",
    label: "HCF and LCM mismatch",
    description: "Student can calculate factors but chooses the wrong operation in context.",
    remedialStrategy: "Contrast grouping vs scheduling tasks using HCF vs LCM sorting prompts.",
  },
  {
    topicId: "curriculum_topic_f1_a3_powers_and_roots",
    code: "root-value-confusion",
    label: "Root value confusion",
    description: "Student confuses square numbers with square roots or applies cube logic to square tasks.",
    remedialStrategy: "Use matching pairs of number, square, and root cards before symbolic drills.",
  },
  {
    topicId: "curriculum_topic_f1_a4_ratio_rate_proportion",
    code: "scale-break",
    label: "Equivalent ratio scaling break",
    description: "Student scales only one side of the ratio or uses additive logic instead of multiplicative logic.",
    remedialStrategy: "Use double-number line and bar model explanation before independent practice.",
  },
  {
    topicId: "curriculum_topic_f1_b1_algebraic_language",
    code: "symbol-role-confusion",
    label: "Variable-role confusion",
    description: "Student does not distinguish coefficient, variable, and constant roles.",
    remedialStrategy: "Rebuild with color-coded term decomposition and naming drills.",
  },
  {
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "sign-error",
    label: "Sign error after transposition",
    description: "Student changes signs incorrectly while isolating the variable.",
    remedialStrategy: "Use balance method and one-step undo moves before symbolic shortcuts.",
  },
  {
    topicId: "curriculum_topic_f1_b2_linear_equations",
    code: "word-translation-gap",
    label: "Word-problem translation gap",
    description: "Student can solve equations but fails to convert verbal situations into equations.",
    remedialStrategy: "Tutor or AI should break statements into variable sentence frames.",
  },
  {
    topicId: "curriculum_topic_f1_b3_linear_inequalities",
    code: "inequality-direction-confusion",
    label: "Inequality direction confusion",
    description: "Student solves the number operation but records the wrong inequality sign or wrong number-line direction.",
    remedialStrategy: "Pair each inequality with a number-line model and verbal comparison sentence.",
  },
  {
    topicId: "curriculum_topic_f1_c1_lines_and_angles",
    code: "angle-rule-mixing",
    label: "Angle rule mixing",
    description: "Student mixes up angle-at-a-point, straight-line, and vertically opposite angle rules.",
    remedialStrategy: "Use one rule family at a time with colour-coded diagram annotation.",
  },
  {
    topicId: "curriculum_topic_f1_c4_area",
    code: "formula-selection-error",
    label: "Area formula selection error",
    description: "Student applies the wrong shape formula or forgets required base-height pairing.",
    remedialStrategy: "Use shape-to-formula matching before moving into calculation practice.",
  },
  {
    topicId: "curriculum_topic_f1_c5_pythagoras",
    code: "hypotenuse-misread",
    label: "Hypotenuse misidentification",
    description: "Student applies the theorem using the wrong side as the hypotenuse.",
    remedialStrategy: "Rebuild using right-angle marker and visual side-labelling checks.",
  },
  {
    topicId: "curriculum_topic_f1_d1_sets",
    code: "subset-complement-confusion",
    label: "Subset and complement confusion",
    description: "Student can name set members but confuses what belongs inside, outside, or as part of a subset.",
    remedialStrategy: "Use physical sorting or simple Venn diagrams before symbolic notation.",
  },
  {
    topicId: "curriculum_topic_f1_d2_data_handling",
    code: "chart-reading-skip",
    label: "Chart reading skip",
    description: "Student reads isolated values but misses comparison or overall trend in the display.",
    remedialStrategy: "Prompt the student to state highest, lowest, and comparison before answering.",
  },
];

const masteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "RN-01", toNodeId: "RN-02" },
  { fromNodeId: "RN-02", toNodeId: "RN-03" },
  { fromNodeId: "RN-03", toNodeId: "RN-04" },
  { fromNodeId: "FM-01", toNodeId: "FM-02" },
  { fromNodeId: "FM-02", toNodeId: "FM-03" },
  { fromNodeId: "FM-03", toNodeId: "FM-04" },
  { fromNodeId: "PW-01", toNodeId: "PW-02" },
  { fromNodeId: "PW-02", toNodeId: "PW-03" },
  { fromNodeId: "PW-03", toNodeId: "PW-04" },
  { fromNodeId: "RP-01", toNodeId: "RP-02" },
  { fromNodeId: "RP-02", toNodeId: "RP-03" },
  { fromNodeId: "RP-03", toNodeId: "RP-04" },
  { fromNodeId: "AL-01", toNodeId: "AL-02" },
  { fromNodeId: "AL-02", toNodeId: "AL-03" },
  { fromNodeId: "AL-01", toNodeId: "LE-01" },
  { fromNodeId: "AL-02", toNodeId: "LE-02" },
  { fromNodeId: "LE-01", toNodeId: "LE-02" },
  { fromNodeId: "LE-02", toNodeId: "LE-03" },
  { fromNodeId: "LE-03", toNodeId: "LE-04" },
  { fromNodeId: "LE-03", toNodeId: "LE-05" },
  { fromNodeId: "LE-05", toNodeId: "LE-06" },
  { fromNodeId: "LE-06", toNodeId: "LE-07", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "LE-03", toNodeId: "LI-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "LI-01", toNodeId: "LI-02" },
  { fromNodeId: "LI-02", toNodeId: "LI-03" },
  { fromNodeId: "LI-03", toNodeId: "LI-04" },
  { fromNodeId: "LA-01", toNodeId: "LA-02" },
  { fromNodeId: "LA-02", toNodeId: "LA-03" },
  { fromNodeId: "LA-03", toNodeId: "LA-04" },
  { fromNodeId: "LA-01", toNodeId: "PG-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "PG-01", toNodeId: "PG-02" },
  { fromNodeId: "PG-02", toNodeId: "PG-03" },
  { fromNodeId: "PG-03", toNodeId: "PG-04" },
  { fromNodeId: "PE-01", toNodeId: "PE-02" },
  { fromNodeId: "PE-02", toNodeId: "PE-03" },
  { fromNodeId: "PE-02", toNodeId: "AR-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "AR-01", toNodeId: "AR-02" },
  { fromNodeId: "AR-02", toNodeId: "AR-03" },
  { fromNodeId: "AR-03", toNodeId: "AR-04" },
  { fromNodeId: "AR-04", toNodeId: "AR-05", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "PY-01", toNodeId: "PY-02" },
  { fromNodeId: "PY-02", toNodeId: "PY-03" },
  { fromNodeId: "PY-03", toNodeId: "PY-04" },
  { fromNodeId: "ST-01", toNodeId: "ST-02" },
  { fromNodeId: "ST-02", toNodeId: "ST-03" },
  { fromNodeId: "ST-03", toNodeId: "ST-04" },
  { fromNodeId: "DH-01", toNodeId: "DH-02" },
  { fromNodeId: "DH-02", toNodeId: "DH-03" },
  { fromNodeId: "DH-03", toNodeId: "DH-04" },
];

const curriculumLevels: LevelSeed[] = [
  {
    id: curriculumIds.levelForm1,
    code: "FORM-1",
    formLabel: "Form 1",
    ageBand: "13 years",
    track: "Lower Secondary",
    examStage: "Lower secondary foundation",
    curriculumFramework: "KSSM",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.levelForm2,
    code: "FORM-2",
    formLabel: "Form 2",
    ageBand: "14 years",
    track: "Lower Secondary",
    examStage: "Lower secondary consolidation",
    curriculumFramework: "KSSM",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.levelForm3,
    code: "FORM-3",
    formLabel: "Form 3",
    ageBand: "15 years",
    track: "Lower Secondary",
    examStage: "Lower secondary transition",
    curriculumFramework: "KSSM",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.levelForm4,
    code: "FORM-4",
    formLabel: "Form 4",
    ageBand: "16 years",
    track: "Upper Secondary",
    examStage: "Upper secondary expansion",
    curriculumFramework: "KSSM",
    sequenceOrder: 4,
  },
  {
    id: curriculumIds.levelForm5,
    code: "FORM-5",
    formLabel: "Form 5",
    ageBand: "17 years",
    track: "Upper Secondary",
    examStage: "SPM preparation",
    curriculumFramework: "KSSM",
    sequenceOrder: 5,
  },
];

const englishForm1Level: LevelSeed = {
  id: curriculumIds.levelEnglishForm1,
  code: "FORM-1",
  formLabel: "Form 1",
  ageBand: "13 years",
  track: "Lower Secondary",
  examStage: "Lower secondary English foundation",
  curriculumFramework: "KSSM",
  sequenceOrder: 1,
};

const englishForm2Level: LevelSeed = {
  id: curriculumIds.levelEnglishForm2,
  code: "FORM-2",
  formLabel: "Form 2",
  ageBand: "14 years",
  track: "Lower Secondary",
  examStage: "Lower secondary English consolidation",
  curriculumFramework: "KSSM",
  sequenceOrder: 2,
};

const englishForm3Level: LevelSeed = {
  id: curriculumIds.levelEnglishForm3,
  code: "FORM-3",
  formLabel: "Form 3",
  ageBand: "15 years",
  track: "Lower Secondary",
  examStage: "Lower secondary English transition",
  curriculumFramework: "KSSM",
  sequenceOrder: 3,
};

const englishForm4Level: LevelSeed = {
  id: curriculumIds.levelEnglishForm4,
  code: "FORM-4",
  formLabel: "Form 4",
  ageBand: "16 years",
  track: "Upper Secondary",
  examStage: "Upper secondary English expansion",
  curriculumFramework: "KSSM",
  sequenceOrder: 4,
};

const englishForm5Level: LevelSeed = {
  id: curriculumIds.levelEnglishForm5,
  code: "FORM-5",
  formLabel: "Form 5",
  ageBand: "16-17",
  track: "Upper Secondary",
  examStage: "SPM Preparation",
  curriculumFramework: "KSSM",
  sequenceOrder: 5,
};

const englishForm1Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainEnglishForm1Reading,
    code: "A",
    name: "Reading Comprehension",
    description:
      "Understanding explicit meaning, inference, references, and evidence in age-appropriate texts.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainEnglishForm1Grammar,
    code: "B",
    name: "Grammar and Usage",
    description:
      "Sentence control, tense accuracy, parts of speech, and functional grammar in context.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainEnglishForm1Vocabulary,
    code: "C",
    name: "Vocabulary and Language Awareness",
    description:
      "Building meaning through context clues, word relationships, and careful word choice.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainEnglishForm1Writing,
    code: "D",
    name: "Writing Foundations",
    description:
      "Moving from sentence building to coherent paragraphs and guided functional writing.",
    sequenceOrder: 4,
  },
];

const englishForm2Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainEnglishForm2Reading,
    code: "A",
    name: "Reading and Interpretation",
    description:
      "Move beyond literal reading into viewpoint, structure, sequencing, and supported interpretation.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainEnglishForm2Grammar,
    code: "B",
    name: "Grammar and Sentence Control",
    description:
      "Strengthen tense consistency, functional grammar, clauses, and sentence variety in context.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainEnglishForm2Vocabulary,
    code: "C",
    name: "Vocabulary and Meaning Precision",
    description:
      "Build richer expression through contextual vocabulary, word formation, and more precise lexical choice.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainEnglishForm2Writing,
    code: "D",
    name: "Paragraph and Guided Writing",
    description:
      "Develop stronger paragraph control, organisation, and fit-for-purpose guided writing.",
    sequenceOrder: 4,
  },
];

const englishForm3Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainEnglishForm3Reading,
    code: "A",
    name: "Reading and Analytical Response",
    description:
      "Strengthen evidence-based reading through purpose, attitude, summary, and text structure analysis.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainEnglishForm3Grammar,
    code: "B",
    name: "Grammar, Editing and Expression Control",
    description:
      "Develop stronger control over sentence accuracy, editing, reported meaning, and connected expression.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainEnglishForm3Vocabulary,
    code: "C",
    name: "Vocabulary, Register and Meaning",
    description:
      "Improve precision through figurative meaning, register awareness, and nuanced vocabulary choices.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainEnglishForm3Writing,
    code: "D",
    name: "Extended and Functional Writing",
    description:
      "Move from paragraph coherence into structured multi-paragraph and task-fit writing.",
    sequenceOrder: 4,
  },
];

const englishForm4Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainEnglishForm4Reading,
    code: "A",
    name: "Reading and Critical Response",
    description:
      "Develop critical reading through synthesis, viewpoint analysis, and stronger comparison across texts.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainEnglishForm4Grammar,
    code: "B",
    name: "Grammar and Expression for Upper Secondary",
    description:
      "Strengthen editing, sentence transformation, and controlled language use in upper secondary tasks.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainEnglishForm4Vocabulary,
    code: "C",
    name: "Vocabulary, Style and Interpretation",
    description:
      "Improve connotation, figurative interpretation, register control, and precision in response writing.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainEnglishForm4Writing,
    code: "D",
    name: "Extended and Exam-Oriented Writing",
    description:
      "Move into structured essays, longer responses, and stronger task-fit functional writing.",
    sequenceOrder: 4,
  },
];

const englishForm5Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainEnglishForm5Reading,
    code: "A",
    name: "Reading, Interpretation and Evaluation",
    description: "Synthesis, evaluation, and stronger interpretive control for SPM-level reading demands.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainEnglishForm5Grammar,
    code: "B",
    name: "Grammar, Accuracy and Reformulation",
    description: "Advanced editing, reformulation, and paragraph control under exam-style constraints.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainEnglishForm5Vocabulary,
    code: "C",
    name: "Vocabulary, Register and Writer Effect",
    description: "Nuance, register, and stylistic precision for interpretation and stronger written expression.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainEnglishForm5Writing,
    code: "D",
    name: "Extended Writing and Exam Response",
    description: "Discursive writing, functional responses, and exam-task control for upper secondary performance.",
    sequenceOrder: 4,
  },
];

const englishForm1Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_eng_f1_a1_main_ideas_and_explicit_information",
    domainId: curriculumIds.domainEnglishForm1Reading,
    code: "A1",
    name: "Main Ideas and Explicit Information",
    summary:
      "Identify the main idea, supporting details, and clearly stated information in short texts.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f1_a2_inference_and_supporting_evidence",
    domainId: curriculumIds.domainEnglishForm1Reading,
    code: "A2",
    name: "Inference and Supporting Evidence",
    summary:
      "Make simple inferences and justify them using clues from the text.",
    prerequisiteSummary: "Main ideas and explicit information.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f1_a3_reference_and_context_clues",
    domainId: curriculumIds.domainEnglishForm1Reading,
    code: "A3",
    name: "Reference and Context Clues",
    summary:
      "Use pronoun reference and nearby clues to understand meaning in context.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 90,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_eng_f1_b1_parts_of_speech_and_sentence_roles",
    domainId: curriculumIds.domainEnglishForm1Grammar,
    code: "B1",
    name: "Parts of Speech and Sentence Roles",
    summary:
      "Recognise common parts of speech and how they function inside sentences.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 90,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_eng_f1_b2_tenses_and_subject_verb_agreement",
    domainId: curriculumIds.domainEnglishForm1Grammar,
    code: "B2",
    name: "Tenses and Subject-Verb Agreement",
    summary:
      "Use simple present, past, and future tenses with accurate subject-verb agreement.",
    prerequisiteSummary: "Parts of speech and sentence roles.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f1_b3_sentence_construction_and_transformation",
    domainId: curriculumIds.domainEnglishForm1Grammar,
    code: "B3",
    name: "Sentence Construction and Transformation",
    summary:
      "Build complete sentences and improve them through expansion, correction, and transformation.",
    prerequisiteSummary: "Basic tense and agreement control.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f1_c1_vocabulary_in_context",
    domainId: curriculumIds.domainEnglishForm1Vocabulary,
    code: "C1",
    name: "Vocabulary in Context",
    summary:
      "Understand and apply word meaning using context clues from familiar texts.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f1_c2_word_choice_and_relationships",
    domainId: curriculumIds.domainEnglishForm1Vocabulary,
    code: "C2",
    name: "Word Choice and Relationships",
    summary:
      "Choose precise words and recognise simple synonym, antonym, and collocation relationships.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f1_d1_sentence_to_paragraph_writing",
    domainId: curriculumIds.domainEnglishForm1Writing,
    code: "D1",
    name: "Sentence to Paragraph Writing",
    summary:
      "Develop linked sentences into short, coherent paragraphs with a clear focus.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f1_d2_guided_and_functional_writing",
    domainId: curriculumIds.domainEnglishForm1Writing,
    code: "D2",
    name: "Guided and Functional Writing",
    summary:
      "Produce short guided responses, messages, and practical writing tasks with suitable structure.",
    prerequisiteSummary: "Sentence to paragraph writing.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 4,
  },
];

const englishForm2Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_eng_f2_a1_compare_main_ideas_and_supporting_details",
    domainId: curriculumIds.domainEnglishForm2Reading,
    code: "A1",
    name: "Compare Main Ideas and Supporting Details",
    summary:
      "Compare key ideas and supporting information across short related texts.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f2_a2_inference_tone_and_point_of_view",
    domainId: curriculumIds.domainEnglishForm2Reading,
    code: "A2",
    name: "Inference, Tone and Point of View",
    summary:
      "Infer meaning, tone, and speaker or writer attitude using textual clues.",
    prerequisiteSummary: "Literal comprehension and simple inference.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f2_a3_reference_sequence_and_text_organisation",
    domainId: curriculumIds.domainEnglishForm2Reading,
    code: "A3",
    name: "Reference, Sequence and Text Organisation",
    summary:
      "Track reference, sequence events, and read how short texts are organised.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_eng_f2_b1_tense_consistency_and_sentence_control",
    domainId: curriculumIds.domainEnglishForm2Grammar,
    code: "B1",
    name: "Tense Consistency and Sentence Control",
    summary:
      "Maintain accurate tense use and stronger control across linked sentences.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f2_b2_modals_questions_and_functional_grammar",
    domainId: curriculumIds.domainEnglishForm2Grammar,
    code: "B2",
    name: "Modals, Questions and Functional Grammar",
    summary:
      "Use modals, question forms, and practical sentence functions more accurately.",
    prerequisiteSummary: "Basic sentence roles and tense control.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f2_b3_clauses_connectors_and_sentence_variety",
    domainId: curriculumIds.domainEnglishForm2Grammar,
    code: "B3",
    name: "Clauses, Connectors and Sentence Variety",
    summary:
      "Expand sentence control using clauses, connectors, and varied sentence patterns.",
    prerequisiteSummary: "Sentence construction and transformation.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f2_c1_vocabulary_precision_in_context",
    domainId: curriculumIds.domainEnglishForm2Vocabulary,
    code: "C1",
    name: "Vocabulary Precision in Context",
    summary:
      "Use context not just to understand words, but to choose the most precise meaning.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f2_c2_word_formation_and_lexical_relationships",
    domainId: curriculumIds.domainEnglishForm2Vocabulary,
    code: "C2",
    name: "Word Formation and Lexical Relationships",
    summary:
      "Work with prefixes, suffixes, word families, and richer lexical relationships.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f2_d1_paragraph_development_and_coherence",
    domainId: curriculumIds.domainEnglishForm2Writing,
    code: "D1",
    name: "Paragraph Development and Coherence",
    summary:
      "Develop paragraphs with clearer support, sequence, and coherence.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f2_d2_guided_short_responses_and_functional_writing",
    domainId: curriculumIds.domainEnglishForm2Writing,
    code: "D2",
    name: "Guided Short Responses and Functional Writing",
    summary:
      "Produce more complete guided responses and practical writing tasks for purpose and audience.",
    prerequisiteSummary: "Paragraph development and coherence.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
];

const englishForm3Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_eng_f3_a1_evidence_based_comprehension",
    domainId: curriculumIds.domainEnglishForm3Reading,
    code: "A1",
    name: "Evidence-Based Comprehension",
    summary:
      "Use direct evidence more carefully to justify reading answers across short and medium texts.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f3_a2_attitude_purpose_and_message",
    domainId: curriculumIds.domainEnglishForm3Reading,
    code: "A2",
    name: "Attitude, Purpose and Message",
    summary:
      "Infer writer attitude, communicative purpose, and overall message with clearer justification.",
    prerequisiteSummary: "Inference, tone and point of view.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f3_a3_summary_sequence_and_text_structure",
    domainId: curriculumIds.domainEnglishForm3Reading,
    code: "A3",
    name: "Summary, Sequence and Text Structure",
    summary:
      "Track structure, sequence, and key information to summarise texts more accurately.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f3_b1_sentence_accuracy_and_error_correction",
    domainId: curriculumIds.domainEnglishForm3Grammar,
    code: "B1",
    name: "Sentence Accuracy and Error Correction",
    summary:
      "Improve editing accuracy by recognising and correcting high-frequency sentence errors.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f3_b2_reported_meaning_and_question_forms",
    domainId: curriculumIds.domainEnglishForm3Grammar,
    code: "B2",
    name: "Reported Meaning and Question Forms",
    summary:
      "Handle meaning shifts across reporting, questioning, and practical communication forms.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f3_b3_clause_control_and_editing_for_flow",
    domainId: curriculumIds.domainEnglishForm3Grammar,
    code: "B3",
    name: "Clause Control and Editing for Flow",
    summary:
      "Use clauses and editing moves to improve clarity, flow, and sentence rhythm in writing.",
    prerequisiteSummary: "Sentence accuracy and connector control.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f3_c1_figurative_and_implied_meaning",
    domainId: curriculumIds.domainEnglishForm3Vocabulary,
    code: "C1",
    name: "Figurative and Implied Meaning",
    summary:
      "Interpret less literal meaning, connotation, and implied vocabulary choices in context.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f3_c2_register_word_form_and_precision",
    domainId: curriculumIds.domainEnglishForm3Vocabulary,
    code: "C2",
    name: "Register, Word Form and Precision",
    summary:
      "Choose words that fit audience, tone, and text type while controlling word form accurately.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f3_d1_multi_paragraph_response_writing",
    domainId: curriculumIds.domainEnglishForm3Writing,
    code: "D1",
    name: "Multi-Paragraph Response Writing",
    summary:
      "Develop organised multi-paragraph responses with clearer support, structure, and progression.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f3_d2_guided_extended_and_functional_writing",
    domainId: curriculumIds.domainEnglishForm3Writing,
    code: "D2",
    name: "Guided Extended and Functional Writing",
    summary:
      "Produce stronger guided and functional writing with better content fit, organisation, and purpose.",
    prerequisiteSummary: "Multi-paragraph response writing.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
];

const englishForm4Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_eng_f4_a1_evidence_synthesis_and_comparison",
    domainId: curriculumIds.domainEnglishForm4Reading,
    code: "A1",
    name: "Evidence Synthesis and Comparison",
    summary:
      "Compare and combine evidence from related texts to build stronger reading responses.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f4_a2_viewpoint_tone_and_writer_craft",
    domainId: curriculumIds.domainEnglishForm4Reading,
    code: "A2",
    name: "Viewpoint, Tone and Writer Craft",
    summary:
      "Analyse tone, viewpoint, and how language choices shape reader response.",
    prerequisiteSummary: "Attitude, purpose, and message.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f4_a3_summary_evaluation_and_text_links",
    domainId: curriculumIds.domainEnglishForm4Reading,
    code: "A3",
    name: "Summary, Evaluation and Text Links",
    summary:
      "Summarise accurately, judge key ideas, and explain links between text parts or paired texts.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f4_b1_editing_for_accuracy_and_style",
    domainId: curriculumIds.domainEnglishForm4Grammar,
    code: "B1",
    name: "Editing for Accuracy and Style",
    summary:
      "Improve both correctness and style when revising sentences and short passages.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f4_b2_sentence_transformation_and_reformulation",
    domainId: curriculumIds.domainEnglishForm4Grammar,
    code: "B2",
    name: "Sentence Transformation and Reformulation",
    summary:
      "Transform and reformulate meaning without losing accuracy or communication purpose.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f4_b3_argument_language_and_cohesive_control",
    domainId: curriculumIds.domainEnglishForm4Grammar,
    code: "B3",
    name: "Argument Language and Cohesive Control",
    summary:
      "Use cohesive devices and argument language to create clearer logical flow in writing.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f4_c1_connotation_and_figurative_effect",
    domainId: curriculumIds.domainEnglishForm4Vocabulary,
    code: "C1",
    name: "Connotation and Figurative Effect",
    summary:
      "Interpret connotation and figurative language more precisely in reading and response tasks.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f4_c2_register_audience_and_precision",
    domainId: curriculumIds.domainEnglishForm4Vocabulary,
    code: "C2",
    name: "Register, Audience and Precision",
    summary:
      "Choose language that fits tone, audience, formality, and intended communication effect.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f4_d1_extended_response_and_essay_structure",
    domainId: curriculumIds.domainEnglishForm4Writing,
    code: "D1",
    name: "Extended Response and Essay Structure",
    summary:
      "Plan and write longer responses with a clear essay structure, support, and progression.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 150,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f4_d2_exam_task_and_functional_writing",
    domainId: curriculumIds.domainEnglishForm4Writing,
    code: "D2",
    name: "Exam Task and Functional Writing",
    summary:
      "Produce stronger exam-style guided and functional writing with clearer task control.",
    prerequisiteSummary: "Extended response and essay structure.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 150,
    estimatedRevisionCycles: 4,
  },
];

const englishForm5Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_eng_f5_a1_synthesis_evaluation_and_cross_text_comparison",
    domainId: curriculumIds.domainEnglishForm5Reading,
    code: "A1",
    name: "Synthesis, Evaluation and Cross-Text Comparison",
    summary: "Compare multiple texts, combine evidence, and evaluate ideas with stronger critical control.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f5_a2_tone_perspective_and_writer_intention",
    domainId: curriculumIds.domainEnglishForm5Reading,
    code: "A2",
    name: "Tone, Perspective and Writer Intention",
    summary: "Analyse tone, perspective, and intended effect with clearer justification.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f5_a3_summary_precision_and_critical_response",
    domainId: curriculumIds.domainEnglishForm5Reading,
    code: "A3",
    name: "Summary Precision and Critical Response",
    summary: "Write precise summaries and move into concise, evidence-based critical response.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f5_b1_advanced_editing_for_accuracy_and_clarity",
    domainId: curriculumIds.domainEnglishForm5Grammar,
    code: "B1",
    name: "Advanced Editing for Accuracy and Clarity",
    summary: "Edit for grammar, clarity, and sentence effectiveness under upper secondary expectations.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f5_b2_transformation_reformulation_and_meaning_control",
    domainId: curriculumIds.domainEnglishForm5Grammar,
    code: "B2",
    name: "Transformation, Reformulation and Meaning Control",
    summary: "Transform and reformulate accurately while preserving nuance and intention.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f5_b3_cohesion_argument_and_paragraph_control",
    domainId: curriculumIds.domainEnglishForm5Grammar,
    code: "B3",
    name: "Cohesion, Argument and Paragraph Control",
    summary: "Build stronger logical flow, paragraph development, and argument control in extended responses.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_eng_f5_c1_nuance_connotation_and_figurative_interpretation",
    domainId: curriculumIds.domainEnglishForm5Vocabulary,
    code: "C1",
    name: "Nuance, Connotation and Figurative Interpretation",
    summary: "Interpret implied meaning, connotation, and figurative language with more precision.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_eng_f5_c2_register_voice_and_audience_awareness",
    domainId: curriculumIds.domainEnglishForm5Vocabulary,
    code: "C2",
    name: "Register, Voice and Audience Awareness",
    summary: "Control tone, voice, and vocabulary choices for different audiences and purposes.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_eng_f5_d1_discursive_and_extended_essay_writing",
    domainId: curriculumIds.domainEnglishForm5Writing,
    code: "D1",
    name: "Discursive and Extended Essay Writing",
    summary: "Plan and produce stronger discursive and extended essays with clearer reasoning and support.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 150,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_eng_f5_d2_directed_functional_and_exam_task_writing",
    domainId: curriculumIds.domainEnglishForm5Writing,
    code: "D2",
    name: "Directed, Functional and Exam Task Writing",
    summary: "Produce task-fit functional and guided exam responses with better precision and control.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
];

const englishForm5MasteryNodes: MasteryNodeSeed[] = [
  { id: "E5R1-01", topicId: "curriculum_topic_eng_f5_a1_synthesis_evaluation_and_cross_text_comparison", code: "E5R1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise key claims across more than one text", learningObjective: "Identify shared and contrasting claims, evidence, and emphasis across related texts.", sequenceOrder: 1 },
  { id: "E5R1-02", topicId: "curriculum_topic_eng_f5_a1_synthesis_evaluation_and_cross_text_comparison", code: "E5R1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Combine evidence across texts accurately", learningObjective: "Select and combine evidence from multiple texts without distorting meaning.", sequenceOrder: 2 },
  { id: "E5R1-03", topicId: "curriculum_topic_eng_f5_a1_synthesis_evaluation_and_cross_text_comparison", code: "E5R1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare and evaluate how ideas are presented", learningObjective: "Explain differences in focus, method, or strength of support across texts.", sequenceOrder: 3 },
  { id: "E5R1-04", topicId: "curriculum_topic_eng_f5_a1_synthesis_evaluation_and_cross_text_comparison", code: "E5R1-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a critical cross-text comparison", learningObjective: "Produce a concise comparison that synthesises evidence and offers justified evaluation.", sequenceOrder: 4 },

  { id: "E5R2-01", topicId: "curriculum_topic_eng_f5_a2_tone_perspective_and_writer_intention", code: "E5R2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise tone, stance, and intention signals", learningObjective: "Spot language and structural signals that reveal tone, stance, and intended effect.", sequenceOrder: 1 },
  { id: "E5R2-02", topicId: "curriculum_topic_eng_f5_a2_tone_perspective_and_writer_intention", code: "E5R2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Infer perspective and intention with evidence", learningObjective: "Infer writer perspective and intention using textual evidence rather than impression only.", sequenceOrder: 2 },
  { id: "E5R2-03", topicId: "curriculum_topic_eng_f5_a2_tone_perspective_and_writer_intention", code: "E5R2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Explain how tone shapes reader response", learningObjective: "Explain how tone and perspective influence meaning and likely reader reaction.", sequenceOrder: 3 },
  { id: "E5R2-04", topicId: "curriculum_topic_eng_f5_a2_tone_perspective_and_writer_intention", code: "E5R2-04", nodeType: MasteryNodeType.APPLICATION, title: "Evaluate tone and intention in response writing", learningObjective: "Write a focused response that evaluates tone, perspective, and writer intention together.", sequenceOrder: 4 },

  { id: "E5R3-01", topicId: "curriculum_topic_eng_f5_a3_summary_precision_and_critical_response", code: "E5R3-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise summary-worthy ideas and response-worthy points", learningObjective: "Differentiate between key ideas to summarise and ideas to respond to critically.", sequenceOrder: 1 },
  { id: "E5R3-02", topicId: "curriculum_topic_eng_f5_a3_summary_precision_and_critical_response", code: "E5R3-02", nodeType: MasteryNodeType.PROCEDURE, title: "Write concise and accurate summaries", learningObjective: "Produce concise summaries that preserve meaning and exclude unnecessary commentary.", sequenceOrder: 2 },
  { id: "E5R3-03", topicId: "curriculum_topic_eng_f5_a3_summary_precision_and_critical_response", code: "E5R3-03", nodeType: MasteryNodeType.PROCEDURE, title: "Build a short critical response from summary evidence", learningObjective: "Move from summary into a clear, evidence-based critical response.", sequenceOrder: 3 },
  { id: "E5R3-04", topicId: "curriculum_topic_eng_f5_a3_summary_precision_and_critical_response", code: "E5R3-04", nodeType: MasteryNodeType.APPLICATION, title: "Produce summary-plus-response writing with control", learningObjective: "Write a compact summary and critical reaction that stays distinct and purposeful.", sequenceOrder: 4 },

  { id: "E5G1-01", topicId: "curriculum_topic_eng_f5_b1_advanced_editing_for_accuracy_and_clarity", code: "E5G1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise advanced sentence and paragraph errors", learningObjective: "Detect grammar, clarity, agreement, punctuation, and awkwardness issues in upper-secondary writing.", sequenceOrder: 1 },
  { id: "E5G1-02", topicId: "curriculum_topic_eng_f5_b1_advanced_editing_for_accuracy_and_clarity", code: "E5G1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Correct errors without changing intended meaning", learningObjective: "Edit sentences and short passages for accuracy while preserving the writer’s meaning.", sequenceOrder: 2 },
  { id: "E5G1-03", topicId: "curriculum_topic_eng_f5_b1_advanced_editing_for_accuracy_and_clarity", code: "E5G1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Improve clarity and style in editing", learningObjective: "Revise writing to improve precision, readability, and style rather than grammar alone.", sequenceOrder: 3 },
  { id: "E5G1-04", topicId: "curriculum_topic_eng_f5_b1_advanced_editing_for_accuracy_and_clarity", code: "E5G1-04", nodeType: MasteryNodeType.APPLICATION, title: "Edit a passage under task pressure", learningObjective: "Apply layered editing choices to improve a whole passage under exam-style conditions.", sequenceOrder: 4 },

  { id: "E5G2-01", topicId: "curriculum_topic_eng_f5_b2_transformation_reformulation_and_meaning_control", code: "E5G2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise meaning-preserving transformation targets", learningObjective: "Identify what must stay constant when reformulating sentences or short responses.", sequenceOrder: 1 },
  { id: "E5G2-02", topicId: "curriculum_topic_eng_f5_b2_transformation_reformulation_and_meaning_control", code: "E5G2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Transform structure while keeping meaning", learningObjective: "Perform sentence transformations accurately without losing key meaning relationships.", sequenceOrder: 2 },
  { id: "E5G2-03", topicId: "curriculum_topic_eng_f5_b2_transformation_reformulation_and_meaning_control", code: "E5G2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Reformulate for tone, emphasis, or task fit", learningObjective: "Adjust wording and structure to suit a new tone, emphasis, or task demand.", sequenceOrder: 3 },
  { id: "E5G2-04", topicId: "curriculum_topic_eng_f5_b2_transformation_reformulation_and_meaning_control", code: "E5G2-04", nodeType: MasteryNodeType.APPLICATION, title: "Use reformulation in exam-style response tasks", learningObjective: "Apply transformation and reformulation skills in guided tasks with precision and control.", sequenceOrder: 4 },

  { id: "E5G3-01", topicId: "curriculum_topic_eng_f5_b3_cohesion_argument_and_paragraph_control", code: "E5G3-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise cohesion and argument structure signals", learningObjective: "Identify linking, reference, claim, support, and contrast signals in extended writing.", sequenceOrder: 1 },
  { id: "E5G3-02", topicId: "curriculum_topic_eng_f5_b3_cohesion_argument_and_paragraph_control", code: "E5G3-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use cohesive devices with purpose", learningObjective: "Use connectors and reference devices to improve flow and logical sequencing.", sequenceOrder: 2 },
  { id: "E5G3-03", topicId: "curriculum_topic_eng_f5_b3_cohesion_argument_and_paragraph_control", code: "E5G3-03", nodeType: MasteryNodeType.PROCEDURE, title: "Build controlled argument paragraphs", learningObjective: "Write paragraphs with clear claim-support-development structure.", sequenceOrder: 3 },
  { id: "E5G3-04", topicId: "curriculum_topic_eng_f5_b3_cohesion_argument_and_paragraph_control", code: "E5G3-04", nodeType: MasteryNodeType.APPLICATION, title: "Sustain argument flow across a longer response", learningObjective: "Maintain cohesion and argument control across multiple paragraphs in extended writing.", sequenceOrder: 4 },

  { id: "E5V1-01", topicId: "curriculum_topic_eng_f5_c1_nuance_connotation_and_figurative_interpretation", code: "E5V1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise nuanced and figurative meaning", learningObjective: "Identify connotation, implication, and figurative meaning in upper-secondary texts.", sequenceOrder: 1 },
  { id: "E5V1-02", topicId: "curriculum_topic_eng_f5_c1_nuance_connotation_and_figurative_interpretation", code: "E5V1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Explain figurative effect precisely", learningObjective: "Explain how figurative or nuanced language shapes tone, emphasis, or idea.", sequenceOrder: 2 },
  { id: "E5V1-03", topicId: "curriculum_topic_eng_f5_c1_nuance_connotation_and_figurative_interpretation", code: "E5V1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare possible shades of meaning", learningObjective: "Distinguish between close word choices and justify the stronger interpretation.", sequenceOrder: 3 },
  { id: "E5V1-04", topicId: "curriculum_topic_eng_f5_c1_nuance_connotation_and_figurative_interpretation", code: "E5V1-04", nodeType: MasteryNodeType.APPLICATION, title: "Interpret nuanced language in analysis writing", learningObjective: "Use nuanced meaning analysis in a clear written interpretation.", sequenceOrder: 4 },

  { id: "E5V2-01", topicId: "curriculum_topic_eng_f5_c2_register_voice_and_audience_awareness", code: "E5V2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise shifts in register and voice", learningObjective: "Identify when vocabulary, tone, and phrasing fit or misfit audience and purpose.", sequenceOrder: 1 },
  { id: "E5V2-02", topicId: "curriculum_topic_eng_f5_c2_register_voice_and_audience_awareness", code: "E5V2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Select words for audience and purpose", learningObjective: "Choose wording that fits formality, task, and intended reader response.", sequenceOrder: 2 },
  { id: "E5V2-03", topicId: "curriculum_topic_eng_f5_c2_register_voice_and_audience_awareness", code: "E5V2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Sustain an appropriate voice in short writing", learningObjective: "Maintain a suitable voice and register across a coherent short response.", sequenceOrder: 3 },
  { id: "E5V2-04", topicId: "curriculum_topic_eng_f5_c2_register_voice_and_audience_awareness", code: "E5V2-04", nodeType: MasteryNodeType.APPLICATION, title: "Adjust register deliberately across tasks", learningObjective: "Adapt voice and register deliberately across exam-style writing situations.", sequenceOrder: 4 },

  { id: "E5W1-01", topicId: "curriculum_topic_eng_f5_d1_discursive_and_extended_essay_writing", code: "E5W1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise strong discursive essay structure", learningObjective: "Identify thesis, line of reasoning, and support patterns in extended essays.", sequenceOrder: 1 },
  { id: "E5W1-02", topicId: "curriculum_topic_eng_f5_d1_discursive_and_extended_essay_writing", code: "E5W1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plan an extended essay with clear reasoning", learningObjective: "Plan a discursive essay with purposeful structure, sequence, and support.", sequenceOrder: 2 },
  { id: "E5W1-03", topicId: "curriculum_topic_eng_f5_d1_discursive_and_extended_essay_writing", code: "E5W1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Develop and connect essay paragraphs", learningObjective: "Develop and link paragraphs so that reasoning progresses clearly across the essay.", sequenceOrder: 3 },
  { id: "E5W1-04", topicId: "curriculum_topic_eng_f5_d1_discursive_and_extended_essay_writing", code: "E5W1-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a sustained extended essay", learningObjective: "Produce an extended essay that sustains argument, support, and control across the full response.", sequenceOrder: 4 },

  { id: "E5W2-01", topicId: "curriculum_topic_eng_f5_d2_directed_functional_and_exam_task_writing", code: "E5W2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise exam task demands and functional format", learningObjective: "Identify audience, format, content points, and success criteria in functional tasks.", sequenceOrder: 1 },
  { id: "E5W2-02", topicId: "curriculum_topic_eng_f5_d2_directed_functional_and_exam_task_writing", code: "E5W2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plan and sequence directed responses", learningObjective: "Plan content and structure so that all required points are covered clearly.", sequenceOrder: 2 },
  { id: "E5W2-03", topicId: "curriculum_topic_eng_f5_d2_directed_functional_and_exam_task_writing", code: "E5W2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Write precise task-fit functional responses", learningObjective: "Write functional or directed responses that fit task, audience, and tone.", sequenceOrder: 3 },
  { id: "E5W2-04", topicId: "curriculum_topic_eng_f5_d2_directed_functional_and_exam_task_writing", code: "E5W2-04", nodeType: MasteryNodeType.APPLICATION, title: "Deliver complete exam-style writing under constraints", learningObjective: "Produce a complete, controlled task response under exam-style expectations.", sequenceOrder: 4 },
];

const englishForm5Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_eng_f5_a1_synthesis_evaluation_and_cross_text_comparison",
    code: "multi-text-summary-no-judgement",
    label: "Multi-text summary without judgement",
    description: "Student combines ideas from more than one text but never evaluates strength, bias, or usefulness.",
    remedialStrategy: "Force one evaluation sentence after each comparison point before drafting a full response.",
  },
  {
    topicId: "curriculum_topic_eng_f5_a2_tone_perspective_and_writer_intention",
    code: "tone-label-without-proof",
    label: "Tone label without proof",
    description: "Student names a tone or intention but does not support it with actual language evidence.",
    remedialStrategy: "Use quote-evidence-explanation frames before allowing abstract labels alone.",
  },
  {
    topicId: "curriculum_topic_eng_f5_a3_summary_precision_and_critical_response",
    code: "summary-and-opinion-collision",
    label: "Summary and opinion collision",
    description: "Student mixes summary and reaction together, so neither is controlled or clearly separated.",
    remedialStrategy: "Separate summary lines from response lines using colour-coded planning.",
  },
  {
    topicId: "curriculum_topic_eng_f5_b1_advanced_editing_for_accuracy_and_clarity",
    code: "grammar-fixed-clarity-ignored",
    label: "Grammar fixed but clarity ignored",
    description: "Student corrects grammar but leaves awkward or unclear phrasing untouched.",
    remedialStrategy: "Require one clarity upgrade after every grammar correction in editing drills.",
  },
  {
    topicId: "curriculum_topic_eng_f5_b2_transformation_reformulation_and_meaning_control",
    code: "reformulation-loses-nuance",
    label: "Reformulation loses nuance",
    description: "Student changes sentence structure correctly but loses emphasis, tone, or exact meaning.",
    remedialStrategy: "Compare original and transformed meanings explicitly before marking as complete.",
  },
  {
    topicId: "curriculum_topic_eng_f5_b3_cohesion_argument_and_paragraph_control",
    code: "connectors-mask-weak-logic",
    label: "Connectors masking weak logic",
    description: "Student uses many cohesive markers, but the argument chain is still weak or repetitive.",
    remedialStrategy: "Check claim-evidence-explanation structure before connector polishing.",
  },
  {
    topicId: "curriculum_topic_eng_f5_c1_nuance_connotation_and_figurative_interpretation",
    code: "figurative-answer-too-literal",
    label: "Figurative answer too literal",
    description: "Student explains figurative language at surface level and misses deeper implied effect.",
    remedialStrategy: "Ask for both literal meaning and implied effect in a fixed two-part response.",
  },
  {
    topicId: "curriculum_topic_eng_f5_c2_register_voice_and_audience_awareness",
    code: "voice-does-not-fit-task",
    label: "Voice does not fit task",
    description: "Student uses understandable English, but the voice, tone, or audience fit is wrong.",
    remedialStrategy: "Compare three audience versions of the same message before writing independently.",
  },
  {
    topicId: "curriculum_topic_eng_f5_d1_discursive_and_extended_essay_writing",
    code: "essay-has-points-no-line",
    label: "Essay has points but no line of reasoning",
    description: "Student includes valid ideas but the essay does not progress as a connected argument.",
    remedialStrategy: "Plan thesis and paragraph roles before full drafting.",
  },
  {
    topicId: "curriculum_topic_eng_f5_d2_directed_functional_and_exam_task_writing",
    code: "task-complete-but-response-thin",
    label: "Task complete but response thin",
    description: "Student covers required points but the response is underdeveloped, mechanical, or weakly adapted.",
    remedialStrategy: "Use content-depth and audience-fit checkpoints before final submission.",
  },
];

const englishForm5MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "E5R1-01", toNodeId: "E5R1-02" },
  { fromNodeId: "E5R1-02", toNodeId: "E5R1-03" },
  { fromNodeId: "E5R1-03", toNodeId: "E5R1-04" },
  { fromNodeId: "E5R2-01", toNodeId: "E5R2-02" },
  { fromNodeId: "E5R2-02", toNodeId: "E5R2-03" },
  { fromNodeId: "E5R2-03", toNodeId: "E5R2-04" },
  { fromNodeId: "E5R2-03", toNodeId: "E5R3-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E5R3-01", toNodeId: "E5R3-02" },
  { fromNodeId: "E5R3-02", toNodeId: "E5R3-03" },
  { fromNodeId: "E5R3-03", toNodeId: "E5R3-04" },
  { fromNodeId: "E5G1-01", toNodeId: "E5G1-02" },
  { fromNodeId: "E5G1-02", toNodeId: "E5G1-03" },
  { fromNodeId: "E5G1-03", toNodeId: "E5G1-04" },
  { fromNodeId: "E5G1-03", toNodeId: "E5G2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E5G2-01", toNodeId: "E5G2-02" },
  { fromNodeId: "E5G2-02", toNodeId: "E5G2-03" },
  { fromNodeId: "E5G2-03", toNodeId: "E5G2-04" },
  { fromNodeId: "E5G2-03", toNodeId: "E5G3-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E5G3-01", toNodeId: "E5G3-02" },
  { fromNodeId: "E5G3-02", toNodeId: "E5G3-03" },
  { fromNodeId: "E5G3-03", toNodeId: "E5G3-04" },
  { fromNodeId: "E5V1-01", toNodeId: "E5V1-02" },
  { fromNodeId: "E5V1-02", toNodeId: "E5V1-03" },
  { fromNodeId: "E5V1-03", toNodeId: "E5V1-04" },
  { fromNodeId: "E5V1-03", toNodeId: "E5V2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E5V2-01", toNodeId: "E5V2-02" },
  { fromNodeId: "E5V2-02", toNodeId: "E5V2-03" },
  { fromNodeId: "E5V2-03", toNodeId: "E5V2-04" },
  { fromNodeId: "E5G3-03", toNodeId: "E5W1-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E5W1-01", toNodeId: "E5W1-02" },
  { fromNodeId: "E5W1-02", toNodeId: "E5W1-03" },
  { fromNodeId: "E5W1-03", toNodeId: "E5W1-04" },
  { fromNodeId: "E5V2-03", toNodeId: "E5W2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E5W2-01", toNodeId: "E5W2-02" },
  { fromNodeId: "E5W2-02", toNodeId: "E5W2-03" },
  { fromNodeId: "E5W2-03", toNodeId: "E5W2-04" },
  { fromNodeId: "E5R3-04", toNodeId: "E5W1-02", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E5R1-04", toNodeId: "E5W2-02", edgeType: MasteryEdgeType.RECOMMENDED },
];

const englishForm4MasteryNodes: MasteryNodeSeed[] = [
  { id: "E4R1-01", topicId: "curriculum_topic_eng_f4_a1_evidence_synthesis_and_comparison", code: "E4R1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise where evidence aligns or differs across texts", learningObjective: "Identify where two texts support, extend, or contrast each other in meaning.", sequenceOrder: 1 },
  { id: "E4R1-02", topicId: "curriculum_topic_eng_f4_a1_evidence_synthesis_and_comparison", code: "E4R1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Select evidence from more than one source", learningObjective: "Choose relevant evidence from paired texts to answer a comparison question.", sequenceOrder: 2 },
  { id: "E4R1-03", topicId: "curriculum_topic_eng_f4_a1_evidence_synthesis_and_comparison", code: "E4R1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Synthesize evidence into one response", learningObjective: "Combine evidence from multiple text points into a single coherent explanation.", sequenceOrder: 3 },
  { id: "E4R1-04", topicId: "curriculum_topic_eng_f4_a1_evidence_synthesis_and_comparison", code: "E4R1-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a comparative evidence-based reading response", learningObjective: "Produce a short reading response that compares texts using accurate evidence synthesis.", sequenceOrder: 4 },

  { id: "E4R2-01", topicId: "curriculum_topic_eng_f4_a2_viewpoint_tone_and_writer_craft", code: "E4R2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise writer-craft signals", learningObjective: "Identify language and structural choices that signal viewpoint, tone, and effect.", sequenceOrder: 1 },
  { id: "E4R2-02", topicId: "curriculum_topic_eng_f4_a2_viewpoint_tone_and_writer_craft", code: "E4R2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Infer tone and viewpoint through writer choices", learningObjective: "Use language clues to infer how the writer positions the reader or subject.", sequenceOrder: 2 },
  { id: "E4R2-03", topicId: "curriculum_topic_eng_f4_a2_viewpoint_tone_and_writer_craft", code: "E4R2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Explain how writer craft shapes meaning", learningObjective: "Describe how specific word or structure choices shape tone, mood, or message.", sequenceOrder: 3 },
  { id: "E4R2-04", topicId: "curriculum_topic_eng_f4_a2_viewpoint_tone_and_writer_craft", code: "E4R2-04", nodeType: MasteryNodeType.APPLICATION, title: "Respond critically to viewpoint and writer craft", learningObjective: "Write a short analytical response about tone, viewpoint, and the effect of writer craft.", sequenceOrder: 4 },

  { id: "E4R3-01", topicId: "curriculum_topic_eng_f4_a3_summary_evaluation_and_text_links", code: "E4R3-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise summary-worthy and evaluative information", learningObjective: "Distinguish between core ideas, supporting details, and evaluative comments in a text.", sequenceOrder: 1 },
  { id: "E4R3-02", topicId: "curriculum_topic_eng_f4_a3_summary_evaluation_and_text_links", code: "E4R3-02", nodeType: MasteryNodeType.PROCEDURE, title: "Track links between text parts or paired texts", learningObjective: "Explain how ideas connect within a text or across two related texts.", sequenceOrder: 2 },
  { id: "E4R3-03", topicId: "curriculum_topic_eng_f4_a3_summary_evaluation_and_text_links", code: "E4R3-03", nodeType: MasteryNodeType.PROCEDURE, title: "Summarise and evaluate key ideas", learningObjective: "Reduce a text to key ideas and comment briefly on their significance or reliability.", sequenceOrder: 3 },
  { id: "E4R3-04", topicId: "curriculum_topic_eng_f4_a3_summary_evaluation_and_text_links", code: "E4R3-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a short summary-evaluation response", learningObjective: "Produce a concise summary or evaluation that preserves key meaning and connection.", sequenceOrder: 4 },

  { id: "E4G1-01", topicId: "curriculum_topic_eng_f4_b1_editing_for_accuracy_and_style", code: "E4G1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise style as well as correctness problems", learningObjective: "Identify where a sentence is technically correct but stylistically weak or unclear.", sequenceOrder: 1 },
  { id: "E4G1-02", topicId: "curriculum_topic_eng_f4_b1_editing_for_accuracy_and_style", code: "E4G1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Edit for grammar, punctuation, and clarity", learningObjective: "Revise short texts for accuracy while improving clarity and readability.", sequenceOrder: 2 },
  { id: "E4G1-03", topicId: "curriculum_topic_eng_f4_b1_editing_for_accuracy_and_style", code: "E4G1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Explain why one edit improves style", learningObjective: "Justify editing choices in terms of both correctness and communication quality.", sequenceOrder: 3 },
  { id: "E4G1-04", topicId: "curriculum_topic_eng_f4_b1_editing_for_accuracy_and_style", code: "E4G1-04", nodeType: MasteryNodeType.APPLICATION, title: "Edit a passage for accuracy and style", learningObjective: "Revise a short passage so it becomes more accurate, fluent, and reader-friendly.", sequenceOrder: 4 },

  { id: "E4G2-01", topicId: "curriculum_topic_eng_f4_b2_sentence_transformation_and_reformulation", code: "E4G2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise what must be preserved in reformulation", learningObjective: "Identify the meaning, tone, and grammar constraints that must stay intact during transformation.", sequenceOrder: 1 },
  { id: "E4G2-02", topicId: "curriculum_topic_eng_f4_b2_sentence_transformation_and_reformulation", code: "E4G2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Transform sentences without losing meaning", learningObjective: "Rewrite or transform sentence structures while preserving intended meaning.", sequenceOrder: 2 },
  { id: "E4G2-03", topicId: "curriculum_topic_eng_f4_b2_sentence_transformation_and_reformulation", code: "E4G2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Reformulate language for a different task need", learningObjective: "Change how an idea is expressed so it better fits the communication task or text type.", sequenceOrder: 3 },
  { id: "E4G2-04", topicId: "curriculum_topic_eng_f4_b2_sentence_transformation_and_reformulation", code: "E4G2-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply transformation and reformulation in short tasks", learningObjective: "Use transformation and reformulation accurately in practical editing or writing tasks.", sequenceOrder: 4 },

  { id: "E4G3-01", topicId: "curriculum_topic_eng_f4_b3_argument_language_and_cohesive_control", code: "E4G3-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise argument language and cohesion signals", learningObjective: "Identify language that introduces claims, reasons, contrast, emphasis, and conclusion.", sequenceOrder: 1 },
  { id: "E4G3-02", topicId: "curriculum_topic_eng_f4_b3_argument_language_and_cohesive_control", code: "E4G3-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use cohesive devices to organise argument", learningObjective: "Use linking language and cohesive control to keep ideas connected and logical.", sequenceOrder: 2 },
  { id: "E4G3-03", topicId: "curriculum_topic_eng_f4_b3_argument_language_and_cohesive_control", code: "E4G3-03", nodeType: MasteryNodeType.PROCEDURE, title: "Strengthen flow in an argument paragraph", learningObjective: "Revise an argument paragraph to improve progression, emphasis, and logical flow.", sequenceOrder: 3 },
  { id: "E4G3-04", topicId: "curriculum_topic_eng_f4_b3_argument_language_and_cohesive_control", code: "E4G3-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply cohesive argument language in writing", learningObjective: "Use cohesive argument language naturally in a short essay or opinion response.", sequenceOrder: 4 },

  { id: "E4V1-01", topicId: "curriculum_topic_eng_f4_c1_connotation_and_figurative_effect", code: "E4V1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise connotation and figurative effect", learningObjective: "Identify words or expressions that carry emotional, figurative, or evaluative force.", sequenceOrder: 1 },
  { id: "E4V1-02", topicId: "curriculum_topic_eng_f4_c1_connotation_and_figurative_effect", code: "E4V1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Interpret connotation in context", learningObjective: "Explain what a word or phrase suggests beyond its literal meaning in context.", sequenceOrder: 2 },
  { id: "E4V1-03", topicId: "curriculum_topic_eng_f4_c1_connotation_and_figurative_effect", code: "E4V1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Explain the effect of figurative or evaluative choice", learningObjective: "Describe how a writer’s word choice shapes tone, imagery, or persuasion.", sequenceOrder: 3 },
  { id: "E4V1-04", topicId: "curriculum_topic_eng_f4_c1_connotation_and_figurative_effect", code: "E4V1-04", nodeType: MasteryNodeType.APPLICATION, title: "Use connotation and figurative effect in analysis", learningObjective: "Use connotation and figurative effect to support a more precise reading response.", sequenceOrder: 4 },

  { id: "E4V2-01", topicId: "curriculum_topic_eng_f4_c2_register_audience_and_precision", code: "E4V2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise audience and register demands", learningObjective: "Identify the level of formality and type of reader a task expects.", sequenceOrder: 1 },
  { id: "E4V2-02", topicId: "curriculum_topic_eng_f4_c2_register_audience_and_precision", code: "E4V2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Choose vocabulary that fits audience and purpose", learningObjective: "Select more suitable words based on tone, purpose, and target reader.", sequenceOrder: 2 },
  { id: "E4V2-03", topicId: "curriculum_topic_eng_f4_c2_register_audience_and_precision", code: "E4V2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Refine precision without losing natural tone", learningObjective: "Improve word choice so writing becomes more precise without sounding unnatural or mismatched.", sequenceOrder: 3 },
  { id: "E4V2-04", topicId: "curriculum_topic_eng_f4_c2_register_audience_and_precision", code: "E4V2-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply register and precision in writing tasks", learningObjective: "Revise a response so it better fits audience, task, and intended communication effect.", sequenceOrder: 4 },

  { id: "E4W1-01", topicId: "curriculum_topic_eng_f4_d1_extended_response_and_essay_structure", code: "E4W1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise essay-level structure and progression", learningObjective: "Identify how a longer response should be organised from introduction to conclusion.", sequenceOrder: 1 },
  { id: "E4W1-02", topicId: "curriculum_topic_eng_f4_d1_extended_response_and_essay_structure", code: "E4W1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plan an extended response with clear support", learningObjective: "Organise key points, support, and paragraph order before writing a longer response.", sequenceOrder: 2 },
  { id: "E4W1-03", topicId: "curriculum_topic_eng_f4_d1_extended_response_and_essay_structure", code: "E4W1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Develop paragraph progression across an essay", learningObjective: "Build a response where each paragraph advances the main line of meaning or argument.", sequenceOrder: 3 },
  { id: "E4W1-04", topicId: "curriculum_topic_eng_f4_d1_extended_response_and_essay_structure", code: "E4W1-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a structured extended response", learningObjective: "Produce a longer essay or extended response with clear structure, development, and closure.", sequenceOrder: 4 },

  { id: "E4W2-01", topicId: "curriculum_topic_eng_f4_d2_exam_task_and_functional_writing", code: "E4W2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise exam-task and functional writing demands", learningObjective: "Identify what content, structure, and audience expectations are built into a practical writing task.", sequenceOrder: 1 },
  { id: "E4W2-02", topicId: "curriculum_topic_eng_f4_d2_exam_task_and_functional_writing", code: "E4W2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plan content for exam-style and practical tasks", learningObjective: "Choose and organise task-relevant content efficiently before writing.", sequenceOrder: 2 },
  { id: "E4W2-03", topicId: "curriculum_topic_eng_f4_d2_exam_task_and_functional_writing", code: "E4W2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Write a stronger task-fit functional response", learningObjective: "Produce a practical response that fits purpose, tone, and expected structure more consistently.", sequenceOrder: 3 },
  { id: "E4W2-04", topicId: "curriculum_topic_eng_f4_d2_exam_task_and_functional_writing", code: "E4W2-04", nodeType: MasteryNodeType.APPLICATION, title: "Deliver a complete exam-style or functional writing response", learningObjective: "Produce a complete guided or functional writing task that is clear, organised, and fit for purpose.", sequenceOrder: 4 },
];

const englishForm4Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_eng_f4_a1_evidence_synthesis_and_comparison",
    code: "two-text-answer-one-source-only",
    label: "Two-text answer using one source only",
    description: "Student is asked to compare or synthesize across texts but only uses evidence from one source.",
    remedialStrategy: "Force a two-column evidence capture step before the final response.",
  },
  {
    topicId: "curriculum_topic_eng_f4_a2_viewpoint_tone_and_writer_craft",
    code: "technique-name-without-effect",
    label: "Technique named without effect",
    description: "Student identifies a language feature but cannot explain how it shapes reader understanding or tone.",
    remedialStrategy: "Prompt with “what effect does this create?” after every named technique.",
  },
  {
    topicId: "curriculum_topic_eng_f4_a3_summary_evaluation_and_text_links",
    code: "summary-with-commentary-mix",
    label: "Summary and commentary mixed together",
    description: "Student blurs summary, evaluation, and personal comment instead of separating them clearly.",
    remedialStrategy: "Use separate summary and evaluation sentence stems before combining them.",
  },
  {
    topicId: "curriculum_topic_eng_f4_b1_editing_for_accuracy_and_style",
    code: "correct-but-still-awkward",
    label: "Correct but still awkward",
    description: "Student fixes grammar errors but leaves wording unclear or clumsy for the reader.",
    remedialStrategy: "Compare two revised versions and discuss which one communicates more naturally.",
  },
  {
    topicId: "curriculum_topic_eng_f4_b2_sentence_transformation_and_reformulation",
    code: "transformation-breaks-meaning",
    label: "Transformation breaks meaning",
    description: "Student rewrites structure successfully but changes the original intended meaning or emphasis.",
    remedialStrategy: "Restate the original meaning in plain language before transforming the sentence.",
  },
  {
    topicId: "curriculum_topic_eng_f4_b3_argument_language_and_cohesive_control",
    code: "connector-rich-logic-weak",
    label: "Connector-rich but logic weak",
    description: "Student uses many linking phrases but the argument still lacks a clear logical chain.",
    remedialStrategy: "Strip the paragraph to claim -> reason -> support before re-adding cohesive language.",
  },
  {
    topicId: "curriculum_topic_eng_f4_c1_connotation_and_figurative_effect",
    code: "literal-meaning-overrides-effect",
    label: "Literal meaning overrides effect",
    description: "Student explains the dictionary meaning but misses the emotional or rhetorical effect of the wording.",
    remedialStrategy: "Ask what the wording makes the reader feel, not just what it means literally.",
  },
  {
    topicId: "curriculum_topic_eng_f4_c2_register_audience_and_precision",
    code: "tone-does-not-match-reader",
    label: "Tone does not match reader",
    description: "Student chooses understandable language, but it does not suit the audience or level of formality.",
    remedialStrategy: "Compare how the same message changes across formal, semi-formal, and casual contexts.",
  },
  {
    topicId: "curriculum_topic_eng_f4_d1_extended_response_and_essay_structure",
    code: "essay-has-paragraphs-no-thesis-thread",
    label: "Essay has paragraphs but no thesis thread",
    description: "Student writes multiple paragraphs, but they do not clearly connect back to one controlling idea.",
    remedialStrategy: "Require a one-sentence thesis and one sentence of paragraph purpose before drafting.",
  },
  {
    topicId: "curriculum_topic_eng_f4_d2_exam_task_and_functional_writing",
    code: "task-format-correct-content-underpowered",
    label: "Task format correct but content underpowered",
    description: "Student follows the expected format but does not develop the content enough to satisfy the task.",
    remedialStrategy: "Use a content-point checklist before polishing structure and language.",
  },
];

const englishForm4MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "E4R1-01", toNodeId: "E4R1-02" },
  { fromNodeId: "E4R1-02", toNodeId: "E4R1-03" },
  { fromNodeId: "E4R1-03", toNodeId: "E4R1-04" },
  { fromNodeId: "E4R1-03", toNodeId: "E4R2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E4R2-01", toNodeId: "E4R2-02" },
  { fromNodeId: "E4R2-02", toNodeId: "E4R2-03" },
  { fromNodeId: "E4R2-03", toNodeId: "E4R2-04" },
  { fromNodeId: "E4R1-02", toNodeId: "E4R3-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E4R3-01", toNodeId: "E4R3-02" },
  { fromNodeId: "E4R3-02", toNodeId: "E4R3-03" },
  { fromNodeId: "E4R3-03", toNodeId: "E4R3-04" },
  { fromNodeId: "E4G1-01", toNodeId: "E4G1-02" },
  { fromNodeId: "E4G1-02", toNodeId: "E4G1-03" },
  { fromNodeId: "E4G1-03", toNodeId: "E4G1-04" },
  { fromNodeId: "E4G1-03", toNodeId: "E4G2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E4G2-01", toNodeId: "E4G2-02" },
  { fromNodeId: "E4G2-02", toNodeId: "E4G2-03" },
  { fromNodeId: "E4G2-03", toNodeId: "E4G2-04" },
  { fromNodeId: "E4G2-03", toNodeId: "E4G3-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E4G3-01", toNodeId: "E4G3-02" },
  { fromNodeId: "E4G3-02", toNodeId: "E4G3-03" },
  { fromNodeId: "E4G3-03", toNodeId: "E4G3-04" },
  { fromNodeId: "E4R2-03", toNodeId: "E4V1-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E4V1-01", toNodeId: "E4V1-02" },
  { fromNodeId: "E4V1-02", toNodeId: "E4V1-03" },
  { fromNodeId: "E4V1-03", toNodeId: "E4V1-04" },
  { fromNodeId: "E4V1-03", toNodeId: "E4V2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E4V2-01", toNodeId: "E4V2-02" },
  { fromNodeId: "E4V2-02", toNodeId: "E4V2-03" },
  { fromNodeId: "E4V2-03", toNodeId: "E4V2-04" },
  { fromNodeId: "E4G3-03", toNodeId: "E4W1-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E4W1-01", toNodeId: "E4W1-02" },
  { fromNodeId: "E4W1-02", toNodeId: "E4W1-03" },
  { fromNodeId: "E4W1-03", toNodeId: "E4W1-04" },
  { fromNodeId: "E4W1-03", toNodeId: "E4W2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E4W2-01", toNodeId: "E4W2-02" },
  { fromNodeId: "E4W2-02", toNodeId: "E4W2-03" },
  { fromNodeId: "E4W2-03", toNodeId: "E4W2-04" },
];

const englishForm3MasteryNodes: MasteryNodeSeed[] = [
  { id: "E3R1-01", topicId: "curriculum_topic_eng_f3_a1_evidence_based_comprehension", code: "E3R1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise where evidence is located in a text", learningObjective: "Identify the lines, details, or phrases that directly support an answer.", sequenceOrder: 1 },
  { id: "E3R1-02", topicId: "curriculum_topic_eng_f3_a1_evidence_based_comprehension", code: "E3R1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Select relevant evidence for a question", learningObjective: "Choose the most relevant supporting detail for a reading question.", sequenceOrder: 2 },
  { id: "E3R1-03", topicId: "curriculum_topic_eng_f3_a1_evidence_based_comprehension", code: "E3R1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Link evidence to meaning accurately", learningObjective: "Explain how selected evidence supports the intended answer.", sequenceOrder: 3 },
  { id: "E3R1-04", topicId: "curriculum_topic_eng_f3_a1_evidence_based_comprehension", code: "E3R1-04", nodeType: MasteryNodeType.APPLICATION, title: "Write an evidence-based comprehension response", learningObjective: "Answer a comprehension question using a justified evidence-based explanation.", sequenceOrder: 4 },

  { id: "E3R2-01", topicId: "curriculum_topic_eng_f3_a2_attitude_purpose_and_message", code: "E3R2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise signals of attitude and purpose", learningObjective: "Identify words or structures that suggest attitude, intention, or communicative purpose.", sequenceOrder: 1 },
  { id: "E3R2-02", topicId: "curriculum_topic_eng_f3_a2_attitude_purpose_and_message", code: "E3R2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Infer purpose and message from text clues", learningObjective: "Infer what a writer or speaker is trying to achieve using textual evidence.", sequenceOrder: 2 },
  { id: "E3R2-03", topicId: "curriculum_topic_eng_f3_a2_attitude_purpose_and_message", code: "E3R2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Support attitude or purpose judgments", learningObjective: "Justify a judgment about attitude or purpose using precise evidence from the text.", sequenceOrder: 3 },
  { id: "E3R2-04", topicId: "curriculum_topic_eng_f3_a2_attitude_purpose_and_message", code: "E3R2-04", nodeType: MasteryNodeType.APPLICATION, title: "Explain attitude, purpose, and message in a short response", learningObjective: "Produce a short reading response that explains the writer’s attitude, purpose, or key message clearly.", sequenceOrder: 4 },

  { id: "E3R3-01", topicId: "curriculum_topic_eng_f3_a3_summary_sequence_and_text_structure", code: "E3R3-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise text structure and sequencing markers", learningObjective: "Identify how a text is ordered and where key information is placed.", sequenceOrder: 1 },
  { id: "E3R3-02", topicId: "curriculum_topic_eng_f3_a3_summary_sequence_and_text_structure", code: "E3R3-02", nodeType: MasteryNodeType.PROCEDURE, title: "Track sequence and key information accurately", learningObjective: "Follow the order of events or ideas without losing important reference points.", sequenceOrder: 2 },
  { id: "E3R3-03", topicId: "curriculum_topic_eng_f3_a3_summary_sequence_and_text_structure", code: "E3R3-03", nodeType: MasteryNodeType.PROCEDURE, title: "Reduce a text to key summary points", learningObjective: "Identify and keep only the most important ideas when summarising.", sequenceOrder: 3 },
  { id: "E3R3-04", topicId: "curriculum_topic_eng_f3_a3_summary_sequence_and_text_structure", code: "E3R3-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a short structured summary", learningObjective: "Produce a concise summary that preserves key meaning and logical sequence.", sequenceOrder: 4 },

  { id: "E3G1-01", topicId: "curriculum_topic_eng_f3_b1_sentence_accuracy_and_error_correction", code: "E3G1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise common sentence-level errors", learningObjective: "Identify common grammar, punctuation, and sentence-accuracy errors in context.", sequenceOrder: 1 },
  { id: "E3G1-02", topicId: "curriculum_topic_eng_f3_b1_sentence_accuracy_and_error_correction", code: "E3G1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Correct sentence errors accurately", learningObjective: "Edit short sentences to improve grammar and sentence correctness.", sequenceOrder: 2 },
  { id: "E3G1-03", topicId: "curriculum_topic_eng_f3_b1_sentence_accuracy_and_error_correction", code: "E3G1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Explain why a correction is needed", learningObjective: "State the rule or reason behind a sentence correction.", sequenceOrder: 3 },
  { id: "E3G1-04", topicId: "curriculum_topic_eng_f3_b1_sentence_accuracy_and_error_correction", code: "E3G1-04", nodeType: MasteryNodeType.APPLICATION, title: "Edit a short passage for sentence accuracy", learningObjective: "Revise a short text by correcting multiple sentence-level errors in context.", sequenceOrder: 4 },

  { id: "E3G2-01", topicId: "curriculum_topic_eng_f3_b2_reported_meaning_and_question_forms", code: "E3G2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise reporting and question-form patterns", learningObjective: "Identify how reporting and question forms change meaning and structure.", sequenceOrder: 1 },
  { id: "E3G2-02", topicId: "curriculum_topic_eng_f3_b2_reported_meaning_and_question_forms", code: "E3G2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use suitable reporting and question structures", learningObjective: "Form reporting statements and question types that fit the communication task.", sequenceOrder: 2 },
  { id: "E3G2-03", topicId: "curriculum_topic_eng_f3_b2_reported_meaning_and_question_forms", code: "E3G2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Maintain meaning across grammatical shifts", learningObjective: "Keep the intended meaning clear when changing between direct, reported, or question-based forms.", sequenceOrder: 3 },
  { id: "E3G2-04", topicId: "curriculum_topic_eng_f3_b2_reported_meaning_and_question_forms", code: "E3G2-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply reporting and question forms in practical tasks", learningObjective: "Use suitable reporting and question forms naturally in short practical communication tasks.", sequenceOrder: 4 },

  { id: "E3G3-01", topicId: "curriculum_topic_eng_f3_b3_clause_control_and_editing_for_flow", code: "E3G3-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise clause-level flow and control issues", learningObjective: "Identify where clause structure weakens flow, clarity, or rhythm in a text.", sequenceOrder: 1 },
  { id: "E3G3-02", topicId: "curriculum_topic_eng_f3_b3_clause_control_and_editing_for_flow", code: "E3G3-02", nodeType: MasteryNodeType.PROCEDURE, title: "Improve clause control in connected writing", learningObjective: "Revise clause use to make connected writing clearer and more controlled.", sequenceOrder: 2 },
  { id: "E3G3-03", topicId: "curriculum_topic_eng_f3_b3_clause_control_and_editing_for_flow", code: "E3G3-03", nodeType: MasteryNodeType.PROCEDURE, title: "Edit sentence flow with better clause choices", learningObjective: "Change sentence patterns and clause combinations to improve flow and readability.", sequenceOrder: 3 },
  { id: "E3G3-04", topicId: "curriculum_topic_eng_f3_b3_clause_control_and_editing_for_flow", code: "E3G3-04", nodeType: MasteryNodeType.APPLICATION, title: "Edit a short text for clause flow and expression", learningObjective: "Improve a short text by revising clause structure for clearer written expression.", sequenceOrder: 4 },

  { id: "E3V1-01", topicId: "curriculum_topic_eng_f3_c1_figurative_and_implied_meaning", code: "E3V1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise figurative and implied meaning signals", learningObjective: "Identify clues that suggest non-literal or implied meaning in context.", sequenceOrder: 1 },
  { id: "E3V1-02", topicId: "curriculum_topic_eng_f3_c1_figurative_and_implied_meaning", code: "E3V1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Interpret figurative and implied vocabulary", learningObjective: "Use context to infer figurative or implied meaning more accurately.", sequenceOrder: 2 },
  { id: "E3V1-03", topicId: "curriculum_topic_eng_f3_c1_figurative_and_implied_meaning", code: "E3V1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Explain how figurative choices affect meaning", learningObjective: "Describe how non-literal language shapes tone, imagery, or message.", sequenceOrder: 3 },
  { id: "E3V1-04", topicId: "curriculum_topic_eng_f3_c1_figurative_and_implied_meaning", code: "E3V1-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply implied and figurative meaning in reading response", learningObjective: "Use figurative or implied meaning analysis to support a reading response.", sequenceOrder: 4 },

  { id: "E3V2-01", topicId: "curriculum_topic_eng_f3_c2_register_word_form_and_precision", code: "E3V2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise register and word-form differences", learningObjective: "Identify how audience, purpose, and text type affect vocabulary and word form choice.", sequenceOrder: 1 },
  { id: "E3V2-02", topicId: "curriculum_topic_eng_f3_c2_register_word_form_and_precision", code: "E3V2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Choose vocabulary that fits register and purpose", learningObjective: "Select words that match the required tone, audience, and text type.", sequenceOrder: 2 },
  { id: "E3V2-03", topicId: "curriculum_topic_eng_f3_c2_register_word_form_and_precision", code: "E3V2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Control word form for accurate expression", learningObjective: "Use the correct word form to express meaning precisely in context.", sequenceOrder: 3 },
  { id: "E3V2-04", topicId: "curriculum_topic_eng_f3_c2_register_word_form_and_precision", code: "E3V2-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply register and precision in short writing", learningObjective: "Revise a short response so vocabulary and word form fit the intended register and purpose.", sequenceOrder: 4 },

  { id: "E3W1-01", topicId: "curriculum_topic_eng_f3_d1_multi_paragraph_response_writing", code: "E3W1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise multi-paragraph response structure", learningObjective: "Identify how ideas are grouped and sequenced across more than one paragraph.", sequenceOrder: 1 },
  { id: "E3W1-02", topicId: "curriculum_topic_eng_f3_d1_multi_paragraph_response_writing", code: "E3W1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plan paragraph progression across a response", learningObjective: "Organise main ideas and support into a clear multi-paragraph structure.", sequenceOrder: 2 },
  { id: "E3W1-03", topicId: "curriculum_topic_eng_f3_d1_multi_paragraph_response_writing", code: "E3W1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Develop support and transitions across paragraphs", learningObjective: "Use supporting details and transitions to connect paragraphs clearly.", sequenceOrder: 3 },
  { id: "E3W1-04", topicId: "curriculum_topic_eng_f3_d1_multi_paragraph_response_writing", code: "E3W1-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a structured multi-paragraph response", learningObjective: "Produce a multi-paragraph response with clear progression and support.", sequenceOrder: 4 },

  { id: "E3W2-01", topicId: "curriculum_topic_eng_f3_d2_guided_extended_and_functional_writing", code: "E3W2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise demands of guided extended and functional tasks", learningObjective: "Identify what content, format, and audience each practical writing task requires.", sequenceOrder: 1 },
  { id: "E3W2-02", topicId: "curriculum_topic_eng_f3_d2_guided_extended_and_functional_writing", code: "E3W2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plan content for task-fit responses", learningObjective: "Select and organise content that matches the task requirement and reader expectation.", sequenceOrder: 2 },
  { id: "E3W2-03", topicId: "curriculum_topic_eng_f3_d2_guided_extended_and_functional_writing", code: "E3W2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Write extended or functional responses with clearer fit", learningObjective: "Write guided or practical responses that better fit task, structure, and audience.", sequenceOrder: 3 },
  { id: "E3W2-04", topicId: "curriculum_topic_eng_f3_d2_guided_extended_and_functional_writing", code: "E3W2-04", nodeType: MasteryNodeType.APPLICATION, title: "Deliver a complete guided or functional writing response", learningObjective: "Produce a complete task-fit response with suitable organisation, tone, and content.", sequenceOrder: 4 },
];

const englishForm3Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_eng_f3_a1_evidence_based_comprehension",
    code: "answer-without-text-proof",
    label: "Answer without text proof",
    description: "Student gives a possible answer but does not anchor it in clear textual evidence.",
    remedialStrategy: "Require the student to underline one line or phrase before giving the final answer.",
  },
  {
    topicId: "curriculum_topic_eng_f3_a2_attitude_purpose_and_message",
    code: "purpose-as-topic-confusion",
    label: "Purpose as topic confusion",
    description: "Student names what the text is about instead of why it was written or what attitude it conveys.",
    remedialStrategy: "Contrast topic, purpose, and attitude using short paired examples before retrying.",
  },
  {
    topicId: "curriculum_topic_eng_f3_a3_summary_sequence_and_text_structure",
    code: "summary-copies-too-much",
    label: "Summary copies too much",
    description: "Student repeats long chunks of the original text instead of selecting and condensing key points.",
    remedialStrategy: "Use key-point extraction first, then reduce each point into fewer words.",
  },
  {
    topicId: "curriculum_topic_eng_f3_b1_sentence_accuracy_and_error_correction",
    code: "editing-without-rule-awareness",
    label: "Editing without rule awareness",
    description: "Student can guess a correction but cannot explain what was wrong or why the change helps.",
    remedialStrategy: "Pair each correction with a simple rule label before moving to passage editing.",
  },
  {
    topicId: "curriculum_topic_eng_f3_b2_reported_meaning_and_question_forms",
    code: "meaning-shift-in-reformulation",
    label: "Meaning shift in reformulation",
    description: "Student changes grammar form but accidentally changes the original intended meaning.",
    remedialStrategy: "Check meaning in plain language before and after the grammatical change.",
  },
  {
    topicId: "curriculum_topic_eng_f3_b3_clause_control_and_editing_for_flow",
    code: "flow-improves-but-clarity-drops",
    label: "Flow improves but clarity drops",
    description: "Student combines clauses for fluency but creates confusing or overloaded sentence structures.",
    remedialStrategy: "Revise one sentence at a time and compare clarity before adding extra complexity.",
  },
  {
    topicId: "curriculum_topic_eng_f3_c1_figurative_and_implied_meaning",
    code: "literal-reading-of-figurative-language",
    label: "Literal reading of figurative language",
    description: "Student interprets figurative or implied wording literally and misses the intended effect.",
    remedialStrategy: "Use contrast examples that show literal meaning versus intended contextual meaning.",
  },
  {
    topicId: "curriculum_topic_eng_f3_c2_register_word_form_and_precision",
    code: "wrong-register-right-meaning",
    label: "Wrong register right meaning",
    description: "Student selects a word with the general meaning but unsuitable tone, audience, or formality.",
    remedialStrategy: "Compare how the same idea sounds in casual, neutral, and formal contexts.",
  },
  {
    topicId: "curriculum_topic_eng_f3_d1_multi_paragraph_response_writing",
    code: "paragraphs-without-progression",
    label: "Paragraphs without progression",
    description: "Student writes more than one paragraph but ideas do not progress or connect clearly.",
    remedialStrategy: "Plan paragraph purpose first, then add one transition goal between each paragraph.",
  },
  {
    topicId: "curriculum_topic_eng_f3_d2_guided_extended_and_functional_writing",
    code: "task-fit-without-depth",
    label: "Task fit without depth",
    description: "Student follows the format but produces thin content or underdeveloped support for the task.",
    remedialStrategy: "Use a content checklist before writing and require at least one developed support point.",
  },
];

const englishForm3MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "E3R1-01", toNodeId: "E3R1-02" },
  { fromNodeId: "E3R1-02", toNodeId: "E3R1-03" },
  { fromNodeId: "E3R1-03", toNodeId: "E3R1-04" },
  { fromNodeId: "E3R1-03", toNodeId: "E3R2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E3R2-01", toNodeId: "E3R2-02" },
  { fromNodeId: "E3R2-02", toNodeId: "E3R2-03" },
  { fromNodeId: "E3R2-03", toNodeId: "E3R2-04" },
  { fromNodeId: "E3R1-02", toNodeId: "E3R3-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E3R3-01", toNodeId: "E3R3-02" },
  { fromNodeId: "E3R3-02", toNodeId: "E3R3-03" },
  { fromNodeId: "E3R3-03", toNodeId: "E3R3-04" },
  { fromNodeId: "E3G1-01", toNodeId: "E3G1-02" },
  { fromNodeId: "E3G1-02", toNodeId: "E3G1-03" },
  { fromNodeId: "E3G1-03", toNodeId: "E3G1-04" },
  { fromNodeId: "E3G1-03", toNodeId: "E3G2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E3G2-01", toNodeId: "E3G2-02" },
  { fromNodeId: "E3G2-02", toNodeId: "E3G2-03" },
  { fromNodeId: "E3G2-03", toNodeId: "E3G2-04" },
  { fromNodeId: "E3G2-03", toNodeId: "E3G3-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E3G3-01", toNodeId: "E3G3-02" },
  { fromNodeId: "E3G3-02", toNodeId: "E3G3-03" },
  { fromNodeId: "E3G3-03", toNodeId: "E3G3-04" },
  { fromNodeId: "E3R3-02", toNodeId: "E3V1-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E3V1-01", toNodeId: "E3V1-02" },
  { fromNodeId: "E3V1-02", toNodeId: "E3V1-03" },
  { fromNodeId: "E3V1-03", toNodeId: "E3V1-04" },
  { fromNodeId: "E3V1-03", toNodeId: "E3V2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E3V2-01", toNodeId: "E3V2-02" },
  { fromNodeId: "E3V2-02", toNodeId: "E3V2-03" },
  { fromNodeId: "E3V2-03", toNodeId: "E3V2-04" },
  { fromNodeId: "E3G3-03", toNodeId: "E3W1-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E3W1-01", toNodeId: "E3W1-02" },
  { fromNodeId: "E3W1-02", toNodeId: "E3W1-03" },
  { fromNodeId: "E3W1-03", toNodeId: "E3W1-04" },
  { fromNodeId: "E3W1-03", toNodeId: "E3W2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E3W2-01", toNodeId: "E3W2-02" },
  { fromNodeId: "E3W2-02", toNodeId: "E3W2-03" },
  { fromNodeId: "E3W2-03", toNodeId: "E3W2-04" },
];

const englishForm1MasteryNodes: MasteryNodeSeed[] = [
  { id: "MI-01", topicId: "curriculum_topic_eng_f1_a1_main_ideas_and_explicit_information", code: "MI-01", nodeType: MasteryNodeType.RECOGNITION, title: "Identify the topic and main idea", learningObjective: "Recognise what a short text is mainly about and select the central message.", sequenceOrder: 1 },
  { id: "MI-02", topicId: "curriculum_topic_eng_f1_a1_main_ideas_and_explicit_information", code: "MI-02", nodeType: MasteryNodeType.PROCEDURE, title: "Locate explicit supporting details", learningObjective: "Find clearly stated details that support the main idea in a passage.", sequenceOrder: 2 },
  { id: "MI-03", topicId: "curriculum_topic_eng_f1_a1_main_ideas_and_explicit_information", code: "MI-03", nodeType: MasteryNodeType.PROCEDURE, title: "Match questions to exact textual evidence", learningObjective: "Use explicit information from the text to answer literal questions accurately.", sequenceOrder: 3 },
  { id: "MI-04", topicId: "curriculum_topic_eng_f1_a1_main_ideas_and_explicit_information", code: "MI-04", nodeType: MasteryNodeType.APPLICATION, title: "Summarise a short text accurately", learningObjective: "State the main idea and key support in a short, clear summary.", sequenceOrder: 4 },

  { id: "IN-01", topicId: "curriculum_topic_eng_f1_a2_inference_and_supporting_evidence", code: "IN-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise when an answer must be inferred", learningObjective: "Distinguish between information that is stated directly and ideas that must be inferred.", sequenceOrder: 1 },
  { id: "IN-02", topicId: "curriculum_topic_eng_f1_a2_inference_and_supporting_evidence", code: "IN-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use text clues to make a simple inference", learningObjective: "Combine clues from a short passage to infer a basic idea, feeling, or reason.", sequenceOrder: 2 },
  { id: "IN-03", topicId: "curriculum_topic_eng_f1_a2_inference_and_supporting_evidence", code: "IN-03", nodeType: MasteryNodeType.PROCEDURE, title: "Select evidence that supports an inference", learningObjective: "Choose specific details that justify an inference from the text.", sequenceOrder: 3 },
  { id: "IN-04", topicId: "curriculum_topic_eng_f1_a2_inference_and_supporting_evidence", code: "IN-04", nodeType: MasteryNodeType.APPLICATION, title: "Explain an inference with evidence", learningObjective: "Write or say a short inference and support it using clear textual evidence.", sequenceOrder: 4 },

  { id: "RC-01", topicId: "curriculum_topic_eng_f1_a3_reference_and_context_clues", code: "RC-01", nodeType: MasteryNodeType.RECOGNITION, title: "Track pronoun and reference words", learningObjective: "Identify what common reference words such as he, she, it, they, this, or that refer to.", sequenceOrder: 1 },
  { id: "RC-02", topicId: "curriculum_topic_eng_f1_a3_reference_and_context_clues", code: "RC-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use nearby clues to work out meaning", learningObjective: "Use surrounding words or phrases to understand the meaning of unfamiliar words.", sequenceOrder: 2 },
  { id: "RC-03", topicId: "curriculum_topic_eng_f1_a3_reference_and_context_clues", code: "RC-03", nodeType: MasteryNodeType.PROCEDURE, title: "Connect reference and meaning across sentences", learningObjective: "Follow meaning across connected sentences using reference words and context clues.", sequenceOrder: 3 },
  { id: "RC-04", topicId: "curriculum_topic_eng_f1_a3_reference_and_context_clues", code: "RC-04", nodeType: MasteryNodeType.APPLICATION, title: "Resolve ambiguity in short passages", learningObjective: "Use context and reference clues together to explain a confusing part of a short text.", sequenceOrder: 4 },

  { id: "PS-01", topicId: "curriculum_topic_eng_f1_b1_parts_of_speech_and_sentence_roles", code: "PS-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise common parts of speech", learningObjective: "Identify nouns, verbs, adjectives, adverbs, pronouns, and prepositions in simple sentences.", sequenceOrder: 1 },
  { id: "PS-02", topicId: "curriculum_topic_eng_f1_b1_parts_of_speech_and_sentence_roles", code: "PS-02", nodeType: MasteryNodeType.PROCEDURE, title: "Match words to sentence roles", learningObjective: "Explain how key words function as subject, action, description, or connector in a sentence.", sequenceOrder: 2 },
  { id: "PS-03", topicId: "curriculum_topic_eng_f1_b1_parts_of_speech_and_sentence_roles", code: "PS-03", nodeType: MasteryNodeType.PROCEDURE, title: "Complete sentences with suitable word classes", learningObjective: "Choose suitable word types to complete or improve a sentence accurately.", sequenceOrder: 3 },
  { id: "PS-04", topicId: "curriculum_topic_eng_f1_b1_parts_of_speech_and_sentence_roles", code: "PS-04", nodeType: MasteryNodeType.APPLICATION, title: "Edit simple sentences for word-role accuracy", learningObjective: "Spot and fix part-of-speech errors in short sentences.", sequenceOrder: 4 },

  { id: "TS-01", topicId: "curriculum_topic_eng_f1_b2_tenses_and_subject_verb_agreement", code: "TS-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise basic tense and agreement patterns", learningObjective: "Identify simple present, simple past, and simple future forms with correct subject-verb pairing.", sequenceOrder: 1 },
  { id: "TS-02", topicId: "curriculum_topic_eng_f1_b2_tenses_and_subject_verb_agreement", code: "TS-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use correct tense in isolated sentences", learningObjective: "Apply the correct tense form and subject-verb agreement in controlled sentence tasks.", sequenceOrder: 2 },
  { id: "TS-03", topicId: "curriculum_topic_eng_f1_b2_tenses_and_subject_verb_agreement", code: "TS-03", nodeType: MasteryNodeType.PROCEDURE, title: "Maintain tense and agreement across linked sentences", learningObjective: "Keep tense and subject-verb agreement consistent across a short text.", sequenceOrder: 3 },
  { id: "TS-04", topicId: "curriculum_topic_eng_f1_b2_tenses_and_subject_verb_agreement", code: "TS-04", nodeType: MasteryNodeType.APPLICATION, title: "Edit tense and agreement errors in context", learningObjective: "Find and correct tense or agreement mistakes in short paragraphs.", sequenceOrder: 4 },

  { id: "SC-01", topicId: "curriculum_topic_eng_f1_b3_sentence_construction_and_transformation", code: "SC-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise complete and incomplete sentences", learningObjective: "Tell the difference between complete sentences, fragments, and run-on writing.", sequenceOrder: 1 },
  { id: "SC-02", topicId: "curriculum_topic_eng_f1_b3_sentence_construction_and_transformation", code: "SC-02", nodeType: MasteryNodeType.PROCEDURE, title: "Construct clear simple and compound sentences", learningObjective: "Build complete sentences using suitable structure, punctuation, and connectors.", sequenceOrder: 2 },
  { id: "SC-03", topicId: "curriculum_topic_eng_f1_b3_sentence_construction_and_transformation", code: "SC-03", nodeType: MasteryNodeType.PROCEDURE, title: "Transform sentence forms accurately", learningObjective: "Change sentence forms while keeping meaning clear, such as expanding, combining, or correcting them.", sequenceOrder: 3 },
  { id: "SC-04", topicId: "curriculum_topic_eng_f1_b3_sentence_construction_and_transformation", code: "SC-04", nodeType: MasteryNodeType.APPLICATION, title: "Improve sentence quality in guided writing", learningObjective: "Revise weak sentences so they become clearer, more accurate, and more connected to purpose.", sequenceOrder: 4 },

  { id: "VC-01", topicId: "curriculum_topic_eng_f1_c1_vocabulary_in_context", code: "VC-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise common meaning clues in context", learningObjective: "Spot clue types such as examples, explanations, or contrasts that help reveal meaning.", sequenceOrder: 1 },
  { id: "VC-02", topicId: "curriculum_topic_eng_f1_c1_vocabulary_in_context", code: "VC-02", nodeType: MasteryNodeType.PROCEDURE, title: "Infer word meaning from sentence context", learningObjective: "Work out a likely meaning for a word using clues from the same sentence or nearby lines.", sequenceOrder: 2 },
  { id: "VC-03", topicId: "curriculum_topic_eng_f1_c1_vocabulary_in_context", code: "VC-03", nodeType: MasteryNodeType.PROCEDURE, title: "Choose the best contextual meaning", learningObjective: "Select the correct meaning of a word with multiple possible uses in context.", sequenceOrder: 3 },
  { id: "VC-04", topicId: "curriculum_topic_eng_f1_c1_vocabulary_in_context", code: "VC-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply contextual vocabulary in a new sentence", learningObjective: "Use newly understood vocabulary in a meaningful sentence of your own.", sequenceOrder: 4 },

  { id: "WW-01", topicId: "curriculum_topic_eng_f1_c2_word_choice_and_relationships", code: "WW-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise simple word relationships", learningObjective: "Identify synonym, antonym, and category-based relationships between familiar words.", sequenceOrder: 1 },
  { id: "WW-02", topicId: "curriculum_topic_eng_f1_c2_word_choice_and_relationships", code: "WW-02", nodeType: MasteryNodeType.PROCEDURE, title: "Choose words with the right tone and precision", learningObjective: "Select more suitable words based on meaning, tone, and sentence purpose.", sequenceOrder: 2 },
  { id: "WW-03", topicId: "curriculum_topic_eng_f1_c2_word_choice_and_relationships", code: "WW-03", nodeType: MasteryNodeType.PROCEDURE, title: "Use simple collocations and word partners", learningObjective: "Combine familiar words in ways that sound natural and accurate.", sequenceOrder: 3 },
  { id: "WW-04", topicId: "curriculum_topic_eng_f1_c2_word_choice_and_relationships", code: "WW-04", nodeType: MasteryNodeType.APPLICATION, title: "Improve weak writing through better word choice", learningObjective: "Revise simple writing by replacing vague or inaccurate words with stronger choices.", sequenceOrder: 4 },

  { id: "PW-01", topicId: "curriculum_topic_eng_f1_d1_sentence_to_paragraph_writing", code: "PW-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise paragraph structure", learningObjective: "Identify topic sentence, supporting detail, and closing idea in a short paragraph.", sequenceOrder: 1 },
  { id: "PW-02", topicId: "curriculum_topic_eng_f1_d1_sentence_to_paragraph_writing", code: "PW-02", nodeType: MasteryNodeType.PROCEDURE, title: "Build a paragraph from guided points", learningObjective: "Turn short notes or prompts into a linked paragraph with simple sequencing.", sequenceOrder: 2 },
  { id: "PW-03", topicId: "curriculum_topic_eng_f1_d1_sentence_to_paragraph_writing", code: "PW-03", nodeType: MasteryNodeType.PROCEDURE, title: "Use connectors to improve flow", learningObjective: "Connect ideas using simple transitions so the paragraph reads smoothly.", sequenceOrder: 3 },
  { id: "PW-04", topicId: "curriculum_topic_eng_f1_d1_sentence_to_paragraph_writing", code: "PW-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a coherent short paragraph independently", learningObjective: "Write a short paragraph with a clear focus, support, and logical order.", sequenceOrder: 4 },

  { id: "GW-01", topicId: "curriculum_topic_eng_f1_d2_guided_and_functional_writing", code: "GW-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise task purpose and format", learningObjective: "Identify what a guided or functional writing task asks for and what format fits it.", sequenceOrder: 1 },
  { id: "GW-02", topicId: "curriculum_topic_eng_f1_d2_guided_and_functional_writing", code: "GW-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plan short guided responses", learningObjective: "Organise key points and structure before writing a short guided response.", sequenceOrder: 2 },
  { id: "GW-03", topicId: "curriculum_topic_eng_f1_d2_guided_and_functional_writing", code: "GW-03", nodeType: MasteryNodeType.PROCEDURE, title: "Write messages and simple functional texts", learningObjective: "Write short messages, notes, or practical texts using suitable language and format.", sequenceOrder: 3 },
  { id: "GW-04", topicId: "curriculum_topic_eng_f1_d2_guided_and_functional_writing", code: "GW-04", nodeType: MasteryNodeType.APPLICATION, title: "Deliver a clear task-fit written response", learningObjective: "Produce a short piece of writing that fits audience, purpose, and task requirements.", sequenceOrder: 4 },
];

const englishForm2MasteryNodes: MasteryNodeSeed[] = [
  { id: "E2R1-01", topicId: "curriculum_topic_eng_f2_a1_compare_main_ideas_and_supporting_details", code: "E2R1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise linked ideas across short texts", learningObjective: "Identify when two texts share a topic but differ in main idea or emphasis.", sequenceOrder: 1 },
  { id: "E2R1-02", topicId: "curriculum_topic_eng_f2_a1_compare_main_ideas_and_supporting_details", code: "E2R1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Match support to the correct main idea", learningObjective: "Sort details under the correct main idea when comparing short texts.", sequenceOrder: 2 },
  { id: "E2R1-03", topicId: "curriculum_topic_eng_f2_a1_compare_main_ideas_and_supporting_details", code: "E2R1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare how two texts support meaning", learningObjective: "Explain how different details or examples support ideas in two related texts.", sequenceOrder: 3 },
  { id: "E2R1-04", topicId: "curriculum_topic_eng_f2_a1_compare_main_ideas_and_supporting_details", code: "E2R1-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a short comparison of two texts", learningObjective: "Compare main ideas and supporting details in a brief evidence-based response.", sequenceOrder: 4 },

  { id: "E2R2-01", topicId: "curriculum_topic_eng_f2_a2_inference_tone_and_point_of_view", code: "E2R2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise tone and point of view signals", learningObjective: "Identify simple language clues that reveal tone, attitude, or point of view.", sequenceOrder: 1 },
  { id: "E2R2-02", topicId: "curriculum_topic_eng_f2_a2_inference_tone_and_point_of_view", code: "E2R2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Infer feeling, attitude, or intention", learningObjective: "Use textual clues to infer a speaker's or writer's feeling, attitude, or purpose.", sequenceOrder: 2 },
  { id: "E2R2-03", topicId: "curriculum_topic_eng_f2_a2_inference_tone_and_point_of_view", code: "E2R2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Support interpretation with evidence", learningObjective: "Choose relevant lines or words that justify tone and viewpoint interpretations.", sequenceOrder: 3 },
  { id: "E2R2-04", topicId: "curriculum_topic_eng_f2_a2_inference_tone_and_point_of_view", code: "E2R2-04", nodeType: MasteryNodeType.APPLICATION, title: "Explain tone and point of view in a short response", learningObjective: "Write a short response that explains tone or point of view with evidence.", sequenceOrder: 4 },

  { id: "E2R3-01", topicId: "curriculum_topic_eng_f2_a3_reference_sequence_and_text_organisation", code: "E2R3-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise text organisation clues", learningObjective: "Identify sequencing words, reference signals, and basic organisational patterns in short texts.", sequenceOrder: 1 },
  { id: "E2R3-02", topicId: "curriculum_topic_eng_f2_a3_reference_sequence_and_text_organisation", code: "E2R3-02", nodeType: MasteryNodeType.PROCEDURE, title: "Track sequence and reference accurately", learningObjective: "Follow who, what, and when across short passages using reference and sequence clues.", sequenceOrder: 2 },
  { id: "E2R3-03", topicId: "curriculum_topic_eng_f2_a3_reference_sequence_and_text_organisation", code: "E2R3-03", nodeType: MasteryNodeType.PROCEDURE, title: "Reconstruct text order and organisation", learningObjective: "Re-order simple text parts or explain how a text is organised.", sequenceOrder: 3 },
  { id: "E2R3-04", topicId: "curriculum_topic_eng_f2_a3_reference_sequence_and_text_organisation", code: "E2R3-04", nodeType: MasteryNodeType.APPLICATION, title: "Use organisation clues to explain meaning", learningObjective: "Show how sequence and organisation help readers understand a text more clearly.", sequenceOrder: 4 },

  { id: "E2G1-01", topicId: "curriculum_topic_eng_f2_b1_tense_consistency_and_sentence_control", code: "E2G1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise tense shifts and sentence control issues", learningObjective: "Spot where tense consistency or sentence control breaks down in linked writing.", sequenceOrder: 1 },
  { id: "E2G1-02", topicId: "curriculum_topic_eng_f2_b1_tense_consistency_and_sentence_control", code: "E2G1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Maintain tense across linked sentences", learningObjective: "Use stable tense choice across a short paragraph unless a clear shift is needed.", sequenceOrder: 2 },
  { id: "E2G1-03", topicId: "curriculum_topic_eng_f2_b1_tense_consistency_and_sentence_control", code: "E2G1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Control sentence accuracy while extending ideas", learningObjective: "Keep sentences accurate while adding extra detail or linked information.", sequenceOrder: 3 },
  { id: "E2G1-04", topicId: "curriculum_topic_eng_f2_b1_tense_consistency_and_sentence_control", code: "E2G1-04", nodeType: MasteryNodeType.APPLICATION, title: "Edit paragraph-level tense and control errors", learningObjective: "Revise short writing so tense and sentence control remain consistent throughout.", sequenceOrder: 4 },

  { id: "E2G2-01", topicId: "curriculum_topic_eng_f2_b2_modals_questions_and_functional_grammar", code: "E2G2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise modal meaning and question purpose", learningObjective: "Identify basic functions of modals and common question forms in context.", sequenceOrder: 1 },
  { id: "E2G2-02", topicId: "curriculum_topic_eng_f2_b2_modals_questions_and_functional_grammar", code: "E2G2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use modals and question forms accurately", learningObjective: "Form suitable modal expressions and questions for common practical situations.", sequenceOrder: 2 },
  { id: "E2G2-03", topicId: "curriculum_topic_eng_f2_b2_modals_questions_and_functional_grammar", code: "E2G2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Match grammar to communicative purpose", learningObjective: "Choose grammar forms that fit requesting, advising, asking, or explaining purposes.", sequenceOrder: 3 },
  { id: "E2G2-04", topicId: "curriculum_topic_eng_f2_b2_modals_questions_and_functional_grammar", code: "E2G2-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply functional grammar in realistic tasks", learningObjective: "Use modals and question forms naturally in practical message or dialogue tasks.", sequenceOrder: 4 },

  { id: "E2G3-01", topicId: "curriculum_topic_eng_f2_b3_clauses_connectors_and_sentence_variety", code: "E2G3-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise clause and connector patterns", learningObjective: "Identify how clauses and connectors expand meaning inside simple texts.", sequenceOrder: 1 },
  { id: "E2G3-02", topicId: "curriculum_topic_eng_f2_b3_clauses_connectors_and_sentence_variety", code: "E2G3-02", nodeType: MasteryNodeType.PROCEDURE, title: "Combine ideas using suitable connectors", learningObjective: "Join ideas with connectors that show addition, contrast, cause, or sequence.", sequenceOrder: 2 },
  { id: "E2G3-03", topicId: "curriculum_topic_eng_f2_b3_clauses_connectors_and_sentence_variety", code: "E2G3-03", nodeType: MasteryNodeType.PROCEDURE, title: "Create sentence variety with clause control", learningObjective: "Use different sentence patterns to make writing clearer and less repetitive.", sequenceOrder: 3 },
  { id: "E2G3-04", topicId: "curriculum_topic_eng_f2_b3_clauses_connectors_and_sentence_variety", code: "E2G3-04", nodeType: MasteryNodeType.APPLICATION, title: "Revise writing for variety and flow", learningObjective: "Improve a short text by strengthening clause use, connectors, and sentence flow.", sequenceOrder: 4 },

  { id: "E2V1-01", topicId: "curriculum_topic_eng_f2_c1_vocabulary_precision_in_context", code: "E2V1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise when context narrows meaning", learningObjective: "Notice when context removes ambiguity and points to a more precise meaning.", sequenceOrder: 1 },
  { id: "E2V1-02", topicId: "curriculum_topic_eng_f2_c1_vocabulary_precision_in_context", code: "E2V1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Select the most precise contextual meaning", learningObjective: "Choose the best-fitting meaning for a word based on sentence and passage context.", sequenceOrder: 2 },
  { id: "E2V1-03", topicId: "curriculum_topic_eng_f2_c1_vocabulary_precision_in_context", code: "E2V1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Replace vague words with better choices", learningObjective: "Revise simple sentences using more precise vocabulary that fits context and tone.", sequenceOrder: 3 },
  { id: "E2V1-04", topicId: "curriculum_topic_eng_f2_c1_vocabulary_precision_in_context", code: "E2V1-04", nodeType: MasteryNodeType.APPLICATION, title: "Use precise contextual vocabulary in short writing", learningObjective: "Apply better word choice in a short written response for clarity and effect.", sequenceOrder: 4 },

  { id: "E2V2-01", topicId: "curriculum_topic_eng_f2_c2_word_formation_and_lexical_relationships", code: "E2V2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise word family and formation clues", learningObjective: "Identify familiar prefixes, suffixes, base words, and word-family relationships.", sequenceOrder: 1 },
  { id: "E2V2-02", topicId: "curriculum_topic_eng_f2_c2_word_formation_and_lexical_relationships", code: "E2V2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use word formation to predict meaning", learningObjective: "Use common word parts to predict or check meaning in context.", sequenceOrder: 2 },
  { id: "E2V2-03", topicId: "curriculum_topic_eng_f2_c2_word_formation_and_lexical_relationships", code: "E2V2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Use lexical relationships more accurately", learningObjective: "Choose synonyms, antonyms, categories, or collocations that fit the intended meaning.", sequenceOrder: 3 },
  { id: "E2V2-04", topicId: "curriculum_topic_eng_f2_c2_word_formation_and_lexical_relationships", code: "E2V2-04", nodeType: MasteryNodeType.APPLICATION, title: "Apply word-family knowledge in reading and writing", learningObjective: "Use word-relationship knowledge to improve understanding and written expression.", sequenceOrder: 4 },

  { id: "E2W1-01", topicId: "curriculum_topic_eng_f2_d1_paragraph_development_and_coherence", code: "E2W1-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise stronger paragraph organisation", learningObjective: "Identify how topic, support, and sequencing create a coherent paragraph.", sequenceOrder: 1 },
  { id: "E2W1-02", topicId: "curriculum_topic_eng_f2_d1_paragraph_development_and_coherence", code: "E2W1-02", nodeType: MasteryNodeType.PROCEDURE, title: "Expand support within a paragraph", learningObjective: "Add relevant examples, reasons, or details to strengthen a paragraph idea.", sequenceOrder: 2 },
  { id: "E2W1-03", topicId: "curriculum_topic_eng_f2_d1_paragraph_development_and_coherence", code: "E2W1-03", nodeType: MasteryNodeType.PROCEDURE, title: "Use coherence devices to improve flow", learningObjective: "Use repetition, reference, and connectors to make a paragraph flow more clearly.", sequenceOrder: 3 },
  { id: "E2W1-04", topicId: "curriculum_topic_eng_f2_d1_paragraph_development_and_coherence", code: "E2W1-04", nodeType: MasteryNodeType.APPLICATION, title: "Write a coherent supported paragraph", learningObjective: "Produce a paragraph with a clear focus, relevant support, and logical sequencing.", sequenceOrder: 4 },

  { id: "E2W2-01", topicId: "curriculum_topic_eng_f2_d2_guided_short_responses_and_functional_writing", code: "E2W2-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise purpose, format, and audience needs", learningObjective: "Identify what a guided or practical writing task needs in terms of purpose, format, and audience.", sequenceOrder: 1 },
  { id: "E2W2-02", topicId: "curriculum_topic_eng_f2_d2_guided_short_responses_and_functional_writing", code: "E2W2-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plan guided short responses more effectively", learningObjective: "Organise key content points before writing a short guided or practical response.", sequenceOrder: 2 },
  { id: "E2W2-03", topicId: "curriculum_topic_eng_f2_d2_guided_short_responses_and_functional_writing", code: "E2W2-03", nodeType: MasteryNodeType.PROCEDURE, title: "Write fit-for-purpose functional texts", learningObjective: "Write short functional texts with more complete structure and suitable language choices.", sequenceOrder: 3 },
  { id: "E2W2-04", topicId: "curriculum_topic_eng_f2_d2_guided_short_responses_and_functional_writing", code: "E2W2-04", nodeType: MasteryNodeType.APPLICATION, title: "Deliver a complete guided or functional response", learningObjective: "Produce a short response that clearly fits task, audience, and communication purpose.", sequenceOrder: 4 },
];

const englishForm2Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_eng_f2_a1_compare_main_ideas_and_supporting_details",
    code: "comparison-without-contrast",
    label: "Comparison without contrast",
    description: "Student mentions two texts but does not clearly compare how their ideas or support differ.",
    remedialStrategy: "Use side-by-side comparison frames before writing full answers.",
  },
  {
    topicId: "curriculum_topic_eng_f2_a2_inference_tone_and_point_of_view",
    code: "tone-as-topic-confusion",
    label: "Tone treated as topic",
    description: "Student explains what the text is about but not how the writer sounds or feels.",
    remedialStrategy: "Separate what the text says from how the writer says it.",
  },
  {
    topicId: "curriculum_topic_eng_f2_a3_reference_sequence_and_text_organisation",
    code: "sequence-order-loss",
    label: "Sequence order loss",
    description: "Student understands single sentences but loses track of order and organisation across the whole text.",
    remedialStrategy: "Reconstruct sequence using timeline or numbered event frames.",
  },
  {
    topicId: "curriculum_topic_eng_f2_b1_tense_consistency_and_sentence_control",
    code: "paragraph-level-tense-drift",
    label: "Paragraph-level tense drift",
    description: "Student can write correct sentences in isolation but drifts across tenses in a paragraph.",
    remedialStrategy: "Anchor the whole paragraph to one time frame before editing details.",
  },
  {
    topicId: "curriculum_topic_eng_f2_b2_modals_questions_and_functional_grammar",
    code: "function-form-mismatch",
    label: "Function and form mismatch",
    description: "Student uses a grammatical form that does not fit the social or communicative purpose of the task.",
    remedialStrategy: "Link modal and question choices directly to request, advice, or explanation functions.",
  },
  {
    topicId: "curriculum_topic_eng_f2_b3_clauses_connectors_and_sentence_variety",
    code: "connector-overload",
    label: "Connector overload",
    description: "Student adds connectors, but the sentence becomes awkward or less clear.",
    remedialStrategy: "Choose one clear relationship at a time before expanding the sentence.",
  },
  {
    topicId: "curriculum_topic_eng_f2_c1_vocabulary_precision_in_context",
    code: "almost-right-vocabulary",
    label: "Almost-right vocabulary",
    description: "Student chooses a word that is close in meaning but not precise enough for the sentence or tone.",
    remedialStrategy: "Compare near-synonyms and discuss why one fits better.",
  },
  {
    topicId: "curriculum_topic_eng_f2_c2_word_formation_and_lexical_relationships",
    code: "word-family-form-error",
    label: "Wrong form in the right family",
    description: "Student identifies the right word family but uses the wrong form for the sentence role.",
    remedialStrategy: "Check noun, verb, adjective, and adverb roles before final selection.",
  },
  {
    topicId: "curriculum_topic_eng_f2_d1_paragraph_development_and_coherence",
    code: "support-without-link",
    label: "Support without coherence",
    description: "Student includes supporting ideas, but they do not connect clearly back to the main point.",
    remedialStrategy: "Restate the paragraph focus and attach each support sentence to it explicitly.",
  },
  {
    topicId: "curriculum_topic_eng_f2_d2_guided_short_responses_and_functional_writing",
    code: "task-fit-but-thin-content",
    label: "Task fit but thin content",
    description: "Student follows the format but gives too little content or explanation to satisfy the task.",
    remedialStrategy: "Use a planning frame with must-include content points before drafting.",
  },
];

const englishForm2MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "E2R1-01", toNodeId: "E2R1-02" },
  { fromNodeId: "E2R1-02", toNodeId: "E2R1-03" },
  { fromNodeId: "E2R1-03", toNodeId: "E2R1-04" },
  { fromNodeId: "E2R1-03", toNodeId: "E2R2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E2R2-01", toNodeId: "E2R2-02" },
  { fromNodeId: "E2R2-02", toNodeId: "E2R2-03" },
  { fromNodeId: "E2R2-03", toNodeId: "E2R2-04" },
  { fromNodeId: "E2R1-02", toNodeId: "E2R3-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E2R3-01", toNodeId: "E2R3-02" },
  { fromNodeId: "E2R3-02", toNodeId: "E2R3-03" },
  { fromNodeId: "E2R3-03", toNodeId: "E2R3-04" },
  { fromNodeId: "E2G1-01", toNodeId: "E2G1-02" },
  { fromNodeId: "E2G1-02", toNodeId: "E2G1-03" },
  { fromNodeId: "E2G1-03", toNodeId: "E2G1-04" },
  { fromNodeId: "E2G1-03", toNodeId: "E2G2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E2G2-01", toNodeId: "E2G2-02" },
  { fromNodeId: "E2G2-02", toNodeId: "E2G2-03" },
  { fromNodeId: "E2G2-03", toNodeId: "E2G2-04" },
  { fromNodeId: "E2G2-03", toNodeId: "E2G3-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E2G3-01", toNodeId: "E2G3-02" },
  { fromNodeId: "E2G3-02", toNodeId: "E2G3-03" },
  { fromNodeId: "E2G3-03", toNodeId: "E2G3-04" },
  { fromNodeId: "E2R3-02", toNodeId: "E2V1-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E2V1-01", toNodeId: "E2V1-02" },
  { fromNodeId: "E2V1-02", toNodeId: "E2V1-03" },
  { fromNodeId: "E2V1-03", toNodeId: "E2V1-04" },
  { fromNodeId: "E2V1-03", toNodeId: "E2V2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E2V2-01", toNodeId: "E2V2-02" },
  { fromNodeId: "E2V2-02", toNodeId: "E2V2-03" },
  { fromNodeId: "E2V2-03", toNodeId: "E2V2-04" },
  { fromNodeId: "E2G3-03", toNodeId: "E2W1-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E2W1-01", toNodeId: "E2W1-02" },
  { fromNodeId: "E2W1-02", toNodeId: "E2W1-03" },
  { fromNodeId: "E2W1-03", toNodeId: "E2W1-04" },
  { fromNodeId: "E2W1-03", toNodeId: "E2W2-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "E2W2-01", toNodeId: "E2W2-02" },
  { fromNodeId: "E2W2-02", toNodeId: "E2W2-03" },
  { fromNodeId: "E2W2-03", toNodeId: "E2W2-04" },
];

const englishForm1Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_eng_f1_a1_main_ideas_and_explicit_information",
    code: "detail-instead-of-main-idea",
    label: "Detail instead of main idea",
    description: "Student chooses an interesting detail instead of the central point of the passage.",
    remedialStrategy: "Compare one main idea with several supporting details before answering independently.",
  },
  {
    topicId: "curriculum_topic_eng_f1_a2_inference_and_supporting_evidence",
    code: "guess-without-evidence",
    label: "Guess without evidence",
    description: "Student makes a reasonable guess but cannot point to the text clues that support it.",
    remedialStrategy: "Require one clue sentence and one inference sentence as paired steps.",
  },
  {
    topicId: "curriculum_topic_eng_f1_a3_reference_and_context_clues",
    code: "pronoun-reference-drift",
    label: "Pronoun reference drift",
    description: "Student loses track of what pronouns or reference words point to across nearby sentences.",
    remedialStrategy: "Underline reference words and draw arrows to their noun targets first.",
  },
  {
    topicId: "curriculum_topic_eng_f1_b2_tenses_and_subject_verb_agreement",
    code: "tense-switch-without-reason",
    label: "Unstable tense switching",
    description: "Student changes tense or verb form without a clear time reason.",
    remedialStrategy: "Anchor every sentence to a time cue before checking the verb form.",
  },
  {
    topicId: "curriculum_topic_eng_f1_b3_sentence_construction_and_transformation",
    code: "fragment-and-run-on-mixup",
    label: "Fragment and run-on mix-up",
    description: "Student writes sentence parts as full sentences or joins ideas without control.",
    remedialStrategy: "Use subject + verb checking before expansion or joining tasks.",
  },
  {
    topicId: "curriculum_topic_eng_f1_c1_vocabulary_in_context",
    code: "dictionary-meaning-overload",
    label: "Wrong meaning from familiar word",
    description: "Student picks a familiar word meaning instead of the meaning that fits the passage.",
    remedialStrategy: "Compare two possible meanings and choose the one that matches nearby clues.",
  },
  {
    topicId: "curriculum_topic_eng_f1_c2_word_choice_and_relationships",
    code: "imprecise-word-choice",
    label: "Imprecise word choice",
    description: "Student uses a general or almost-correct word that weakens clarity or tone.",
    remedialStrategy: "Offer two close alternatives and explain which one better fits purpose and tone.",
  },
  {
    topicId: "curriculum_topic_eng_f1_d1_sentence_to_paragraph_writing",
    code: "paragraph-without-focus",
    label: "Paragraph without focus",
    description: "Student writes several related sentences but without a clear main point or sequence.",
    remedialStrategy: "Start with one topic sentence, then attach support sentences under it.",
  },
  {
    topicId: "curriculum_topic_eng_f1_d2_guided_and_functional_writing",
    code: "format-purpose-mismatch",
    label: "Format and purpose mismatch",
    description: "Student includes ideas, but the response does not match the required task format or audience.",
    remedialStrategy: "Preview model formats before independent guided writing.",
  },
];

const englishForm1MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "MI-01", toNodeId: "MI-02" },
  { fromNodeId: "MI-02", toNodeId: "MI-03" },
  { fromNodeId: "MI-03", toNodeId: "MI-04" },
  { fromNodeId: "MI-03", toNodeId: "IN-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "IN-01", toNodeId: "IN-02" },
  { fromNodeId: "IN-02", toNodeId: "IN-03" },
  { fromNodeId: "IN-03", toNodeId: "IN-04" },
  { fromNodeId: "MI-02", toNodeId: "RC-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "RC-01", toNodeId: "RC-02" },
  { fromNodeId: "RC-02", toNodeId: "RC-03" },
  { fromNodeId: "RC-03", toNodeId: "RC-04" },
  { fromNodeId: "PS-01", toNodeId: "PS-02" },
  { fromNodeId: "PS-02", toNodeId: "PS-03" },
  { fromNodeId: "PS-03", toNodeId: "PS-04" },
  { fromNodeId: "PS-03", toNodeId: "TS-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "TS-01", toNodeId: "TS-02" },
  { fromNodeId: "TS-02", toNodeId: "TS-03" },
  { fromNodeId: "TS-03", toNodeId: "TS-04" },
  { fromNodeId: "TS-03", toNodeId: "SC-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "SC-01", toNodeId: "SC-02" },
  { fromNodeId: "SC-02", toNodeId: "SC-03" },
  { fromNodeId: "SC-03", toNodeId: "SC-04" },
  { fromNodeId: "RC-03", toNodeId: "VC-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "VC-01", toNodeId: "VC-02" },
  { fromNodeId: "VC-02", toNodeId: "VC-03" },
  { fromNodeId: "VC-03", toNodeId: "VC-04" },
  { fromNodeId: "VC-03", toNodeId: "WW-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "WW-01", toNodeId: "WW-02" },
  { fromNodeId: "WW-02", toNodeId: "WW-03" },
  { fromNodeId: "WW-03", toNodeId: "WW-04" },
  { fromNodeId: "SC-03", toNodeId: "PW-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "PW-01", toNodeId: "PW-02" },
  { fromNodeId: "PW-02", toNodeId: "PW-03" },
  { fromNodeId: "PW-03", toNodeId: "PW-04" },
  { fromNodeId: "PW-03", toNodeId: "GW-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "GW-01", toNodeId: "GW-02" },
  { fromNodeId: "GW-02", toNodeId: "GW-03" },
  { fromNodeId: "GW-03", toNodeId: "GW-04" },
];

const form2Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainForm2Patterns,
    code: "A",
    name: "Patterns and Algebra",
    description: "Patterns, symbolic manipulation, algebraic fractions, and formula fluency.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainForm2Geometry,
    code: "B",
    name: "Geometry and Spatial Reasoning",
    description: "Polygons, circles, and three-dimensional shape understanding.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainForm2Graphs,
    code: "C",
    name: "Graphs and Motion",
    description: "Coordinate reasoning, straight-line graphs, gradient, and motion relationships.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainForm2Data,
    code: "D",
    name: "Transformations and Data",
    description: "Spatial transformations, measures of central tendency, and introductory probability.",
    sequenceOrder: 4,
  },
];

const form2Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_f2_a1_patterns_and_sequences",
    domainId: curriculumIds.domainForm2Patterns,
    code: "A1",
    name: "Patterns and Sequences",
    summary: "Recognise, extend, and generalise number and visual patterns.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f2_a2_expansion_and_factorisation",
    domainId: curriculumIds.domainForm2Patterns,
    code: "A2",
    name: "Expansion and Factorisation",
    summary: "Expand algebraic expressions and reverse them through basic factorisation.",
    prerequisiteSummary: "Algebraic expressions from Form 1.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f2_a3_algebraic_fractions_and_formulae",
    domainId: curriculumIds.domainForm2Patterns,
    code: "A3",
    name: "Algebraic Fractions and Formulae",
    summary: "Simplify algebraic fractions and substitute values into formulas correctly.",
    prerequisiteSummary: "Expansion, factorisation, and rational number fluency.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f2_b1_polygons_and_angle_relationships",
    domainId: curriculumIds.domainForm2Geometry,
    code: "B1",
    name: "Polygons and Angle Relationships",
    summary: "Use polygon properties and interior-angle relationships confidently.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f2_b2_circles",
    domainId: curriculumIds.domainForm2Geometry,
    code: "B2",
    name: "Circles",
    summary: "Understand circle parts, angle ideas, and standard circle measures.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f2_b3_three_dimensional_shapes",
    domainId: curriculumIds.domainForm2Geometry,
    code: "B3",
    name: "Three-Dimensional Shapes",
    summary: "Relate nets, faces, edges, and views of common 3D shapes.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f2_c1_coordinates",
    domainId: curriculumIds.domainForm2Graphs,
    code: "C1",
    name: "Coordinates",
    summary: "Plot, read, and reason with coordinates on the Cartesian plane.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 90,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f2_c2_linear_graphs_and_gradient",
    domainId: curriculumIds.domainForm2Graphs,
    code: "C2",
    name: "Linear Graphs and Gradient",
    summary: "Interpret straight-line graphs and connect slope to real meaning.",
    prerequisiteSummary: "Coordinates and linear relationship awareness.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f2_c3_speed_and_acceleration",
    domainId: curriculumIds.domainForm2Graphs,
    code: "C3",
    name: "Speed and Acceleration",
    summary: "Use motion representations to compare speed changes and simple acceleration.",
    prerequisiteSummary: "Rates and straight-line graph interpretation.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f2_d1_transformations",
    domainId: curriculumIds.domainForm2Data,
    code: "D1",
    name: "Transformations",
    summary: "Describe and perform translations, reflections, and rotations.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f2_d2_measures_of_central_tendency",
    domainId: curriculumIds.domainForm2Data,
    code: "D2",
    name: "Measures of Central Tendency",
    summary: "Organise data and choose mean, median, or mode appropriately.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f2_d3_simple_probability",
    domainId: curriculumIds.domainForm2Data,
    code: "D3",
    name: "Simple Probability",
    summary: "Represent probability values and solve basic event questions.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 3,
  },
];

const form2MasteryNodes: MasteryNodeSeed[] = [
  {
    id: "PS-01",
    topicId: "curriculum_topic_f2_a1_patterns_and_sequences",
    code: "PS-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise growing and repeating patterns",
    learningObjective: "Identify pattern rules from number and visual examples.",
    sequenceOrder: 1,
  },
  {
    id: "PS-02",
    topicId: "curriculum_topic_f2_a1_patterns_and_sequences",
    code: "PS-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Extend sequence terms accurately",
    learningObjective: "Generate next terms in arithmetic and simple visual sequences.",
    sequenceOrder: 2,
  },
  {
    id: "PS-03",
    topicId: "curriculum_topic_f2_a1_patterns_and_sequences",
    code: "PS-03",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Describe the general pattern rule",
    learningObjective: "Explain pattern growth verbally or with a simple algebraic rule.",
    sequenceOrder: 3,
  },
  {
    id: "PS-04",
    topicId: "curriculum_topic_f2_a1_patterns_and_sequences",
    code: "PS-04",
    nodeType: MasteryNodeType.RETENTION,
    title: "Retain sequence rule fluency",
    learningObjective: "Return to sequence tasks after review and recover the rule accurately.",
    sequenceOrder: 4,
  },
  {
    id: "EF-01",
    topicId: "curriculum_topic_f2_a2_expansion_and_factorisation",
    code: "EF-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise equivalent algebraic forms",
    learningObjective: "See when an expression is shown in expanded or factored form.",
    sequenceOrder: 1,
  },
  {
    id: "EF-02",
    topicId: "curriculum_topic_f2_a2_expansion_and_factorisation",
    code: "EF-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Expand single-bracket expressions",
    learningObjective: "Use the distributive property accurately for single brackets.",
    sequenceOrder: 2,
  },
  {
    id: "EF-03",
    topicId: "curriculum_topic_f2_a2_expansion_and_factorisation",
    code: "EF-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Factorise common terms",
    learningObjective: "Factor out a common numerical or algebraic term correctly.",
    sequenceOrder: 3,
  },
  {
    id: "EF-04",
    topicId: "curriculum_topic_f2_a2_expansion_and_factorisation",
    code: "EF-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Switch between expanded and factored forms in context",
    learningObjective: "Choose the more useful form of an expression for solving or comparing.",
    sequenceOrder: 4,
  },
  {
    id: "AF-01",
    topicId: "curriculum_topic_f2_a3_algebraic_fractions_and_formulae",
    code: "AF-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise algebraic fraction structure",
    learningObjective: "Identify numerator, denominator, and valid simplification opportunities.",
    sequenceOrder: 1,
  },
  {
    id: "AF-02",
    topicId: "curriculum_topic_f2_a3_algebraic_fractions_and_formulae",
    code: "AF-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Simplify algebraic fractions",
    learningObjective: "Cancel common factors safely when simplifying algebraic fractions.",
    sequenceOrder: 2,
  },
  {
    id: "AF-03",
    topicId: "curriculum_topic_f2_a3_algebraic_fractions_and_formulae",
    code: "AF-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Substitute values into formulas",
    learningObjective: "Replace variables with values correctly and evaluate the result.",
    sequenceOrder: 3,
  },
  {
    id: "AF-04",
    topicId: "curriculum_topic_f2_a3_algebraic_fractions_and_formulae",
    code: "AF-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use formulas and algebraic fractions in context",
    learningObjective: "Apply substitution and simplification in short contextual tasks.",
    sequenceOrder: 4,
  },
  {
    id: "PA-01",
    topicId: "curriculum_topic_f2_b1_polygons_and_angle_relationships",
    code: "PA-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify polygon classes and properties",
    learningObjective: "Recognise side, angle, and regularity properties of polygons.",
    sequenceOrder: 1,
  },
  {
    id: "PA-02",
    topicId: "curriculum_topic_f2_b1_polygons_and_angle_relationships",
    code: "PA-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Use interior angle relationships",
    learningObjective: "Calculate unknown interior angles in polygons and simple diagrams.",
    sequenceOrder: 2,
  },
  {
    id: "PA-03",
    topicId: "curriculum_topic_f2_b1_polygons_and_angle_relationships",
    code: "PA-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Use exterior angle relationships",
    learningObjective: "Apply exterior angle rules to solve polygon angle questions.",
    sequenceOrder: 3,
  },
  {
    id: "PA-04",
    topicId: "curriculum_topic_f2_b1_polygons_and_angle_relationships",
    code: "PA-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Reason with polygon angle problems",
    learningObjective: "Combine polygon properties and angle rules in mixed diagrams.",
    sequenceOrder: 4,
  },
  {
    id: "CR-01",
    topicId: "curriculum_topic_f2_b2_circles",
    code: "CR-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify circle parts",
    learningObjective: "Recognise radius, diameter, chord, arc, sector, and tangent language.",
    sequenceOrder: 1,
  },
  {
    id: "CR-02",
    topicId: "curriculum_topic_f2_b2_circles",
    code: "CR-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Use basic circle relationships",
    learningObjective: "Apply simple relationships between diameter, radius, and equal chords.",
    sequenceOrder: 2,
  },
  {
    id: "CR-03",
    topicId: "curriculum_topic_f2_b2_circles",
    code: "CR-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Interpret circle diagrams",
    learningObjective: "Extract correct information from circle diagrams before solving.",
    sequenceOrder: 3,
  },
  {
    id: "CR-04",
    topicId: "curriculum_topic_f2_b2_circles",
    code: "CR-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Solve simple circle-based geometry tasks",
    learningObjective: "Use circle properties in short geometry problems and real-life contexts.",
    sequenceOrder: 4,
  },
  {
    id: "TS-01",
    topicId: "curriculum_topic_f2_b3_three_dimensional_shapes",
    code: "TS-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Identify common 3D shapes",
    learningObjective: "Recognise prisms, pyramids, cylinders, cones, and spheres accurately.",
    sequenceOrder: 1,
  },
  {
    id: "TS-02",
    topicId: "curriculum_topic_f2_b3_three_dimensional_shapes",
    code: "TS-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Match nets to 3D shapes",
    learningObjective: "Relate nets to the correct three-dimensional object.",
    sequenceOrder: 2,
  },
  {
    id: "TS-03",
    topicId: "curriculum_topic_f2_b3_three_dimensional_shapes",
    code: "TS-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Count faces, edges, and vertices",
    learningObjective: "Describe 3D shape structure using consistent properties.",
    sequenceOrder: 3,
  },
  {
    id: "TS-04",
    topicId: "curriculum_topic_f2_b3_three_dimensional_shapes",
    code: "TS-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Interpret views and structure of 3D objects",
    learningObjective: "Use nets and views to reason about real 3D objects.",
    sequenceOrder: 4,
  },
  {
    id: "CO-01",
    topicId: "curriculum_topic_f2_c1_coordinates",
    code: "CO-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Read coordinate pairs correctly",
    learningObjective: "Identify x- and y-values in ordered pairs and basic plots.",
    sequenceOrder: 1,
  },
  {
    id: "CO-02",
    topicId: "curriculum_topic_f2_c1_coordinates",
    code: "CO-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Plot points on the Cartesian plane",
    learningObjective: "Place coordinates accurately in the correct location.",
    sequenceOrder: 2,
  },
  {
    id: "CO-03",
    topicId: "curriculum_topic_f2_c1_coordinates",
    code: "CO-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Describe movement between coordinates",
    learningObjective: "Track horizontal and vertical changes between plotted points.",
    sequenceOrder: 3,
  },
  {
    id: "CO-04",
    topicId: "curriculum_topic_f2_c1_coordinates",
    code: "CO-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use coordinates in geometry contexts",
    learningObjective: "Solve simple shape and movement tasks using coordinates.",
    sequenceOrder: 4,
  },
  {
    id: "LG-01",
    topicId: "curriculum_topic_f2_c2_linear_graphs_and_gradient",
    code: "LG-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise straight-line graph features",
    learningObjective: "Identify axes, intercepts, and increasing or decreasing trends.",
    sequenceOrder: 1,
  },
  {
    id: "LG-02",
    topicId: "curriculum_topic_f2_c2_linear_graphs_and_gradient",
    code: "LG-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Calculate gradient from points or graph",
    learningObjective: "Use change in y over change in x to find gradient correctly.",
    sequenceOrder: 2,
  },
  {
    id: "LG-03",
    topicId: "curriculum_topic_f2_c2_linear_graphs_and_gradient",
    code: "LG-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Interpret gradient meaning",
    learningObjective: "Explain what gradient represents in a given context.",
    sequenceOrder: 3,
  },
  {
    id: "LG-04",
    topicId: "curriculum_topic_f2_c2_linear_graphs_and_gradient",
    code: "LG-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use linear graphs to compare change",
    learningObjective: "Read and compare real-world trends using straight-line graphs.",
    sequenceOrder: 4,
  },
  {
    id: "SA-01",
    topicId: "curriculum_topic_f2_c3_speed_and_acceleration",
    code: "SA-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise speed and acceleration information",
    learningObjective: "Identify which quantities describe speed, distance, time, and acceleration.",
    sequenceOrder: 1,
  },
  {
    id: "SA-02",
    topicId: "curriculum_topic_f2_c3_speed_and_acceleration",
    code: "SA-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Use distance-time and speed relationships",
    learningObjective: "Calculate simple speed or time relationships accurately.",
    sequenceOrder: 2,
  },
  {
    id: "SA-03",
    topicId: "curriculum_topic_f2_c3_speed_and_acceleration",
    code: "SA-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Read motion graph trends",
    learningObjective: "Interpret steady, increasing, or changing movement from simple graphs.",
    sequenceOrder: 3,
  },
  {
    id: "SA-04",
    topicId: "curriculum_topic_f2_c3_speed_and_acceleration",
    code: "SA-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Solve motion comparison problems",
    learningObjective: "Compare journeys or motion situations using rate and graph evidence.",
    sequenceOrder: 4,
  },
  {
    id: "TR-01",
    topicId: "curriculum_topic_f2_d1_transformations",
    code: "TR-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise transformation types",
    learningObjective: "Differentiate translation, reflection, and rotation in visual tasks.",
    sequenceOrder: 1,
  },
  {
    id: "TR-02",
    topicId: "curriculum_topic_f2_d1_transformations",
    code: "TR-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Describe translations and reflections",
    learningObjective: "Use direction, distance, and mirror-line language accurately.",
    sequenceOrder: 2,
  },
  {
    id: "TR-03",
    topicId: "curriculum_topic_f2_d1_transformations",
    code: "TR-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Describe simple rotations",
    learningObjective: "State turn direction, centre, and angle for simple rotations.",
    sequenceOrder: 3,
  },
  {
    id: "TR-04",
    topicId: "curriculum_topic_f2_d1_transformations",
    code: "TR-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use transformations on coordinate grids",
    learningObjective: "Map shapes through transformations and justify the move correctly.",
    sequenceOrder: 4,
  },
  {
    id: "CT-01",
    topicId: "curriculum_topic_f2_d2_measures_of_central_tendency",
    code: "CT-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise mean, median, and mode",
    learningObjective: "Identify the meaning of each central tendency measure.",
    sequenceOrder: 1,
  },
  {
    id: "CT-02",
    topicId: "curriculum_topic_f2_d2_measures_of_central_tendency",
    code: "CT-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Calculate mean, median, and mode",
    learningObjective: "Compute central tendency measures from simple data sets correctly.",
    sequenceOrder: 2,
  },
  {
    id: "CT-03",
    topicId: "curriculum_topic_f2_d2_measures_of_central_tendency",
    code: "CT-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Compare which measure fits the data",
    learningObjective: "Decide which measure is more useful based on the data shape or outlier.",
    sequenceOrder: 3,
  },
  {
    id: "CT-04",
    topicId: "curriculum_topic_f2_d2_measures_of_central_tendency",
    code: "CT-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use central tendency in context",
    learningObjective: "Interpret average-type measures in real data situations.",
    sequenceOrder: 4,
  },
  {
    id: "PR-01",
    topicId: "curriculum_topic_f2_d3_simple_probability",
    code: "PR-01",
    nodeType: MasteryNodeType.RECOGNITION,
    title: "Recognise probability values and event language",
    learningObjective: "Identify impossible, unlikely, equally likely, likely, and certain events.",
    sequenceOrder: 1,
  },
  {
    id: "PR-02",
    topicId: "curriculum_topic_f2_d3_simple_probability",
    code: "PR-02",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Find probability of simple events",
    learningObjective: "Calculate simple probabilities from equally likely outcomes.",
    sequenceOrder: 2,
  },
  {
    id: "PR-03",
    topicId: "curriculum_topic_f2_d3_simple_probability",
    code: "PR-03",
    nodeType: MasteryNodeType.PROCEDURE,
    title: "Represent probability in different forms",
    learningObjective: "Switch between words, fractions, decimals, and percentage probability values.",
    sequenceOrder: 3,
  },
  {
    id: "PR-04",
    topicId: "curriculum_topic_f2_d3_simple_probability",
    code: "PR-04",
    nodeType: MasteryNodeType.APPLICATION,
    title: "Use probability to compare outcomes",
    learningObjective: "Interpret simple chance situations and make justified comparisons.",
    sequenceOrder: 4,
  },
];

const form2Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_f2_a1_patterns_and_sequences",
    code: "pattern-step-skip",
    label: "Pattern step confusion",
    description: "Student notices the values change but cannot hold the pattern rule consistently across terms.",
    remedialStrategy: "Use table-and-difference prompts before asking for a general rule.",
  },
  {
    topicId: "curriculum_topic_f2_a2_expansion_and_factorisation",
    code: "distribution-break",
    label: "Distribution break",
    description: "Student expands only one term inside a bracket or drops a sign while distributing.",
    remedialStrategy: "Return to area-model or box-method representations before symbolic expansion.",
  },
  {
    topicId: "curriculum_topic_f2_a3_algebraic_fractions_and_formulae",
    code: "cancel-across-sum",
    label: "Invalid cancellation",
    description: "Student cancels terms across addition or subtraction instead of only common factors.",
    remedialStrategy: "Contrast factor cancellation with term cancellation using paired non-examples.",
  },
  {
    topicId: "curriculum_topic_f2_b1_polygons_and_angle_relationships",
    code: "polygon-angle-mix",
    label: "Polygon angle mix-up",
    description: "Student confuses interior and exterior angle ideas or uses the wrong polygon relationship.",
    remedialStrategy: "Separate interior and exterior cases with labelled colour-coded diagrams.",
  },
  {
    topicId: "curriculum_topic_f2_b2_circles",
    code: "circle-part-confusion",
    label: "Circle part confusion",
    description: "Student mixes radius, diameter, chord, and tangent vocabulary in diagrams.",
    remedialStrategy: "Use drag-and-label or flashcard identification before problem solving.",
  },
  {
    topicId: "curriculum_topic_f2_b3_three_dimensional_shapes",
    code: "net-to-shape-gap",
    label: "Net-to-shape gap",
    description: "Student can name a shape but fails to match its net or face structure.",
    remedialStrategy: "Use folding-sequence visuals or physical net comparisons.",
  },
  {
    topicId: "curriculum_topic_f2_c2_linear_graphs_and_gradient",
    code: "gradient-axis-swap",
    label: "Gradient axis swap",
    description: "Student reverses horizontal and vertical change or treats gradient as a point instead of a ratio.",
    remedialStrategy: "Rebuild with rise-over-run overlays on graph segments.",
  },
  {
    topicId: "curriculum_topic_f2_c3_speed_and_acceleration",
    code: "motion-graph-story-gap",
    label: "Motion graph story gap",
    description: "Student reads plotted lines but cannot connect them to what the motion means.",
    remedialStrategy: "Pair each graph with a verbal journey story before calculation.",
  },
  {
    topicId: "curriculum_topic_f2_d1_transformations",
    code: "rotation-centre-loss",
    label: "Rotation centre confusion",
    description: "Student rotates the shape visually but loses the centre or turning direction.",
    remedialStrategy: "Anchor the centre and use arrowed step-by-step rotation tracing.",
  },
  {
    topicId: "curriculum_topic_f2_d2_measures_of_central_tendency",
    code: "average-choice-blur",
    label: "Average choice blur",
    description: "Student can compute mean, median, and mode but cannot tell which is more suitable.",
    remedialStrategy: "Compare data sets with and without outliers before choosing the measure.",
  },
  {
    topicId: "curriculum_topic_f2_d3_simple_probability",
    code: "probability-scale-drift",
    label: "Probability scale drift",
    description: "Student gives answers outside the 0 to 1 range or confuses probability with raw frequency.",
    remedialStrategy: "Use probability line and favourable-over-total framing before practice.",
  },
];

const form2MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "PS-01", toNodeId: "PS-02" },
  { fromNodeId: "PS-02", toNodeId: "PS-03" },
  { fromNodeId: "PS-03", toNodeId: "PS-04", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "EF-01", toNodeId: "EF-02" },
  { fromNodeId: "EF-02", toNodeId: "EF-03" },
  { fromNodeId: "EF-03", toNodeId: "EF-04" },
  { fromNodeId: "EF-03", toNodeId: "AF-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "AF-01", toNodeId: "AF-02" },
  { fromNodeId: "AF-02", toNodeId: "AF-03" },
  { fromNodeId: "AF-03", toNodeId: "AF-04" },
  { fromNodeId: "PA-01", toNodeId: "PA-02" },
  { fromNodeId: "PA-02", toNodeId: "PA-03" },
  { fromNodeId: "PA-03", toNodeId: "PA-04" },
  { fromNodeId: "PA-03", toNodeId: "CR-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "CR-01", toNodeId: "CR-02" },
  { fromNodeId: "CR-02", toNodeId: "CR-03" },
  { fromNodeId: "CR-03", toNodeId: "CR-04" },
  { fromNodeId: "TS-01", toNodeId: "TS-02" },
  { fromNodeId: "TS-02", toNodeId: "TS-03" },
  { fromNodeId: "TS-03", toNodeId: "TS-04" },
  { fromNodeId: "CO-01", toNodeId: "CO-02" },
  { fromNodeId: "CO-02", toNodeId: "CO-03" },
  { fromNodeId: "CO-03", toNodeId: "CO-04" },
  { fromNodeId: "CO-03", toNodeId: "LG-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "LG-01", toNodeId: "LG-02" },
  { fromNodeId: "LG-02", toNodeId: "LG-03" },
  { fromNodeId: "LG-03", toNodeId: "LG-04" },
  { fromNodeId: "LG-03", toNodeId: "SA-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "SA-01", toNodeId: "SA-02" },
  { fromNodeId: "SA-02", toNodeId: "SA-03" },
  { fromNodeId: "SA-03", toNodeId: "SA-04" },
  { fromNodeId: "PA-04", toNodeId: "TR-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "TR-01", toNodeId: "TR-02" },
  { fromNodeId: "TR-02", toNodeId: "TR-03" },
  { fromNodeId: "TR-03", toNodeId: "TR-04" },
  { fromNodeId: "CT-01", toNodeId: "CT-02" },
  { fromNodeId: "CT-02", toNodeId: "CT-03" },
  { fromNodeId: "CT-03", toNodeId: "CT-04" },
  { fromNodeId: "CT-03", toNodeId: "PR-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "PR-01", toNodeId: "PR-02" },
  { fromNodeId: "PR-02", toNodeId: "PR-03" },
  { fromNodeId: "PR-03", toNodeId: "PR-04" },
];

const form3Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainForm3Number,
    code: "A",
    name: "Number Systems and Consumer Mathematics",
    description: "Indices, standard form, and financial reasoning in practical contexts.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainForm3Geometry,
    code: "B",
    name: "Geometry and Trigonometry",
    description: "Scale, trigonometric ratios, and circle-angle reasoning.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainForm3Spatial,
    code: "C",
    name: "Spatial Representation",
    description: "Plans, elevations, and loci for visual-spatial problem solving.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainForm3Graphs,
    code: "D",
    name: "Graphs and Linear Modelling",
    description: "Straight-line relationships, graph interpretation, and data-backed reasoning.",
    sequenceOrder: 4,
  },
];

const form3Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_f3_a1_indices_and_standard_form",
    domainId: curriculumIds.domainForm3Number,
    code: "A1",
    name: "Indices and Standard Form",
    summary: "Use indices fluently and express very large or small numbers in standard form.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f3_a2_savings_and_investment",
    domainId: curriculumIds.domainForm3Number,
    code: "A2",
    name: "Savings and Investment",
    summary: "Compare savings and investment choices using percentage growth and value tracking.",
    prerequisiteSummary: "Ratio, percentage, and algebra fluency from Forms 1–2.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f3_a3_credit_and_debt",
    domainId: curriculumIds.domainForm3Number,
    code: "A3",
    name: "Credit and Debt",
    summary: "Interpret borrowing, repayment, and financial obligation situations clearly.",
    prerequisiteSummary: "Rates, proportion, and consumer arithmetic.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f3_b1_scale_drawings",
    domainId: curriculumIds.domainForm3Geometry,
    code: "B1",
    name: "Scale Drawings",
    summary: "Use scales to interpret and construct drawings with correct proportional reasoning.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f3_b2_trigonometric_ratios",
    domainId: curriculumIds.domainForm3Geometry,
    code: "B2",
    name: "Trigonometric Ratios",
    summary: "Use sine, cosine, and tangent in right-triangle problems.",
    prerequisiteSummary: "Pythagoras’ Theorem and ratio reasoning.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 150,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f3_b3_angles_and_tangents_in_circles",
    domainId: curriculumIds.domainForm3Geometry,
    code: "B3",
    name: "Angles and Tangents in Circles",
    summary: "Apply tangent and angle rules in circle geometry diagrams.",
    prerequisiteSummary: "Circle vocabulary and angle relationships from Form 2.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f3_c1_plans_and_elevations",
    domainId: curriculumIds.domainForm3Spatial,
    code: "C1",
    name: "Plans and Elevations",
    summary: "Interpret top, front, and side views of three-dimensional objects.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f3_c2_loci_in_two_dimensions",
    domainId: curriculumIds.domainForm3Spatial,
    code: "C2",
    name: "Loci in Two Dimensions",
    summary: "Represent and interpret location rules using loci in two-dimensional space.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f3_d1_straight_lines",
    domainId: curriculumIds.domainForm3Graphs,
    code: "D1",
    name: "Straight Lines",
    summary: "Use gradient and intercept ideas to analyse and form straight-line relationships.",
    prerequisiteSummary: "Coordinates and gradient from Form 2.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f3_d2_data_and_decision_making",
    domainId: curriculumIds.domainForm3Graphs,
    code: "D2",
    name: "Data and Decision Making",
    summary: "Use data displays and probability-informed reasoning to justify decisions.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
];

const form3MasteryNodes: MasteryNodeSeed[] = [
  { id: "IS-01", topicId: "curriculum_topic_f3_a1_indices_and_standard_form", code: "IS-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise index notation and powers of ten", learningObjective: "Identify index forms and powers of ten used in standard form.", sequenceOrder: 1 },
  { id: "IS-02", topicId: "curriculum_topic_f3_a1_indices_and_standard_form", code: "IS-02", nodeType: MasteryNodeType.PROCEDURE, title: "Apply index laws", learningObjective: "Use simple positive index laws accurately in calculations.", sequenceOrder: 2 },
  { id: "IS-03", topicId: "curriculum_topic_f3_a1_indices_and_standard_form", code: "IS-03", nodeType: MasteryNodeType.PROCEDURE, title: "Convert numbers into standard form", learningObjective: "Write very large or very small numbers in standard form correctly.", sequenceOrder: 3 },
  { id: "IS-04", topicId: "curriculum_topic_f3_a1_indices_and_standard_form", code: "IS-04", nodeType: MasteryNodeType.APPLICATION, title: "Use standard form in context", learningObjective: "Interpret and compare values written in standard form in scientific or practical contexts.", sequenceOrder: 4 },

  { id: "SV-01", topicId: "curriculum_topic_f3_a2_savings_and_investment", code: "SV-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise saving and investment terms", learningObjective: "Identify principal, return, duration, and growth language in financial examples.", sequenceOrder: 1 },
  { id: "SV-02", topicId: "curriculum_topic_f3_a2_savings_and_investment", code: "SV-02", nodeType: MasteryNodeType.PROCEDURE, title: "Calculate simple savings growth", learningObjective: "Determine resulting value from simple growth or repeated increase situations.", sequenceOrder: 2 },
  { id: "SV-03", topicId: "curriculum_topic_f3_a2_savings_and_investment", code: "SV-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare investment options", learningObjective: "Compare two options using return, duration, and final value.", sequenceOrder: 3 },
  { id: "SV-04", topicId: "curriculum_topic_f3_a2_savings_and_investment", code: "SV-04", nodeType: MasteryNodeType.APPLICATION, title: "Justify a savings or investment choice", learningObjective: "Recommend an option and justify it with clear numerical evidence.", sequenceOrder: 4 },

  { id: "CD-01", topicId: "curriculum_topic_f3_a3_credit_and_debt", code: "CD-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise credit and debt terms", learningObjective: "Identify borrowing, balance, repayment, and total-cost language.", sequenceOrder: 1 },
  { id: "CD-02", topicId: "curriculum_topic_f3_a3_credit_and_debt", code: "CD-02", nodeType: MasteryNodeType.PROCEDURE, title: "Calculate repayment totals", learningObjective: "Calculate total repayment or outstanding balance from structured information.", sequenceOrder: 2 },
  { id: "CD-03", topicId: "curriculum_topic_f3_a3_credit_and_debt", code: "CD-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare debt options", learningObjective: "Compare payment schedules or debt choices using numerical evidence.", sequenceOrder: 3 },
  { id: "CD-04", topicId: "curriculum_topic_f3_a3_credit_and_debt", code: "CD-04", nodeType: MasteryNodeType.APPLICATION, title: "Evaluate responsible borrowing decisions", learningObjective: "Explain which credit option is more manageable and why.", sequenceOrder: 4 },

  { id: "SD-01", topicId: "curriculum_topic_f3_b1_scale_drawings", code: "SD-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise scale statements", learningObjective: "Interpret the meaning of common scale formats.", sequenceOrder: 1 },
  { id: "SD-02", topicId: "curriculum_topic_f3_b1_scale_drawings", code: "SD-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use scale to enlarge or reduce measurements", learningObjective: "Convert between drawing and actual measurements accurately.", sequenceOrder: 2 },
  { id: "SD-03", topicId: "curriculum_topic_f3_b1_scale_drawings", code: "SD-03", nodeType: MasteryNodeType.PROCEDURE, title: "Construct simple scale drawings", learningObjective: "Draw or interpret basic layouts using the correct scale.", sequenceOrder: 3 },
  { id: "SD-04", topicId: "curriculum_topic_f3_b1_scale_drawings", code: "SD-04", nodeType: MasteryNodeType.APPLICATION, title: "Solve map or plan problems with scale", learningObjective: "Use scale drawings to reason about distance or layout in context.", sequenceOrder: 4 },

  { id: "TRG-01", topicId: "curriculum_topic_f3_b2_trigonometric_ratios", code: "TRG-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise opposite, adjacent, and hypotenuse", learningObjective: "Identify triangle side relationships relative to an angle.", sequenceOrder: 1 },
  { id: "TRG-02", topicId: "curriculum_topic_f3_b2_trigonometric_ratios", code: "TRG-02", nodeType: MasteryNodeType.PROCEDURE, title: "Select the correct trigonometric ratio", learningObjective: "Choose sine, cosine, or tangent based on the known and unknown sides.", sequenceOrder: 2 },
  { id: "TRG-03", topicId: "curriculum_topic_f3_b2_trigonometric_ratios", code: "TRG-03", nodeType: MasteryNodeType.PROCEDURE, title: "Solve right-triangle trigonometry problems", learningObjective: "Calculate missing side lengths or angles using trigonometric ratios.", sequenceOrder: 3 },
  { id: "TRG-04", topicId: "curriculum_topic_f3_b2_trigonometric_ratios", code: "TRG-04", nodeType: MasteryNodeType.APPLICATION, title: "Use trigonometry in measurement contexts", learningObjective: "Apply trigonometric reasoning in height, distance, or slope situations.", sequenceOrder: 4 },

  { id: "CTG-01", topicId: "curriculum_topic_f3_b3_angles_and_tangents_in_circles", code: "CTG-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise tangent and circle-angle rules", learningObjective: "Identify tangent, radius, and key circle-angle relationships in diagrams.", sequenceOrder: 1 },
  { id: "CTG-02", topicId: "curriculum_topic_f3_b3_angles_and_tangents_in_circles", code: "CTG-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use tangent and radius relationships", learningObjective: "Solve simple tangent-based angle problems accurately.", sequenceOrder: 2 },
  { id: "CTG-03", topicId: "curriculum_topic_f3_b3_angles_and_tangents_in_circles", code: "CTG-03", nodeType: MasteryNodeType.PROCEDURE, title: "Use circle-angle relationships in diagrams", learningObjective: "Calculate missing angles in structured circle geometry diagrams.", sequenceOrder: 3 },
  { id: "CTG-04", topicId: "curriculum_topic_f3_b3_angles_and_tangents_in_circles", code: "CTG-04", nodeType: MasteryNodeType.APPLICATION, title: "Combine tangent and circle-angle reasoning", learningObjective: "Use multiple circle rules together in non-routine geometry questions.", sequenceOrder: 4 },

  { id: "PE-01", topicId: "curriculum_topic_f3_c1_plans_and_elevations", code: "PE-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise plan and elevation views", learningObjective: "Differentiate top, front, and side views of 3D objects.", sequenceOrder: 1 },
  { id: "PE-02", topicId: "curriculum_topic_f3_c1_plans_and_elevations", code: "PE-02", nodeType: MasteryNodeType.PROCEDURE, title: "Match objects to views", learningObjective: "Link three-dimensional objects to their plan and elevation drawings.", sequenceOrder: 2 },
  { id: "PE-03", topicId: "curriculum_topic_f3_c1_plans_and_elevations", code: "PE-03", nodeType: MasteryNodeType.PROCEDURE, title: "Construct simple plan and elevation sketches", learningObjective: "Sketch or choose correct views of simple block objects.", sequenceOrder: 3 },
  { id: "PE-04", topicId: "curriculum_topic_f3_c1_plans_and_elevations", code: "PE-04", nodeType: MasteryNodeType.APPLICATION, title: "Interpret composite objects from views", learningObjective: "Reason about hidden structure or layout from given views.", sequenceOrder: 4 },

  { id: "LO-01", topicId: "curriculum_topic_f3_c2_loci_in_two_dimensions", code: "LO-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise basic locus descriptions", learningObjective: "Interpret statements about distance from a point or line.", sequenceOrder: 1 },
  { id: "LO-02", topicId: "curriculum_topic_f3_c2_loci_in_two_dimensions", code: "LO-02", nodeType: MasteryNodeType.PROCEDURE, title: "Draw simple loci", learningObjective: "Construct common loci accurately using ruler and geometry reasoning.", sequenceOrder: 2 },
  { id: "LO-03", topicId: "curriculum_topic_f3_c2_loci_in_two_dimensions", code: "LO-03", nodeType: MasteryNodeType.PROCEDURE, title: "Combine two locus conditions", learningObjective: "Identify regions or points that satisfy two simultaneous locus conditions.", sequenceOrder: 3 },
  { id: "LO-04", topicId: "curriculum_topic_f3_c2_loci_in_two_dimensions", code: "LO-04", nodeType: MasteryNodeType.APPLICATION, title: "Solve practical location problems with loci", learningObjective: "Use loci to justify location choices in map or plan scenarios.", sequenceOrder: 4 },

  { id: "SL-01", topicId: "curriculum_topic_f3_d1_straight_lines", code: "SL-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise straight-line relationships", learningObjective: "Identify gradient, intercept, and direction of straight-line relationships.", sequenceOrder: 1 },
  { id: "SL-02", topicId: "curriculum_topic_f3_d1_straight_lines", code: "SL-02", nodeType: MasteryNodeType.PROCEDURE, title: "Find gradient and intercept from graphs or equations", learningObjective: "Calculate or identify gradient and intercept accurately.", sequenceOrder: 2 },
  { id: "SL-03", topicId: "curriculum_topic_f3_d1_straight_lines", code: "SL-03", nodeType: MasteryNodeType.PROCEDURE, title: "Form straight-line equations from information", learningObjective: "Construct a straight-line equation from points or graph features.", sequenceOrder: 3 },
  { id: "SL-04", topicId: "curriculum_topic_f3_d1_straight_lines", code: "SL-04", nodeType: MasteryNodeType.APPLICATION, title: "Use straight lines to model situations", learningObjective: "Interpret or compare linear relationships in real situations.", sequenceOrder: 4 },

  { id: "DM-01", topicId: "curriculum_topic_f3_d2_data_and_decision_making", code: "DM-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise useful data displays and chance information", learningObjective: "Identify which display or probability evidence fits a decision context.", sequenceOrder: 1 },
  { id: "DM-02", topicId: "curriculum_topic_f3_d2_data_and_decision_making", code: "DM-02", nodeType: MasteryNodeType.PROCEDURE, title: "Read and compare data summaries", learningObjective: "Compare values, trends, or chance information from given displays.", sequenceOrder: 2 },
  { id: "DM-03", topicId: "curriculum_topic_f3_d2_data_and_decision_making", code: "DM-03", nodeType: MasteryNodeType.PROCEDURE, title: "Combine data evidence into a recommendation", learningObjective: "Use more than one piece of evidence to compare options.", sequenceOrder: 3 },
  { id: "DM-04", topicId: "curriculum_topic_f3_d2_data_and_decision_making", code: "DM-04", nodeType: MasteryNodeType.APPLICATION, title: "Justify a decision with data and probability", learningObjective: "Make and defend a practical decision using data-backed reasoning.", sequenceOrder: 4 },
];

const form3Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_f3_a1_indices_and_standard_form",
    code: "standard-form-shift-error",
    label: "Standard form shift error",
    description: "Student shifts the decimal incorrectly or misuses the power of ten when converting numbers.",
    remedialStrategy: "Use place-value arrows and estimate whether the final magnitude is sensible.",
  },
  {
    topicId: "curriculum_topic_f3_a2_savings_and_investment",
    code: "return-vs-total-value-confusion",
    label: "Return versus total value confusion",
    description: "Student mixes growth amount with final value and compares options inconsistently.",
    remedialStrategy: "Separate principal, gain, and final value in a table before comparison.",
  },
  {
    topicId: "curriculum_topic_f3_a3_credit_and_debt",
    code: "repayment-breakdown-blur",
    label: "Repayment breakdown blur",
    description: "Student reads instalment information but loses track of total repayment or balance logic.",
    remedialStrategy: "Build repayment timeline rows before asking for comparison or judgment.",
  },
  {
    topicId: "curriculum_topic_f3_b1_scale_drawings",
    code: "scale-direction-mixup",
    label: "Scale direction mix-up",
    description: "Student uses the correct scale value but applies it in the wrong direction when converting.",
    remedialStrategy: "Use paired 'drawing to actual' and 'actual to drawing' prompts before mixed practice.",
  },
  {
    topicId: "curriculum_topic_f3_b2_trigonometric_ratios",
    code: "ratio-selection-confusion",
    label: "Ratio selection confusion",
    description: "Student identifies the triangle but chooses the wrong trigonometric ratio for the needed sides.",
    remedialStrategy: "Rehearse opposite-adjacent-hypotenuse identification before calculator work.",
  },
  {
    topicId: "curriculum_topic_f3_b3_angles_and_tangents_in_circles",
    code: "circle-rule-overlap",
    label: "Circle rule overlap",
    description: "Student knows one circle fact but applies it where a different tangent or angle rule is needed.",
    remedialStrategy: "Sort diagram examples by rule family before mixed problem sets.",
  },
  {
    topicId: "curriculum_topic_f3_c2_loci_in_two_dimensions",
    code: "locus-condition-loss",
    label: "Locus condition loss",
    description: "Student can draw one locus condition but cannot maintain both conditions together.",
    remedialStrategy: "Layer locus drawings step by step and highlight the overlap region explicitly.",
  },
  {
    topicId: "curriculum_topic_f3_d1_straight_lines",
    code: "intercept-gradient-swap",
    label: "Intercept and gradient swap",
    description: "Student identifies a line as straight but swaps what gradient and intercept each mean.",
    remedialStrategy: "Use graph annotations that separately colour the vertical intercept and rise-over-run.",
  },
  {
    topicId: "curriculum_topic_f3_d2_data_and_decision_making",
    code: "evidence-without-justification",
    label: "Evidence without justification",
    description: "Student notices values but cannot connect them into a reasoned recommendation.",
    remedialStrategy: "Use sentence frames that force claim + evidence + comparison language.",
  },
];

const form3MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "IS-01", toNodeId: "IS-02" },
  { fromNodeId: "IS-02", toNodeId: "IS-03" },
  { fromNodeId: "IS-03", toNodeId: "IS-04" },
  { fromNodeId: "SV-01", toNodeId: "SV-02" },
  { fromNodeId: "SV-02", toNodeId: "SV-03" },
  { fromNodeId: "SV-03", toNodeId: "SV-04" },
  { fromNodeId: "SV-03", toNodeId: "CD-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "CD-01", toNodeId: "CD-02" },
  { fromNodeId: "CD-02", toNodeId: "CD-03" },
  { fromNodeId: "CD-03", toNodeId: "CD-04" },
  { fromNodeId: "SD-01", toNodeId: "SD-02" },
  { fromNodeId: "SD-02", toNodeId: "SD-03" },
  { fromNodeId: "SD-03", toNodeId: "SD-04" },
  { fromNodeId: "SD-02", toNodeId: "TRG-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "TRG-01", toNodeId: "TRG-02" },
  { fromNodeId: "TRG-02", toNodeId: "TRG-03" },
  { fromNodeId: "TRG-03", toNodeId: "TRG-04" },
  { fromNodeId: "CTG-01", toNodeId: "CTG-02" },
  { fromNodeId: "CTG-02", toNodeId: "CTG-03" },
  { fromNodeId: "CTG-03", toNodeId: "CTG-04" },
  { fromNodeId: "PE-01", toNodeId: "PE-02" },
  { fromNodeId: "PE-02", toNodeId: "PE-03" },
  { fromNodeId: "PE-03", toNodeId: "PE-04" },
  { fromNodeId: "PE-03", toNodeId: "LO-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "LO-01", toNodeId: "LO-02" },
  { fromNodeId: "LO-02", toNodeId: "LO-03" },
  { fromNodeId: "LO-03", toNodeId: "LO-04" },
  { fromNodeId: "TRG-03", toNodeId: "SL-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "SL-01", toNodeId: "SL-02" },
  { fromNodeId: "SL-02", toNodeId: "SL-03" },
  { fromNodeId: "SL-03", toNodeId: "SL-04" },
  { fromNodeId: "DM-01", toNodeId: "DM-02" },
  { fromNodeId: "DM-02", toNodeId: "DM-03" },
  { fromNodeId: "DM-03", toNodeId: "DM-04" },
];

const form4Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainForm4Algebra,
    code: "A",
    name: "Algebra and Functions",
    description: "Quadratic structure, algebraic modelling, and function reasoning.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainForm4Reasoning,
    code: "B",
    name: "Sets, Logic and Networks",
    description: "Structured reasoning with sets, logic, and graph-network thinking.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainForm4Graphs,
    code: "C",
    name: "Graphs and Inequalities",
    description: "Coordinate modelling, motion interpretation, and two-variable constraints.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainForm4Applied,
    code: "D",
    name: "Statistics, Probability and Financial Mathematics",
    description: "Dispersion, event probability, and practical money-management reasoning.",
    sequenceOrder: 4,
  },
];

const form4Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_f4_a1_quadratic_expressions_and_functions",
    domainId: curriculumIds.domainForm4Algebra,
    code: "A1",
    name: "Quadratic Expressions and Functions",
    summary: "Recognise quadratic structure and connect equations, tables, and graphs.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 150,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f4_a2_quadratic_equations",
    domainId: curriculumIds.domainForm4Algebra,
    code: "A2",
    name: "Quadratic Equations",
    summary: "Solve quadratic equations and interpret their solutions in context.",
    prerequisiteSummary: "Expansion, factorisation, and straight-line algebra from Forms 2–3.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 150,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f4_b1_set_operations",
    domainId: curriculumIds.domainForm4Reasoning,
    code: "B1",
    name: "Set Operations",
    summary: "Use union, intersection, complement, and Venn reasoning for structured classification.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f4_b2_logical_reasoning",
    domainId: curriculumIds.domainForm4Reasoning,
    code: "B2",
    name: "Logical Reasoning",
    summary: "Interpret statements, implications, and justifications with clean mathematical logic.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f4_b3_graph_networks",
    domainId: curriculumIds.domainForm4Reasoning,
    code: "B3",
    name: "Graph Networks",
    summary: "Represent routes and connections using graph-network ideas.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f4_c1_linear_inequalities_in_two_variables",
    domainId: curriculumIds.domainForm4Graphs,
    code: "C1",
    name: "Linear Inequalities in Two Variables",
    summary: "Represent and interpret feasible regions from two-variable inequalities.",
    prerequisiteSummary: "Linear equations, inequalities, and coordinate reasoning.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f4_c2_motion_graphs",
    domainId: curriculumIds.domainForm4Graphs,
    code: "C2",
    name: "Motion Graphs",
    summary: "Interpret speed-time and distance-time graphs with greater fluency.",
    prerequisiteSummary: "Form 2 speed and acceleration plus Form 3 straight-line interpretation.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f4_d1_measures_of_dispersion",
    domainId: curriculumIds.domainForm4Applied,
    code: "D1",
    name: "Measures of Dispersion",
    summary: "Compare spread and consistency of data using appropriate measures.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f4_d2_combined_events_probability",
    domainId: curriculumIds.domainForm4Applied,
    code: "D2",
    name: "Combined Events Probability",
    summary: "Solve probability questions involving more than one event.",
    prerequisiteSummary: "Simple probability and structured event reasoning.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f4_d3_financial_management",
    domainId: curriculumIds.domainForm4Applied,
    code: "D3",
    name: "Financial Management",
    summary: "Use mathematics to reason about budgeting, spending, and financial decisions.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
];

const form4MasteryNodes: MasteryNodeSeed[] = [
  { id: "QF-01", topicId: "curriculum_topic_f4_a1_quadratic_expressions_and_functions", code: "QF-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise quadratic form", learningObjective: "Identify expressions and graphs that represent quadratic relationships.", sequenceOrder: 1 },
  { id: "QF-02", topicId: "curriculum_topic_f4_a1_quadratic_expressions_and_functions", code: "QF-02", nodeType: MasteryNodeType.PROCEDURE, title: "Represent quadratic patterns in table or expression form", learningObjective: "Connect a quadratic pattern to a symbolic or table-based representation.", sequenceOrder: 2 },
  { id: "QF-03", topicId: "curriculum_topic_f4_a1_quadratic_expressions_and_functions", code: "QF-03", nodeType: MasteryNodeType.PROCEDURE, title: "Interpret quadratic graph features", learningObjective: "Describe turning point and shape features of a quadratic graph.", sequenceOrder: 3 },
  { id: "QF-04", topicId: "curriculum_topic_f4_a1_quadratic_expressions_and_functions", code: "QF-04", nodeType: MasteryNodeType.APPLICATION, title: "Use quadratic functions in context", learningObjective: "Interpret a quadratic model in a practical or geometric context.", sequenceOrder: 4 },

  { id: "QE-01", topicId: "curriculum_topic_f4_a2_quadratic_equations", code: "QE-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise quadratic equation structure", learningObjective: "Identify standard quadratic equation forms and what counts as a solution.", sequenceOrder: 1 },
  { id: "QE-02", topicId: "curriculum_topic_f4_a2_quadratic_equations", code: "QE-02", nodeType: MasteryNodeType.PROCEDURE, title: "Solve simple quadratic equations by factorisation", learningObjective: "Use factorisation to solve suitable quadratic equations accurately.", sequenceOrder: 2 },
  { id: "QE-03", topicId: "curriculum_topic_f4_a2_quadratic_equations", code: "QE-03", nodeType: MasteryNodeType.PROCEDURE, title: "Check and interpret roots", learningObjective: "Verify roots and connect them to graph or context meaning.", sequenceOrder: 3 },
  { id: "QE-04", topicId: "curriculum_topic_f4_a2_quadratic_equations", code: "QE-04", nodeType: MasteryNodeType.APPLICATION, title: "Use quadratic equations in applied problems", learningObjective: "Model and solve practical problems that lead to quadratic equations.", sequenceOrder: 4 },

  { id: "SO-01", topicId: "curriculum_topic_f4_b1_set_operations", code: "SO-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise set operation language", learningObjective: "Interpret union, intersection, complement, and subset notation correctly.", sequenceOrder: 1 },
  { id: "SO-02", topicId: "curriculum_topic_f4_b1_set_operations", code: "SO-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use Venn diagrams for set operations", learningObjective: "Shade, read, and describe set operations in Venn diagrams.", sequenceOrder: 2 },
  { id: "SO-03", topicId: "curriculum_topic_f4_b1_set_operations", code: "SO-03", nodeType: MasteryNodeType.PROCEDURE, title: "Count elements across set relationships", learningObjective: "Calculate element counts when sets overlap.", sequenceOrder: 3 },
  { id: "SO-04", topicId: "curriculum_topic_f4_b1_set_operations", code: "SO-04", nodeType: MasteryNodeType.APPLICATION, title: "Use set operations in classification contexts", learningObjective: "Represent and solve categorisation problems with set operations.", sequenceOrder: 4 },

  { id: "LR-01", topicId: "curriculum_topic_f4_b2_logical_reasoning", code: "LR-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise statement and implication structure", learningObjective: "Identify premises, conclusions, and conditional relationships.", sequenceOrder: 1 },
  { id: "LR-02", topicId: "curriculum_topic_f4_b2_logical_reasoning", code: "LR-02", nodeType: MasteryNodeType.PROCEDURE, title: "Interpret logical statements accurately", learningObjective: "Translate simple logical structures into clear meaning.", sequenceOrder: 2 },
  { id: "LR-03", topicId: "curriculum_topic_f4_b2_logical_reasoning", code: "LR-03", nodeType: MasteryNodeType.PROCEDURE, title: "Check validity of reasoning", learningObjective: "Decide whether a mathematical argument follows logically.", sequenceOrder: 3 },
  { id: "LR-04", topicId: "curriculum_topic_f4_b2_logical_reasoning", code: "LR-04", nodeType: MasteryNodeType.APPLICATION, title: "Use logic to justify conclusions", learningObjective: "Support a conclusion using clear mathematical reasoning statements.", sequenceOrder: 4 },

  { id: "GN-01", topicId: "curriculum_topic_f4_b3_graph_networks", code: "GN-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise graph-network parts", learningObjective: "Identify vertices, edges, paths, and route representations.", sequenceOrder: 1 },
  { id: "GN-02", topicId: "curriculum_topic_f4_b3_graph_networks", code: "GN-02", nodeType: MasteryNodeType.PROCEDURE, title: "Read routes and links in a network", learningObjective: "Interpret connections and route options from a simple network diagram.", sequenceOrder: 2 },
  { id: "GN-03", topicId: "curriculum_topic_f4_b3_graph_networks", code: "GN-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare network paths", learningObjective: "Compare route choices using path length or structure information.", sequenceOrder: 3 },
  { id: "GN-04", topicId: "curriculum_topic_f4_b3_graph_networks", code: "GN-04", nodeType: MasteryNodeType.APPLICATION, title: "Use network models in decision contexts", learningObjective: "Choose or justify a route or connection strategy in a practical setting.", sequenceOrder: 4 },

  { id: "LI-01", topicId: "curriculum_topic_f4_c1_linear_inequalities_in_two_variables", code: "LI-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise inequality regions in two variables", learningObjective: "Interpret what a two-variable inequality means graphically.", sequenceOrder: 1 },
  { id: "LI-02", topicId: "curriculum_topic_f4_c1_linear_inequalities_in_two_variables", code: "LI-02", nodeType: MasteryNodeType.PROCEDURE, title: "Plot boundary lines for inequalities", learningObjective: "Draw boundary lines correctly before shading the feasible side.", sequenceOrder: 2 },
  { id: "LI-03", topicId: "curriculum_topic_f4_c1_linear_inequalities_in_two_variables", code: "LI-03", nodeType: MasteryNodeType.PROCEDURE, title: "Represent feasible regions", learningObjective: "Shade and interpret the correct solution region for one or more inequalities.", sequenceOrder: 3 },
  { id: "LI-04", topicId: "curriculum_topic_f4_c1_linear_inequalities_in_two_variables", code: "LI-04", nodeType: MasteryNodeType.APPLICATION, title: "Use feasible regions in context", learningObjective: "Interpret a feasible region in a resource, budget, or planning problem.", sequenceOrder: 4 },

  { id: "MG-01", topicId: "curriculum_topic_f4_c2_motion_graphs", code: "MG-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise motion graph types", learningObjective: "Distinguish distance-time and speed-time graph meanings clearly.", sequenceOrder: 1 },
  { id: "MG-02", topicId: "curriculum_topic_f4_c2_motion_graphs", code: "MG-02", nodeType: MasteryNodeType.PROCEDURE, title: "Read key values from motion graphs", learningObjective: "Extract speed, distance, time, or change information from graphs accurately.", sequenceOrder: 2 },
  { id: "MG-03", topicId: "curriculum_topic_f4_c2_motion_graphs", code: "MG-03", nodeType: MasteryNodeType.PROCEDURE, title: "Interpret changes in motion", learningObjective: "Explain steady, increasing, decreasing, or stopped motion from graph segments.", sequenceOrder: 3 },
  { id: "MG-04", topicId: "curriculum_topic_f4_c2_motion_graphs", code: "MG-04", nodeType: MasteryNodeType.APPLICATION, title: "Compare motion stories using graphs", learningObjective: "Use motion graphs to compare or explain two journeys or scenarios.", sequenceOrder: 4 },

  { id: "MD-01", topicId: "curriculum_topic_f4_d1_measures_of_dispersion", code: "MD-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise measures of spread", learningObjective: "Identify what a measure of dispersion says about a data set.", sequenceOrder: 1 },
  { id: "MD-02", topicId: "curriculum_topic_f4_d1_measures_of_dispersion", code: "MD-02", nodeType: MasteryNodeType.PROCEDURE, title: "Calculate basic dispersion measures", learningObjective: "Calculate spread measures accurately from given data.", sequenceOrder: 2 },
  { id: "MD-03", topicId: "curriculum_topic_f4_d1_measures_of_dispersion", code: "MD-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare variability across data sets", learningObjective: "Use dispersion to compare consistency or spread of two data sets.", sequenceOrder: 3 },
  { id: "MD-04", topicId: "curriculum_topic_f4_d1_measures_of_dispersion", code: "MD-04", nodeType: MasteryNodeType.APPLICATION, title: "Use spread to support decisions", learningObjective: "Interpret data spread in practical comparison or recommendation tasks.", sequenceOrder: 4 },

  { id: "CP-01", topicId: "curriculum_topic_f4_d2_combined_events_probability", code: "CP-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise combined-event structures", learningObjective: "Identify situations involving two linked or sequential probability events.", sequenceOrder: 1 },
  { id: "CP-02", topicId: "curriculum_topic_f4_d2_combined_events_probability", code: "CP-02", nodeType: MasteryNodeType.PROCEDURE, title: "Represent combined events systematically", learningObjective: "Use tables, trees, or structured listing to represent combined events.", sequenceOrder: 2 },
  { id: "CP-03", topicId: "curriculum_topic_f4_d2_combined_events_probability", code: "CP-03", nodeType: MasteryNodeType.PROCEDURE, title: "Calculate combined-event probabilities", learningObjective: "Find probabilities of multi-step or combined events accurately.", sequenceOrder: 3 },
  { id: "CP-04", topicId: "curriculum_topic_f4_d2_combined_events_probability", code: "CP-04", nodeType: MasteryNodeType.APPLICATION, title: "Compare outcomes using combined probability", learningObjective: "Use combined-event reasoning to compare outcomes or choices in context.", sequenceOrder: 4 },

  { id: "FM-41", topicId: "curriculum_topic_f4_d3_financial_management", code: "FM-41", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise budgeting and cost categories", learningObjective: "Identify fixed, variable, income, and expense categories in simple budgets.", sequenceOrder: 1 },
  { id: "FM-42", topicId: "curriculum_topic_f4_d3_financial_management", code: "FM-42", nodeType: MasteryNodeType.PROCEDURE, title: "Calculate budget balances", learningObjective: "Calculate surplus, deficit, and simple spending distributions accurately.", sequenceOrder: 2 },
  { id: "FM-43", topicId: "curriculum_topic_f4_d3_financial_management", code: "FM-43", nodeType: MasteryNodeType.PROCEDURE, title: "Compare financial plans", learningObjective: "Compare two simple spending or budgeting plans using numerical evidence.", sequenceOrder: 3 },
  { id: "FM-44", topicId: "curriculum_topic_f4_d3_financial_management", code: "FM-44", nodeType: MasteryNodeType.APPLICATION, title: "Recommend a financial decision", learningObjective: "Use budgeting mathematics to recommend a more sustainable financial choice.", sequenceOrder: 4 },
];

const form4Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_f4_a1_quadratic_expressions_and_functions",
    code: "quadratic-vs-linear-blur",
    label: "Quadratic versus linear blur",
    description: "Student sees a pattern or graph but treats it like a straight-line relationship instead of a quadratic one.",
    remedialStrategy: "Contrast linear and quadratic growth side by side before symbolic work.",
  },
  {
    topicId: "curriculum_topic_f4_a2_quadratic_equations",
    code: "factor-root-break",
    label: "Factor to root break",
    description: "Student can factorise expressions but does not convert factors correctly into equation roots.",
    remedialStrategy: "Use zero-product reasoning explicitly after factorisation steps.",
  },
  {
    topicId: "curriculum_topic_f4_b1_set_operations",
    code: "venn-count-overlap-loss",
    label: "Venn overlap loss",
    description: "Student counts set regions but double-counts or ignores overlap regions.",
    remedialStrategy: "Build region-by-region counting before asking for totals.",
  },
  {
    topicId: "curriculum_topic_f4_b2_logical_reasoning",
    code: "statement-meaning-drift",
    label: "Statement meaning drift",
    description: "Student reads a logical statement but cannot preserve its exact meaning in explanation.",
    remedialStrategy: "Rewrite statements in plain language before checking validity.",
  },
  {
    topicId: "curriculum_topic_f4_b3_graph_networks",
    code: "route-structure-confusion",
    label: "Route structure confusion",
    description: "Student sees the network but loses track of which path or link comparison is relevant.",
    remedialStrategy: "Highlight candidate paths first, then compare them using one criterion at a time.",
  },
  {
    topicId: "curriculum_topic_f4_c1_linear_inequalities_in_two_variables",
    code: "boundary-and-shading-mixup",
    label: "Boundary and shading mix-up",
    description: "Student plots the line but shades the wrong region or misreads the feasible area.",
    remedialStrategy: "Use test-point checking before final shading.",
  },
  {
    topicId: "curriculum_topic_f4_c2_motion_graphs",
    code: "motion-graph-meaning-swap",
    label: "Motion graph meaning swap",
    description: "Student reads graph shape but mixes what slope, flat sections, or axes represent.",
    remedialStrategy: "Translate each graph segment into a short story sentence before calculating.",
  },
  {
    topicId: "curriculum_topic_f4_d1_measures_of_dispersion",
    code: "spread-vs-centre-confusion",
    label: "Spread versus centre confusion",
    description: "Student talks about variation but answers using averages instead of dispersion.",
    remedialStrategy: "Compare centre and spread questions explicitly before solving.",
  },
  {
    topicId: "curriculum_topic_f4_d2_combined_events_probability",
    code: "tree-table-selection-gap",
    label: "Representation selection gap",
    description: "Student knows probability basics but chooses an unhelpful structure for combined events.",
    remedialStrategy: "Model the same situation using both tree and table formats first.",
  },
  {
    topicId: "curriculum_topic_f4_d3_financial_management",
    code: "budget-interpretation-gap",
    label: "Budget interpretation gap",
    description: "Student calculates values correctly but does not turn them into a practical financial recommendation.",
    remedialStrategy: "Force a conclusion sentence with claim, evidence, and tradeoff.",
  },
];

const form4MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "QF-01", toNodeId: "QF-02" },
  { fromNodeId: "QF-02", toNodeId: "QF-03" },
  { fromNodeId: "QF-03", toNodeId: "QF-04" },
  { fromNodeId: "QF-02", toNodeId: "QE-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "QE-01", toNodeId: "QE-02" },
  { fromNodeId: "QE-02", toNodeId: "QE-03" },
  { fromNodeId: "QE-03", toNodeId: "QE-04" },
  { fromNodeId: "SO-01", toNodeId: "SO-02" },
  { fromNodeId: "SO-02", toNodeId: "SO-03" },
  { fromNodeId: "SO-03", toNodeId: "SO-04" },
  { fromNodeId: "SO-03", toNodeId: "LR-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "LR-01", toNodeId: "LR-02" },
  { fromNodeId: "LR-02", toNodeId: "LR-03" },
  { fromNodeId: "LR-03", toNodeId: "LR-04" },
  { fromNodeId: "GN-01", toNodeId: "GN-02" },
  { fromNodeId: "GN-02", toNodeId: "GN-03" },
  { fromNodeId: "GN-03", toNodeId: "GN-04" },
  { fromNodeId: "SL-03", toNodeId: "LI-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "LI-01", toNodeId: "LI-02" },
  { fromNodeId: "LI-02", toNodeId: "LI-03" },
  { fromNodeId: "LI-03", toNodeId: "LI-04" },
  { fromNodeId: "SL-02", toNodeId: "MG-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "MG-01", toNodeId: "MG-02" },
  { fromNodeId: "MG-02", toNodeId: "MG-03" },
  { fromNodeId: "MG-03", toNodeId: "MG-04" },
  { fromNodeId: "MD-01", toNodeId: "MD-02" },
  { fromNodeId: "MD-02", toNodeId: "MD-03" },
  { fromNodeId: "MD-03", toNodeId: "MD-04" },
  { fromNodeId: "SO-03", toNodeId: "CP-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "CP-01", toNodeId: "CP-02" },
  { fromNodeId: "CP-02", toNodeId: "CP-03" },
  { fromNodeId: "CP-03", toNodeId: "CP-04" },
  { fromNodeId: "MD-03", toNodeId: "FM-41", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "FM-41", toNodeId: "FM-42" },
  { fromNodeId: "FM-42", toNodeId: "FM-43" },
  { fromNodeId: "FM-43", toNodeId: "FM-44" },
];

const form5Domains: DomainSeed[] = [
  {
    id: curriculumIds.domainForm5Algebra,
    code: "A",
    name: "Advanced Algebra and Representation",
    description: "Variation, matrices, and representation tools for SPM-level reasoning.",
    sequenceOrder: 1,
  },
  {
    id: curriculumIds.domainForm5Geometry,
    code: "B",
    name: "Geometry and Transformational Reasoning",
    description: "Congruence, enlargement, and linked transformations in structured geometry contexts.",
    sequenceOrder: 2,
  },
  {
    id: curriculumIds.domainForm5Trig,
    code: "C",
    name: "Trigonometry and Graph Interpretation",
    description: "Trigonometric relationships, graphs, and interpretation for exam-style applications.",
    sequenceOrder: 3,
  },
  {
    id: curriculumIds.domainForm5Applied,
    code: "D",
    name: "Modelling, Statistics and Consumer Mathematics",
    description: "Grouped-data interpretation, mathematical modelling, and applied financial decisions.",
    sequenceOrder: 4,
  },
];

const form5Topics: TopicSeed[] = [
  {
    id: "curriculum_topic_f5_a1_variations",
    domainId: curriculumIds.domainForm5Algebra,
    code: "A1",
    name: "Variations",
    summary: "Model direct, inverse, and joint variation relationships with confidence.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f5_a2_matrices",
    domainId: curriculumIds.domainForm5Algebra,
    code: "A2",
    name: "Matrices",
    summary: "Represent and manipulate information using matrices in simple applied settings.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 130,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f5_b1_congruence",
    domainId: curriculumIds.domainForm5Geometry,
    code: "B1",
    name: "Congruence",
    summary: "Use congruence conditions to justify equal shapes and geometric conclusions.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 100,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f5_b2_enlargement",
    domainId: curriculumIds.domainForm5Geometry,
    code: "B2",
    name: "Enlargement",
    summary: "Interpret scale factors and image-object relationships under enlargement.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f5_b3_combined_transformations",
    domainId: curriculumIds.domainForm5Geometry,
    code: "B3",
    name: "Combined Transformations",
    summary: "Track and describe linked transformations in sequence.",
    prerequisiteSummary: "Translations, reflections, rotations, and enlargement.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
  {
    id: "curriculum_topic_f5_c1_trigonometric_functions_and_graphs",
    domainId: curriculumIds.domainForm5Trig,
    code: "C1",
    name: "Trigonometric Functions and Graphs",
    summary: "Connect trigonometric ratios to graph shape, periodicity, and interpretation.",
    prerequisiteSummary: "Form 3 trigonometric ratios and Form 4 graph reasoning.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 150,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f5_d1_grouped_data_dispersion",
    domainId: curriculumIds.domainForm5Applied,
    code: "D1",
    name: "Measures of Dispersion for Grouped Data",
    summary: "Estimate and compare spread using grouped-data representations.",
    sequenceOrder: 1,
    estimatedLearningMinutes: 110,
    estimatedRevisionCycles: 2,
  },
  {
    id: "curriculum_topic_f5_d2_mathematical_modelling",
    domainId: curriculumIds.domainForm5Applied,
    code: "D2",
    name: "Mathematical Modelling",
    summary: "Turn real situations into mathematical assumptions, expressions, and conclusions.",
    sequenceOrder: 2,
    estimatedLearningMinutes: 140,
    estimatedRevisionCycles: 4,
  },
  {
    id: "curriculum_topic_f5_d3_insurance_and_taxation",
    domainId: curriculumIds.domainForm5Applied,
    code: "D3",
    name: "Insurance and Taxation",
    summary: "Use percentages, rates, and structured reasoning in consumer finance contexts.",
    sequenceOrder: 3,
    estimatedLearningMinutes: 120,
    estimatedRevisionCycles: 3,
  },
];

const form5MasteryNodes: MasteryNodeSeed[] = [
  { id: "VA-01", topicId: "curriculum_topic_f5_a1_variations", code: "VA-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise direct, inverse, and joint variation structure", learningObjective: "Identify what type of variation relationship is described in a statement or equation.", sequenceOrder: 1 },
  { id: "VA-02", topicId: "curriculum_topic_f5_a1_variations", code: "VA-02", nodeType: MasteryNodeType.PROCEDURE, title: "Form variation equations", learningObjective: "Write equations that represent direct, inverse, or joint variation accurately.", sequenceOrder: 2 },
  { id: "VA-03", topicId: "curriculum_topic_f5_a1_variations", code: "VA-03", nodeType: MasteryNodeType.PROCEDURE, title: "Find constants and unknown values in variation", learningObjective: "Substitute known values to determine constants and solve for missing quantities.", sequenceOrder: 3 },
  { id: "VA-04", topicId: "curriculum_topic_f5_a1_variations", code: "VA-04", nodeType: MasteryNodeType.APPLICATION, title: "Use variation in practical relationships", learningObjective: "Interpret and solve contextual problems using variation models.", sequenceOrder: 4 },

  { id: "MT-01", topicId: "curriculum_topic_f5_a2_matrices", code: "MT-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise matrix structure and order", learningObjective: "Read rows, columns, and matrix dimensions correctly.", sequenceOrder: 1 },
  { id: "MT-02", topicId: "curriculum_topic_f5_a2_matrices", code: "MT-02", nodeType: MasteryNodeType.PROCEDURE, title: "Perform basic matrix operations", learningObjective: "Add, subtract, and scale matrices where valid.", sequenceOrder: 2 },
  { id: "MT-03", topicId: "curriculum_topic_f5_a2_matrices", code: "MT-03", nodeType: MasteryNodeType.PROCEDURE, title: "Use matrix multiplication in simple settings", learningObjective: "Multiply compatible matrices and interpret the result meaningfully.", sequenceOrder: 3 },
  { id: "MT-04", topicId: "curriculum_topic_f5_a2_matrices", code: "MT-04", nodeType: MasteryNodeType.APPLICATION, title: "Use matrices to represent information", learningObjective: "Model tabular or networked information using matrices in context.", sequenceOrder: 4 },

  { id: "CG-01", topicId: "curriculum_topic_f5_b1_congruence", code: "CG-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise congruent figures", learningObjective: "Identify when two figures are congruent and what that implies.", sequenceOrder: 1 },
  { id: "CG-02", topicId: "curriculum_topic_f5_b1_congruence", code: "CG-02", nodeType: MasteryNodeType.PROCEDURE, title: "Use congruence conditions in triangles", learningObjective: "Apply standard triangle congruence conditions accurately.", sequenceOrder: 2 },
  { id: "CG-03", topicId: "curriculum_topic_f5_b1_congruence", code: "CG-03", nodeType: MasteryNodeType.PROCEDURE, title: "Infer equal lengths and angles from congruence", learningObjective: "Use congruence to justify follow-on geometric facts.", sequenceOrder: 3 },
  { id: "CG-04", topicId: "curriculum_topic_f5_b1_congruence", code: "CG-04", nodeType: MasteryNodeType.APPLICATION, title: "Use congruence in geometric proofs and contexts", learningObjective: "Support a geometric conclusion or practical claim using congruence reasoning.", sequenceOrder: 4 },

  { id: "EN-01", topicId: "curriculum_topic_f5_b2_enlargement", code: "EN-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise enlargement relationships", learningObjective: "Identify image, object, centre, and scale factor in enlargement situations.", sequenceOrder: 1 },
  { id: "EN-02", topicId: "curriculum_topic_f5_b2_enlargement", code: "EN-02", nodeType: MasteryNodeType.PROCEDURE, title: "Determine scale factor and centre", learningObjective: "Find enlargement scale factor and locate the centre correctly.", sequenceOrder: 2 },
  { id: "EN-03", topicId: "curriculum_topic_f5_b2_enlargement", code: "EN-03", nodeType: MasteryNodeType.PROCEDURE, title: "Map objects under enlargement", learningObjective: "Construct or interpret enlarged images accurately on coordinate grids.", sequenceOrder: 3 },
  { id: "EN-04", topicId: "curriculum_topic_f5_b2_enlargement", code: "EN-04", nodeType: MasteryNodeType.APPLICATION, title: "Use enlargement in contextual geometry", learningObjective: "Apply enlargement reasoning in map, design, or similarity-style tasks.", sequenceOrder: 4 },

  { id: "CT-01", topicId: "curriculum_topic_f5_b3_combined_transformations", code: "CT-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise sequences of transformations", learningObjective: "Identify the order and type of linked transformations in a diagram or description.", sequenceOrder: 1 },
  { id: "CT-02", topicId: "curriculum_topic_f5_b3_combined_transformations", code: "CT-02", nodeType: MasteryNodeType.PROCEDURE, title: "Track objects through combined transformations", learningObjective: "Apply two or more transformations in the correct order.", sequenceOrder: 2 },
  { id: "CT-03", topicId: "curriculum_topic_f5_b3_combined_transformations", code: "CT-03", nodeType: MasteryNodeType.PROCEDURE, title: "Describe a combined transformation clearly", learningObjective: "State a full transformation sequence with enough precision to reproduce it.", sequenceOrder: 3 },
  { id: "CT-04", topicId: "curriculum_topic_f5_b3_combined_transformations", code: "CT-04", nodeType: MasteryNodeType.APPLICATION, title: "Use combined transformations in problem solving", learningObjective: "Interpret or construct a transformation path in a practical or exam-style task.", sequenceOrder: 4 },

  { id: "TG-01", topicId: "curriculum_topic_f5_c1_trigonometric_functions_and_graphs", code: "TG-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise trigonometric function behaviour", learningObjective: "Identify key features of sine, cosine, or tangent relationships and graphs.", sequenceOrder: 1 },
  { id: "TG-02", topicId: "curriculum_topic_f5_c1_trigonometric_functions_and_graphs", code: "TG-02", nodeType: MasteryNodeType.PROCEDURE, title: "Read and sketch basic trigonometric graphs", learningObjective: "Interpret or produce simple trig graphs with correct shape and interval sense.", sequenceOrder: 2 },
  { id: "TG-03", topicId: "curriculum_topic_f5_c1_trigonometric_functions_and_graphs", code: "TG-03", nodeType: MasteryNodeType.PROCEDURE, title: "Use trig relationships to solve graph-linked questions", learningObjective: "Connect graph values, periodicity, and trigonometric meaning accurately.", sequenceOrder: 3 },
  { id: "TG-04", topicId: "curriculum_topic_f5_c1_trigonometric_functions_and_graphs", code: "TG-04", nodeType: MasteryNodeType.APPLICATION, title: "Interpret trigonometric models in context", learningObjective: "Use trig graphs or functions to describe cyclical or repeating situations.", sequenceOrder: 4 },

  { id: "GD-01", topicId: "curriculum_topic_f5_d1_grouped_data_dispersion", code: "GD-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise grouped-data structure", learningObjective: "Read grouped frequency information and understand class intervals correctly.", sequenceOrder: 1 },
  { id: "GD-02", topicId: "curriculum_topic_f5_d1_grouped_data_dispersion", code: "GD-02", nodeType: MasteryNodeType.PROCEDURE, title: "Estimate grouped-data measures of spread", learningObjective: "Calculate or estimate grouped-data dispersion measures correctly.", sequenceOrder: 2 },
  { id: "GD-03", topicId: "curriculum_topic_f5_d1_grouped_data_dispersion", code: "GD-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare grouped-data consistency", learningObjective: "Use spread measures to compare consistency between grouped data sets.", sequenceOrder: 3 },
  { id: "GD-04", topicId: "curriculum_topic_f5_d1_grouped_data_dispersion", code: "GD-04", nodeType: MasteryNodeType.APPLICATION, title: "Use grouped-data dispersion for decision support", learningObjective: "Interpret grouped-data variation in a recommendation or evaluation task.", sequenceOrder: 4 },

  { id: "MM-01", topicId: "curriculum_topic_f5_d2_mathematical_modelling", code: "MM-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise assumptions and variables in a model", learningObjective: "Identify what needs to be assumed, defined, or simplified in a real situation.", sequenceOrder: 1 },
  { id: "MM-02", topicId: "curriculum_topic_f5_d2_mathematical_modelling", code: "MM-02", nodeType: MasteryNodeType.PROCEDURE, title: "Translate a situation into a mathematical model", learningObjective: "Represent a practical situation with equations, expressions, or structured relationships.", sequenceOrder: 2 },
  { id: "MM-03", topicId: "curriculum_topic_f5_d2_mathematical_modelling", code: "MM-03", nodeType: MasteryNodeType.PROCEDURE, title: "Evaluate and refine a mathematical model", learningObjective: "Check whether a model makes sense and adjust it when assumptions fail.", sequenceOrder: 3 },
  { id: "MM-04", topicId: "curriculum_topic_f5_d2_mathematical_modelling", code: "MM-04", nodeType: MasteryNodeType.APPLICATION, title: "Use modelling to justify a recommendation", learningObjective: "Use a model to support a reasoned final conclusion in context.", sequenceOrder: 4 },

  { id: "IT-01", topicId: "curriculum_topic_f5_d3_insurance_and_taxation", code: "IT-01", nodeType: MasteryNodeType.RECOGNITION, title: "Recognise insurance and taxation components", learningObjective: "Identify common terms, rates, and categories used in insurance and tax questions.", sequenceOrder: 1 },
  { id: "IT-02", topicId: "curriculum_topic_f5_d3_insurance_and_taxation", code: "IT-02", nodeType: MasteryNodeType.PROCEDURE, title: "Calculate insurance and tax values", learningObjective: "Compute premiums, claims, reliefs, or tax-related values accurately from given data.", sequenceOrder: 2 },
  { id: "IT-03", topicId: "curriculum_topic_f5_d3_insurance_and_taxation", code: "IT-03", nodeType: MasteryNodeType.PROCEDURE, title: "Compare consumer finance options", learningObjective: "Compare two finance options using numerical evidence and relevant conditions.", sequenceOrder: 3 },
  { id: "IT-04", topicId: "curriculum_topic_f5_d3_insurance_and_taxation", code: "IT-04", nodeType: MasteryNodeType.APPLICATION, title: "Recommend a consumer decision", learningObjective: "Make and justify an insurance or taxation decision in a practical context.", sequenceOrder: 4 },
];

const form5Misconceptions: MisconceptionSeed[] = [
  {
    topicId: "curriculum_topic_f5_a1_variations",
    code: "variation-form-mismatch",
    label: "Variation form mismatch",
    description: "Student recognises the relationship verbally but writes the wrong algebraic variation structure.",
    remedialStrategy: "Match verbal cues to algebraic forms before solving for constants.",
  },
  {
    topicId: "curriculum_topic_f5_a2_matrices",
    code: "matrix-order-blindness",
    label: "Matrix order blindness",
    description: "Student performs an operation without checking whether matrix order or dimensions make sense.",
    remedialStrategy: "Force a dimension check before each matrix operation.",
  },
  {
    topicId: "curriculum_topic_f5_b1_congruence",
    code: "congruence-condition-swap",
    label: "Congruence condition swap",
    description: "Student identifies matching parts but uses an invalid or incomplete congruence condition.",
    remedialStrategy: "Use side-angle structure checks before drawing conclusions.",
  },
  {
    topicId: "curriculum_topic_f5_b2_enlargement",
    code: "scale-factor-direction-gap",
    label: "Scale-factor direction gap",
    description: "Student knows enlargement is involved but mixes image-to-object and object-to-image direction.",
    remedialStrategy: "Use centre-to-point rays to anchor direction and scale.",
  },
  {
    topicId: "curriculum_topic_f5_b3_combined_transformations",
    code: "order-of-transformations-loss",
    label: "Transformation order loss",
    description: "Student applies the right transformations but in the wrong order.",
    remedialStrategy: "Track each intermediate image one step at a time.",
  },
  {
    topicId: "curriculum_topic_f5_c1_trigonometric_functions_and_graphs",
    code: "trig-graph-feature-mixup",
    label: "Trig graph feature mix-up",
    description: "Student confuses amplitude, interval, or repeated pattern meaning on trigonometric graphs.",
    remedialStrategy: "Label key points and cycles before interpreting the full graph.",
  },
  {
    topicId: "curriculum_topic_f5_d1_grouped_data_dispersion",
    code: "grouped-data-midpoint-drift",
    label: "Grouped-data midpoint drift",
    description: "Student reads grouped data but does not use class midpoint reasoning consistently.",
    remedialStrategy: "Model midpoint approximation explicitly before computing spread.",
  },
  {
    topicId: "curriculum_topic_f5_d2_mathematical_modelling",
    code: "model-assumption-hidden",
    label: "Hidden assumption modelling",
    description: "Student writes calculations but does not state or check the assumptions behind the model.",
    remedialStrategy: "Require assumptions, variables, and conclusion as separate steps.",
  },
  {
    topicId: "curriculum_topic_f5_d3_insurance_and_taxation",
    code: "consumer-choice-justification-gap",
    label: "Consumer choice justification gap",
    description: "Student calculates correctly but does not convert results into a defensible recommendation.",
    remedialStrategy: "Use claim-evidence-tradeoff framing for the final answer.",
  },
];

const form5MasteryEdges: MasteryEdgeSeed[] = [
  { fromNodeId: "VA-01", toNodeId: "VA-02" },
  { fromNodeId: "VA-02", toNodeId: "VA-03" },
  { fromNodeId: "VA-03", toNodeId: "VA-04" },
  { fromNodeId: "VA-03", toNodeId: "MT-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "MT-01", toNodeId: "MT-02" },
  { fromNodeId: "MT-02", toNodeId: "MT-03" },
  { fromNodeId: "MT-03", toNodeId: "MT-04" },
  { fromNodeId: "CG-01", toNodeId: "CG-02" },
  { fromNodeId: "CG-02", toNodeId: "CG-03" },
  { fromNodeId: "CG-03", toNodeId: "CG-04" },
  { fromNodeId: "CG-03", toNodeId: "EN-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "EN-01", toNodeId: "EN-02" },
  { fromNodeId: "EN-02", toNodeId: "EN-03" },
  { fromNodeId: "EN-03", toNodeId: "EN-04" },
  { fromNodeId: "EN-03", toNodeId: "CT-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "CT-01", toNodeId: "CT-02" },
  { fromNodeId: "CT-02", toNodeId: "CT-03" },
  { fromNodeId: "CT-03", toNodeId: "CT-04" },
  { fromNodeId: "TRG-03", toNodeId: "TG-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "TG-01", toNodeId: "TG-02" },
  { fromNodeId: "TG-02", toNodeId: "TG-03" },
  { fromNodeId: "TG-03", toNodeId: "TG-04" },
  { fromNodeId: "MD-03", toNodeId: "GD-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "GD-01", toNodeId: "GD-02" },
  { fromNodeId: "GD-02", toNodeId: "GD-03" },
  { fromNodeId: "GD-03", toNodeId: "GD-04" },
  { fromNodeId: "VA-04", toNodeId: "MM-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "TG-03", toNodeId: "MM-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "MM-01", toNodeId: "MM-02" },
  { fromNodeId: "MM-02", toNodeId: "MM-03" },
  { fromNodeId: "MM-03", toNodeId: "MM-04" },
  { fromNodeId: "FM-43", toNodeId: "IT-01", edgeType: MasteryEdgeType.RECOMMENDED },
  { fromNodeId: "IT-01", toNodeId: "IT-02" },
  { fromNodeId: "IT-02", toNodeId: "IT-03" },
  { fromNodeId: "IT-03", toNodeId: "IT-04" },
];

type CurriculumBlueprint = {
  level: LevelSeed;
  domains: DomainSeed[];
  topics: TopicSeed[];
  masteryNodes: MasteryNodeSeed[];
  misconceptions: MisconceptionSeed[];
  masteryEdges: MasteryEdgeSeed[];
};

type SubjectCurriculumBlueprint = {
  subject: SubjectSeed;
  levels: CurriculumBlueprint[];
};

const curriculumBlueprints: SubjectCurriculumBlueprint[] = [
  {
    subject: curriculumSubjects[0],
    levels: [
      {
        level: curriculumLevels[0],
        domains: form1Domains,
        topics: form1Topics,
        masteryNodes,
        misconceptions,
        masteryEdges,
      },
      {
        level: curriculumLevels[1],
        domains: form2Domains,
        topics: form2Topics,
        masteryNodes: form2MasteryNodes,
        misconceptions: form2Misconceptions,
        masteryEdges: form2MasteryEdges,
      },
      {
        level: curriculumLevels[2],
        domains: form3Domains,
        topics: form3Topics,
        masteryNodes: form3MasteryNodes,
        misconceptions: form3Misconceptions,
        masteryEdges: form3MasteryEdges,
      },
      {
        level: curriculumLevels[3],
        domains: form4Domains,
        topics: form4Topics,
        masteryNodes: form4MasteryNodes,
        misconceptions: form4Misconceptions,
        masteryEdges: form4MasteryEdges,
      },
      {
        level: curriculumLevels[4],
        domains: form5Domains,
        topics: form5Topics,
        masteryNodes: form5MasteryNodes,
        misconceptions: form5Misconceptions,
        masteryEdges: form5MasteryEdges,
      },
    ],
  },
  {
    subject: curriculumSubjects[1],
    levels: [
      {
        level: englishForm1Level,
        domains: englishForm1Domains,
        topics: englishForm1Topics,
        masteryNodes: englishForm1MasteryNodes,
        misconceptions: englishForm1Misconceptions,
        masteryEdges: englishForm1MasteryEdges,
      },
      {
        level: englishForm2Level,
        domains: englishForm2Domains,
        topics: englishForm2Topics,
        masteryNodes: englishForm2MasteryNodes,
        misconceptions: englishForm2Misconceptions,
        masteryEdges: englishForm2MasteryEdges,
      },
      {
        level: englishForm3Level,
        domains: englishForm3Domains,
        topics: englishForm3Topics,
        masteryNodes: englishForm3MasteryNodes,
        misconceptions: englishForm3Misconceptions,
        masteryEdges: englishForm3MasteryEdges,
      },
      {
        level: englishForm4Level,
        domains: englishForm4Domains,
        topics: englishForm4Topics,
        masteryNodes: englishForm4MasteryNodes,
        misconceptions: englishForm4Misconceptions,
        masteryEdges: englishForm4MasteryEdges,
      },
      {
        level: englishForm5Level,
        domains: englishForm5Domains,
        topics: englishForm5Topics,
        masteryNodes: englishForm5MasteryNodes,
        misconceptions: englishForm5Misconceptions,
        masteryEdges: englishForm5MasteryEdges,
      },
    ],
  },
];

function getExpectedBlueprintCounts(blueprint: CurriculumBlueprint) {
  const retentionNodeCount = blueprint.masteryNodes.filter(
    (node) => node.nodeType === MasteryNodeType.RETENTION,
  ).length;

  return {
    lessonModules: blueprint.masteryNodes.length,
    checkpoints: blueprint.masteryNodes.length,
    interventionRules: blueprint.masteryNodes.length,
    revisionRules: blueprint.masteryNodes.length,
    questionPools: blueprint.masteryNodes.length * 5,
    questionItems: blueprint.masteryNodes.length * 5,
    misconceptions: blueprint.misconceptions.length,
    masteryEdges: blueprint.masteryEdges.length,
    explicitCheckpoints:
      blueprint.masteryNodes.length - retentionNodeCount + retentionNodeCount,
  };
}

function buildQuestionPrompt(title: string, poolType: QuestionPoolType) {
  return {
    title,
    prompt: `Seed placeholder for ${title} (${poolType.toLowerCase()})`,
    instruction: "Replace with curriculum-reviewed item content.",
  };
}

function buildAnswerKey(title: string, poolType: QuestionPoolType) {
  return {
    summary: `Placeholder answer key for ${title} (${poolType.toLowerCase()})`,
    markingLogic: "Manual authoring required",
  };
}

function buildSolutionSteps(title: string) {
  return {
    explanation: `Placeholder worked solution for ${title}`,
    steps: ["Identify the skill.", "Apply the concept.", "Check the result."],
  };
}

export async function seedCurriculumData(prisma: PrismaClient) {
  const forceReseed = process.env.FORCE_CURRICULUM_RESEED === "true";
  const subjectIds: string[] = [];
  const levelIds: string[] = [];
  let domainCount = 0;
  let topicCount = 0;
  let masteryNodeCount = 0;
  for (const subjectBlueprint of curriculumBlueprints) {
    const subject = await prisma.subject.upsert({
      where: { code: subjectBlueprint.subject.code },
      update: {
        name: subjectBlueprint.subject.name,
        description: subjectBlueprint.subject.description,
      },
      create: {
        id: subjectBlueprint.subject.id,
        code: subjectBlueprint.subject.code,
        name: subjectBlueprint.subject.name,
        description: subjectBlueprint.subject.description,
      },
    });

    subjectIds.push(subject.id);

    for (const blueprint of subjectBlueprint.levels) {
      const level = await prisma.curriculumLevel.upsert({
        where: {
          subjectId_code: {
            subjectId: subject.id,
            code: blueprint.level.code,
          },
        },
        update: {
          formLabel: blueprint.level.formLabel,
          ageBand: blueprint.level.ageBand,
          track: blueprint.level.track,
          examStage: blueprint.level.examStage,
          curriculumFramework: blueprint.level.curriculumFramework,
          sequenceOrder: blueprint.level.sequenceOrder,
        },
        create: {
          id: blueprint.level.id,
          subjectId: subject.id,
          code: blueprint.level.code,
          formLabel: blueprint.level.formLabel,
          ageBand: blueprint.level.ageBand,
          track: blueprint.level.track,
          examStage: blueprint.level.examStage,
          curriculumFramework: blueprint.level.curriculumFramework,
          sequenceOrder: blueprint.level.sequenceOrder,
        },
      });

      levelIds.push(level.id);
      domainCount += blueprint.domains.length;
      topicCount += blueprint.topics.length;
      masteryNodeCount += blueprint.masteryNodes.length;

      for (const domain of blueprint.domains) {
        await prisma.subjectDomain.upsert({
          where: {
            levelId_code: {
              levelId: level.id,
              code: domain.code,
            },
          },
          update: {
            subjectId: subject.id,
            name: domain.name,
            description: domain.description,
            sequenceOrder: domain.sequenceOrder,
          },
          create: {
            id: domain.id,
            subjectId: subject.id,
            levelId: level.id,
            code: domain.code,
            name: domain.name,
            description: domain.description,
            sequenceOrder: domain.sequenceOrder,
          },
        });
      }

      for (const topic of blueprint.topics) {
        await prisma.subjectTopic.upsert({
          where: {
            levelId_code: {
              levelId: level.id,
              code: topic.code,
            },
          },
          update: {
            subjectId: subject.id,
            domainId: topic.domainId,
            name: topic.name,
            summary: topic.summary,
            prerequisiteSummary: topic.prerequisiteSummary,
            sequenceOrder: topic.sequenceOrder,
            estimatedLearningMinutes: topic.estimatedLearningMinutes,
            estimatedRevisionCycles: topic.estimatedRevisionCycles,
            contentStatus: ContentStatus.APPROVED,
          },
          create: {
            id: topic.id,
            subjectId: subject.id,
            levelId: level.id,
            domainId: topic.domainId,
            code: topic.code,
            name: topic.name,
            summary: topic.summary,
            prerequisiteSummary: topic.prerequisiteSummary,
            sequenceOrder: topic.sequenceOrder,
            estimatedLearningMinutes: topic.estimatedLearningMinutes,
            estimatedRevisionCycles: topic.estimatedRevisionCycles,
            contentStatus: ContentStatus.APPROVED,
          },
        });
      }

      const expected = getExpectedBlueprintCounts(blueprint);
      const topicIds = blueprint.topics.map((topic) => topic.id);
      const nodeIds = blueprint.masteryNodes.map((node) => node.id);

      const [
        existingNodeCount,
        existingLessonModuleCount,
        existingCheckpointCount,
        existingInterventionRuleCount,
        existingRevisionRuleCount,
        existingQuestionPoolCount,
        existingQuestionItemCount,
        existingMisconceptionCount,
        existingEdgeCount,
      ] = await Promise.all([
        prisma.masteryNode.count({ where: { id: { in: nodeIds } } }),
        prisma.lessonModule.count({ where: { nodeId: { in: nodeIds } } }),
        prisma.masteryCheckpoint.count({ where: { nodeId: { in: nodeIds } } }),
        prisma.interventionRule.count({ where: { nodeId: { in: nodeIds } } }),
        prisma.revisionRule.count({ where: { nodeId: { in: nodeIds } } }),
        prisma.questionPool.count({ where: { nodeId: { in: nodeIds } } }),
        prisma.questionItem.count({ where: { nodeId: { in: nodeIds } } }),
        prisma.topicMisconception.count({ where: { topicId: { in: topicIds } } }),
        prisma.masteryEdge.count({
          where: {
            OR: blueprint.masteryEdges.map((edge) => ({
              fromNodeId: edge.fromNodeId,
              toNodeId: edge.toNodeId,
            })),
          },
        }),
      ]);

      const blueprintAlreadySeeded =
        existingNodeCount >= blueprint.masteryNodes.length &&
        existingLessonModuleCount >= expected.lessonModules &&
        existingCheckpointCount >= expected.checkpoints &&
        existingInterventionRuleCount >= expected.interventionRules &&
        existingRevisionRuleCount >= expected.revisionRules &&
        existingQuestionPoolCount >= expected.questionPools &&
        existingQuestionItemCount >= expected.questionItems &&
        existingMisconceptionCount >= expected.misconceptions &&
        existingEdgeCount >= expected.masteryEdges;

      const blueprintLabel = `${subject.name} ${blueprint.level.formLabel}`;

      if (blueprintAlreadySeeded && !forceReseed) {
        console.log(
          `[curriculum] ${blueprintLabel} already seeded. Skipping heavy content writes.`,
        );
        continue;
      }

      console.log(`[curriculum] Seeding ${blueprintLabel} mastery content...`);

      for (const node of blueprint.masteryNodes) {
        await prisma.masteryNode.upsert({
          where: { id: node.id },
          update: {
            topicId: node.topicId,
            code: node.code,
            nodeType: node.nodeType,
            title: node.title,
            learningObjective: node.learningObjective,
            difficultyBand: node.difficultyBand ?? DifficultyBand.CORE,
            sequenceOrder: node.sequenceOrder,
            masteryThreshold: node.masteryThreshold ?? 80,
            hintDependencyLimit: node.hintDependencyLimit ?? 1,
            retryLimit: node.retryLimit ?? 2,
            retentionReviewDays: node.retentionReviewDays ?? 7,
            active: true,
          },
          create: {
            id: node.id,
            topicId: node.topicId,
            code: node.code,
            nodeType: node.nodeType,
            title: node.title,
            learningObjective: node.learningObjective,
            difficultyBand: node.difficultyBand ?? DifficultyBand.CORE,
            sequenceOrder: node.sequenceOrder,
            masteryThreshold: node.masteryThreshold ?? 80,
            hintDependencyLimit: node.hintDependencyLimit ?? 1,
            retryLimit: node.retryLimit ?? 2,
            retentionReviewDays: node.retentionReviewDays ?? 7,
            active: true,
          },
        });

        const moduleId = `module-${node.id}`;
        await prisma.lessonModule.upsert({
          where: { id: moduleId },
          update: {
            nodeId: node.id,
            moduleType: LessonModuleType.MICRO_LESSON,
            title: `${node.title} micro lesson`,
            teachingScript: {
              objective: node.learningObjective,
              explanationStyle: "short_guided",
              note: "Seed placeholder module. Replace with curriculum-authored script.",
            },
            exampleCount: 3,
            estimatedMinutes: 8,
            tutorVisible: true,
            sequenceOrder: 1,
            contentStatus: ContentStatus.DRAFT,
          },
          create: {
            id: moduleId,
            nodeId: node.id,
            moduleType: LessonModuleType.MICRO_LESSON,
            title: `${node.title} micro lesson`,
            teachingScript: {
              objective: node.learningObjective,
              explanationStyle: "short_guided",
              note: "Seed placeholder module. Replace with curriculum-authored script.",
            },
            exampleCount: 3,
            estimatedMinutes: 8,
            tutorVisible: true,
            sequenceOrder: 1,
            contentStatus: ContentStatus.DRAFT,
          },
        });

        const checkpointStages =
          node.nodeType === MasteryNodeType.RETENTION
            ? [MasteryNodeType.RETENTION]
            : [node.nodeType];

        for (const stage of checkpointStages) {
          await prisma.masteryCheckpoint.upsert({
            where: {
              nodeId_stage: {
                nodeId: node.id,
                stage,
              },
            },
            update: {
              passRule:
                stage === MasteryNodeType.APPLICATION
                  ? "3/4 correct with no more than 1 hint"
                  : stage === MasteryNodeType.RETENTION
                    ? "80% correct on spaced review"
                    : "4/5 correct with no more than 1 hint",
              questionCount: stage === MasteryNodeType.APPLICATION ? 4 : 5,
              timeLimitMinutes: stage === MasteryNodeType.RETENTION ? 6 : 8,
            },
            create: {
              nodeId: node.id,
              stage,
              passRule:
                stage === MasteryNodeType.APPLICATION
                  ? "3/4 correct with no more than 1 hint"
                  : stage === MasteryNodeType.RETENTION
                    ? "80% correct on spaced review"
                    : "4/5 correct with no more than 1 hint",
              questionCount: stage === MasteryNodeType.APPLICATION ? 4 : 5,
              timeLimitMinutes: stage === MasteryNodeType.RETENTION ? 6 : 8,
            },
          });
        }

        await prisma.interventionRule.upsert({
        where: { id: `intervention-${node.id}` },
        update: {
          nodeId: node.id,
          triggerType:
            node.nodeType === MasteryNodeType.RETENTION
              ? InterventionTriggerType.RETENTION_DROP
              : node.nodeType === MasteryNodeType.APPLICATION
                ? InterventionTriggerType.STALLED_MASTERY
                : InterventionTriggerType.HINT_DEPENDENCE,
          triggerCondition:
            node.nodeType === MasteryNodeType.RETENTION
              ? "Retention checkpoint fails after the scheduled review window."
              : node.nodeType === MasteryNodeType.APPLICATION
                ? "Fails application tasks across 3 sessions."
                : "Uses more hints than allowed across repeated attempts.",
          systemAction: "Flag the node, add remedial path, and surface it in tutor review.",
          tutorAction: "Review misconception pattern and decide whether live intervention is needed.",
        },
        create: {
          id: `intervention-${node.id}`,
          nodeId: node.id,
          triggerType:
            node.nodeType === MasteryNodeType.RETENTION
              ? InterventionTriggerType.RETENTION_DROP
              : node.nodeType === MasteryNodeType.APPLICATION
                ? InterventionTriggerType.STALLED_MASTERY
                : InterventionTriggerType.HINT_DEPENDENCE,
          triggerCondition:
            node.nodeType === MasteryNodeType.RETENTION
              ? "Retention checkpoint fails after the scheduled review window."
              : node.nodeType === MasteryNodeType.APPLICATION
                ? "Fails application tasks across 3 sessions."
                : "Uses more hints than allowed across repeated attempts.",
          systemAction: "Flag the node, add remedial path, and surface it in tutor review.",
          tutorAction: "Review misconception pattern and decide whether live intervention is needed.",
        },
      });

        await prisma.revisionRule.upsert({
        where: { id: `revision-${node.id}` },
        update: {
          nodeId: node.id,
          scheduleType:
            node.nodeType === MasteryNodeType.RETENTION
              ? RevisionScheduleType.SPACED
              : RevisionScheduleType.WEAK_TOPIC,
          dayOffsets:
            node.nodeType === MasteryNodeType.RETENTION ? [1, 3, 7, 14] : [1, 7],
          stopCondition: "Stop after two successful review passes or tutor override.",
        },
        create: {
          id: `revision-${node.id}`,
          nodeId: node.id,
          scheduleType:
            node.nodeType === MasteryNodeType.RETENTION
              ? RevisionScheduleType.SPACED
              : RevisionScheduleType.WEAK_TOPIC,
          dayOffsets:
            node.nodeType === MasteryNodeType.RETENTION ? [1, 3, 7, 14] : [1, 7],
          stopCondition: "Stop after two successful review passes or tutor override.",
        },
      });

        const poolDefinitions = [
          { type: QuestionPoolType.TEACH, targetCount: 3, adaptivePriority: 1 },
          { type: QuestionPoolType.GUIDED_PRACTICE, targetCount: 5, adaptivePriority: 2 },
          { type: QuestionPoolType.DIAGNOSTIC, targetCount: 3, adaptivePriority: 3 },
          { type: QuestionPoolType.MASTERY, targetCount: 4, adaptivePriority: 4 },
          { type: QuestionPoolType.REVISION, targetCount: 2, adaptivePriority: 5 },
        ] as const;

        for (const poolDefinition of poolDefinitions) {
          const poolId = `${node.id}-${poolDefinition.type.toLowerCase()}`;
          await prisma.questionPool.upsert({
            where: {
              nodeId_poolType: {
                nodeId: node.id,
                poolType: poolDefinition.type,
              },
            },
            update: {
              targetCount: poolDefinition.targetCount,
              adaptivePriority: poolDefinition.adaptivePriority,
              contentStatus:
                poolDefinition.type === QuestionPoolType.MASTERY
                  ? ContentStatus.QA_REVIEW
                  : ContentStatus.DRAFT,
            },
            create: {
              id: poolId,
              nodeId: node.id,
              poolType: poolDefinition.type,
              targetCount: poolDefinition.targetCount,
              adaptivePriority: poolDefinition.adaptivePriority,
              contentStatus:
                poolDefinition.type === QuestionPoolType.MASTERY
                  ? ContentStatus.QA_REVIEW
                  : ContentStatus.DRAFT,
            },
          });

          const questionId = `${poolId}-q1`;
          await prisma.questionItem.upsert({
            where: { id: questionId },
            update: {
              poolId,
              nodeId: node.id,
              questionFormat: QuestionFormat.SHORT_ANSWER,
              difficulty:
                poolDefinition.type === QuestionPoolType.MASTERY
                  ? QuestionDifficulty.MEDIUM
                  : poolDefinition.type === QuestionPoolType.DIAGNOSTIC
                    ? QuestionDifficulty.MEDIUM
                    : QuestionDifficulty.EASY,
              prompt: buildQuestionPrompt(node.title, poolDefinition.type),
              answerKey: buildAnswerKey(node.title, poolDefinition.type),
              solutionSteps: buildSolutionSteps(node.title),
              hintLevel1: "Start by identifying the skill and what the question is asking.",
              hintLevel2: "Break the task into smaller steps before calculating.",
              hintLevel3: "Check whether the relationship or operation choice makes sense.",
              misconceptionTag: null,
              autoMarkable: true,
              languageSupport: "EN/BM",
              contentStatus: ContentStatus.DRAFT,
            },
            create: {
              id: questionId,
              poolId,
              nodeId: node.id,
              questionFormat: QuestionFormat.SHORT_ANSWER,
              difficulty:
                poolDefinition.type === QuestionPoolType.MASTERY
                  ? QuestionDifficulty.MEDIUM
                  : poolDefinition.type === QuestionPoolType.DIAGNOSTIC
                    ? QuestionDifficulty.MEDIUM
                    : QuestionDifficulty.EASY,
              prompt: buildQuestionPrompt(node.title, poolDefinition.type),
              answerKey: buildAnswerKey(node.title, poolDefinition.type),
              solutionSteps: buildSolutionSteps(node.title),
              hintLevel1: "Start by identifying the skill and what the question is asking.",
              hintLevel2: "Break the task into smaller steps before calculating.",
              hintLevel3: "Check whether the relationship or operation choice makes sense.",
              misconceptionTag: null,
              autoMarkable: true,
              languageSupport: "EN/BM",
              contentStatus: ContentStatus.DRAFT,
            },
          });
        }
      }

      for (const edge of blueprint.masteryEdges) {
        await prisma.masteryEdge.upsert({
          where: {
            fromNodeId_toNodeId: {
              fromNodeId: edge.fromNodeId,
              toNodeId: edge.toNodeId,
            },
          },
          update: {
            edgeType: edge.edgeType ?? MasteryEdgeType.REQUIRED,
          },
          create: {
            fromNodeId: edge.fromNodeId,
            toNodeId: edge.toNodeId,
            edgeType: edge.edgeType ?? MasteryEdgeType.REQUIRED,
          },
        });
      }

      for (const misconception of blueprint.misconceptions) {
        await prisma.topicMisconception.upsert({
          where: {
            topicId_code: {
              topicId: misconception.topicId,
              code: misconception.code,
            },
          },
          update: {
            label: misconception.label,
            description: misconception.description,
            remedialStrategy: misconception.remedialStrategy,
          },
          create: {
            topicId: misconception.topicId,
            code: misconception.code,
            label: misconception.label,
            description: misconception.description,
            remedialStrategy: misconception.remedialStrategy,
          },
        });
      }
    }
  }

  return {
    subjectId: subjectIds[0],
    subjectIds,
    levelId: levelIds[0],
    levelIds,
    levelCount: levelIds.length,
    domainCount,
    topicCount,
    masteryNodeCount,
  };
}
