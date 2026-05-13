"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

type RoleAssistantChatboxProps = {
  role: "student" | "parent" | "tutor";
  roleId?: string;
};

type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  title?: string;
  guardrail?: string;
};

type RoleAssistantPromptEventDetail = {
  role: "student" | "parent" | "tutor";
  message: string;
};

const roleAssistantPromptEventName = "role-assistant:prompt";

export function promptRoleAssistant(detail: RoleAssistantPromptEventDetail) {
  window.dispatchEvent(
    new CustomEvent<RoleAssistantPromptEventDetail>(roleAssistantPromptEventName, {
      detail,
    }),
  );
}

const roleConfig = {
  student: {
    badge: "Stuck? Ask AI",
    title: "Use AI when a question, topic, or class task slows you down",
    intro:
      "I can explain tutor-approved homework, help with one weak topic at a time, and tell you what to do next when you feel stuck.",
    prompt: "Ask about this question, this topic, or what to do next…",
    suggestions: [
      "Explain this homework question",
      "What should I do next today?",
      "What topic am I fixing right now?",
    ],
    accent: "text-[#3B6CFF]",
    shell:
      "border-[#d9e6ff] bg-[radial-gradient(circle_at_18%_18%,rgba(18,207,243,0.12),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(124,92,255,0.12),transparent_20%),linear-gradient(135deg,#ffffff_0%,#f5f9ff_58%,#f8f5ff_100%)] shadow-[0_20px_54px_rgba(59,108,255,0.12)]",
    panel: "border-[#dbe7ff] bg-white/94",
    userBubble:
      "border-transparent bg-[linear-gradient(135deg,#e7f0ff_0%,#efe8ff_100%)]",
    chip: "border-[#dbe7ff] bg-white text-[#3B6CFF]",
    button:
      "bg-[linear-gradient(135deg,#3B6CFF_0%,#7C5CFF_100%)] text-white shadow-[0_12px_28px_rgba(59,108,255,0.22)]",
  },
  parent: {
    badge: "Need clarity? Ask AI",
    title: "Use AI to understand progress, feedback, and what to support at home",
    intro:
      "I can explain tutor-approved reports in plain language, summarise feedback, and help you understand the next support step.",
    prompt: "Ask what changed this week, what needs support, or what to do next…",
    suggestions: [
      "What changed this week?",
      "Explain the latest homework feedback",
      "How should I support at home this week?",
    ],
    accent: "text-[#20C997]",
    shell:
      "border-[#c8f1e5] bg-[radial-gradient(circle_at_18%_18%,rgba(32,201,151,0.18),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(18,207,243,0.16),transparent_20%),linear-gradient(135deg,#ffffff_0%,#ecfdf5_54%,#eefcff_100%)] shadow-[0_24px_70px_rgba(32,201,151,0.14)]",
    panel: "border-[#d3efe6] bg-white/94",
    userBubble:
      "border-transparent bg-[linear-gradient(135deg,#ecfdf5_0%,#e0f7ff_100%)]",
    chip: "border-[#c8f1e5] bg-white text-[#20C997]",
    button:
      "bg-[linear-gradient(135deg,#20C997_0%,#12CFF3_100%)] text-white shadow-[0_12px_28px_rgba(32,201,151,0.2)]",
  },
  tutor: {
    badge: "Need a second brain? Ask AI",
    title: "Use AI to prioritise students, reviews, and follow-up without losing the thread",
    intro:
      "I can help you decide what to do first, which student needs attention, and what to close before the next class starts.",
    prompt: "Ask what to prioritise, who needs attention, or what to close next…",
    suggestions: [
      "What should I do first today?",
      "Which student needs attention?",
      "What should I close after class?",
    ],
    accent: "text-[#7C5CFF]",
    shell:
      "border-[#ddd4ff] bg-[radial-gradient(circle_at_18%_18%,rgba(124,92,255,0.18),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(59,108,255,0.16),transparent_20%),linear-gradient(135deg,#ffffff_0%,#f2edff_48%,#eef4ff_100%)] shadow-[0_24px_70px_rgba(124,92,255,0.14)]",
    panel: "border-[#e1d9ff] bg-white/94",
    userBubble:
      "border-transparent bg-[linear-gradient(135deg,#f1ebff_0%,#e7f0ff_100%)]",
    chip: "border-[#ddd4ff] bg-white text-[#7C5CFF]",
    button:
      "bg-[linear-gradient(135deg,#7C5CFF_0%,#3B6CFF_100%)] text-white shadow-[0_12px_28px_rgba(124,92,255,0.2)]",
  },
} as const;

