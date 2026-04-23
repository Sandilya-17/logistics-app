import React from 'react';

// ── Tally-style data table ────────────────────────────────────────────
export function TallyTable({ columns, data, onRowClick, keyField = 'id', compact = false }) {
  const rowH = compact ? '26px' : '30px';
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ background: '#0f3460' }}>
            <th style={{ ...thStyle, width: 36 }}>#</th>
            {columns.map(c => (
              <th key={c.key} style={{ ...thStyle, textAlign: c.align || 'left', width: c.width }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} style={{ ...tdStyle, textAlign: 'center', color: '#6c757d', padding: 20 }}>
                ── No records found ──
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row[keyField] || i}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  background: i % 2 === 0 ? '#161b22' : '#0d1117',
                  cursor: onRowClick ? 'pointer' : 'default',
                  height: rowH
                }}
                onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = '#1f2937'; }}
                onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? '#161b22' : '#0d1117'; }}
              >
                <td style={{ ...tdStyle, color: '#6c757d', textAlign: 'center' }}>{i + 1}</td>
                {columns.map(c => (
                  <td key={c.key} style={{ ...tdStyle, textAlign: c.align || 'left', color: c.color || '#e6edf3' }}>
                    {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '6px 10px', color: '#8b949e', fontWeight: 'normal',
  borderBottom: '1px solid #21262d', borderRight: '1px solid #1a2332',
  fontSize: 10, letterSpacing: 0.5, whiteSpace: 'nowrap'
};
const tdStyle = {
  padding: '4px 10px', borderBottom: '1px solid #1a2332',
  borderRight: '1px solid #1a2332', whiteSpace: 'nowrap', overflow: 'hidden',
  maxWidth: 200, textOverflow: 'ellipsis'
};

// ── Page header ──────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      background: '#161b22', borderBottom: '1px solid #21262d',
      padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <div style={{ color: '#e6edf3', fontWeight: 'bold', fontSize: 13 }}>{title}</div>
        {subtitle && <div style={{ color: '#6c757d', fontSize: 10, marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>{actions}</div>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', disabled, small, type = 'button' }) {
  const colors = {
    primary: { bg: '#0f3460', border: '#1f4fa8', color: '#58a6ff' },
    success: { bg: '#0d3320', border: '#238636', color: '#3fb950' },
    danger:  { bg: '#3d1a1a', border: '#da3633', color: '#f85149' },
    warning: { bg: '#2d2000', border: '#9e6a03', color: '#d29922' },
    ghost:   { bg: '#21262d', border: '#30363d', color: '#8b949e' },
  };
  const c = colors[variant] || colors.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#21262d' : c.bg,
        border: `1px solid ${disabled ? '#30363d' : c.border}`,
        color: disabled ? '#6c757d' : c.color,
        padding: small ? '3px 10px' : '5px 14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Consolas, monospace',
        fontSize: small ? 10 : 11, borderRadius: 2
      }}
    >
      {children}
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div
        style={{
          background: '#161b22', border: '1px solid #30363d',
          width: wide ? 800 : 520, maxWidth: '95vw', maxHeight: '90vh',
          overflow: 'auto', borderRadius: 2, fontFamily: 'Consolas, monospace'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          background: '#0f3460', padding: '8px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ color: '#00d4ff', fontSize: 12, fontWeight: 'bold' }}>{title}</span>
          <span onClick={onClose} style={{ color: '#f85149', cursor: 'pointer', fontSize: 16 }}>✕</span>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Form field ────────────────────────────────────────────────────────
export function Field({ label, children, half }) {
  return (
    <div style={{ marginBottom: 12, width: half ? '48%' : '100%' }}>
      <label style={{ color: '#8b949e', fontSize: 10, display: 'block', marginBottom: 3 }}>
        {label} :
      </label>
      {children}
    </div>
  );
}

export function Input({ value, onChange, type = 'text', required, placeholder, name }) {
  return (
    <input
      name={name} type={type} value={value} onChange={onChange}
      required={required} placeholder={placeholder}
      style={{
        width: '100%', background: '#0d1117', border: '1px solid #30363d',
        color: '#e6edf3', padding: '6px 8px', fontSize: 11,
        fontFamily: 'Consolas, monospace', borderRadius: 2,
        outline: 'none', boxSizing: 'border-box'
      }}
      onFocus={e => e.target.style.borderColor = '#00d4ff'}
      onBlur={e => e.target.style.borderColor = '#30363d'}
    />
  );
}

export function Select({ value, onChange, children, name, required }) {
  return (
    <select
      name={name} value={value} onChange={onChange} required={required}
      style={{
        width: '100%', background: '#0d1117', border: '1px solid #30363d',
        color: '#e6edf3', padding: '6px 8px', fontSize: 11,
        fontFamily: 'Consolas, monospace', borderRadius: 2,
        outline: 'none', boxSizing: 'border-box', cursor: 'pointer'
      }}
      onFocus={e => e.target.style.borderColor = '#00d4ff'}
      onBlur={e => e.target.style.borderColor = '#30363d'}
    >
      {children}
    </select>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, color = '#58a6ff', icon }) {
  return (
    <div style={{
      background: '#161b22', border: '1px solid #21262d',
      padding: '14px 18px', borderRadius: 2, minWidth: 150, flex: 1
    }}>
      <div style={{ color: '#6c757d', fontSize: 10, marginBottom: 6 }}>{icon} {label}</div>
      <div style={{ color, fontSize: 22, fontWeight: 'bold' }}>{value}</div>
      {sub && <div style={{ color: '#6c757d', fontSize: 10, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────
export function Badge({ text, type = 'default' }) {
  const map = {
    success: { bg: '#0d3320', color: '#3fb950', border: '#238636' },
    danger:  { bg: '#3d1a1a', color: '#f85149', border: '#da3633' },
    warning: { bg: '#2d2000', color: '#d29922', border: '#9e6a03' },
    info:    { bg: '#0f3460', color: '#58a6ff', border: '#1f4fa8' },
    default: { bg: '#21262d', color: '#8b949e', border: '#30363d' },
  };
  const c = map[type] || map.default;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      padding: '1px 6px', borderRadius: 2, fontSize: 9, fontWeight: 'bold'
    }}>
      {text}
    </span>
  );
}

// ── Section divider ───────────────────────────────────────────────────
export function Section({ title, children }) {
  return (
    <div style={{ margin: '0 20px 20px', background: '#161b22', border: '1px solid #21262d', borderRadius: 2 }}>
      <div style={{
        background: '#1a2332', padding: '6px 14px',
        borderBottom: '1px solid #21262d', color: '#8b949e', fontSize: 10, letterSpacing: 1
      }}>
        ▸ {title}
      </div>
      {children}
    </div>
  );
}
