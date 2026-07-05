import { useState, useEffect, useRef } from 'react';

// ============================================================
// SHARED STATE — Laborada
// One slider value drives everything on this page.
// Do not add more top-level state unless absolutely necessary.
// ============================================================

const MIN_HZ = 0.5;
const MAX_HZ = 10;

// Sample instructions — Alonto finalizes this list (max 4)
const INSTRUCTIONS = ['MOV', 'ADD', 'SHL', 'ROR'];
const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB'];

export default function PipelineSimulator() {
  const [speed, setSpeed] = useState(2); // shared clock speed in GHz

  return (
    <div style={{ background: '#0a0e17', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

      {/* --------------------------------------------------------
          SECTION 1: CLOCK SPEED SLIDER — [Laborada]
          Single range input. speed state lives here and is passed
          down as a prop to every visual below. Do not duplicate
          speed state anywhere else in this file.
          -------------------------------------------------------- */}
      <ClockSlider speed={speed} onSpeedChange={setSpeed} />

      {/* --------------------------------------------------------
          SECTION 2: OSCILLOSCOPE + SQUARE WAVE — Laborada
          Two canvas visuals side by side, both receiving speed
          as a prop. Oscilloscope: circle track with light tracing
          it. Square wave: live waveform matching the frequency.
          Both use requestAnimationFrame internally.
          -------------------------------------------------------- */}
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Oscilloscope speed={speed} />
        <SquareWave speed={speed} />
      </div>

      {/* --------------------------------------------------------
          SECTION 3: INSTRUCTION DISPLAY — Choa
          Shows the 3-4 sample instructions as cards/pills.
          The currently-being-fetched instruction is highlighted.
          Derives which instruction is active from speed + a shared
          cycle counter. See pipelineLogic notes below.
          -------------------------------------------------------- */}
      <InstructionDisplay speed={speed} />

      {/* --------------------------------------------------------
          SECTION 4: GANTT PIPELINE TABLE — Laborada / Choa
          Animated Gantt chart showing IF ID EX MEM WB stages
          across clock cycles. Multiple instructions in flight at
          once (overlapping diagonal pattern). Highlights the cell
          that is currently active in sync with the clock speed.
          -------------------------------------------------------- */}
      <PipelineGantt speed={speed} />

    </div>
  );
}


// ============================================================
// CLOCK SLIDER — Laborada
// ============================================================
function ClockSlider({ speed, onSpeedChange }) {
  // TODO (Laborada):
  // - Style the slider to match the oscilloscope dark theme
  // - Show current speed as a label (e.g. "2.0 GHz")
  // - Custom thumb: cyan circle with glow (see ClockTrack.jsx for reference CSS)
  // - Min 0.5 GHz, Max 10 GHz, step 0.1

  return (
    <div>
      {/* PLACEHOLDER — replace with styled slider */}
      <label style={{ color: '#8892b0', fontFamily: 'JetBrains Mono' }}>
        Clock Speed: {speed.toFixed(1)} GHz
      </label>
      <input
        type="range"
        min={MIN_HZ}
        max={MAX_HZ}
        step={0.1}
        value={speed}
        onChange={e => onSpeedChange(parseFloat(e.target.value))}
        style={{ width: '100%' }}
      />
    </div>
  );
}


// ============================================================
// OSCILLOSCOPE (CIRCLE TRACK) — Laborada
// ============================================================
function Oscilloscope({ speed }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const trailRef = useRef([]);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const SIZE = 280;
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    canvas.style.width = SIZE + 'px';
    canvas.style.height = SIZE + 'px';
    ctx.scale(DPR, DPR);
    const CX = SIZE / 2, CY = SIZE / 2, R = 100, DOT_R = 8, TRAIL = 40;

    // TODO (Laborada):
    // - Draw the ring track
    // - Draw tick marks around the ring (12 total, 4 major)
    // - Animate the glowing dot around the ring at speed hz
    // - Draw a fading cyan trail behind the dot
    // - Draw speed label at center (GHz value)
    // See ClockTrack.jsx for full working implementation to copy from

    function draw(ts) {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;

      angleRef.current += speedRef.current * 2 * Math.PI * dt;
      const lx = CX + R * Math.cos(angleRef.current);
      const ly = CY + R * Math.sin(angleRef.current);
      trailRef.current.push({ x: lx, y: ly });
      if (trailRef.current.length > TRAIL) trailRef.current.shift();

      ctx.clearRect(0, 0, SIZE, SIZE);

      // PLACEHOLDER ring — Laborada replaces with full styled version
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = '#1a2540';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Trail
      const trail = trailRef.current;
      for (let i = 1; i < trail.length; i++) {
        const t = i / trail.length;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = `rgba(0,255,200,${t * 0.6})`;
        ctx.lineWidth = t * 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Dot
      ctx.beginPath();
      ctx.arc(lx, ly, DOT_R, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffc8';
      ctx.fill();

      // Center label
      ctx.fillStyle = '#e8edf2';
      ctx.font = '700 18px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(speedRef.current.toFixed(1) + ' GHz', CX, CY);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
}


// ============================================================
// SQUARE WAVE — Laborada
// ============================================================
function SquareWave({ speed }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const offsetRef = useRef(0);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    const W = 280, H = 140;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(DPR, DPR);

    // TODO (Laborada):
    // - Draw a scrolling square wave across the canvas
    // - Wave frequency scales with speedRef.current
    // - Higher speed = more wave cycles visible = faster scroll
    // - Color: #00ffc8 (cyan), background: #0a0e17
    // - Add axis line at vertical center
    // - Wave amplitude should be about 40% of canvas height

    function draw(ts) {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = (ts - lastTimeRef.current) / 1000;
      lastTimeRef.current = ts;

      offsetRef.current += speedRef.current * 60 * dt;

      ctx.clearRect(0, 0, W, H);

      // PLACEHOLDER — Laborada replaces with styled scrolling square wave
      ctx.fillStyle = '#0a0e17';
      ctx.fillRect(0, 0, W, H);

      const period = W / (speedRef.current * 0.5);
      const amp = H * 0.3;
      const mid = H / 2;

      ctx.beginPath();
      ctx.strokeStyle = '#00ffc8';
      ctx.lineWidth = 2;

      let x = 0;
      while (x < W) {
        const phase = (x + offsetRef.current) % period;
        const high = phase < period / 2;
        const y = high ? mid - amp : mid + amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        const nextPhase = (x + 1 + offsetRef.current) % period;
        const nextHigh = nextPhase < period / 2;
        if (high !== nextHigh) ctx.lineTo(x, nextHigh ? mid - amp : mid + amp);

        x++;
      }
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', border: '1px solid #1a2540', borderRadius: '8px' }} />;
}


// ============================================================
// INSTRUCTION DISPLAY — Choa
// ============================================================
function InstructionDisplay({ speed }) {
  // TODO (Choa):
  // - Display INSTRUCTIONS array as styled cards/pills in a row
  // - One instruction is highlighted at a time based on the current
  //   cycle (use the same cycle logic as PipelineGantt below)
  // - Highlighted = the instruction currently in the IF stage
  // - Color: active card uses #00ffc8 accent, inactive uses #1a2540
  // - Update rate is tied to speed prop (faster speed = faster highlight changes)

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const delay = 1000 / speed;
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % INSTRUCTIONS.length);
    }, delay);
    return () => clearInterval(intervalRef.current);
  }, [speed]);

  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      {/* PLACEHOLDER — Choa replaces with styled instruction cards */}
      {INSTRUCTIONS.map((instr, i) => (
        <div
          key={instr}
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '8px',
            border: `1px solid ${i === activeIndex ? '#00ffc8' : '#1a2540'}`,
            color: i === activeIndex ? '#00ffc8' : '#8892b0',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '1rem',
            background: i === activeIndex ? '#0d2b2b' : '#141b2b',
            transition: 'all 0.1s',
          }}
        >
          {instr}
        </div>
      ))}
    </div>
  );
}


