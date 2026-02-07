import { Link } from 'react-router-dom'

export default function GuidelinesPage() {
    const sections = [
        {
            number: '01',
            title: 'Purpose',
            content: [
                { text: 'Vyomarr provides a dedicated space for imaginative, speculative, and perspective-shifting ideas rooted in science domains. The goal is to let users freely explore "What if?" scenarios, unconventional concepts, and bold hypotheses that inspire curiosity and new ways of thinking.' }
            ],
            important: 'Every submission undergoes review to ensure clarity and safety, then is published for the world.'
        },
        {
            number: '02',
            title: 'What This Platform Allows',
            content: [
                { text: 'Vyomarr welcomes any imaginative, hypothetical, or speculative idea connected to science, including:' }
            ],
            list: [
                'Aerospace, space exploration, propulsion, astrobiology',
                'Physics, cosmology, quantum thought explorations',
                'Emerging engineering visions, futuristic technologies',
                'Alternate scientific perspectives, scenario-based reasoning',
                'Bold "What if?" questions that challenge assumptions'
            ],
            note: 'There is no limit to creativity or curiosity. If it sparks new thinking, it belongs here.'
        },
        {
            number: '03',
            title: 'Core Principles for Submissions',
            content: [
                { text: 'To maintain clarity while keeping creativity unrestricted, every post must include:' }
            ],
            list: [
                'A clear statement that the idea is hypothetical or speculative',
                'A short "What if?" framing to state the imaginative question behind the concept',
                'Distinguish known scientific facts from the creative leap (both are allowed)',
                'Use science as inspiration, not restriction—impossible ideas are allowed as long as they are labeled speculative'
            ]
        },
        {
            number: '04',
            title: 'Creativity & Imagination Rules',
            content: [
                { text: 'Allowed without limitation:' }
            ],
            list: [
                'Impossible physics (FTL, wormholes, antigravity) if marked as hypothetical',
                'Alternate universe reasoning',
                'Conceptual future technologies',
                'Unconventional models that break current scientific understanding',
                'New perspectives on old theories',
                'Cross-domain ideas blending science and imagination'
            ],
            note: 'Vyomarr exists to explore mental frontiers, not constrain them.'
        },
        {
            number: '05',
            title: 'Quality and Presentation Expectations',
            subsections: [
                {
                    title: 'Submissions should be:',
                    items: [
                        'Understandable (explain the idea step-by-step)',
                        'Structured (title, summary, main idea)',
                        'Clear about where imagination begins',
                        'Free of real-world harmful instructions',
                        'Respectful of scientific inspiration'
                    ]
                },
                {
                    title: 'Optional but encouraged:',
                    items: [
                        'Diagrams or visual concepts',
                        'Comparisons to existing science',
                        'Multiple perspectives around the idea',
                        'Open-ended questions for others to build upon'
                    ]
                }
            ]
        },
        {
            number: '06',
            title: 'Review and Publication Process',
            content: [
                { text: 'Each "What If" submission goes through:' }
            ],
            list: [
                '1. Clarity Check: Idea is understandable and properly framed as hypothetical',
                '2. Safety Check: No harmful or real-world dangerous instructions',
                '3. Science Domain Check: Idea relates broadly to science or engineering',
                '4. Publication: Content goes live with appropriate tags'
            ],
            note: 'Moderators may request edits to improve clarity before publication.'
        },
        {
            number: '07',
            title: 'Prohibited Content',
            content: [
                { text: 'To maintain a safe space for creativity:' }
            ],
            list: [
                'No real-world weapon instructions or disasters',
                'No personal attacks, hate speech, or harassment',
                'No fraud claiming scientific authority',
                'No plagiarism or copyrighted material without permission'
            ],
            important: 'Speculative science is welcome; real-world harm is not.'
        }
    ]

    return (
        <>
            <div className="guidelines-page">
                <div className="guidelines-container">
                    <header className="page-header">
                        <h1>What-If Submission <span className="accent">Guidelines</span></h1>
                        <p>Explore Without Limits — Your guide to sharing imaginative, speculative, and perspective-shifting ideas on Vyomarr.</p>
                    </header>

                    <div className="policy-section">
                        {/* Intro Card */}
                        <article className="glass-card intro-card">
                            <p>Vyomarr provides a dedicated space for imaginative, speculative, and perspective-shifting ideas rooted in science domains. The goal is to let users freely explore "What if?" scenarios, unconventional concepts, and bold hypotheses that inspire curiosity and new ways of thinking.</p>
                        </article>

                        {sections.map((section, idx) => (
                            <article key={idx} className="glass-card">
                                <div className="glass-card-header">
                                    <span className="section-number">{section.number}</span>
                                    <h3>{section.title}</h3>
                                </div>
                                {section.content?.map((c, i) => <p key={i}>{c.text}</p>)}
                                {section.subsections?.map((sub, i) => (
                                    <div key={i}>
                                        <h4>{sub.title}</h4>
                                        <p>{sub.intro}</p>
                                        <ul>{sub.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                                        {sub.extra && <><p>{sub.extra}</p><ul>{sub.extraItems.map((item, j) => <li key={j}>{item}</li>)}</ul></>}
                                        {sub.note && <p>{sub.note}</p>}
                                    </div>
                                ))}
                                {section.list && <ul>{section.list.map((item, i) => <li key={i}>{item}</li>)}</ul>}
                                {section.important && <p className="important">{section.important}</p>}
                                {section.note && <p>{section.note}</p>}
                            </article>
                        ))}
                    </div>

                    <section className="contact-container">
                        <h3>Questions About Guidelines?</h3>
                        <p>If you have questions or concerns about these guidelines, you may contact us at:</p>
                        <p className="email">support@vyomarr.com</p>
                        <p className="website">Website: https://vyomarr.com</p>
                        <Link to="/contact" className="btn-glow">CONTACT US</Link>
                    </section>
                </div>
            </div>

            <style>{`
                .guidelines-page { min-height: 100vh; }

                .guidelines-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 120px 40px 80px;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .page-header h1 {
                    font-size: 3rem;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: var(--color-cosmic-white);
                }

                .page-header .accent { color: var(--color-space-orange); }

                .page-header > p {
                    color: var(--color-mist-gray);
                    font-size: 1.1rem;
                    max-width: 700px;
                    margin: 0 auto;
                }

                .policy-section {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    padding: 32px;
                    transition: all 0.3s;
                    position: relative;
                    overflow: hidden;
                }

                .glass-card::after {
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

                .glass-card > * { position: relative; z-index: 1; }

                .glass-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                }

                .intro-card p {
                    font-size: 1.1rem;
                    color: var(--color-cosmic-white);
                    margin: 0;
                }

                .glass-card-header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    padding-bottom: 15px;
                }

                .section-number {
                    font-family: var(--font-tech);
                    font-size: 1.2rem;
                    color: var(--color-space-orange);
                    font-weight: bold;
                    background: rgba(252, 76, 0, 0.1);
                    padding: 8px 14px;
                    border-radius: 8px;
                }

                .glass-card h3 {
                    font-size: 1.5rem;
                    margin: 0;
                    color: var(--color-cosmic-white);
                }

                .glass-card h4 {
                    font-size: 1.1rem;
                    color: var(--color-space-orange);
                    margin: 20px 0 10px 0;
                }

                .glass-card p {
                    font-size: 1rem;
                    color: var(--color-mist-gray);
                    line-height: 1.7;
                    margin-bottom: 15px;
                }

                .glass-card ul {
                    margin: 15px 0;
                    padding-left: 0;
                    list-style: none;
                }

                .glass-card li {
                    color: var(--color-mist-gray);
                    padding: 10px 0 10px 28px;
                    position: relative;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .glass-card li:last-child { border-bottom: none; }

                .glass-card li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 8px;
                    height: 8px;
                    background: var(--color-space-orange);
                    border-radius: 50%;
                }

                .important {
                    color: var(--color-space-orange) !important;
                    font-weight: bold;
                }

                .contact-container {
                    margin-top: 60px;
                    text-align: center;
                    padding: 50px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    position: relative;
                    overflow: hidden;
                }

                .contact-container::after {
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

                .contact-container > * { position: relative; z-index: 1; }

                .contact-container h3 {
                    margin-bottom: 15px;
                    color: var(--color-cosmic-white);
                }

                .contact-container p { color: var(--color-mist-gray); margin-bottom: 10px; }

                .email {
                    font-family: var(--font-tech);
                    color: var(--color-space-orange) !important;
                    font-size: 1.1rem;
                }

                .website { font-family: var(--font-tech); }

                .btn-glow {
                    display: inline-block;
                    margin-top: 25px;
                    padding: 15px 40px;
                    background: linear-gradient(90deg, var(--color-space-orange), #ff6a2b);
                    color: var(--color-cosmic-white);
                    font-family: var(--font-heading);
                    font-weight: 700;
                    border-radius: 12px;
                    transition: all 0.3s;
                    text-decoration: none;
                }

                .btn-glow:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(252, 76, 0, 0.3);
                }

                @media (max-width: 768px) {
                    .guidelines-container { padding: 100px 20px 60px; }
                    .page-header h1 { font-size: 2rem; }
                    .glass-card { padding: 24px; }
                    .glass-card-header { flex-direction: column; align-items: flex-start; gap: 10px; }
                }
            `}</style>
        </>
    )
}
