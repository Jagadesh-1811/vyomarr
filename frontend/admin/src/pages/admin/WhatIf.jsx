import React, { useState, useEffect } from "react";
import { LogOut, HelpCircle, ThumbsUp, ThumbsDown, X, Loader2, RefreshCw, Eye, Trash2, Mail, Calendar, User } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

export function WhatIf({ onLogout }) {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTheory, setSelectedTheory] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTheories();
  }, []);

  const fetchTheories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/admin/whatif`);
      if (response.ok) {
        const data = await response.json();
        setTheories(data);
      } else {
        setError('Failed to fetch theories');
      }
    } catch (err) {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this theory? An email will be sent to the user.')) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/whatif/${id}/approve`, {
        method: 'PATCH'
      });
      if (response.ok) {
        fetchTheories();
      } else {
        alert('Failed to approve theory');
      }
    } catch (err) {
      alert('Error approving theory');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (theory) => {
    setSelectedTheory(theory);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    setActionLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/whatif/${selectedTheory._id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason })
      });
      if (response.ok) {
        setShowRejectModal(false);
        setSelectedTheory(null);
        setRejectionReason('');
        fetchTheories();
      } else {
        alert('Failed to reject theory');
      }
    } catch (err) {
      alert('Error rejecting theory');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this theory permanently?')) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/whatif/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchTheories();
      } else {
        alert('Failed to delete theory');
      }
    } catch (err) {
      alert('Error deleting theory');
    }
  };

  const handleViewClick = (theory) => {
    setSelectedTheory(theory);
    setShowViewModal(true);
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredTheories = activeFilter === 'all' 
    ? theories 
    : theories.filter(t => t.status === activeFilter);

  const counts = {
    all: theories.length,
    pending: theories.filter(t => t.status === 'pending').length,
    approved: theories.filter(t => t.status === 'approved').length,
    rejected: theories.filter(t => t.status === 'rejected').length
  };

  return (
    <div className="vy-blog-wrap" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #2d2410 50%, #0f172a 100%)' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <header style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
              }}>
                <HelpCircle size={22} color="#fff" />
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>What If? Theories</h1>
            </div>
            <p style={{ margin: '8px 0 0 56px', color: '#94a3b8', fontSize: 14 }}>Review and manage <span style={{ color: '#fbbf24' }}>user-submitted theories</span></p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={fetchTheories} style={{ padding: '10px 16px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={onLogout} className="vy-logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total', count: counts.all, color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
            { label: 'Pending', count: counts.pending, color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' },
            { label: 'Approved', count: counts.approved, color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' },
            { label: 'Rejected', count: counts.rejected, color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255, 255, 255, 0.05)', border: `1px solid ${stat.borderColor}`, padding: 20, borderRadius: 14, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, ...(stat.gradient && { background: stat.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }) }}>{stat.count}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { key: 'all', color: '#fbbf24' },
            { key: 'pending', color: '#f59e0b' },
            { key: 'approved', color: '#34d399' },
            { key: 'rejected', color: '#f87171' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              style={{
                padding: '10px 18px',
                background: activeFilter === filter.key ? `rgba(${filter.key === 'all' ? '245, 158, 11' : filter.key === 'pending' ? '245, 158, 11' : filter.key === 'approved' ? '16, 185, 129' : '239, 68, 68'}, 0.2)` : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === filter.key ? filter.color : '#94a3b8',
                border: activeFilter === filter.key ? `1px solid ${filter.color}40` : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: activeFilter === filter.key ? 600 : 500,
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {filter.key} ({counts[filter.key]})
            </button>
          ))}
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#f59e0b' }} />
            <p style={{ color: '#94a3b8', marginTop: 16 }}>Loading theories...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#f87171' }}>
            <p>{error}</p>
            <button onClick={fetchTheories} style={{ marginTop: 10, padding: '10px 20px', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
              Retry
            </button>
          </div>
        ) : filteredTheories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <HelpCircle size={32} style={{ color: '#f59e0b' }} />
            </div>
            <p>No {activeFilter !== 'all' ? activeFilter : ''} theories found</p>
          </div>
        ) : (
          /* Theories List */
          filteredTheories.map(theory => (
            <div key={theory._id} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: 14, padding: 24, marginBottom: 16, backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: 18, color: '#fff', fontWeight: 600 }}>{theory.title}</h3>
                  <p style={{ margin: '0 0 14px', color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
                    {theory.description.substring(0, 150)}{theory.description.length > 150 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={14} color="#f59e0b" /> <span style={{ color: '#e2e8f0' }}>{theory.authorName || 'Anonymous'}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Mail size={14} color="#f59e0b" /> <span style={{ color: '#94a3b8' }}>{theory.authorEmail}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} color="#f59e0b" /> <span style={{ color: '#94a3b8' }}>{getRelativeTime(theory.createdAt)}</span>
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background: theory.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : theory.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: theory.status === 'approved' ? '#34d399' : theory.status === 'rejected' ? '#f87171' : '#fbbf24',
                      border: theory.status === 'approved' ? '1px solid rgba(16, 185, 129, 0.3)' : theory.status === 'rejected' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      ● {theory.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                {theory.imageUrl && (
                  <img src={theory.imageUrl} alt="" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, border: '2px solid rgba(245, 158, 11, 0.2)' }} />
                )}
              </div>

              {theory.status === 'rejected' && theory.rejectionReason && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10, padding: 14, margin: '16px 0 0', color: '#f87171', fontSize: 13 }}>
                  <strong>Rejection Reason:</strong> {theory.rejectionReason}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button onClick={() => handleViewClick(theory)} style={{ padding: '10px 16px', background: 'rgba(255, 255, 255, 0.08)', color: '#e2e8f0', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s' }}>
                  <Eye size={16} /> View
                </button>
                {theory.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(theory._id)} disabled={actionLoading} style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                      <ThumbsUp size={16} /> Approve
                    </button>
                    <button onClick={() => handleRejectClick(theory)} disabled={actionLoading} style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #ef4444, #f87171)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                      <ThumbsDown size={16} /> Reject
                    </button>
                  </>
                )}
                <button onClick={() => handleDelete(theory._id)} style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, marginLeft: 'auto', transition: 'all 0.2s' }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* View Modal */}
        {showViewModal && selectedTheory && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setShowViewModal(false)}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 16, padding: 28, maxWidth: 600, width: '90%', maxHeight: '80vh', overflow: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 8, color: '#94a3b8' }} onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
              {selectedTheory.imageUrl && (
                <img src={selectedTheory.imageUrl} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 20, border: '2px solid rgba(245, 158, 11, 0.2)' }} />
              )}
              <span style={{ display: 'inline-block', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 14, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                {selectedTheory.category}
              </span>
              <h2 style={{ margin: '0 0 14px', fontSize: 24, color: '#fff', fontWeight: 700 }}>{selectedTheory.title}</h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>{selectedTheory.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#64748b', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span><strong style={{ color: '#e2e8f0' }}>Author:</strong> <span style={{ color: '#94a3b8' }}>{selectedTheory.authorName || 'Anonymous'}</span></span>
                <span><strong style={{ color: '#e2e8f0' }}>Email:</strong> <span style={{ color: '#94a3b8' }}>{selectedTheory.authorEmail}</span></span>
                <span><strong style={{ color: '#e2e8f0' }}>Submitted:</strong> <span style={{ color: '#94a3b8' }}>{new Date(selectedTheory.createdAt).toLocaleString()}</span></span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 11,
                  background: selectedTheory.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : selectedTheory.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: selectedTheory.status === 'approved' ? '#34d399' : selectedTheory.status === 'rejected' ? '#f87171' : '#fbbf24',
                  border: selectedTheory.status === 'approved' ? '1px solid rgba(16, 185, 129, 0.3)' : selectedTheory.status === 'rejected' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  ● {selectedTheory.status.toUpperCase()}
                </span>
              </div>
              {selectedTheory.status === 'rejected' && selectedTheory.rejectionReason && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: 14, borderRadius: 10, marginTop: 20, color: '#f87171', fontSize: 13 }}>
                  <strong>Rejection Reason:</strong> {selectedTheory.rejectionReason}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedTheory && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setShowRejectModal(false)}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 16, padding: 28, maxWidth: 500, width: '90%', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 8, color: '#94a3b8' }} onClick={() => setShowRejectModal(false)}>
                <X size={20} />
              </button>
              <h2 style={{ margin: '0 0 14px', fontSize: 20, color: '#f87171', fontWeight: 700 }}>⚠️ Reject Theory</h2>
              <p style={{ color: '#e2e8f0', margin: '0 0 16px' }}>
                <strong style={{ color: '#fbbf24' }}>Theory:</strong> {selectedTheory.title}
              </p>
              <p style={{ color: '#94a3b8', margin: '0 0 20px', fontSize: 13, padding: 12, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                An email will be sent to <strong style={{ color: '#fbbf24' }}>{selectedTheory.authorEmail}</strong> explaining the rejection.
              </p>
              <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: '#e2e8f0' }}>Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Explain why this theory is being rejected..."
                style={{ width: '100%', minHeight: 120, padding: 14, border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 10, fontSize: 14, resize: 'vertical', color: '#fff', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowRejectModal(false)} style={{ padding: '12px 22px', background: 'rgba(255, 255, 255, 0.1)', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>
                  Cancel
                </button>
                <button onClick={handleRejectSubmit} disabled={actionLoading} style={{ padding: '12px 22px', background: 'linear-gradient(135deg, #ef4444, #f87171)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                  {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhatIf;