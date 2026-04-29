type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-[1.5rem] border border-[var(--solace-line)] bg-[var(--solace-surface-strong)] p-5">
      <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-[var(--solace-ink)] marker:hidden">
        {question}
      </summary>
      <p className="mt-4 text-sm leading-7 text-[var(--solace-ink-soft)]">
        {answer}
      </p>
    </details>
  );
}
