import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, FileText, Clock, CheckCircle, XCircle, Loader2, AlertCircle, Mail, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Settings.css';

const API_URL = 'http://localhost:3000/api';

export default function Settings() {
  const [email, setEmail] = useState('');
  const [isEmailSet, setIsEmailSet] = useState(false);
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTheory, setSelectedTheory] = useState(null);

  // Check if email is saved in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('vyomarr_user_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setIsEmailSet(true);
      fetchUserTheories(savedEmail);
    }
  }, []);

  const fetchUserTheories = async (userEmail) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/whatif/user/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setTheories(data);
      } else {
        setError('Could not fetch your submissions');
      }
    } catch (err) {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    localStorage.setItem('vyomarr_user_email', email.toLowerCase());
    setIsEmailSet(true);
    fetchUserTheories(email.toLowerCase());
  };

  const handleChangeEmail = () => {
    localStorage.removeItem('vyomarr_user_email');
    setIsEmailSet(false);
    setTheories([]);
    setEmail('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={20} className="status-icon approved" />;
      case 'rejected': return <XCircle size={20} className="status-icon rejected" />;
      default: return <Clock size={20} className="status-icon pending" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Pending Review';
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const counts = {
    total: theories.length,
    pending: theories.filter(t => t.status === 'pending').length,
    approved: theories.filter(t => t.status === 'approved').length,
    rejected: theories.filter(t => t.status === 'rejected').length
  };

  return (
    <>
      <Navbar />
      
      <div className="settings-background">
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
      </div>

      <div className="settings-container">
        <header className="settings-header">
          <SettingsIcon size={32} />
          <div>
            <h1>My Settings</h1>
            <p>View your submitted "What If" theories and their review status</p>
          </div>
        </header>

        {!isEmailSet ? (
          /* Email Entry Form */
          <div className="email-entry-card">
            <Mail size={48} className="email-icon" />
            <h2>Enter Your Email</h2>
            <p>Enter the email address you used to submit your theories to view their status.</p>
            <form onSubmit={handleEmailSubmit} className="email-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <button type="submit" className="btn-primary">
                View My Submissions
              </button>
            </form>
          </div>
        ) : (
          /* User Dashboard */
          <div className="user-dashboard">
            <div className="user-info-bar">
              <div className="user-email">
                <Mail size={18} />
                <span>{email}</span>
              </div>
              <div className="user-actions">
                <button onClick={() => fetchUserTheories(email)} className="btn-refresh">
                  <RefreshCw size={16} /> Refresh
                </button>
                <button onClick={handleChangeEmail} className="btn-change-email">
                  Change Email
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card total">
                <FileText size={24} />
                <div className="stat-number">{counts.total}</div>
                <div className="stat-label">Total Submissions</div>
              </div>
              <div className="stat-card pending">
                <Clock size={24} />
                <div className="stat-number">{counts.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card approved">
                <CheckCircle size={24} />
                <div className="stat-number">{counts.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
              <div className="stat-card rejected">
                <XCircle size={24} />
                <div className="stat-number">{counts.rejected}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </div>

            {/* Submissions List */}
            <h2 className="section-title">My Submissions</h2>

            {loading ? (
              <div className="loading-state">
                <Loader2 size={40} className="spin" />
                <p>Loading your submissions...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <AlertCircle size={40} />
                <p>{error}</p>
                <button onClick={() => fetchUserTheories(email)} className="btn-primary">
                  Retry
                </button>
              </div>
            ) : theories.length === 0 ? (
              <div className="empty-state">
                <FileText size={64} />
                <h3>No Submissions Yet</h3>
                <p>You haven't submitted any "What If" theories with this email address.</p>
                <a href="/whatif" className="btn-primary">Submit a Theory</a>
              </div>
            ) : (
              <div className="submissions-list">
                {theories.map(theory => (
                  <div 
                    key={theory._id} 
                    className={`submission-card ${theory.status}`}
                    onClick={() => setSelectedTheory(selectedTheory?._id === theory._id ? null : theory)}
                  >
                    <div className="submission-header">
                      {getStatusIcon(theory.status)}
                      <div className="submission-info">
                        <h3>{theory.title}</h3>
                        <div className="submission-meta">
                          <span className="category">{theory.category}</span>
                          <span className="date">{getRelativeTime(theory.createdAt)}</span>
                        </div>
                      </div>
                      <span className={`status-badge ${theory.status}`}>
                        {getStatusLabel(theory.status)}
                      </span>
                    </div>

                    {selectedTheory?._id === theory._id && (
                      <div className="submission-details">
                        <p className="description">{theory.description}</p>
                        
                        {theory.imageUrl && (
                          <img src={theory.imageUrl} alt="" className="submission-image" />
                        )}

                        {theory.status === 'rejected' && theory.rejectionReason && (
                          <div className="rejection-reason">
                            <strong>Reason for Rejection:</strong>
                            <p>{theory.rejectionReason}</p>
                          </div>
                        )}

                        {theory.status === 'approved' && (
                          <div className="approval-message">
                            <CheckCircle size={18} />
                            <span>Your theory is now live on Vyomarr!</span>
                          </div>
                        )}

                        {theory.status === 'pending' && (
                          <div className="pending-message">
                            <Clock size={18} />
                            <span>Your theory is being reviewed by our team. You'll receive an email once it's processed.</span>
                          </div>
                        )}

                        <div className="submission-footer">
                          <span>Submitted: {new Date(theory.createdAt).toLocaleString()}</span>
                          {theory.reviewedAt && (
                            <span>Reviewed: {new Date(theory.reviewedAt).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
