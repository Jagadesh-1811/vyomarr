import React from 'react';
import { X, Calendar, User, Tag, Eye, ThumbsUp, ArrowLeft } from 'lucide-react';

export default function AdminWhatIfPreview({ theory, onClose }) {
    if (!theory) return null;

    // Get images array
    const images = theory.images || [];
    const mainImage = theory.imageUrl;

    // Split content into paragraphs and distribute images
    const renderContentWithImages = () => {
        if (!theory.description) return null;

        const paragraphs = theory.description.split('\n').filter(p => p.trim());
        const elements = [];
        let wordCount = 0;
        let imgIdx = 0;

        // Calculate words per image for even distribution
        const totalWords = theory.description.split(/\s+/).length;
        const wordsPerImage = images.length > 0 ? Math.floor(totalWords / (images.length + 1)) : 999999;

        paragraphs.forEach((paragraph, i) => {
            const words = paragraph.split(/\s+/);
            wordCount += words.length;

            elements.push(
                <p key={`p-${i}`} style={styles.paragraph}>
                    {paragraph}
                </p>
            );

            // Insert image after reaching word threshold
            if (imgIdx < images.length && wordCount >= wordsPerImage * (imgIdx + 1)) {
                const img = images[imgIdx];
                elements.push(
                    <figure key={`img-${imgIdx}`} style={styles.inlineFigure}>
                        <img
                            src={img.url || img}
                            alt={`Content image ${imgIdx + 1}`}
                            style={styles.inlineImage}
                        />
                        <figcaption style={styles.figcaption}>
                            Image {imgIdx + 1} of {images.length}
                        </figcaption>
                    </figure>
                );
                imgIdx++;
            }
        });

        // Add remaining images at the end
        while (imgIdx < images.length) {
            const img = images[imgIdx];
            elements.push(
                <figure key={`img-end-${imgIdx}`} style={styles.inlineFigure}>
                    <img
                        src={img.url || img}
                        alt={`Content image ${imgIdx + 1}`}
                        style={styles.inlineImage}
                    />
                    <figcaption style={styles.figcaption}>
                        Image {imgIdx + 1} of {images.length}
                    </figcaption>
                </figure>
            );
            imgIdx++;
        }

        return elements;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <button onClick={onClose} style={styles.backButton}>
                        <ArrowLeft size={20} />
                        Back to List
                    </button>
                    <button onClick={onClose} style={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>

                {/* Article Content */}
                <div style={styles.articleContainer}>
                    {/* Hero Image */}
                    {mainImage && (
                        <div style={styles.heroSection}>
                            <img src={mainImage} alt={theory.title} style={styles.heroImage} />
                            <div style={styles.heroOverlay} />
                        </div>
                    )}

                    {/* Content Section */}
                    <article style={styles.article}>
                        {/* Category Badge */}
                        <span style={styles.categoryBadge}>
                            {theory.category || 'What If'}
                        </span>

                        {/* Title */}
                        <h1 style={styles.title}>{theory.title}</h1>

                        {/* Meta Info */}
                        <div style={styles.meta}>
                            <div style={styles.metaItem}>
                                <div style={styles.authorIcon}>
                                    {(theory.authorName || 'A')[0]}
                                </div>
                                <span>{theory.authorName || 'Anonymous'}</span>
                            </div>
                            <span style={styles.separator}>•</span>
                            <div style={styles.metaItem}>
                                <Calendar size={16} />
                                <span>{formatDate(theory.createdAt)}</span>
                            </div>
                            <span style={styles.separator}>•</span>
                            <div style={styles.metaItem}>
                                <Eye size={16} />
                                <span>{theory.views || 0} views</span>
                            </div>
                            <span style={styles.separator}>•</span>
                            <div style={styles.metaItem}>
                                <ThumbsUp size={16} />
                                <span>{theory.votes || 0} votes</span>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div style={{
                            ...styles.statusBadge,
                            background: theory.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' :
                                theory.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: theory.status === 'approved' ? '#34d399' :
                                theory.status === 'rejected' ? '#f87171' : '#fbbf24',
                            borderColor: theory.status === 'approved' ? 'rgba(16, 185, 129, 0.3)' :
                                theory.status === 'rejected' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'
                        }}>
                            ● {(theory.status || 'pending').toUpperCase()}
                        </div>

                        {/* Rejection Reason */}
                        {theory.status === 'rejected' && theory.rejectionReason && (
                            <div style={styles.rejectionBox}>
                                <strong>Rejection Reason:</strong> {theory.rejectionReason}
                            </div>
                        )}

                        {/* Divider */}
                        <div style={styles.divider} />

                        {/* Article Body with Images */}
                        <div style={styles.articleBody}>
                            {renderContentWithImages()}
                        </div>

                        {/* Author Box */}
                        <div style={styles.authorBox}>
                            <div style={styles.authorAvatar}>
                                {(theory.authorName || 'A')[0]}
                            </div>
                            <div>
                                <h4 style={styles.authorName}>Submitted by {theory.authorName || 'Anonymous'}</h4>
                                <p style={styles.authorEmail}>{theory.authorEmail || 'No email provided'}</p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'auto',
        backdropFilter: 'blur(10px)',
        padding: '20px',
    },
    modal: {
        width: '100%',
        maxWidth: '900px',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 20,
        overflow: 'hidden',
        margin: '20px 0',
        border: '1px solid rgba(245, 158, 11, 0.2)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: 10,
        color: '#e2e8f0',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
    },
    closeButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: 10,
        color: '#94a3b8',
        cursor: 'pointer',
    },
    articleContainer: {
        maxHeight: 'calc(100vh - 140px)',
        overflow: 'auto',
    },
    heroSection: {
        position: 'relative',
        width: '100%',
        height: 350,
        overflow: 'hidden',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    heroOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(15, 23, 42, 1), transparent 50%)',
    },
    article: {
        padding: '32px',
        marginTop: -60,
        position: 'relative',
    },
    categoryBadge: {
        display: 'inline-block',
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        color: '#fff',
        padding: '8px 18px',
        borderRadius: 24,
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: 16,
        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
    },
    title: {
        fontSize: 32,
        fontWeight: 800,
        color: '#fff',
        margin: '0 0 20px',
        lineHeight: 1.3,
    },
    meta: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: '#94a3b8',
        fontSize: 14,
    },
    authorIcon: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 14,
    },
    separator: {
        color: '#475569',
    },
    statusBadge: {
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        border: '1px solid',
        marginBottom: 20,
    },
    rejectionBox: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        color: '#f87171',
        fontSize: 14,
    },
    divider: {
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.3), transparent)',
        margin: '24px 0',
    },
    articleBody: {
        fontSize: 16,
        lineHeight: 1.8,
        color: '#e2e8f0',
    },
    paragraph: {
        marginBottom: 20,
        color: '#e2e8f0',
    },
    inlineFigure: {
        margin: '32px 0',
        borderRadius: 16,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
    },
    inlineImage: {
        width: '100%',
        maxHeight: 450,
        objectFit: 'cover',
        display: 'block',
    },
    figcaption: {
        padding: '12px 16px',
        textAlign: 'center',
        fontSize: 13,
        color: '#94a3b8',
        background: 'rgba(0, 0, 0, 0.2)',
    },
    authorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 24,
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: 16,
        marginTop: 40,
    },
    authorAvatar: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 22,
        flexShrink: 0,
    },
    authorName: {
        margin: '0 0 4px',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
    },
    authorEmail: {
        margin: 0,
        color: '#94a3b8',
        fontSize: 14,
    },
};
