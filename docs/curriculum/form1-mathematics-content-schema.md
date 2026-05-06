# Form 1 Mathematics Content Schema

## Purpose

This document turns the `Form 1 Mathematics` topic tree into a platform-ready content schema for an AI-first, tutor-supported tuition system aligned to Malaysia lower secondary learning.

The goal is to support:

- AI tutoring
- mastery tracking
- adaptive practice
- tutor intervention
- parent visibility
- content operations

This is a product schema, not a textbook chapter list.

## Scope

Subject:

- Mathematics

Level:

- Form 1

Primary instructional model:

- AI handles daily lesson delivery, guided practice, and instant feedback
- Human tutors step in for diagnosis, motivation, live explanation, and escalation

---

## 1. Core Relational Content Model

The recommended content model is:

1. `subject`
2. `level`
3. `domain`
4. `topic`
5. `mastery_node`
6. `mastery_edge`
7. `lesson_module`
8. `question_pool`
9. `question_item`
10. `checkpoint`
11. `misconception`
12. `intervention_rule`
13. `revision_rule`

### 1.1 `subject`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `subject_id` | string | `math` | Stable subject key |
| `name` | string | `Mathematics` | Display name |
| `country` | string | `Malaysia` | Curriculum territory |
| `curriculum_framework` | string | `KSSM` | Curriculum alignment |
| `active` | boolean | `true` | System availability |

### 1.2 `level`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `level_id` | string | `math-f1` | Stable level key |
| `subject_id` | fk | `math` | Subject link |
| `form` | string | `Form 1` | User-facing level |
| `age_band` | string | `13 years` | Guidance only |
| `track` | string | `Lower Secondary` | Product grouping |
| `exam_stage` | string | `Pre-PT3 foundation` | Assessment context |

### 1.3 `domain`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `domain_id` | string | `f1-algebra` | Stable domain key |
| `level_id` | fk | `math-f1` | Level link |
| `code` | string | `B` | Short domain code |
| `name` | string | `Algebra Foundations` | Display name |
| `description` | text | `Variables, expressions, equations, inequalities` | Internal guidance |
| `sequence_order` | integer | `2` | UI ordering |

### 1.4 `topic`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `topic_id` | string | `f1-b2-linear-equations` | Stable topic key |
| `domain_id` | fk | `f1-algebra` | Domain link |
| `chapter_code` | string | `B2` | Human-readable code |
| `name` | string | `Linear Equations` | Topic name |
| `summary` | text | `Understand, form, and solve simple linear equations` | Topic overview |
| `prerequisite_summary` | text | `Rational number operations, algebraic expressions` | Topic dependency summary |
| `sequence_order` | integer | `2` | UI ordering |
| `estimated_learning_minutes` | integer | `140` | AI planning |
| `estimated_revision_cycles` | integer | `3` | Default spaced repetition |

### 1.5 `mastery_node`

This is the most important table.

| Field | Type | Example | Purpose |
|---|---|---|---|
| `node_id` | string | `LE-05` | Stable mastery key |
| `topic_id` | fk | `f1-b2-linear-equations` | Topic link |
| `node_type` | enum | `procedure` | `recognition`, `procedure`, `application`, `retention` |
| `title` | string | `Solve two-step equations` | Student/tutor label |
| `learning_objective` | text | `Solve equations that require two inverse operations` | Pedagogical target |
| `difficulty_band` | enum | `core` | `foundation`, `core`, `stretch` |
| `sequence_order` | integer | `5` | Topic progression |
| `mastery_threshold` | integer | `80` | Suggested pass percentage |
| `hint_dependency_limit` | integer | `1` | Escalation threshold |
| `retry_limit` | integer | `2` | Escalation threshold |
| `retention_review_days` | integer | `7` | Review schedule |
| `active` | boolean | `true` | Availability |

### 1.6 `mastery_edge`

This tracks node dependency.

| Field | Type | Example | Purpose |
|---|---|---|---|
| `edge_id` | string | `LE-04_to_LE-05` | Stable edge key |
| `from_node_id` | fk | `LE-04` | Prerequisite node |
| `to_node_id` | fk | `LE-05` | Dependent node |
| `edge_type` | enum | `required` | `required`, `recommended` |

### 1.7 `lesson_module`

Each mastery node should map to one or more learning modules.

