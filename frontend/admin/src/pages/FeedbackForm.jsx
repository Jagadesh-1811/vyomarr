import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FeedbackForm.css';

const API_URL = 'http://localhost:3000/api';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    overallRating: '',
    feedbackAreas: [],
    likes: '',
    improvements: '',
    features: ''
  });

  const [message, setMessage] = useState({ text: '', type: '', show: false });
  const [submitting, setSubmitting] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type, show: true });
    setTimeout(() => {
      setMessage(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      feedbackAreas: checked
        ? [...prev.feedbackAreas, value]
        : prev.feedbackAreas.filter(item => item !== value)
    }));
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({ ...prev, overallRating: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      showMessage('Please fill in your name and email.', 'error');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Thank you for your feedback! We appreciate your input and will use it to improve our services.', 'success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          userType: '',
          overallRating: '',
          feedbackAreas: [],
          likes: '',
          improvements: '',
          features: ''
        });
      } else {
        showMessage(data.error || 'Failed to submit feedback. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const feedbackAreaOptions = [
    { value: 'website', label: 'Website Design & Navigation' },
    { value: 'content', label: 'Content Quality' },
    { value: 'community', label: 'Community Features' },
    { value: 'support', label: 'Customer Support' },
    { value: 'privacy', label: 'Privacy & Security' },
    { value: 'performance', label: 'Site Performance' }
  ];

  const ratingOptions = [
    { value: '1', label: 'Poor' },
    { value: '2', label: 'Fair' },
    { value: '3', label: 'Good' },
    { value: '4', label: 'Very Good' },
    { value: '5', label: 'Excellent' }
  ];

  return (
    <>
      <Navbar />
      
      <div className="feedback-page">
        {/* Success/Error Message Box */}
        <div className={`alert-box ${message.show ? 'show' : ''} ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>

        <div className="feedback-container">
          {/* Header */}
          <header className="feedback-header">
            <h1 className="feedback-title">
              Feedback <span className="highlight">Form</span>
            </h1>
            <p className="feedback-subtitle">
              Help Us Improve Your Experience
            </p>
            <p className="feedback-description">
              Your feedback helps us enhance our services and better serve the space enthusiast community.
            </p>
          </header>

          <form className="feedback-form" onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="userType">I am a:</label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                >
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

            {/* Overall Experience */}
            <div className="form-section">
              <h2 className="section-title">Overall Experience</h2>
              <div className="form-group">
                <label>How would you rate your overall experience with Vyomarr?</label>
                <div className="rating-container">
                  {ratingOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`rating-item ${formData.overallRating === option.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="overallRating"
                        value={option.value}
                        checked={formData.overallRating === option.value}
                        onChange={() => handleRatingChange(option.value)}
                        className="hidden"
                      />
                      <div className="rating-content">
                        <div className="rating-number">{option.value}</div>
                        <span className="rating-label">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback Areas */}
            <div className="form-section">
              <h2 className="section-title">What areas would you like to provide feedback on?</h2>
              <div className="checkbox-grid">
                {feedbackAreaOptions.map((option) => (
                  <label key={option.value} className="checkbox-item">
                    <input
                      type="checkbox"
                      name="feedbackAreas"
                      value={option.value}
                      checked={formData.feedbackAreas.includes(option.value)}
                      onChange={handleCheckboxChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="form-section">
              <h2 className="section-title">Detailed Feedback</h2>
              <div className="form-group">
                <label htmlFor="likes">What do you like most about Vyomarr?</label>
                <textarea
                  id="likes"
                  name="likes"
                  value={formData.likes}
                  onChange={handleInputChange}
                  placeholder="Tell us what you enjoy about our platform..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="improvements">What could we improve?</label>
                <textarea
                  id="improvements"
                  name="improvements"
                  value={formData.improvements}
                  onChange={handleInputChange}
                  placeholder="Share your suggestions for improvement..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="features">What new features would you like to see?</label>
                <textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Describe any features you'd like us to add..."
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="submit-section">
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <p className="thank-you-text">Thank you for helping us improve Vyomarr!</p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FeedbackForm;
