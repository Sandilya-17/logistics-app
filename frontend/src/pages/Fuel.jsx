import React, { useEffect, useState } from 'react';
import { fuelAPI, trucksAPI } from '../api/api';
import { TallyTable, PageHeader, Btn, Modal, Field, Input, Select, Section, Badge, StatCard } from '../components/UI';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EMPTY = {
  truckNumber: '', liters: '', pricePerLiter: '', fuelStation: '',
  paymentMode: 'CASH', invoiceNumber: '', odometerReading: '', remarks: ''
};

export default function Fuel() {
  const { user } = useAuth();
  const now = new Date();
  const [entries, setEntries] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [excessReport, setExcessReport] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [tab, setTab] = useState('entries');
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterTruck, setFilterTruck] = useState('');

  const load = () => {
    fuelAPI.getAll().then(r => setEntries(r.data));
    trucksAPI.getNumbers().then(r => setTrucks(r.data));
    loadExcess();
  };

  const loadExcess = () => {
    fuelAPI.getExcessReport(filterMonth, filterYear).then(r => setExcessReport(r.data));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { loadExcess(); }, [filterMonth, filterYear]);

  const filtered = entries.filter(e => {
    const mMatch = !filterMonth || e.month === +filterMonth;
    const yMatch = !filterYear || e.year === +filterYear;
    const tMatch = !filterTruck || e.truckNumber === filterTruck;
    return mMatch && yMatch && tMatch;
  });

  const totalLiters = filtered.reduce((s, e) => s + (e.liters || 0), 0);
  const totalCost = filtered.reduce((s, e) => s + (e.totalCost || 0), 0);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    try {
      if (modal === 'add') {
        await fuelAPI.add({
          ...form,
          liters: +form.liters,
          pricePerLiter: +form.pricePerLiter,
          odometerReading: +form.odometerReading,
          enteredBy: user?.username
        });
        toast.success('Fuel entry added');
      } else {
        await fuelAPI.update(selected.id, {
          ...form,
          liters: +form.liters,
          pricePerLiter: +form.pricePerLiter,
          odometerReading: +form.odometerReading,
        });
        toast.success('Fuel entry updated');
      }
      load(); setModal(null); setForm(EMPTY);
    } catch (err) {
      toast.error(err.response?.data || 'Error saving entry');
    }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm(`Delete fuel entry for ${entry.truckNumber} (${entry.liters}L)?`)) return;
    try {
      await fuelAPI.delete(entry.id);
      toast.success('Entry deleted');
      load();
    } catch {
      toast.error('Could not delete entry');
    }
  };

  const openEdit = (entry) => {
    setForm({ ...EMPTY, ...entry });
    setSelected(entry);
    setModal('edit');
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      <PageHeader
        title="FUEL MANAGEMENT"
        subtitle={`${filtered.length} entries | ${totalLiters.toFixed(1)} L | ₹${totalCost.toLocaleString('en-IN')}`}
        actions={[
          <Btn key="a" variant="success" onClick={() => { setForm(EMPTY); setModal('add'); }}>+ FUEL ENTRY</Btn>
        ]}
      />

      {/* Filters */}
      <div style={{
        background: '#161b22', borderBottom: '1px solid #21262d',
        padding: '8px 20px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap'
      }}>
        <span style={{ color: '#6c757d', fontSize: 10 }}>FILTER:</span>
        <select value={filterMonth} onChange={e => setFilterMonth(+e.target.value)}
          style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', padding: '3px 8px', fontSize: 11, fontFamily: 'Consolas, monospace', borderRadius: 2 }}>
          {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={filterYear} onChange={e => setFilterYear(+e.target.value)}
          style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', padding: '3px 8px', fontSize: 11, fontFamily: 'Consolas, monospace', borderRadius: 2 }}>
          {[2023,2024,2025,2026].map(y => <option key={y}>{y}</option>)}
        </select>
        <select value={filterTruck} onChange={e => setFilterTruck(e.target.value)}
          style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', padding: '3px 8px', fontSize: 11, fontFamily: 'Consolas, monospace', borderRadius: 2 }}>
          <option value="">All Trucks</option>
          {trucks.map(t => <option key={t}>{t}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 0, marginLeft: 'auto' }}>
          {['entries','excess'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                background: tab === t ? '#0f3460' : '#21262d',
                border: '1px solid #30363d', color: tab === t ? '#58a6ff' : '#6c757d',
                padding: '3px 14px', cursor: 'pointer', fontFamily: 'Consolas, monospace', fontSize: 10
              }}>
              {t === 'entries' ? 'ENTRIES' : 'EXCESS REPORT'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ padding: '12px 20px', display: 'flex', gap: 10 }}>
        <StatCard label="TOTAL LITERS" value={totalLiters.toFixed(1)} sub="this period" color="#58a6ff" icon="⛽" />
        <StatCard label="TOTAL COST" value={`₹${totalCost.toLocaleString('en-IN')}`} sub="fuel expense" color="#d29922" icon="💰" />
        <StatCard label="AVG PRICE/L" value={`₹${filtered.length > 0 ? (totalCost / totalLiters).toFixed(2) : 0}`} sub="per litre avg" color="#3fb950" icon="📊" />
        <StatCard label="EXCESS TRUCKS" value={excessReport.filter(e => e.isExcess).length} sub={`of ${excessReport.length} trucks`} color="#f85149" icon="⚠" />
      </div>

      {tab === 'entries' ? (
        <Section title={`FUEL ENTRIES (${filtered.length})`}>
          <TallyTable
            data={[...filtered].reverse()}
            columns={[
              { key: 'truckNumber', label: 'Truck', width: 110, color: '#58a6ff' },
              { key: 'liters', label: 'Liters', align: 'right', width: 80,
                render: v => <span style={{ color: '#3fb950' }}>{v?.toFixed(1)}</span> },
              { key: 'pricePerLiter', label: '₹/Litre', align: 'right', width: 80,
                render: v => v ? `₹${v.toFixed(2)}` : '—' },
              { key: 'totalCost', label: 'Total Cost', align: 'right', width: 100,
                render: v => v ? <span style={{ color: '#d29922' }}>₹{v.toLocaleString('en-IN')}</span> : '—' },
              { key: 'fuelStation', label: 'Station', width: 120 },
              { key: 'paymentMode', label: 'Payment', width: 80,
                render: v => <Badge text={v || 'CASH'} type={v === 'ACCOUNT' ? 'info' : 'default'} /> },
              { key: 'odometerReading', label: 'Odometer', align: 'right', width: 90,
                render: v => v ? `${v} km` : '—' },
              { key: 'enteredBy', label: 'Entered By', width: 100 },
              { key: 'filledAt', label: 'Date', width: 110,
                render: v => v ? new Date(v).toLocaleDateString('en-IN') : '—' },
              { key: 'id', label: 'Actions', width: 110,
                render: (_, row) => (
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    <Btn small variant="ghost" onClick={() => openEdit(row)}>Edit</Btn>
                    <Btn small variant="danger" onClick={() => handleDelete(row)}>Del</Btn>
                  </div>
                )
              },
            ]}
          />
        </Section>
      ) : (
        <Section title={`MONTHLY EXCESS FUEL REPORT — ${months[filterMonth-1]} ${filterYear}`}>
          <TallyTable
            data={excessReport}
            columns={[
              { key: 'truckNumber', label: 'Truck No.', color: '#58a6ff' },
              { key: 'driverName', label: 'Driver' },
              { key: 'fuelLimit', label: 'Limit (L)', align: 'right', color: '#3fb950',
                render: v => v?.toFixed(1) },
              { key: 'totalConsumed', label: 'Consumed (L)', align: 'right',
                render: v => v?.toFixed(1) },
              { key: 'excess', label: 'Excess (L)', align: 'right',
                render: (v, row) => row.isExcess
                  ? <span style={{ color: '#f85149', fontWeight: 'bold' }}>+{v?.toFixed(1)}</span>
                  : <span style={{ color: '#3fb950' }}>—</span> },
              { key: 'totalCost', label: 'Total Cost', align: 'right',
                render: v => v ? <span style={{ color: '#d29922' }}>₹{v.toLocaleString('en-IN')}</span> : '—' },
              { key: 'entryCount', label: 'Entries', align: 'right' },
              { key: 'isExcess', label: 'Status', width: 80,
                render: v => <Badge text={v ? 'EXCESS' : 'NORMAL'} type={v ? 'danger' : 'success'} /> },
            ]}
          />
        </Section>
      )}

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'NEW FUEL ENTRY' : `EDIT FUEL ENTRY — ${selected?.truckNumber}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit}>
            <Field label="Truck Number *">
              <Select name="truckNumber" value={form.truckNumber} onChange={handleChange} required>
                <option value="">-- Select Truck --</option>
                {trucks.map(t => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <div style={{ display: 'flex', gap: '4%', flexWrap: 'wrap' }}>
              <Field label="Liters *" half><Input name="liters" type="number" step="0.1" value={form.liters} onChange={handleChange} required /></Field>
              <Field label="Price Per Liter (₹) *" half><Input name="pricePerLiter" type="number" step="0.01" value={form.pricePerLiter} onChange={handleChange} required /></Field>
              <Field label="Total Cost (₹)" half>
                <div style={{ color: '#d29922', fontSize: 14, padding: '6px 0', fontWeight: 'bold' }}>
                  ₹ {form.liters && form.pricePerLiter ? (+form.liters * +form.pricePerLiter).toFixed(2) : '0.00'}
                </div>
              </Field>
              <Field label="Fuel Station" half><Input name="fuelStation" value={form.fuelStation} onChange={handleChange} /></Field>
              <Field label="Payment Mode" half>
                <Select name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                  <option>CASH</option><option>CARD</option><option>ACCOUNT</option>
                </Select>
              </Field>
              <Field label="Invoice No." half><Input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} /></Field>
              <Field label="Odometer Reading (km)" half><Input name="odometerReading" type="number" value={form.odometerReading} onChange={handleChange} /></Field>
            </div>
            <Field label="Remarks"><Input name="remarks" value={form.remarks} onChange={handleChange} /></Field>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="success">{modal === 'add' ? 'SAVE ENTRY' : 'SAVE CHANGES'}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
