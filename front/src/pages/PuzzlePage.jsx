import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function PuzzlePage() {
  const canvasRef = useRef(null)
  const [countdown, setCountdown] = useState({ d: '00', h: '00', m: '00' })
  const [logs, setLogs] = useState([])
  const [email, setEmail] = useState('')

  const allLogs = [
    "<span>[OK]</span> Initializing Vyomarr Core...",
    "<span>[SYS]</span> Loading block logic...",
    "<span>[NET]</span> Syncing quiz database...",
    "<span>[OPT]</span> Adjusting gravity...",
    "<span>[RUN]</span> Establishing secure link...",
    "<span>[OK]</span> Ready for user input."
  ]

  // Countdown timer
  useEffect(() => {
    const launchTime = new Date('2026-01-15T12:00:00+05:30').getTime()

    const tick = () => {
      const now = Date.now()
      const diff = launchTime - now
      if (diff < 0) return

      setCountdown({
        d: Math.floor(diff / 86400000).toString().padStart(2, '0'),
        h: Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0'),
        m: Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
      })
    }

    tick()
    const interval = setInterval(tick, 60000)
    return () => clearInterval(interval)
  }, [])

  // Terminal logs
  useEffect(() => {
    let logIndex = 0
    let timeoutId

    const addLog = () => {
      if (logIndex >= allLogs.length) {
        timeoutId = setTimeout(() => {
          setLogs([])
          logIndex = 0
          addLog()
        }, 6000)
        return
      }
      setLogs(prev => [...prev, allLogs[logIndex]])
      logIndex++
      timeoutId = setTimeout(addLog, 400 + Math.random() * 1000)
    }

    timeoutId = setTimeout(addLog, 1000)
    return () => clearTimeout(timeoutId)
  }, [])

  // Tetris canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width, height
    const blockSize = 30
    const blocks = []

    const SHAPES = [
      [[1, 1, 1, 1]],
      [[1, 1], [1, 1]],
      [[0, 1, 0], [1, 1, 1]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 1]],
      [[0, 0, 1], [1, 1, 1]]
    ]

    class FallingBlock {
      constructor() {
        this.reset()
      }

      reset() {
        this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
        const cols = Math.floor(width / blockSize)
        this.x = Math.floor(Math.random() * cols) * blockSize
        this.y = -150 - Math.random() * 200
        this.speed = 1 + Math.random() * 1.5
        this.isOrange = Math.random() > 0.9
        this.opacity = 0.1 + Math.random() * 0.2
      }

      update() {
        this.y += this.speed
        if (this.y > height) {
          this.reset()
        }
      }

      draw() {
        ctx.strokeStyle = this.isOrange ? `rgba(252, 76, 0, ${this.opacity})` : `rgba(31, 92, 255, ${this.opacity})`
        ctx.lineWidth = 1.5

        for (let r = 0; r < this.shape.length; r++) {
          for (let c = 0; c < this.shape[r].length; c++) {
            if (this.shape[r][c]) {
              const bx = this.x + c * blockSize
              const by = this.y + r * blockSize
              ctx.strokeRect(bx + 2, by + 2, blockSize - 4, blockSize - 4)
              ctx.fillStyle = this.isOrange ? `rgba(252, 76, 0, 0.05)` : `rgba(31, 92, 255, 0.02)`
              ctx.fillRect(bx + 2, by + 2, blockSize - 4, blockSize - 4)
            }
          }
        }
      }
    }

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 15; i++) {
      blocks.push(new FallingBlock())
    }

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x <= width; x += blockSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0; y <= height; y += blockSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      blocks.forEach(b => {
        b.update()
        b.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      {/* Tetris Canvas Layer */}
      <canvas ref={canvasRef} className="tetris-canvas"></canvas>

      {/* Vignette Overlay */}
      <div className="vignette-overlay"></div>

      <main className="puzzle-container">
        <div className="status-badge">Status: Under Construction</div>
        <div className="brand-logo">VYOMARR</div>
        <h1>Puzzles &amp; Games Incoming</h1>
        <div className="sub-headline">You're early. That's rare.</div>
        <p className="main-copy">
          Vyomarr Puzzles &amp; Games is currently compiling. The challenges we're crafting are designed to mess with your
          instincts, hijack your dopamine, and force your brain to level up.
        </p>

        <div className="loading-zone">
          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-info">
            <span>System Build v0.9</span>
            <span>Phase 1 In Progress...</span>
          </div>
        </div>

        <div className="grid-deck">
          <div className="phase-card">
            <span className="card-meta">Phase 1</span>
            <div className="card-title">Fast Space Quizzes</div>
            <div className="card-desc">Short questions on rockets, orbits, and black holes — easy to try, hard to master.</div>
          </div>
          <div className="phase-card">
            <span className="card-meta">Phase 2</span>
            <div className="card-title">Logic &amp; Trajectories</div>
            <div className="card-desc">Solve simple orbit and thrust puzzles. Learn how things actually move in space.</div>
          </div>
          <div className="phase-card">
            <span className="card-meta">Phase 3</span>
            <div className="card-title">Challenge Modes</div>
            <div className="card-desc">Timed missions and score-based games. Replay to beat your own personal best.</div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="widget">
            <div className="terminal-header">EST. LAUNCH</div>
            <div className="cd-grid">
              <div><span className="cd-val">{countdown.d}</span><span className="cd-lbl">Days</span></div>
              <div><span className="cd-val">{countdown.h}</span><span className="cd-lbl">Hrs</span></div>
              <div><span className="cd-val">{countdown.m}</span><span className="cd-lbl">Min</span></div>
            </div>
          </div>
          <div className="widget terminal-widget">
            <div className="terminal-header">
              <span>BUILD LOG</span>
              <span className="live-status">● LIVE</span>
            </div>
            <div className="terminal-body">
              {logs.map((log, index) => (
                <div key={index} className="log-line" dangerouslySetInnerHTML={{ __html: `> ${log}` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="capture-form">
          <div className="capture-label">Stay sharp. Drop your email so you don't miss launch:</div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="primary-btn">Stay Sharp</button>
          </div>
        </div>

        <div className="nav-links">
          <Link to="/" className="ghost-btn">← Back to Main Site</Link>
          <Link to="/space-mysteries" className="ghost-btn">Latest Articles</Link>
        </div>
      </main>

      <style>{`
        /* === CANVAS LAYER === */
        .tetris-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          background: radial-gradient(circle at 50% 0%, #001255 0%, #000b49 80%);
        }

        /* Vignette for focus */
        .vignette-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, transparent 40%, rgba(0, 11, 73, 0.7) 100%);
        }

        /* === LAYOUT & CONTAINER === */
        .puzzle-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 10vh 24px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        /* === UI ELEMENTS (Sharp/Tech) === */
        .status-badge {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.75rem;
          color: #fc4c00;
          border: 1px solid #fc4c00;
          padding: 8px 16px;
          background: rgba(252, 76, 0, 0.05);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: inline-block;
          border-radius: 0;
        }

        .brand-logo {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 2rem;
          letter-spacing: 0.15em;
          color: #fc4c00;
          margin-bottom: 12px;
          text-shadow: 0 0 20px rgba(252, 76, 0, 0.3);
        }

        .puzzle-container h1 {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 700;
          margin: 0;
          line-height: 1.1;
          background: linear-gradient(to right, #fff, #d1d5db);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sub-headline {
          font-family: 'Roboto Mono', monospace;
          font-style: italic;
          color: #bfc3c6;
          margin-top: 12px;
          font-size: 1rem;
        }

        .main-copy {
          font-size: 1.15rem;
          line-height: 1.7;
          max-width: 640px;
          margin-top: 24px;
          color: rgba(248, 249, 249, 0.9);
          font-weight: 300;
        }

        /* === PROGRESS === */
        .loading-zone {
          margin: 40px auto 20px;
          width: 100%;
          max-width: 380px;
          text-align: left;
        }

        .progress-track {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          width: 30%;
          background: #fc4c00;
          box-shadow: 0 0 10px #fc4c00;
          position: relative;
          animation: cleanLoop 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes cleanLoop {
          0% { left: -30%; }
          100% { left: 100%; }
        }

        .progress-info {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.7rem;
          color: #bfc3c6;
          display: flex;
          justify-content: space-between;
        }

        /* === CARDS === */
        .grid-deck {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          width: 100%;
          margin-top: 40px;
        }

        .phase-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(31, 92, 255, 0.3);
          border-radius: 0;
          padding: 24px;
          text-align: left;
        }

        .card-meta {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #fc4c00;
          font-weight: 700;
          margin-bottom: 12px;
          display: block;
        }

        .card-title {
          font-family: 'Lato', sans-serif;
          font-weight: 600;
          font-size: 1.1rem;
          color: #f8f9f9;
          margin-bottom: 8px;
        }

        .card-desc {
          font-size: 0.9rem;
          color: #bfc3c6;
          line-height: 1.5;
        }

        /* === TERMINAL === */
        .dashboard-row {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 20px;
          width: 100%;
          margin-top: 30px;
        }

        .widget {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(31, 92, 255, 0.3);
          border-radius: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .terminal-widget {
          justify-content: flex-start;
        }

        .cd-grid {
          display: flex;
          justify-content: space-between;
          text-align: center;
        }

        .cd-val {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          display: block;
          line-height: 1;
          color: #f8f9f9;
        }

        .cd-lbl {
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem;
          color: #bfc3c6;
          text-transform: uppercase;
          margin-top: 5px;
        }

        .terminal-header {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.75rem;
          color: #bfc3c6;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 8px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        }

        .live-status {
          color: #fc4c00;
          font-weight: bold;
          animation: blinkStatus 1.5s infinite;
        }

        @keyframes blinkStatus {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .terminal-body {
          font-family: 'Roboto Mono', monospace;
          font-size: 0.8rem;
          color: #bfc3c6;
          text-align: left;
          height: 80px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .log-line {
          margin-bottom: 2px;
        }

        .log-line span {
          color: #fc4c00;
        }

        /* === FORM === */
        .capture-form {
          margin-top: 50px;
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .capture-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.95rem;
          color: #f8f9f9;
          margin-bottom: 8px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-shadow: 0 0 10px rgba(31, 92, 255, 0.3);
        }

        .input-group {
          display: flex;
          background: rgba(0, 11, 73, 0.85);
          border: 1px solid rgba(252, 76, 0, 0.5);
          border-radius: 0;
          padding: 5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .input-group:focus-within {
          border-color: #fc4c00;
          box-shadow: 0 0 20px rgba(252, 76, 0, 0.4);
          transform: scale(1.01);
        }

        .input-group input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          padding: 16px 20px;
          flex: 1;
          font-family: 'Lato', sans-serif;
          font-size: 1.05rem;
        }

        .input-group input::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.95rem;
        }

        .primary-btn {
          background: #fc4c00;
          color: #f8f9f9;
          border: none;
          padding: 10px 35px;
          border-radius: 0;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
        }

        .primary-btn:hover {
          background: #ff5e1a;
          transform: translateY(-1px);
        }

        .nav-links {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .ghost-btn {
          background: transparent;
          border: 1px solid rgba(191, 195, 198, 0.4);
          color: #bfc3c6;
          padding: 8px 20px;
          border-radius: 0;
          font-family: 'Lato', sans-serif;
          cursor: pointer;
          transition: 0.3s;
          font-size: 0.85rem;
          text-decoration: none;
        }

        .ghost-btn:hover {
          border-color: #f8f9f9;
          color: #f8f9f9;
        }

        @media (max-width: 768px) {
          .dashboard-row {
            grid-template-columns: 1fr;
          }

          .input-group {
            flex-direction: column;
            background: transparent;
            border: none;
            padding: 0;
            box-shadow: none;
          }

          .input-group input {
            background: rgba(0, 11, 73, 0.9);
            border-radius: 0;
            margin-bottom: 10px;
            border: 1px solid rgba(252, 76, 0, 0.3);
          }

          .primary-btn {
            width: 100%;
            padding: 14px;
          }
        }
      `}</style>
    </>
  )
}
