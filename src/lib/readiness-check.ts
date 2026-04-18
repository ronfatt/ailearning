export type ReadinessQuestion = {
  id: string;
  skill: string;
  prompt: string;
  note: string;
  options: Array<{
    key: string;
    label: string;
  }>;
  correctOption: string;
};

export const tutorApprovedReadinessQuestions: ReadinessQuestion[] = [
  {
    id: "word-problems",
    skill: "Word Problems",
    prompt:
      "Write an equation for: A taxi charges RM5 plus RM2 for each kilometer travelled.",
    note:
      "Teacher Farah approved this check to see who still struggles with translation before class.",
    options: [
      { key: "A", label: "y = 5 + 2x" },
      { key: "B", label: "y = 2 + 5x" },
      { key: "C", label: "y = 5x + 2" },
      { key: "D", label: "y = 2x - 5" },
    ],
    correctOption: "A",
  },
  {
    id: "linear-equations",
    skill: "Linear Equations",
    prompt: "Solve: 2x - 7 = 11",
    note: "This question checks whether students are ready for the live warm-up activity.",
    options: [
      { key: "A", label: "x = 7" },
      { key: "B", label: "x = 8" },
      { key: "C", label: "x = 9" },
      { key: "D", label: "x = 10" },
    ],
    correctOption: "C",
  },
  {
    id: "ratios",
    skill: "Ratios",
    prompt: "Simplify the ratio 18 : 24",
    note: "This question is included because it is part of the current tutor-approved plan.",
    options: [
      { key: "A", label: "3 : 4" },
      { key: "B", label: "4 : 3" },
      { key: "C", label: "6 : 8" },
      { key: "D", label: "9 : 12" },
    ],
    correctOption: "A",
  },
];

export function evaluateReadinessResponses(
  responses: Record<string, string>,
) {
  let correctCount = 0;
  const weakTopics: string[] = [];

  for (const question of tutorApprovedReadinessQuestions) {
    if (responses[question.id] === question.correctOption) {
      correctCount += 1;
    } else {
      weakTopics.push(question.skill);
    }
  }

  const totalQuestions = tutorApprovedReadinessQuestions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const readinessLevel =
    score >= 80 ? "ready" : score >= 50 ? "watch" : "support";
  const summary =
    weakTopics.length === 0
      ? "Student looks ready for the live session and can start with the standard warm-up."
      : `Student needs extra attention in ${weakTopics.join(", ")} before the live lesson begins.`;

  return {
    totalQuestions,
    correctCount,
    score,
    readinessLevel,
    weakTopics,
    summary,
  };
}
