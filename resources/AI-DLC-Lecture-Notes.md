# Lecture: AI-Driven Development Lifecycle (AI-DLC)

## Introduction to AI-DLC

**What is AI-DLC?**

The AI-Driven Development Lifecycle is a reimagined software development methodology designed from the ground up to integrate AI as a central collaborator — not just a tool. It was proposed by Raja SP at Amazon Web Services.

**Why do we need it?**

Traditional methods (Waterfall, Agile/Scrum) were designed for human-driven, long-running processes:

- Sprints last 2–6 weeks
- Rituals (standups, retros) assume slow iteration
- Roles are siloed (frontend, backend, DevOps)
- Design techniques (DDD, TDD) are treated as optional

AI changes the game:

- Iteration cycles can now be **hours or days**, not weeks
- AI can handle planning, decomposition, code generation, testing
- Traditional metrics (velocity, story points) become less meaningful
- The boundaries between "simple" and "hard" tasks blur

**The key insight:** Don't retrofit AI into Agile. Reimagine the method from first principles.

---

## The Two Paradigms

| Paradigm | Description | Limitation |
| --- | --- | --- |
| **AI-Assisted** | Human drives; AI augments specific tasks (autocomplete, bug detection) | Doesn't unlock AI's full potential |
| **AI-Driven** | AI drives workflows; human validates and approves | Balances AI capability with human oversight |

AI-DLC adopts the **AI-Driven** paradigm.

**Analogy:** Think of Google Maps. You set the destination (intent). The system plans the route (decomposition), gives turn-by-turn directions (recommendations). You maintain oversight and can override at any time.

---

## 10 Key Principles

### 1. Reimagine Rather Than Retrofit

Build from first principles. We need automobiles, not faster horse chariots.

### 2. Reverse the Conversation Direction

AI initiates and directs conversations. Humans serve as approvers at critical junctures.

### 3. Integrate Design Techniques Into the Core

DDD, BDD, or TDD are baked into the method — not left as optional choices. This paper uses the DDD flavor.

### 4. Align With AI Capability

Be realistic about what AI can and cannot do today. Developers retain ultimate responsibility for validation and oversight.

### 5. Cater to Building Complex Systems

AI-DLC targets systems with high architectural complexity, trade-offs, scalability needs, and multiple teams. Simple apps → use low-code/no-code instead.

### 6. Retain What Enhances Human Symbiosis

Keep artifacts that bridge human-AI understanding: user stories (contracts), risk registers (compliance), etc.

### 7. Facilitate Transition Through Familiarity

Practitioners should orient in a single day. Use associative learning: Sprints → **Bolts** (rapid, intense cycles).

### 8. Streamline Responsibilities for Efficiency

AI collapses specialization silos. One developer can now span frontend + backend + infra with AI assistance.

### 9. Minimise Stages, Maximise Flow

Fewer phases, fewer handoffs. Human checkpoints act as "loss functions" — minimal but purposeful gates.

### 10. No Hard-Wired SDLC Workflows

AI recommends the plan dynamically. Humans validate iteratively rather than following a rigid process.

---

## Core Framework

### Artifacts (from high-level to low-level)

```
Intent → Units → Bolts → Domain Design → Logical Design → Code/Tests → Deployment Units

```

| Artifact | Description | Analogy to Agile |
| --- | --- | --- |
| **Intent** | High-level business goal | Epic / Vision |
| **Units** | Decomposed work packages (bounded contexts) | Features / User Stories |
| **Bolts** | Rapid iteration cycles (hours/days) | Sprints (but much shorter) |
| **Domain Design** | Domain models, bounded contexts (DDD) | Architecture docs |
| **Logical Design** | Sequence diagrams, API contracts | Technical design |
| **Code & Tests** | AI-generated, human-validated code | Sprint output |
| **Deployment Units** | Packaged, deployable components | Release artifacts |

### Phases

Phase 1: Inception

- **Goal:** Elaborate the intent into a structured plan
- **Key Ritual:** Mob Elaboration — collaborative session (human + AI) to decompose the intent
- **Output:** Level 1 Plan with Units, Domain Models, User Stories
- **AI Role:** Generates the plan, proposes bounded contexts, identifies trade-offs
- **Human Role:** Validates, adjusts, approves

