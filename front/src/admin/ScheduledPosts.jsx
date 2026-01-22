import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Rocket, Trash2, Send, Edit3, Loader2, AlertCircle, CheckCircle, X, LayoutDashboard, LogOut } from 'lucide-react';

export function ScheduledPosts({ onLogout }) {
    const [scheduledPosts, setScheduledPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [newScheduleDate, setNewScheduleDate] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:3000') + '/api';

    // Fetch scheduled posts
    const fetchScheduledPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/spacemysteries/admin/scheduled`);
            if (!response.ok) throw new Error('Failed to fetch scheduled posts');
            const data = await response.json();
            setScheduledPosts(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching scheduled posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScheduledPosts();
        // Refresh posts every minute
        const postsInterval = setInterval(fetchScheduledPosts, 60000);
        // Update countdown every second
        const timerInterval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => {
            clearInterval(postsInterval);
            clearInterval(timerInterval);
        };
    }, []);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Calculate time remaining with seconds
    const getTimeRemaining = (scheduledFor) => {
        const target = new Date(scheduledFor);
        const diff = target - currentTime;

        if (diff <= 0) return { text: 'Publishing soon...', isUrgent: true };

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        let text;
        if (days > 0) {
            text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (hours > 0) {
            text = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            text = `${minutes}m ${seconds}s`;
        } else {
            text = `${seconds}s`;
        }

        return { text, isUrgent: diff < 60000 }; // Urgent if less than 1 minute
    };

    // Publish now
    const handlePublishNow = async (id) => {
        try {
            setActionLoading(id);
            const response = await fetch(`${API_URL}/spacemysteries/${id}/publish-now`, {
                method: 'PATCH'
            });
            if (!response.ok) throw new Error('Failed to publish');
            setSuccessMessage('Article published successfully!');
            fetchScheduledPosts();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Update schedule
    const handleUpdateSchedule = async (id) => {
        if (!newScheduleDate) return;
        try {
            setActionLoading(id);
            const response = await fetch(`${API_URL}/spacemysteries/${id}/schedule`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scheduledFor: newScheduleDate })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update schedule');
            }
            setSuccessMessage('Schedule updated successfully!');
            setEditingId(null);
            setNewScheduleDate('');
            fetchScheduledPosts();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Delete
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this scheduled post?')) return;
        try {
            setActionLoading(id);
            const response = await fetch(`${API_URL}/spacemysteries/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete');
            setSuccessMessage('Post deleted successfully!');
            fetchScheduledPosts();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

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
                                background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'none'
                            }}>
                                <Calendar size={22} color="#fff" />
                            </div>
                            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Scheduled Posts</h1>
                        </div>
                        <p style={{ margin: '8px 0 0 56px', color: '#bfc3c6', fontSize: 14 }}>Admin Panel / <span style={{ color: '#8b5cf6' }}>Scheduled Posts</span></p>
                    </div>
                    <button onClick={onLogout} className="vy-logout-btn">
                        <LogOut size={16} /> Logout
                    </button>
                </header>

                {/* Success Message */}
                {successMessage && (
                    <div style={{ marginBottom: 20, padding: 14, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, color: '#34d399' }}>
                        <CheckCircle size={18} />
                        <span style={{ fontWeight: 500 }}>{successMessage}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{ marginBottom: 20, padding: 14, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, color: '#f87171' }}>
                        <AlertCircle size={18} />
                        <span style={{ fontWeight: 500 }}>{error}</span>
                        <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="vy-card" style={{ textAlign: 'center', padding: 60 }}>
                        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#8b5cf6' }} />
                        <p style={{ color: '#94a3b8', marginTop: 16 }}>Loading scheduled posts...</p>
                    </div>
                ) : scheduledPosts.length === 0 ? (
                    <div className="vy-card" style={{ textAlign: 'center', padding: 60 }}>
                        <Calendar size={50} color="#64748b" style={{ marginBottom: 16 }} />
                        <h3 style={{ color: '#e2e8f0', margin: '0 0 8px' }}>No Scheduled Posts</h3>
                        <p style={{ color: '#94a3b8', margin: 0 }}>Create a new article and select "Schedule for Later" to see it here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {scheduledPosts.map((post) => (
                            <div key={post._id} className="vy-card" style={{ padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                                    {/* Post Info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <Rocket size={18} color="#fc4c00" />
                                            <span style={{
                                                background: 'rgba(252, 76, 0, 0.2)',
                                                color: '#fc4c00',
                                                padding: '4px 10px',
                                                borderRadius: 6,
                                                fontSize: 12,
                                                fontWeight: 600
                                            }}>
                                                {post.categoryLabel || post.category}
                                            </span>
                                        </div>
                                        <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 18, fontWeight: 600 }}>{post.title}</h3>
                                        {post.subHeading && (
                                            <p style={{ color: '#94a3b8', margin: 0, fontSize: 14, fontStyle: 'italic' }}>{post.subHeading}</p>
                                        )}
                                    </div>

                                    {/* Schedule Info */}
                                    {(() => {
                                        const timeInfo = getTimeRemaining(post.scheduledFor);
                                        return (
                                            <div style={{
                                                background: timeInfo.isUrgent ? 'rgba(252, 76, 0, 0.15)' : 'rgba(139, 92, 246, 0.1)',
                                                border: `1px solid ${timeInfo.isUrgent ? 'rgba(252, 76, 0, 0.4)' : 'rgba(139, 92, 246, 0.3)'}`,
                                                borderRadius: 12,
                                                padding: 16,
                                                minWidth: 220,
                                                textAlign: 'center',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                                                    <Clock size={16} color={timeInfo.isUrgent ? '#fc4c00' : '#a78bfa'} style={{ animation: timeInfo.isUrgent ? 'pulse 1s infinite' : 'none' }} />
                                                    <span style={{ color: timeInfo.isUrgent ? '#fc4c00' : '#a78bfa', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>
                                                        {timeInfo.isUrgent ? '⚡ Almost Live!' : 'Publishes in'}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    color: timeInfo.isUrgent ? '#fc4c00' : '#fff',
                                                    fontSize: 22,
                                                    fontWeight: 700,
                                                    marginBottom: 4,
                                                    fontFamily: "'Roboto Mono', monospace",
                                                    letterSpacing: '1px'
                                                }}>
                                                    {timeInfo.text}
                                                </div>
                                                <div style={{ color: '#64748b', fontSize: 12 }}>
                                                    {new Date(post.scheduledFor).toLocaleString()}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Edit Schedule Form */}
                                {editingId === post._id && (
                                    <div style={{
                                        marginTop: 16,
                                        padding: 16,
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        borderRadius: 10,
                                        border: '1px solid rgba(139, 92, 246, 0.2)'
                                    }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#a78bfa', fontWeight: 600 }}>
                                            New Date & Time
                                        </label>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <input
                                                type="datetime-local"
                                                value={newScheduleDate}
                                                onChange={(e) => setNewScheduleDate(e.target.value)}
                                                min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                                                className="vy-input"
                                                style={{ flex: 1, colorScheme: 'dark' }}
                                            />
                                            <button
                                                onClick={() => handleUpdateSchedule(post._id)}
                                                disabled={!newScheduleDate || actionLoading === post._id}
                                                style={{
                                                    padding: '10px 20px',
                                                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                                    border: 'none',
                                                    borderRadius: 8,
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    opacity: !newScheduleDate ? 0.5 : 1
                                                }}
                                            >
                                                {actionLoading === post._id ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={() => { setEditingId(null); setNewScheduleDate(''); }}
                                                style={{
                                                    padding: '10px 20px',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: 8,
                                                    color: '#94a3b8',
                                                    fontWeight: 500,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <button
                                        onClick={() => { setEditingId(post._id); setNewScheduleDate(new Date(post.scheduledFor).toISOString().slice(0, 16)); }}
                                        disabled={actionLoading === post._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '10px 16px',
                                            background: 'rgba(139, 92, 246, 0.2)',
                                            border: '1px solid rgba(139, 92, 246, 0.3)',
                                            borderRadius: 8,
                                            color: '#a78bfa',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            fontSize: 13
                                        }}
                                    >
                                        <Edit3 size={14} /> Edit Time
                                    </button>
                                    <button
                                        onClick={() => handlePublishNow(post._id)}
                                        disabled={actionLoading === post._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '10px 16px',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            borderRadius: 8,
                                            color: '#34d399',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            fontSize: 13
                                        }}
                                    >
                                        {actionLoading === post._id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
                                        Publish Now
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        disabled={actionLoading === post._id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '10px 16px',
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: 8,
                                            color: '#f87171',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            marginLeft: 'auto'
                                        }}
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
        </div>
    );
}

export default ScheduledPosts;