export function RoleAssistantChatbox({
  role,
  roleId,
}: RoleAssistantChatboxProps) {
  const config = roleConfig[role];
  const messageCounter = useRef(0);
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: `${role}-intro`,
      role: "assistant",
      title: config.badge,
      content: config.intro,
    },
  ]);

  function nextMessageId(prefix: "user" | "assistant") {
    messageCounter.current += 1;
    return `${prefix}-${messageCounter.current}`;
  }

  const sendMessage = useCallback((message: string) => {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: nextMessageId("user"),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);

    startTransition(() => {
      void fetch("/api/role-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          roleId,
          message: trimmed,
        }),
      })
        .then(async (response) => {
          const payload = (await response.json()) as {
            error?: string;
            reply?: {
              title: string;
              answer: string;
              suggestions: string[];
              guardrail: string;
            };
          };

          if (!response.ok || !payload.reply) {
            throw new Error(payload.error ?? "Failed to generate assistant reply.");
          }

          const reply = payload.reply;

          setMessages((current) => [
            ...current,
            {
              id: nextMessageId("assistant"),
              role: "assistant",
              title: reply.title,
              content: reply.answer,
              guardrail: reply.guardrail,
            },
          ]);
        })
        .catch((err: unknown) => {
          setError(
            err instanceof Error ? err.message : "Failed to generate assistant reply.",
          );
        });
    });
  }, [role, roleId]);

  useEffect(() => {
    function handlePrompt(event: Event) {
      const customEvent = event as CustomEvent<RoleAssistantPromptEventDetail>;

      if (customEvent.detail.role !== role) {
        return;
      }

      sendMessage(customEvent.detail.message);
    }

    window.addEventListener(roleAssistantPromptEventName, handlePrompt);

    return () => {
      window.removeEventListener(roleAssistantPromptEventName, handlePrompt);
    };
  }, [role, sendMessage]);

  return (
    <section
      className={`rounded-[2.25rem] border p-6 shadow-[0_18px_48px_rgba(59,108,255,0.08)] ${config.shell}`}
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${config.accent}`}>
              {config.badge}
            </p>
            <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${config.chip}`}>
              Instant role-aware AI
            </div>
            <div className="rounded-full border border-white/80 bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5B6472] shadow-[0_10px_22px_rgba(59,108,255,0.06)]">
              Smart sidekick
            </div>
          </div>
          <h2 className="mt-3 text-[1.55rem] font-semibold tracking-tight text-[#111827] sm:text-[1.7rem]">
            {config.title}
          </h2>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {config.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => sendMessage(suggestion)}
            className="solace-soft-pill rounded-full border border-white/80 bg-white/88 px-4 py-2 text-sm font-semibold text-[#111827] shadow-[0_10px_22px_rgba(59,108,255,0.06)]"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="mt-6 max-h-[360px] space-y-4 overflow-y-auto pr-1">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-[1.5rem] border px-5 py-4 ${
              message.role === "assistant"
                ? config.panel
                : config.userBubble
            }`}
          >
            {message.title ? (
              <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${config.accent}`}>
                {message.title}
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-7 text-[#5B6472]">{message.content}</p>
            {message.guardrail ? (
              <p className="mt-3 text-xs leading-6 text-[#6b7280]">{message.guardrail}</p>
            ) : null}
          </article>
        ))}

        {isPending ? (
          <div className={`rounded-[1.5rem] border px-5 py-4 text-sm text-[#5B6472] ${config.panel}`}>
            Thinking through the best role-specific answer...
          </div>
        ) : null}
      </div>

      <div className={`mt-6 rounded-[1.75rem] border p-4 shadow-[0_14px_32px_rgba(59,108,255,0.08)] ${config.panel}`}>
        <label className="block">
          <span className="sr-only">{config.prompt}</span>
          <textarea
            rows={3}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={config.prompt}
            className="w-full resize-none rounded-[1.25rem] border border-white/80 bg-[#f8fbff] px-4 py-3 text-sm leading-7 text-[#111827] outline-none transition focus:border-[#7C5CFF]"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-[#fb7185]">{error}</p> : null}
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xs leading-6 text-[#6b7280]">
            Answers stay inside the current dashboard role and tutor-approved workflow.
          </p>
          <button
            type="button"
            disabled={isPending || input.trim().length === 0}
            onClick={() => sendMessage(input)}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
              config.button
            } ${isPending || input.trim().length === 0 ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {isPending ? "Thinking..." : "Ask AI"}
          </button>
        </div>
      </div>
    </section>
  );
}
