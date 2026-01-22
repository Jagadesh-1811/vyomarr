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
    { key: 'Aerospace Futures', label: 'Aerospace' },
    { key: 'Space-Time & Cosmology', label: 'Cosmology' },
    { key: 'Quantum Possibilities', label: 'Quantum' },
    { key: 'Advanced Propulsion Concepts', label: 'Propulsion' },
    { key: 'Astrobiology & Alien Life', label: 'Aliens' },
    { key: 'Frontier Physics', label: 'Physics' },
    { key: 'Cross-Domain Exploration', label: 'Cross-Domain' },
    { key: 'Other', label: 'Other' }
]

export default function WhatIfPage() {
    const [activeFilter, setActiveFilter] = useState('all')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scenarios, setScenarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch approved theories from API
    useEffect(() => {
        const fetchTheories = async () => {
            try {
                setLoading(true)
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
                const response = await fetch(`${API_URL}/api/whatif`)

                if (!response.ok) {
                    throw new Error('Failed to fetch theories')
                }

                const data = await response.json()

                // Transform API data to match component format
                const transformed = data.map(theory => ({
                    id: theory._id,
                    title: theory.title,
                    category: theory.category,
                    categoryLabel: theory.category.toUpperCase(),
                    description: theory.description,
                    image: theory.imageUrl || 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
                    author: theory.authorName || 'Anonymous',
                    votes: `${theory.votes || 0} votes`
                }))

                setScenarios(transformed)
                setError(null)
            } catch (err) {
                console.error('Error fetching theories:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTheories()
    }, [])

    const filteredScenarios = activeFilter === 'all'
        ? scenarios
        : scenarios.filter(s => s.category === activeFilter)

    const handleFilterClick = (filter) => {
        setActiveFilter(filter)
        setDropdownOpen(false)
    }

    return (
        <>
            <div className="whatif-container">
                <header className="hero">
                    <h1>What If <span style={{ color: 'var(--color-space-orange)' }}>Scenarios</span></h1>
                    <p>
                        Explore speculative space theories and submit your own hypothetical scenarios for community discussion.
                        Where science meets imagination.
                    </p>
                    <Link to="/submit-theory" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Submit Your Theory
                    </Link>
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

                {/* Content Grid with Loading/Empty States */}
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading cosmic theories...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>⚠️ {error}</p>
                        <button onClick={() => window.location.reload()} className="btn-primary">
                            Try Again
                        </button>
                    </div>
                ) : filteredScenarios.length === 0 ? (
                    <div className="empty-state">
                        <h3>No theories yet!</h3>
                        <p>Be the first to submit a What If scenario for the community.</p>
                        <Link to="/submit-theory" className="btn-primary" style={{ textDecoration: 'none' }}>
                            Submit Your Theory
                        </Link>
                    </div>
                ) : (
                    <div className="grid">
                        {filteredScenarios.map(scenario => (
                            <Link to={`/article/${scenario.id}?type=whatif`} key={scenario.id} className="card-link" style={{ textDecoration: 'none' }}>
                                <article className="card" data-category={scenario.category}>
                                    <img src={scenario.image} alt={scenario.title} className="card-img" />
                                    <div className="card-category">{scenario.categoryLabel}</div>
                                    <h3>{scenario.title}</h3>
                                    <p>{stripHtmlTags(scenario.description)}</p>
                                    <div className="card-meta">
                                        <span>{scenario.author}</span>
                                        <span>{scenario.votes}</span>
                                    </div>
                                    <span className="read-more">Read More →</span>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .whatif-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px 60px;
                    padding-top: 100px;
                    position: relative;
                    z-index: 1;
                }

                /* Hero Section */
                .hero {
                    text-align: center;
                    padding: 80px 20px;
                }

                .hero h1 {
                    font-size: 3.5rem;
                    margin-bottom: 20px;
                    color: var(--color-cosmic-white);
                }

                .hero p {
                    max-width: 600px;
                    margin: 0 auto 40px auto;
                    font-size: 1.1rem;
                    color: var(--color-mist-gray);
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
                .grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    padding-bottom: 60px;
                }

                @media (max-width: 1200px) {
                    .grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 900px) {
                    .grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 600px) {
                    .grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .whatif-container {
                        padding: 20px;
                        padding-top: 80px;
                    }

                    .hero h1 {
                        font-size: 2rem;
                    }
                }

                /* Card Link Wrapper */
                .card-link {
                    display: block;
                    height: 100%;
                    cursor: pointer;
                }

                /* Card Styles */
                .card {
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

                .card::before {
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

                .card > * {
                    position: relative;
                    z-index: 2;
                }

                .card:hover {
                    background: rgba(40, 45, 70, 0.5);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-8px);
                }

                .card-img {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                    border-radius: 24px;
                    margin-bottom: 16px;
                }

                .card .card-category {
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

                .card h3 {
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                    color: var(--color-cosmic-white);
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .card p {
                    font-size: 0.9rem;
                    margin-bottom: 16px;
                    line-height: 1.6;
                    color: var(--color-mist-gray);
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    flex-grow: 1;
                }

                .card .card-meta {
                    font-family: var(--font-body);
                    font-size: 0.75rem;
                    color: var(--color-mist-gray);
                    margin-top: auto;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    padding-top: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    opacity: 0.8;
                }

                .card .read-more {
                    display: block;
                    margin-top: 8px;
                    color: var(--color-space-orange);
                    font-family: var(--font-heading);
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 0.85rem;
                    transition: all 0.3s ease;
                }

                .card:hover .read-more {
                    transform: translateX(4px);
                    text-shadow: 0 0 10px rgba(252, 76, 0, 0.3);
                }

                /* Loading, Error, Empty States */
                .loading-state, .error-state, .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    color: var(--color-mist-gray);
                }

                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top-color: var(--color-space-orange);
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .empty-state h3 {
                    color: var(--color-cosmic-white);
                    margin-bottom: 10px;
                    font-size: 1.5rem;
                }

                .empty-state p, .error-state p {
                    margin-bottom: 20px;
                }

                .btn-primary {
                    background: linear-gradient(90deg, var(--color-space-orange), #ff6a2b);
                    color: var(--color-deep-space);
                    padding: 14px 32px;
                    border-radius: 12px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(252, 76, 0, 0.4);
                }
            `}</style>
        </>
    )
}
