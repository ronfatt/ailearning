# Form 3 Mathematics Content Schema

## Purpose

This document extends the mathematics curriculum architecture into `Form 3` for a Malaysia KSSM-aligned, AI-first, tutor-supported tuition workflow.

The goal is to support:

- adaptive AI tutoring
- mastery-node progression
- node-based homework generation
- tutor intervention routing
- parent-visible progress summaries
- curriculum content operations

This is a platform schema, not a chapter-by-chapter textbook transcript.

## Scope

Subject:

- Mathematics

Level:

- Form 3

Instructional model:

- AI handles daily lessons, practice, and checkpoint flow
- Human tutors step in for diagnosis, live explanation, intervention, and parent communication

---

## 1. Form 3 Domain Map

| Domain Code | Domain Name | Purpose |
|---|---|---|
| `A` | Number Systems and Consumer Mathematics | Build fluency with indices, standard form, and practical financial reasoning |
| `B` | Geometry and Trigonometry | Strengthen scale reasoning, right-triangle trigonometry, and circle geometry |
| `C` | Spatial Representation | Develop visual reasoning through plans, elevations, and loci |
| `D` | Graphs and Linear Modelling | Use straight-line thinking and data-backed comparisons in applied contexts |

---

## 2. Form 3 Topic Register

| Topic Code | Topic Name | Domain | Estimated Minutes | Core Outcome |
|---|---|---|---:|---|
| `A1` | Indices and Standard Form | Number Systems and Consumer Mathematics | 120 | Work confidently with powers and scientific-scale numbers |
| `A2` | Savings and Investment | Number Systems and Consumer Mathematics | 110 | Compare simple growth options using clear numerical evidence |
| `A3` | Credit and Debt | Number Systems and Consumer Mathematics | 110 | Interpret repayment and borrowing situations responsibly |
| `B1` | Scale Drawings | Geometry and Trigonometry | 100 | Use scale correctly in layout and distance tasks |
| `B2` | Trigonometric Ratios | Geometry and Trigonometry | 150 | Solve right-triangle measurement problems using trig ratios |
| `B3` | Angles and Tangents in Circles | Geometry and Trigonometry | 130 | Apply key tangent and circle-angle rules in diagrams |
| `C1` | Plans and Elevations | Spatial Representation | 100 | Read and construct 2D views of 3D objects |
| `C2` | Loci in Two Dimensions | Spatial Representation | 120 | Use location rules and intersections of conditions accurately |
| `D1` | Straight Lines | Graphs and Linear Modelling | 140 | Analyse and form straight-line relationships from graphs or equations |
| `D2` | Data and Decision Making | Graphs and Linear Modelling | 100 | Justify practical decisions using data and probability evidence |

---

## 3. Mastery Node Design Pattern

Each Form 3 topic is broken into node-level progression:

1. `Recognition`
2. `Procedure`
3. `Application`
4. `Retention` where needed later

### Example: `B2 Trigonometric Ratios`

- `TRG-01` Recognise opposite, adjacent, and hypotenuse
- `TRG-02` Select the correct trigonometric ratio
- `TRG-03` Solve right-triangle trigonometry problems
- `TRG-04` Use trigonometry in measurement contexts

### Example: `D1 Straight Lines`

- `SL-01` Recognise straight-line relationships
- `SL-02` Find gradient and intercept
- `SL-03` Form straight-line equations from information
- `SL-04` Use straight lines to model situations

---

## 4. Cross-Topic Dependency Logic

Important recommended bridges in Form 3:

- `Indices and Standard Form -> Savings and Investment`
- `Savings and Investment -> Credit and Debt`
- `Scale Drawings -> Trigonometric Ratios`
- `Plans and Elevations -> Loci in Two Dimensions`
- `Trigonometric Ratios -> Straight Lines`
- `Straight Lines -> Data and Decision Making`

These do not replace within-topic mastery edges. They help the platform recommend revision paths and tutor follow-up.

---

## 5. Misconception Design

Form 3 currently seeds misconception clusters for:

- standard form decimal-shift errors
- savings return vs total value confusion
- repayment breakdown confusion
- scale conversion direction mistakes
- trigonometric ratio selection errors
- circle-rule overlap in tangent problems
- two-condition locus confusion
- intercept and gradient swap
- unsupported data-based recommendations

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

This keeps Form 3 aligned with the same content model already used for Forms 1 and 2.

---

## 7. Tutor and Parent Visibility

When Form 3 nodes are connected to live study plans and homework:

- students see topic + node focus in revision tasks
- tutors see node-based quick wins, coach notes, and homework review focus
- parents see cleaner weak-topic naming and curriculum-aligned progress explanations

---

## 8. Recommended Build Order After Seed

The next high-value implementation steps are:

1. connect Form 3 topics into study-plan generation for Form 3 students
2. upgrade placeholder question items into authored question banks
3. surface Form 3 node analytics in admin curriculum heatmaps
4. add richer node-level progress views for student and parent dashboards

---

## 9. Summary

`Form 3 Mathematics` is now designed as:

- 4 domains
- 10 topics
- node-based mastery progression
- misconception-aware intervention rules
- revision-ready question pool structure

This makes it suitable for the same AI-tutor + human-intervention workflow already being built around Forms 1 and 2.
