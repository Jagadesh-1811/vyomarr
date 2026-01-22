import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [fileName, setFileName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    } else {
      setFileName('')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.subject) newErrors.subject = 'Please select a subject'
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setFileName('')
        setErrors({})
      } else {
        setErrors({ submit: data.error || 'Failed to send message' })
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setErrors({ submit: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="star-particles">
          <div className="particle p1"></div>
          <div className="particle p2"></div>
          <div className="particle p3"></div>
          <div className="particle p4"></div>
          <div className="particle p5"></div>
        </div>
        <div className="hero-content">
          <h1>Get in <span className="text-accent">Touch</span></h1>
          <p>Have questions about space mysteries? Want to share your theories? We'd love to hear from you.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Form Column */}
            <div className="form-column">
              <div className="glass-card form-card">
                <h2>Send us a Message</h2>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject <span className="required">*</span></label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="content">Content Suggestion</option>
                      <option value="partnership">Partnership</option>
                    </select>
                    {errors.subject && <div className="error-message">{errors.subject}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message <span className="required">*</span></label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your inquiry, theory, or feedback..."
                      rows={6}
                    />
                    {errors.message && <div className="error-message">{errors.message}</div>}
                  </div>

                  <div className="form-group">
                    <label>Attachment (Optional)</label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="attachment"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="attachment" className="file-upload-label">
                        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p><span className="text-accent">Click to upload</span> or drag and drop</p>
                        <p className="file-hint">PDF, DOC, TXT, JPG, PNG (max 10MB)</p>
                      </label>
                    </div>
                    {fileName && <div className="file-name">Selected: {fileName}</div>}
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    {isSubmitting && <div className="spinner"></div>}
                  </button>
                </form>

                {submitted && (
                  <div className="success-message">
                    <svg className="success-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p>Message sent successfully! We'll get back to you within 24 hours.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="sidebar-column">
              {/* Contact Information */}
              <div className="glass-card sidebar-card">
                <h3>Contact Information</h3>
                <div className="info-item">
                  <div className="info-icon-wrap">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <p className="info-label">Email</p>
                    <p className="info-value">mohanreddysaigovindu@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="glass-card sidebar-card">
                <h3>Response Time</h3>
                <div className="response-items">
                  <div className="response-item">
                    <div className="status-dot green"></div>
                    <div>
                      <p className="response-label">General Inquiries</p>
                      <p className="response-time">Within 24 hours</p>
                    </div>
                  </div>
                  <div className="response-item">
                    <div className="status-dot yellow"></div>
                    <div>
                      <p className="response-label">Technical Support</p>
                      <p className="response-time">Within 48 hours</p>
                    </div>
                  </div>
                  <div className="response-item">
                    <div className="status-dot orange"></div>
                    <div>
                      <p className="response-label">Partnerships</p>
                      <p className="response-time">Within 1 week</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div className="glass-card sidebar-card">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="https://www.linkedin.com/in/govindumohan/" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                  <a href="https://www.youtube.com/@vyomarr" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  </a>
                  <a href="https://www.instagram.com/vyomarr/" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                  </a>
                  <a href="https://discord.gg/vyomarr" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                  </a>
                </div>
              </div>

              {/* Quick Help */}
              <div className="glass-card sidebar-card">
                <h3>Quick Help</h3>
                <div className="quick-links">
                  <Link to="/how-to-submit">How to submit a theory?</Link>
                  <Link to="/issues">Account & Login Issues</Link>
                  <Link to="/guidelines">Content Guidelines</Link>
                  <Link to="/privacy">Privacy & Data Policy</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
                /* Hero Section */
                .contact-hero {
                    position: relative;
                    padding: 80px 0;
                    overflow: hidden;
                }

                .star-particles {
                    position: absolute;
                    inset: 0;
                    opacity: 0.4;
                    pointer-events: none;
                }

                .particle {
                    position: absolute;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .p1 { top: 25%; left: 25%; width: 8px; height: 8px; background: var(--color-space-orange); }
                .p2 { top: 33%; right: 33%; width: 4px; height: 4px; background: white; animation-delay: 1s; }
                .p3 { bottom: 25%; left: 33%; width: 6px; height: 6px; background: rgba(252, 76, 0, 0.6); animation-delay: 0.5s; }
                .p4 { top: 50%; right: 25%; width: 4px; height: 4px; background: rgba(191, 195, 198, 0.8); animation-delay: 1.5s; }
                .p5 { bottom: 33%; right: 50%; width: 8px; height: 8px; background: rgba(252, 76, 0, 0.4); animation-delay: 2s; }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }

                .hero-content {
                    position: relative;
                    z-index: 10;
                    max-width: 800px;
                    margin: 0 auto;
                    text-align: center;
                    padding: 0 24px;
                }

                .hero-content h1 {
                    font-size: clamp(2.5rem, 6vw, 3.5rem);
                    font-weight: 700;
                    margin-bottom: 24px;
                    letter-spacing: -0.5px;
                }

                .hero-content p {
                    font-size: clamp(1rem, 2vw, 1.25rem);
                    color: var(--color-mist-gray);
                    font-weight: 300;
                    max-width: 640px;
                    margin: 0 auto;
                }

                /* Contact Section */
                .contact-section {
                    padding-bottom: 80px;
                }

                .contact-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 24px;
                }

                .contact-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 32px;
                }

                @media (max-width: 1024px) {
                    .contact-grid {
                        grid-template-columns: 1fr;
                    }
                }

                /* Form Card */
                .form-card {
                    padding: 32px 48px;
                }

                .form-card h2 {
                    font-size: 1.75rem;
                    margin-bottom: 24px;
                    color: var(--color-cosmic-white);
                }

                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--color-mist-gray);
                }

                .required {
                    color: var(--color-space-orange);
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(191, 195, 198, 0.2);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: var(--color-cosmic-white);
                    font-size: 1rem;
                    font-family: var(--font-body);
                    transition: all 0.3s;
                }

                .form-group select {
                    appearance: none;
                    cursor: pointer;
                }

                .form-group select option {
                    background: var(--color-deep-space);
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: rgba(255, 255, 255, 0.4);
                }

                .form-group input::placeholder,
                .form-group textarea::placeholder {
                    color: rgba(191, 195, 198, 0.5);
                }

                .error-message {
                    color: #ef4444;
                    font-size: 0.875rem;
                }

                /* File Upload */
                .file-upload {
                    position: relative;
                }

                .file-upload input {
                    display: none;
                }

                .file-upload-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px dashed rgba(191, 195, 198, 0.3);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .file-upload-label:hover {
                    border-color: var(--color-space-orange);
                    background: rgba(255, 255, 255, 0.08);
                }

                .upload-icon {
                    width: 32px;
                    height: 32px;
                    color: var(--color-mist-gray);
                    margin-bottom: 8px;
                }

                .file-upload-label p {
                    color: var(--color-mist-gray);
                    font-size: 0.875rem;
                    margin: 0;
                }

                .file-hint {
                    font-family: var(--font-tech);
                    font-size: 0.75rem !important;
                    color: rgba(191, 195, 198, 0.5) !important;
                    margin-top: 4px !important;
                }

                .file-name {
                    color: var(--color-space-orange);
                    font-family: var(--font-tech);
                    font-size: 0.875rem;
                    margin-top: 8px;
                }

                /* Submit Button */
                .submit-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 16px 24px;
                    background: var(--color-space-orange);
                    color: var(--color-cosmic-white);
                    border: none;
                    border-radius: 12px;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .submit-btn:hover:not(:disabled) {
                    background: #e04400;
                    transform: translateY(-2px);
                }

                .submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid white;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Success Message */
                .success-message {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 24px;
                    padding: 16px;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: 12px;
                }

                .success-icon {
                    width: 20px;
                    height: 20px;
                    color: #10b981;
                    flex-shrink: 0;
                }

                .success-message p {
                    color: #10b981;
                    font-weight: 500;
                    margin: 0;
                }

                /* Sidebar */
                .sidebar-column {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .sidebar-card {
                    padding: 24px;
                }

                .sidebar-card h3 {
                    font-size: 1.25rem;
                    margin-bottom: 16px;
                    color: var(--color-cosmic-white);
                }

                /* Contact Info */
                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }

                .info-icon-wrap {
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                }

                .info-icon-wrap svg {
                    width: 20px;
                    height: 20px;
                    color: var(--color-space-orange);
                }

                .info-label {
                    font-weight: 500;
                    color: var(--color-cosmic-white);
                    margin: 0;
                }

                .info-value {
                    font-family: var(--font-tech);
                    font-size: 0.875rem;
                    color: var(--color-mist-gray);
                    word-break: break-all;
                    margin: 0;
                }

                /* Response Time */
                .response-items {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .response-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .status-dot.green {
                    background: #22c55e;
                    box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
                }

                .status-dot.yellow {
                    background: #eab308;
                    box-shadow: 0 0 8px rgba(234, 179, 8, 0.6);
                }

                .status-dot.orange {
                    background: var(--color-space-orange);
                    box-shadow: 0 0 8px rgba(252, 76, 0, 0.6);
                }

                .response-label {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--color-cosmic-white);
                    margin: 0;
                }

                .response-time {
                    font-family: var(--font-tech);
                    font-size: 0.75rem;
                    color: var(--color-mist-gray);
                    margin: 0;
                }

                /* Social Icons */
                .social-icons {
                    display: flex;
                    gap: 16px;
                }

                .social-icon {
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(191, 195, 198, 0.2);
                    border-radius: 50%;
                    color: var(--color-mist-gray);
                    transition: all 0.3s;
                }

                .social-icon svg {
                    width: 20px;
                    height: 20px;
                }

                .social-icon:hover {
                    background: var(--color-space-orange);
                    color: var(--color-cosmic-white);
                    transform: translateY(-4px);
                    border-color: rgba(255, 255, 255, 0.5);
                }

                /* Quick Links */
                .quick-links {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .quick-links a {
                    color: var(--color-mist-gray);
                    text-decoration: none;
                    font-size: 0.875rem;
                    transition: color 0.3s;
                }

                .quick-links a:hover {
                    color: var(--color-space-orange);
                }

                @media (max-width: 768px) {
                    .form-card {
                        padding: 24px;
                    }
                }
            `}</style>
    </>
  )
}
