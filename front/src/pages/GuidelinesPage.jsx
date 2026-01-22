import { Link } from 'react-router-dom'

export default function GuidelinesPage() {
    return (
        <>
            <div className="guidelines-page">
                <div className="glow-bg"></div>

                <div className="guidelines-container">
                    <header className="page-header">
                        <h1>What-If Submission <span className="accent">Guidelines</span></h1>
                        <p>Explore Without Limits — Your guide to sharing imaginative, speculative, and perspective-shifting ideas on Vyomarr.</p>
                    </header>

                    {/* Purpose */}
                    <section className="content-section">
                        <h2 className="section-title"><span className="icon">🎯</span> Purpose</h2>
                        <div className="section-content">
                            <p>Vyomarr provides a dedicated space for imaginative, speculative, and perspective-shifting ideas rooted in science domains. The goal is to let users freely explore "What if?" scenarios, unconventional concepts, and bold hypotheses that inspire curiosity and new ways of thinking.</p>
                            <div className="highlight-box">
                                <p>Every submission undergoes review to ensure clarity and safety, then is published for the world.</p>
                            </div>
                        </div>
                    </section>

                    {/* What This Platform Allows */}
                    <section className="content-section">
                        <h2 className="section-title"><span className="icon">✨</span> What This Platform Allows</h2>
                        <div className="section-content">
                            <p>Vyomarr welcomes any imaginative, hypothetical, or speculative idea connected to science, including:</p>
                            <ul>
                                <li>Aerospace, space exploration, propulsion, astrobiology</li>
                                <li>Physics, cosmology, quantum thought explorations</li>
                                <li>Emerging engineering visions, futuristic technologies</li>
                                <li>Alternate scientific perspectives, scenario-based reasoning</li>
                                <li>Bold "What if?" questions that challenge assumptions</li>
                            </ul>
                            <div className="highlight-box">
                                <p>There is no limit to creativity or curiosity. If it sparks new thinking, it belongs here.</p>
                            </div>
                        </div>
                    </section>

                    {/* Core Principles */}
                    <section className="content-section">
                        <h2 className="section-title"><span className="icon">📜</span> Core Principles for Submissions</h2>
                        <div className="section-content">
                            <p>To maintain clarity while keeping creativity unrestricted, every post must include:</p>
                            <ul>
                                <li>A clear statement that the idea is hypothetical or speculative</li>
                                <li>A short "What if?" framing to state the imaginative question behind the concept</li>
                                <li>Distinguish known scientific facts from the creative leap (both are allowed)</li>
                                <li>Use science as inspiration, not restriction—impossible ideas are allowed as long as they are labeled speculative</li>
                            </ul>
                        </div>
                    </section>

                    {/* Creativity Rules */}
                    <section className="content-section">
                        <h2 className="section-title"><span className="icon">🚀</span> Creativity & Imagination Rules</h2>
                        <div className="section-content">
                            <p><strong>Allowed without limitation:</strong></p>
                            <ul>
                                <li>Impossible physics (FTL, wormholes, antigravity) if marked as hypothetical</li>
                                <li>Alternate universe reasoning</li>
                                <li>Conceptual future technologies</li>
                                <li>Unconventional models that break current scientific understanding</li>
                                <li>New perspectives on old theories</li>
                                <li>Cross-domain ideas blending science and imagination</li>
                            </ul>
                            <div className="highlight-box">
                                <p>Vyomarr exists to explore mental frontiers, not constrain them.</p>
                            </div>
                        </div>
                    </section>

                    {/* Quality */}
                    <section className="content-section">
                        <h2 className="section-title"><span className="icon">📝</span> Quality and Presentation Expectations</h2>
                        <div className="section-content">
                            <div className="two-column">
                                <div>
                                    <p><strong>Submissions should be:</strong></p>
                                    <ul>
                                        <li>Understandable (explain the idea step-by-step)</li>
                                        <li>Structured (title, summary, main idea)</li>
                                        <li>Clear about where imagination begins</li>
                                        <li>Free of real-world harmful instructions</li>
                                        <li>Respectful of scientific inspiration</li>
                                    </ul>
                                </div>
                                <div>
                                    <p><strong>Optional but encouraged:</strong></p>
                                    <ul>
                                        <li>Diagrams or visual concepts</li>
                                        <li>Comparisons to existing science</li>
                                        <li>Multiple perspectives around the idea</li>
                                        <li>Open-ended questions for others to build upon</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Review Process */}
                    <section className="content-section">
                        <h2 className="section-title"><span className="icon">⚙️</span> Review and Publication Process</h2>
                        <div className="section-content">
                            <p>Each "What If" submission goes through:</p>
                            <div className="process-steps">
                                {[
                                    { num: 1, title: 'Clarity Check', desc: 'Idea is understandable and properly framed as hypothetical' },
                                    { num: 2, title: 'Safety Check', desc: 'No harmful or real-world dangerous instructions' },
                                    { num: 3, title: 'Science Domain Check', desc: 'Idea relates broadly to science or engineering' },
                                    { num: 4, title: 'Publication', desc: 'Content goes live with appropriate tags' }
                                ].map(step => (
                                    <div key={step.num} className="process-step">
                                        <span className="step-number">{step.num}</span>
                                        <div className="step-content">
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="note">Moderators may request edits to improve clarity before publication.</p>
                        </div>
                    </section>

                    {/* Prohibited */}
                    <section className="content-section prohibited-section">
                        <h2 className="section-title"><span className="icon">🚫</span> Prohibited Content</h2>
                        <div className="section-content">
                            <p>To maintain a safe space for creativity:</p>
                            <ul>
                                <li>No real-world weapon instructions or disasters</li>
                                <li>No personal attacks, hate speech, or harassment</li>
                                <li>No fraud claiming scientific authority</li>
                                <li>No plagiarism or copyrighted material without permission</li>
                            </ul>
                            <div className="highlight-box warning">
                                <p>Speculative science is welcome; real-world harm is not.</p>
                            </div>
                        </div>
                    </section>

                    {/* Footer Note */}
                    <div className="footer-note">
                        <p><span className="accent">Vyomarr</span> — Where Imagination Meets the Cosmos</p>
                    </div>
                </div>
            </div>

            <style>{`
                .guidelines-page {
                    min-height: 100vh;
                    position: relative;
                }

                .glow-bg {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    z-index: -2;
                    background: radial-gradient(ellipse at 50% 50%, rgba(0, 50, 120, 0.15) 0%, rgba(0, 11, 73, 0) 50%);
                    animation: pulseGlow 8s ease-in-out infinite;
                }

                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }

                .guidelines-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 120px 40px 80px;
                    position: relative;
                    z-index: 10;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .page-header h1 {
                    font-size: 3rem;
                    margin-bottom: 16px;
                    letter-spacing: 1px;
                    color: var(--color-cosmic-white);
                }

                .page-header .accent { color: var(--color-space-orange); }

                .page-header p {
                    font-size: 1.2rem;
                    color: var(--color-mist-gray);
                    max-width: 700px;
                    margin: 0 auto;
                }

                .content-section {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    padding: 40px;
                    margin-bottom: 32px;
                    position: relative;
                    overflow: hidden;
                }

                .content-section::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    z-index: 0;
                }

                .content-section > * { position: relative; z-index: 1; }

                .section-title {
                    font-size: 1.5rem;
                    color: var(--color-cosmic-white);
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .section-title .icon {
                    color: var(--color-space-orange);
                    font-size: 1.3rem;
                }

                .section-content p {
                    margin-bottom: 16px;
                    line-height: 1.8;
                    color: var(--color-mist-gray);
                }

                .section-content p strong { color: var(--color-cosmic-white); }

                .section-content ul {
                    list-style: none;
                    padding-left: 0;
                    margin-bottom: 16px;
                }

                .section-content ul li {
                    position: relative;
                    padding-left: 28px;
                    margin-bottom: 12px;
                    line-height: 1.7;
                    color: var(--color-mist-gray);
                }

                .section-content ul li::before {
                    content: '✦';
                    position: absolute;
                    left: 0;
                    color: var(--color-space-orange);
                    font-size: 0.8rem;
                }

                .highlight-box {
                    background: rgba(252, 76, 0, 0.1);
                    border-left: 3px solid var(--color-space-orange);
                    padding: 20px 24px;
                    border-radius: 0 12px 12px 0;
                    margin: 24px 0;
                }

                .highlight-box p {
                    color: var(--color-cosmic-white);
                    margin: 0;
                }

                .highlight-box.warning {
                    background: rgba(239, 68, 68, 0.15);
                    border-color: #ef4444;
                }

                .two-column {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 32px;
                }

                .process-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .process-step {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .step-number {
                    width: 36px;
                    height: 36px;
                    background: var(--color-space-orange);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 0.9rem;
                    color: var(--color-cosmic-white);
                    flex-shrink: 0;
                }

                .step-content h4 {
                    font-size: 1rem;
                    margin-bottom: 4px;
                    color: var(--color-cosmic-white);
                }

                .step-content p {
                    font-size: 0.9rem;
                    margin: 0;
                }

                .note {
                    margin-top: 20px;
                    font-style: italic;
                }

                .prohibited-section {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                .prohibited-section .section-title .icon { color: #ef4444; }
                .prohibited-section ul li::before { content: '✕'; color: #ef4444; }

                .footer-note {
                    text-align: center;
                    padding: 40px;
                    color: var(--color-mist-gray);
                    font-style: italic;
                }

                .footer-note .accent {
                    color: var(--color-space-orange);
                    font-style: normal;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .guidelines-container { padding: 80px 20px 60px; }
                    .page-header h1 { font-size: 2rem; }
                    .content-section { padding: 28px; }
                    .two-column { grid-template-columns: 1fr; }
                }
            `}</style>
        </>
    )
}
