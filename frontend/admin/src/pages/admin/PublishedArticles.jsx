import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Trash2, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

export default function PublishedArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);

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
            setArticles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to load articles. Check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;

        try {
            setDeleting(id);
            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete article');
            setArticles(prev => prev.filter(article => article._id !== id));
        } catch (err) {
            alert('Failed to delete article: ' + err.message);
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div style={{ ...styles.container, ...styles.loadingContainer }}>
                <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#10b981' }} />
                <p style={{ color: '#94a3b8' }}>Loading articles...</p>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ ...styles.container, ...styles.errorContainer }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertCircle size={32} color="#f87171" />
                </div>
                <p style={{ color: '#f87171' }}>{error}</p>
                <button onClick={fetchArticles} style={styles.retryButton}>
                    <RefreshCw size={16} />
                    Retry
                </button>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div style={{ ...styles.container, ...styles.emptyContainer }}>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={40} color="#10b981" />
                </div>
                <p style={styles.emptyText}>No articles published yet</p>
                <p style={styles.emptySubtext}>Create your first article in the Space & Mysteries section</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>
                    <div style={styles.titleIcon}>
                        <FileText size={22} color="#fff" />
                    </div>
                    Published Articles ({articles.length})
                </h2>
                <button onClick={fetchArticles} style={styles.refreshButton} title="Refresh">
                    <RefreshCw size={18} />
                </button>
            </div>

            <div style={styles.grid}>
                {articles.map((article) => (
                    <div key={article._id} style={styles.card}>
                        {/* Thumbnail */}
                        {article.images && article.images.length > 0 ? (
                            <div style={styles.thumbnail}>
                                <img src={article.images[0].url} alt={article.title} style={styles.thumbnailImage} />
                            </div>
                        ) : (
                            <div style={styles.thumbnailPlaceholder}>
                                <FileText size={32} color="#9ca3af" />
                            </div>
                        )}

                        {/* Content */}
                        <div style={styles.cardContent}>
                            <span style={styles.category}>{article.category}</span>
                            <h3 style={styles.cardTitle}>{article.title}</h3>
                            {article.subHeading && (
                                <p style={styles.subHeading}>{article.subHeading}</p>
                            )}
                            <div style={styles.cardMeta}>
                                <Calendar size={14} />
                                <span>{formatDate(article.createdAt)}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={styles.cardActions}>
                            <Link
                                to={`/article/${article._id}`}
                                style={styles.viewButton}
                                target="_blank"
                            >
                                <ExternalLink size={16} />
                                View
                            </Link>
                            <button
                                onClick={() => handleDelete(article._id)}
                                disabled={deleting === article._id}
                                style={styles.deleteButton}
                            >
                                {deleting === article._id ? (
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: 24,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #0d2818 50%, #0f172a 100)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        fontSize: 22,
        fontWeight: 700,
        margin: 0,
        color: '#fff',
    },
    titleIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #10b981, #34d399)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
    },
    refreshButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        background: 'rgba(16, 185, 129, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 10,
        cursor: 'pointer',
        color: '#34d399',
        transition: 'all 0.2s',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 24,
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s',
    },
    thumbnail: {
        width: '100%',
        height: 180,
        overflow: 'hidden',
        position: 'relative',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s',
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(16, 185, 129, 0.1)',
    },
    cardContent: {
        padding: 20,
    },
    category: {
        display: 'inline-block',
        background: 'rgba(16, 185, 129, 0.15)',
        color: '#34d399',
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        marginBottom: 12,
        border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 600,
        margin: '0 0 10px',
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        color: '#fff',
    },
    subHeading: {
        fontSize: 14,
        color: '#94a3b8',
        margin: '0 0 14px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: 1.5,
    },
    cardMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: '#64748b',
    },
    cardActions: {
        display: 'flex',
        gap: 10,
        padding: '16px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(0, 0, 0, 0.2)',
    },
    viewButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 18px',
        background: 'linear-gradient(135deg, #10b981, #34d399)',
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        transition: 'all 0.2s',
    },
    deleteButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 18px',
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        color: '#34d399',
        gap: 16,
        minHeight: '60vh',
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        color: '#f87171',
        gap: 16,
        minHeight: '60vh',
    },
    retryButton: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #10b981, #34d399)',
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    emptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        textAlign: 'center',
        minHeight: '60vh',
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 600,
        color: '#e2e8f0',
        margin: '20px 0 10px',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748b',
        margin: 0,
    },
};