| Field | Type | Example | Purpose |
|---|---|---|---|
| `lesson_module_id` | string | `LM-LE-05-01` | Stable lesson key |
| `node_id` | fk | `LE-05` | Mastery link |
| `module_type` | enum | `micro-lesson` | `micro-lesson`, `worked-example`, `guided-practice`, `checkpoint-prep` |
| `title` | string | `Two-step equation basics` | Module name |
| `teaching_script` | text | `Balance method with inverse operations` | AI explanation basis |
| `example_count` | integer | `3` | Content planning |
| `estimated_minutes` | integer | `8` | Session planning |
| `tutor_visible` | boolean | `true` | Tutor oversight |

### 1.8 `question_pool`

Question pools keep items organized by intent.

| Field | Type | Example | Purpose |
|---|---|---|---|
| `pool_id` | string | `QP-LE-05-practice` | Stable pool key |
| `node_id` | fk | `LE-05` | Mastery link |
| `pool_type` | enum | `practice` | `teach`, `guided-practice`, `diagnostic`, `mastery`, `revision` |
| `target_count` | integer | `12` | Content ops target |
| `adaptive_priority` | integer | `2` | AI selection weight |

### 1.9 `question_item`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `question_id` | string | `Q-LE-05-011` | Stable question key |
| `pool_id` | fk | `QP-LE-05-practice` | Pool link |
| `node_id` | fk | `LE-05` | Fast access to mastery node |
| `question_format` | enum | `short-answer` | `mcq`, `short-answer`, `step-order`, `match`, `open-response` |
| `difficulty` | enum | `medium` | `easy`, `medium`, `hard` |
| `prompt` | text | `Solve 3x + 5 = 20` | Student-facing item |
| `answer_key` | json/text | `x = 5` | Marking logic |
| `solution_steps` | json/text | `subtract 5, divide by 3` | AI/tutor explanation |
| `misconception_tag` | string | `sign-error` | Error clustering |
| `auto_markable` | boolean | `true` | Automation flag |
| `language_support` | string | `EN/BM` | Localization planning |

### 1.10 `checkpoint`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `checkpoint_id` | string | `CP-LE-05-procedure` | Stable checkpoint key |
| `node_id` | fk | `LE-05` | Mastery node |
| `checkpoint_stage` | enum | `procedure` | `recognition`, `procedure`, `application`, `retention` |
| `pass_rule` | text | `4/5 correct with max 1 hint` | Machine/human readable |
| `question_count` | integer | `5` | Design target |
| `time_limit_minutes` | integer | `8` | Evaluation pacing |

### 1.11 `misconception`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `misconception_id` | string | `M-LE-sign-error` | Stable misconception key |
| `topic_id` | fk | `f1-b2-linear-equations` | Topic link |
| `label` | string | `Sign error after transposition` | Tutor-facing label |
| `description` | text | `Student changes sign incorrectly when moving terms` | Diagnosis |
| `remedial_strategy` | text | `Use balance-scale representation and one-step decomposition` | AI/tutor action |

### 1.12 `intervention_rule`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `rule_id` | string | `IR-LE-05-stall` | Stable rule key |
| `node_id` | fk | `LE-05` | Mastery link |
| `trigger_type` | enum | `stalled-mastery` | `stalled-mastery`, `hint-dependence`, `retention-drop`, `repeat-misconception` |
| `trigger_condition` | text | `Fails twice across 3 sessions` | Logic |
| `system_action` | text | `Open remedial path and notify tutor` | Automation |
| `tutor_action` | text | `Review error pattern and run mini intervention` | Human response |

### 1.13 `revision_rule`

| Field | Type | Example | Purpose |
|---|---|---|---|
| `revision_rule_id` | string | `RR-LE-05` | Stable revision rule key |
| `node_id` | fk | `LE-05` | Mastery link |
| `schedule_type` | enum | `spaced` | `spaced`, `weak-topic`, `pre-class`, `pre-exam` |
| `day_offsets` | string/json | `[1, 3, 7, 14]` | Repetition schedule |
| `stop_condition` | text | `Two successful retention passes` | Exit rule |

---

## 2. Form 1 Mathematics Domain Map

| Domain Code | Domain Name | Topics |
|---|---|---|
| `A` | Number and Arithmetic | Rational Numbers, Factors and Multiples, Powers and Roots, Ratio-Rate-Proportion |
| `B` | Algebra Foundations | Algebraic Language, Linear Equations, Linear Inequalities |
| `C` | Geometry and Measurement | Lines and Angles, Basic Polygons, Perimeter, Area, Pythagoras’ Theorem |
| `D` | Sets and Data | Introduction to Sets, Data Handling |

---

## 3. Form 1 Mathematics Topic Register

