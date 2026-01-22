


import React, { useState, useEffect } from "react";

const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:3000') + '/api';

export function ContactMessages({ onLogout }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/contact`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`${API_URL}/contact/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setContacts(contacts.filter(c => c._id !== id));
          if (selectedContact && selectedContact._id === id) {
            setSelectedContact(null);
          }
        }
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating contact status:', err);
    }
  };

  const getSubjectLabel = (subject) => {
    const subjects = {
      'general': 'General Inquiry',
      'technical': 'Technical Support',
      'content': 'Content Suggestion',
      'partnership': 'Partnership',
      'feedback': 'Feedback',
      'other': 'Other'
    };
    return subjects[subject] || subject || 'General Inquiry';
  };

  const getStatusBadge = (status) => {
    const styles = {
      'new': { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', icon: null },
      'read': { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308', icon: null },
      'replied': { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', icon: null },
      'resolved': { bg: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', icon: null }
    };
    const style = styles[status] || styles['new'];
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600',
        background: style.bg,
        color: style.color,
        textTransform: 'capitalize'
      }}>

        {status || 'new'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredContacts = filter === 'all'
    ? contacts
    : contacts.filter(c => c.status === filter);

  if (loading) {
    return (
      <div className="vy-blog-wrap">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px'
        }}>
          <div style={{ animation: 'spin 1s linear infinite', color: '#fc4c00', fontSize: '24px', fontWeight: 'bold' }}>Loading...</div>
          <p style={{ color: '#94a3b8' }}>Loading contact messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vy-blog-wrap">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px'
        }}>
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button onClick={fetchContacts} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #fc4c00, #ff7b3d)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            <span style={{ fontSize: '20px' }}>↻</span> Retry
          </button>
        </div>
      </div >
    );
  }

  return (
    <div className="vy-blog-wrap">
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#fff',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            Contact Messages
          </h1>
          <p style={{ color: '#94a3b8', margin: '8px 0 0', fontSize: '14px' }}>
            {contacts.length} total message{contacts.length !== 1 ? 's' : ''} • {contacts.filter(c => c.status === 'new').length} new
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchContacts}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Messages Grid */}
      {filteredContacts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ fontSize: '48px', color: '#64748b', marginBottom: '16px' }}>✉️</div>
          <h3 style={{ color: '#94a3b8', margin: '0 0 8px' }}>No messages found</h3>
          <p style={{ color: '#64748b', margin: 0 }}>
            {filter === 'all' ? 'No contact messages yet.' : `No ${filter} messages.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '20px 24px',
                border: contact.status === 'new' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                setSelectedContact(contact);
                if (contact.status === 'new') {
                  handleUpdateStatus(contact._id, 'read');
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: '16px'
                    }}>
                      {contact.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>
                        {contact.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                        {contact.email}
                      </p>
                    </div>
                    {getStatusBadge(contact.status)}
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      background: 'rgba(252, 76, 0, 0.15)',
                      color: '#fc4c00',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getSubjectLabel(contact.subject)}
                    </span>
                  </div>

                  <p style={{
                    margin: 0,
                    color: '#cbd5e1',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {contact.message}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <time style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>

                    {formatDate(contact.createdAt)}
                  </time>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact._id);
                    }}
                    style={{
                      padding: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#f87171',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>×</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing full message */}
      {selectedContact && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setSelectedContact(null)}>
          <div style={{
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid rgba(255,255,255,0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '20px'
                  }}>
                    {selectedContact.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                      {selectedContact.name}
                    </h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                      {selectedContact.email}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                style={{
                  padding: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>×</span>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Subject</label>
                <span style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  background: 'rgba(252, 76, 0, 0.15)',
                  color: '#fc4c00',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {getSubjectLabel(selectedContact.subject)}
                </span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Status</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['new', 'read', 'replied', 'resolved'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedContact._id, status)}
                      style={{
                        padding: '6px 12px',
                        background: selectedContact.status === status ? 'rgba(252, 76, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: selectedContact.status === status ? '1px solid #fc4c00' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: selectedContact.status === status ? '#fc4c00' : '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '13px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '8px' }}>Message</label>
                <div style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <p style={{
                    margin: 0,
                    color: '#e2e8f0',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '12px'
              }}>
                <time style={{ fontSize: '13px', color: '#64748b' }}>
                  Received: {formatDate(selectedContact.createdAt)}
                </time>
                <button
                  onClick={() => handleDelete(selectedContact._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    color: '#f87171',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ContactMessages;
