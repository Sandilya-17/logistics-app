import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      toast.success(`Welcome, ${user.fullName || user.username}`);
      navigate('/dashboard');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#1a1a2e', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Consolas, monospace'
    }}>
      <div style={{
        background: '#16213e', border: '1px solid #0f3460',
        width: 420, padding: '0', borderRadius: 2
      }}>
        {/* Title bar */}
        <div style={{
          background: '#0f3460', padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: 13 }}>
            ▶ ENTERPRISE LOGISTICS MANAGEMENT SYSTEM v2.0
          </span>
        </div>

        {/* Company header */}
        <div style={{
          background: '#1a1a2e', borderBottom: '1px solid #0f3460',
          padding: '20px 24px', textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>🚛</div>
          <div style={{ color: '#00d4ff', fontSize: 16, fontWeight: 'bold', letterSpacing: 2 }}>
            LOGISTICS PRO
          </div>
          <div style={{ color: '#6c757d', fontSize: 11, marginTop: 2 }}>
            Fleet & Inventory Management
          </div>
        </div>

        {/* Login form */}
        <div style={{ padding: '24px' }}>
          <div style={{ color: '#adb5bd', fontSize: 11, marginBottom: 16, textAlign: 'center' }}>
            ── USER AUTHENTICATION ──
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ color: '#adb5bd', fontSize: 11, display: 'block', marginBottom: 4 }}>
                USER ID :
              </label>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                autoFocus
                required
                style={{
                  width: '100%', background: '#0d1117', border: '1px solid #30363d',
                  color: '#e6edf3', padding: '7px 10px', fontSize: 13,
                  fontFamily: 'Consolas, monospace', borderRadius: 2,
                  outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#00d4ff'}
                onBlur={e => e.target.style.borderColor = '#30363d'}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#adb5bd', fontSize: 11, display: 'block', marginBottom: 4 }}>
                PASSWORD :
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{
                  width: '100%', background: '#0d1117', border: '1px solid #30363d',
                  color: '#e6edf3', padding: '7px 10px', fontSize: 13,
                  fontFamily: 'Consolas, monospace', borderRadius: 2,
                  outline: 'none', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#00d4ff'}
                onBlur={e => e.target.style.borderColor = '#30363d'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#0d4a6e' : '#0f3460',
                border: '1px solid #00d4ff', color: '#00d4ff',
                padding: '8px', fontSize: 12, fontFamily: 'Consolas, monospace',
                cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 2,
                letterSpacing: 2, fontWeight: 'bold'
              }}
            >
              {loading ? 'AUTHENTICATING...' : '[ ENTER SYSTEM ]'}
            </button>
          </form>

          <div style={{
            marginTop: 20, padding: '10px', background: '#0d1117',
            border: '1px solid #21262d', borderRadius: 2
          }}>
            <div style={{ color: '#6c757d', fontSize: 10, marginBottom: 6 }}>DEFAULT CREDENTIALS:</div>
            <div style={{ color: '#58a6ff', fontSize: 11 }}>Admin  : admin / admin123</div>
            <div style={{ color: '#3fb950', fontSize: 11 }}>Employee: employee1 / emp123</div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #21262d', padding: '8px 16px',
          display: 'flex', justifyContent: 'space-between'
        }}>
          <span style={{ color: '#6c757d', fontSize: 10 }}>© 2024 Logistics Pro</span>
          <span style={{ color: '#6c757d', fontSize: 10 }}>Press Enter to Login</span>
        </div>
      </div>
    </div>
  );
}