| Topic Code | Topic Name | Domain | Estimated Minutes | Core Outcome |
|---|---|---|---:|---|
| `A1` | Rational Numbers | Number and Arithmetic | 120 | Understand and operate with rational numbers |
| `A2` | Factors and Multiples | Number and Arithmetic | 110 | Use factorisation, HCF, and LCM accurately |
| `A3` | Powers and Roots | Number and Arithmetic | 90 | Recognise and apply squares, cubes, roots |
| `A4` | Ratio, Rate and Proportion | Number and Arithmetic | 130 | Compare, scale, and solve proportional relationships |
| `B1` | Algebraic Language | Algebra Foundations | 120 | Translate between words and algebraic expressions |
| `B2` | Linear Equations | Algebra Foundations | 140 | Form and solve linear equations in context |
| `B3` | Linear Inequalities | Algebra Foundations | 100 | Solve and represent simple inequalities |
| `C1` | Lines and Angles | Geometry and Measurement | 90 | Recognise line-angle relationships |
| `C2` | Basic Polygons | Geometry and Measurement | 90 | Classify and reason about polygons |
| `C3` | Perimeter | Geometry and Measurement | 70 | Calculate perimeter of simple and composite shapes |
| `C4` | Area | Geometry and Measurement | 120 | Calculate and compare area across basic shapes |
| `C5` | Pythagoras’ Theorem | Geometry and Measurement | 110 | Solve right-triangle length problems |
| `D1` | Introduction to Sets | Sets and Data | 80 | Read, represent, and compare simple sets |
| `D2` | Data Handling | Sets and Data | 90 | Read and interpret basic charts and tables |

---

## 4. Form 1 Mathematics Topic Tree

## A1 Rational Numbers

- A1.1 Integers
- A1.2 Fractions with sign
- A1.3 Decimals with sign
- A1.4 Number line placement
- A1.5 Comparison and ordering
- A1.6 Basic operations
- A1.7 Mixed rational number problems

## A2 Factors and Multiples

- A2.1 Factors
- A2.2 Prime numbers
- A2.3 Prime factorisation
- A2.4 Common factors
- A2.5 Highest common factor
- A2.6 Multiples
- A2.7 Common multiples
- A2.8 Lowest common multiple
- A2.9 HCF/LCM in context

## A3 Powers and Roots

- A3.1 Square numbers
- A3.2 Square roots
- A3.3 Cube numbers
- A3.4 Cube roots
- A3.5 Estimation
- A3.6 Context applications

## A4 Ratio, Rate and Proportion

- A4.1 Ratio notation
- A4.2 Equivalent ratios
- A4.3 Simplifying ratios
- A4.4 Rates
- A4.5 Proportion
- A4.6 Fraction-decimal-percentage connections
- A4.7 Context applications

## B1 Algebraic Language

- B1.1 Variables
- B1.2 Constants
- B1.3 Terms and coefficients
- B1.4 Like and unlike terms
- B1.5 Writing expressions from words
- B1.6 Simplifying expressions

## B2 Linear Equations

- B2.1 Meaning of equation
- B2.2 Solving one-step equations
- B2.3 Solving two-step equations
- B2.4 Equations with brackets
- B2.5 Verifying solutions
- B2.6 Word-to-equation translation
- B2.7 Context problem solving

## B3 Linear Inequalities

- B3.1 Meaning of inequality
- B3.2 Inequality symbols
- B3.3 Solving simple inequalities
- B3.4 Representing inequalities on number lines
- B3.5 Comparing equations vs inequalities
- B3.6 Context applications

## C1 Lines and Angles

- C1.1 Types of lines
- C1.2 Types of angles
- C1.3 Adjacent and vertically opposite angles
- C1.4 Angles on a straight line
- C1.5 Angles around a point
- C1.6 Parallel line angle relationships

## C2 Basic Polygons

- C2.1 Polygon classification
- C2.2 Regular and irregular polygons
- C2.3 Basic polygon properties
- C2.4 Symmetry
- C2.5 Introductory interior/exterior reasoning

## C3 Perimeter

- C3.1 Perimeter of triangles
- C3.2 Perimeter of quadrilaterals
- C3.3 Perimeter of composite shapes
- C3.4 Context problems

## C4 Area

- C4.1 Area of triangles
- C4.2 Area of parallelograms
- C4.3 Area of kites
- C4.4 Area of trapeziums
- C4.5 Comparing perimeter and area
- C4.6 Context problems

## C5 Pythagoras’ Theorem

- C5.1 Identify right triangles
- C5.2 Identify the hypotenuse
- C5.3 Apply the theorem
- C5.4 Find missing hypotenuse
- C5.5 Find missing shorter side
- C5.6 Context applications
- C5.7 Check whether triangle relationships fit right-angle logic

