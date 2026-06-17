PROPOSAL FOR VIRTUAL EXHIBIT

1.Title
"Clockwork: The Rhythm of the Processor"

2. Group's Member Roster
Student Name
Student ID
Role
Nathan Laborada
12414808
Front-end development and Exhibit Design and research
Azzam Alonto
12301272
Research, Content Writer, QA, Dev
Bryan Choa
12411027
Front-end development and Exhibit Design
Daniel Angelo Gonzalez 
12306940
Back-end development
Keion Clei Chua
12343110


Research, Content Writer, Back-end development


3. Group's Topic Theme
"Tick, Tock, Execute: Following the Clock Through the CPU Pipeline"
The CPU clock is the fundamental metronome that synchronizes every single operation inside the processor. Our exhibit walks visitors through the whole journey, from the physical quartz crystal inside the computer all the way to how the clock orchestrates the fetch-decode-execute cycle. We think it's a nice way to connect the hardware side with the conceptual side (pipelining and performance). 
4. Group's Tech Stack Plan
Layer
Technology
Purpose
Framework
Astro 6 with React.js 
The spec requires Astro, and React gives us the interactivity we need for the simulations 
Styling
Tailwind CSS
Fast to work with, and we can match the museum template's look without fighting with custom CSS 
Core Animation
HTML5 Canvas and Framer Motion 
Canvas is great for the wave rendering. Framer Motion handles the UI animations and button feedback 
Data Visualization
D3.js
We only need it for the wave chart and performance graphs. Keeping it lightweight 


5. Proposed Interactive Elements
This exhibit features two interactive elements that work together to tell the complete story of the CPU clock.
Interactive Element #1: "Clock Speed Simulator"
Feature
Description
Clock Speed Slider
Drag it from 1 MHz up to 5 GHz. The wave and everything else responds instantly .
Square Wave Visualizer
Renders the live clock signal on a Canvas. At low speeds you can see each tick clearly. At high speeds it turns into a blur.
Heat Gauge
A thermometer-style indicator showing estimated CPU temperature. As frequency increases, temperature rises exponentially (demonstrating the power wall: Heat ∝ Voltage² × Frequency).
Voltage Display
Shows how voltage must increase to sustain higher frequencies, contributing to the heat problem.
Cycle Counter
A running counter showing how many clock cycles have elapsed since the visitor started the simulation.


Real-time Feedback:
When you move the slider, the wave speeds up or slows down immediately. Below the wave, we show a simple assembly instruction (like ADD RAX, RBX) with a progress bar. At 1 GHz, you can actually watch it execute tick by tick. At 5 GHz, it finishes in a flash. This makes the abstract concept of clock speed feel tangible.
Interactive Element #2: "Pipeline Visualizer”
Feature
Description
5-Stage Pipeline Diagram
A Gantt-chart-style visualization showing IF, ID, EX, MEM, and WB stages.
Sample Program Loader
Pre-loaded programs with 4–5 instructions (e.g., MOV, ADD, SHL, ROR from your quiz).
Run / Step Controls
Users can click "Run" to watch the program execute automatically, or "Step" to advance one clock cycle at a time.
Pipeline Stalls (Hazards)
A "Hazard" toggle button. When enabled, a data hazard is introduced (where one instruction depends on the result of the previous one). The pipeline visually "stalls" and "bubbles" appear, showing why pipelining isn't perfect.


Real-time Feedback:
Colored blocks slide forward one stage per clock tick. A performance counter shows total cycles taken with and without the hazard enabled. Hovering over a stage reveals a tooltip explaining what happens there (for example, "EX: ALU computes the arithmetic operation"). 

6. Mobile-Responsive Layout
Breakpoint
Width
Layout Structure
Desktop
≥1024px
Three-panel layout: Left (20% - Navigation & Glossary), Center (50% - Main Visuals: Clock Wave + Pipeline), Right (30% - Controls: Slider, Run Button, Performance Stats).
Tablet
768px - 1023px
Two-panel layout: Top (Controls + Stats), Bottom (Main Visuals with tabs to switch between Clock Wave and Pipeline views).
Mobile
<768px
Single-column vertical stack: Clock Speed Simulator on top, Pipeline Visualizer in the middle, Controls and Performance Stats at the bottom. All touch targets are at least 44px for easy interaction.


7. Tentative Style Guide Snapshot
7.1 Color Palette ("Oscilloscope / Lab Equipment" Theme)
Element
Color Code
Usage
Background
#0A0E17
Main dark canvas (like a lab oscilloscope screen).
Surface Cards
#141B2B
Panel backgrounds.
Primary Accent (Clock Wave)
#00FFC8
Neon Cyan/Mint - for the square wave and active data buses.
Secondary Accent (Heat/Power)
#FF6B6B
Neon Red/Coral - for the heat gauge and power wall warnings.
Tertiary Accent (Pipeline)
#4ECDC4
Teal - for pipeline stage blocks.
Text Primary
#E8EDF2
Off-white for body text.
Text Secondary
#8892B0
Muted slate for metadata and labels.


7.2 Typography
Element
Font
Weight
Headers / Titles
JetBrains Mono
Bold (700)
Clock Frequency / Values
JetBrains Mono
Normal (400)
Body / Descriptions
Inter
Regular (400)


7.3 Layout Wireframe (Desktop)
The following ASCII wireframe shows the three-panel desktop layout:
LEFT PANEL (20%): Navigation menu with sections for Intro, Clock Wave, Pipeline, Heat, and Performance.
CENTER PANEL (50%): Main visual stage with animated square wave, instruction execution progress bar, and 5-stage pipeline diagram with colored stage blocks.
RIGHT PANEL (30%): Interactive controls including clock speed slider (1 MHz - 5 GHz), voltage display, heat gauge thermometer, cycle counter, Run/Step buttons, hazard toggle, and performance metrics display.

8. References
Intel 64 and IA-32 Architectures Software Developer's Manual
Computer Organization and Design (Patterson & Hennessy)
React.js Documentation
Tailwind CSS Documentation
