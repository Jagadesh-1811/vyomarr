import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PuzzlesGames.css';

export default function PuzzlesGames() {
  const canvasRef = useRef(null);
  const terminalRef = useRef(null);
  const [countdown, setCountdown] = useState({ days: '00', hours: '00', mins: '00' });
  const [email, setEmail] = useState('');

  // Countdown Timer
  useEffect(() => {
    const launchTime = new Date('2026-01-15T12:00:00+05:30').getTime();

    const tick = () => {
      const now = Date.now();
      const diff = launchTime - now;
      if (diff < 0) return;

      setCountdown({
        days: Math.floor(diff / 86400000).toString().padStart(2, '0'),
        hours: Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0'),
        mins: Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
      });
    };

    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  // Terminal Logs Animation
  useEffect(() => {
    const logs = [
      "<span>[OK]</span> Initializing Vyomarr Core...",
      "<span>[SYS]</span> Loading block logic...",
      "<span>[NET]</span> Syncing quiz database...",
      "<span>[OPT]</span> Adjusting gravity...",
      "<span>[RUN]</span> Establishing secure link...",
      "<span>[OK]</span> Ready for user input."
    ];

    let logIndex = 0;
    let timeoutId;

    const addLog = () => {
      const term = terminalRef.current;
      if (!term) return;

      if (logIndex >= logs.length) {
        timeoutId = setTimeout(() => {
          term.innerHTML = '';
          logIndex = 0;
          addLog();
        }, 6000);
        return;
      }

      const div = document.createElement('div');
      div.classList.add('log-line');
      div.innerHTML = `> ${logs[logIndex]}`;
      term.appendChild(div);
      term.scrollTop = term.scrollHeight;
      logIndex++;
      timeoutId = setTimeout(addLog, 400 + Math.random() * 1000);
    };

    timeoutId = setTimeout(addLog, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Tetris Falling Blocks Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    const blockSize = 30;
    const blocks = [];

    const SHAPES = [
      [[1, 1, 1, 1]], // I
      [[1, 1], [1, 1]], // O
      [[0, 1, 0], [1, 1, 1]], // T
      [[1, 1, 0], [0, 1, 1]], // Z
      [[0, 1, 1], [1, 1, 0]], // S
      [[1, 0, 0], [1, 1, 1]], // J
      [[0, 0, 1], [1, 1, 1]]  // L
    ];

    class FallingBlock {
      constructor() {
        this.reset();
      }

      reset() {
        this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const cols = Math.floor(canvas.width / blockSize);
        this.x = Math.floor(Math.random() * cols) * blockSize;
        this.y = -150 - Math.random() * 200;
        this.speed = 1 + Math.random() * 1.5;
        this.isOrange = Math.random() > 0.9;
        this.opacity = 0.1 + Math.random() * 0.2;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.strokeStyle = this.isOrange
          ? `rgba(252, 76, 0, ${this.opacity})`
          : `rgba(31, 92, 255, ${this.opacity})`;
        ctx.lineWidth = 1.5;

        for (let r = 0; r < this.shape.length; r++) {
          for (let c = 0; c < this.shape[r].length; c++) {
            if (this.shape[r][c]) {
              const bx = this.x + c * blockSize;
              const by = this.y + r * blockSize;
              ctx.strokeRect(bx + 2, by + 2, blockSize - 4, blockSize - 4);
              ctx.fillStyle = this.isOrange
                ? `rgba(252, 76, 0, 0.05)`
                : `rgba(31, 92, 255, 0.02)`;
              ctx.fillRect(bx + 2, by + 2, blockSize - 4, blockSize - 4);
            }
          }
        }
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize blocks
    for (let i = 0; i < 15; i++) {
      blocks.push(new FallingBlock());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += blockSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += blockSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Update and draw blocks
      blocks.forEach(b => {
        b.update();
        b.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you! We'll notify ${email} when Puzzles & Games launches.`);
      setEmail('');
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Tetris Canvas Background */}
      <canvas ref={canvasRef} className="puzzles-tetris-canvas"></canvas>
      
      {/* Vignette Overlay */}
      <div className="puzzles-vignette-overlay"></div>

      <main className="puzzles-container">
        <div className="puzzles-status-badge">Status: Under Construction</div>
        <div className="puzzles-brand-logo">VYOMARR</div>
        <h1 className="puzzles-title">Puzzles &amp; Games Incoming</h1>
        <div className="puzzles-sub-headline">You're early. That's rare.</div>
        <p className="puzzles-main-copy">
          Vyomarr Puzzles &amp; Games is currently compiling. The challenges we're crafting are designed to mess with your
          instincts, hijack your dopamine, and force your brain to level up.
        </p>

        {/* Progress Loading */}
        <div className="puzzles-loading-zone">
          <div className="puzzles-progress-track">
            <div className="puzzles-progress-fill"></div>
          </div>
          <div className="puzzles-progress-info">
            <span>System Build v0.9</span>
            <span>Phase 1 In Progress...</span>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="puzzles-grid-deck">
          <div className="puzzles-glass-card">
            <span className="puzzles-card-meta">Phase 1</span>
            <div className="puzzles-card-title">Fast Space Quizzes</div>
            <div className="puzzles-card-desc">Short questions on rockets, orbits, and black holes — easy to try, hard to master.</div>
          </div>
          <div className="puzzles-glass-card">
            <span className="puzzles-card-meta">Phase 2</span>
            <div className="puzzles-card-title">Logic &amp; Trajectories</div>
            <div className="puzzles-card-desc">Solve simple orbit and thrust puzzles. Learn how things actually move in space.</div>
          </div>
          <div className="puzzles-glass-card">
            <span className="puzzles-card-meta">Phase 3</span>
            <div className="puzzles-card-title">Challenge Modes</div>
            <div className="puzzles-card-desc">Timed missions and score-based games. Replay to beat your own personal best.</div>
          </div>
        </div>

        {/* Dashboard Row */}
        <div className="puzzles-dashboard-row">
          <div className="puzzles-widget">
            <div className="puzzles-terminal-header">EST. LAUNCH</div>
            <div className="puzzles-cd-grid">
              <div>
                <span className="puzzles-cd-val">{countdown.days}</span>
                <span className="puzzles-cd-lbl">Days</span>
              </div>
              <div>
                <span className="puzzles-cd-val">{countdown.hours}</span>
                <span className="puzzles-cd-lbl">Hrs</span>
              </div>
              <div>
                <span className="puzzles-cd-val">{countdown.mins}</span>
                <span className="puzzles-cd-lbl">Min</span>
              </div>
            </div>
          </div>
          <div className="puzzles-widget puzzles-widget-terminal">
            <div className="puzzles-terminal-header">
              <span>BUILD LOG</span>
              <span className="puzzles-live-status">● LIVE</span>
            </div>
            <div className="puzzles-terminal-body" ref={terminalRef}></div>
          </div>
        </div>

        {/* Email Capture Form */}
        <form className="puzzles-capture-form" onSubmit={handleSubmit}>
          <div className="puzzles-capture-label">Stay sharp. Drop your email so you don't miss launch:</div>
          <div className="puzzles-input-group">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="puzzles-primary-btn">Stay Sharp</button>
          </div>
        </form>

        {/* Navigation Links */}
        <div className="puzzles-nav-links">
          <a href="/" className="puzzles-ghost-btn">← Back to Main Site</a>
          <a href="/space-mysteries" className="puzzles-ghost-btn">Latest Articles</a>
        </div>
      </main>

      <Footer />
    </>
  );
}
