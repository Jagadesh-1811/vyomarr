import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Admin credentials from environment variables
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setSuccess('Login successful!');
      localStorage.setItem('adminToken', 'admin-token');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } else {
      setError('Invalid credentials');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000b49 0%, #001a66 50%, #000b49 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(252, 76, 0, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '30%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(0, 100, 200, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Login Card */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(0, 11, 73, 0.9), rgba(0, 26, 102, 0.7))',
        border: '1px solid rgba(252, 76, 0, 0.3)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 60px rgba(252, 76, 0, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/assets/images/logo.png"
            alt="Vyomarr Logo"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
              margin: '0 auto 16px',
              display: 'block'
            }}
          />
          <h1 style={{
            margin: '0 0 8px',
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #fff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Vyomarr</h1>
          <p style={{ margin: 0, color: '#bfc3c6', fontSize: '14px' }}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#f8f9f9',
              fontWeight: '600',
              fontSize: '14px',
              letterSpacing: '0.3px'
            }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#bfc3c6'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: 'rgba(0, 11, 73, 0.6)',
                  border: '1px solid rgba(252, 76, 0, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  color: '#f8f9f9',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fc4c00';
                  e.target.style.boxShadow = '0 0 0 3px rgba(252, 76, 0, 0.15), 0 0 20px rgba(252, 76, 0, 0.1)';
                  e.target.style.background = 'rgba(0, 11, 73, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(252, 76, 0, 0.2)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(0, 11, 73, 0.6)';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#f8f9f9',
              fontWeight: '600',
              fontSize: '14px',
              letterSpacing: '0.3px'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#bfc3c6'
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: 'rgba(0, 11, 73, 0.6)',
                  border: '1px solid rgba(252, 76, 0, 0.2)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  color: '#f8f9f9',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fc4c00';
                  e.target.style.boxShadow = '0 0 0 3px rgba(252, 76, 0, 0.15), 0 0 20px rgba(252, 76, 0, 0.1)';
                  e.target.style.background = 'rgba(0, 11, 73, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(252, 76, 0, 0.2)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(0, 11, 73, 0.6)';
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #fc4c00, #ff6a2b)',
              color: '#f8f9f9',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(252, 76, 0, 0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 30px rgba(252, 76, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(252, 76, 0, 0.4)';
            }}
          >
            Login
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div style={{
            marginTop: '20px',
            padding: '14px 16px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            marginTop: '20px',
            padding: '14px 16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            color: '#34d399',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}