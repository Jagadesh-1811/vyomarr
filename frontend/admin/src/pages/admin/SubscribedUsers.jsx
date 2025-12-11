import React, { useState, useEffect } from "react";
import { LogOut, Users, Trash2, RefreshCw, Loader2, Mail, UserX } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

export function SubscribedUsers({ onLogout }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/subscribers`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      const data = await response.json();
      setSubscribers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        const response = await fetch(`${API_URL}/subscribers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setSubscribers(subscribers.filter(s => s._id !== id));
        }
      } catch (err) {
        console.error('Error deleting subscriber:', err);
      }
    }
  };

  const handleUnsubscribe = async (id) => {
    try {
      const response = await fetch(`${API_URL}/subscribers/${id}/unsubscribe`, {
        method: 'PATCH',
      });
      if (response.ok) {
        setSubscribers(subscribers.map(s => s._id === id ? { ...s, isActive: false } : s));
      }
    } catch (err) {
      console.error('Error unsubscribing:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const activeCount = subscribers.filter(s => s.isActive).length;
  const inactiveCount = subscribers.filter(s => !s.isActive).length;

  if (loading) {
    return (
      <div className="vy-blog-wrap" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <Loader2 size={32} className="spin" style={{ color: '#ec4899' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="vy-blog-wrap" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #2d1b3d 50%, #0f172a 100%)' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <header style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
              }}>
                <Users size={22} color="#fff" />
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Subscribed Users</h1>
            </div>
            <p style={{ margin: '8px 0 0 56px', color: '#94a3b8', fontSize: 14 }}>Manage <span style={{ color: '#f472b6' }}>newsletter subscriptions</span></p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={fetchSubscribers} style={{ padding: '10px 16px', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, transition: 'all 0.2s' }}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={onLogout} className="vy-logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {error && (
          <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            Error: {error}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: 14, padding: 24, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 36, fontWeight: 700, background: 'linear-gradient(135deg, #ec4899, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{subscribers.length}</div>
            <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Total Subscribers</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 14, padding: 24, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#34d399' }}>{activeCount}</div>
            <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Active</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(107, 114, 128, 0.2)', borderRadius: 14, padding: 24, textAlign: 'center', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#9ca3af' }}>{inactiveCount}</div>
            <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Inactive</div>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: 16, padding: 0, overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          {subscribers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={32} style={{ color: '#ec4899' }} />
              </div>
              <p style={{ fontSize: 16 }}>No subscribers yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(236, 72, 153, 0.1)', borderBottom: '1px solid rgba(236, 72, 153, 0.2)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#f472b6', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>#</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#f472b6', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#f472b6', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>Subscribed Date</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#f472b6', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600, color: '#f472b6', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.2s' }}>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>{index + 1}</td>
                      <td style={{ padding: '14px 16px', color: '#e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Mail size={14} style={{ color: '#ec4899' }} />
                          </div>
                          {subscriber.email}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{formatDate(subscriber.subscribedAt)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          padding: '6px 14px', 
                          borderRadius: 20, 
                          fontSize: 12, 
                          fontWeight: 600, 
                          background: subscriber.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)', 
                          color: subscriber.isActive ? '#34d399' : '#9ca3af',
                          border: subscriber.isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)'
                        }}>
                          {subscriber.isActive ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                          {subscriber.isActive && (
                            <button 
                              onClick={() => handleUnsubscribe(subscriber._id)}
                              style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                              title="Unsubscribe"
                            >
                              <UserX size={14} /> Unsubscribe
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(subscriber._id)}
                            style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                            title="Remove"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscribedUsers;