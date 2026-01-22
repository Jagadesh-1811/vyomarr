import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Helper function to strip HTML tags from text for clean display
const stripHtmlTags = (html) => {
    if (!html) return '';
    // Remove HTML tags and decode common HTML entities
    return html
        .replace(/<[^>]*>/g, ' ')  // Remove all HTML tags
        .replace(/&nbsp;/g, ' ')   // Replace non-breaking spaces
        .replace(/&amp;/g, '&')    // Replace ampersand
        .replace(/&lt;/g, '<')     // Replace less than
        .replace(/&gt;/g, '>')     // Replace greater than
        .replace(/&quot;/g, '"')   // Replace quotes
        .replace(/\s+/g, ' ')      // Collapse multiple spaces
        .trim();
};

const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'relativity', label: 'Relativity' },
    { key: 'aerospace', label: 'Aerospace' },
    { key: 'propulsion', label: 'Propulsion' },
    { key: 'colonization', label: 'Colonization' },
    { key: 'altphysics', label: 'AltPhysics' },
    { key: 'quantum', label: 'Quantum' },
    { key: 'ai', label: 'AI' },
    { key: 'evolution', label: 'Evolution' },
    { key: 'megastructures', label: 'Megastructures' },
    { key: 'multiverse', label: 'Multiverse' }
]

