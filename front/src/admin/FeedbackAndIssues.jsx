import React, { useState, useEffect } from "react";
import { LogOut, MessageSquare, Trash2, Eye, X, Star, RefreshCw, Loader2 } from 'lucide-react';

const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:3000') + '/api';

export function FeedbackAndIssues({ onLogout }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch feedbacks from API
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/feedback`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`${API_URL}/feedback/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setFeedbacks(feedbacks.filter(f => f._id !== id));
        }
      } catch (err) {
        console.error('Error deleting feedback:', err);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: newStatus } : f));
      }
    } catch (err) {
      console.error('Error updating feedback:', err);
    }
  };

  const getRatingStars = (rating) => {
    const numRating = parseInt(rating) || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < numRating ? '#f59e0b' : 'none'}
        color={i < numRating ? '#f59e0b' : '#64748b'}
      />
    ));
  };

  const getUserTypeLabel = (type) => {
    const types = {
      'student': 'Student',
      'researcher': 'Researcher',
      'professional': 'Space Professional',
      'enthusiast': 'Space Enthusiast',
      'educator': 'Educator',
      'other': 'Other'
    };
    return types[type] || type || 'Not specified';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredFeedbacks = filter === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.status === filter);

  if (loading) {
    return (
      <div className="vy-blog-wrap">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Loader2 size={32} className="spin" style={{ color: '#ef4444' }} />
        </div>
      </div>
    );
  }

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
                background: 'linear-gradient(135deg, #ef4444, #f87171)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none'
              }}>
                <MessageSquare size={22} color="#fff" />
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Feedback & Issues</h1>
            </div>
            <p style={{ margin: '8px 0 0 56px', color: '#bfc3c6', fontSize: 14 }}>Review <span style={{ color: '#f87171' }}>user feedback submissions</span></p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={fetchFeedbacks} style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s' }}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={onLogout} className="vy-logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {error && (
          <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 12, marginBottom: 20, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            Error: {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{ padding: '10px 18px', background: filter === 'all' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: filter === 'all' ? '#f87171' : '#94a3b8', border: filter === 'all' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, cursor: 'pointer', fontWeight: filter === 'all' ? 600 : 500, transition: 'all 0.2s' }}>
            All ({feedbacks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{ padding: '10px 18px', background: filter === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: filter === 'pending' ? '#fbbf24' : '#94a3b8', border: filter === 'pending' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, cursor: 'pointer', fontWeight: filter === 'pending' ? 600 : 500, transition: 'all 0.2s' }}>
            Pending ({feedbacks.filter(f => f.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            style={{ padding: '10px 18px', background: filter === 'reviewed' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: filter === 'reviewed' ? '#60a5fa' : '#94a3b8', border: filter === 'reviewed' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, cursor: 'pointer', fontWeight: filter === 'reviewed' ? 600 : 500, transition: 'all 0.2s' }}>
            Reviewed ({feedbacks.filter(f => f.status === 'reviewed').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            style={{ padding: '10px 18px', background: filter === 'resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: filter === 'resolved' ? '#34d399' : '#94a3b8', border: filter === 'resolved' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, cursor: 'pointer', fontWeight: filter === 'resolved' ? 600 : 500, transition: 'all 0.2s' }}>
            Resolved ({feedbacks.filter(f => f.status === 'resolved').length})
          </button>
        </div>

        {/* Feedback List */}
        {filteredFeedbacks.length === 0 ? (
          <div className="vy-card" style={{ textAlign: 'center', padding: 60, color: '#bfc3c6' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MessageSquare size={32} style={{ color: '#ef4444' }} />
            </div>
            {feedbacks.length === 0 ? 'No feedback submissions yet.' : 'No feedback found for this filter.'}
          </div>
        ) : (
          filteredFeedbacks.map(feedback => (
            <div key={feedback._id} className="vy-submission-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#fff' }}>Feedback from {feedback.name}</h3>
                    {feedback.overallRating && (
                      <div style={{ display: 'flex', gap: 2 }}>
                        {getRatingStars(feedback.overallRating)}
                      </div>
                    )}
                  </div>

                  {feedback.likes && (
                    <p style={{ margin: '0 0 10px', color: '#bfc3c6', fontSize: 14, lineHeight: 1.6 }}>
                      <strong style={{ color: '#34d399' }}>Likes:</strong> {feedback.likes.length > 100 ? feedback.likes.substring(0, 100) + '...' : feedback.likes}
                    </p>
                  )}

                  {feedback.improvements && (
                    <p style={{ margin: '0 0 10px', color: '#bfc3c6', fontSize: 14, lineHeight: 1.6 }}>
                      <strong style={{ color: '#fbbf24' }}>Improvements:</strong> {feedback.improvements.length > 100 ? feedback.improvements.substring(0, 100) + '...' : feedback.improvements}
                    </p>
                  )}

                  <div style={{ fontSize: 13, color: '#94a3b8' }}>
                    <strong style={{ color: '#f87171' }}>{feedback.email}</strong> • {getUserTypeLabel(feedback.userType)} • {formatDate(feedback.createdAt)}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                    {feedback.feedbackAreas && feedback.feedbackAreas.length > 0 && (
                      feedback.feedbackAreas.map(area => (
                        <span key={area} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                          {area}
                        </span>
                      ))
                    )}
                    <span style={{
                      padding: '5px 12px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background: feedback.status === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : feedback.status === 'reviewed' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: feedback.status === 'resolved' ? '#34d399' : feedback.status === 'reviewed' ? '#60a5fa' : '#fbbf24',
                      border: feedback.status === 'resolved' ? '1px solid rgba(16, 185, 129, 0.3)' : feedback.status === 'reviewed' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(239, 68, 68, 0.15)', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedFeedback(feedback)}
                  style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                  <Eye size={16} /> View Details
                </button>
                {feedback.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateStatus(feedback._id, 'reviewed')}
                    style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                    Mark Reviewed
                  </button>
                )}
                {feedback.status === 'reviewed' && (
                  <button
                    onClick={() => handleUpdateStatus(feedback._id, 'resolved')}
                    style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                    Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => handleDelete(feedback._id)}
                  style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* View Modal */}
        {selectedFeedback && (
          <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedFeedback(null)}>
            <div style={{ background: 'linear-gradient(135deg, #000b49, #001a66)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 20, padding: 28, maxWidth: 650, width: '90%', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 8, color: '#bfc3c6' }} onClick={() => setSelectedFeedback(null)}>
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #ef4444, #f87171)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} color="#fff" />
                </div>
                <h2 style={{ margin: 0, fontSize: 22, color: '#fff', fontWeight: 700 }}>Feedback Details</h2>
              </div>

              {/* User Info */}
              <div style={{ marginBottom: 20, padding: 16, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#bfc3c6', lineHeight: 1.9 }}>
                  <strong style={{ color: '#f87171' }}>Name:</strong> {selectedFeedback.name}<br />
                  <strong style={{ color: '#f87171' }}>Email:</strong> {selectedFeedback.email}<br />
                  <strong style={{ color: '#f87171' }}>User Type:</strong> {getUserTypeLabel(selectedFeedback.userType)}<br />
                  <strong style={{ color: '#f87171' }}>Date:</strong> {formatDate(selectedFeedback.createdAt)}<br />
                  <strong style={{ color: '#f87171' }}>Status:</strong> <span style={{ color: selectedFeedback.status === 'resolved' ? '#34d399' : selectedFeedback.status === 'reviewed' ? '#60a5fa' : '#fbbf24' }}>{selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}</span>
                </p>
              </div>

              {/* Rating */}
              {selectedFeedback.overallRating && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 12, color: '#f87171', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Rating</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {getRatingStars(selectedFeedback.overallRating)}
                    <span style={{ fontSize: 14, color: '#e2e8f0' }}>({selectedFeedback.overallRating}/5)</span>
                  </div>
                </div>
              )}

              {/* Feedback Areas */}
              {selectedFeedback.feedbackAreas && selectedFeedback.feedbackAreas.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 12, color: '#f87171', textTransform: 'uppercase', letterSpacing: '1px' }}>Feedback Areas</h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedFeedback.feedbackAreas.map(area => (
                      <span key={area} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Likes */}
              {selectedFeedback.likes && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 12, color: '#34d399', textTransform: 'uppercase', letterSpacing: '1px' }}>What They Like</h4>
                  <p style={{ margin: 0, lineHeight: 1.8, color: '#e2e8f0', fontSize: 14 }}>{selectedFeedback.likes}</p>
                </div>
              )}

              {/* Improvements */}
              {selectedFeedback.improvements && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 12, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px' }}>Suggested Improvements</h4>
                  <p style={{ margin: 0, lineHeight: 1.8, color: '#e2e8f0', fontSize: 14 }}>{selectedFeedback.improvements}</p>
                </div>
              )}

              {/* Features */}
              {selectedFeedback.features && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 12, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px' }}>Requested Features</h4>
                  <p style={{ margin: 0, lineHeight: 1.8, color: '#e2e8f0', fontSize: 14 }}>{selectedFeedback.features}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackAndIssues;