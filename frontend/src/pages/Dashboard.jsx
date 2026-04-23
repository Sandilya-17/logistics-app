import React, { useEffect, useState } from 'react';
import { trucksAPI, fuelAPI, tripsAPI, sparePartsAPI, tyresAPI } from '../api/api';
import { StatCard, PageHeader, Section, TallyTable, Badge } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState({
    trucks: [], fuel: [], trips: {}, parts: [], tyres: []
  });
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    Promise.all([
      trucksAPI.getAll(),
      fuelAPI.getExcessReport(now.getMonth() + 1, now.getFullYear()),
      tripsAPI.getSummary(),
      sparePartsAPI.getAll(),
      tyresAPI.getAll(),
    ]).then(([t, f, tr, sp, ty]) => {
      setData({
        trucks: t.data, fuel: f.data,
        trips: tr.data, parts: sp.data, tyres: ty.data
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ color: '#00d4ff', padding: 40, fontFamily: 'Consolas, monospace', textAlign: 'center' }}>
      Loading dashboard...
    </div>
  );

  const activeTrucks = data.trucks.filter(t => t.status === 'ACTIVE').length;
  const excessCount = data.fuel.filter(f => f.isExcess).length;
  const lowStock = data.parts.filter(p => p.currentStock <= p.reorderLevel && p.reorderLevel > 0).length;
  const lowTyres = data.tyres.filter(t => t.currentStock <= t.reorderLevel && t.reorderLevel > 0).length;
  const totalFuelCost = data.fuel.reduce((s, f) => s + (f.totalCost || 0), 0);

  const fuelChartData = data.fuel.slice(0, 10).map(f => ({
    name: f.truckNumber,
    consumed: parseFloat(f.totalConsumed?.toFixed(1) || 0),
    limit: f.fuelLimit,
  }));

  const recentAlerts = [
    ...data.fuel.filter(f => f.isExcess).map(f => ({
      type: 'warning', msg: `${f.truckNumber} exceeded fuel limit by ${(f.excess).toFixed(1)}L`
    })),
    ...(lowStock > 0 ? [{ type: 'danger', msg: `${lowStock} spare part(s) below reorder level` }] : []),
    ...(lowTyres > 0 ? [{ type: 'danger', msg: `${lowTyres} tyre(s) below reorder level` }] : []),
  ].slice(0, 6);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.fullName || user?.username}`}
        subtitle={`${now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | ${user?.role} | ${user?.department || ''}`}
      />

      {/* KPI Row */}
      <div style={{ padding: '16px 20px 0', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <StatCard label="ACTIVE TRUCKS" value={activeTrucks} sub={`of ${data.trucks.length} total`} color="#3fb950" icon="🚛" />
        <StatCard label="TRIPS IN TRANSIT" value={data.trips.inTransit || 0} sub={`${data.trips.total || 0} total trips`} color="#58a6ff" icon="📋" />
        <StatCard label="FUEL THIS MONTH" value={`₹${((totalFuelCost)||0).toLocaleString('en-IN')}`} sub={`${excessCount} trucks exceeded limit`} color={excessCount > 0 ? '#d29922' : '#3fb950'} icon="⛽" />
        <StatCard label="FREIGHT PENDING" value={`₹${((data.trips.totalPending)||0).toLocaleString('en-IN')}`} sub={`of ₹${((data.trips.totalFreight)||0).toLocaleString('en-IN')} total`} color="#f85149" icon="💰" />
        <StatCard label="LOW STOCK ALERTS" value={lowStock + lowTyres} sub="spare parts + tyres" color={lowStock + lowTyres > 0 ? '#f85149' : '#3fb950'} icon="⚠" />
      </div>

      <div style={{ display: 'flex', gap: 0, marginTop: 16 }}>
        {/* Fuel Chart */}
        <div style={{ flex: 2 }}>
          <Section title={`FUEL CONSUMPTION THIS MONTH — ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`}>
            <div style={{ padding: '12px 8px' }}>
              {fuelChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={fuelChartData} margin={{ top: 5, right: 10, bottom: 20, left: 10 }}>
                    <XAxis dataKey="name" tick={{ fill: '#8b949e', fontSize: 9 }} angle={-30} textAnchor="end" />
                    <YAxis tick={{ fill: '#8b949e', fontSize: 9 }} />
                    <Tooltip
                      contentStyle={{ background: '#161b22', border: '1px solid #30363d', fontSize: 11, fontFamily: 'Consolas' }}
                      labelStyle={{ color: '#58a6ff' }}
                    />
                    <Bar dataKey="consumed" name="Consumed (L)" radius={[2,2,0,0]}>
                      {fuelChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.consumed > entry.limit ? '#f85149' : '#238636'} />
                      ))}
                    </Bar>
                    <Bar dataKey="limit" name="Limit (L)" fill="#1f4fa8" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ color: '#6c757d', textAlign: 'center', padding: 40, fontSize: 11 }}>
                  No fuel data for this month
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Alerts */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <Section title="ALERTS & NOTIFICATIONS">
            <div style={{ padding: 12 }}>
              {recentAlerts.length === 0 ? (
                <div style={{ color: '#3fb950', fontSize: 11, textAlign: 'center', padding: 20 }}>
                  ✓ No alerts. All systems normal.
                </div>
              ) : (
                recentAlerts.map((a, i) => (
                  <div key={i} style={{
                    padding: '7px 10px', marginBottom: 6,
                    background: a.type === 'danger' ? '#1a0a0a' : '#1a1400',
                    border: `1px solid ${a.type === 'danger' ? '#3d0f0f' : '#3d2e00'}`,
                    borderRadius: 2, fontSize: 10,
                    color: a.type === 'danger' ? '#f85149' : '#d29922'
                  }}>
                    {a.type === 'danger' ? '⚠ ' : '⚡ '}{a.msg}
                  </div>
                ))
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Quick summary tables */}
      <div style={{ display: 'flex', gap: 0 }}>
        <div style={{ flex: 1 }}>
          <Section title="FLEET SUMMARY">
            <TallyTable
              compact
              data={data.trucks.slice(0, 8)}
              columns={[
                { key: 'truckNumber', label: 'Truck No.', width: 100 },
                { key: 'driverName', label: 'Driver' },
                { key: 'status', label: 'Status', width: 80,
                  render: v => <Badge text={v} type={v === 'ACTIVE' ? 'success' : 'danger'} /> },
                { key: 'location', label: 'Location', width: 100 },
              ]}
            />
          </Section>
        </div>
        <div style={{ flex: 1 }}>
          <Section title="TRIPS SUMMARY">
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Total Trips', val: data.trips.total || 0, c: '#e6edf3' },
                { label: 'Planned', val: data.trips.planned || 0, c: '#d29922' },
                { label: 'In Transit', val: data.trips.inTransit || 0, c: '#58a6ff' },
                { label: 'Delivered', val: data.trips.delivered || 0, c: '#3fb950' },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#0d1117', border: '1px solid #21262d',
                  padding: '10px 14px', borderRadius: 2
                }}>
                  <div style={{ color: '#6c757d', fontSize: 10 }}>{item.label}</div>
                  <div style={{ color: item.c, fontSize: 20, fontWeight: 'bold' }}>{item.val}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
