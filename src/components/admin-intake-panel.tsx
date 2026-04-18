"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type BookingRequestItem = {
  id: string;
  parentName: string;
  studentName: string;
  studentLevel: string;
  subjectFocus: string;
  preferredTime: string;
  status: string;
  submittedAt: string;
};

type TutorApplicationItem = {
  id: string;
  fullName: string;
  email: string;
  primarySubject: string;
  levelsTaught: string;
  status: string;
  submittedAt: string;
};

type EnrollmentDraftItem = {
  id: string;
  studentId: string | null;
  matchedTutorId: string | null;
  classId: string | null;
  studentName: string;
  studentLevel: string;
  subjectFocus: string;
  preferredTime: string;
  status: string;
  updatedAt: string;
};

type TutorOption = {
  id: string;
  name: string;
  email: string;
};

type ClassOption = {
  id: string;
  tutorId: string;
  title: string;
  subjectName: string;
  schedule: string;
};

type ClassRoster = {
  id: string;
  title: string;
  subjectName: string;
  tutorName: string;
  schedule: string;
  students: string[];
};

type AdminIntakePanelProps = {
  bookingRequests: BookingRequestItem[];
  tutorApplications: TutorApplicationItem[];
  enrollmentDrafts: EnrollmentDraftItem[];
  tutorOptions: TutorOption[];
  classOptions: ClassOption[];
  classRosters: ClassRoster[];
};

const bookingStatuses = ["NEW", "REVIEWING", "CONTACTED", "ARCHIVED"] as const;
const applicationStatuses = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "ARCHIVED",
] as const;

