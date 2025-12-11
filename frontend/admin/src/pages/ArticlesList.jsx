import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Loader2, AlertCircle, Search } from 'lucide-react';
import './ArticlesList.css';

const API_URL = 'http://localhost:3000/api';

export default function ArticlesList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/posts`);

            // Check if response is ok
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Check if response has content
            const text = await response.text();
            if (!text) {
                setArticles([]);
                return;
            }

            const data = JSON.parse(text);
            setArticles(Array.isArray(data) ? data : []);
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
            month: 'long',
            day: 'numeric',
        });
    };

    const calculateReadTime = (content) => {
        if (!content) return '1 min';
        const words = content.split(/\s+/).length;
        return `${Math.ceil(words / 200)} min read`;
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="articles-page">
                <div className="loading-state">
                    <Loader2 size={48} className="spin accent-icon" />
                    <p className="loading-text">Loading articles...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="articles-page">
                <div className="error-state">
                    <AlertCircle size={48} className="error-icon" />
                    <h2 className="error-title">Failed to load articles</h2>
                    <button onClick={fetchArticles} className="retry-button">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="articles-page">
            {/* Header */}
            <header className="articles-header">
                <div className="articles-header__content">
                    <Link to="/" className="logo">
                        <span className="logo__text">Vyomarr</span>
                        <span className="logo__tagline">Space Explorer</span>
                    </Link>
                    <nav style={{ display: 'flex', gap: '24px', marginLeft: 'auto' }}>
                        <Link to="/space-mysteries" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.3s' }}>Space & Mysteries</Link>
                        <Link to="/whatif" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.3s' }}>What If?</Link>
                        <Link to="/feedback" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.3s' }}>Feedback</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <h1 className="hero__title">Space & Mysteries</h1>
                <p className="hero__subtitle">Explore the wonders of the universe through our curated articles</p>

                {/* Search */}
                <div className="search">
                    <Search size={20} className="search__icon" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search__input"
                    />
                </div>
            </section>

            {/* Articles Grid */}
            <main className="articles-main">
                {filteredArticles.length === 0 ? (
                    <div className="empty-state">
                        <p>No articles found</p>
                    </div>
                ) : (
                    <div className="articles-grid">
                        {filteredArticles.map((article) => (
                            <Link
                                key={article._id}
                                to={`/article/${article._id}`}
                                className="article-card"
                            >
                                {/* Thumbnail */}
                                <div className="card-thumbnail">
                                    {article.thumbnail?.url || (article.images && article.images.length > 0) ? (
                                        <img
                                            src={article.thumbnail?.url || article.images[0].url}
                                            alt={article.title}
                                            className="card-image"
                                        />
                                    ) : (
                                        <div className="card-image__placeholder">
                                            <span>🌌</span>
                                        </div>
                                    )}
                                    <div className="card-overlay" />
                                </div>

                                {/* Content */}
                                <div className="card-content">
                                    <span className="card-category">{article.category}</span>
                                    <h2 className="card-title">{article.title}</h2>
                                    {article.subHeading && (
                                        <p className="card-subheading">{article.subHeading}</p>
                                    )}
                                    <div className="card-meta">
                                        <span className="card-date">{formatDate(article.createdAt)}</span>
                                        <span className="card-readtime">
                                            <Clock size={14} />
                                            {calculateReadTime(article.content)}
                                        </span>
                                    </div>
                                    <div className="card-readmore">
                                        Read Article <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="articles-footer">
                <p>© 2025 Vyomarr Space Explorer. All rights reserved.</p>
            </footer>
        </div>
    );
}
