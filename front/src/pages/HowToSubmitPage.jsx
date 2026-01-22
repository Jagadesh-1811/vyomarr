import { Link } from 'react-router-dom'

export default function HowToSubmitPage() {
  const steps = [
    {
      num: 1,
      title: 'Frame a Clear & Compelling "What-If" Question',
      content: 'Start with a single, thought-provoking question that opens a new perspective. Keep the scope focused so readers can follow the idea and contributors can build on it.',
      examples: [
        'Good: "What if dark matter could store usable energy?"',
        'Better: "What if engineered dark-matter pockets could act as spacecraft fuel reservoirs?"'
      ]
    },
    {
      num: 2,
      title: 'Write the Scenario — Separate Fact from Imagination',
      content: 'Describe your hypothesis with clarity. Explicitly mark which parts are known science, which are assumptions, and which are pure imagination. This helps readers and reviewers judge context and novelty.',
      examples: [
        'Include a short summary (3–6 lines)',
        'Provide the main explanation (one to three paragraphs)',
        'List key assumptions and the most important unknowns'
      ]
    },
    {
      num: 3,
      title: 'Prepare Supporting Material (Optional)',
      content: 'Enhance your submission with diagrams, concept sketches, or short data snippets. Visuals make complex ideas easier to engage with — keep files original and under 5 MB (PNG/JPG).',
      note: 'Do not upload detailed procedural instructions for harmful or regulated activities; such content will be removed.'
    },
    {
      num: 4,
      title: 'Complete the Submit Form',
      content: 'Visit the submission page and fill the fields. The form includes an explicit checkbox for video adaptation permission — you may opt out if you do not want Vyomarr to adapt your idea into a video.',
      extra: 'Required fields: Title, Science Domain, Hypothetical Scenario (text). Optional fields: creator notes, image upload, allow-adapt checkbox.',
      hasButton: true
    },
    {
      num: 5,
      title: 'Review & Publication Process',
      content: 'Submissions undergo a manual review that checks: clarity, originality, relevance to science domains, and safety compliance. Approved submissions are published in the What-If gallery with a "Hypothetical" tag and the author credited or shown as anonymous if chosen.',
      note: 'Exceptional submissions may be invited for creator interviews or adapted into long-form video content; Vyomarr retains editorial discretion and will request explicit collaboration if needed.'
    },
    {
      num: 6,
      title: 'Rights, Credit, and Adaptation',
      content: 'By default: authors retain ownership of their original idea and grant Vyomarr a license to display and adapt the content for site and media purposes (credit will be provided). You may opt out of adaptation during submission.',
      extra: 'If selected for adaptation, Vyomarr will request further permissions for interviews, additional notes, or revenue-sharing discussions where applicable.'
    }
  ]

  const tips = [
    'Be concise: aim for 300–900 words. Clear structure improves publishability.',
    'Label assumptions: separate what\'s known from what\'s speculative.',
    'Credit sources: cite papers, articles, or inspirations when relevant.',
    'Aim for perspective: propose questions others can debate or build upon.'
  ]

  return (
    <>
      <div className="submit-guide-page">
        <div className="submit-container">
          <header className="page-header">
            <h1>How to Submit a <span className="accent">Theory</span> to Vyomarr</h1>
            <p>Share a bold "What-If" scenario rooted in science. Submissions are reviewed and published to spark community discussion and — if exceptional — adapted into Vyomarr video features.</p>
          </header>

          <main className="steps-section">
            {steps.map(step => (
              <article key={step.num} className="step-card">
                <div className="step-number">{step.num}</div>
                <div className="step-content">
                  <h2>{step.title}</h2>
                  <p>{step.content}</p>
                  {step.extra && <p><strong>{step.extra}</strong></p>}
                  {step.examples && (
                    <ul>
                      {step.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                  )}
                  {step.note && <p className="note">{step.note}</p>}
                  {step.hasButton && (
                    <Link to="/submit-theory" className="btn-submit">
                      Open the Submit Form
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </main>

          <section className="tips-card">
            <h2><svg fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg> Tips to Make Your Theory Stand Out</h2>
            <div className="tips-grid">
              {tips.map((tip, i) => (
                <div key={i} className="tip-item">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
            <p className="tips-note">If your idea meets our standards it may be featured, highlighted in community spotlights, or expanded into a Vyomarr video. For legal or safety reasons, Vyomarr may decline or request edits to any submission.</p>
          </section>
        </div>
      </div>

      <style>{`
                .submit-guide-page { min-height: 100vh; }

                .submit-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 120px 20px 80px;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .page-header h1 {
                    font-size: 2.8rem;
                    margin-bottom: 20px;
                    color: var(--color-cosmic-white);
                }

                .page-header .accent { color: var(--color-space-orange); }

                .page-header p {
                    color: var(--color-mist-gray);
                    font-size: 1.05rem;
                    max-width: 760px;
                    margin: 0 auto;
                    font-family: var(--font-tech);
                    font-style: italic;
                    line-height: 1.7;
                }

                .steps-section {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .step-card {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    padding: 32px;
                    transition: all 0.3s;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    gap: 24px;
                    align-items: flex-start;
                }

                .step-card::after {
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

                .step-card > * { position: relative; z-index: 1; }

                .step-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                }

                .step-number {
                    flex-shrink: 0;
                    width: 56px;
                    height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(252, 76, 0, 0.12);
                    border: 2px solid var(--color-space-orange);
                    border-radius: 12px;
                    font-family: var(--font-tech);
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--color-space-orange);
                }

                .step-content h2 {
                    font-size: 1.35rem;
                    margin-bottom: 12px;
                    color: var(--color-cosmic-white);
                }

                .step-content p {
                    color: var(--color-mist-gray);
                    font-size: 1rem;
                    line-height: 1.7;
                    margin-bottom: 12px;
                }

                .step-content p strong { color: var(--color-cosmic-white); }

                .step-content ul {
                    margin: 15px 0 0;
                    padding-left: 0;
                    list-style: none;
                }

                .step-content li {
                    color: var(--color-mist-gray);
                    padding: 8px 0 8px 24px;
                    position: relative;
                    font-family: var(--font-tech);
                    font-size: 0.9rem;
                }

                .step-content li::before {
                    content: '→';
                    position: absolute;
                    left: 0;
                    color: var(--color-space-orange);
                }

                .note {
                    font-family: var(--font-tech);
                    font-size: 0.9rem;
                    font-style: italic;
                    opacity: 0.85;
                }

                .btn-submit {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 16px;
                    padding: 14px 32px;
                    background: linear-gradient(90deg, var(--color-space-orange), #ff6a2b);
                    color: var(--color-deep-navy);
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 0.95rem;
                    border-radius: 12px;
                    transition: all 0.3s;
                    text-decoration: none;
                }

                .btn-submit svg { width: 18px; height: 18px; }

                .btn-submit:hover { transform: translateY(-3px); }

                .tips-card {
                    margin-top: 50px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    padding: 32px;
                    position: relative;
                    overflow: hidden;
                }

                .tips-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(252,76,0,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(252,76,0,0.2) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    z-index: 0;
                }

                .tips-card > * { position: relative; z-index: 1; }

                .tips-card h2 {
                    font-size: 1.5rem;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--color-cosmic-white);
                }

                .tips-card h2 svg {
                    width: 24px;
                    height: 24px;
                    color: var(--color-space-orange);
                }

                .tips-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }

                .tip-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                }

                .tip-item svg {
                    width: 18px;
                    height: 18px;
                    color: var(--color-space-orange);
                    margin-top: 3px;
                    flex-shrink: 0;
                }

                .tip-item p {
                    color: var(--color-mist-gray);
                    margin: 0;
                    font-size: 0.95rem;
                }

                .tips-note {
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    font-family: var(--font-tech);
                    font-size: 0.85rem;
                    font-style: italic;
                    color: var(--color-mist-gray);
                }

                @media (max-width: 768px) {
                    .submit-container { padding: 100px 20px 60px; }
                    .page-header h1 { font-size: 2rem; }
                    .step-card { flex-direction: column; padding: 24px; }
                    .step-number { width: 48px; height: 48px; font-size: 1.1rem; }
                    .tips-grid { grid-template-columns: 1fr; }
                }
            `}</style>
    </>
  )
}
