import React, { useEffect, useState } from 'react';
import { trucksAPI } from '../api/api';
import { TallyTable, PageHeader, Btn, Modal, Field, Input, Select, Section, Badge } from '../components/UI';
import toast from 'react-hot-toast';

const EMPTY = {
  truckNumber: '', driverName: '', driverPhone: '', fuelLimit: '',
  status: 'ACTIVE', vehicleType: 'TRUCK', make: '', model: '', year: '',
  registrationExpiry: '', insuranceExpiry: '', fitnessExpiry: '', permitExpiry: '',
  location: '', assignedRoute: '', odometer: '', remarks: ''
};

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => trucksAPI.getAll().then(r => setTrucks(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = trucks.filter(t =>
    t.truckNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.driverName?.toLowerCase().includes(search.toLowerCase()) ||
    t.location?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (t) => { setForm({ ...EMPTY, ...t }); setSelected(t); setModal('edit'); };
  const openView = (t) => { setSelected(t); setModal('view'); };

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await trucksAPI.add({ ...form, fuelLimit: +form.fuelLimit, odometer: +form.odometer, year: +form.year });
        toast.success('Truck added successfully');
      } else {
        await trucksAPI.update(selected.id, { ...form, fuelLimit: +form.fuelLimit, odometer: +form.odometer, year: +form.year });
        toast.success('Truck updated');
      }
      load(); setModal(null);
    } catch (err) {
      toast.error(err.response?.data || 'Error saving truck');
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete truck ${t.truckNumber}?`)) return;
    await trucksAPI.delete(t.id);
    toast.success('Truck deleted');
    load();
  };

  const checkExpiry = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr), now = new Date();
    const days = Math.ceil((d - now) / 86400000);
    if (days < 0) return 'danger';
    if (days <= 30) return 'warning';
    return 'success';
  };

  return (
    <div>
      <PageHeader
        title="FLEET MASTER"
        subtitle={`${trucks.filter(t => t.status === 'ACTIVE').length} Active | ${trucks.filter(t => t.status === 'INACTIVE').length} Inactive | Total: ${trucks.length}`}
        actions={[
          <input
            key="s" placeholder="Search truck / driver / location..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              background: '#0d1117', border: '1px solid #30363d', color: '#e6edf3',
              padding: '4px 10px', fontSize: 11, fontFamily: 'Consolas, monospace',
              borderRadius: 2, outline: 'none', width: 220
            }}
          />,
          <Btn key="a" variant="success" onClick={openAdd}>+ ADD TRUCK</Btn>
        ]}
      />

      <Section title={`TRUCK REGISTER (${filtered.length} records)`}>
        <TallyTable
          data={filtered}
          onRowClick={openView}
          columns={[
            { key: 'truckNumber', label: 'Truck No.', width: 110, color: '#58a6ff' },
            { key: 'vehicleType', label: 'Type', width: 80 },
            { key: 'make', label: 'Make/Model', render: (v, r) => `${r.make || ''} ${r.model || ''}`.trim() || '—' },
            { key: 'driverName', label: 'Driver', width: 130 },
            { key: 'driverPhone', label: 'Phone', width: 110 },
            { key: 'fuelLimit', label: 'Fuel Limit (L)', width: 100, align: 'right', color: '#d29922' },
            { key: 'location', label: 'Location', width: 100 },
            { key: 'status', label: 'Status', width: 80,
              render: v => <Badge text={v} type={v === 'ACTIVE' ? 'success' : 'danger'} /> },
            { key: 'insuranceExpiry', label: 'Insurance', width: 100,
              render: v => v ? <Badge text={v} type={checkExpiry(v)} /> : '—' },
            { key: 'registrationExpiry', label: 'RC Expiry', width: 100,
              render: v => v ? <Badge text={v} type={checkExpiry(v)} /> : '—' },
            { key: 'id', label: 'Actions', width: 100,
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

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'ADD NEW TRUCK' : `EDIT — ${selected?.truckNumber}`} onClose={() => setModal(null)} wide>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 4%' }}>
              <Field label="Truck Number *" half><Input name="truckNumber" value={form.truckNumber} onChange={handleChange} required /></Field>
              <Field label="Driver Name *" half><Input name="driverName" value={form.driverName} onChange={handleChange} required /></Field>
              <Field label="Driver Phone" half><Input name="driverPhone" value={form.driverPhone} onChange={handleChange} /></Field>
              <Field label="Monthly Fuel Limit (L) *" half><Input name="fuelLimit" type="number" value={form.fuelLimit} onChange={handleChange} required /></Field>
              <Field label="Vehicle Type" half>
                <Select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                  {['TRUCK','TRAILER','MINI_TRUCK','TANKER','TIPPER'].map(v => <option key={v}>{v}</option>)}
                </Select>
              </Field>
              <Field label="Status" half>
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option>ACTIVE</option><option>INACTIVE</option>
                </Select>
              </Field>
              <Field label="Make (e.g. TATA)" half><Input name="make" value={form.make} onChange={handleChange} /></Field>
              <Field label="Model" half><Input name="model" value={form.model} onChange={handleChange} /></Field>
              <Field label="Year" half><Input name="year" type="number" value={form.year} onChange={handleChange} /></Field>
              <Field label="Current Odometer (km)" half><Input name="odometer" type="number" value={form.odometer} onChange={handleChange} /></Field>
              <Field label="Location / Depot" half><Input name="location" value={form.location} onChange={handleChange} /></Field>
              <Field label="Assigned Route" half><Input name="assignedRoute" value={form.assignedRoute} onChange={handleChange} /></Field>
              <Field label="Registration Expiry" half><Input name="registrationExpiry" type="date" value={form.registrationExpiry} onChange={handleChange} /></Field>
              <Field label="Insurance Expiry" half><Input name="insuranceExpiry" type="date" value={form.insuranceExpiry} onChange={handleChange} /></Field>
              <Field label="Fitness Expiry" half><Input name="fitnessExpiry" type="date" value={form.fitnessExpiry} onChange={handleChange} /></Field>
              <Field label="Permit Expiry" half><Input name="permitExpiry" type="date" value={form.permitExpiry} onChange={handleChange} /></Field>
              <Field label="Remarks"><Input name="remarks" value={form.remarks} onChange={handleChange} /></Field>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="success">{modal === 'add' ? 'ADD TRUCK' : 'SAVE CHANGES'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <Modal title={`TRUCK DETAILS — ${selected.truckNumber}`} onClose={() => setModal(null)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            {[
              ['Truck Number', selected.truckNumber],
              ['Driver Name', selected.driverName],
              ['Driver Phone', selected.driverPhone],
              ['Vehicle Type', selected.vehicleType],
              ['Make / Model', `${selected.make || ''} ${selected.model || ''}`.trim()],
              ['Year', selected.year],
              ['Fuel Limit/Month', `${selected.fuelLimit} L`],
              ['Status', selected.status],
              ['Odometer', selected.odometer ? `${selected.odometer} km` : '—'],
              ['Location', selected.location],
              ['Assigned Route', selected.assignedRoute],
              ['RC Expiry', selected.registrationExpiry],
              ['Insurance Expiry', selected.insuranceExpiry],
              ['Fitness Expiry', selected.fitnessExpiry],
              ['Permit Expiry', selected.permitExpiry],
              ['Remarks', selected.remarks],
            ].map(([k, v]) => (
              <div key={k} style={{ borderBottom: '1px solid #21262d', padding: '5px 0' }}>
                <span style={{ color: '#6c757d', fontSize: 10 }}>{k}: </span>
                <span style={{ color: '#e6edf3', fontSize: 11 }}>{v || '—'}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Btn variant="ghost" onClick={() => { openEdit(selected); }}>Edit</Btn>
            <Btn variant="ghost" onClick={() => setModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
