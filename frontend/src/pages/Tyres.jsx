import React, { useEffect, useState } from 'react';
import { tyresAPI, trucksAPI } from '../api/api';
import { TallyTable, PageHeader, Btn, Modal, Field, Input, Select, Section, StatCard } from '../components/UI';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EMPTY_TYRE = { tyreName:'', tyreCode:'', size:'', brand:'', type:'TUBELESS', openingStock:'', reorderLevel:'', unitPrice:'', vendor:'' };
const EMPTY_PURCHASE = { partId:'', quantity:'', pricePerUnit:'', supplierName:'', invoiceNumber:'' };
const EMPTY_ISSUE = { tyreId:'', truckNumber:'', quantity:'', position:'', location:'', remarks:'' };

export default function Tyres() {
  const { user } = useAuth();
  const [tyres, setTyres] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('stock');

  const load = () => {
    tyresAPI.getAll().then(r => setTyres(r.data));
    trucksAPI.getNumbers().then(r => setTrucks(r.data));
    tyresAPI.getAllIssues().then(r => setIssues(r.data));
  };
  useEffect(() => { load(); }, []);

  const lowStock = tyres.filter(t => t.reorderLevel > 0 && t.currentStock <= t.reorderLevel).length;
  const totalValue = tyres.reduce((s, t) => s + (t.currentStock * t.unitPrice || 0), 0);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleAddTyre = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await tyresAPI.add({ ...form, openingStock: +form.openingStock, reorderLevel: +form.reorderLevel, unitPrice: +form.unitPrice });
      } else {
        await tyresAPI.update(selected.id, { ...form, reorderLevel: +form.reorderLevel, unitPrice: +form.unitPrice });
      }
      toast.success('Tyre saved'); load(); setModal(null);
    } catch (err) { toast.error(err.response?.data || 'Error'); }
  };

  const handleDeleteTyre = async (tyre) => {
    if (!window.confirm(`Delete tyre "${tyre.tyreName}"? This cannot be undone.`)) return;
    try {
      await tyresAPI.delete(tyre.id);
      toast.success('Tyre deleted');
      load();
    } catch { toast.error('Could not delete tyre'); }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      await tyresAPI.addPurchase({ ...form, quantity: +form.quantity, pricePerUnit: +form.pricePerUnit });
      toast.success('Purchase recorded'); load(); setModal(null);
    } catch (err) { toast.error(err.response?.data || 'Error'); }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await tyresAPI.issue({ ...form, quantity: +form.quantity, issuedBy: user?.username });
      toast.success('Tyre issued'); load(); setModal(null);
    } catch (err) { toast.error(err.response?.data || 'Error'); }
  };

  return (
    <div>
      <PageHeader
        title="TYRE STOCK MANAGEMENT"
        subtitle={`${tyres.length} tyre types | ${lowStock} low stock | Value: ₹${totalValue.toLocaleString('en-IN')}`}
        actions={[
          <Btn key="issue" variant="warning" onClick={() => { setForm(EMPTY_ISSUE); setModal('issue'); }}>ISSUE TYRE</Btn>,
          <Btn key="buy" variant="ghost" onClick={() => { setForm(EMPTY_PURCHASE); setModal('purchase'); }}>+ PURCHASE</Btn>,
          <Btn key="add" variant="success" onClick={() => { setForm(EMPTY_TYRE); setModal('add'); }}>+ ADD TYRE</Btn>,
        ]}
      />

      <div style={{ padding:'12px 20px', display:'flex', gap:10 }}>
        <StatCard label="TYRE TYPES" value={tyres.length} icon="⚙" color="#58a6ff" />
        <StatCard label="LOW STOCK" value={lowStock} icon="⚠" color={lowStock > 0 ? '#f85149' : '#3fb950'} />
        <StatCard label="STOCK VALUE" value={`₹${totalValue.toLocaleString('en-IN')}`} icon="💰" color="#d29922" />
        <StatCard label="TOTAL ISSUES" value={issues.length} icon="🔄" color="#8b949e" />
      </div>

      <div style={{ padding:'0 20px', display:'flex', gap:0 }}>
        {['stock','issues'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ background: tab===t ? '#0f3460' : '#21262d', border:'1px solid #30363d', color: tab===t ? '#58a6ff' : '#6c757d', padding:'4px 16px', cursor:'pointer', fontFamily:'Consolas, monospace', fontSize:10 }}>
            {t === 'stock' ? 'STOCK LEDGER' : 'ISSUE HISTORY'}
          </button>
        ))}
      </div>

      {tab === 'stock' ? (
        <Section title="TYRE STOCK">
          <TallyTable
            data={tyres}
            columns={[
              { key:'tyreCode', label:'Code', width:90, color:'#8b949e' },
              { key:'tyreName', label:'Tyre Name', color:'#e6edf3' },
              { key:'brand', label:'Brand', width:90 },
              { key:'size', label:'Size', width:90 },
              { key:'type', label:'Type', width:90 },
              { key:'openingStock', label:'Opening', align:'right', width:75 },
              { key:'purchasedStock', label:'Purchase', align:'right', width:75, color:'#3fb950' },
              { key:'issuedStock', label:'Issued', align:'right', width:75, color:'#d29922' },
              { key:'currentStock', label:'Closing', align:'right', width:75,
                render:(v,row) => {
                  const isLow = row.reorderLevel > 0 && v <= row.reorderLevel;
                  return <span style={{ color: isLow ? '#f85149' : '#3fb950', fontWeight:'bold' }}>{v}</span>;
                }
              },
              { key:'unitPrice', label:'Unit Price', align:'right', width:90, render:v=>v?`₹${v.toLocaleString('en-IN')}`:'—' },
              { key:'vendor', label:'Vendor', width:110 },
              { key:'id', label:'Actions', width:80,
                render:(_,row) => (
                  <div style={{ display:'flex', gap:4 }} onClick={e=>e.stopPropagation()}>
                    <Btn small variant="ghost" onClick={() => { setForm({...EMPTY_TYRE,...row}); setSelected(row); setModal('edit'); }}>Edit</Btn>
                    <Btn small variant="danger" onClick={(e) => { e.stopPropagation(); handleDeleteTyre(row); }}>Del</Btn>
                  </div>
                )
              },
            ]}
          />
        </Section>
      ) : (
        <Section title="TYRE ISSUE HISTORY">
          <TallyTable
            data={[...issues].reverse()}
            columns={[
              { key:'tyreName', label:'Tyre Name', color:'#e6edf3' },
              { key:'truckNumber', label:'Truck', width:100, color:'#58a6ff' },
              { key:'quantity', label:'Qty', align:'right', width:60 },
              { key:'position', label:'Position', width:100 },
              { key:'unitPrice', label:'Unit Price', align:'right', width:90, render:v=>v?`₹${v}`:'—' },
              { key:'totalValue', label:'Value', align:'right', width:90, render:v=>v?<span style={{color:'#d29922'}}>₹{v.toLocaleString('en-IN')}</span>:'—' },
              { key:'location', label:'Location', width:100 },
              { key:'issuedBy', label:'Issued By', width:100 },
              { key:'issuedAt', label:'Date', width:110, render:v=>v?new Date(v).toLocaleDateString('en-IN'):'—' },
              { key:'remarks', label:'Remarks' },
            ]}
          />
        </Section>
      )}

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'ADD TYRE':'EDIT TYRE'} onClose={() => setModal(null)}>
          <form onSubmit={handleAddTyre}>
            <Field label="Tyre Name *"><Input name="tyreName" value={form.tyreName} onChange={handleChange} required /></Field>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0 4%' }}>
              <Field label="Tyre Code" half><Input name="tyreCode" value={form.tyreCode} onChange={handleChange} /></Field>
              <Field label="Size" half><Input name="size" value={form.size} onChange={handleChange} /></Field>
              <Field label="Brand" half><Input name="brand" value={form.brand} onChange={handleChange} /></Field>
              <Field label="Type" half>
                <Select name="type" value={form.type} onChange={handleChange}>
                  <option>TUBE</option><option>TUBELESS</option><option>FLAP</option>
                </Select>
              </Field>
              {modal==='add' && <Field label="Opening Stock *" half><Input name="openingStock" type="number" value={form.openingStock} onChange={handleChange} required /></Field>}
              <Field label="Reorder Level" half><Input name="reorderLevel" type="number" value={form.reorderLevel} onChange={handleChange} /></Field>
              <Field label="Unit Price (₹)" half><Input name="unitPrice" type="number" step="0.01" value={form.unitPrice} onChange={handleChange} /></Field>
              <Field label="Vendor" half><Input name="vendor" value={form.vendor} onChange={handleChange} /></Field>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="success">{modal==='add'?'ADD TYRE':'SAVE'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {modal==='purchase' && (
        <Modal title="TYRE PURCHASE" onClose={() => setModal(null)}>
          <form onSubmit={handlePurchase}>
            <Field label="Select Tyre *">
              <Select name="partId" value={form.partId} onChange={handleChange} required>
                <option value="">-- Select Tyre --</option>
                {tyres.map(t => <option key={t.id} value={t.id}>{t.tyreName} — {t.brand} {t.size} (Stock: {t.currentStock})</option>)}
              </Select>
            </Field>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0 4%' }}>
              <Field label="Quantity *" half><Input name="quantity" type="number" value={form.quantity} onChange={handleChange} required /></Field>
              <Field label="Price Per Tyre (₹)" half><Input name="pricePerUnit" type="number" step="0.01" value={form.pricePerUnit} onChange={handleChange} /></Field>
              <Field label="Supplier" half><Input name="supplierName" value={form.supplierName} onChange={handleChange} /></Field>
              <Field label="Invoice No." half><Input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} /></Field>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="success">SAVE PURCHASE</Btn>
            </div>
          </form>
        </Modal>
      )}

      {modal==='issue' && (
        <Modal title="ISSUE TYRE" onClose={() => setModal(null)}>
          <form onSubmit={handleIssue}>
            <Field label="Select Tyre *">
              <Select name="tyreId" value={form.tyreId} onChange={handleChange} required>
                <option value="">-- Select Tyre --</option>
                {tyres.filter(t => t.currentStock > 0).map(t => <option key={t.id} value={t.id}>{t.tyreName} — {t.brand} (Stock: {t.currentStock})</option>)}
              </Select>
            </Field>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0 4%' }}>
              <Field label="Truck Number *" half>
                <Select name="truckNumber" value={form.truckNumber} onChange={handleChange} required>
                  <option value="">-- Select Truck --</option>
                  {trucks.map(t => <option key={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Quantity *" half><Input name="quantity" type="number" value={form.quantity} onChange={handleChange} required /></Field>
              <Field label="Position (e.g. FR, RR)" half><Input name="position" value={form.position} onChange={handleChange} /></Field>
              <Field label="Location" half><Input name="location" value={form.location} onChange={handleChange} /></Field>
            </div>
            <Field label="Remarks"><Input name="remarks" value={form.remarks} onChange={handleChange} /></Field>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="warning">ISSUE TYRE</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
