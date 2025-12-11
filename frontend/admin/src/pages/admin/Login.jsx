import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setError('Invalid credentials');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'white' }}>
      <div style={{ background: 'white', border: '1px solid #ff0707ff', borderRadius: '8px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 2px 10px rgba(212, 54, 54, 0.1)' }}>
        <h1 style={{ margin: '0 0 30px', color: 'black', textAlign: 'center', fontSize: '28px' }}>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'black', fontWeight: '500' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '12px', border: '1px solid #ff0000ff', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'black', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: '100%', padding: '12px', border: '1px solid #f71010ff', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', background: 'black', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Login
          </button>
        </form>

        {error && <p style={{ marginTop: '16px', padding: '12px', background: '#fc1d1dff', color: '#cc0000', borderRadius: '4px', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ marginTop: '16px', padding: '12px', background: '#16f516ff', color: '#247624ff', borderRadius: '4px', textAlign: 'center' }}>{success}</p>}

        <p style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #c91a1aff', color: '#666', fontSize: '12px', lineHeight: '1.6' }}>
          
        </p>
      </div>
    </div>
  );
}