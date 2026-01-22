import { Link } from 'react-router-dom'

export default function PolicyPage() {
    const sections = [
        {
            number: '01',
            title: 'Introduction',
            content: [
                'Vyomarr Space Explorer ("we" or "us" or "Company") operates the https://www.vyomarr.com website (hereinafter referred to as "Service").',
                'Our Privacy Policy governs your visit to https://www.vyomarr.com and explains how we collect, safeguard, and disclose information that results from your use of our Service.'
            ]
        },
        {
            number: '02',
            title: 'Information Collection and Use',
            content: ['We collect information about you when you provide it to us and when third parties provide us with information about you. Here are the types of information we may collect:'],
            list: [
                '<strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us.',
                '<strong>Derivative Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your Uniform Resource Locator (URL) referrer, and the dates and times of your Service access.',
                '<strong>Financial Data:</strong> Financial information, such as data related to your payment method (valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services.'
            ]
        },
        {
            number: '03',
            title: 'Use of Your Information',
            content: ['Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:'],
            list: [
                'Generate a personal profile about you so that future visits to the Service will be personalized as possible.',
                'Increase the efficiency and operation of the Service.',
                'Monitor and analyze usage and trends to improve your experience with the Service.',
                'Notify you of updates to the Service.',
                'Offer new products, services, and/or recommendations to you.'
            ]
        },
        {
            number: '04',
            title: 'Disclosure of Your Information',
            content: ['We may share information we have collected about you in certain situations:'],
            list: [
                '<strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary to comply with the law.',
                '<strong>Third-Party Service Providers:</strong> We may share your information with parties who provide services for us, including payment processors, data analysis providers, email delivery services, customer service, and our marketing associates.',
                '<strong>Business Transfers:</strong> If Company is involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.'
            ]
        },
        {
            number: '05',
            title: 'Security of Your Information',
            content: [
                'We use administrative, technical, and physical security measures to protect your personal information. However, despite our safeguards, nothing is completely secure.'
            ]
        }
    ]

    return (
        <>
            <div className="policy-page">
                <div className="policy-container">
                    {/* Page Header */}
                    <header className="page-header">
                        <h1>Privacy <span className="accent">Policy</span></h1>
                        <p>How we collect, protect, and use your information when you explore the cosmos with Vyomarr.</p>
                        <div className="last-updated">LAST UPDATED: 2025-08-14</div>
                    </header>

                    {/* Policy Sections */}
                    <div className="policy-section">
                        {sections.map((section, index) => (
                            <article key={index} className="glass-card">
                                <div className="glass-card-header">
                                    <span className="section-number">{section.number}</span>
                                    <h3>{section.title}</h3>
                                </div>
                                {section.content.map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                                {section.list && (
                                    <ul>
                                        {section.list.map((item, i) => (
                                            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                )}
                            </article>
                        ))}
                    </div>

                    {/* Contact Section */}
                    <section className="contact-container">
                        <h3>Questions About Your Privacy?</h3>
                        <p>Our team is available to clarify any aspect of our privacy practices.</p>
                        <p className="email">privacy@vyomarr.com</p>
                        <Link to="/contact" className="btn-glow">CONTACT SUPPORT</Link>
                        <p className="response-note">Response time: 24-48 hours</p>
                    </section>
                </div>
            </div>

            <style>{`
                .policy-page {
                    min-height: 100vh;
                }

                .policy-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 120px 20px 80px;
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
                    color: var(--color-cosmic-white);
                }

                .page-header .accent {
                    color: var(--color-space-orange);
                }

                .page-header > p {
                    color: var(--color-mist-gray);
                    font-size: 1.1rem;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .last-updated {
                    display: inline-block;
                    margin-top: 15px;
                    padding: 8px 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    font-family: var(--font-tech);
                    font-style: italic;
                    font-size: 0.85rem;
                    color: var(--color-mist-gray);
                    background: rgba(255, 255, 255, 0.03);
                }

                /* Policy Sections */
                .policy-section {
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

                .glass-card li:last-child {
                    border-bottom: none;
                }

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

                .glass-card li strong {
                    color: var(--color-cosmic-white);
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
                    margin-bottom: 15px;
                }

                .contact-container p {
                    color: var(--color-mist-gray);
                    margin-bottom: 10px;
                }

                .email {
                    font-family: var(--font-tech);
                    color: var(--color-space-orange) !important;
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
                }

                .btn-glow:hover {
                    transform: translateY(-3px);
                }

                .response-note {
                    margin-top: 15px;
                    font-size: 0.8rem;
                    font-family: var(--font-tech);
                    font-style: italic;
                }

                @media (max-width: 768px) {
                    .policy-container {
                        padding: 100px 20px 60px;
                    }
                    .page-header h1 {
                        font-size: 2rem;
                    }
                    .glass-card {
                        padding: 24px;
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
