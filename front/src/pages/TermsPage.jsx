import { Link } from 'react-router-dom'

export default function TermsPage() {
  const sections = [
    {
      number: '01',
      title: 'Age Requirements & Eligibility',
      highlight: { title: 'Why It Matters', text: 'Age verification is crucial for legal protection and data compliance regarding minors.' },
      content: [
        'You must be at least 18 years old to create an account and use Vyomarr\'s services. This ensures you can legally enter into binding agreements.',
        'If 18 is not the age of majority where you live, you must have reached the legal age of adulthood in your jurisdiction to engage with our platform.'
      ]
    },
    {
      number: '02',
      title: 'Acceptable Use Guidelines',
      content: [
        'We aim to foster an environment where scientific curiosity and respectful debate can flourish. By using Vyomarr, you agree to adhere to our Community Standards.',
        '<strong>Respectful Communication:</strong> Treat all members with respect. Avoid personal attacks, harassment, or hate speech.',
        '<strong>Platform Security:</strong> Do not engage in spamming, phishing, or hacking attempts that could disrupt the platform integrity.'
      ]
    },
    {
      number: '03',
      title: 'User Content Rights',
      highlight: { title: 'Ownership', text: 'You retain full ownership of all content you create and post on Vyomarr.' },
      content: [
        '<strong>Platform License:</strong> By posting, you grant Vyomarr a non-exclusive, worldwide, royalty-free license to display and distribute your content as part of our services.',
        '<strong>Moderation:</strong> We reserve the right to remove any content that violates these Terms, community guidelines, or is otherwise deemed inappropriate.'
      ]
    },
    {
      number: '04',
      title: 'Intellectual Property',
      content: [
        'We respect intellectual property rights and expect our users to do the same.',
        'All content created by Vyomarr is owned by us and protected by copyright, trademark, and other IP laws. You may not use it without our explicit written permission. Additionally, do not post copyrighted material belonging to others unless you have permission or it falls under fair use.'
      ]
    },
    {
      number: '05',
      title: 'Disclaimers & Limitations',
      highlight: { title: 'As Is Basis', text: 'Vyomarr provides all services "as is" without warranties of any kind.' },
      content: [
        'We cannot guarantee uninterrupted access or that all content is completely accurate. To the maximum extent permitted by law, Vyomarr is not liable for any damages arising from your use of the services.'
      ]
    },
    {
      number: '06',
      title: 'Termination & Governance',
      content: [
        'We may suspend or terminate your account if you violate these terms, engage in harmful conduct, or pose a risk to the community.',
        'These Terms are governed by the laws of India. Any disputes will be resolved in the appropriate courts of India. We may update these Terms from time to time; your continued use constitutes acceptance.'
      ]
    }
  ]

  return (
    <>
      <div className="terms-page">
        <div className="terms-container">
          {/* Page Header */}
          <header className="page-header">
            <h1>Terms of <span className="accent">Service</span></h1>
            <p>Please review the rules governing your exploration of the Vyomarr network.</p>
            <div className="last-updated">LAST UPDATED: 2025-08-14</div>
          </header>

          {/* Terms Sections */}
          <div className="terms-section">
            {sections.map((section, index) => (
              <article key={index} className="glass-card">
                <div className="glass-card-header">
                  <span className="section-number">{section.number}</span>
                  <h3>{section.title}</h3>
                </div>
                {section.highlight && (
                  <div className="highlight-box">
                    <span className="highlight-title">{section.highlight.title}</span>
                    {section.highlight.text}
                  </div>
                )}
                {section.content.map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </article>
            ))}
          </div>

          {/* Contact Section */}
          <section className="contact-container">
            <h3>Questions regarding these Terms?</h3>
            <p>Our legal and support teams are available to clarify any aspect of our service agreement.</p>
            <Link to="/contact" className="btn-glow">CONTACT SUPPORT</Link>
            <p className="response-note">Response time: 24-48 hours</p>
          </section>
        </div>
      </div>

      <style>{`
                .terms-page {
                    min-height: 100vh;
                    position: relative;
                }



                .terms-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 100px 20px 60px;
                    position: relative;
                    z-index: 10;
                }

                /* Page Header */
                .page-header {
                    text-align: center;
                    margin-bottom: 60px;
                    animation: float 6s ease-in-out infinite;
                }

                .page-header h1 {
                    font-size: 3rem;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-shadow: 0 0 30px rgba(0, 11, 73, 0.8);
                    color: var(--color-cosmic-white);
                }

                .page-header .accent {
                    color: var(--color-space-orange);
                }

                .page-header > p {
                    color: var(--color-mist-gray);
                    font-size: 1.1rem;
                }

                .last-updated {
                    display: inline-block;
                    margin-top: 10px;
                    padding: 5px 15px;
                    border: 1px solid var(--color-mist-gray);
                    border-radius: 4px;
                    font-family: var(--font-tech);
                    font-style: italic;
                    font-size: 0.85rem;
                    color: var(--color-mist-gray);
                    background: rgba(0, 11, 73, 0.5);
                }

                /* Terms Sections */
                .terms-section {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    padding: 32px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    position: relative;
                    overflow: hidden;
                }

                .glass-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    z-index: 0;
                }

                .glass-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                    opacity: 0.03;
                    pointer-events: none;
                    border-radius: 24px;
                    z-index: 0;
                }

                .glass-card > * {
                    position: relative;
                    z-index: 1;
                }

                .glass-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
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

                .glass-card p {
                    font-size: 1rem;
                    color: var(--color-mist-gray);
                    line-height: 1.7;
                    margin-bottom: 15px;
                }

                .glass-card p:last-child {
                    margin-bottom: 0;
                }

                .glass-card p strong {
                    color: var(--color-cosmic-white);
                }

                .highlight-box {
                    background: rgba(252, 76, 0, 0.05);
                    border-left: 3px solid var(--color-space-orange);
                    padding: 15px 20px;
                    margin: 15px 0;
                    border-radius: 0 12px 12px 0;
                    color: var(--color-mist-gray);
                }

                .highlight-title {
                    color: var(--color-space-orange);
                    font-family: var(--font-heading);
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 5px;
                    display: block;
                }

                /* Contact Section */
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
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    z-index: 0;
                }

                .contact-container > * {
                    position: relative;
                    z-index: 1;
                }

                .contact-container h3 {
                    font-size: 1.5rem;
                    color: var(--color-cosmic-white);
                    margin-bottom: 10px;
                }

                .contact-container > p {
                    color: var(--color-mist-gray);
                }

                .btn-glow {
                    display: inline-block;
                    margin-top: 25px;
                    padding: 15px 40px;
                    background: linear-gradient(90deg, var(--color-space-orange), #ff6a2b);
                    color: var(--color-cosmic-white);
                    font-family: var(--font-heading);
                    font-weight: 700;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    text-decoration: none;
                    position: relative;
                    overflow: hidden;
                }

                .btn-glow:hover {
                    transform: translateY(-3px);
                }

                .response-note {
                    margin-top: 15px;
                    font-size: 0.8rem;
                    font-family: var(--font-tech);
                    font-style: italic;
                    color: var(--color-mist-gray);
                }

                @media (max-width: 768px) {
                    .page-header h1 {
                        font-size: 2rem;
                    }
                    .glass-card-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                }
            `}</style>
    </>
  )
}
