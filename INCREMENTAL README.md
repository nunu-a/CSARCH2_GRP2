# Incremental README — CLOCKWORK Pipeline Simulator (ALONTO, CHOA, CHUA, LABORADA)
## WEBSITE LINK: https://clock-cycles.vercel.app/

## Disclosure on the Use of AI/LLM

- **Tool used:** Claude — Sonnet 4.5
- **Where it was used:** Drafting and structuring this README (organizing the milestone/Aha Moments sections) and formatting and citing the APA references.
- **Where it wasn't used:** core simulator logic, canvas animation code, the clock-cycle concepts themselves, all design decisions
- **Human review:** All AI-assisted text was reviewed and edited by the team before inclusion; the technical claims and citations were verified against the source material.
  
## Tech Stack
 
- **Framework:** Astro — static site generation with an islands architecture for the exhibit page (`ExhibitLayout.astro` + `.mdx` content page).
- **Interactivity:** React (`PipelineSimulator.jsx`), hydrated on the client via `client:load`. The Oscilloscope and Square Wave visualizers use raw `<canvas>` + `requestAnimationFrame`; the Instruction Display and Gantt Table use `setInterval`-driven React state.
- **Styling:** Inline CSS-in-JS style objects (no CSS framework), Google Fonts (JetBrains Mono) loaded via `<link>` in the layout.
- **Hosting:** Deployed on Vercel. **No backend server and no database** — the entire exhibit is static/client-rendered, with all simulation state living in-browser (`useState`/`useRef`); nothing is persisted or fetched.


## Features Finished in 1st Milestone

- ✅ **Header banner** — exhibit title block ("CLOCKWORK: TICK, TOCK, EXECUTE") with tagline, matching the museum's dark theme (`#0a0e17` background, `#00ffc8` neon accent).
- ✅ **Clock Speed Slider** — single range input (0.5–10 GHz) that drives every other visualization from one shared `speed` state in the parent `PipelineSimulator` component.
- ✅ **Oscilloscope** — canvas-based radial sweep with a fading trail and live GHz readout in the center, redrawn every frame at a rotation rate proportional to `speed`.
- ✅ **Square Wave Visualizer** — canvas-based scrolling square wave whose period compresses as `speed` increases, with a background grid for scale reference.
- ✅ **Instruction Display** — highlights one of `MOV / ADD / SHL / ROR` at a time to represent the IF stage "fetching," cycling on a `speed`-based interval.
- ✅ **Animated Gantt Pipeline Table** — full 5-stage (IF, ID, EX, MEM, WB) execution table for 4 instructions, highlighting the currently active cycle column and lighting up each cell as instructions pass through it.
- ✅ **Static content section** (`index.mdx`) — "About This Simulation" writeup explaining the visualizations and key pipeline concepts (clock speed, stages, throughput) below the interactive simulator.

## Aha Moments — Animating Everything in Sync

- **One `speed` state to rule them all.** No global "master clock" broadcasting to children needed — lifting a single `speed` value into `PipelineSimulator` and passing it down as a prop was enough for every sub-component to derive its own timing off the same number.
- **`useRef` to escape stale closures.** Canvas components mirror `speed` into a `speedRef` via `useEffect` and read `speedRef.current` inside the `requestAnimationFrame` loop — without it, the loop's closure freezes `speed` at whatever it was when the loop started, so slider changes silently stop applying.
- **Delta-time math beats fixed-step increments.** Incrementing angle/offset by `speed * dt` (actual elapsed time) instead of a fixed amount per frame is what keeps the sweep and wave scaling smoothly instead of looking frame-rate dependent.

## Aha Moments — How a Clock Cycle Actually Works

- **A clock "cycle" is just a voltage swinging between two states.** What we're animating as a square wave isn't a metaphor — it's literally the CPU clock pin toggling between logic-high and logic-low voltage at a fixed rate (Mano & Ciletti, 2013).
- **The rising edge is the only moment that matters.** Flip-flops only latch new data on the clock's rising (or falling, depending on design) edge — the rest of the cycle is just the signal holding steady so the logic between edges has time to settle (Hamacher, Vranesic, & Manjikian, 2012).
- **A flip-flop is just two NAND-gate latches wired back to back.** At the transistor level, each pipeline register is built from master-slave latches (~20 transistors), not some abstract "storage block" — that's the literal hardware being drawn as a Gantt cell (Mano & Ciletti, 2013).
- **Clock period has a hard floor: setup + hold time.** The fastest you can tick the clock is capped by how long a flip-flop's input must stay stable before and after the edge (setup/hold time) plus the propagation delay of the slowest combinational path between stages — this is the real constraint behind "max GHz" (Hennessy & Patterson, 2021).
- **Clock skew is why the signal isn't instant everywhere.** The clock doesn't arrive at every flip-flop at the exact same instant — wire length and buffer delay mean different parts of the chip see the rising edge nanoseconds (or less) apart (Hennessy & Patterson, 2018).

## Features Finished in 2nd (Final) Milestone