## D1 Introduction to Sets

- D1.1 Meaning of a set
- D1.2 Listing elements
- D1.3 Describing sets
- D1.4 Universal set
- D1.5 Empty set
- D1.6 Subsets
- D1.7 Complements
- D1.8 Venn diagram basics

## D2 Data Handling

- D2.1 Collect data
- D2.2 Organise data
- D2.3 Present data
- D2.4 Read tables
- D2.5 Read charts
- D2.6 Interpret and conclude

---

## 5. Mastery Node Schema Example

Below is the recommended node table structure using `Linear Equations`.

| Node ID | Stage | Title | Learning Objective | Prerequisites | Pass Rule | Tutor Trigger |
|---|---|---|---|---|---|---|
| `LE-01` | recognition | Identify variables and constants | Distinguish variable and constant parts in equations | `B1.1-B1.3` | 4/5 correct | None |
| `LE-02` | procedure | Simplify algebraic expressions | Simplify expressions before solving | `B1.4-B1.6` | 4/5 correct | Repeated like-term errors |
| `LE-03` | procedure | Solve one-step equations | Solve equations using one inverse operation | `LE-01` | 4/5 correct | Fails twice |
| `LE-04` | procedure | Solve multiplication and division equations | Solve equations with multiplication/division forms | `LE-03` | 4/5 correct | High hint dependence |
| `LE-05` | procedure | Solve two-step equations | Solve equations that need two inverse operations | `LE-03, LE-04` | 4/5 correct, max 1 hint | Fails across 3 sessions |
| `LE-06` | procedure | Solve equations with brackets | Expand or simplify before isolating variable | `LE-02, LE-05` | 4/5 correct | Sign-error cluster |
| `LE-07` | recognition | Verify solutions | Check whether a solution value is correct | `LE-05` | 3/4 correct | None |
| `LE-08` | application | Translate word problems into equations | Convert verbal situation into algebraic equation | `LE-02, LE-05` | 3/4 correct | Tutor review if repeated mismatch |
| `LE-09` | application | Solve contextual equation problems | Solve short context problems using equations | `LE-08` | 3/4 correct | Open intervention if application stalls |
| `LE-10` | retention | Retain equation-solving skill | Re-solve after spaced review | `LE-05, LE-09` | 80% after 7 days | Retention drop |

---

## 6. Topic-to-Mastery Register Template

Use this table for every Form 1 topic.

| Topic Code | Topic Name | Node Count | Must-Have Nodes | Common Misconceptions | Tutor Intervention Priority |
|---|---|---:|---|---|---|
| `A1` | Rational Numbers | 8-10 | sign handling, comparison, operations | sign confusion, ordering errors | Medium |
| `A2` | Factors and Multiples | 8-10 | factorisation, HCF, LCM | prime factorisation mistakes | Medium |
| `A3` | Powers and Roots | 6-8 | square/cube recognition, inverse relationships | root confusion | Low |
| `A4` | Ratio, Rate and Proportion | 8-10 | equivalent ratios, rates, proportion | scale mismatch | High |
| `B1` | Algebraic Language | 6-8 | variables, terms, expression writing | symbol confusion | High |
| `B2` | Linear Equations | 8-10 | solving and application | sign errors, context translation | High |
| `B3` | Linear Inequalities | 6-8 | solving and number-line representation | equation vs inequality confusion | Medium |
| `C1` | Lines and Angles | 6-8 | angle relationships | angle misclassification | Medium |
| `C2` | Basic Polygons | 5-7 | classification and property recognition | shape vocabulary gaps | Low |
| `C3` | Perimeter | 4-6 | adding boundary lengths | incomplete boundary counting | Medium |
| `C4` | Area | 6-8 | formula selection and substitution | wrong formula choice | High |
| `C5` | Pythagoras’ Theorem | 6-8 | identify hypotenuse, apply theorem | side-label confusion | High |
| `D1` | Introduction to Sets | 6-8 | sets, subsets, complements | universal set confusion | Low |
| `D2` | Data Handling | 5-7 | read and interpret data | conclusion without evidence | Low |

---

## 7. Question Pool Schema

Each mastery node should connect to five instructional pools.

| Pool Type | Purpose | Recommended Count per Node | Used By |
|---|---|---:|---|
| `teach` | Introduce concept | 2-3 | AI lesson |
| `guided-practice` | Walk through solving | 4-6 | AI tutor |
| `diagnostic` | Find misconception | 2-3 | AI + tutor |
| `mastery` | Confirm progression | 3-5 | Mastery engine |
| `revision` | Spaced review | 2-4 | Revision engine |

