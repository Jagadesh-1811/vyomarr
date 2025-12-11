import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Send, Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './WhatIf.css';

const API_URL = 'http://localhost:3000/api';

const CATEGORIES = [
  'Time Travel',
  'Alien Contact',
  'Physics Breaking',
  'Colonization',
  'Multiverse',
  'Other'
];

export default function WhatIf() {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Time Travel',
    description: '',
    authorName: '',
    authorEmail: '',
    image: null
  });

  useEffect(() => {
    fetchTheories();
  }, []);

  const fetchTheories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/whatif`);
      if (response.ok) {
        const data = await response.json();
        setTheories(data);
      }
    } catch (err) {
      console.error('Failed to fetch theories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    setImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.authorEmail) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('authorName', formData.authorName);
      data.append('authorEmail', formData.authorEmail);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch(`${API_URL}/whatif`, {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit theory. Please try again.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit theory. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
    setFormData({
      title: '',
      category: 'Time Travel',
      description: '',
      authorName: '',
      authorEmail: '',
      image: null
    });
    removeImage();
  };

  const filteredTheories = activeFilter === 'all' 
    ? theories 
    : theories.filter(t => t.category.toLowerCase().includes(activeFilter.toLowerCase()));

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Navbar />
      
      {/* Background Animation */}
      <div className="whatif-background">
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
        <div className="orbit-ring ring-3"></div>
        <div className="starfield">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="star" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="whatif-container">
        {/* Hero Section */}
        <header className="whatif-hero">
          <h1>What If <span>Scenarios</span></h1>
          <p>
            Explore speculative space theories and submit your own hypothetical scenarios for community discussion.
            Where science meets imagination.
          </p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            Submit Your Theory
          </button>
        </header>

        {/* Filter Bar */}
        <div className="filter-bar">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Theories Grid */}
        {loading ? (
          <div className="whatif-loading">
            <Loader2 size={48} className="spin" />
            <p>Loading theories...</p>
          </div>
        ) : theories.length === 0 ? (
          <div className="whatif-empty">
            <AlertCircle size={64} />
            <h3>No theories yet</h3>
            <p>Be the first to submit a What If scenario!</p>
          </div>
        ) : (
          <div className="theories-grid">
            {filteredTheories.map(theory => (
              <article key={theory._id} className="theory-card">
                {theory.imageUrl ? (
                  <img src={theory.imageUrl} alt={theory.title} className="theory-card__img" />
                ) : (
                  <div className="theory-card__img theory-card__placeholder">
                    <span>🚀</span>
                  </div>
                )}
                <div className="theory-card__content">
                  <span className="theory-card__tag">{theory.category.toUpperCase()}</span>
                  <h3>{theory.title}</h3>
                  <p>{theory.description.substring(0, 120)}...</p>
                  <div className="theory-card__meta">
                    <span>👤 {theory.authorName || 'Anonymous'}</span>
                    <span>{getRelativeTime(theory.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>

            {!submitted ? (
              <div className="form-container">
                <h2>Submit Your Theory</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      placeholder="Your name (optional)"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="authorEmail"
                      value={formData.authorEmail}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                    <small>We'll notify you when your theory is reviewed</small>
                  </div>

                  <div className="form-group">
                    <label>Scenario Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="E.g., What if the moon disappeared?"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      name="category" 
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe the scientific basis and hypothetical outcome..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Upload Image (Optional)</label>
                    {!imagePreview ? (
                      <div 
                        className="image-upload-area"
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                        onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={48} />
                        <p>Drag and drop an image here</p>
                        <p>or <span className="browse-link">browse files</span></p>
                        <small>PNG, JPG up to 5MB</small>
                      </div>
                    ) : (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <p className="file-name">{imageName}</p>
                        <button type="button" className="remove-image" onClick={removeImage}>
                          Remove Image
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary btn-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="spin" />
                        Submitting...
                      </>
                    ) : (
                      <>Launch Theory 🚀</>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="confirmation-screen">
                <CheckCircle size={80} className="success-icon" />
                <h2>Submission Complete!</h2>
                <p>Your theory has been successfully submitted and is now being reviewed by our cosmic team.</p>
                <div className="status-badge">
                  <Clock size={16} />
                  Waiting for Review
                </div>
                <p className="small-text">You'll receive an email notification once your theory is approved or if we need any changes.</p>
                <button className="btn-primary" onClick={closeModal}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