- ✅ **Complete Technical References Added** — inline APA citations tying each hardware "Aha Moment" back to its supporting source, plus a full reference list below.
- ✅ **Website is in proper layout** — page structure, spacing, and component ordering finalized across the exhibit page.
- ✅ **Final Tweaking of design** — closing pass on visual polish and consistency across all simulator components.
- 🚫 **Pipeline Stalls dropped from scope** — the team decided not to implement pipeline stalls; the clock simulator is already sufficient to describe the basic workings of the clock, and stalls weren't really part of the scope of the lessons.
- The layout of the website shifted from the originally proposed layout where the interactive elements were separated into distinct 3 panels with distinct functions, instead the group opted to center the clock simulator much more in order to emphasize its flow and function.

## Tool Rationale — What We Cut and Why

**Framer Motion was not used.** The simulator's animations are all driven by canvas rendering and `requestAnimationFrame` — there are no React component transitions, no mount/unmount animations, and no UI buttons requiring feedback states. Adding Framer Motion would have introduced a 30+ kB bundle for features the exhibit simply doesn't use. Instead, the canvas itself provides all the motion the user needs to see (the rotating oscilloscope sweep and scrolling square wave), and the Gantt table updates via React's native re-rendering with no easing or spring physics required.

**D3.js was not used.** The oscilloscope and square wave are both rendered with raw `<canvas>` 2D context drawing — circles, lines, arcs, and rectangles. D3's strength lies in data joins, scales, axes, and complex SVG charting, none of which are needed here. The "scrolling wave chart" is just a filled path drawn with `ctx.lineTo()` across a fixed-width buffer; the "performance graph" was never implemented. Using D3 would have meant shipping 80+ kB of visualization library to draw what 20 lines of canvas API already handles. The only "data" being visualized is a single scalar (`speed`), which maps directly to rotation rate and wave period — no dataset transformation, binning, or axis generation is required.

**Tailwind CSS was kept, but minimally.** The spec didn't require Tailwind, but it was chosen early for development speed. In practice, the final exhibit uses mostly inline style objects within the React components and a handful of utility classes for layout (flex, padding, margins). Tailwind's utility-first approach made it trivial to match the museum's dark theme (`bg-[#0a0e17]`, `text-[#00ffc8]`) without writing custom CSS files. For a project of this size, Tailwind's CDN build step was overkill, but its class-based syntax kept the JSX clean and the styling maintainable across the few components we have. A plain CSS file would have worked just as well, but Tailwind didn't hurt — and it made the color matching frictionless

## ORIGINAL PROPOSAL:
# PROPOSAL FOR VIRTUAL EXHIBIT

## 1. Title

**"Clockwork: The Rhythm of the Processor"**

## 2. Group's Member Roster

| Student Name | Student ID | Role |
|---|---|---|
| Nathan Laborada | 12414808 | Front-end development and Exhibit Design and research |
| Azzam Alonto | 12301272 | Research, Content Writer, QA, Dev |
| Bryan Choa | 12411027 | Front-end development and Exhibit Design |
| Daniel Angelo Gonzalez | 12306940 | Back-end development |
| Keion Clei Chua | 12343110 | Research, Content Writer, Back-end development |

## 3. Group's Topic Theme

**"Tick, Tock, Execute: Following the Clock Through the CPU Pipeline"**

The CPU clock is the fundamental metronome that synchronizes every single operation inside the processor. Our exhibit walks visitors through the whole journey, from the physical quartz crystal inside the computer all the way to how the clock orchestrates the fetch-decode-execute cycle. We think it's a nice way to connect the hardware side with the conceptual side (pipelining and performance).

## 4. Group's Tech Stack Plan

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Astro 6 with React.js | The spec requires Astro, and React gives us the interactivity we need for the simulations |
| Styling | Tailwind CSS | Fast to work with, and we can match the museum template's look without fighting with custom CSS |
| Core Animation | HTML5 Canvas and Framer Motion | Canvas is great for the wave rendering. Framer Motion handles the UI animations and button feedback |
| Data Visualization | D3.js | We only need it for the wave chart and performance graphs. Keeping it lightweight |

## 5. Proposed Interactive Elements

This exhibit features two interactive elements that work together to tell the complete story of the CPU clock.

### Interactive Element #1: "Clock Speed Simulator"

| Feature | Description |
|---|---|
| Clock Speed Slider | Drag it from 1 MHz up to 5 GHz. The wave and everything else responds instantly. |
| Square Wave Visualizer | Renders the live clock signal on a Canvas. At low speeds you can see each tick clearly. At high speeds it turns into a blur. |
| Heat Gauge | A thermometer-style indicator showing estimated CPU temperature. As frequency increases, temperature rises exponentially (demonstrating the power wall: Heat ∝ Voltage² × Frequency). |
| Voltage Display | Shows how voltage must increase to sustain higher frequencies, contributing to the heat problem. |
| Cycle Counter | A running counter showing how many clock cycles have elapsed since the visitor started the simulation. |

**Real-time Feedback:**

