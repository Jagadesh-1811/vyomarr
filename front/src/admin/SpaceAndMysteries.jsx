import React, { useEffect, useRef, useState } from "react";
import { Upload, AlertCircle, X, LayoutDashboard, LogOut, Youtube, Loader2, CheckCircle, Image, ChevronDown, Clock, Calendar } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// SubCategory options for Space & Mysteries
const subCategories = [
  { id: 'black-holes', label: 'Black Holes' },
  { id: 'dark-matter', label: 'Dark Matter' },
  { id: 'exoplanets', label: 'Exoplanets' },
  { id: 'cosmic-events', label: 'Cosmic Events' },
  { id: 'relativity', label: 'Relativity' },
  { id: 'aerospace', label: 'Aerospace' },
  { id: 'propulsion', label: 'Propulsion' },
  { id: 'colonization', label: 'Colonization' },
  { id: 'altphysics', label: 'AltPhysics' },
  { id: 'quantum', label: 'Quantum' },
  { id: 'ai', label: 'AI' },
  { id: 'evolution', label: 'Evolution' },
  { id: 'megastructures', label: 'Megastructures' },
  { id: 'multiverse', label: 'Multiverse' },
];

export function SpaceAndMysteries({ onLogout }) {
  const [formData, setFormData] = useState({ title: '', subHeading: '', content: '', youtubeEmbed: '', subCategory: '' });
  const [publishMode, setPublishMode] = useState('now'); // 'now' or 'schedule'
  const [scheduledDate, setScheduledDate] = useState('');
  const [debouncedEmbed, setDebouncedEmbed] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isThumbnailDragging, setIsThumbnailDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const MAX_IMAGES = 4;
  const MAX_SIZE_MB = 1;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:3000') + '/api';

  // Rich text editor modules with comprehensive formatting options
  // Note: Formatting only applies to SELECTED TEXT - this is default Quill behavior
  const quillModules = {
    toolbar: {
      container: [
        // Headers dropdown: Heading 1, 2, 3, and Normal (false = paragraph)
        [{ 'header': [1, 2, 3, false] }],

        // Font styling: Bold, Italic, Underline, Strikethrough
        ['bold', 'italic', 'underline', 'strike'],

        // Block quotes and code blocks
        ['blockquote', 'code-block'],

        // Lists: Ordered and Bullet
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],

        // Text indentation
        [{ 'indent': '-1' }, { 'indent': '+1' }],

        // Text alignment: Left, Center, Right, Justify
        [{ 'align': [] }],

        // Color and background highlight
        [{ 'color': [] }, { 'background': [] }],

        // Links and images
        ['link'],

        // Clear formatting
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false // Prevents extra whitespace on paste
    }
  };

  // Formats that the editor should recognize
  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align',
    'color', 'background',
    'link'
  ];

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEmbed(formData.youtubeEmbed), 1000);
    return () => clearTimeout(timer);
  }, [formData.youtubeEmbed]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => setSubmitStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // Thumbnail handling
  const processThumbnail = (file) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, thumbnail: "Only image files are allowed." }));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrors(prev => ({ ...prev, thumbnail: `File too large. Max ${MAX_SIZE_MB}MB.` }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setThumbnail({ file, preview: reader.result });
    reader.readAsDataURL(file);
    setErrors(prev => ({ ...prev, thumbnail: null }));
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) processThumbnail(file);
  };

  const removeThumbnail = () => setThumbnail(null);

  const processFiles = (newFiles) => {
    let newErrors = {};
    if (images.length + newFiles.length > MAX_IMAGES) {
      newErrors.images = `Max ${MAX_IMAGES} images allowed.`;
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    newFiles.forEach(file => {
      if (!file.type.startsWith('image/')) {
        newErrors.images = "Only image files are allowed.";
      } else if (file.size > MAX_SIZE_BYTES) {
        newErrors.images = `File too large. Max ${MAX_SIZE_MB}MB.`;
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setImages(prev => [...prev, { file, preview: reader.result, description: '' }]);
        reader.readAsDataURL(file);
      }
    });
    if (Object.keys(newErrors).length) setErrors(prev => ({ ...prev, ...newErrors }));
    else setErrors(prev => ({ ...prev, images: null }));
  };

  // Handle image description change
  const handleImageDescriptionChange = (index, description) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, description } : img));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files || []);
    processFiles(files);
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();

      // Map to SpaceMystery model fields
      formDataToSend.append('category', formData.subCategory); // e.g., "black-holes", "relativity"
      formDataToSend.append('categoryLabel', subCategories.find(cat => cat.id === formData.subCategory)?.label || formData.subCategory);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subHeading', formData.subHeading || ''); // Subtitle/subheading
      formDataToSend.append('description', formData.content); // content maps to description
      formDataToSend.append('author', 'Vyomarr Team');
      formDataToSend.append('readTime', '5 min read');
      formDataToSend.append('youtubeEmbed', formData.youtubeEmbed);

      // Handle scheduling
      if (publishMode === 'schedule' && scheduledDate) {
        formDataToSend.append('scheduledFor', scheduledDate);
        formDataToSend.append('status', 'scheduled');
      } else {
        formDataToSend.append('status', 'published');
      }

      // Append thumbnail as 'image' for SpaceMystery model
      if (thumbnail) {
        formDataToSend.append('image', thumbnail.file);
      }
      // Append additional images and their descriptions
      const imageDescriptions = images.map(img => img.description || '');
      formDataToSend.append('imageDescriptions', JSON.stringify(imageDescriptions));
      images.forEach((img, idx) => {
        formDataToSend.append('images', img.file);
      });

      const response = await fetch(`${API_URL}/spacemysteries`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ title: '', subHeading: '', content: '', youtubeEmbed: '', subCategory: '' });
        setThumbnail(null);
        setImages([]);
        setPublishMode('now');
        setScheduledDate('');
        console.log('Space Mystery created:', result);
      } else {
        throw new Error(result.error || 'Failed to create mystery');
      }
    } catch (error) {
      console.error('Error creating mystery:', error);
      setSubmitStatus('error');
      setErrors(prev => ({ ...prev, submit: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vy-blog-wrap">
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <header style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #fc4c00, #ff6a2b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none'
              }}>
                <LayoutDashboard size={22} color="#fff" />
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Space & Mysteries</h1>
            </div>
            <p style={{ margin: '8px 0 0 56px', color: '#bfc3c6', fontSize: 14 }}>Admin Panel / <span style={{ color: '#fc4c00' }}>Space & Mysteries</span></p>
          </div>
          <button onClick={onLogout} className="vy-logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div className="vy-card">
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 22 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#e2e8f0', fontFamily: "'Montserrat', sans-serif" }}>Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="vy-input"
                placeholder="Enter an engaging title..."
                required
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: '16px',
                  letterSpacing: '-0.3px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#e2e8f0' }}>Sub Category</label>
              <div style={{ position: 'relative' }}>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="vy-input"
                  style={{
                    appearance: 'none',
                    paddingRight: 40,
                    cursor: 'pointer',
                    background: 'rgba(30, 41, 59, 0.8)'
                  }}
                  required
                >
                  <option value="" disabled>Select a sub category...</option>
                  {subCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#94a3b8'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#e2e8f0', fontFamily: "'Lato', sans-serif" }}>Sub Heading</label>
              <input
                name="subHeading"
                value={formData.subHeading}
                onChange={handleInputChange}
                className="vy-input"
                placeholder="A brief sub heading..."
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 500,
                  fontSize: '15px',
                  fontStyle: 'italic'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#e2e8f0', fontFamily: "'Roboto Mono', monospace" }}>Content (Rich Text Editor)</label>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#94a3b8' }}>
                <strong style={{ color: '#fc4c00' }}>💡 Tip:</strong> Select text first, then click formatting buttons (H1, Bold, etc.) to apply styles to only the selected text.
              </p>
              <div className="vy-editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write your cosmic content here... Select text and use the toolbar above to format it."
                />
              </div>
              <style>{`
                .vy-editor-wrapper {
                  background: rgba(30, 41, 59, 0.8);
                  border: 1px solid rgba(139, 92, 246, 0.3);
                  border-radius: 12px;
                  overflow: hidden;
                  transition: all 0.3s ease;
                }
                .vy-editor-wrapper:focus-within {
                  border-color: #8b5cf6;
                  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2), 0 4px 12px rgba(139, 92, 246, 0.15);
                }
                .vy-editor-wrapper .quill {
                  font-family: 'Lato', sans-serif;
                }
                .vy-editor-wrapper .ql-toolbar {
                  background: rgba(15, 23, 42, 0.9);
                  border: none;
                  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
                  padding: 12px;
                }
                .vy-editor-wrapper .ql-container {
                  border: none;
                  font-size: 15px;
                  min-height: 250px;
                }
                .vy-editor-wrapper .ql-editor {
                  color: #e2e8f0;
                  padding: 1.5rem;
                  min-height: 250px;
                  line-height: 1.7;
                }
                .vy-editor-wrapper .ql-editor.ql-blank::before {
                  color: #64748b;
                  opacity: 0.8;
                  font-style: italic;
                }
                .vy-editor-wrapper .ql-stroke {
                  stroke: #94a3b8;
                }
                .vy-editor-wrapper .ql-fill {
                  fill: #94a3b8;
                }
                .vy-editor-wrapper .ql-picker-label,
                .vy-editor-wrapper .ql-picker-item {
                  color: #94a3b8;
                }
                .vy-editor-wrapper .ql-toolbar button:hover .ql-stroke,
                .vy-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
                  stroke: #fc4c00;
                }
                .vy-editor-wrapper .ql-toolbar button:hover .ql-fill,
                .vy-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
                  fill: #fc4c00;
                }
                .vy-editor-wrapper .ql-picker-label:hover,
                .vy-editor-wrapper .ql-picker-item:hover {
                  color: #fc4c00;
                }
                /* Header styles in editor */
                .vy-editor-wrapper .ql-editor h1 {
                  font-size: 2rem;
                  font-weight: 700;
                  color: #fff;
                  margin: 1rem 0;
                }
                .vy-editor-wrapper .ql-editor h2 {
                  font-size: 1.5rem;
                  font-weight: 600;
                  color: #fff;
                  margin: 0.875rem 0;
                }
                .vy-editor-wrapper .ql-editor h3 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  color: #e2e8f0;
                  margin: 0.75rem 0;
                }
                /* Blockquote styling */
                .vy-editor-wrapper .ql-editor blockquote {
                  border-left: 4px solid #fc4c00;
                  padding-left: 1rem;
                  margin: 1rem 0;
                  color: #a78bfa;
                  font-style: italic;
                }
                /* Code block styling */
                .vy-editor-wrapper .ql-editor pre.ql-syntax {
                  background: rgba(15, 23, 42, 0.95);
                  border: 1px solid rgba(139, 92, 246, 0.3);
                  border-radius: 8px;
                  padding: 1rem;
                  font-family: 'Roboto Mono', 'Consolas', monospace;
                  font-size: 13px;
                  color: #22d3ee;
                  overflow-x: auto;
                }
                /* Link styling */
                .vy-editor-wrapper .ql-editor a {
                  color: #fc4c00;
                  text-decoration: underline;
                }
                /* Strikethrough styling */
                .vy-editor-wrapper .ql-editor s {
                  text-decoration: line-through;
                  opacity: 0.7;
                }
                /* Color picker dropdown styling */
                .vy-editor-wrapper .ql-picker.ql-color .ql-picker-options,
                .vy-editor-wrapper .ql-picker.ql-background .ql-picker-options {
                  background: rgba(15, 23, 42, 0.98);
                  border: 1px solid rgba(139, 92, 246, 0.3);
                  border-radius: 8px;
                  padding: 8px;
                }
                /* Toolbar button groups with separator */
                .vy-editor-wrapper .ql-toolbar .ql-formats {
                  margin-right: 12px;
                  padding-right: 12px;
                  border-right: 1px solid rgba(139, 92, 246, 0.15);
                }
                .vy-editor-wrapper .ql-toolbar .ql-formats:last-child {
                  border-right: none;
                }
                /* Active button state */
                .vy-editor-wrapper .ql-toolbar button.ql-active {
                  background: rgba(252, 76, 0, 0.2);
                  border-radius: 4px;
                }
                /* Header picker dropdown */
                .vy-editor-wrapper .ql-picker.ql-header .ql-picker-options {
                  background: rgba(15, 23, 42, 0.98);
                  border: 1px solid rgba(139, 92, 246, 0.3);
                  border-radius: 8px;
                  padding: 4px;
                }
                .vy-editor-wrapper .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
                  content: 'Heading 1';
                }
                .vy-editor-wrapper .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
                  content: 'Heading 2';
                }
                .vy-editor-wrapper .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
                  content: 'Heading 3';
                }
                .vy-editor-wrapper .ql-picker.ql-header .ql-picker-item::before {
                  content: 'Normal';
                }
              `}</style>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 600, color: '#e2e8f0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Image size={18} color="#fc4c00" /> Thumbnail (Card Image)
                </span>
                <small style={{ color: '#94a3b8', fontWeight: 400 }}>Shown on article cards</small>
              </label>
              <div
                className="vy-upload-zone"
                onDragOver={(e) => { e.preventDefault(); setIsThumbnailDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsThumbnailDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsThumbnailDragging(false); handleThumbnailSelect(e); }}
                onClick={() => thumbnailInputRef.current?.click()}
                style={{
                  marginTop: 4,
                  background: isThumbnailDragging ? 'rgba(252, 76, 0, 0.15)' : undefined,
                  borderColor: isThumbnailDragging ? '#fc4c00' : thumbnail ? '#10b981' : undefined,
                  minHeight: thumbnail ? 'auto' : undefined
                }}
              >
                <input ref={thumbnailInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbnailSelect} />
                {thumbnail ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={thumbnail.preview}
                      alt="Thumbnail preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 180,
                        borderRadius: 10,
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeThumbnail(); }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: '#fff',
                        borderRadius: '50%',
                        border: 'none',
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(252, 76, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image size={22} color="#fc4c00" />
                    </div>
                    <span style={{ color: '#94a3b8' }}>Click or drag thumbnail image here</span>
                    <small style={{ color: '#64748b', fontSize: 12 }}>This image will be shown on the article card</small>
                  </div>
                )}
              </div>
              {errors.thumbnail && <div style={{ color: '#f87171', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}><AlertCircle size={14} /> {errors.thumbnail}</div>}
            </div>

            {/* Gallery Images */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 600, color: '#e2e8f0' }}>
                <span>Gallery Images ({images.length}/{MAX_IMAGES})</span>
                <small style={{ color: '#94a3b8', fontWeight: 400 }}>Shown in article • Max {MAX_SIZE_MB}MB / file</small>
              </label>
              <div
                className="vy-upload-zone"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e); }}
                onClick={() => fileInputRef.current?.click()}
                style={{ marginTop: 4, background: isDragging ? 'rgba(139, 92, 246, 0.15)' : undefined, borderColor: isDragging ? '#8b5cf6' : undefined }}
              >
                <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(139, 92, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Upload size={22} color="#a78bfa" />
                  </div>
                  <span style={{ color: '#94a3b8' }}>Click or drag images here</span>
                </div>
              </div>
              {errors.images && <div style={{ color: '#f87171', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}><AlertCircle size={14} /> {errors.images}</div>}
              {images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 16 }}>
                  {images.map((img, i) => (
                    <div key={i} style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      borderRadius: 12,
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      overflow: 'hidden'
                    }}>
                      {/* Image Preview */}
                      <div style={{ position: 'relative', height: 140 }}>
                        <img src={img.preview} alt={`preview-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'rgba(239, 68, 68, 0.9)',
                            color: '#fff',
                            borderRadius: '50%',
                            border: 'none',
                            width: 26,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}
                        >
                          <X size={14} />
                        </button>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '4px 10px',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          Image {i + 1}
                        </div>
                      </div>
                      {/* Description Input */}
                      <div style={{ padding: 12 }}>
                        <label style={{
                          display: 'block',
                          marginBottom: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#a78bfa',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5
                        }}>
                          Description
                        </label>
                        <textarea
                          value={img.description}
                          onChange={(e) => handleImageDescriptionChange(i, e.target.value)}
                          placeholder={`Describe what's shown in image ${i + 1}...`}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: 8,
                            color: '#e2e8f0',
                            fontSize: 13,
                            resize: 'vertical',
                            minHeight: 70,
                            outline: 'none',
                            fontFamily: "'Roboto Mono', monospace",
                            fontStyle: 'italic',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                          onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)'}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={{ marginBottom: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0' }}>
                <Youtube size={20} color="#ef4444" /> YouTube Embed
              </label>
              <textarea name="youtubeEmbed" value={formData.youtubeEmbed} onChange={handleInputChange} className="vy-textarea" rows={3} placeholder='<iframe src="..."></iframe>' style={{ fontFamily: 'monospace', fontSize: 13 }} />
              {debouncedEmbed && (
                <div style={{ marginTop: 14, background: 'rgba(139, 92, 246, 0.1)', padding: 14, borderRadius: 10, border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <p style={{ margin: '0 0 10px', fontSize: 12, color: '#a78bfa', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>Preview:</p>
                  <div style={{ overflow: 'hidden', borderRadius: 8 }} dangerouslySetInnerHTML={{ __html: debouncedEmbed }} />
                </div>
              )}
            </div>

            {/* Scheduling Section */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 12,
              padding: 20
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 600, color: '#e2e8f0' }}>
                <Clock size={18} color="#8b5cf6" /> Publication Schedule
              </label>

              <div style={{ display: 'flex', gap: 20, marginBottom: publishMode === 'schedule' ? 16 : 0 }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: publishMode === 'now' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: publishMode === 'now' ? '2px solid #10b981' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name="publishMode"
                    value="now"
                    checked={publishMode === 'now'}
                    onChange={() => setPublishMode('now')}
                    style={{ display: 'none' }}
                  />
                  <CheckCircle size={18} color={publishMode === 'now' ? '#10b981' : '#64748b'} />
                  <span style={{ color: publishMode === 'now' ? '#10b981' : '#94a3b8', fontWeight: 500 }}>Publish Now</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 20px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: publishMode === 'schedule' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: publishMode === 'schedule' ? '2px solid #8b5cf6' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name="publishMode"
                    value="schedule"
                    checked={publishMode === 'schedule'}
                    onChange={() => setPublishMode('schedule')}
                    style={{ display: 'none' }}
                  />
                  <Calendar size={18} color={publishMode === 'schedule' ? '#8b5cf6' : '#64748b'} />
                  <span style={{ color: publishMode === 'schedule' ? '#a78bfa' : '#94a3b8', fontWeight: 500 }}>Schedule for Later</span>
                </label>
              </div>

              {publishMode === 'schedule' && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: 16,
                  borderRadius: 10,
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>
                    Select Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                    className="vy-input"
                    style={{
                      maxWidth: 300,
                      colorScheme: 'dark'
                    }}
                    required={publishMode === 'schedule'}
                  />
                  {scheduledDate && (
                    <p style={{ margin: '12px 0 0', fontSize: 13, color: '#64748b' }}>
                      📅 Article will be published on: <strong style={{ color: '#a78bfa' }}>{new Date(scheduledDate).toLocaleString()}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div style={{ paddingTop: 16, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
              {/* Success Message */}
              {submitStatus === 'success' && (
                <div style={{ marginBottom: 14, padding: 14, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, color: '#34d399' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontWeight: 500 }}>Post {publishMode === 'schedule' ? 'scheduled' : 'published'} successfully!</span>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && errors.submit && (
                <div style={{ marginBottom: 14, padding: 14, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, color: '#f87171' }}>
                  <AlertCircle size={18} />
                  <span style={{ fontWeight: 500 }}>{errors.submit}</span>
                </div>
              )}

              <div style={{ textAlign: 'right' }}>
                <button type="submit" className="vy-btn" disabled={isSubmitting || (publishMode === 'schedule' && !scheduledDate)} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, opacity: isSubmitting ? 0.7 : 1, minWidth: 180 }}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      {publishMode === 'schedule' ? 'Scheduling...' : 'Publishing...'}
                    </>
                  ) : (
                    publishMode === 'schedule' ? '📅 Schedule Post' : '✨ Publish Post'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SpaceAndMysteries;