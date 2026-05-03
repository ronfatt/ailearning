import { getParentDashboardData, type ParentDashboardData } from "@/lib/server/parent-dashboard";
import { getStudentDashboardData, type StudentDashboardData } from "@/lib/server/student-dashboard";
import { getTutorDashboardData, type TutorDashboardData } from "@/lib/server/tutor-dashboard";

export type RoleAssistantKind = "student" | "parent" | "tutor";

export type RoleAssistantReply = {
  title: string;
  answer: string;
  suggestions: string[];
  guardrail: string;
};

function normalizeMessage(message: string) {
  return message.trim().toLowerCase();
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function buildStudentReply(
  message: string,
  data: StudentDashboardData,
): RoleAssistantReply {
  const query = normalizeMessage(message);
  const homework = data.assignedHomework[0] ?? null;
  const weakestTopic = data.subjectProgress[0] ?? null;
  const nextClass = data.upcomingClass;

  if (includesAny(query, ["homework", "assignment", "submit", "redo"])) {
    return {
      title: "Homework next step",
      answer: homework
        ? `${homework.title} is the clearest next task. ${homework.prompt} ${
            homework.submissionDetails?.versionCount
              ? `You already have ${homework.submissionDetails.versionCount} submission version${homework.submissionDetails.versionCount > 1 ? "s" : ""}, so review the tutor comments before you resubmit.`
              : `Complete the answer summary and each question before sending it to your tutor.`
          }`
        : "There is no tutor-approved homework open right now, so your best next move is the readiness check or approved revision tasks.",
      suggestions: [
        "What should I revise before resubmitting?",
        "Summarise my weakest topic",
        "What should I ask my tutor next class?",
      ],
      guardrail:
        "I can help you study inside tutor-approved topics, but I cannot replace your teacher or unlock new topics on my own.",
    };
  }

  if (includesAny(query, ["weak", "topic", "revise", "revision", "mistake"])) {
    return {
      title: "Weak topic summary",
      answer: weakestTopic
        ? `${weakestTopic.title} is currently the weakest tutor-tracked area at ${weakestTopic.mastery}%. ${weakestTopic.note} Focus on that before moving into extra topics.`
        : "Your tutor has not published mastery signals yet, so stay inside the current homework and revision tasks first.",
      suggestions: [
        "Give me a 10-minute revision plan",
        "Which approved topics can I ask AI about?",
        "What should I finish before class?",
      ],
      guardrail:
        "I stay inside the approved study plan. I cannot create a separate learning path or act as your main teacher.",
    };
  }

  if (includesAny(query, ["class", "next class", "lesson", "tutor"])) {
    return {
      title: "Next class focus",
      answer: `${nextClass.className} is your next tutor-led session. It is ${nextClass.subject} with ${nextClass.tutorName}. The best preparation is to finish the open homework and arrive ready to ask about ${weakestTopic?.title ?? "the topic you still find difficult"}.`,
      suggestions: [
        "What should I finish before class?",
        "Help me write one question for my tutor",
        "What is my current progress summary?",
      ],
      guardrail:
        "I can help you prepare for the tutor-led class, but the tutor remains the primary teacher.",
    };
  }

  return {
    title: "Study support",
    answer: `Your next class is ${nextClass.className}, and your strongest next move is to ${
      homework ? `finish ${homework.title}` : "work through the approved revision tasks"
    }. ${weakestTopic ? `${weakestTopic.title} is still the topic to watch.` : ""}`,
    suggestions: [
      "What homework should I do first?",
      "What is my weakest topic?",
      "How should I prepare for the next class?",
    ],
    guardrail:
      "I support revision, homework, and preparation after tutor-led lessons. I do not replace your tutor.",
  };
}

function buildParentReply(
  message: string,
  data: ParentDashboardData,
): RoleAssistantReply {
  const query = normalizeMessage(message);
  const latestFeedback = data.recentHomeworkFeedback[0] ?? null;
  const latestInsight = data.insights[0] ?? null;
  const enrolledClass = data.enrolledClass;

  if (includesAny(query, ["progress", "improving", "summary", "report"])) {
    return {
      title: "Progress snapshot",
      answer: data.latestReport
        ? `${data.studentName} is currently being tracked through tutor-approved reports. Latest summary: ${data.latestReport.summary} ${data.latestReport.tutorNotes ? `Tutor note: ${data.latestReport.tutorNotes}` : ""}`
        : `${data.studentName} does not have a tutor-approved report yet, so the clearest signal right now is attendance, homework completion, and the class placement status.`,
      suggestions: [
        "What should we focus on this week?",
        "Explain the latest homework feedback",
        "When is the next class?",
      ],
      guardrail:
        "I can explain tutor-approved progress data, but I do not create independent academic advice outside the tutor workflow.",
    };
  }

  if (includesAny(query, ["homework", "feedback", "redo", "resubmit"])) {
    return {
      title: "Homework explanation",
      answer: latestFeedback
        ? `${latestFeedback.title} was marked ${latestFeedback.score}. ${latestFeedback.tutorFeedback} ${latestFeedback.progressNote}`
        : "There is no tutor-reviewed homework feedback yet. Once the tutor marks the latest submission, this area will become much clearer for parents.",
      suggestions: [
        "What is the weak topic right now?",
        "How can I support at home?",
        "What should I ask the tutor?",
      ],
      guardrail:
        "I translate tutor feedback into plain language for parents. I do not replace direct tutor guidance when a child needs intervention.",
    };
  }

  if (includesAny(query, ["support", "help at home", "what can i do", "weak topic"])) {
    return {
      title: "Support at home",
      answer: latestInsight
        ? `${latestInsight.value} is the clearest area to support right now. The safest home support is short, low-pressure revision around tutor-assigned work, then bringing unresolved confusion back to the tutor.`
        : "The best support right now is to keep your child consistent with class attendance, homework completion, and the tutor-approved study plan.",
      suggestions: [
        "Summarise the latest report in plain language",
        "What is the next class and tutor?",
        "What should we prioritise this week?",
      ],
      guardrail:
        "I can help parents understand learning signals, but final academic judgment stays with the tutor.",
    };
  }

  return {
    title: "Parent guidance",
    answer: `${data.studentName} is currently linked to ${
      enrolledClass ? `${enrolledClass.className} with ${enrolledClass.tutorName}` : "a pending class placement"
    }. The most useful parent checks are the weekly summary, recent homework feedback, and the current support area.`,
    suggestions: [
      "Summarise my child's progress",
      "Explain the latest homework feedback",
      "How should I support at home this week?",
    ],
    guardrail:
      "I keep parent updates clear and practical, but I stay inside tutor-approved reporting and feedback.",
  };
}

function buildTutorReply(
  message: string,
  data: TutorDashboardData,
): RoleAssistantReply {
  const query = normalizeMessage(message);
  const liveClass = data.liveClassWorkspace[0] ?? null;
  const nextSubmission = data.submissionReviewQueue[0] ?? null;
  const nextAlert = data.riskAlerts[0] ?? null;

  if (includesAny(query, ["what should i do", "priority", "first", "today"])) {
    return {
      title: "Tutor priority order",
      answer: `Start with ${
        liveClass ? `${liveClass.sessionTitle} for ${liveClass.classId}` : "the live class workspace"
      }, then clear ${
        data.summary.totalPendingApprovals
      } pending approval item${data.summary.totalPendingApprovals === 1 ? "" : "s"}. ${
        nextSubmission
          ? `After that, review ${nextSubmission.title} from ${nextSubmission.owner}.`
          : "Homework review is currently clear."
      }`,
      suggestions: [
        "Which student needs attention first?",
        "What is blocking follow-up right now?",
        "Summarise the live class signals",
      ],
      guardrail:
        "I help prioritise class prep and follow-up, but you remain the primary educator and final decision-maker.",
    };
  }

  if (includesAny(query, ["student", "attention", "risk", "who needs help"])) {
    return {
      title: "Student attention signal",
      answer: nextAlert
        ? `${nextAlert.student} is the highest current risk signal. ${nextAlert.risk} Recommended action: ${nextAlert.action}`
        : liveClass && liveClass.studentSignals[0]
          ? `${liveClass.studentSignals[0].studentName} is the highest-priority student in the live workspace. ${liveClass.studentSignals[0].coachNote}`
          : "There is no high-risk student alert yet, so focus on the live class checklist and pending approvals.",
      suggestions: [
        "Summarise the homework review queue",
        "What should I say to parents next?",
        "What is the weakest topic in class?",
      ],
      guardrail:
        "I can surface signals and next actions, but final classroom judgment and communication stay with the tutor.",
    };
  }

  if (includesAny(query, ["parent", "report", "follow-up", "homework review"])) {
    return {
      title: "Follow-up workflow",
      answer: `There are ${data.summary.parentReportQueue} parent report draft(s), ${data.summary.homeworkQueue} homework approval item(s), and ${data.summary.submissionReviewQueue} submission review item(s) in the current loop. ${
        nextSubmission
          ? `The clearest next student-facing task is to review ${nextSubmission.title}, then close the loop with tutor feedback and a parent-visible summary.`
          : "The current follow-up queue is light enough to focus on planning and class delivery."
      }`,
      suggestions: [
        "What should I approve next?",
        "Summarise the after-class follow-up panel",
        "What is the next move for the selected class?",
      ],
      guardrail:
        "I support planning, drafting, and queue handling. I do not send tutor-facing content without your review.",
    };
  }

  return {
    title: "Tutor copilot",
    answer: `You currently have ${data.summary.totalPendingApprovals} pending approval item${data.summary.totalPendingApprovals === 1 ? "" : "s"} and ${data.summary.submissionReviewQueue} homework review${
      data.summary.submissionReviewQueue === 1 ? "" : "s"
    }. ${
      liveClass
        ? `The live workspace is anchored on ${liveClass.focusTopic}, and ${liveClass.supportCount} student signal${liveClass.supportCount === 1 ? "" : "s"} need support.`
        : "No live class workspace is currently selected."
    }`,
    suggestions: [
      "What should I do first today?",
      "Which student needs attention?",
      "How should I handle follow-up after class?",
    ],
    guardrail:
      "I am a teaching copilot for planning, class support, and follow-up. You remain the teacher in control.",
  };
}

export async function getRoleAssistantReply({
  role,
  roleId,
  message,
}: {
  role: RoleAssistantKind;
  roleId?: string;
  message: string;
}): Promise<RoleAssistantReply> {
  if (role === "student") {
    const data = await getStudentDashboardData(roleId);
    return buildStudentReply(message, data);
  }

  if (role === "parent") {
    const data = await getParentDashboardData(roleId);
    return buildParentReply(message, data);
  }

  const data = await getTutorDashboardData(roleId);
  return buildTutorReply(message, data);
}
