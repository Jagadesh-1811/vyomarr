import { Link } from 'react-router-dom'

export default function PrivacyPage() {
    const sections = [
        {
            number: '01',
            title: 'Information We Collect',
            content: [
                { text: 'Vyomarr collects limited information to operate effectively and improve user experience.' }
            ],
            subsections: [
                {
                    title: 'a) Information You Provide Voluntarily',
                    intro: 'We may collect information when you:',
                    items: ['Contact us via forms or email', 'Join our community platforms (e.g., Discord)', 'Subscribe to updates or newsletters'],
                    extra: 'This may include:',
                    extraItems: ['Name (if provided)', 'Email address', 'Any message or content you submit']
                },
                {
                    title: 'b) Automatically Collected Information',
                    intro: 'When you visit Vyomarr, certain non-personal data may be collected automatically, such as:',
                    items: ['Browser type and version', 'Device type', 'Pages visited and time spent', 'Referring website'],
                    note: 'This data is used for analytics and performance improvement only.'
                }
            ]
        },
        {
            number: '02',
            title: 'How We Use Your Information',
            content: [{ text: 'We use collected information to:' }],
            list: [
                'Provide and maintain our content and services',
                'Respond to inquiries and messages',
                'Improve website performance and user experience',
                'Understand audience interests and engagement'
            ],
            important: 'We do not sell, rent, or trade personal data.'
        },
        {
            number: '03',
            title: 'Cookies and Analytics',
            content: [{ text: 'Vyomarr may use cookies or similar technologies to:' }],
            list: ['Analyze traffic and usage patterns', 'Improve content relevance and site functionality'],
            note: 'You can control or disable cookies through your browser settings. Disabling cookies may affect some site features.'
        },
        {
            number: '04',
            title: 'Third-Party Services',
            content: [{ text: 'Vyomarr may use trusted third-party services for:' }],
            list: ['Website analytics', 'Content delivery', 'Embedded media (e.g., YouTube)'],
            note: 'These third parties have their own privacy policies. Vyomarr is not responsible for how external services handle your data.'
        },
        {
            number: '05',
            title: 'Data Security',
            content: [
                { text: 'We take reasonable measures to protect your information from unauthorized access, misuse, or disclosure. However, no method of online transmission or storage is 100% secure, and absolute security cannot be guaranteed.' }
            ]
        },
        {
            number: '06',
            title: "Children's Privacy",
            content: [
                { text: 'Vyomarr does not knowingly collect personal information from children under the age of 13. If you believe a child has provided personal data, please contact us so we can remove it.' }
            ]
        },
        {
            number: '07',
            title: 'Your Rights',
            content: [{ text: 'Depending on your location, you may have the right to:' }],
            list: ['Request access to your personal data', 'Request correction or deletion of your data', 'Withdraw consent where applicable'],
            note: 'Requests can be made by contacting us directly.'
        },
        {
            number: '08',
            title: 'Changes to This Privacy Policy',
            content: [
                { text: 'Vyomarr may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of the site indicates acceptance of the revised policy.' }
            ]
        }
    ]

    return (
        <>
            <div className="privacy-page">
                <div className="privacy-container">
                    <header className="page-header">
                        <h1>Privacy <span className="accent">Policy</span></h1>
                        <p>Vyomarr ("we", "our", or "us") values your privacy and is committed to protecting the personal information of users who visit and interact with our website and platforms.</p>
                        <div className="effective-date">EFFECTIVE DATE: December 2024</div>
                    </header>

                    <div className="policy-section">
                        {/* Intro Card */}
                        <article className="glass-card intro-card">
                            <p>This Privacy Policy explains how information is collected, used, and safeguarded when you access Vyomarr. By using our website or services, you agree to the practices described in this policy.</p>
                        </article>

                        {sections.map((section, idx) => (
                            <article key={idx} className="glass-card">
                                <div className="glass-card-header">
                                    <span className="section-number">{section.number}</span>
                                    <h3>{section.title}</h3>
                                </div>
                                {section.content.map((c, i) => <p key={i}>{c.text}</p>)}
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
                        <h3>Questions About Your Privacy?</h3>
                        <p>If you have questions or concerns about this Privacy Policy, you may contact us at:</p>
                        <p className="email">privacy@vyomarr.com</p>
                        <p className="website">Website: https://vyomarr.com</p>
                        <Link to="/contact" className="btn-glow">CONTACT US</Link>
                    </section>
                </div>
            </div>

            <style>{`
                .privacy-page { min-height: 100vh; }

                .privacy-container {
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

                .effective-date {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 24px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    font-family: var(--font-tech);
                    font-size: 0.85rem;
                    color: var(--color-mist-gray);
                    background: rgba(255, 255, 255, 0.03);
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
                    .privacy-container { padding: 100px 20px 60px; }
                    .page-header h1 { font-size: 2rem; }
                    .glass-card { padding: 24px; }
                    .glass-card-header { flex-direction: column; align-items: flex-start; gap: 10px; }
                }
            `}</style>
        </>
    )
}
