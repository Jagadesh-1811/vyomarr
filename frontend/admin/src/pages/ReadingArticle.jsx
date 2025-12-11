import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Bookmark, Share2, Clock, Loader2, AlertCircle, Send, MessageCircle, Eye, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ReadingArticle.css';

const API_URL = 'http://localhost:3000/api';

export default function ReadingArticle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);
    const [commentName, setCommentName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);
    const [relatedArticles, setRelatedArticles] = useState([]);

    useEffect(() => {
        fetchArticle();
        fetchRelatedArticles();
        window.addEventListener('scroll', updateReadingProgress);
        return () => window.removeEventListener('scroll', updateReadingProgress);
    }, [id]);

    const updateReadingProgress = () => {
        const articleContent = document.getElementById('article-content');
        if (!articleContent) return;

        const articleTop = articleContent.offsetTop;
        const articleHeight = articleContent.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        const windowBottom = scrollTop + windowHeight;

        let progress = 0;
        if (scrollTop >= articleTop) {
            if (windowBottom >= articleTop + articleHeight) {
                progress = 100;
            } else {
                progress = ((windowBottom - articleTop) / articleHeight) * 100;
            }
        }
        setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/posts/${id}`);
            if (!response.ok) {
                if (response.status === 404) throw new Error('Article not found');
                throw new Error('Failed to fetch article');
            }
            const data = await response.json();
            setArticle(data);
            setLikeCount(data.likes || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedArticles = async () => {
        try {
            const response = await fetch(`${API_URL}/posts`);
            if (response.ok) {
                const data = await response.json();
                const filtered = data.filter(a => a._id !== id).slice(0, 3);
                setRelatedArticles(filtered);
            }
        } catch (err) {
            console.error('Failed to fetch related articles:', err);
        }
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays === 7) return '1 week ago';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const calculateReadTime = (content) => {
        if (!content) return '1 min';
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    };

    const handleLike = async () => {
        if (liked) return;
        try {
            const response = await fetch(`${API_URL}/posts/${id}/like`, { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                setLikeCount(data.likes);
                setLiked(true);
            }
        } catch (err) {
            console.error('Failed to like:', err);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentName.trim() || !commentText.trim()) return;

        setSubmittingComment(true);
        try {
            const response = await fetch(`${API_URL}/posts/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: commentName, text: commentText }),
            });
            if (response.ok) {
                const data = await response.json();
                setArticle(prev => ({ ...prev, comments: data.comments }));
                setCommentName('');
                setCommentText('');
            }
        } catch (err) {
            console.error('Failed to add comment:', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: article?.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const renderContent = (content) => {
        if (!content) return null;
        const paragraphs = content.split('\n').filter(p => p.trim());
        
        return paragraphs.map((paragraph, index) => {
            if (paragraph.startsWith('##')) {
                return <h2 key={index} className="content-heading">{paragraph.replace(/^#+\s*/, '')}</h2>;
            }
            if (paragraph.startsWith('#')) {
                return <h3 key={index} className="content-subheading">{paragraph.replace(/^#+\s*/, '')}</h3>;
            }
            return <p key={index} className="content-paragraph">{paragraph}</p>;
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="reading-loading">
                    <Loader2 size={48} className="spin accent-icon" />
                    <p className="reading-loading__text">Loading article...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="reading-error">
                    <AlertCircle size={64} className="error-icon" />
                    <h2 className="reading-error__title">{error}</h2>
                    <p className="reading-error__text">The article you're looking for might have been removed or doesn't exist.</p>
                    <button onClick={() => navigate('/')} className="btn-accent">Back to Articles</button>
                </div>
                <Footer />
            </>
        );
    }

    if (!article) return null;

    return (
        <>
            <Navbar />
            
            {/* Reading Progress Bar */}
            <div className="reading-progress-bar">
                <div className="reading-progress-fill" style={{ width: `${readingProgress}%` }} />
            </div>

            <div className="article-layout">
                <article>
                    {/* Article Header */}
                    <header className="article-header">
                        {/* Breadcrumb */}
                        <nav className="breadcrumb">
                            <Link to="/" className="breadcrumb-link">Home</Link>
                            <ChevronRight size={16} />
                            <Link to="/articles" className="breadcrumb-link">{article.category || 'Articles'}</Link>
                            <ChevronRight size={16} />
                            <span className="breadcrumb-current">{article.title?.substring(0, 30)}...</span>
                        </nav>

                        {/* Article Title */}
                        <h1 className="article-title">{article.title}</h1>

                        {/* Sub Heading */}
                        {article.subHeading && (
                            <p className="article-subtitle">{article.subHeading}</p>
                        )}

                        {/* Article Meta */}
                        <div className="article-meta">
                            <div className="meta-author">
                                <div className="author-avatar">V</div>
                                <span className="author-name">Vyomarr Team</span>
                            </div>
                            <span className="meta-divider">•</span>
                            <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
                            <span className="meta-divider">•</span>
                            <span className="meta-item">
                                <Clock size={14} />
                                {calculateReadTime(article.content)}
                            </span>
                            <span className="meta-divider">•</span>
                            <span className="meta-item">
                                <Eye size={14} />
                                {Math.floor(Math.random() * 2000 + 500)} views
                            </span>
                        </div>

                        {/* Article Tags */}
                        <div className="article-tags">
                            <span className="tag tag-accent">{article.category}</span>
                            <span className="tag tag-warning">Space</span>
                            <span className="tag tag-success">Science</span>
                        </div>

                        {/* Social Share & Actions Bar */}
                        <div className="actions-bar">
                            <div className="actions-left">
                                <button className={`action-btn ${liked ? 'is-liked' : ''}`} onClick={handleLike}>
                                    <Heart size={18} fill={liked ? '#fc4c00' : 'none'} />
                                    <span>{likeCount}</span>
                                </button>
                                <button className={`action-btn ${bookmarked ? 'is-bookmarked' : ''}`} onClick={() => setBookmarked(!bookmarked)}>
                                    <Bookmark size={18} fill={bookmarked ? '#fc4c00' : 'none'} />
                                    <span>Bookmark</span>
                                </button>
                            </div>
                            <div className="actions-right">
                                <span className="follow-label">Follow:</span>
                                <a href="https://instagram.com/vyomarr" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                </a>
                                <a href="https://youtube.com/@vyomarr" target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                </a>
                                <a href="https://x.com/vyomarr" target="_blank" rel="noopener noreferrer" className="social-link" title="X">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                                <a href="https://discord.gg/vyomarr" target="_blank" rel="noopener noreferrer" className="social-link" title="Discord">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                                </a>
                                <button className="action-btn share-btn" onClick={handleShare}>
                                    <Share2 size={16} />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Article Content */}
                    <div className="article-content" id="article-content">
                        {/* Hero Image */}
                        {article.images && article.images.length > 0 && (
                            <figure className="hero-figure">
                                <div className="hero-image-wrapper">
                                    <img src={article.images[0].url} alt={article.title} className="hero-image" onClick={() => setActiveImage(article.images[0].url)} />
                                </div>
                                <figcaption className="hero-caption">{article.subHeading || `Exploring the mysteries of ${article.category?.toLowerCase() || 'space'}`}</figcaption>
                            </figure>
                        )}

                        {/* Article Text Content */}
                        <div className="prose-content">{renderContent(article.content)}</div>

                        {/* YouTube Embed */}
                        {article.youtubeEmbed && (
                            <div className="youtube-section">
                                <h3 className="section-heading">Video Content</h3>
                                <div className="youtube-wrapper" dangerouslySetInnerHTML={{ __html: article.youtubeEmbed }} />
                            </div>
                        )}

                        {/* Additional Images Gallery */}
                        {article.images && article.images.length > 1 && (
                            <div className="gallery-section">
                                <h3 className="section-heading">Image Gallery</h3>
                                <div className="gallery-grid">
                                    {article.images.slice(1).map((image, index) => (
                                        <figure key={index} className="gallery-figure" onClick={() => setActiveImage(image.url)}>
                                            <img src={image.url} alt={`Gallery ${index + 2}`} className="gallery-image" />
                                        </figure>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quote Block */}
                        <blockquote className="article-quote">
                            <p>"The mysteries of the universe continue to challenge our understanding, pushing the boundaries of human knowledge."</p>
                            <footer>— Vyomarr Space Explorer Team</footer>
                        </blockquote>
                    </div>

                    {/* Related Articles Sidebar Card */}
                    <aside className="related-sidebar">
                        <div className="glass-card">
                            <h3 className="sidebar-title">Related Articles</h3>
                            <div className="related-list">
                                {relatedArticles.map((related) => (
                                    <article key={related._id} className="related-item" onClick={() => navigate(`/article/${related._id}`)}>
                                        <img src={related.images?.[0]?.url || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=150'} alt={related.title} className="related-thumb" />
                                        <div className="related-info">
                                            <h4 className="related-title">{related.title}</h4>
                                            <p className="related-excerpt">{related.subHeading?.substring(0, 60) || related.content?.substring(0, 60)}...</p>
                                            <span className="related-read-time">{calculateReadTime(related.content)}</span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </aside>
                </article>
            </div>

            {/* Comments Section */}
            <section className="comments-section">
                <div className="comments-container">
                    <div className="comments-header">
                        <h2 className="comments-title"><MessageCircle size={24} /> Comments ({article.comments?.length || 0})</h2>
                    </div>

                    {/* Comment Form */}
                    <div className="comment-form-card">
                        <form onSubmit={handleSubmitComment} className="comment-form">
                            <div className="comment-avatar"><span>{commentName ? commentName.charAt(0).toUpperCase() : 'U'}</span></div>
                            <div className="comment-inputs">
                                <input type="text" value={commentName} onChange={(e) => setCommentName(e.target.value)} placeholder="Your name..." className="comment-name-input" required />
                                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your thoughts on this article..." className="comment-text-input" rows={3} required />
                                <div className="comment-submit-row">
                                    <button type="submit" className="btn-accent" disabled={submittingComment}>
                                        {submittingComment ? (<><Loader2 size={16} className="spin" /> Posting...</>) : (<><Send size={16} /> Post Comment</>)}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Comments List */}
                    <div className="comments-list">
                        {article.comments && article.comments.length > 0 ? (
                            [...article.comments].reverse().map((comment, index) => (
                                <div key={index} className="comment-card">
                                    <div className="comment-author-avatar">{comment.name.charAt(0).toUpperCase()}</div>
                                    <div className="comment-body">
                                        <div className="comment-meta">
                                            <h4 className="comment-author">{comment.name}</h4>
                                            <span className="comment-divider">•</span>
                                            <time className="comment-time">{getRelativeTime(comment.createdAt)}</time>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                        <div className="comment-actions">
                                            <button className="comment-action-btn"><Heart size={14} /><span>Like</span></button>
                                            <button className="comment-action-btn">Reply</button>
                                            <button className="comment-action-btn">Share</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-comments"><MessageCircle size={40} /><p>No comments yet. Be the first to share your thoughts!</p></div>
                        )}
                    </div>
                </div>
            </section>

            {/* You Might Also Like Section */}
            <section className="related-section">
                <div className="related-container">
                    <div className="related-header">
                        <h2 className="related-section-title">You Might Also Like</h2>
                        <p className="related-section-subtitle">Explore more fascinating mysteries of the cosmos</p>
                    </div>
                    <div className="related-grid">
                        {relatedArticles.map((related) => (
                            <article key={related._id} className="related-card" onClick={() => navigate(`/article/${related._id}`)}>
                                <div className="related-card-image">
                                    <img src={related.images?.[0]?.url || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400'} alt={related.title} />
                                    <span className="related-card-badge">{related.category}</span>
                                </div>
                                <div className="related-card-content">
                                    <h3 className="related-card-title">{related.title}</h3>
                                    <p className="related-card-excerpt">{related.subHeading || related.content?.substring(0, 100)}...</p>
                                    <div className="related-card-meta"><span>Vyomarr Team</span><span>•</span><span>{calculateReadTime(related.content)}</span></div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image Modal */}
            {activeImage && (
                <div className="image-modal" onClick={() => setActiveImage(null)}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="image-modal-close" onClick={() => setActiveImage(null)}>×</button>
                        <img src={activeImage} alt="Full size" className="image-modal-img" />
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
