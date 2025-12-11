import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SubmitForm.css';

export default function SubmitForm() {
  const [formData, setFormData] = useState({
    title: '',
    domain: 'Aerospace Futures',
    summary: '',
    why: '',
    creatorNotes: '',
    allowAdapt: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbars, setSnackbars] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const domainOptions = [
    'Aerospace Futures',
    'Space-Time & Cosmology',
    'Quantum Possibilities',
    'Advanced Propulsion Concepts',
    'Astrobiology & Alien Life',
    'Frontier Physics',
    'Cross-Domain Exploration',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const showSnackbar = (type, message) => {
    const id = Date.now();
    setSnackbars(prev => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      setSnackbars(prev => prev.filter(s => s.id !== id));
    }, 5000);
  };

  const removeSnackbar = (id) => {
    setSnackbars(prev => prev.filter(s => s.id !== id));
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      showSnackbar('error', 'Only PNG or JPG images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('error', 'Maximum file size is 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview({
        url: e.target.result,
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB'
      });
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length) handleFiles(files);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.summary.trim()) {
      showSnackbar('warning', 'Please provide a title and describe your scenario.');
      return;
    }

    if (formData.summary.length < 50) {
      showSnackbar('warning', 'Your scenario description should be at least 50 characters.');
      return;
    }

    const payload = {
      ...formData,
      image: imageFile ? imageFile.name : null
    };

    console.log('Submission payload:', payload);

    // TODO: Replace with actual API call
    // const formDataToSend = new FormData();
    // Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
    // if (imageFile) formDataToSend.append('image', imageFile);
    // await fetch('/api/theories', { method: 'POST', body: formDataToSend });

    showSnackbar('success', 'Your idea has been queued for review! 🚀');
    
    // Reset form
    setFormData({
      title: '',
      domain: 'Aerospace Futures',
      summary: '',
      why: '',
      creatorNotes: '',
      allowAdapt: true
    });
    removeImage();
  };

  const getSnackbarIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      default: return 'ℹ';
    }
  };

  return (
    <div className="submitform-page">
      <Navbar />
      
      {/* Background Glow */}
      <div className="submitform-glow-bg"></div>

      {/* Main Container */}
      <div className="submitform-container">
        {/* Page Header */}
        <div className="submitform-page-header">
          <img src="/img/logo.png" alt="Vyomarr" className="submitform-logo" />
          <h1>Launch a <span className="submitform-accent">What-If</span> Scenario</h1>
          <p>Where imagination meets science — share a bold hypothetical and spark new perspectives across the cosmos.</p>
        </div>

        {/* Form Card */}
        <div className="submitform-form-card">
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            {/* Title */}
            <div className="submitform-form-group">
              <label htmlFor="title">
                Concept Title <span className="submitform-required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="What if dark matter could be engineered into propulsion?"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Domain */}
            <div className="submitform-form-group">
              <label htmlFor="domain">Science Domain</label>
              <select
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
              >
                {domainOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Summary */}
            <div className="submitform-form-group">
              <label htmlFor="summary">
                Your Hypothetical Scenario <span className="submitform-required">*</span>
              </label>
              <textarea
                id="summary"
                name="summary"
                placeholder="Describe the idea, the inspiration, and the imagined consequences. Make clear where science ends and imagination begins."
                value={formData.summary}
                onChange={handleInputChange}
                required
              />
              <p className="submitform-form-hint">Tip: Use 3–6 paragraphs or a step list. Mark assumptions clearly.</p>
            </div>

            {/* Two Column Row */}
            <div className="submitform-form-row">
              <div className="submitform-form-group">
                <label htmlFor="why">Why This Idea Matters</label>
                <input
                  id="why"
                  name="why"
                  type="text"
                  placeholder="Why should the community rethink this?"
                  value={formData.why}
                  onChange={handleInputChange}
                />
                <p className="submitform-form-hint">Short justification to help editors and viewers.</p>
              </div>

              <div className="submitform-form-group">
                <label htmlFor="creatorNotes">Creator Notes (Optional)</label>
                <input
                  id="creatorNotes"
                  name="creatorNotes"
                  type="text"
                  placeholder="Inspiration, assumptions, or questions"
                  value={formData.creatorNotes}
                  onChange={handleInputChange}
                />
                <p className="submitform-form-hint">Things you want responders to consider.</p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="submitform-form-group">
              <label>Add Visual Concept (Optional)</label>
              
              {!imagePreview ? (
                <div
                  className={`submitform-drop-zone ${isDragging ? 'submitform-drop-zone-active' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      fileInputRef.current?.click();
                      e.preventDefault();
                    }
                  }}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  tabIndex={0}
                  role="button"
                >
                  <svg className="submitform-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <strong>Drop an image here</strong>
                  <small>or click to browse — PNG / JPG up to 5MB</small>
                </div>
              ) : (
                <div className="submitform-preview-area">
                  <div
                    className="submitform-preview-thumb"
                    style={{ backgroundImage: `url(${imagePreview.url})` }}
                  />
                  <div className="submitform-preview-info">
                    <div className="submitform-file-name">{imagePreview.name}</div>
                    <div className="submitform-file-size">{imagePreview.size}</div>
                  </div>
                  <button type="button" className="submitform-btn-remove" onClick={removeImage}>
                    Remove
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: 'none' }}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Checkbox */}
            <div className="submitform-checkbox-group">
              <input
                type="checkbox"
                id="allowAdapt"
                name="allowAdapt"
                checked={formData.allowAdapt}
                onChange={handleInputChange}
              />
              <div>
                <label htmlFor="allowAdapt">
                  Allow Vyomarr to adapt this into video content (credit given)
                </label>
                <p className="submitform-hint">You can opt out at any time by contacting us.</p>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submitform-btn-submit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M12 2L12 22M12 2L5 9M12 2L19 9" transform="rotate(-45 12 12)" />
              </svg>
              Launch This Idea Into The Universe
            </button>

            {/* Disclaimer */}
            <p className="submitform-disclaimer">
              Your submission will receive a quick review for clarity and safety. Vyomarr reserves editorial
              selection for video adaptations. By submitting you confirm the content is original or properly
              credited.
            </p>

            {/* Back Link */}
            <div className="submitform-back-link">
              <Link to="/submit-theory">← Back to How to Submit a Theory</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Snackbar Container */}
      {snackbars.length > 0 && (
        <div className="submitform-snackbar-container">
          {snackbars.map(snackbar => (
            <div key={snackbar.id} className={`submitform-snackbar submitform-snackbar-${snackbar.type}`}>
              <span className="submitform-snackbar-icon">{getSnackbarIcon(snackbar.type)}</span>
              <span>{snackbar.message}</span>
              <button
                className="submitform-snackbar-close"
                onClick={() => removeSnackbar(snackbar.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
