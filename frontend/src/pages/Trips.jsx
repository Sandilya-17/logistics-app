import React, { useEffect, useState } from 'react';
import { tripsAPI, trucksAPI } from '../api/api';
import { TallyTable, PageHeader, Btn, Modal, Field, Input, Select, Section, Badge, StatCard } from '../components/UI';
import toast from 'react-hot-toast';

const EMPTY = {
  truckNumber: '', driverName: '', fromLocation: '', toLocation: '',
  consignee: '', commodity: '', freightAmount: '', advancePaid: '',
  startDate: '', lrNumber: '', invoiceNumber: '', startOdometer: '',
  status: 'PLANNED', paymentStatus: 'PENDING', remarks: ''
};

const STATUS_COLORS = { PLANNED: 'warning', IN_TRANSIT: 'info', DELIVERED: 'success', CANCELLED: 'danger' };
const PAY_COLORS = { PAID: 'success', PENDING: 'danger', PARTIAL: 'warning' };

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [summary, setSummary] = useState({});
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    tripsAPI.getAll().then(r => setTrips(r.data));
    trucksAPI.getAll().then(r => setTrucks(r.data));
    tripsAPI.getSummary().then(r => setSummary(r.data));
  };
  useEffect(() => { load(); }, []);

  const filtered = trips.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !search || t.truckNumber?.toLowerCase().includes(q) ||
      t.consignee?.toLowerCase().includes(q) || t.tripNumber?.toLowerCase().includes(q) ||
      t.fromLocation?.toLowerCase().includes(q) || t.toLocation?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (t) => {
    const f = { ...EMPTY, ...t };
    if (t.startDate) f.startDate = t.startDate?.split('T')[0];
    setForm(f); setSelected(t); setModal('edit');
  };
  const openView = (t) => { setSelected(t); setModal('view'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        freightAmount: +form.freightAmount,
        advancePaid: +form.advancePaid,
        startOdometer: +form.startOdometer,
      };
      // Auto-fill driverName from truck
      if (!payload.driverName) {
        const truck = trucks.find(t => t.truckNumber === payload.truckNumber);
        if (truck) payload.driverName = truck.driverName;
      }
      if (modal === 'add') {
        await tripsAPI.add(payload);
        toast.success('Trip created');
      } else {
        await tripsAPI.update(selected.id, payload);
        toast.success('Trip updated');
      }
      load(); setModal(null);
    } catch (err) {
      toast.error(err.response?.data || 'Error');
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete trip ${t.tripNumber}?`)) return;
    await tripsAPI.delete(t.id);
    toast.success('Trip deleted');
    load();
  };

  const onTruckChange = (e) => {
    const truckNum = e.target.value;
    const truck = trucks.find(t => t.truckNumber === truckNum);
    setForm(p => ({ ...p, truckNumber: truckNum, driverName: truck?.driverName || p.driverName }));
  };

  return (
    <div>
      <PageHeader
        title="TRIP / CHALLAN MANAGEMENT"
        subtitle={`Total: ${summary.total || 0} | In Transit: ${summary.inTransit || 0} | Delivered: ${summary.delivered || 0}`}
        actions={[
          <input key="s" placeholder="Trip No / Consignee / Truck / Route..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', padding: '4px 10px', fontSize: 11, fontFamily: 'Consolas, monospace', borderRadius: 2, outline: 'none', width: 240 }}
          />,
          <select key="f" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3', padding: '4px 8px', fontSize: 11, fontFamily: 'Consolas, monospace', borderRadius: 2 }}>
            <option value="">All Status</option>
            {['PLANNED','IN_TRANSIT','DELIVERED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
          </select>,
          <Btn key="a" variant="success" onClick={openAdd}>+ NEW TRIP</Btn>
        ]}
      />

      <div style={{ padding: '12px 20px', display: 'flex', gap: 10 }}>
        <StatCard label="TOTAL FREIGHT" value={`₹${((summary.totalFreight)||0).toLocaleString('en-IN')}`} icon="💰" color="#3fb950" />
        <StatCard label="PENDING AMOUNT" value={`₹${((summary.totalPending)||0).toLocaleString('en-IN')}`} icon="⏳" color="#f85149" />
        <StatCard label="IN TRANSIT" value={summary.inTransit || 0} icon="🚛" color="#58a6ff" />
        <StatCard label="DELIVERED" value={summary.delivered || 0} icon="✓" color="#3fb950" />
        <StatCard label="PLANNED" value={summary.planned || 0} icon="📋" color="#d29922" />
      </div>

      <Section title={`TRIP REGISTER (${filtered.length})`}>
        <TallyTable
          data={[...filtered].reverse()}
          onRowClick={openView}
          columns={[
            { key: 'tripNumber', label: 'Trip No.', width: 120, color: '#58a6ff' },
            { key: 'truckNumber', label: 'Truck', width: 100 },
            { key: 'driverName', label: 'Driver', width: 110 },
            { key: 'fromLocation', label: 'From', width: 100 },
            { key: 'toLocation', label: 'To', width: 100 },
            { key: 'consignee', label: 'Consignee', width: 120 },
            { key: 'commodity', label: 'Commodity', width: 100 },
            { key: 'freightAmount', label: 'Freight (₹)', align: 'right', width: 100,
              render: v => <span style={{ color: '#3fb950' }}>₹{(v||0).toLocaleString('en-IN')}</span> },
            { key: 'balanceAmount', label: 'Balance (₹)', align: 'right', width: 100,
              render: v => v > 0 ? <span style={{ color: '#f85149' }}>₹{v.toLocaleString('en-IN')}</span> : <span style={{ color: '#3fb950' }}>—</span> },
            { key: 'status', label: 'Status', width: 100,
              render: v => <Badge text={v} type={STATUS_COLORS[v] || 'default'} /> },
            { key: 'paymentStatus', label: 'Payment', width: 80,
              render: v => <Badge text={v} type={PAY_COLORS[v] || 'default'} /> },
            { key: 'lrNumber', label: 'LR No.', width: 100 },
            { key: 'startDate', label: 'Start Date', width: 100,
              render: v => v ? new Date(v).toLocaleDateString('en-IN') : '—' },
            { key: 'id', label: 'Actions', width: 80,
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

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'NEW TRIP / CHALLAN' : `EDIT TRIP — ${selected?.tripNumber}`} onClose={() => setModal(null)} wide>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 4%' }}>
              <Field label="Truck Number *" half>
                <Select name="truckNumber" value={form.truckNumber} onChange={onTruckChange} required>
                  <option value="">-- Select Truck --</option>
                  {trucks.filter(t => t.status === 'ACTIVE').map(t => (
                    <option key={t.id} value={t.truckNumber}>{t.truckNumber} — {t.driverName}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Driver Name" half><Input name="driverName" value={form.driverName} onChange={handleChange} /></Field>
              <Field label="From Location *" half><Input name="fromLocation" value={form.fromLocation} onChange={handleChange} required /></Field>
              <Field label="To Location *" half><Input name="toLocation" value={form.toLocation} onChange={handleChange} required /></Field>
              <Field label="Consignee (Customer) *" half><Input name="consignee" value={form.consignee} onChange={handleChange} required /></Field>
              <Field label="Commodity" half><Input name="commodity" value={form.commodity} onChange={handleChange} /></Field>
              <Field label="Freight Amount (₹) *" half><Input name="freightAmount" type="number" value={form.freightAmount} onChange={handleChange} required /></Field>
              <Field label="Advance Paid (₹)" half><Input name="advancePaid" type="number" value={form.advancePaid} onChange={handleChange} /></Field>
              <Field label="LR Number" half><Input name="lrNumber" value={form.lrNumber} onChange={handleChange} /></Field>
              <Field label="Invoice Number" half><Input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} /></Field>
              <Field label="Start Odometer (km)" half><Input name="startOdometer" type="number" value={form.startOdometer} onChange={handleChange} /></Field>
              <Field label="Start Date" half><Input name="startDate" type="date" value={form.startDate} onChange={handleChange} /></Field>
              <Field label="Status" half>
                <Select name="status" value={form.status} onChange={handleChange}>
                  {['PLANNED','IN_TRANSIT','DELIVERED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Payment Status" half>
                <Select name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
                  <option>PENDING</option><option>PARTIAL</option><option>PAID</option>
                </Select>
              </Field>
              <Field label="Remarks"><Input name="remarks" value={form.remarks} onChange={handleChange} /></Field>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="success">{modal === 'add' ? 'CREATE TRIP' : 'SAVE CHANGES'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'view' && selected && (
        <Modal title={`TRIP DETAILS — ${selected.tripNumber}`} onClose={() => setModal(null)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            {[
              ['Trip Number', selected.tripNumber],
              ['Truck', selected.truckNumber],
              ['Driver', selected.driverName],
              ['From', selected.fromLocation],
              ['To', selected.toLocation],
              ['Consignee', selected.consignee],
              ['Commodity', selected.commodity],
              ['LR Number', selected.lrNumber],
              ['Freight Amount', `₹${(selected.freightAmount||0).toLocaleString('en-IN')}`],
              ['Advance Paid', `₹${(selected.advancePaid||0).toLocaleString('en-IN')}`],
              ['Balance', `₹${(selected.balanceAmount||0).toLocaleString('en-IN')}`],
              ['Status', selected.status],
              ['Payment Status', selected.paymentStatus],
              ['Start Date', selected.startDate ? new Date(selected.startDate).toLocaleDateString('en-IN') : '—'],
              ['Distance', selected.distanceCovered ? `${selected.distanceCovered} km` : '—'],
              ['Remarks', selected.remarks],
            ].map(([k,v]) => (
              <div key={k} style={{ borderBottom: '1px solid #21262d', padding: '5px 0' }}>
                <span style={{ color: '#6c757d', fontSize: 10 }}>{k}: </span>
                <span style={{ color: '#e6edf3', fontSize: 11 }}>{v || '—'}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => openEdit(selected)}>Edit</Btn>
            <Btn variant="ghost" onClick={() => setModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
