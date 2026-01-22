import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function HomePage() {
    const [spaceMysteries, setSpaceMysteries] = useState([])
    const [whatIfScenarios, setWhatIfScenarios] = useState([])
    const [recentSubmissions, setRecentSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [heroConfig, setHeroConfig] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Site Config (start independently)
                const configPromise = fetch(`${API_URL}/api/config/home_hero`)
                    .then(res => res.json())
                    .then(json => {
                        if (json.data) setHeroConfig(json.data)
                    })
                    .catch(err => console.error('Error fetching config:', err));

                let fetchedMysteries = []
                let fetchedWhatIf = []

                // Fetch and Sort Space Mysteries (Trending by Views)
                const mysteriesRes = await fetch(`${API_URL}/api/spacemysteries`)
                if (mysteriesRes.ok) {
                    fetchedMysteries = await mysteriesRes.json()
                    // Sort by views descending (Trending)
                    const trendingMysteries = [...fetchedMysteries].sort((a, b) => (b.views || 0) - (a.views || 0))
                    setSpaceMysteries(trendingMysteries.slice(0, 4))
                }

                // Fetch and Sort What If scenarios (Popular by Votes)
                const whatIfRes = await fetch(`${API_URL}/api/whatif`)
                if (whatIfRes.ok) {
                    fetchedWhatIf = await whatIfRes.json()
                    // Sort by votes descending (Popular)
                    const popularWhatIf = [...fetchedWhatIf].sort((a, b) => (b.votes || 0) - (a.votes || 0))
                    setWhatIfScenarios(popularWhatIf.slice(0, 4))
                }

                // Combine for recent submissions (latest from both)
                const allSubmissions = []

                // Add space mysteries to recent
                fetchedMysteries.forEach(m => {
                    allSubmissions.push({
                        id: m._id,
                        title: m.title,
                        description: m.description,
                        author: m.author || 'Vyomarr Team',
                        createdAt: m.createdAt,
                        type: 'mystery',
                        color: '#fc4c00'
                    })
                })

                // Add what if to recent
                fetchedWhatIf.forEach(w => {
                    allSubmissions.push({
                        id: w._id,
                        title: w.title,
                        description: w.description,
                        author: w.authorName || 'Anonymous',
                        createdAt: w.createdAt,
                        type: 'whatif',
                        color: '#a855f7'
                    })
                })

                // Sort by date and take top 4
                allSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                setRecentSubmissions(allSubmissions.slice(0, 4))

                // Wait for config as well (optional, but keeps logic grouped)
                await configPromise;

            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Helper function for relative time
    const getRelativeTime = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffHours < 1) return 'Just now'
        if (diffHours < 24) return `${diffHours} hours ago`
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString()
    }

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Prepare slides from config (normalize data structure)
    const slides = heroConfig.slides && heroConfig.slides.length > 0
        ? heroConfig.slides
        : (heroConfig.heading ? [heroConfig] : []); // Fallback to single edited or empty

    const hasSlides = slides.length > 0;

    // Default fallback if no slides at all
    const activeSlide = hasSlides ? slides[currentSlideIndex] : {
        heading: null, // Signals to use hardcoded default
        subHeading: null,
        primaryButtonText: "Discover Mysteries",
        primaryButtonLink: "/space-mysteries",
        secondaryButtonText: "Explore What If",
        secondaryButtonLink: "/what-if",
        backgroundImageUrl: "/assets/images/hero-banner.png"
    };

    // Auto-scroll effect
    useEffect(() => {
        if (!hasSlides || slides.length <= 1 || isHovered) return;

        const interval = setInterval(() => {
            setCurrentSlideIndex(prev => (prev + 1) % slides.length);
        }, 7000); // 7 seconds per slide

        return () => clearInterval(interval);
    }, [hasSlides, slides.length, isHovered]);

    // Manual navigation
    const nextSlide = () => setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length);

    // Fallback placeholder image
    const getImageUrl = (item) => {
        if (item?.imageUrl) return item.imageUrl
        if (item?.image) return item.image
        // Fallback images based on category
        return 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80'
    }

    return (
        <>
            {/* HERO SECTION */}
            <section
                className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{ marginTop: '-80px', paddingTop: '80px' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >

                {/* Background Pattern */}
                <div className="absolute inset-0 z-0" style={{ background: 'var(--color-deep-space)' }}></div>

                <div className="relative z-10 w-full h-screen text-center">
                    <div className="relative w-full h-full">
                        <div className="relative overflow-hidden h-full">

                            {/* Background Image with Transition */}
                            <img
                                key={currentSlideIndex} // Triggers animation on change
                                src={activeSlide.backgroundImageUrl || "/assets/images/hero-banner.png"}
                                alt="Hero Banner"
                                className="w-full h-full object-cover animate-fade-in"
                                style={{
                                    transform: 'scale(1.5)',
                                    transformOrigin: 'center center',
                                    animation: 'fadeIn 1s ease-in-out'
                                }}
                            />

                            {/* Styles for animation */}
                            <style>{`
                                @keyframes fadeIn {
                                    from { opacity: 0.5; transform: scale(1.6); }
                                    to { opacity: 1; transform: scale(1.5); }
                                }
                            `}</style>

                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--color-deep-space) 0%, var(--color-deep-space) 5%, rgba(0,11,73,0.7) 30%, transparent 70%)' }}></div>

                            <div
                                className="absolute inset-0 flex flex-col items-center justify-center p-8"
                                style={{
                                    alignItems: activeSlide.alignment === 'left' ? 'flex-start' : activeSlide.alignment === 'right' ? 'flex-end' : 'center',
                                    textAlign: activeSlide.alignment || 'center',
                                    paddingLeft: activeSlide.alignment === 'left' ? '10%' : '2rem',
                                    paddingRight: activeSlide.alignment === 'right' ? '10%' : '2rem',
                                }}
                            >
                                <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance animate-slide-up">
                                    {activeSlide.heading ? activeSlide.heading : (
                                        <>Explore the <span className="text-accent">Infinite</span> Mysteries
                                            <span className="text-accent"> of Space</span></>
                                    )}
                                </h1>

                                <p className="text-lg md:text-xl mb-8 max-w-2xl text-balance animate-slide-up"
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                        color: 'rgba(255,255,255,0.9)',
                                        animationDelay: '0.2s',
                                        margin: activeSlide.alignment === 'left' || activeSlide.alignment === 'right' ? '0 0 32px 0' : '0 auto 32px auto'
                                    }}>
                                    {activeSlide.subHeading || "Dive into cosmic puzzles, unravel space mysteries, and connect with fellow explorers in the ultimate space discovery platform."}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                    <Link to={activeSlide.primaryButtonLink || "/space-mysteries"} className="btn-primary">
                                        {activeSlide.primaryButtonText || "Discover Mysteries"}
                                    </Link>
                                    <Link to={activeSlide.secondaryButtonLink || "/what-if"} className="btn-secondary">
                                        {activeSlide.secondaryButtonText || "Explore What If"}
                                    </Link>
                                </div>
                            </div>

                            {/* Carousel Controls */}
                            {hasSlides && slides.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
                                        style={{ backdropFilter: 'blur(4px)' }}
                                    >
                                        ❮
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
                                        style={{ backdropFilter: 'blur(4px)' }}
                                    >
                                        ❯
                                    </button>

                                    {/* Dots */}
                                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                                        {slides.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentSlideIndex(idx)}
                                                style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    background: idx === currentSlideIndex ? 'var(--color-space-orange)' : 'rgba(255,255,255,0.3)',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED DISCOVERIES / SPACE MYSTERIES */}
            <section className="discoveries-section" style={{ padding: '80px 0' }}>
                <div className="section-header">
                    <h2 className="section-title">Featured Discoveries</h2>
                    <p className="section-desc">
                        Explore our most captivating mysteries and cosmic enigmas from the database.
                    </p>
                </div>

                <div className="discoveries-grid">
                    {loading ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--color-mist-gray)' }}>
                            Loading discoveries...
                        </div>
                    ) : spaceMysteries.length > 0 ? (
                        spaceMysteries.map((mystery) => (
                            <Link key={mystery._id} to={`/article/${mystery._id}?type=mystery`} style={{ textDecoration: 'none' }}>
                                <article className="discovery-card">
                                    <img src={getImageUrl(mystery)} alt={mystery.title} />
                                    <div className="card-category">{mystery.categoryLabel || mystery.category || 'MYSTERY'}</div>
                                    <h3>{mystery.title}</h3>
                                    <p>{mystery.description?.substring(0, 100)}...</p>
                                    <div className="card-meta">
                                        <span>{mystery.views || 0} views</span>
                                        <span>{mystery.readTime || '5 min read'}</span>
                                    </div>
                                    <div className="read-more">Read More →</div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        // No content message
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 40px', color: 'var(--color-mist-gray)' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No mysteries found yet</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Check back soon for cosmic discoveries!</p>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link to="/space-mysteries" className="btn-primary">Explore More Mysteries</Link>
                </div>
            </section>

            {/* WHAT IF SECTION */}
            <section className="discoveries-section" style={{ padding: '80px 0' }}>
                <div className="section-header">
                    <h2 className="section-title">What If Scenarios</h2>
                    <p className="section-desc">
                        Explore thought-provoking hypothetical scenarios about our universe and beyond.
                    </p>
                </div>

                <div className="discoveries-grid">
                    {loading ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--color-mist-gray)' }}>
                            Loading scenarios...
                        </div>
                    ) : whatIfScenarios.length > 0 ? (
                        whatIfScenarios.map((scenario) => (
                            <Link key={scenario._id} to={`/article/${scenario._id}?type=whatif`} style={{ textDecoration: 'none' }}>
                                <article className="discovery-card">
                                    <img src={getImageUrl(scenario)} alt={scenario.title} />
                                    <div className="card-category">{scenario.category || 'WHAT IF'}</div>
                                    <h3>{scenario.title}</h3>
                                    <p>{scenario.description?.substring(0, 100)}...</p>
                                    <div className="card-meta">
                                        <span>{scenario.authorName || 'Anonymous'}</span>
                                        <span>{scenario.views || 0} views</span>
                                    </div>
                                    <div className="read-more">Read More →</div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        // No content message
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 40px', color: 'var(--color-mist-gray)' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No What If scenarios found yet</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Be the first to share your cosmic hypothesis!</p>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link to="/what-if" className="btn-primary">Explore More Scenarios</Link>
                </div>
            </section>

            {/* COMMUNITY HIGHLIGHTS / RECENT SUBMISSIONS */}
            <section className="discoveries-section" style={{ padding: '80px 0' }}>
                <div className="section-header">
                    <h2 className="section-title">Community Highlights</h2>
                    <p className="section-desc">
                        Discover trending discussions and recent submissions from our community of space explorers.
                    </p>
                </div>

                <div className="submissions-card"
                    style={{
                        background: 'rgba(30, 35, 55, 0.4)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '32px',
                        padding: '40px',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <span className="text-accent">✦</span> Recent Submissions
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-mist-gray)' }}>
                            Loading recent submissions...
                        </div>
                    ) : recentSubmissions.length > 0 ? (
                        recentSubmissions.map((submission, index) => (
                            <Link
                                to={`/article/${submission.id}?type=${submission.type}`}
                                key={submission.id || index}
                                className="submission-item"
                                style={{
                                    padding: '20px',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '16px',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    gap: '16px',
                                    textDecoration: 'none'
                                }}
                            >
                                <div className="submission-bar" style={{ width: '4px', borderRadius: '4px', flexShrink: 0, background: submission.color }}></div>
                                <div className="submission-content">
                                    <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--color-cosmic-white)' }}>{submission.title}</h4>
                                    <p style={{ fontFamily: 'var(--font-tech)', fontSize: '0.75rem', marginBottom: '8px', color: submission.color }}>Submitted by {submission.author}</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-mist-gray)', lineHeight: '1.6', marginBottom: '8px' }}>
                                        {submission.description?.substring(0, 150)}...
                                    </p>
                                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.7rem', color: 'var(--color-mist-gray)', opacity: '0.6' }}>{getRelativeTime(submission.createdAt)}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        // Fallback static content
                        <>
                            <div className="submission-item" style={{
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '16px',
                                marginBottom: '16px',
                                display: 'flex',
                                gap: '16px'
                            }}>
                                <div className="submission-bar" style={{ width: '4px', borderRadius: '4px', flexShrink: 0, background: 'var(--color-space-orange)' }}></div>
                                <div className="submission-content">
                                    <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--color-cosmic-white)' }}>No submissions yet</h4>
                                    <p style={{ fontFamily: 'var(--font-tech)', fontSize: '0.75rem', marginBottom: '8px', color: 'var(--color-space-orange)' }}>Be the first to contribute!</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--color-mist-gray)', lineHeight: '1.6', marginBottom: '8px' }}>
                                        Submit a What If theory or explore our space mysteries to get started.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* ABOUT VYOMARR SECTION */}
            <section className="discoveries-section" style={{ padding: '80px 0' }}>
                <div className="section-header">
                    <h2 className="section-title">About Vyomarr</h2>
                    <p className="section-desc">
                        Your gateway to understanding the cosmos through high-quality content across multiple scientific domains.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card discovery-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Space Exploration</h3>
                        <p>Discover the latest in space missions, celestial phenomena, and cosmic wonders.</p>
                        <Link to="/space-mysteries" className="feature-link">Learn more →</Link>
                    </div>
                    <div className="feature-card discovery-card">
                        <div className="feature-icon">🛰️</div>
                        <h3>Aerospace Engineering</h3>
                        <p>The science behind rockets, satellites, and the technology of space travel.</p>
                        <Link to="#" className="feature-link">Learn more →</Link>
                    </div>
                    <div className="feature-card discovery-card">
                        <div className="feature-icon">⚛️</div>
                        <h3>Physics & Quantum</h3>
                        <p>From classical mechanics to quantum science and emerging technologies.</p>
                        <Link to="#" className="feature-link">Learn more →</Link>
                    </div>
                    <div className="feature-card discovery-card">
                        <div className="feature-icon">🌌</div>
                        <h3>Astronomy</h3>
                        <p>Explore stars, galaxies, black holes, and the vast universe beyond.</p>
                        <Link to="#" className="feature-link">Learn more →</Link>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link to="/about" className="btn-primary">Learn More About Us</Link>
                </div>
            </section>

            {/* CREW SECTION */}
            <section className="discoveries-section" style={{ padding: '80px 0' }}>
                <div className="section-header">
                    <h2 className="section-title">The Vyomarr Team</h2>
                    <p className="section-desc">
                        A passionate team dedicated to making space exploration accessible to everyone.
                    </p>
                </div>

                <div className="crew-grid">
                    <div className="crew-card discovery-card">
                        <div className="crew-avatar crew-icon">
                            VT
                        </div>
                        <h4>Content Team</h4>
                        <p className="role">Research & Writing</p>
                        <p className="crew-desc">Creating engaging content about cosmic mysteries and space science.</p>
                        <div className="social-links">
                            <a href="mailto:content@vyomarr.com" className="social-icon" title="Email">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </a>
                            <a href="https://linkedin.com/company/vyomarr" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="crew-card discovery-card">
                        <div className="crew-avatar crew-icon">
                            <img src="" alt="" />
                        </div>
                        <h4>Development Team</h4>
                        <p className="role">FULL STACK DEVELOPER</p>
                        <p className="crew-desc">Building the platform to bring space exploration to your screen.</p>
                        <div className="social-links">
                            <a href="mailto:dev@vyomarr.com" className="social-icon" title="Email">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </a>
                            <a href="https://linkedin.com/company/vyomarr" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="crew-card discovery-card">
                        <div className="crew-avatar crew-icon">
                            VT
                        </div>
                        <h4>Design Team</h4>
                        <p className="role">Visual Experience</p>
                        <p className="crew-desc">Crafting beautiful, immersive experiences for our community.</p>
                        <div className="social-links">
                            <a href="mailto:design@vyomarr.com" className="social-icon" title="Email">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </a>
                            <a href="https://linkedin.com/company/vyomarr" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="cta-section" style={{ padding: '60px 0' }}>
                <div className="cta-banner">
                    <h3>Let's Explore the <span className="text-accent">Cosmos</span> Together</h3>
                    <Link to="/community" className="btn-primary">Join Our Community</Link>
                </div>
            </section>

            <style>{`
                .cta-banner {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(0, 11, 73, 0.9));
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 60px 40px;
                    text-align: center;
                    max-width: 1280px;
                    margin: 0 auto;
                }
                
                .cta-banner h3 {
                    font-size: clamp(24px, 4vw, 36px);
                    margin-bottom: 24px;
                    color: var(--color-cosmic-white);
                }

                /* Crew Section Styles */
                .crew-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 32px;
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 0 24px;
                }

                .crew-card {
                    text-align: center;
                    padding: 32px 24px;
                }

                .crew-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin: 0 auto 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid var(--color-space-orange);
                    overflow: hidden;
                }

                .crew-avatar.crew-icon {
                    background: linear-gradient(135deg, var(--color-space-orange), #ff6a2b);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 4px 20px rgba(252, 76, 0, 0.4);
                }

                .crew-card h4 {
                    font-size: 1rem;
                    margin-bottom: 4px;
                    color: var(--color-cosmic-white);
                }

                .crew-card .role {
                    font-size: 0.85rem;
                    color: var(--color-space-orange);
                    margin-bottom: 8px;
                    font-weight: 500;
                }

                .crew-card .crew-desc {
                    font-size: 0.85rem;
                    color: var(--color-mist-gray);
                    line-height: 1.5;
                }

                .crew-socials, .social-links {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    margin-top: 16px;
                }

                .crew-socials a, .social-links .social-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-mist-gray);
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .crew-socials a:hover, .social-links .social-icon:hover {
                    background: var(--color-space-orange);
                    border-color: var(--color-space-orange);
                    color: white;
                    transform: scale(1.1);
                }

                @media (max-width: 1024px) {
                    .crew-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 640px) {
                    .crew-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    )
}
