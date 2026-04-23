import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';
import toast from 'react-hot-toast';

const MENU = [
  { path: '/dashboard',    label: 'Dashboard',      icon: '⊞', key: 'F1', perm: null },
  { path: '/trucks',       label: 'Fleet Master',   icon: '🚛', key: 'F2', perm: 'VIEW_TRUCKS' },
  { path: '/fuel',         label: 'Fuel Entries',   icon: '⛽', key: 'F3', perm: 'FUEL_ENTRY' },
  { path: '/trips',        label: 'Trips / Challan',icon: '📋', key: 'F4', perm: 'TRIPS' },
  { path: '/spare-parts',  label: 'Spare Parts',    icon: '🔧', key: 'F5', perm: 'SPARE_PART_ISSUE' },
  { path: '/tyres',        label: 'Tyre Stock',     icon: '⚙',  key: 'F6', perm: 'TYRE_ISSUE' },
  { path: '/reports',      label: 'Reports',        icon: '📊', key: 'F7', perm: null },
  { path: '/users',        label: 'User Management',icon: '👥', key: 'F8', adminOnly: true },
];

const inputStyle = {
  background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3',
  padding: '6px 10px', fontSize: 12, fontFamily: 'Consolas, monospace',
  borderRadius: 2, outline: 'none', width: '100%', boxSizing: 'border-box'
};
const labelStyle = { color: '#8b949e', fontSize: 10, marginBottom: 4, display: 'block' };