export function AdminIntakePanel({
  bookingRequests,
  tutorApplications,
  enrollmentDrafts,
  tutorOptions,
  classOptions,
  classRosters,
}: AdminIntakePanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [draftForms, setDraftForms] = useState<
    Record<
      string,
      {
        tutorId: string;
        classMode: "existing" | "new";
        classId: string;
        newClassTitle: string;
        newClassSchedule: string;
      }
    >
  >(
    Object.fromEntries(
      enrollmentDrafts.map((item) => [
        item.id,
        {
          tutorId: item.matchedTutorId ?? "",
          classMode: item.classId ? "existing" : "new",
          classId: item.classId ?? "",
          newClassTitle: `${item.studentLevel} ${item.subjectFocus} Guided Class`,
          newClassSchedule:
            item.preferredTime === "To be confirmed" ? "" : item.preferredTime,
        },
      ]),
    ),
  );

  function runMutation(
    key: string,
    url: string,
    options: RequestInit,
    fallbackError: string,
  ) {
    setError(null);
    setBusyKey(key);

    startTransition(() => {
      void fetch(url, options)
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;

          if (!response.ok) {
            throw new Error(payload?.error ?? fallbackError);
          }

          router.refresh();
        })
        .catch((reason: unknown) => {
          setError(
            reason instanceof Error ? reason.message : fallbackError,
          );
        })
        .finally(() => {
          setBusyKey(null);
        });
    });
  }

  return (
    <>
      {error ? (
        <section className="glass-panel rounded-[2rem] border border-coral/30 p-5 text-sm leading-7 text-coral">
          {error}
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Parent Intake Queue</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            New class booking requests waiting for follow-up
          </h2>
          <div className="mt-8 space-y-4">
            {bookingRequests.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No new booking requests are waiting right now.
              </div>
            ) : (
              bookingRequests.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {item.parentName} for {item.studentName}
                      </p>
                      <p className="text-sm text-muted">
                        {item.studentLevel} · {item.subjectFocus}
                      </p>
                    </div>
                    <div className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                      {item.status}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                    <p>Preferred time: {item.preferredTime}</p>
                    <p>Submitted: {item.submittedAt}</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {bookingStatuses.map((status) => (
                      <button
                        key={`${item.id}-${status}`}
                        type="button"
                        disabled={isPending || busyKey === `${item.id}-${status}`}
                        onClick={() =>
                          runMutation(
                            `${item.id}-${status}`,
                            `/api/book-class/${item.id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status }),
                            },
                            "Unable to update booking request status.",
                          )
                        }
                        className="rounded-full border border-border bg-white/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Mark {status}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={isPending || busyKey === `${item.id}-convert`}
                      onClick={() =>
                        runMutation(
                          `${item.id}-convert`,
                          `/api/book-class/${item.id}/convert`,
                          { method: "POST" },
                          "Unable to convert booking into an enrollment draft.",
                        )
                      }
                      className="rounded-full bg-teal px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#09443c] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Convert to Enrollment Draft
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-8">
          <p className="text-sm font-medium text-muted">Tutor Intake Queue</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Tutor applications ready for review
          </h2>
          <div className="mt-8 space-y-4">
            {tutorApplications.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted">
                No tutor applications are waiting right now.
              </div>
            ) : (
              tutorApplications.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {item.fullName}
                      </p>
                      <p className="text-sm text-muted">{item.email}</p>
                    </div>
                    <div className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-[#8b5a13]">
                      {item.status}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                    <p>Subject: {item.primarySubject}</p>
                    <p>Levels: {item.levelsTaught}</p>
                    <p className="sm:col-span-2">Submitted: {item.submittedAt}</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {applicationStatuses.map((status) => (
                      <button
                        key={`${item.id}-${status}`}
                        type="button"
                        disabled={isPending || busyKey === `${item.id}-${status}`}
                        onClick={() =>
                          runMutation(
                            `${item.id}-${status}`,
                            `/api/tutor-apply/${item.id}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status }),
                            },
                            "Unable to update tutor application status.",
                          )
                        }
                        className="rounded-full border border-border bg-white/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Mark {status}
                      </button>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Enrollment Drafts</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Booking requests already converted into setup work
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {enrollmentDrafts.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted lg:col-span-3">
              No enrollment drafts yet. Convert a booking request to create one.
            </div>
          ) : (
            enrollmentDrafts.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold text-foreground">
                    {item.studentName}
                  </p>
                  <div className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                    {item.status}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p>{item.studentLevel}</p>
                  <p>{item.subjectFocus}</p>
                  <p>Preferred time: {item.preferredTime}</p>
                  <p>Updated: {item.updatedAt}</p>
                </div>
                {item.classId ? (
                  <a
                    href={`#class-roster-${item.classId}`}
                    className="mt-4 inline-flex rounded-full border border-border bg-white/80 px-3 py-2 text-xs font-semibold text-foreground transition hover:border-teal hover:text-teal"
                  >
                    View Class Roster
                  </a>
                ) : null}
                <div className="mt-5 grid gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted">Tutor</span>
                    <select
                      value={draftForms[item.id]?.tutorId ?? ""}
                      onChange={(event) =>
                        setDraftForms((current) => ({
                          ...current,
                          [item.id]: {
                            ...(current[item.id] ?? {
                              tutorId: "",
                              classMode: "new",
                              classId: "",
                              newClassTitle: "",
                              newClassSchedule: "",
                            }),
                            tutorId: event.target.value,
                            classId: "",
                          },
                        }))
                      }
                      className="w-full rounded-[1rem] border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-teal"
                    >
                      <option value="">Select tutor</option>
                      {tutorOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} · {option.email}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {(["existing", "new"] as const).map((mode) => (
                      <button
                        key={`${item.id}-${mode}`}
                        type="button"
                        onClick={() =>
                          setDraftForms((current) => ({
                            ...current,
                            [item.id]: {
                              ...(current[item.id] ?? {
                                tutorId: "",
                                classMode: "new",
                                classId: "",
                                newClassTitle: "",
                                newClassSchedule: "",
                              }),
                              classMode: mode,
                            },
                          }))
                        }
                        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                          (draftForms[item.id]?.classMode ?? "new") === mode
                            ? "bg-teal text-white"
                            : "border border-border bg-white/80 text-foreground hover:border-teal hover:text-teal"
                        }`}
                      >
                        {mode === "existing" ? "Use Existing Class" : "Create New Class"}
                      </button>
                    ))}
                  </div>

                  {(draftForms[item.id]?.classMode ?? "new") === "existing" ? (
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-muted">Existing class</span>
                      <select
                        value={draftForms[item.id]?.classId ?? ""}
                        onChange={(event) =>
                          setDraftForms((current) => ({
                            ...current,
                            [item.id]: {
                              ...(current[item.id] ?? {
                                tutorId: "",
                                classMode: "existing",
                                classId: "",
                                newClassTitle: "",
                                newClassSchedule: "",
                              }),
                              classId: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-[1rem] border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-teal"
                      >
                        <option value="">Select class</option>
                        {classOptions
                          .filter(
                            (option) =>
                              !draftForms[item.id]?.tutorId ||
                              option.tutorId === draftForms[item.id]?.tutorId,
                          )
                          .map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.title} · {option.subjectName} · {option.schedule}
                            </option>
                          ))}
                      </select>
                    </label>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-muted">New class title</span>
                        <input
                          value={draftForms[item.id]?.newClassTitle ?? ""}
                          onChange={(event) =>
                            setDraftForms((current) => ({
                              ...current,
                              [item.id]: {
                                ...(current[item.id] ?? {
                                  tutorId: "",
                                  classMode: "new",
                                  classId: "",
                                  newClassTitle: "",
                                  newClassSchedule: "",
                                }),
                                newClassTitle: event.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-[1rem] border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-teal"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-muted">Class schedule</span>
                        <input
                          value={draftForms[item.id]?.newClassSchedule ?? ""}
                          onChange={(event) =>
                            setDraftForms((current) => ({
                              ...current,
                              [item.id]: {
                                ...(current[item.id] ?? {
                                  tutorId: "",
                                  classMode: "new",
                                  classId: "",
                                  newClassTitle: "",
                                  newClassSchedule: "",
                                }),
                                newClassSchedule: event.target.value,
                              },
                            }))
                          }
                          placeholder="Mondays and Thursdays, 8:00 PM"
                          className="w-full rounded-[1rem] border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-teal"
                        />
                      </label>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isPending || busyKey === `${item.id}-fulfill`}
                    onClick={() =>
                      runMutation(
                        `${item.id}-fulfill`,
                        `/api/enrollment-drafts/${item.id}/fulfill`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(draftForms[item.id]),
                        },
                        "Unable to create the formal enrollment.",
                      )
                    }
                    className="rounded-full bg-teal px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#09443c] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Create Formal Enrollment
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-medium text-muted">Class Rosters</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Active classes and enrolled students
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {classRosters.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-border bg-surface-strong p-6 text-sm leading-7 text-muted lg:col-span-2">
              No class rosters available yet.
            </div>
          ) : (
            classRosters.map((item) => (
              <article
                key={item.id}
                id={`class-roster-${item.id}`}
                className="rounded-[1.75rem] border border-border bg-surface-strong p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted">
                      {item.subjectName} · {item.schedule}
                    </p>
                  </div>
                  <div className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
                    {item.tutorName}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.students.length === 0 ? (
                    <div className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-muted">
                      No students enrolled yet
                    </div>
                  ) : (
                    item.students.map((student) => (
                      <div
                        key={`${item.id}-${student}`}
                        className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-foreground"
                      >
                        {student}
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