export default function SpaceMysteriesPage() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mysteries, setMysteries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch published mysteries from API
    useEffect(() => {
        const fetchMysteries = async () => {
            try {
                setLoading(true)
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
                const response = await fetch(`${API_URL}/api/spacemysteries`)

                if (!response.ok) {
                    throw new Error('Failed to fetch mysteries')
                }

                const data = await response.json()

                // Transform API data to match component format
                const transformed = data.map(mystery => ({
                    id: mystery._id,
                    title: mystery.title,
                    subHeading: mystery.subHeading || '',
                    category: mystery.category,
                    categoryLabel: mystery.categoryLabel || mystery.category.toUpperCase(),
                    description: mystery.description,
                    image: mystery.imageUrl || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
                    author: mystery.author || 'Vyomarr Team',
                    date: new Date(mystery.createdAt).toLocaleDateString(),
                    readTime: mystery.readTime || '5 min read'
                }))

                setMysteries(transformed)
                setError(null)
            } catch (err) {
                console.error('Error fetching mysteries:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMysteries()
    }, [])

    const filteredMysteries = activeFilter === 'all'
        ? mysteries
        : mysteries.filter(m => m.category === activeFilter)

    const handleFilterClick = (filter) => {
        setActiveFilter(filter)
        setDropdownOpen(false)
    }

    return (
        <>
            {/* Gentle Pulsing Glow Background */}
            <div className="glow-bg"></div>

            <div className="mysteries-container">
                <header className="page-header">
                    <h1>Cosmic <span className="accent">Mysteries</span></h1>
                    <p>The unexplained phenomena of the deep universe.</p>
                </header>

                {/* Filter Tabs */}
                <div className="filter-tabs-wrapper">
                    <div className="filter-tabs">
                        {filterTabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
                                onClick={() => handleFilterClick(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mystery-grid">
                    {filteredMysteries.length === 0 ? (
                        <div className="no-articles">
                            <h3>No articles found in this category</h3>
                            <p>We haven't published any {activeFilter !== 'all' ? filterTabs.find(t => t.key === activeFilter)?.label : ''} articles yet. Check back soon or explore other categories!</p>
                        </div>
                    ) : (
                        filteredMysteries.map(mystery => (
                            <Link to={`/article/${mystery.id}?type=mystery`} key={mystery.id} className="card-link" style={{ textDecoration: 'none' }}>
                                <article className="mystery-card" data-category={mystery.category}>
                                    <img src={mystery.image} alt={mystery.title} className="card-image" />
                                    <div className="card-category">{mystery.categoryLabel}</div>
                                    <h3>{mystery.title}</h3>
                                    {mystery.subHeading && (
                                        <p className="card-subtitle">{mystery.subHeading}</p>
                                    )}
                                    <p>{stripHtmlTags(mystery.description)}</p>
                                    <div className="card-meta">
                                        <span>{mystery.author}</span>
                                        <span>{mystery.date}</span>
                                        <span>{mystery.readTime}</span>
                                    </div>
                                    <span className="read-more">Read Article →</span>
                                </article>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                /* Fullscreen Glow Background */
                .glow-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: -2;
                    background: radial-gradient(ellipse at 50% 50%,
                            rgba(0, 50, 120, 0.15) 0%,
                            rgba(0, 11, 73, 0) 50%);
                    animation: pulseGlow 8s ease-in-out infinite;
                }

                @keyframes pulseGlow {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.6;
                        transform: scale(1.1);
                    }
                }

                .mysteries-container {
                    max-width: 1600px;
                    margin: 120px auto 120px auto;
                    padding: 0 60px;
                    position: relative;
                    z-index: 10;
                }

                /* Page Header */
                .page-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .page-header h1 {
                    font-size: 3.5rem;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    text-shadow: 0 0 20px rgba(0, 11, 73, 0.8);
                    color: var(--color-cosmic-white);
                }

                .page-header p {
                    font-size: 1.2rem;
                    color: var(--color-mist-gray);
                }

                .page-header .accent {
                    color: var(--color-space-orange);
                }

                /* Filter Tabs */
                .filter-tabs-wrapper {
                    position: relative;
                    margin-bottom: 40px;
                    z-index: 50;
                }

                .filter-tabs {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 8px;
                    padding: 16px 24px;
                    background: rgba(0, 11, 73, 0.6);
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    flex-wrap: nowrap;
                    position: relative;
                }

                .filter-tabs::-webkit-scrollbar {
                    display: none;
                }

                .filter-tab {
                    background: transparent;
                    border: none;
                    color: var(--color-mist-gray);
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-family: var(--font-heading);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .filter-tab::after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%) scaleX(0);
                    width: 60%;
                    height: 2px;
                    background: var(--color-space-orange);
                    border-radius: 2px;
                    transition: transform 0.3s ease;
                }

                .filter-tab:hover {
                    color: var(--color-cosmic-white);
                    background: rgba(255, 255, 255, 0.05);
                }

                .filter-tab.active {
                    color: var(--color-space-orange);
                    background: rgba(252, 76, 0, 0.1);
                }

                .filter-tab.active::after {
                    transform: translateX(-50%) scaleX(1);
                }

                /* More Dropdown */
                .more-dropdown {
                    position: relative;
                    flex-shrink: 0;
                }

                .more-btn {
                    background: transparent;
                    border: none;
                    color: var(--color-mist-gray);
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-family: var(--font-heading);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .more-btn:hover {
                    color: var(--color-cosmic-white);
                    background: rgba(255, 255, 255, 0.05);
                }

                .more-btn svg {
                    width: 16px;
                    height: 16px;
                    transition: transform 0.3s ease;
                }

                .more-dropdown.open .more-btn svg {
                    transform: rotate(180deg);
                }

                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 8px;
                    background: rgba(0, 11, 73, 0.98);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    padding: 8px;
                    min-width: 180px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    z-index: 9999;
                    backdrop-filter: blur(20px);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .more-dropdown.open .dropdown-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-item {
                    display: block;
                    width: 100%;
                    background: transparent;
                    border: none;
                    color: var(--color-mist-gray);
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-family: var(--font-heading);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s ease;
                }

                .dropdown-item:hover {
                    color: var(--color-cosmic-white);
                    background: rgba(255, 255, 255, 0.08);
                }

                .dropdown-item.active {
                    color: var(--color-space-orange);
                    background: rgba(252, 76, 0, 0.1);
                }

                /* Grid Layout */
                .mystery-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 30px;
                }

                /* No Articles Empty State */
                .no-articles {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 80px 40px;
                    background: rgba(30, 35, 55, 0.4);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 32px;
                }

                .no-articles-icon {
                    font-size: 4rem;
                    margin-bottom: 24px;
                    opacity: 0.8;
                }

                .no-articles h3 {
                    font-size: 1.5rem;
                    color: var(--color-cosmic-white);
                    margin-bottom: 12px;
                }

                .no-articles p {
                    color: var(--color-mist-gray);
                    font-size: 1rem;
                    max-width: 400px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                /* Card Link Wrapper */
                .card-link {
                    display: block;
                    height: 100%;
                    cursor: pointer;
                }

                /* Mystery Card */
                .mystery-card {
                    background: rgba(30, 35, 55, 0.4);
                    backdrop-filter: blur(24px) saturate(120%);
                    -webkit-backdrop-filter: blur(24px) saturate(120%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 32px;
                    padding: 16px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    transition: all 0.3s ease;
                    height: 100%;
                }

                .mystery-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                    opacity: 0.03;
                    pointer-events: none;
                    border-radius: 32px;
                    z-index: 1;
                }

                .mystery-card > * {
                    position: relative;
                    z-index: 2;
                }

                .mystery-card:hover {
                    background: rgba(40, 45, 70, 0.5);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-8px);
                }

                .card-image {
                    width: 100%;
                    height: 220px !important;
                    object-fit: cover;
                    border-radius: 24px;
                    margin-bottom: 20px;
                }

                .mystery-card .card-category {
                    font-family: var(--font-heading);
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--color-mist-gray);
                    margin-bottom: 8px;
                    font-weight: 700;
                    opacity: 0.8;
                    align-self: flex-start;
                }

                .mystery-card h3 {
                    font-size: 1.35rem;
                    margin-bottom: 8px;
                    color: var(--color-cosmic-white);
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .mystery-card .card-subtitle {
                    font-family: var(--font-body);
                    font-size: 0.9rem;
                    margin-bottom: 12px;
                    color: var(--color-space-orange);
                    font-style: italic;
                    font-weight: 500;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .mystery-card p {
                    font-size: 0.95rem;
                    margin-bottom: 24px;
                    line-height: 1.6;
                    color: var(--color-mist-gray);
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    flex-grow: 1;
                }

                .mystery-card .card-meta {
                    font-family: var(--font-body);
                    font-size: 0.8rem;
                    color: var(--color-mist-gray);
                    margin-top: auto;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    padding-top: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    opacity: 0.8;
                    width: 100%;
                }

                .mystery-card .card-meta span::after {
                    content: "•";
                    display: inline-block;
                    margin-left: 6px;
                    opacity: 0.5;
                }

                .mystery-card .card-meta span:last-child::after {
                    display: none;
                }

                .mystery-card .read-more {
                    display: block;
                    margin-top: 0;
                    color: var(--color-space-orange);
                    font-family: var(--font-heading);
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }

                .mystery-card:hover .read-more {
                    transform: translateX(4px);
                    text-shadow: 0 0 10px rgba(252, 76, 0, 0.3);
                }

                /* Responsive Grid */
                @media (max-width: 1200px) {
                    .mystery-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 900px) {
                    .mystery-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .filter-tabs {
                        gap: 6px;
                        padding: 12px 16px;
                    }

                    .filter-tab {
                        padding: 10px 14px;
                        font-size: 0.8rem;
                    }

                    .more-btn {
                        padding: 10px 14px;
                        font-size: 0.8rem;
                    }
                }

                @media (max-width: 600px) {
                    .mystery-grid {
                        grid-template-columns: 1fr;
                    }

                    .mysteries-container {
                        padding: 0 20px;
                    }

                    .page-header h1 {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </>
    )
}