When you move the slider, the wave speeds up or slows down immediately. Below the wave, we show a simple assembly instruction (like ADD RAX, RBX) with a progress bar. At 1 GHz, you can actually watch it execute tick by tick. At 5 GHz, it finishes in a flash. This makes the abstract concept of clock speed feel tangible.

### Interactive Element #2: "Pipeline Visualizer"

| Feature | Description |
|---|---|
| 5-Stage Pipeline Diagram | A Gantt-chart-style visualization showing IF, ID, EX, MEM, and WB stages. |
| Sample Program Loader | Pre-loaded programs with 4–5 instructions (e.g., MOV, ADD, SHL, ROR from your quiz). |
| Run / Step Controls | Users can click "Run" to watch the program execute automatically, or "Step" to advance one clock cycle at a time. |
| Pipeline Stalls (Hazards) | A "Hazard" toggle button. When enabled, a data hazard is introduced (where one instruction depends on the result of the previous one). The pipeline visually "stalls" and "bubbles" appear, showing why pipelining isn't perfect. |

**Real-time Feedback:**

Colored blocks slide forward one stage per clock tick. A performance counter shows total cycles taken with and without the hazard enabled. Hovering over a stage reveals a tooltip explaining what happens there (for example, "EX: ALU computes the arithmetic operation").

## 6. Mobile-Responsive Layout

| Breakpoint | Width | Layout Structure |
|---|---|---|
| Desktop | ≥1024px | Three-panel layout: Left (20% - Navigation & Glossary), Center (50% - Main Visuals: Clock Wave + Pipeline), Right (30% - Controls: Slider, Run Button, Performance Stats). |
| Tablet | 768px - 1023px | Two-panel layout: Top (Controls + Stats), Bottom (Main Visuals with tabs to switch between Clock Wave and Pipeline views). |
| Mobile | <768px | Single-column vertical stack: Clock Speed Simulator on top, Pipeline Visualizer in the middle, Controls and Performance Stats at the bottom. All touch targets are at least 44px for easy interaction. |

## 7. Tentative Style Guide Snapshot

### 7.1 Color Palette ("Oscilloscope / Lab Equipment" Theme)

| Element | Color Code | Usage |
|---|---|---|
| Background | #0A0E17 | Main dark canvas (like a lab oscilloscope screen). |
| Surface Cards | #141B2B | Panel backgrounds. |
| Primary Accent (Clock Wave) | #00FFC8 | Neon Cyan/Mint - for the square wave and active data buses. |
| Secondary Accent (Heat/Power) | #FF6B6B | Neon Red/Coral - for the heat gauge and power wall warnings. |
| Tertiary Accent (Pipeline) | #4ECDC4 | Teal - for pipeline stage blocks. |
| Text Primary | #E8EDF2 | Off-white for body text. |
| Text Secondary | #8892B0 | Muted slate for metadata and labels. |

### 7.2 Typography

| Element | Font | Weight |
|---|---|---|
| Headers / Titles | JetBrains Mono | Bold (700) |
| Clock Frequency / Values | JetBrains Mono | Normal (400) |
| Body / Descriptions | Inter | Regular (400) |

### 7.3 Layout Wireframe (Desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  LEFT PANEL (20%)       CENTER PANEL (50%)      RIGHT PANEL (30%) │
│                                                                   │
│  - Navigation menu      - Animated square wave  - Clock Speed   │
│    • Intro              - Instruction exec.       Slider        │
│    • Clock Wave           progress bar           (1MHz - 5GHz) │
│    • Pipeline           - 5-stage pipeline       - Voltage      │
│    • Heat                 diagram with            Display       │
│    • Performance          colored blocks         - Heat Gauge   │
│                                                   Thermometer   │
│                                                  - Cycle Counter │
│                                                  - Run/Step      │
│                                                    Buttons      │
│                                                  - Hazard Toggle │
│                                                  - Performance   │
│                                                    Metrics      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## References

- Intel 64 and IA-32 Architectures Software Developer's Manual
- Computer Organization and Design (Patterson & Hennessy)
- React.js Documentation
- Tailwind CSS Documentation

Hamacher, V. C., Vranesic, Z. G., & Manjikian, N. (2012). *Computer organization and embedded systems* (6th ed.). McGraw-Hill. https://www.mheducation.com/highered/product/computer-organization-and-embedded-systems-hamacher.html

Hennessy, J. L., & Patterson, D. A. (2018). *Computer organization and design: A hardware/software approach* (RISC-V ed.). Morgan Kaufmann/Elsevier. https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-812275-4

Hennessy, J. L., & Patterson, D. A. (2021). *Computer organization and design: A hardware/software approach* (RISC-V ed., 2nd ed.). Elsevier/Morgan Kaufmann. https://shop.elsevier.com/books/computer-organization-and-design-risc-v-edition/patterson/978-0-12-820331-6

Mano, M. M., & Ciletti, M. D. (2013). *Digital design: With an introduction to the Verilog HDL* (5th ed.). Pearson Education. https://www.amazon.com/Digital-Design-Introduction-Verilog-HDL/dp/0132774208