// ============================================================
// PIPELINE GANTT TABLE — Choa
// ============================================================
function PipelineGantt({ speed }) {
  // TODO (Choa):
  // - Render a Gantt table: rows = INSTRUCTIONS, columns = clock cycles
  // - Each cell shows which stage (IF/ID/EX/MEM/WB) that instruction
  //   is in at that cycle. instruction i is in stage s at cycle (i + s).
  // - Highlight the column corresponding to the current cycle
  // - Current cycle advances at the rate of speed (GHz)
  // - Total cycles = INSTRUCTIONS.length + STAGES.length - 1 (= 8)
  // - Loop back to cycle 0 after the last cycle
  // - Color: active column highlight #00ffc8, stage label inside cell
  // - Header row shows cycle numbers (C1, C2, C3...)

  const TOTAL_CYCLES = INSTRUCTIONS.length + STAGES.length - 1;
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const delay = 1000 / speed;
    intervalRef.current = setInterval(() => {
      setCycle(prev => (prev + 1) % TOTAL_CYCLES);
    }, delay);
    return () => clearInterval(intervalRef.current);
  }, [speed]);

  function getStageLabel(instrIndex, cycleIndex) {
    const stageIndex = cycleIndex - instrIndex;
    if (stageIndex >= 0 && stageIndex < STAGES.length) {
      return STAGES[stageIndex];
    }
    return '';
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* PLACEHOLDER table — Choa replaces with styled Gantt */}
      <table style={{ borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', color: '#e8edf2', fontSize: '0.8rem' }}>
        <thead>
          <tr>
            <th style={{ padding: '0.5rem 1rem', color: '#8892b0' }}>Instruction</th>
            {Array.from({ length: TOTAL_CYCLES }, (_, c) => (
              <th
                key={c}
                style={{
                  padding: '0.5rem 1rem',
                  color: c === cycle ? '#00ffc8' : '#8892b0',
                  borderBottom: c === cycle ? '2px solid #00ffc8' : '2px solid transparent',
                }}
              >
                C{c + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {INSTRUCTIONS.map((instr, i) => (
            <tr key={instr}>
              <td style={{ padding: '0.5rem 1rem', color: '#8892b0' }}>{instr}</td>
              {Array.from({ length: TOTAL_CYCLES }, (_, c) => {
                const label = getStageLabel(i, c);
                const isActive = c === cycle && label !== '';
                return (
                  <td
                    key={c}
                    style={{
                      padding: '0.5rem 1rem',
                      textAlign: 'center',
                      background: isActive ? '#0d2b2b' : label ? '#141b2b' : 'transparent',
                      color: isActive ? '#00ffc8' : '#4ecdc4',
                      border: '1px solid #1a2540',
                      borderRadius: '4px',
                      minWidth: '48px',
                    }}
                  >
                    {label}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}