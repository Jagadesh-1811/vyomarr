import { useState } from 'react'

export default function IssuesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    rating: '',
    areas: [],
    likes: '',
    improvements: '',
    features: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        areas: checked
          ? [...prev.areas, value]
          : prev.areas.filter(a => a !== value)
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    if (!formData.rating) return

    setIsSubmitting(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          userType: formData.userType,
          overallRating: formData.rating,
          feedbackAreas: formData.areas,
          likes: formData.likes,
          improvements: formData.improvements,
          features: formData.features
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowSuccess(true)
        setFormData({ name: '', email: '', userType: '', rating: '', areas: [], likes: '', improvements: '', features: '' })
        setTimeout(() => setShowSuccess(false), 4000)
      } else {
        alert(data.error || 'Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratings = [
    { value: '1', icon: '😠', text: 'Poor' },
    { value: '2', icon: '🙁', text: 'Fair' },
    { value: '3', icon: '😐', text: 'Good' },
    { value: '4', icon: '🙂', text: 'Very Good' },
    { value: '5', icon: '🤩', text: 'Excellent' }
  ]

  const feedbackAreas = [
    { value: 'design', label: 'Website Design & Navigation' },
    { value: 'content', label: 'Content Quality' },
    { value: 'community', label: 'Community Features' },
    { value: 'support', label: 'Customer Support' },
    { value: 'privacy', label: 'Privacy & Security' },
    { value: 'performance', label: 'Site Performance' }
  ]

  return (
    <>
      <div className="issues-page">
        <div className="issues-container">
          <header className="page-header">
            <h1>Feedback <span className="accent">Form</span></h1>
            <h2>Help Us Improve Your Experience</h2>
            <p>Your feedback helps us enhance our services and better serve the space enthusiast community.</p>
          </header>

          <form className="feedback-form" onSubmit={handleSubmit}>
            {/* Contact Info */}
            <div className="form-section">
              <h3><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="required">*</span></label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="required">*</span></label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="userType">I am a:</label>
                <select id="userType" name="userType" value={formData.userType} onChange={handleChange}>
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="researcher">Researcher</option>
                  <option value="professional">Space Industry Professional</option>
                  <option value="enthusiast">Space Enthusiast</option>
                  <option value="educator">Educator</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Experience Rating */}
            <div className="form-section">
              <h3><svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> Overall Experience</h3>
              <div className="form-group">
                <label>How would you rate your experience with Vyomarr?</label>
                <div className="rating-group">
                  {ratings.map((r, i) => (
                    <label key={r.value} className={`rating-label rating-${i + 1}`}>
                      <input type="radio" name="rating" value={r.value} checked={formData.rating === r.value} onChange={handleChange} />
                      <div className="rating-card">
                        <span className="rating-icon">{r.icon}</span>
                        <span className="rating-text">{r.text}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback Areas */}
            <div className="form-section">
              <h3><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" /></svg> Feedback Areas</h3>
              <div className="form-group">
                <label>What areas would you like to provide feedback on?</label>
                <div className="checkbox-group">
                  {feedbackAreas.map(area => (
                    <label key={area.value} className="checkbox-label">
                      <input type="checkbox" name="areas" value={area.value} checked={formData.areas.includes(area.value)} onChange={handleChange} />
                      {area.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="form-section">
              <h3><svg fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg> Detailed Feedback</h3>
              <div className="form-group">
                <label htmlFor="likes">What do you like most about Vyomarr?</label>
                <textarea id="likes" name="likes" value={formData.likes} onChange={handleChange} rows="4" placeholder="Tell us what you enjoy..." />
              </div>
              <div className="form-group">
                <label htmlFor="improvements">What could we improve?</label>
                <textarea id="improvements" name="improvements" value={formData.improvements} onChange={handleChange} rows="4" placeholder="Share your suggestions..." />
              </div>
              <div className="form-group">
                <label htmlFor="features">What new features would you like to see?</label>
                <textarea id="features" name="features" value={formData.features} onChange={handleChange} rows="4" placeholder="Describe features you'd like..." />
              </div>
            </div>

            <div className="submit-section">
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><svg className="spinner" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Sending...</>
                ) : (
                  <>Submit Feedback</>
                )}
              </button>
            </div>
          </form>
        </div>

        {showSuccess && (
          <div className="snackbar-container">
            <div className="snackbar snackbar-success">
              <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Thank you! Your feedback has been sent successfully.
            </div>
          </div>
        )}
      </div>

      <style>{`
                .issues-page { min-height: 100vh; }

                .issues-container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 120px 20px 80px;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .page-header h1 {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    color: var(--color-cosmic-white);
                }

                .page-header .accent { color: var(--color-space-orange); }

                .page-header h2 {
                    font-size: 1.5rem;
                    color: var(--color-mist-gray);
                    margin-bottom: 15px;
                    font-weight: 600;
                }

                .page-header p {
                    color: var(--color-mist-gray);
                    font-size: 1.05rem;
                    max-width: 650px;
                    margin: 0 auto;
                    font-family: var(--font-tech);
                    font-style: italic;
                }

                .feedback-form {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 24px;
                    padding: 40px;
                    position: relative;
                    overflow: hidden;
                }

                .feedback-form::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 24px;
                    padding: 1px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    z-index: 0;
                }

                .feedback-form > * { position: relative; z-index: 1; }

                .form-section {
                    margin-bottom: 40px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }

                .form-section:last-of-type {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }

                .form-section h3 {
                    font-size: 1.5rem;
                    margin-bottom: 25px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--color-cosmic-white);
                }

                .form-section h3 svg {
                    width: 20px;
                    height: 20px;
                    color: var(--color-space-orange);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                    margin-bottom: 24px;
                }

                .form-group { margin-bottom: 24px; }

                .form-group label {
                    display: block;
                    margin-bottom: 10px;
                    color: var(--color-mist-gray);
                    font-size: 0.95rem;
                    font-weight: 500;
                }

                .required { color: var(--color-space-orange); margin-left: 4px; }

                input[type="text"],
                input[type="email"],
                select,
                textarea {
                    width: 100%;
                    padding: 14px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: var(--color-cosmic-white);
                    font-family: var(--font-body);
                    font-size: 1rem;
                    transition: all 0.3s;
                }

                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: var(--color-space-orange);
                    background: rgba(255, 255, 255, 0.08);
                    box-shadow: 0 0 0 3px rgba(252, 76, 0, 0.15);
                }

                option { background-color: var(--color-deep-space); color: var(--color-cosmic-white); }

                .checkbox-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 12px;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 0;
                    color: var(--color-mist-gray);
                }

                .checkbox-label:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .checkbox-label input[type="checkbox"] {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--color-mist-gray);
                    border-radius: 4px;
                    margin-right: 12px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: transparent;
                }

                .checkbox-label input[type="checkbox"]:checked {
                    background: var(--color-space-orange);
                    border-color: var(--color-space-orange);
                }

                .checkbox-label input[type="checkbox"]:checked::after {
                    content: '✓';
                    position: absolute;
                    color: white;
                    font-size: 14px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-weight: bold;
                }

                .rating-group {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .rating-label {
                    flex: 1;
                    min-width: 80px;
                    cursor: pointer;
                    position: relative;
                    margin-bottom: 0;
                }

                .rating-label input[type="radio"] {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                }

                .rating-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    transition: all 0.3s;
                }

                .rating-icon {
                    font-size: 2rem;
                    margin-bottom: 8px;
                    filter: grayscale(100%);
                    opacity: 0.7;
                    transition: all 0.3s;
                }

                .rating-text {
                    font-size: 0.8rem;
                    color: var(--color-mist-gray);
                    font-family: var(--font-tech);
                }

                .rating-label:hover .rating-icon {
                    filter: grayscale(0%);
                    opacity: 1;
                    transform: scale(1.1);
                }

                .rating-1 input:checked + .rating-card { border-color: #ef4444; background: rgba(239, 68, 68, 0.15); }
                .rating-2 input:checked + .rating-card { border-color: #f97316; background: rgba(249, 115, 22, 0.15); }
                .rating-3 input:checked + .rating-card { border-color: #eab308; background: rgba(234, 179, 8, 0.15); }
                .rating-4 input:checked + .rating-card { border-color: #84cc16; background: rgba(132, 204, 22, 0.15); }
                .rating-5 input:checked + .rating-card { border-color: #22c55e; background: rgba(34, 197, 94, 0.15); }

                .rating-label input:checked + .rating-card .rating-icon {
                    filter: grayscale(0%);
                    opacity: 1;
                    transform: scale(1.2);
                }

                .submit-section {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 30px;
                }

                .btn-submit {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 48px;
                    background: linear-gradient(90deg, var(--color-space-orange), #ff6a2b);
                    color: var(--color-deep-navy);
                    font-family: var(--font-heading);
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: 50px;
                    transition: all 0.3s;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 4px 15px rgba(252, 76, 0, 0.3);
                }

                .btn-submit svg { width: 20px; height: 20px; }

                .btn-submit:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(252, 76, 0, 0.5);
                }

                .btn-submit:disabled {
                    opacity: 0.8;
                    cursor: not-allowed;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .snackbar-container {
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                }

                .snackbar {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 24px;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    animation: snackbarSlideIn 0.4s ease;
                }

                .snackbar svg { width: 20px; height: 20px; }

                .snackbar-success {
                    background: linear-gradient(135deg, #059669, #10b981);
                    color: white;
                }

                @keyframes snackbarSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                @media (max-width: 768px) {
                    .issues-container { padding: 100px 20px 60px; }
                    .form-row { grid-template-columns: 1fr; gap: 0; }
                    .feedback-form { padding: 24px; }
                    .page-header h1 { font-size: 2rem; }
                    .rating-group { gap: 8px; }
                    .rating-card { padding: 10px; }
                }
            `}</style>
    </>
  )
}
