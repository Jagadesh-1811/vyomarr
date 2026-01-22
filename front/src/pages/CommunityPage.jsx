import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function CommunityPage() {
  const fadeRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    fadeRefs.current.forEach(el => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addToRefs = (el) => {
    if (el && !fadeRefs.current.includes(el)) {
      fadeRefs.current.push(el)
    }
  }

  return (
    <>
      {/* Hero Header Section */}
      <header className="community-hero">
        <h1>
          Join the <span className="text-accent">Vyomarr</span> Community
        </h1>
        <p>
          Connect with explorers, analyze theories, and dive deep into the cosmos across our platforms.
        </p>
      </header>

      <main className="community-main">
        {/* Community Channels Grid */}
        <section id="channels" className="channels-section">
          <div className="channels-container">
            {/* Top Row: 3 Cards */}
            <div className="channels-grid-top">
              {/* YouTube Card */}
              <div className="glass-card channel-card fade-in" ref={addToRefs}>
                <div className="card-header">
                  <div className="icon-container youtube">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <h2>YouTube</h2>
                </div>
                <p className="card-desc">
                  For Deep Visual Exploration. Immersive storytelling and visual breakdowns of complex cosmic phenomena.
                </p>
                <div className="data-box">
                  <h3>Expected_Data:</h3>
                  <ul>
                    <li><span>›</span> "What If..." visual explorations</li>
                    <li><span>›</span> Scientific paradoxes explained</li>
                    <li><span>›</span> Cinematic space storytelling</li>
                  </ul>
                </div>
                <a href="https://www.youtube.com/@vyomarr" target="_blank" rel="noopener noreferrer" className="btn-cosmic">
                  Subscribe on YouTube
                </a>
              </div>

              {/* Instagram Card */}
              <div className="glass-card channel-card fade-in" ref={addToRefs}>
                <div className="card-header">
                  <div className="icon-container instagram">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </div>
                  <h2>Instagram</h2>
                </div>
                <p className="card-desc">
                  For Quick Insights. Daily snapshots of cosmic curiosity, polls, and quick-fire facts for your feed.
                </p>
                <div className="data-box">
                  <h3>Expected_Data:</h3>
                  <ul>
                    <li><span>›</span> Visual theories & reels</li>
                    <li><span>›</span> Interactive story Q&As</li>
                    <li><span>›</span> Community art & prompts</li>
                  </ul>
                </div>
                <a href="https://www.instagram.com/vyomarr" target="_blank" rel="noopener noreferrer" className="btn-cosmic">
                  Follow on Instagram
                </a>
              </div>

              {/* Discord Card */}
              <div className="glass-card channel-card fade-in" ref={addToRefs}>
                <div className="card-header">
                  <div className="icon-container discord">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </div>
                  <h2>Discord</h2>
                </div>
                <p className="card-desc">
                  For Collaboration. The mission control center for real-time discussions, debates, and theory crafting.
                </p>
                <div className="data-box">
                  <h3>Expected_Data:</h3>
                  <ul>
                    <li><span>›</span> Live theory debates</li>
                    <li><span>›</span> Feedback on user findings</li>
                    <li><span>›</span> Exclusive puzzle events</li>
                  </ul>
                </div>
                <a href="https://discord.gg/vyomarr" target="_blank" rel="noopener noreferrer" className="btn-cosmic">
                  Join Discord Server
                </a>
              </div>
            </div>

            {/* Bottom Row: 2 Cards Centered */}
            <div className="channels-grid-bottom">
              {/* LinkedIn Card */}
              <div className="glass-card channel-card fade-in" ref={addToRefs}>
                <div className="card-header">
                  <div className="icon-container linkedin">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <h2>LinkedIn</h2>
                </div>
                <p className="card-desc">
                  For Vision & Insights. Follow founder Mohan Reddy Sai Govindu for the bigger picture behind Vyomarr.
                </p>
                <div className="data-box">
                  <h3>Expected_Data:</h3>
                  <ul>
                    <li><span>›</span> System design insights</li>
                    <li><span>›</span> Roadmap updates</li>
                    <li><span>›</span> Innovation discussions</li>
                  </ul>
                </div>
                <a href="https://www.linkedin.com/in/govindumohan/" target="_blank" rel="noopener noreferrer" className="btn-cosmic">
                  Connect on LinkedIn
                </a>
              </div>

              {/* X (Twitter) Card */}
              <div className="glass-card channel-card fade-in" ref={addToRefs}>
                <div className="card-header">
                  <div className="icon-container twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <h2>X (Twitter)</h2>
                </div>
                <p className="card-desc">
                  For Quick Updates. Real-time announcements, cosmic news threads, and community engagement.
                </p>
                <div className="data-box">
                  <h3>Expected_Data:</h3>
                  <ul>
                    <li><span>›</span> Breaking space news</li>
                    <li><span>›</span> Thought-provoking threads</li>
                    <li><span>›</span> Community polls & discussions</li>
                  </ul>
                </div>
                <a href="https://x.com/vyomarr" target="_blank" rel="noopener noreferrer" className="btn-cosmic">
                  Follow on X
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Protocol Selection Section */}
        <section className="protocol-section fade-in" ref={addToRefs}>
          <div className="protocol-container">
            <div className="protocol-header">
              <h2 className="page-heading">Protocol Selection</h2>
              <p>Choose your engagement frequency based on your exploration style</p>
            </div>

            <div className="glass-table">
              <table>
                <thead>
                  <tr>
                    <th>Your Engagement Style</th>
                    <th>Recommended Platform</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Visual Learner / Deep Watcher</td>
                    <td className="platform-cell">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="platform-icon youtube-icon">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      YouTube
                    </td>
                  </tr>
                  <tr>
                    <td>Daily Micro-Content Consumer</td>
                    <td className="platform-cell">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="platform-icon instagram-icon">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                      </svg>
                      Instagram
                    </td>
                  </tr>
                  <tr>
                    <td>Real-time Discussions & Debates</td>
                    <td className="platform-cell">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="platform-icon discord-icon">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      Discord
                    </td>
                  </tr>
                  <tr>
                    <td>Mission & Leadership Updates</td>
                    <td className="platform-cell">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="platform-icon linkedin-icon">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </td>
                  </tr>
                  <tr>
                    <td>Quick Updates & Hot Takes</td>
                    <td className="platform-cell">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="platform-icon twitter-icon">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      X (Twitter)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="protocol-cta">
              <p>
                If you're ready to begin, start with the one that resonates with how you explore ideas—and join
                the growing network of people who believe in the power of science and imagination.
              </p>
              <Link to="/login" className="btn-cosmic">
                Start Your Journey
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style>{`
                /* Hero Section */
                .community-hero {
                    max-width: 1024px;
                    margin: 0 auto;
                    padding: 96px 24px 64px;
                    text-align: center;
                }

                .community-hero h1 {
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 700;
                    margin-bottom: 24px;
                    letter-spacing: -0.5px;
                    line-height: 1.1;
                    color: var(--color-cosmic-white);
                }

                .community-hero p {
                    color: var(--color-mist-gray);
                    font-size: clamp(1rem, 2vw, 1.25rem);
                    font-weight: 300;
                    max-width: 640px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                /* Channels Section */
                .channels-section {
                    padding: 48px 0;
                }

                .channels-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 24px;
                }

                .channels-grid-top {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    margin-bottom: 24px;
                }

                .channels-grid-bottom {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 24px;
                    max-width: 896px;
                    margin: 0 auto;
                }

                @media (max-width: 1024px) {
                    .channels-grid-top {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .channels-grid-top,
                    .channels-grid-bottom {
                        grid-template-columns: 1fr;
                    }
                }

                /* Channel Card */
                .channel-card {
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .icon-container {
                    width: 56px;
                    height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 50%;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .icon-container .icon {
                    width: 28px;
                    height: 28px;
                }

                .icon-container.youtube .icon { color: #ef4444; }
                .icon-container.instagram .icon { color: #ec4899; }
                .icon-container.discord .icon { color: #818cf8; }
                .icon-container.linkedin .icon { color: #3b82f6; }
                .icon-container.twitter .icon { color: #fff; }

                .channel-card:hover .icon-container {
                    transform: scale(1.1) rotate(-5deg);
                }

                .channel-card:hover .icon-container.youtube { background: rgba(239, 68, 68, 0.2); }
                .channel-card:hover .icon-container.instagram { background: rgba(236, 72, 153, 0.2); }
                .channel-card:hover .icon-container.discord { background: rgba(129, 140, 248, 0.2); }
                .channel-card:hover .icon-container.linkedin { background: rgba(59, 130, 246, 0.2); }
                .channel-card:hover .icon-container.twitter { background: rgba(255, 255, 255, 0.1); }

                .card-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--color-cosmic-white);
                }

                .card-desc {
                    color: var(--color-mist-gray);
                    margin-bottom: 24px;
                    font-weight: 300;
                    line-height: 1.6;
                }

                /* Data Box */
                .data-box {
                    background: rgba(0, 11, 73, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 16px;
                    margin-bottom: 24px;
                }

                .data-box h3 {
                    font-family: var(--font-tech);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--color-space-orange);
                    margin-bottom: 12px;
                    font-weight: 600;
                }

                .data-box ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .data-box ul li {
                    font-size: 0.875rem;
                    color: var(--color-mist-gray);
                    padding: 4px 0;
                    display: flex;
                    align-items: flex-start;
                }

                .data-box ul li span {
                    color: var(--color-space-orange);
                    margin-right: 8px;
                    font-size: 0.75rem;
                }

                /* Button */
                .btn-cosmic {
                    display: block;
                    width: 100%;
                    text-align: center;
                    padding: 14px 24px;
                    border-radius: 999px;
                    background-color: var(--color-space-orange);
                    color: var(--color-cosmic-white);
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    text-decoration: none;
                    box-shadow: 0 0 15px rgba(252, 76, 0, 0.4);
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    margin-top: auto;
                }

                .btn-cosmic:hover {
                    background-color: #e04400;
                    box-shadow: 0 0 25px rgba(252, 76, 0, 0.6);
                    transform: translateY(-2px);
                }

                /* Protocol Section */
                .protocol-section {
                    padding: 64px 0;
                }

                .protocol-container {
                    max-width: 896px;
                    margin: 0 auto;
                    padding: 0 24px;
                }

                .protocol-header {
                    text-align: center;
                    margin-bottom: 48px;
                }

                .page-heading {
                    display: inline-block;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--color-cosmic-white);
                    position: relative;
                    margin-bottom: 2rem;
                }

                .page-heading::after {
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

                .page-heading:hover::after {
                    width: 120px;
                }

                .protocol-header p {
                    color: var(--color-mist-gray);
                    margin-top: 32px;
                }

                /* Glass Table */
                .glass-table {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                }

                .glass-table::before {
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
                    z-index: 1;
                }

                .glass-table table {
                    width: 100%;
                    text-align: left;
                    border-collapse: collapse;
                    position: relative;
                    z-index: 2;
                }

                .glass-table thead {
                    background: rgba(255, 255, 255, 0.05);
                }

                .glass-table th {
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: var(--color-space-orange);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .glass-table tbody tr {
                    transition: background-color 0.3s ease;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .glass-table tbody tr:last-child {
                    border-bottom: none;
                }

                .glass-table tbody tr:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                .glass-table td {
                    padding: 16px 24px;
                    color: var(--color-mist-gray);
                }

                .platform-cell {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    color: var(--color-cosmic-white) !important;
                }

                .platform-icon {
                    width: 16px;
                    height: 16px;
                }

                .youtube-icon { color: #ef4444; }
                .instagram-icon { color: #ec4899; }
                .discord-icon { color: #818cf8; }
                .linkedin-icon { color: #3b82f6; }
                .twitter-icon { color: #fff; }

                /* Protocol CTA */
                .protocol-cta {
                    margin-top: 56px;
                    text-align: center;
                    max-width: 640px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .protocol-cta p {
                    color: var(--color-mist-gray);
                    font-size: 1.125rem;
                    font-weight: 300;
                    line-height: 1.6;
                    margin-bottom: 32px;
                }

                .protocol-cta .btn-cosmic {
                    display: inline-block;
                    width: auto;
                    padding: 16px 40px;
                }

                /* Fade Animation */
                .fade-in {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .fade-in.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .fade-in:nth-child(1) { transition-delay: 0.1s; }
                .fade-in:nth-child(2) { transition-delay: 0.2s; }
                .fade-in:nth-child(3) { transition-delay: 0.3s; }
                .fade-in:nth-child(4) { transition-delay: 0.4s; }
            `}</style>
    </>
  )
}
