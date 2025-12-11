import React, { useState, useEffect } from "react";
import { LogOut, MessageSquare, Trash2, Eye, X, Star, RefreshCw, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

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
        color={i < numRating ? '#f59e0b' : '#d1d5db'} 
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
          <Loader2 size={32} className="spin" style={{ color: '#666' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="vy-blog-wrap">
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <header style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={24} />
              <h1 style={{ margin: 0, fontSize: 24 }}>Feedback & Issues</h1>
            </div>
            <p style={{ margin: '6px 0 0', color: '#666' }}>Review user feedback submissions</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={fetchFeedbacks} style={{ padding: '8px 14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={onLogout} className="vy-logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {error && (
          <div style={{ padding: 16, background: '#fee2e2', color: '#dc2626', borderRadius: 8, marginBottom: 20 }}>
            Error: {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <button 
            onClick={() => setFilter('all')}
            style={{ padding: '8px 16px', background: filter === 'all' ? '#111' : '#f3f4f6', color: filter === 'all' ? '#fff' : '#111', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
            All ({feedbacks.length})
          </button>
          <button 
            onClick={() => setFilter('pending')}
            style={{ padding: '8px 16px', background: filter === 'pending' ? '#111' : '#f3f4f6', color: filter === 'pending' ? '#fff' : '#111', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Pending ({feedbacks.filter(f => f.status === 'pending').length})
          </button>
          <button 
            onClick={() => setFilter('reviewed')}
            style={{ padding: '8px 16px', background: filter === 'reviewed' ? '#111' : '#f3f4f6', color: filter === 'reviewed' ? '#fff' : '#111', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Reviewed ({feedbacks.filter(f => f.status === 'reviewed').length})
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            style={{ padding: '8px 16px', background: filter === 'resolved' ? '#111' : '#f3f4f6', color: filter === 'resolved' ? '#fff' : '#111', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Resolved ({feedbacks.filter(f => f.status === 'resolved').length})
          </button>
        </div>

        {/* Feedback List */}
        {filteredFeedbacks.length === 0 ? (
          <div className="vy-card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            {feedbacks.length === 0 ? 'No feedback submissions yet.' : 'No feedback found for this filter.'}
          </div>
        ) : (
          filteredFeedbacks.map(feedback => (
            <div key={feedback._id} className="vy-submission-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <h3 className="vy-submission-title" style={{ margin: 0 }}>Feedback from {feedback.name}</h3>
                    {feedback.overallRating && (
                      <div style={{ display: 'flex', gap: 2 }}>
                        {getRatingStars(feedback.overallRating)}
                      </div>
                    )}
                  </div>
                  
                  {feedback.likes && (
                    <p style={{ margin: '0 0 8px', color: '#4b5563', fontSize: 14, lineHeight: 1.5 }}>
                      <strong>Likes:</strong> {feedback.likes.length > 100 ? feedback.likes.substring(0, 100) + '...' : feedback.likes}
                    </p>
                  )}
                  
                  {feedback.improvements && (
                    <p style={{ margin: '0 0 8px', color: '#4b5563', fontSize: 14, lineHeight: 1.5 }}>
                      <strong>Improvements:</strong> {feedback.improvements.length > 100 ? feedback.improvements.substring(0, 100) + '...' : feedback.improvements}
                    </p>
                  )}
                  
                  <div className="vy-submission-meta">
                    <strong>{feedback.email}</strong> • {getUserTypeLabel(feedback.userType)} • {formatDate(feedback.createdAt)}
                  </div>
                  
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {feedback.feedbackAreas && feedback.feedbackAreas.length > 0 && (
                      feedback.feedbackAreas.map(area => (
                        <span key={area} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: '#e0f2fe', color: '#0369a1' }}>
                          {area}
                        </span>
                      ))
                    )}
                    <span className={`vy-submission-status vy-status-${feedback.status}`}>
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setSelectedFeedback(feedback)}
                  style={{ padding: '8px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={16} /> View Details
                </button>
                {feedback.status === 'pending' && (
                  <button 
                    onClick={() => handleUpdateStatus(feedback._id, 'reviewed')}
                    style={{ padding: '8px 14px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                    Mark Reviewed
                  </button>
                )}
                {feedback.status === 'reviewed' && (
                  <button 
                    onClick={() => handleUpdateStatus(feedback._id, 'resolved')}
                    style={{ padding: '8px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                    Mark Resolved
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(feedback._id)}
                  style={{ padding: '8px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* View Modal */}
        {selectedFeedback && (
          <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedFeedback(null)}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 650, width: '90%', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 25px rgba(0,0,0,0.15)', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setSelectedFeedback(null)}>
                <X size={24} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MessageSquare size={20} />
                <h2 style={{ margin: 0, fontSize: 20 }}>Feedback Details</h2>
              </div>
              
              {/* User Info */}
              <div style={{ marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
                  <strong>Name:</strong> {selectedFeedback.name}<br />
                  <strong>Email:</strong> {selectedFeedback.email}<br />
                  <strong>User Type:</strong> {getUserTypeLabel(selectedFeedback.userType)}<br />
                  <strong>Date:</strong> {formatDate(selectedFeedback.createdAt)}<br />
                  <strong>Status:</strong> {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}
                </p>
              </div>
              
              {/* Rating */}
              {selectedFeedback.overallRating && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>Overall Rating</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {getRatingStars(selectedFeedback.overallRating)}
                    <span style={{ fontSize: 14, color: '#374151' }}>({selectedFeedback.overallRating}/5)</span>
                  </div>
                </div>
              )}
              
              {/* Feedback Areas */}
              {selectedFeedback.feedbackAreas && selectedFeedback.feedbackAreas.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>Feedback Areas</h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {selectedFeedback.feedbackAreas.map(area => (
                      <span key={area} style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: '#e0f2fe', color: '#0369a1' }}>
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Likes */}
              {selectedFeedback.likes && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>What They Like</h4>
                  <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{selectedFeedback.likes}</p>
                </div>
              )}
              
              {/* Improvements */}
              {selectedFeedback.improvements && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>Suggested Improvements</h4>
                  <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{selectedFeedback.improvements}</p>
                </div>
              )}
              
              {/* Features */}
              {selectedFeedback.features && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>Requested Features</h4>
                  <p style={{ margin: 0, lineHeight: 1.7, color: '#374151' }}>{selectedFeedback.features}</p>
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