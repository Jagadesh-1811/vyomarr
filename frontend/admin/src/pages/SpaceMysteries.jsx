import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Loader2, AlertCircle, Search, User, Sparkles, Rocket } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SpaceMysteries.css';

const API_URL = 'http://localhost:3000/api';

const categories = [
    { id: 'all', label: 'All Mysteries' },
    { id: 'black-holes', label: 'Black Holes' },
    { id: 'dark-matter', label: 'Dark Matter' },
    { id: 'exoplanets', label: 'Exoplanets' },
    { id: 'cosmic-events', label: 'Cosmic Events' },
];

export default function SpaceMysteries() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/posts`);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const text = await response.text();
            if (!text) {
                setArticles([]);
                return;
            }

            const data = JSON.parse(text);
            // Filter only Space & Mysteries category
            const spaceArticles = Array.isArray(data) 
                ? data.filter(article => article.category === 'Space & Mysteries')
                : [];
            setArticles(spaceArticles);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to fetch articles. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const calculateReadTime = (content) => {
        if (!content) return '1 min';
        const words = content.split(/\s+/).length;
        return `${Math.ceil(words / 200)} min`;
    };

    const truncateText = (text, maxLength = 120) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.subHeading?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'all' || article.subCategory === activeFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="space-mysteries-page">
                <Navbar />
                <div className="glow-bg"></div>
                <div className="loading-state">
                    <Rocket size={56} className="spin accent-icon" />
                    <p className="loading-text">Exploring the cosmos...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-mysteries-page">
                <Navbar />
                <div className="glow-bg"></div>
                <div className="error-state">
                    <AlertCircle size={48} className="error-icon" />
                    <h2 className="error-title">Failed to load mysteries</h2>
                    <p className="error-desc">{error}</p>
                    <button onClick={fetchArticles} className="retry-button">
                        <Sparkles size={16} /> Try Again
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="space-mysteries-page">
            {/* Navbar */}
            <Navbar />

            {/* Animated Glow Background */}
            <div className="glow-bg"></div>

            {/* Page Header */}
            <section className="page-hero">
                <h1 className="page-title">
                    Space <span className="accent">& Mysteries</span>
                </h1>
                <p className="page-subtitle">
                    Uncover the deepest secrets of the cosmos, from enigmatic black holes to the search for extraterrestrial life
                </p>

                {/* Search */}
                <div className="search-container">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search cosmic mysteries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </section>

            {/* Filter Buttons */}
            <div className="filter-container">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`filter-btn ${activeFilter === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveFilter(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Mystery Cards Grid */}
            <main className="mystery-grid-container">
                {filteredArticles.length === 0 ? (
                    <div className="empty-state">
                        <Sparkles size={48} className="empty-icon" />
                        <h3>No mysteries found</h3>
                        <p>Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="mystery-grid">
                        {filteredArticles.map((article) => (
                            <Link
                                key={article._id}
                                to={`/article/${article._id}`}
                                className="mystery-card"
                            >
                                {/* Card Image */}
                                <div className="card-image-container">
                                    {article.thumbnail?.url || (article.images && article.images.length > 0) ? (
                                        <img
                                            src={article.thumbnail?.url || article.images[0].url}
                                            alt={article.title}
                                            className="card-img"
                                        />
                                    ) : (
                                        <div className="card-img-placeholder">
                                            <Rocket size={40} />
                                        </div>
                                    )}
                                    <div className="card-img-overlay"></div>
                                </div>

                                {/* Card Content */}
                                <div className="card-body">
                                    <span className="card-category-badge">
                                        {article.subCategory || 'Cosmic Mystery'}
                                    </span>
                                    <h3 className="card-title">{article.title}</h3>
                                    <p className="card-description">
                                        {truncateText(article.subHeading || article.content)}
                                    </p>
                                    
                                    {/* Meta Info */}
                                    <div className="card-meta">
                                        <div className="meta-item">
                                            <User size={14} />
                                            <span>{article.author || 'Vyomarr'}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={14} />
                                            <span>{formatDate(article.createdAt)}</span>
                                        </div>
                                        <div className="meta-item read-time">
                                            <span>{calculateReadTime(article.content)} read</span>
                                        </div>
                                    </div>

                                    {/* Read More */}
                                    <div className="read-more">
                                        <span>Explore Mystery</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
