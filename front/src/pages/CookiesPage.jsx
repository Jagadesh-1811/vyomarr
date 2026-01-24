import { Link } from 'react-router-dom'

export default function CookiesPage() {
    const sections = [
        {
            number: '01',
            title: 'What Are Cookies?',
            highlight: { title: 'Definition', text: 'Small text files stored on your device to enhance your browsing experience.' },
            content: [
                'Cookies are small text files that websites place on your device (computer, tablet, or smartphone) when you visit them. They help websites remember your preferences, keep you logged in, and provide a better, more personalized experience.',
                'Cookies cannot harm your device, access personal files, or spread viruses. They simply store information that makes your browsing smoother and more efficient.'
            ]
        },
        {
            number: '02',
            title: 'How We Use Cookies',
            content: [
                'At Vyomarr, we believe in transparency. We use cookies only for essential purposes that directly benefit your experience on our platform.',
                '<strong>Authentication:</strong> When you log in, we use secure cookies to keep you signed in across pages, so you don\'t need to re-enter your credentials during your session.',
                '<strong>Preferences:</strong> We remember your cookie consent choice so we don\'t ask you every time you visit.',
                '<strong>Security:</strong> Cookies help us protect your account and detect suspicious login activity.'
            ]
        },
        {
            number: '03',
            title: 'Types of Cookies We Use',
            highlight: { title: 'Privacy First', text: 'We do NOT use advertising, tracking, or third-party analytics cookies.' },
            content: [
                '<strong>Strictly Necessary Cookies:</strong> These are essential for the website to function. They enable core features like user authentication and session management. You cannot opt out of these cookies as the site won\'t work properly without them.',
                '<strong>Functional Cookies:</strong> These remember your preferences (like your cookie consent choice) to provide a more personalized experience. They do not track your activity on other websites.'
            ]
        },
        {
            number: '04',
            title: 'Cookies We Set',
            content: [
                '<strong>vyomarr_user_cookie_consent</strong> — Remembers whether you\'ve accepted our cookie policy. Stored in your browser\'s local storage and persists until you clear your browser data.',
                '<strong>Authentication Token</strong> — A secure, HttpOnly cookie that keeps you logged into your account. This cookie is encrypted and cannot be accessed by JavaScript, providing maximum security. Expires after your session ends or 7 days of inactivity.'
            ]
        },
        {
            number: '05',
            title: 'Managing Your Cookies',
            content: [
                'You have full control over the cookies stored on your device. Here\'s how you can manage them:',
                '<strong>Browser Settings:</strong> Most modern browsers allow you to view, manage, and delete cookies through their settings or preferences menu. Look for "Privacy" or "Cookies" options.',
                '<strong>Clear All Cookies:</strong> You can delete all cookies and local storage data from your browser at any time. Note that this will log you out of Vyomarr and other websites.',
                '<strong>Block Cookies:</strong> You can configure your browser to block all cookies, but this will prevent you from logging into Vyomarr and using many features.'
            ]
        },
        {
            number: '06',
            title: 'Third-Party Cookies',
            highlight: { title: 'Your Privacy Matters', text: 'Vyomarr does not share your data with advertisers or use third-party tracking.' },
            content: [
                'Unlike many websites, Vyomarr does <strong>NOT</strong> use:',
                '• Google Analytics or similar tracking tools<br>• Advertising or remarketing cookies<br>• Social media tracking pixels<br>• Any third-party data collection services',
                'Your browsing activity on Vyomarr stays on Vyomarr. We don\'t sell, share, or monetize your data in any way.'
            ]
        },
        {
            number: '07',
            title: 'Updates to This Policy',
            content: [
                'We may update this Cookie Policy occasionally to reflect changes in our practices, technology, or legal requirements. When we make significant changes, we\'ll update the "Last Updated" date at the top of this page.',
                'We encourage you to review this page periodically to stay informed about how we use cookies.'
            ]
        }
    ]

    return (
        <>
            <div className="terms-page">
                <div className="terms-container">
                    {/* Page Header */}
                    <header className="page-header">
                        <h1>Cookie <span className="accent">Policy</span></h1>
                        <p>Transparency about how we use cookies and protect your privacy.</p>
                        <div className="last-updated">LAST UPDATED: 2026-01-24</div>
                    </header>

                    {/* Cookie Sections */}
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
                        <h3>Questions about our Cookie Policy?</h3>
                        <p>Our team is happy to clarify how we handle your data and privacy.</p>
                        <Link to="/contact" className="btn-glow">CONTACT US</Link>
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
