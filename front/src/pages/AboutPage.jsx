import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <main id="main" role="main">
      {/* HERO SECTION */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 id="hero-title">
                About <span className="text-accent">Vyomarr</span>
              </h1>
              <p className="lead">
                Vyomarr is an online platform built to connect people who are passionate about space,
                astronomy, aerospace engineering, physics, and the quantum world. We bring together readers,
                writers, learners, and thinkers who share an open-minded curiosity about the universe.
              </p>
              <div className="hero-buttons">
                <Link to="/community" className="btn-primary">Join Our Community</Link>
                <a href="#mission" className="btn-secondary">Learn More</a>
              </div>
              <p className="hero-subtitle">
                <span className="text-accent">✦</span>
                A central hub for space lovers and science enthusiasts
              </p>
            </div>
            <div className="hero-image">
              <div className="hero-image-wrapper glass-card" style={{ padding: 0 }}>
                <img src="/assets/images/about-hero.png" alt="Beautiful view of stars and nebula in space" loading="eager" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section" aria-labelledby="features-title">
        <div className="container">
          <div className="text-center">
            <h2 id="features-title" className="section-heading">
              What Vyomarr <span className="text-accent">Covers</span>
            </h2>
            <p style={{ color: 'var(--color-mist-gray)', maxWidth: '600px', margin: '24px auto 0' }}>
              High-quality content across multiple scientific domains, designed for curious minds
            </p>
          </div>
          <div className="features-grid">
            <div className="glass-card feature-card">
              <div className="feature-icon">🚀</div>
              <div className="feature-text">
                <h3>Space Exploration</h3>
                <p>Discover the latest in space missions, celestial phenomena, and cosmic wonders</p>
              </div>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon">🛰️</div>
              <div className="feature-text">
                <h3>Aerospace Engineering</h3>
                <p>The science behind rockets, satellites, and the technology of space travel</p>
              </div>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon">⚛️</div>
              <div className="feature-text">
                <h3>Physics & Quantum</h3>
                <p>From classical mechanics to quantum science and emerging technologies</p>
              </div>
            </div>
            <div className="glass-card feature-card">
              <div className="feature-icon">🌌</div>
              <div className="feature-text">
                <h3>Astronomy</h3>
                <p>Explore stars, galaxies, black holes, and the vast universe beyond</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="content-section" id="mission" aria-labelledby="mission-title">
        <div className="container">
          <div className="content-grid">
            <div className="content-image">
              <div className="content-image-wrapper glass-card" style={{ padding: 0 }}>
                <img src="/assets/images/about-mission.png" alt="Person exploring space concepts on computer" loading="lazy" />
              </div>
            </div>
            <div className="content-text">
              <h2 id="mission-title">Our <span className="text-accent">Mission</span></h2>
              <p>Our mission is to simplify complex scientific concepts and make advanced topics in space and
                science easy to understand for everyone—without compromising accuracy or depth.</p>
              <ul className="steps-list">
                <li className="step-item">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <h4>Easy to Follow</h4>
                    <p>We break down complex topics into digestible, step-by-step explanations</p>
                  </div>
                </li>
                <li className="step-item">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <h4>Conceptually Clear</h4>
                    <p>Building genuine understanding, not just surface-level information</p>
                  </div>
                </li>
                <li className="step-item">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <h4>Structured for Learning</h4>
                    <p>Content designed for exploration and progressive learning at your own pace</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="content-section" aria-labelledby="community-title">
        <div className="container">
          <div className="content-grid reverse">
            <div className="content-image">
              <div className="content-image-wrapper glass-card" style={{ padding: 0 }}>
                <img src="/assets/images/about-community.png" alt="Community collaboration and learning together" loading="lazy" />
              </div>
            </div>
            <div className="content-text">
              <h2 id="community-title">Learning Through <span className="text-accent">Community</span></h2>
              <p>Vyomarr is not just about publishing articles—it is about building a science-driven
                community. We actively engage with our audience across multiple platforms.</p>
              <ul className="steps-list">
                <li className="step-item">
                  <a href="https://www.youtube.com/@vyomarr" target="_blank" rel="noopener noreferrer"
                    className="step-number social-icon youtube">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <div className="step-content">
                    <h4>YouTube</h4>
                    <p>In-depth explanations and visual learning for complex topics</p>
                  </div>
                </li>
                <li className="step-item">
                  <a href="https://discord.gg/vyomarr" target="_blank" rel="noopener noreferrer"
                    className="step-number social-icon discord">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                  <div className="step-content">
                    <h4>Discord</h4>
                    <p>Community discussions and real-time conversations with enthusiasts</p>
                  </div>
                </li>
                <li className="step-item">
                  <a href="https://www.instagram.com/vyomarr/" target="_blank" rel="noopener noreferrer"
                    className="step-number social-icon instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </a>
                  <div className="step-content">
                    <h4>Instagram</h4>
                    <p>Short, engaging science content and visual stories</p>
                  </div>
                </li>
                <li className="step-item">
                  <a href="https://x.com/vyomarr" target="_blank" rel="noopener noreferrer"
                    className="step-number social-icon twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <div className="step-content">
                    <h4>X (Twitter)</h4>
                    <p>Updates, insights, and scientific conversations</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VISION SECTION */}
      <section className="vision-section" aria-labelledby="vision-title">
        <div className="container">
          <div className="vision-card glass-card">
            <h2 id="vision-title" className="section-heading">Our <span className="text-accent">Vision</span></h2>
            <blockquote>
              Vyomarr was founded to ensure that curiosity about the universe does not fade due to complexity
              or lack of guidance. We exist to make space and science understandable, engaging, and
              approachable for anyone willing to learn.
            </blockquote>
            <p className="author">— Vyomarr is where curiosity about the cosmos turns into understanding.</p>
          </div>
        </div>
      </section>

      <style>{`
                /* --- VYOMARR BRAND DESIGN SYSTEM VARIABLES --- */
                .text-center {
                    text-align: center;
                }

                /* Subheading Style */
                .section-heading {
                    display: inline-block;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--color-cosmic-white);
                    position: relative;
                    margin-bottom: 2rem;
                }

                .section-heading::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    bottom: -12px;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 3px;
                    background-color: var(--color-space-orange);
                    box-shadow: 0 0 10px var(--color-space-orange);
                    border-radius: 2px;
                    transition: width 0.3s ease;
                }

                .section-heading:hover::after {
                    width: 120px;
                }

                /* HERO SECTION */
                .hero-section {
                    min-height: 85vh;
                    display: flex;
                    align-items: center;
                    padding: 60px 0;
                    position: relative;
                }

                .hero-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }

                .hero-content h1 {
                    font-size: clamp(36px, 5vw, 56px);
                    line-height: 1.1;
                    margin-bottom: 24px;
                }

                .hero-content .lead {
                    font-size: clamp(16px, 2vw, 20px);
                    color: var(--color-mist-gray);
                    margin-bottom: 32px;
                    line-height: 1.7;
                }

                .hero-buttons {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                    margin-bottom: 24px;
                }

                .hero-subtitle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--color-mist-gray);
                    font-size: 14px;
                    font-family: var(--font-tech);
                    font-style: italic;
                }

                .hero-image-wrapper {
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                }

                .hero-image-wrapper img {
                    width: 100%;
                    aspect-ratio: 4/3;
                    object-fit: cover;
                    border-radius: 24px;
                }

                /* FEATURES SECTION */
                .features-section {
                    padding: 80px 0;
                }

                .features-section .features-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                    margin-top: 48px;
                }

                .features-section .feature-card {
                    text-align: center;
                    padding: 32px 24px;
                }

                .features-section .feature-icon {
                    width: 72px;
                    height: 72px;
                    margin: 0 auto 20px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    transition: all 0.3s ease;
                    animation: float 6s ease-in-out infinite;
                }

                .features-section .feature-card:nth-child(2) .feature-icon {
                    animation-delay: 1s;
                }

                .features-section .feature-card:nth-child(3) .feature-icon {
                    animation-delay: 2s;
                }

                .features-section .feature-card:nth-child(4) .feature-icon {
                    animation-delay: 3s;
                }

                .features-section .feature-card:hover .feature-icon {
                    transform: scale(1.1);
                    background: rgba(252, 76, 0, 0.2);
                }

                .features-section .feature-card h3 {
                    font-size: 18px;
                    margin-bottom: 12px;
                    color: var(--color-cosmic-white);
                }

                .features-section .feature-card p {
                    font-size: 14px;
                    color: var(--color-mist-gray);
                    line-height: 1.6;
                    margin: 0;
                }

                /* CONTENT SECTIONS */
                .content-section {
                    padding: 80px 0;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }

                .content-grid.reverse {
                    direction: rtl;
                }

                .content-grid.reverse > * {
                    direction: ltr;
                }

                .content-image-wrapper {
                    border-radius: 24px;
                    overflow: hidden;
                }

                .content-image-wrapper img {
                    width: 100%;
                    aspect-ratio: 4/3;
                    object-fit: cover;
                }

                .content-text h2 {
                    font-size: clamp(28px, 4vw, 40px);
                    margin-bottom: 20px;
                }

                .content-text > p {
                    color: var(--color-mist-gray);
                    font-size: 16px;
                    line-height: 1.7;
                    margin-bottom: 32px;
                }

                /* Steps List */
                .steps-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 32px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .step-item {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }

                .step-number {
                    width: 40px;
                    height: 40px;
                    min-width: 40px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, var(--color-space-orange), #ff6a2b);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    font-family: var(--font-heading);
                }

                .step-content h4 {
                    font-size: 16px;
                    margin-bottom: 4px;
                    color: var(--color-cosmic-white);
                }

                .step-content p {
                    font-size: 14px;
                    margin: 0;
                    color: var(--color-mist-gray);
                    line-height: 1.5;
                }

                /* Social Media Icons */
                .social-icon {
                    width: 44px;
                    height: 44px;
                    min-width: 44px;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    background: rgba(255, 255, 255, 0.1);
                }

                .social-icon svg {
                    width: 22px;
                    height: 22px;
                }

                .social-icon.youtube:hover {
                    background: linear-gradient(135deg, #FF0000, #CC0000);
                }

                .social-icon.discord:hover {
                    background: linear-gradient(135deg, #5865F2, #4752C4);
                }

                .social-icon.instagram:hover {
                    background: linear-gradient(135deg, #E1306C, #F77737, #FCAF45);
                }

                .social-icon.twitter:hover {
                    background: linear-gradient(135deg, #14171A, #1A1A1A);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .social-icon:hover {
                    transform: scale(1.1);
                }

                /* VISION SECTION */
                .vision-section {
                    padding: 80px 0;
                    text-align: center;
                }

                .vision-card {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 60px;
                }

                .vision-card blockquote {
                    font-size: clamp(18px, 2.5vw, 24px);
                    font-style: italic;
                    color: var(--color-cosmic-white);
                    line-height: 1.7;
                    margin-bottom: 24px;
                }

                .vision-card .author {
                    color: var(--color-space-orange);
                    font-weight: 600;
                    font-family: var(--font-heading);
                }

                /* Animations */
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .hero-grid,
                    .content-grid {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }

                    .hero-content {
                        text-align: center;
                    }

                    .hero-buttons {
                        justify-content: center;
                    }

                    .hero-subtitle {
                        justify-content: center;
                    }

                    .hero-image-wrapper {
                        max-width: 600px;
                        margin: 0 auto;
                    }

                    .features-section .features-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .content-grid.reverse {
                        direction: ltr;
                    }

                    .content-image-wrapper {
                        max-width: 600px;
                        margin: 0 auto;
                    }
                }

                @media (max-width: 640px) {
                    .section-heading {
                        font-size: 2rem;
                    }

                    .features-section .features-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .features-section .feature-card {
                        display: flex;
                        text-align: left;
                        gap: 16px;
                        padding: 20px;
                    }

                    .features-section .feature-icon {
                        width: 56px;
                        height: 56px;
                        min-width: 56px;
                        margin: 0;
                        font-size: 24px;
                    }

                    .features-section .feature-card .feature-text {
                        flex: 1;
                    }

                    .vision-card {
                        padding: 40px 24px;
                    }
                }
            `}</style>
    </main>
  )
}
