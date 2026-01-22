import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, Edit2, Loader2, Layout, Image as ImageIcon, XSquare, PlusCircle, MinusCircle } from 'lucide-react';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

export function HeroEditor() {
    const [loading, setLoading] = useState(true);
    const [slides, setSlides] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        heading: '',
        subHeading: '',
        alignment: 'center', // Default
    });
    // Custom buttons array - starts empty for new banners
    const [customButtons, setCustomButtons] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Editing state
    const [editingId, setEditingId] = useState(null);

    // Add a new custom button
    const addCustomButton = () => {
        setCustomButtons([...customButtons, { text: '', link: '' }]);
    };

    // Remove a custom button
    const removeCustomButton = (index) => {
        setCustomButtons(customButtons.filter((_, i) => i !== index));
    };

    // Update a custom button
    const updateCustomButton = (index, field, value) => {
        const updated = [...customButtons];
        updated[index][field] = value;
        setCustomButtons(updated);
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch(`${API_URL}/api/config/home_hero`);
            const json = await res.json();

            if (json.data && json.data.slides) {
                setSlides(json.data.slides);
            } else if (json.data && json.data.heading) {
                // Legacy support
                setSlides([{ ...json.data, id: 'legacy' }]);
            } else {
                setSlides([]);
            }
        } catch (error) {
            console.error('Error fetching hero config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const startEditing = (slide) => {
        setEditingId(slide.id);
        setFormData({
            heading: slide.heading || '',
            subHeading: slide.subHeading || '',
            alignment: slide.alignment || 'center',
        });

        // Load custom buttons - support both new format and legacy primary/secondary
        if (slide.customButtons && Array.isArray(slide.customButtons)) {
            setCustomButtons(slide.customButtons);
        } else if (slide.primaryButtonText || slide.secondaryButtonText) {
            // Convert legacy format to custom buttons
            const legacyButtons = [];
            if (slide.primaryButtonText) {
                legacyButtons.push({ text: slide.primaryButtonText, link: slide.primaryButtonLink || '' });
            }
            if (slide.secondaryButtonText) {
                legacyButtons.push({ text: slide.secondaryButtonText, link: slide.secondaryButtonLink || '' });
            }
            setCustomButtons(legacyButtons);
        } else {
            setCustomButtons([]);
        }

        setPreviewImage(slide.backgroundImageUrl);
        setImageFile(null);

        // Scroll to form
        document.getElementById('slide-form').scrollIntoView({ behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setFormData({
            heading: '',
            subHeading: '',
            alignment: 'center',
        });
        setCustomButtons([]); // Reset custom buttons
        setPreviewImage(null);
        setImageFile(null);
    };

    const handleSubmit = async () => {
        try {
            if (!formData.heading) return alert('Heading is required');

            setSubmitting(true);
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            // Add custom buttons as JSON string
            data.append('customButtons', JSON.stringify(customButtons));

            if (imageFile) {
                data.append('image', imageFile);
            }

            let res;
            if (editingId) {
                // Update existing
                res = await fetch(`${API_URL}/api/config/hero/slides/${editingId}`, {
                    method: 'PUT',
                    body: data
                });
            } else {
                // Create new
                res = await fetch(`${API_URL}/api/config/hero/slides`, {
                    method: 'POST',
                    body: data
                });
            }

            if (res.ok) {
                const json = await res.json();
                setSlides(json.data.slides);
                cancelEditing(); // Reset form
                alert(editingId ? 'Banner updated successfully!' : 'New banner added successfully!');
            } else {
                const err = await res.json();
                alert('Failed operation: ' + (err.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving changes');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSlide = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) return;
        if (id === 'legacy') return alert('Cannot delete legacy slide directly. Add a new one first.');

        try {
            const res = await fetch(`${API_URL}/api/config/hero/slides/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                const json = await res.json();
                setSlides(json.data.slides);
                if (editingId === id) cancelEditing();
            } else {
                alert('Failed to delete slide');
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Loader2 size={40} className="animate-spin" color="#a78bfa" />
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>
                    <Layout size={24} color="#a78bfa" />
                    Hero Banners ({slides.length})
                </h2>
                <p style={styles.subtitle}>Add multiple banners to create a sliding carousel on the homepage.</p>
            </div>

            {/* List of Active Slides */}
            <div style={styles.slidesList}>
                {slides.length === 0 && (
                    <div style={styles.emptyState}>No banners active. The homepage is showing the default fallback.</div>
                )}

                {slides.map((slide, idx) => (
                    <div key={slide.id || idx} style={styles.slideCard}>
                        <div style={styles.slideImageContainer}>
                            <img
                                src={slide.backgroundImageUrl || "/assets/images/hero-banner.png"}
                                alt="Slide"
                                style={styles.slideImage}
                            />
                            <div style={styles.slideOverlay}>Slide {idx + 1}</div>
                        </div>
                        <div style={styles.slideInfo}>
                            <h4 style={styles.slideHeading}>{slide.heading}</h4>
                            <p style={styles.slideSub}>{slide.subHeading?.substring(0, 60)}...</p>
                            <div style={styles.slideMeta}>
                                {/* Show custom buttons if available, otherwise show legacy buttons */}
                                {slide.customButtons && Array.isArray(slide.customButtons) && slide.customButtons.length > 0 ? (
                                    slide.customButtons.map((btn, i) => (
                                        <span key={i} style={styles.badge}>
                                            {btn.text || 'Button'}: {btn.link || 'No link'}
                                        </span>
                                    ))
                                ) : (
                                    <>
                                        {slide.primaryButtonText && (
                                            <span style={styles.badge}>Primary: {slide.primaryButtonText}</span>
                                        )}
                                        {slide.secondaryButtonText && (
                                            <span style={styles.badge}>Secondary: {slide.secondaryButtonText}</span>
                                        )}
                                        {!slide.primaryButtonText && !slide.secondaryButtonText && (
                                            <span style={{ ...styles.badge, color: '#64748b' }}>No buttons</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div style={styles.actionButtons}>
                            <button
                                onClick={() => startEditing(slide)}
                                style={styles.editButton}
                                title="Edit Banner"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDeleteSlide(slide.id)}
                                style={styles.deleteButton}
                                title="Delete Banner"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div id="slide-form" style={styles.formContainer}>
                <div style={styles.formHeader}>
                    <h3 style={styles.sectionTitle}>
                        {editingId ? 'Edit Banner' : 'Add New Banner'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEditing} style={styles.cancelButton}>
                            <XSquare size={16} /> Cancel Editing
                        </button>
                    )}
                </div>

                <div style={styles.formSection}>
                    <div style={styles.row}>
                        <div style={styles.group}>
                            <label style={styles.label}>Heading</label>
                            <input
                                type="text"
                                value={formData.heading}
                                onChange={e => setFormData({ ...formData, heading: e.target.value })}
                                style={styles.input}
                                placeholder="e.g. Discover the Void"
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.group}>
                            <label style={styles.label}>Sub Heading</label>
                            <textarea
                                value={formData.subHeading}
                                onChange={e => setFormData({ ...formData, subHeading: e.target.value })}
                                style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                                placeholder="Description text..."
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.group}>
                            <label style={styles.label}>Text Alignment</label>
                            <div style={styles.alignmentOptions}>
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => setFormData({ ...formData, alignment: align })}
                                        style={{
                                            ...styles.alignButton,
                                            background: formData.alignment === align ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
                                            color: formData.alignment === align ? 'white' : '#94a3b8',
                                            borderColor: formData.alignment === align ? '#8b5cf6' : 'rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        {align.charAt(0).toUpperCase() + align.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Custom Buttons Section */}
                    <div style={styles.customButtonsSection}>
                        <div style={styles.customButtonsHeader}>
                            <label style={styles.label}>Custom Buttons</label>
                            <button
                                type="button"
                                onClick={addCustomButton}
                                style={styles.addButtonSmall}
                            >
                                <PlusCircle size={16} /> Add Button
                            </button>
                        </div>

                        {customButtons.length === 0 && (
                            <p style={styles.noButtonsText}>No buttons added. Click "Add Button" to add a custom button.</p>
                        )}

                        {customButtons.map((btn, index) => (
                            <div key={index} style={styles.customButtonRow}>
                                <div style={styles.customButtonInputs}>
                                    <input
                                        type="text"
                                        value={btn.text}
                                        onChange={e => updateCustomButton(index, 'text', e.target.value)}
                                        style={styles.input}
                                        placeholder="Button Text (e.g. Explore)"
                                    />
                                    <input
                                        type="text"
                                        value={btn.link}
                                        onChange={e => updateCustomButton(index, 'link', e.target.value)}
                                        style={{ ...styles.input, marginTop: 8 }}
                                        placeholder="Button Route (e.g. /about)"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCustomButton(index)}
                                    style={styles.removeButtonSmall}
                                    title="Remove button"
                                >
                                    <MinusCircle size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={styles.imageSection}>
                        <div style={styles.imagePreviewContainer}>
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" style={styles.previewImage} />
                            ) : (
                                <div style={styles.placeholderImage}>
                                    <ImageIcon size={40} color="#64748b" />
                                    <span>No Image</span>
                                </div>
                            )}
                        </div>
                        <div style={styles.uploadArea}>
                            <input
                                type="file"
                                id="hero-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="hero-upload" style={styles.uploadButton}>
                                <Upload size={18} />
                                {previewImage ? 'Change Image' : 'Upload Background'}
                            </label>
                        </div>
                    </div>

                    <div style={styles.actions}>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={styles.saveButton}
                        >
                            {submitting ? (
                                <><Loader2 size={18} className="animate-spin" /> Saving...</>
                            ) : (
                                editingId ? <><Edit2 size={18} /> Update Banner</> : <><Plus size={18} /> Add Banner Slide</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: 24,
        background: 'transparent',
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginLeft: 36,
    },
    slidesList: {
        marginBottom: 40,
        display: 'grid',
        gap: 16,
    },
    slideCard: {
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        gap: 20,
        alignItems: 'center',
    },
    slideImageContainer: {
        width: 160,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
    },
    slideImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    slideOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.5)',
        color: 'white',
        fontSize: 10,
        padding: '2px 6px',
    },
    slideInfo: {
        flex: 1,
    },
    slideHeading: {
        color: '#f8fafc',
        fontSize: 16,
        margin: '0 0 4px 0',
    },
    slideSub: {
        color: '#94a3b8',
        fontSize: 13,
        margin: '0 0 8px 0',
    },
    slideMeta: {
        display: 'flex',
        gap: 8,
    },
    badge: {
        fontSize: 11,
        background: 'rgba(255,255,255,0.05)',
        padding: '2px 8px',
        borderRadius: 4,
        color: '#cbd5e1',
    },
    actionButtons: {
        display: 'flex',
        gap: 8,
    },
    editButton: {
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#a78bfa',
        border: 'none',
        padding: 10,
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    deleteButton: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: 'none',
        padding: 10,
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    emptyState: {
        padding: 40,
        textAlign: 'center',
        color: '#64748b',
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: 12,
        border: '1px dashed rgba(255,255,255,0.1)',
    },
    formContainer: {
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 32,
        maxWidth: 800,
    },
    formHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#a78bfa',
        margin: 0,
    },
    cancelButton: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#cbd5e1',
        padding: '6px 12px',
        borderRadius: 6,
        fontSize: 12,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6
    },
    formSection: {},
    group: {
        marginBottom: 20,
        flex: 1,
    },
    label: {
        display: 'block',
        color: '#e2e8f0',
        fontSize: 14,
        fontWeight: 500,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: 8,
        color: '#f8fafc',
        fontSize: 14,
        outline: 'none',
    },
    row: { marginBottom: 4 },
    dualRow: { display: 'flex', gap: 20, marginBottom: 4 },
    imageSection: {
        display: 'flex',
        gap: 24,
        alignItems: 'start',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: 20,
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: 24,
    },
    imagePreviewContainer: {
        width: 140,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: { width: '100%', height: '100%', objectFit: 'cover' },
    placeholderImage: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 11 },
    uploadArea: { flex: 1, paddingTop: 8 },
    uploadButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        background: 'rgba(139, 92, 246, 0.15)',
        color: '#a78bfa',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 500,
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    saveButton: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
        color: 'white',
        border: 'none',
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
    },
    alignmentOptions: {
        display: 'flex',
        gap: 12,
    },
    alignButton: {
        padding: '8px 16px',
        borderRadius: 8,
        border: '1px solid',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        transition: 'all 0.2s',
        textTransform: 'capitalize'
    },
    // Custom buttons section styles
    customButtonsSection: {
        marginBottom: 24,
        background: 'rgba(0, 0, 0, 0.2)',
        padding: 20,
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    customButtonsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addButtonSmall: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        background: 'rgba(34, 197, 94, 0.15)',
        color: '#22c55e',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        transition: 'all 0.2s',
    },
    removeButtonSmall: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    customButtonRow: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    customButtonInputs: {
        flex: 1,
    },
    noButtonsText: {
        color: '#64748b',
        fontSize: 13,
        margin: 0,
        fontStyle: 'italic',
    },
};
