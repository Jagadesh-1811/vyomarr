import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SubmitTheory.css';

export default function SubmitTheory() {
  const steps = [
    {
      number: 1,
      title: 'Frame a Clear & Compelling "What-If" Question',
      content: (
        <>
          <p>Start with a single, thought-provoking question that opens a new perspective. Keep the scope focused so readers can follow the idea and contributors can build on it.</p>
          <ul>
            <li>Good: "What if dark matter could store usable energy?"</li>
            <li>Better: "What if engineered dark-matter pockets could act as spacecraft fuel reservoirs?"</li>
          </ul>
        </>
      )
    },
    {
      number: 2,
      title: 'Write the Scenario — Separate Fact from Imagination',
      content: (
        <>
          <p>Describe your hypothesis with clarity. Explicitly mark which parts are known science, which are assumptions, and which are pure imagination. This helps readers and reviewers judge context and novelty.</p>
          <ul>
            <li>Include a short summary (3–6 lines)</li>
            <li>Provide the main explanation (one to three paragraphs)</li>
            <li>List key assumptions and the most important unknowns</li>
          </ul>
        </>
      )
    },
    {
      number: 3,
      title: 'Prepare Supporting Material (Optional)',
      content: (
        <>
          <p>Enhance your submission with diagrams, concept sketches, or short data snippets. Visuals make complex ideas easier to engage with — keep files original and under 5 MB (PNG/JPG).</p>
          <p className="theory-note">Do not upload detailed procedural instructions for harmful or regulated activities; such content will be removed.</p>
        </>
      )
    },
    {
      number: 4,
      title: 'Complete the Submit Form',
      content: (
        <>
          <p>Visit the submission page and fill the fields. The form includes an explicit checkbox for video adaptation permission — you may opt out if you do not want Vyomarr to adapt your idea into a video.</p>
          <p><strong>Required fields:</strong> Title, Science Domain, Hypothetical Scenario (text). Optional fields: creator notes, image upload, allow-adapt checkbox.</p>
          <Link to="/submit-form" className="theory-btn-submit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M12 2L12 22M12 2L5 9M12 2L19 9" transform="rotate(-45 12 12)" />
            </svg>
            Open the Submit Form
          </Link>
        </>
      )
    },
    {
      number: 5,
      title: 'Review & Publication Process',
      content: (
        <>
          <p>Submissions undergo a manual review that checks: clarity, originality, relevance to science domains, and safety compliance. Approved submissions are published in the What-If gallery with a "Hypothetical" tag and the author credited or shown as anonymous if chosen.</p>
          <p className="theory-note">Exceptional submissions may be invited for creator interviews or adapted into long-form video content; Vyomarr retains editorial discretion and will request explicit collaboration if needed.</p>
        </>
      )
    },
    {
      number: 6,
      title: 'Rights, Credit, and Adaptation',
      content: (
        <>
          <p>By default: authors retain ownership of their original idea and grant Vyomarr a license to display and adapt the content for site and media purposes (credit will be provided). You may opt out of adaptation during submission.</p>
          <p>If selected for adaptation, Vyomarr will request further permissions for interviews, additional notes, or revenue-sharing discussions where applicable.</p>
        </>
      )
    }
  ];

  const tips = [
    'Be concise: aim for 300–900 words. Clear structure improves publishability.',
    'Label assumptions: separate what\'s known from what\'s speculative.',
    'Credit sources: cite papers, articles, or inspirations when relevant.',
    'Aim for perspective: propose questions others can debate or build upon.'
  ];

  return (
    <div className="theory-page">
      <Navbar />

      {/* Main Content */}
      <div className="theory-container">
        <header className="theory-page-header">
          <h1>How to Submit a <span className="theory-accent">Theory</span> to Vyomarr</h1>
          <p>Share a bold "What-If" scenario rooted in science. Submissions are reviewed and published to spark community discussion and — if exceptional — adapted into Vyomarr video features.</p>
        </header>

        <main className="theory-steps-section">
          {steps.map((step) => (
            <article key={step.number} className="theory-step-card">
              <div className="theory-step-number">{step.number}</div>
              <div className="theory-step-content">
                <h2>{step.title}</h2>
                {step.content}
              </div>
            </article>
          ))}
        </main>

        {/* Tips Section */}
        <section className="theory-tips-card">
          <h2>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="theory-lightbulb-icon">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
            </svg>
            Tips to Make Your Theory Stand Out
          </h2>
          <div className="theory-tips-grid">
            {tips.map((tip, index) => (
              <div key={index} className="theory-tip-item">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="theory-check-icon">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <p>{tip}</p>
              </div>
            ))}
          </div>
          <p className="theory-tips-note">
            If your idea meets our standards it may be featured, highlighted in community spotlights, or expanded into a Vyomarr video. For legal or safety reasons, Vyomarr may decline or request edits to any submission.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