Phase 2: Construction

- **Goal:** Build the system iteratively in Bolts
- **Key Rituals:** Mob Programming, Mob Testing
- **Flow per Bolt:**1. AI decomposes a Unit into tasks
2. AI generates domain model → logical design → code → tests
3. Human validates at each gate
4. Iterate until the Unit is complete
- **AI Role:** Writes code, generates tests, applies design patterns
- **Human Role:** Reviews, validates quality, handles edge cases

Phase 3: Operations

- **Goal:** Deploy, monitor, and maintain
- **AI Role:** Generates IaC, monitors production, suggests optimizations
- **Human Role:** Approves deployments, manages incidents

---

## How It Works in Practice

### Green-Field Example: Building a Recommendation Engine

1. **Intent:** "Build a recommendation engine for cross-selling products"
2. **Inception:**- AI breaks this into bounded contexts (User Profile, Product Catalog, Recommendation Logic, Analytics)
- Mob Elaboration produces domain models and user stories for each context
3. **Construction:**- Each bounded context is built in parallel Bolts
- AI generates code; developers validate
- Continuous integration after each Bolt
4. **Operations:**- AI generates deployment infrastructure (IaC)
- Monitoring and optimization loops

### Brown-Field (Existing Systems)

Same flow, but adds an extra step:

- AI **reverse-engineers** existing code into domain models (static + dynamic)
- Human validates the AI's understanding of the current system
- Then proceeds with Construction as normal

---

## The Workflow: How AI Drives

```
┌─────────────────────────────────────────────┐
│  Developer sets INTENT (the destination)     │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  AI generates Level 1 Plan                   │
│  (decomposition, bounded contexts, stories)  │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  Human VALIDATES / ADJUSTS the plan          │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  AI recursively decomposes into sub-tasks    │
│  → Domain Design → Logical Design → Code     │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  Human validates at each gate                │
│  (the "loss function" checkpoints)           │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│  Deployment & Operations                     │
└─────────────────────────────────────────────┘

```

---

## Key Terminology Mapping

| Traditional Term | AI-DLC Term | Why the Change |
| --- | --- | --- |
| Sprint | **Bolt** | Emphasizes speed (hours/days vs. weeks) |
| Backlog | **Intent Queue** | Focuses on outcomes, not tasks |
| Scrum Master | **Flow Facilitator** | AI handles process; human ensures flow |
| Sprint Planning | **Mob Elaboration** | Collaborative, AI-driven decomposition |
| Daily Standup | *(eliminated)* | Continuous flow makes it unnecessary |
| Retrospective | *(continuous)* | Real-time feedback replaces periodic reflection |

---

## Critical Thinking: Strengths & Limitations

### Strengths

- Embraces AI's actual capabilities rather than treating it as "fancy autocomplete"
- DDD integration ensures software quality isn't sacrificed for speed
- Realistic about human oversight needs
- Designed for complex enterprise systems

### Current Limitations

- Requires mature AI tooling (not all teams have access)
- Assumes developers are comfortable with AI-driven workflows
- The "hours/days" iteration claim depends heavily on problem complexity
- Less relevant for simple CRUD apps (acknowledged by the paper)

### Questions to Consider

1. What happens when AI makes a fundamentally wrong architectural decision early?
2. How do you maintain institutional knowledge when AI drives most decisions?
3. Is the "reversed conversation" psychologically comfortable for all developers?
4. How do regulated industries (finance, healthcare) adapt the approval gates?

---

## Summary

1. **AI-DLC reimagines** (not retrofits) software development for the AI era
2. **AI drives, humans validate** — the conversation direction is reversed
3. **Design techniques are built in** — not optional add-ons
4. **Bolts replace Sprints** — iteration in hours/days, not weeks
5. **Three phases:** Inception → Construction → Operations
6. **Complex systems only** — simple apps should use low-code/no-code
7. **Familiarity enables adoption** — practitioners can start in a day

---

## Further Reading

- Domain-Driven Design by Eric Evans
- The AI-DLC Method Definition (Raja SP, AWS)
- Agile Manifesto (for historical context)
- "Build Better Systems Faster" — the AI-DLC mantra

