# Form 4 Mathematics Content Schema

## Purpose

This document extends the mathematics curriculum architecture into `Form 4` for a Malaysia KSSM-aligned, AI-first, tutor-supported tuition workflow.

The goal is to support:

- adaptive AI tutoring
- mastery-node progression
- node-based homework generation
- tutor intervention routing
- parent-visible progress summaries
- curriculum content operations

This is a platform schema, not a textbook chapter transcript.

## Scope

Subject:

- Mathematics

Level:

- Form 4

Instructional model:

- AI handles daily lessons, practice, and checkpoint flow
- Human tutors step in for diagnosis, live explanation, intervention, and parent communication

---

## 1. Form 4 Domain Map

| Domain Code | Domain Name | Purpose |
|---|---|---|
| `A` | Algebra and Functions | Build upper-secondary fluency with quadratic structure, graph interpretation, and symbolic modelling |
| `B` | Sets, Logic and Networks | Strengthen structured reasoning through sets, implication, and network-based decision logic |
| `C` | Graphs and Inequalities | Connect graph interpretation, feasible regions, and motion stories to real constraints |
| `D` | Statistics, Probability and Financial Mathematics | Compare spread, analyse combined events, and reason about practical financial choices |

---

## 2. Form 4 Topic Register

| Topic Code | Topic Name | Domain | Estimated Minutes | Core Outcome |
|---|---|---|---:|---|
| `A1` | Quadratic Expressions and Functions | Algebra and Functions | 150 | Recognise quadratic structure and connect representations confidently |
| `A2` | Quadratic Equations | Algebra and Functions | 150 | Solve quadratic equations and interpret their roots meaningfully |
| `B1` | Set Operations | Sets, Logic and Networks | 100 | Use union, intersection, complement, and Venn logic accurately |
| `B2` | Logical Reasoning | Sets, Logic and Networks | 100 | Interpret mathematical statements and justify conclusions clearly |
| `B3` | Graph Networks | Sets, Logic and Networks | 110 | Read and compare route structures in network-style problems |
| `C1` | Linear Inequalities in Two Variables | Graphs and Inequalities | 130 | Plot and interpret feasible regions correctly |
| `C2` | Motion Graphs | Graphs and Inequalities | 120 | Read and compare journeys using graph-based evidence |
| `D1` | Measures of Dispersion | Statistics, Probability and Financial Mathematics | 110 | Compare variation and consistency across data sets |
| `D2` | Combined Events Probability | Statistics, Probability and Financial Mathematics | 120 | Solve multi-event probability situations systematically |
| `D3` | Financial Management | Statistics, Probability and Financial Mathematics | 110 | Use budgeting mathematics to support practical financial decisions |

---

## 3. Mastery Node Design Pattern

Each Form 4 topic is broken into node-level progression:

1. `Recognition`
2. `Procedure`
3. `Application`
4. `Retention` where needed later

### Example: `A2 Quadratic Equations`

- `QE-01` Recognise quadratic equation structure
- `QE-02` Solve simple quadratic equations by factorisation
- `QE-03` Check and interpret roots
- `QE-04` Use quadratic equations in applied problems

### Example: `C1 Linear Inequalities in Two Variables`

- `LI-01` Recognise inequality regions in two variables
- `LI-02` Plot boundary lines for inequalities
- `LI-03` Represent feasible regions
- `LI-04` Use feasible regions in context

---

## 4. Cross-Topic Dependency Logic

Important recommended bridges in Form 4:

- `Quadratic Expressions and Functions -> Quadratic Equations`
- `Set Operations -> Logical Reasoning`
- `Set Operations -> Combined Events Probability`
- `Straight Lines (Form 3) -> Linear Inequalities in Two Variables`
- `Straight Lines (Form 3) -> Motion Graphs`
- `Measures of Dispersion -> Financial Management`

These do not replace within-topic mastery edges. They help the platform recommend revision paths and tutor follow-up.

---

## 5. Misconception Design

Form 4 currently seeds misconception clusters for:

- quadratic versus linear blur
- factor-to-root interpretation break
- Venn overlap counting errors
- logical statement meaning drift
- route-structure confusion
- boundary and shading mix-up
- motion graph meaning swap
- spread versus centre confusion
- tree/table representation selection gap
- budget interpretation gap

These are used for:

- tutor risk surfacing
- AI hint ladder selection
- homework follow-up language
- parent-facing weak-topic summaries

---

## 6. Node-Driven Content Objects

For each mastery node, the platform seeds:

- `1` lesson module
- `1` checkpoint structure
- `1` intervention rule
- `1` revision rule
- `5` question pools
  - teach
  - guided practice
  - diagnostic
  - mastery
  - revision
- placeholder question items for each pool

This keeps Form 4 aligned with the same content model already used for Forms 1 to 3.

---

## 7. Tutor and Parent Visibility

When Form 4 nodes are connected to live study plans and homework:

- students see topic + node focus in revision tasks
- tutors see node-based quick wins, coach notes, and homework review focus
- parents see cleaner weak-topic naming and curriculum-aligned progress explanations

---

## 8. Recommended Build Order After Seed

The next high-value implementation steps are:

1. connect Form 4 topics into study-plan generation for Form 4 students
2. upgrade placeholder question items into authored upper-secondary question banks
3. surface Form 4 node analytics in admin curriculum heatmaps
4. add richer node-level progress views for student and parent dashboards

---

## 9. Summary

`Form 4 Mathematics` is now designed as:

- 4 domains
- 10 topics
- node-based mastery progression
- misconception-aware intervention rules
- revision-ready question pool structure

This makes it suitable for the same AI-tutor + human-intervention workflow already being built around Forms 1 to 3, while preparing the platform for upper-secondary reasoning and exam-style support.