export default function Layout({ children }) {
  const { user, logout, isAdmin, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileTab, setProfileTab] = useState('password'); // 'password' | 'username'
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [unForm, setUnForm] = useState({ currentPassword: '', newUsername: '' });
  const [saving, setSaving] = useState(false);
  const now = new Date();

  const visibleMenu = MENU.filter(m => {
    if (m.adminOnly) return isAdmin();
    return true;
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success('Password changed successfully! Please login again.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowProfile(false);
      setTimeout(() => { logout(); navigate('/login'); }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Current password is incorrect');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (unForm.newUsername.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    setSaving(true);
    try {
      await authAPI.changeUsername({
        currentPassword: unForm.currentPassword,
        newUsername: unForm.newUsername.trim()
      });
      toast.success('Username changed! Please login again.');
      setUnForm({ currentPassword: '', newUsername: '' });
      setShowProfile(false);
      setTimeout(() => { logout(); navigate('/login'); }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || 'Failed - check password or username taken');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1117', fontFamily: 'Consolas, monospace', fontSize: 12 }}>

      {/* Sidebar */}
      <div style={{
        width: collapsed ? 48 : 200, background: '#161b22',
        borderRight: '1px solid #21262d', display: 'flex', flexDirection: 'column',
        transition: 'width 0.15s', flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '12px 8px' : '12px 16px',
          borderBottom: '1px solid #21262d', background: '#0f3460'
        }}>
          {collapsed ? (
            <div style={{ color: '#00d4ff', fontSize: 18, textAlign: 'center' }}>🚛</div>
          ) : (
            <div>
              <div style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: 13 }}>LOGISTICS PRO</div>
              <div style={{ color: '#6c757d', fontSize: 9, marginTop: 2 }}>Enterprise Suite v2.0</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, paddingTop: 8 }}>
          {visibleMenu.map(m => (
            <NavLink
              key={m.path}
              to={m.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '9px 12px' : '9px 16px',
                color: isActive ? '#00d4ff' : '#8b949e',
                background: isActive ? '#0f3460' : 'transparent',
                textDecoration: 'none', borderLeft: isActive ? '3px solid #00d4ff' : '3px solid transparent',
                transition: 'all 0.1s', fontSize: 11
              })}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>{m.icon}</span>
              {!collapsed && (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{m.label}</span>
                  <span style={{ fontSize: 9, color: '#30363d' }}>{m.key}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #21262d' }}>
            <div style={{ color: '#58a6ff', fontSize: 11, marginBottom: 2 }}>{user?.fullName || user?.username}</div>
            <div style={{
              display: 'inline-block', fontSize: 9, padding: '1px 6px', borderRadius: 2,
              background: user?.role === 'ADMIN' ? '#1a3a6e' : '#1a3a2e',
              color: user?.role === 'ADMIN' ? '#58a6ff' : '#3fb950',
              border: `1px solid ${user?.role === 'ADMIN' ? '#1f4fa8' : '#238636'}`
            }}>
              {user?.role} • {user?.department || 'N/A'}
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            padding: '8px', textAlign: 'center', color: '#6c757d',
            cursor: 'pointer', borderTop: '1px solid #21262d', fontSize: 14,
            userSelect: 'none'
          }}
        >
          {collapsed ? '▶' : '◀'}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          background: '#161b22', borderBottom: '1px solid #21262d',
          padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ color: '#8b949e', fontSize: 11 }}>
            📅 {now.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            &nbsp;&nbsp;🕐 {now.toLocaleTimeString('en-IN')}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: '#6c757d', fontSize: 10 }}>
              {user?.username} ({user?.role})
            </span>
            {/* My Account Button */}
            <button
              onClick={() => { setShowProfile(true); setProfileTab('password'); }}
              style={{
                background: '#1a3a2e', border: '1px solid #238636', color: '#3fb950',
                padding: '3px 10px', cursor: 'pointer', fontSize: 10,
                fontFamily: 'Consolas, monospace', borderRadius: 2
              }}
            >
              👤 MY ACCOUNT
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                background: '#21262d', border: '1px solid #30363d', color: '#f85149',
                padding: '3px 10px', cursor: 'pointer', fontSize: 10,
                fontFamily: 'Consolas, monospace', borderRadius: 2
              }}
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
          {children}
        </div>

        {/* Status bar */}
        <div style={{
          background: '#0f3460', borderTop: '1px solid #21262d',
          padding: '3px 20px', display: 'flex', gap: 24, fontSize: 10, color: '#8b949e'
        }}>
          <span>F1:Dashboard</span>
          <span>F2:Fleet</span>
          <span>F3:Fuel</span>
          <span>F4:Trips</span>
          <span>F5:Parts</span>
          <span>F6:Tyres</span>
          <span>F7:Reports</span>
          {isAdmin() && <span>F8:Users</span>}
          <span style={{ marginLeft: 'auto' }}>Logistics Pro Enterprise 2.0 | MongoDB</span>
        </div>
      </div>

      {/* ── MY ACCOUNT MODAL ─────────────────────────────── */}
      {showProfile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }}
          onClick={() => setShowProfile(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#161b22', border: '1px solid #30363d',
              width: 420, borderRadius: 2, fontFamily: 'Consolas, monospace'
            }}
          >
            {/* Modal header */}
            <div style={{ background: '#0f3460', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#00d4ff', fontSize: 12, fontWeight: 'bold' }}>👤 MY ACCOUNT — {user?.username}</span>
              <button onClick={() => setShowProfile(false)}
                style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
            </div>

            {/* User info strip */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid #21262d', background: '#0d1117' }}>
              <span style={{ color: '#58a6ff', fontSize: 11 }}>{user?.fullName || user?.username}</span>
              <span style={{ color: '#6c757d', fontSize: 10, marginLeft: 10 }}>{user?.role} • {user?.department || ''}</span>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #21262d' }}>
              {['password', 'username'].map(t => (
                <button key={t} onClick={() => setProfileTab(t)}
                  style={{
                    flex: 1, padding: '8px', background: profileTab === t ? '#0f3460' : '#161b22',
                    border: 'none', borderBottom: profileTab === t ? '2px solid #00d4ff' : '2px solid transparent',
                    color: profileTab === t ? '#00d4ff' : '#6c757d', cursor: 'pointer',
                    fontFamily: 'Consolas, monospace', fontSize: 10
                  }}
                >
                  {t === 'password' ? '🔒 CHANGE PASSWORD' : '✏️ CHANGE USERNAME'}
                </button>
              ))}
            </div>

            <div style={{ padding: 20 }}>

              {/* Change Password Tab */}
              {profileTab === 'password' && (
                <form onSubmit={handleChangePassword}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>CURRENT PASSWORD *</label>
                    <input
                      type="password"
                      value={pwForm.currentPassword}
                      onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                      style={inputStyle}
                      placeholder="Enter your current password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>NEW PASSWORD *</label>
                    <input
                      type="password"
                      value={pwForm.newPassword}
                      onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                      style={inputStyle}
                      placeholder="Minimum 4 characters"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>CONFIRM NEW PASSWORD *</label>
                    <input
                      type="password"
                      value={pwForm.confirmPassword}
                      onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      style={inputStyle}
                      placeholder="Repeat new password"
                      required
                      autoComplete="new-password"
                    />
                    {pwForm.newPassword && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                      <div style={{ color: '#f85149', fontSize: 10, marginTop: 4 }}>⚠ Passwords do not match</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowProfile(false)}
                      style={{ background: '#21262d', border: '1px solid #30363d', color: '#8b949e', padding: '5px 14px', cursor: 'pointer', fontFamily: 'Consolas, monospace', fontSize: 11, borderRadius: 2 }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}
                      style={{ background: saving ? '#21262d' : '#0d3320', border: '1px solid #238636', color: saving ? '#6c757d' : '#3fb950', padding: '5px 14px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Consolas, monospace', fontSize: 11, borderRadius: 2 }}>
                      {saving ? 'SAVING...' : 'CHANGE PASSWORD'}
                    </button>
                  </div>
                </form>
              )}

              {/* Change Username Tab */}
              {profileTab === 'username' && (
                <form onSubmit={handleChangeUsername}>
                  <div style={{ marginBottom: 4 }}>
                    <label style={labelStyle}>CURRENT USERNAME</label>
                    <div style={{ color: '#58a6ff', fontSize: 12, padding: '6px 10px', background: '#0d1117', border: '1px solid #21262d', borderRadius: 2, marginBottom: 12 }}>
                      {user?.username}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>NEW USERNAME *</label>
                    <input
                      type="text"
                      value={unForm.newUsername}
                      onChange={e => setUnForm(p => ({ ...p, newUsername: e.target.value }))}
                      style={inputStyle}
                      placeholder="Minimum 3 characters"
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>CURRENT PASSWORD (to confirm) *</label>
                    <input
                      type="password"
                      value={unForm.currentPassword}
                      onChange={e => setUnForm(p => ({ ...p, currentPassword: e.target.value }))}
                      style={inputStyle}
                      placeholder="Enter your current password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowProfile(false)}
                      style={{ background: '#21262d', border: '1px solid #30363d', color: '#8b949e', padding: '5px 14px', cursor: 'pointer', fontFamily: 'Consolas, monospace', fontSize: 11, borderRadius: 2 }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}
                      style={{ background: saving ? '#21262d' : '#0d3320', border: '1px solid #238636', color: saving ? '#6c757d' : '#3fb950', padding: '5px 14px', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Consolas, monospace', fontSize: 11, borderRadius: 2 }}>
                      {saving ? 'SAVING...' : 'CHANGE USERNAME'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
