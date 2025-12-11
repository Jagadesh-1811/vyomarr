import React, { useState, useEffect } from "react";
import { LogOut, MessageCircle, Trash2, Eye, X, RefreshCw, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

export function Comments({ onLogout }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (postId, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setComments(comments.filter(c => c._id !== commentId));
          if (selectedComment && selectedComment._id === commentId) {
            setSelectedComment(null);
          }
        }
      } catch (err) {
        console.error('Error deleting comment:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

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
              <MessageCircle size={24} />
              <h1 style={{ margin: 0, fontSize: 24 }}>Comments</h1>
            </div>
            <p style={{ margin: '6px 0 0', color: '#666' }}>Manage comments from article readers</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={fetchComments} style={{ padding: '8px 14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
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

        {/* Stats */}
        <div className="vy-card" style={{ padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <MessageCircle size={32} style={{ color: '#3b82f6' }} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{comments.length}</div>
            <div style={{ color: '#666', fontSize: 14 }}>Total Comments</div>
          </div>
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="vy-card" style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
            <MessageCircle size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
            <p>No comments yet.</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="vy-submission-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>On Article:</span>
                    <h4 style={{ margin: '4px 0 0', fontSize: 14, color: '#3b82f6' }}>{comment.articleTitle}</h4>
                  </div>
                  <p style={{ margin: '0 0 10px', color: '#374151', fontSize: 15, lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{comment.text.length > 150 ? comment.text.substring(0, 150) + '...' : comment.text}"
                  </p>
                  <div className="vy-submission-meta">
                    By <strong>{comment.name}</strong> • {getRelativeTime(comment.createdAt)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setSelectedComment(comment)}
                  style={{ padding: '8px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={16} /> View
                </button>
                <button 
                  onClick={() => handleDelete(comment.postId, comment._id)}
                  style={{ padding: '8px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* View Modal */}
        {selectedComment && (
          <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedComment(null)}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 600, width: '90%', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 25px rgba(0,0,0,0.15)', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setSelectedComment(null)}>
                <X size={24} />
              </button>
              
              <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Comment Details</h2>
              <p style={{ margin: '0 0 16px', fontSize: 14, color: '#3b82f6' }}>
                On: {selectedComment.articleTitle}
              </p>
              
              <div style={{ marginBottom: 16, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
                  <strong>From:</strong> {selectedComment.name}<br />
                  <strong>Date:</strong> {formatDate(selectedComment.createdAt)}
                </p>
              </div>
              
              <div style={{ lineHeight: 1.7, color: '#374151' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>Comment</h4>
                <p style={{ margin: 0, fontStyle: 'italic' }}>"{selectedComment.text}"</p>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                <button 
                  onClick={() => { handleDelete(selectedComment.postId, selectedComment._id); }}
                  style={{ padding: '8px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
                  Delete Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comments;