import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Trash2, Calendar, Loader2, AlertCircle, RefreshCw, Rocket, Sparkles, Pencil, X, Save } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

// Helper function to strip HTML tags from content for display
const stripHtmlTags = (html) => {
    if (!html) return '';
    // Remove HTML tags and decode common entities
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
};

// Rich text editor modules for edit modal
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link'],
        ['clean']
    ]
};

const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block', 'list', 'bullet', 'align', 'link'
];

export default function PublishedArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'mysteries', 'whatif'

    // Edit modal state
    const [editArticle, setEditArticle] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', subHeading: '', youtubeEmbed: '', images: [] });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            const allArticles = [];

            // Fetch Space Mysteries (all including drafts for admin)
            try {
                const mysteriesRes = await fetch(`${API_URL}/api/spacemysteries/admin/all`);
                if (mysteriesRes.ok) {
                    const mysteries = await mysteriesRes.json();
                    mysteries.forEach(m => {
                        allArticles.push({
                            ...m,
                            type: 'mystery',
                            displayCategory: m.categoryLabel || m.category || 'Mystery'
                        });
                    });
                }
            } catch (err) {
                console.error('Error fetching mysteries:', err);
            }

            // Fetch What If theories (approved ones)
            try {
                const whatIfRes = await fetch(`${API_URL}/api/whatif`);
                if (whatIfRes.ok) {
                    const whatifs = await whatIfRes.json();
                    whatifs.forEach(w => {
                        allArticles.push({
                            ...w,
                            type: 'whatif',
                            displayCategory: w.category || 'What If'
                        });
                    });
                }
            } catch (err) {
                console.error('Error fetching whatif:', err);
            }

            // Sort by creation date (newest first)
            allArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setArticles(allArticles);

        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to load articles. Check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (article) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;

        try {
            setDeleting(article._id);

            // Use correct API endpoint based on article type
            const endpoint = article.type === 'mystery'
                ? `${API_URL}/api/spacemysteries/${article._id}`
                : `${API_URL}/api/whatif/${article._id}`;

            const response = await fetch(endpoint, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete article');
            setArticles(prev => prev.filter(a => a._id !== article._id));
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

    // Open edit modal with article data (keep HTML for rich text editing)
    const openEditModal = (article) => {
        setEditArticle(article);
        setEditForm({
            title: article.title || '',
            description: article.description || '', // Keep HTML format
            subHeading: article.subHeading || '',
            youtubeEmbed: article.youtubeEmbed || '',
            images: article.images || [] // Include images with descriptions
        });
    };

    // Close edit modal
    const closeEditModal = () => {
        setEditArticle(null);
        setEditForm({ title: '', description: '', subHeading: '', youtubeEmbed: '', images: [] });
    };

    // Update image description
    const handleImageDescriptionChange = (index, newDescription) => {
        setEditForm(prev => ({
            ...prev,
            images: prev.images.map((img, i) =>
                i === index ? { ...img, description: newDescription } : img
            )
        }));
    };

    // Save edited article
    const handleSaveEdit = async () => {
        if (!editArticle) return;

        try {
            setSaving(true);

            const endpoint = editArticle.type === 'mystery'
                ? `${API_URL}/api/spacemysteries/${editArticle._id}`
                : `${API_URL}/api/whatif/${editArticle._id}`;

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editForm.title,
                    description: editForm.description,
                    subHeading: editForm.subHeading,
                    youtubeEmbed: editForm.youtubeEmbed,
                    images: editForm.images // Include updated image descriptions
                })
            });

            if (!response.ok) throw new Error('Failed to update article');

            const result = await response.json();

            // Update article in local state
            setArticles(prev => prev.map(a =>
                a._id === editArticle._id
                    ? { ...a, ...editForm }
                    : a
            ));

            closeEditModal();
            alert('Article updated successfully!');
        } catch (err) {
            alert('Failed to update article: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    // Filter articles based on active tab
    const filteredArticles = activeTab === 'all'
        ? articles
        : articles.filter(a => a.type === (activeTab === 'mysteries' ? 'mystery' : 'whatif'));

    const mysteriesCount = articles.filter(a => a.type === 'mystery').length;
    const whatifCount = articles.filter(a => a.type === 'whatif').length;

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

            {/* Filter Tabs */}
            <div style={styles.tabs}>
                {[
                    { key: 'all', label: 'All', count: articles.length, icon: FileText },
                    { key: 'mysteries', label: 'Space Mysteries', count: mysteriesCount, icon: Rocket },
                    { key: 'whatif', label: 'What If', count: whatifCount, icon: Sparkles }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            ...styles.tab,
                            background: activeTab === tab.key ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            color: activeTab === tab.key ? '#34d399' : '#94a3b8',
                            borderColor: activeTab === tab.key ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            <div style={styles.grid}>
                {filteredArticles.map((article) => (
                    <div key={article._id} style={{
                        ...styles.card,
                        borderColor: article.type === 'mystery' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                    }}>
                        {/* Thumbnail */}
                        {(article.imageUrl || (article.images && article.images.length > 0)) ? (
                            <div style={styles.thumbnail}>
                                <img
                                    src={article.imageUrl || article.images[0]?.url}
                                    alt={article.title}
                                    style={styles.thumbnailImage}
                                />
                                <div style={{
                                    ...styles.typeTag,
                                    background: article.type === 'mystery'
                                        ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
                                        : 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                                }}>
                                    {article.type === 'mystery' ? <Rocket size={12} /> : <Sparkles size={12} />}
                                    {article.type === 'mystery' ? 'Mystery' : 'What If'}
                                </div>
                            </div>
                        ) : (
                            <div style={styles.thumbnailPlaceholder}>
                                {article.type === 'mystery' ? <Rocket size={32} color="#8b5cf6" /> : <Sparkles size={32} color="#f59e0b" />}
                            </div>
                        )}

                        {/* Content */}
                        <div style={styles.cardContent}>
                            <span style={{
                                ...styles.category,
                                background: article.type === 'mystery' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: article.type === 'mystery' ? '#a78bfa' : '#fbbf24',
                                borderColor: article.type === 'mystery' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'
                            }}>
                                {article.displayCategory}
                            </span>
                            <h3 style={styles.cardTitle}>{article.title}</h3>
                            {article.description && (
                                <p style={styles.subHeading}>{stripHtmlTags(article.description).substring(0, 80)}...</p>
                            )}
                            <div style={styles.cardMeta}>
                                <Calendar size={14} />
                                <span>{formatDate(article.createdAt)}</span>
                                {article.status && (
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: 12,
                                        fontSize: 10,
                                        fontWeight: 600,
                                        background: article.status === 'published' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                        color: article.status === 'published' ? '#34d399' : '#fbbf24'
                                    }}>
                                        {article.status.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={styles.cardActions}>
                            <Link
                                to={`/article/${article._id}?type=${article.type === 'mystery' ? 'mystery' : 'whatif'}`}
                                style={styles.viewButton}
                                target="_blank"
                            >
                                <ExternalLink size={16} />
                                View
                            </Link>
                            <button
                                onClick={() => openEditModal(article)}
                                style={styles.editButton}
                            >
                                <Pencil size={16} />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(article)}
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

            {/* Edit Modal */}
            {editArticle && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                <Pencil size={20} color="#10b981" />
                                Edit Article
                            </h3>
                            <button onClick={closeEditModal} style={styles.closeButton}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Title</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                    style={styles.input}
                                    placeholder="Article title..."
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Sub Heading</label>
                                <input
                                    type="text"
                                    value={editForm.subHeading}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, subHeading: e.target.value }))}
                                    style={styles.input}
                                    placeholder="Sub heading..."
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Content / Description</label>
                                <div style={styles.editorWrapper}>
                                    <ReactQuill
                                        theme="snow"
                                        value={editForm.description}
                                        onChange={(value) => setEditForm(prev => ({ ...prev, description: value }))}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Edit your article content..."
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>YouTube Embed</label>
                                <textarea
                                    value={editForm.youtubeEmbed}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, youtubeEmbed: e.target.value }))}
                                    style={styles.input}
                                    placeholder="<iframe src=...></iframe>"
                                />
                            </div>

                            {/* Images Section */}
                            {editForm.images && editForm.images.length > 0 && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Article Images ({editForm.images.length})</label>
                                    <div style={styles.imagesGrid}>
                                        {editForm.images.map((img, idx) => (
                                            <div key={idx} style={styles.imageCard}>
                                                <img
                                                    src={img.url}
                                                    alt={`Image ${idx + 1}`}
                                                    style={styles.imagePreview}
                                                />
                                                <div style={styles.imageInfo}>
                                                    <span style={styles.imageLabel}>Image {idx + 1} Description</span>
                                                    <input
                                                        type="text"
                                                        value={img.description || ''}
                                                        onChange={(e) => handleImageDescriptionChange(idx, e.target.value)}
                                                        style={styles.imageDescInput}
                                                        placeholder="Enter image description..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={styles.modalFooter}>
                            <button onClick={closeEditModal} style={styles.cancelButton}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                style={styles.saveButton}
                            >
                                {saving ? (
                                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
                                ) : (
                                    <><Save size={16} /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quill Editor Styles for Dark Theme */}
            <style>{`
                .ql-toolbar.ql-snow {
                    background: rgba(15, 23, 42, 0.9);
                    border: none;
                    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
                }
                .ql-container.ql-snow {
                    border: none;
                    font-size: 15px;
                    min-height: 250px;
                }
                .ql-editor {
                    color: #e2e8f0;
                    padding: 16px;
                    min-height: 250px;
                    line-height: 1.7;
                }
                .ql-editor.ql-blank::before {
                    color: #64748b;
                    font-style: italic;
                }
                .ql-stroke { stroke: #94a3b8; }
                .ql-fill { fill: #94a3b8; }
                .ql-picker-label, .ql-picker-item { color: #94a3b8; }
                .ql-toolbar button:hover .ql-stroke,
                .ql-toolbar button.ql-active .ql-stroke { stroke: #10b981; }
                .ql-toolbar button:hover .ql-fill,
                .ql-toolbar button.ql-active .ql-fill { fill: #10b981; }
                .ql-editor h1 { font-size: 1.8rem; font-weight: 700; color: #fff; margin: 16px 0; }
                .ql-editor h2 { font-size: 1.4rem; font-weight: 600; color: #fff; margin: 14px 0; }
                .ql-editor h3 { font-size: 1.2rem; font-weight: 600; color: #e2e8f0; margin: 12px 0; }
                .ql-editor p { margin-bottom: 12px; }
                .ql-editor blockquote {
                    border-left: 4px solid #10b981;
                    padding-left: 16px;
                    margin: 16px 0;
                    color: #a78bfa;
                    font-style: italic;
                }
                .ql-picker.ql-header .ql-picker-options {
                    background: rgba(15, 23, 42, 0.98);
                    border: 1px solid rgba(139, 92, 246, 0.3);
                    border-radius: 8px;
                }
            `}</style>
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
        boxShadow: 'none',
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
    tabs: {
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        border: '1px solid',
        borderRadius: 10,
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: 14,
        transition: 'all 0.2s',
    },
    typeTag: {
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 12px',
        borderRadius: 20,
        color: '#fff',
        fontSize: 11,
        fontWeight: 600,
        boxShadow: 'none',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 20,
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 14,
        boxShadow: 'none',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column',
    },
    thumbnail: {
        width: '100%',
        height: 140,
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
        height: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(16, 185, 129, 0.1)',
    },
    cardContent: {
        padding: 16,
        flex: 1,
    },
    category: {
        display: 'inline-block',
        background: 'rgba(16, 185, 129, 0.15)',
        color: '#34d399',
        padding: '4px 10px',
        borderRadius: 16,
        fontSize: 10,
        fontWeight: 600,
        marginBottom: 10,
        border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 600,
        margin: '0 0 8px',
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        color: '#fff',
    },
    subHeading: {
        fontSize: 12,
        color: '#94a3b8',
        margin: '0 0 10px',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: 1.4,
    },
    cardMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: '#64748b',
        flexWrap: 'wrap',
    },
    cardActions: {
        display: 'flex',
        gap: 8,
        padding: '12px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(0, 0, 0, 0.2)',
    },
    viewButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'linear-gradient(135deg, #10b981, #34d399)',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: 'none',
        transition: 'all 0.2s',
    },
    deleteButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 8,
        fontSize: 12,
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
        boxShadow: 'none',
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
    editButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'rgba(139, 92, 246, 0.15)',
        color: '#a78bfa',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
    },
    modal: {
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: 20,
        maxWidth: 700,
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: 0,
        fontSize: 18,
        fontWeight: 600,
        color: '#fff',
    },
    closeButton: {
        background: 'rgba(239, 68, 68, 0.15)',
        border: 'none',
        color: '#f87171',
        width: 36,
        height: 36,
        borderRadius: 10,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBody: {
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        padding: '14px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: 10,
        color: '#e2e8f0',
        fontSize: 14,
        outline: 'none',
    },
    textarea: {
        padding: '14px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: 10,
        color: '#e2e8f0',
        fontSize: 14,
        outline: 'none',
        resize: 'vertical',
        minHeight: 200,
        fontFamily: 'inherit',
        lineHeight: 1.6,
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        padding: '16px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    cancelButton: {
        padding: '12px 24px',
        background: 'rgba(100, 116, 139, 0.15)',
        border: '1px solid rgba(100, 116, 139, 0.3)',
        borderRadius: 10,
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
    },
    saveButton: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #10b981, #34d399)',
        border: 'none',
        borderRadius: 10,
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
    },
    editorWrapper: {
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: 10,
        border: '1px solid rgba(139, 92, 246, 0.2)',
        overflow: 'hidden',
    },
    imagesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
        marginTop: 12,
    },
    imageCard: {
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: 12,
        border: '1px solid rgba(139, 92, 246, 0.2)',
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: 120,
        objectFit: 'cover',
    },
    imageInfo: {
        padding: 12,
    },
    imageLabel: {
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: '#64748b',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    imageDescInput: {
        width: '100%',
        padding: '10px 12px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: 8,
        color: '#e2e8f0',
        fontSize: 13,
        outline: 'none',
    },
};
