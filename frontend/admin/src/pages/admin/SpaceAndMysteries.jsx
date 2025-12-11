import React, { useEffect, useRef, useState } from "react";
import { Upload, AlertCircle, X, LayoutDashboard, LogOut, Youtube, Loader2, CheckCircle, Image } from 'lucide-react';

export function SpaceAndMysteries({ onLogout }) {
  const [formData, setFormData] = useState({ title: '', subHeading: '', content: '', youtubeEmbed: '' });
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
  const API_URL = 'http://localhost:3000/api';

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
        reader.onloadend = () => setImages(prev => [...prev, { file, preview: reader.result }]);
        reader.readAsDataURL(file);
      }
    });
    if (Object.keys(newErrors).length) setErrors(prev => ({ ...prev, ...newErrors }));
    else setErrors(prev => ({ ...prev, images: null }));
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
      formDataToSend.append('category', 'Space & Mysteries');
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subHeading', formData.subHeading);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('youtubeEmbed', formData.youtubeEmbed);

      // Append thumbnail
      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail.file);
      }

      // Append gallery images
      images.forEach((img) => {
        formDataToSend.append('images', img.file);
      });

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ title: '', subHeading: '', content: '', youtubeEmbed: '' });
        setThumbnail(null);
        setImages([]);
        console.log('Post created:', result);
      } else {
        throw new Error(result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
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
                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
              }}>
                <LayoutDashboard size={22} color="#fff" />
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Space & Mysteries</h1>
            </div>
            <p style={{ margin: '8px 0 0 56px', color: '#94a3b8', fontSize: 14 }}>Admin Panel / <span style={{ color: '#a78bfa' }}>Space & Mysteries</span></p>
          </div>
          <button onClick={onLogout} className="vy-logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div className="vy-card">
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 22 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#e2e8f0' }}>Title</label>
              <input name="title" value={formData.title} onChange={handleInputChange} className="vy-input" placeholder="Enter an engaging title..." required />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#e2e8f0' }}>Sub Heading</label>
              <input name="subHeading" value={formData.subHeading} onChange={handleInputChange} className="vy-input" placeholder="A brief sub heading..." />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#e2e8f0' }}>Content</label>
              <textarea name="content" value={formData.content} onChange={handleInputChange} className="vy-textarea" rows={6} placeholder="Write your cosmic content here..." required />
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
                <div className="vy-grid">
                  {images.map((img, i) => (
                    <div key={i} className="vy-img-preview">
                      <img src={img.preview} alt={`preview-${i}`} />
                      <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239, 68, 68, 0.9)', color: '#fff', borderRadius: '50%', border: 'none', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                        <X size={12} />
                      </button>
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

            <div style={{ paddingTop: 16, borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
              {/* Success Message */}
              {submitStatus === 'success' && (
                <div style={{ marginBottom: 14, padding: 14, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, color: '#34d399' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontWeight: 500 }}>Post published successfully!</span>
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
                <button type="submit" className="vy-btn" disabled={isSubmitting} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, opacity: isSubmitting ? 0.7 : 1, minWidth: 160 }}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Publishing...
                    </>
                  ) : (
                    '✨ Publish Post'
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