# Form 2 Mathematics Content Schema

## Purpose

This document extends the platform curriculum architecture from `Form 1 Mathematics` into `Form 2 Mathematics` for a Malaysia KSSM-aligned, AI-first, tutor-supported tuition workflow.

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

- Form 2

Instructional model:

- AI handles daily lessons, practice, and checkpoint flow
- Human tutors step in for diagnosis, live explanation, intervention, and parent communication

---

## 1. Form 2 Domain Map

| Domain Code | Domain Name | Purpose |
|---|---|---|
| `A` | Patterns and Algebra | Build symbolic fluency from patterns into factorisation, algebraic fractions, and formulas |
| `B` | Geometry and Spatial Reasoning | Strengthen polygon, circle, and 3D shape reasoning |
| `C` | Graphs and Motion | Connect coordinates, straight-line graphs, gradient, and motion interpretation |
| `D` | Transformations and Data | Develop transformation language, averages, and simple probability |

---

## 2. Form 2 Topic Register

| Topic Code | Topic Name | Domain | Estimated Minutes | Core Outcome |
|---|---|---|---:|---|
| `A1` | Patterns and Sequences | Patterns and Algebra | 100 | Recognise, extend, and generalise simple patterns |
| `A2` | Expansion and Factorisation | Patterns and Algebra | 130 | Expand expressions and factor out common terms |
| `A3` | Algebraic Fractions and Formulae | Patterns and Algebra | 140 | Simplify algebraic fractions and substitute into formulas |
| `B1` | Polygons and Angle Relationships | Geometry and Spatial Reasoning | 110 | Use polygon properties and angle relationships confidently |
| `B2` | Circles | Geometry and Spatial Reasoning | 120 | Understand circle vocabulary and basic geometric relationships |
| `B3` | Three-Dimensional Shapes | Geometry and Spatial Reasoning | 100 | Match nets, describe structure, and interpret views |
| `C1` | Coordinates | Graphs and Motion | 90 | Plot, read, and reason with coordinates accurately |
| `C2` | Linear Graphs and Gradient | Graphs and Motion | 140 | Calculate and interpret gradient from graphs and coordinates |
| `C3` | Speed and Acceleration | Graphs and Motion | 110 | Read motion situations using rate and simple graph evidence |
| `D1` | Transformations | Transformations and Data | 120 | Describe translations, reflections, and rotations |
| `D2` | Measures of Central Tendency | Transformations and Data | 100 | Compute and choose mean, median, and mode appropriately |
| `D3` | Simple Probability | Transformations and Data | 100 | Represent and compare simple event probabilities |

---

## 3. Mastery Node Design Pattern

Each Form 2 topic is broken into node-level progression:

1. `Recognition`
2. `Procedure`
3. `Application`
4. `Retention` where needed

### Example: `C2 Linear Graphs and Gradient`

- `LG-01` Recognise straight-line graph features
- `LG-02` Calculate gradient from points or graph
- `LG-03` Interpret gradient meaning
- `LG-04` Use linear graphs to compare change

### Example: `A2 Expansion and Factorisation`

- `EF-01` Recognise equivalent algebraic forms
- `EF-02` Expand single-bracket expressions
- `EF-03` Factorise common terms
- `EF-04` Switch between expanded and factored forms in context

---

## 4. Cross-Topic Dependency Logic

Important recommended bridges in Form 2:

- `Patterns and Sequences -> Linear Graphs and Gradient`
- `Expansion and Factorisation -> Algebraic Fractions and Formulae`
- `Coordinates -> Linear Graphs and Gradient`
- `Linear Graphs and Gradient -> Speed and Acceleration`
- `Polygons and Angle Relationships -> Transformations`
- `Measures of Central Tendency -> Simple Probability`

These do not replace within-topic mastery edges. They help the platform recommend revision paths and tutor follow-up.

---

## 5. Misconception Design

Form 2 currently seeds misconception clusters for:

- pattern step confusion
- distributive expansion failure
- invalid cancellation in algebraic fractions
- polygon angle mix-up
- circle vocabulary confusion
- 3D net-to-shape gap
- gradient axis swap
- motion graph story gap
- rotation centre confusion
- average choice blur
- probability scale drift

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

This keeps Form 2 consistent with the same content model already used for Form 1.

---

## 7. Tutor and Parent Visibility

When Form 2 nodes are connected to live study plans and homework:

- students see topic + node focus in revision tasks
- tutors see node-based quick wins, coach notes, and homework review focus
- parents see cleaner weak-topic naming and curriculum-aligned progress explanations

---

## 8. Recommended Build Order After Seed

The next high-value implementation steps are:

1. connect Form 2 topics into study-plan generation for Form 2 students
2. upgrade placeholder question items into authored question banks
3. surface Form 2 node analytics in admin curriculum heatmaps
4. add richer node-level progress views for student and parent dashboards

---

## 9. Summary

`Form 2 Mathematics` is now designed as:

- 4 domains
- 12 topics
- node-based mastery progression
- misconception-aware intervention rules
- revision-ready question pool structure

This makes it suitable for the same AI-tutor + human-intervention workflow already being built around Form 1.