### Question Item Minimum Schema

| Field | Type | Notes |
|---|---|---|
| `question_id` | string | Stable content key |
| `node_id` | fk | Required |
| `pool_type` | enum | Required |
| `prompt` | text | Required |
| `answer_key` | json/text | Required |
| `worked_solution` | text/json | Required |
| `hint_level_1` | text | Required |
| `hint_level_2` | text | Optional |
| `hint_level_3` | text | Optional |
| `misconception_tag` | string | Strongly recommended |
| `difficulty` | enum | Required |
| `auto_markable` | boolean | Required |
| `source_status` | enum | `draft`, `reviewed`, `approved`, `retired` |

---

## 8. Parent Report Data Schema for Form 1 Mathematics

The parent report should be driven by content data, not just marks.

| Field | Example | Notes |
|---|---|---|
| `student_name` | `Aina Sofia` | Display |
| `level` | `Form 1` | Display |
| `subject` | `Mathematics` | Display |
| `current_topic` | `Linear Equations` | Current study focus |
| `topics_mastered_this_week` | `Algebraic Expressions` | Progress |
| `weakest_node` | `Translate word problems into equations` | Intervention signal |
| `homework_completion` | `2/2 done` | Consistency |
| `mastery_movement` | `+12% in Algebra` | Trend |
| `tutor_note` | `Needs support in turning sentences into equations` | Human layer |
| `next_focus` | `LE-08 word problem translation` | Forward direction |

---

## 9. Tutor Dashboard Data Schema for Form 1 Mathematics

Tutor-facing math support should be node-aware.

| Field | Example | Why it matters |
|---|---|---|
| `student_id` | `student_aina_01` | Identity |
| `topic_id` | `f1-b2-linear-equations` | Topic scope |
| `node_id` | `LE-08` | Precise weak point |
| `mastery_state` | `Needs support` | Intervention state |
| `attempt_count` | `4` | Effort signal |
| `hint_dependency` | `high` | AI-only may not be enough |
| `retention_state` | `dropped after 7-day review` | Review risk |
| `misconception_cluster` | `sign-error + translation mismatch` | Tutor diagnosis |
| `recommended_intervention` | `10-minute mini live explanation` | Tutor action |

---

## 10. Content Production Workflow Schema

Each Form 1 topic should move through a structured content ops pipeline.

| Stage | Owner | Output |
|---|---|---|
| Curriculum mapping | Curriculum mapper | Topic and node list |
| Node design | Learning designer | Mastery node definitions |
| Lesson authoring | Content writer | AI lesson scripts |
| Question authoring | Question designer | Question pools |
| Misconception tagging | Reviewer | Error taxonomy |
| Tutor review | Master teacher | Pedagogical approval |
| QA and release | Content ops | Published content |
| Performance review | Product + academic lead | Revision backlog |

### Suggested content status field

| Status | Meaning |
|---|---|
| `draft` | Being written |
| `academic-review` | Waiting for subject expert |
| `qa-review` | Waiting for technical/content QA |
| `approved` | Ready for student use |
| `live` | Released in platform |
| `revision-needed` | Performance indicates content issue |
| `archived` | No longer active |

---

## 11. Recommended MVP Build Order for Form 1 Mathematics

If the platform is starting with one level, build these topics first:

1. `A1 Rational Numbers`
2. `A2 Factors and Multiples`
3. `A4 Ratio, Rate and Proportion`
4. `B1 Algebraic Language`
5. `B2 Linear Equations`
6. `C5 Pythagoras’ Theorem`

Reason:

- strong representation of arithmetic, algebra, and problem solving
- easier to test mastery graph logic
- strong parent-visible progress
- clear tutor intervention moments

---

## 12. Implementation Notes

For product implementation, the system should allow:

- topic unlock by sequence or tutor override
- node-level mastery updates
- adaptive question selection by pool type
- automated revision scheduling
- tutor alerts driven by `intervention_rule`
- parent report generation using node/topic summaries

The platform should not store only chapter completion.
It should store:

- topic completion
- node mastery
- misconception history
- revision performance
- tutor intervention history

---

## 13. Final Recommendation

Treat `Form 1 Mathematics` as the model subject for the whole platform.

Once this structure works, the same schema can be reused for:

- Form 2 Mathematics
- Form 3 Mathematics
- Bahasa Melayu
- English
- Science

The big win is not just having a topic list.
The big win is having a repeatable content system.
