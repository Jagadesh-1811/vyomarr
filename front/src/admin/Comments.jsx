import React, { useState, useEffect } from "react";
import { LogOut, MessageCircle, Trash2, Eye, X, RefreshCw, Loader2 } from 'lucide-react';

const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:3000') + '/api';

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
      setComments(Array.isArray(data.data) ? data.data : []);
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
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isAdmin: true })
        });
        if (response.ok) {
          setComments(comments.filter(c => c._id !== commentId));
          if (selectedComment && selectedComment._id === commentId) {
            setSelectedComment(null);
          }
        } else {
          const errorData = await response.json();
          alert('Failed to delete: ' + (errorData.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment');
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
          <Loader2 size={32} className="spin" style={{ color: '#3b82f6' }} />
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
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none'
              }}>
                <MessageCircle size={22} color="#fff" />
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Comments</h1>
            </div>
            <p style={{ margin: '8px 0 0 56px', color: '#bfc3c6', fontSize: 14 }}>Manage <span style={{ color: '#60a5fa' }}>comments from article readers</span></p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={fetchComments} style={{ padding: '10px 16px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s' }}>
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

        {/* Stats */}
        <div className="vy-card" style={{ padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
          }}>
            <MessageCircle size={28} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{comments.length}</div>
            <div style={{ color: '#bfc3c6', fontSize: 14 }}>Total Comments</div>
          </div>
        </div>

        {/* Comments Grouped by Article */}
        {comments.length === 0 ? (
          <div className="vy-card" style={{ textAlign: 'center', padding: 60, color: '#bfc3c6' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MessageCircle size={32} style={{ color: '#3b82f6' }} />
            </div>
            <p>No comments yet.</p>
          </div>
        ) : (
          (() => {
            const groupedComments = comments.reduce((acc, comment) => {
              const articleKey = comment.articleTitle || 'Unknown Article';
              if (!acc[articleKey]) {
                acc[articleKey] = {
                  articleTitle: articleKey,
                  postId: comment.postId,
                  postType: comment.postType,
                  comments: []
                };
              }
              acc[articleKey].comments.push(comment);
              return acc;
            }, {});

            const articleGroups = Object.values(groupedComments);

            return articleGroups.map((group, groupIndex) => (
              <div key={groupIndex} style={{ marginBottom: 24 }}>
                {/* Article Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  padding: '18px 24px',
                  borderRadius: '16px 16px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                }}>
                  <div>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.5px', marginBottom: 4 }}>
                      📄 Article
                    </div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{group.articleTitle}</h3>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '6px 16px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 600
                  }}>
                    {group.comments.length} comment{group.comments.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Comments for this Article */}
                <div style={{
                  background: 'rgba(0, 11, 73, 0.6)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderTop: 'none',
                  borderRadius: '0 0 16px 16px',
                  padding: 20
                }}>
                  {group.comments.map((comment, idx) => (
                    <div key={comment._id} style={{
                      background: 'rgba(0, 11, 73, 0.8)',
                      border: '1px solid rgba(59, 130, 246, 0.15)',
                      borderRadius: 12,
                      padding: 18,
                      marginBottom: idx < group.comments.length - 1 ? 14 : 0,
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 12px', color: '#e2e8f0', fontSize: 15, lineHeight: 1.7, fontStyle: 'italic' }}>
                            "{comment.text.length > 150 ? comment.text.substring(0, 150) + '...' : comment.text}"
                          </p>
                          <div style={{ fontSize: 13, color: '#bfc3c6' }}>
                            By <strong style={{ color: '#60a5fa' }}>{comment.name}</strong> • {getRelativeTime(comment.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(59, 130, 246, 0.15)' }}>
                        <button
                          onClick={() => setSelectedComment(comment)}
                          style={{ padding: '8px 14px', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => handleDelete(comment.postId, comment._id)}
                          style={{ padding: '8px 14px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()
        )}

        {/* View Modal */}
        {selectedComment && (
          <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setSelectedComment(null)}>
            <div style={{ background: 'linear-gradient(135deg, #000b49, #001a66)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 20, padding: 28, maxWidth: 600, width: '90%', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 8, color: '#bfc3c6' }} onClick={() => setSelectedComment(null)}>
                <X size={20} />
              </button>

              <h2 style={{ margin: '0 0 8px', fontSize: 22, color: '#fff', fontWeight: 700 }}>Comment Details</h2>
              <p style={{ margin: '0 0 20px', fontSize: 14, color: '#60a5fa' }}>
                On: {selectedComment.articleTitle}
              </p>

              <div style={{ marginBottom: 20, padding: 16, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <p style={{ margin: 0, fontSize: 13, color: '#bfc3c6' }}>
                  <strong style={{ color: '#60a5fa' }}>From:</strong> {selectedComment.name}<br />
                  <strong style={{ color: '#60a5fa' }}>Date:</strong> {formatDate(selectedComment.createdAt)}
                </p>
              </div>

              <div style={{ lineHeight: 1.8, color: '#e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: 12, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px' }}>Comment</h4>
                <p style={{ margin: 0, fontStyle: 'italic', fontSize: 15 }}>"{selectedComment.text}"</p>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <button
                  onClick={() => { handleDelete(selectedComment.postId, selectedComment._id); }}
                  style={{ padding: '10px 18px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Trash2 size={16} /> Delete Comment
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