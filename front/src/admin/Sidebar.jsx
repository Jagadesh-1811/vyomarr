import { useState } from 'react';
import { Rocket, Sparkles, FileText, MessageSquare, MessagesSquare, Users, LogOut, Mail, CalendarClock, Layout, X } from 'lucide-react';

const MENU_ITEMS = [
  {
    id: 1,
    label: 'Space & Mysteries',
    icon: Rocket,
    color: '#fc4c00', // Space Orange (brand color)
    bgColor: 'rgba(252, 76, 0, 0.15)',
    gradient: 'linear-gradient(135deg, #fc4c00, #ff6a2b)'
  },
  {
    id: 8,
    label: 'Scheduled Posts',
    icon: CalendarClock,
    color: '#8b5cf6', // Purple
    bgColor: 'rgba(139, 92, 246, 0.15)',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
  },
  {
    id: 2,
    label: 'What If?',
    icon: Sparkles,
    color: '#f59e0b', // Amber
    bgColor: 'rgba(245, 158, 11, 0.15)',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
  },
  {
    id: 3,
    label: 'Published Articles',
    icon: FileText,
    color: '#10b981', // Emerald
    bgColor: 'rgba(16, 185, 129, 0.15)',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)'
  },
  {
    id: 9,
    label: 'Site Settings',
    icon: Layout,
    color: '#d946ef', // Fuchsia
    bgColor: 'rgba(217, 70, 239, 0.15)',
    gradient: 'linear-gradient(135deg, #d946ef, #e879f9)'
  },
  {
    id: 4,
    label: 'Feedback & Issues',
    icon: MessageSquare,
    color: '#ef4444', // Red
    bgColor: 'rgba(239, 68, 68, 0.15)',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)'
  },
  {
    id: 5,
    label: 'Contact Messages',
    icon: Mail,
    color: '#06b6d4', // Cyan
    bgColor: 'rgba(6, 182, 212, 0.15)',
    gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)'
  },
  {
    id: 6,
    label: 'Comments',
    icon: MessagesSquare,
    color: '#3b82f6', // Blue
    bgColor: 'rgba(59, 130, 246, 0.15)',
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
  },
  {
    id: 7,
    label: 'Subscribed Users',
    icon: Users,
    color: '#ec4899', // Pink
    bgColor: 'rgba(236, 72, 153, 0.15)',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)'
  },
];

export default function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) {
  const handleMenuClick = (label) => {
    setActiveSection(label);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none'
          }}
          className="mobile-overlay"
        />
      )}

      <aside style={{
        width: '280px',
        background: 'linear-gradient(180deg, #000b49 0%, #001a66 50%, #000b49 100%)',
        borderRight: '1px solid rgba(252, 76, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 30px rgba(0,0,0,0.4), 0 0 40px rgba(252, 76, 0, 0.05)',
        position: 'relative',
        zIndex: 1000,
        transition: 'transform 0.3s ease'
      }}
        className="admin-sidebar"
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="mobile-close-btn"
          style={{
            position: 'absolute',
            top: '20px',
            right: '16px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1001,
            color: '#f87171'
          }}
        >
          <X size={20} />
        </button>

        {/* Logo Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(135deg, rgba(252,76,0,0.1), rgba(139,92,246,0.1))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/assets/images/logo.png"
              alt="Vyomarr Logo"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain'
              }}
            />
            <div>
              <h2 style={{
                margin: '0',
                fontSize: '22px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Vyomarr</h2>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Admin Dashboard</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: '8px', overflowY: 'auto' }}>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.label;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  background: isActive ? item.bgColor : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isActive ? item.color : '#94a3b8',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    background: item.gradient,
                    borderRadius: '0 4px 4px 0'
                  }} />
                )}

                {/* Icon container */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isActive ? item.gradient : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? `0 4px 12px ${item.color}40` : 'none'
                }}>
                  <Icon size={18} color={isActive ? '#fff' : '#94a3b8'} />
                </div>

                <span>{item.label}</span>

                {/* Notification dot for Feedback & Contact Messages */}
                {(item.label === 'Feedback & Issues' || item.label === 'Contact Messages') && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: item.label === 'Contact Messages' ? '#06b6d4' : '#ef4444',
                    boxShadow: item.label === 'Contact Messages' ? '0 0 8px rgba(6,182,212,0.6)' : '0 0 8px rgba(239,68,68,0.6)'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#f87171',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Responsive Styles */}
        <style>{`
          @media (max-width: 768px) {
            .admin-sidebar {
              position: fixed !important;
              top: 0;
              left: 0;
              height: 100vh;
              transform: translateX(${sidebarOpen ? '0' : '-100%'});
              box-shadow: ${sidebarOpen ? '4px 0 30px rgba(0,0,0,0.6)' : 'none'};
            }
            
            .mobile-overlay {
              display: ${sidebarOpen ? 'block' : 'none'} !important;
            }

            .mobile-close-btn {
              display: flex !important;
            }
          }

          @media (max-width: 480px) {
            .admin-sidebar {
              width: 100% !important;
              max-width: 320px;
            }
          }
        `}</style>
      </aside>
    </>
  );
}
