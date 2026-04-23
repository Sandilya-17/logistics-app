import React, { useEffect, useState } from 'react';
import { sparePartsAPI, trucksAPI } from '../api/api';
import { TallyTable, PageHeader, Btn, Modal, Field, Input, Select, Section, Badge, StatCard } from '../components/UI';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EMPTY_PART = { partName:'', partCode:'', unit:'NOS', category:'ENGINE', openingStock:'', reorderLevel:'', unitPrice:'', vendor:'', location:'', hsn:'', gstPercent:'' };
const EMPTY_PURCHASE = { partId:'', quantity:'', pricePerUnit:'', supplierName:'', invoiceNumber:'', poNumber:'', paymentMode:'CASH' };
const EMPTY_ISSUE = { partId:'', truckNumber:'', quantity:'', jobCardNumber:'', mechanicName:'', location:'', remarks:'' };

const CATEGORIES = ['ENGINE','BODY','ELECTRICAL','BRAKE','SUSPENSION','TRANSMISSION','COOLING','FUEL_SYSTEM','OTHER'];

export default function SpareParts() {
  const { user } = useAuth();
  const [parts, setParts] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState('stock');
  const [form, setForm] = useState({});
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => {
    sparePartsAPI.getAll().then(r => setParts(r.data));
    trucksAPI.getNumbers().then(r => setTrucks(r.data));
    sparePartsAPI.getAllIssues().then(r => setIssues(r.data));
  };
  useEffect(() => { load(); }, []);

  const filtered = parts.filter(p =>
    p.partName?.toLowerCase().includes(search.toLowerCase()) ||
    p.partCode?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = parts.filter(p => p.reorderLevel > 0 && p.currentStock <= p.reorderLevel).length;
  const totalValue = parts.reduce((s, p) => s + (p.currentStock * p.unitPrice || 0), 0);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleAddPart = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await sparePartsAPI.add({ ...form, openingStock: +form.openingStock, reorderLevel: +form.reorderLevel, unitPrice: +form.unitPrice, gstPercent: +form.gstPercent });
      } else {
        await sparePartsAPI.update(selected.id, { ...form, reorderLevel: +form.reorderLevel, unitPrice: +form.unitPrice });
      }
      toast.success(modal === 'add' ? 'Part added' : 'Part updated');
      load(); setModal(null);
    } catch (err) { toast.error(err.response?.data || 'Error'); }
  };

  const handleDeletePart = async (part) => {
    if (!window.confirm(`Delete spare part "${part.partName}"? This cannot be undone.`)) return;
    try {
      await sparePartsAPI.delete(part.id);
      toast.success('Part deleted');
      load();
    } catch { toast.error('Could not delete part'); }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      await sparePartsAPI.addPurchase({ ...form, quantity: +form.quantity, pricePerUnit: +form.pricePerUnit });
      toast.success('Purchase recorded, stock updated');
      load(); setModal(null);
    } catch (err) { toast.error(err.response?.data || 'Error'); }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await sparePartsAPI.issue({ ...form, quantity: +form.quantity, issuedBy: user?.username });
      toast.success('Part issued successfully');
      load(); setModal(null);
    } catch (err) { toast.error(err.response?.data || 'Error'); }
  };

  return (
    <div>
      <PageHeader
        title="SPARE PARTS INVENTORY"
        subtitle={`${parts.length} parts | ${lowStock} low stock | Value: ₹${totalValue.toLocaleString('en-IN')}`}
        actions={[
          <input key="s" placeholder="Search part name / code / category..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ background:'#0d1117', border:'1px solid #30363d', color:'#e6edf3', padding:'4px 10px', fontSize:11, fontFamily:'Consolas, monospace', borderRadius:2, outline:'none', width:230 }}
          />,
          <Btn key="issue" variant="warning" onClick={() => { setForm(EMPTY_ISSUE); setModal('issue'); }}>ISSUE PART</Btn>,
          <Btn key="buy" variant="info" onClick={() => { setForm(EMPTY_PURCHASE); setModal('purchase'); }} style={{ background:'#1a2f1a',border:'1px solid #238636',color:'#3fb950',padding:'5px 14px',cursor:'pointer',fontFamily:'Consolas',fontSize:11,borderRadius:2 }}>+ PURCHASE</Btn>,
          <Btn key="add" variant="success" onClick={() => { setForm(EMPTY_PART); setModal('add'); }}>+ ADD PART</Btn>,
        ]}
      />

      <div style={{ padding:'12px 20px', display:'flex', gap:10 }}>
        <StatCard label="TOTAL PARTS" value={parts.length} icon="🔧" color="#58a6ff" />
        <StatCard label="LOW STOCK" value={lowStock} sub="below reorder level" icon="⚠" color={lowStock > 0 ? '#f85149' : '#3fb950'} />
        <StatCard label="STOCK VALUE" value={`₹${totalValue.toLocaleString('en-IN')}`} icon="💰" color="#d29922" />
        <StatCard label="TOTAL ISSUES" value={issues.length} icon="📦" color="#8b949e" />
      </div>

      <div style={{ padding:'0 20px', display:'flex', gap:0, marginBottom:0 }}>
        {['stock','issues'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ background: tab===t ? '#0f3460' : '#21262d', border:'1px solid #30363d', color: tab===t ? '#58a6ff' : '#6c757d', padding:'4px 16px', cursor:'pointer', fontFamily:'Consolas, monospace', fontSize:10 }}>
            {t === 'stock' ? 'STOCK LEDGER' : 'ISSUE HISTORY'}
          </button>
        ))}
      </div>

      {tab === 'stock' ? (
        <Section title={`SPARE PARTS STOCK (${filtered.length})`}>
          <TallyTable
            data={filtered}
            columns={[
              { key:'partCode', label:'Code', width:90, color:'#8b949e' },
              { key:'partName', label:'Part Name', color:'#e6edf3' },
              { key:'category', label:'Category', width:100 },
              { key:'unit', label:'Unit', width:60 },
              { key:'openingStock', label:'Opening', align:'right', width:75 },
              { key:'purchasedStock', label:'Purchase', align:'right', width:75, color:'#3fb950' },
              { key:'issuedStock', label:'Issued', align:'right', width:75, color:'#d29922' },
              { key:'currentStock', label:'Closing', align:'right', width:75,
                render:(v,row) => {
                  const isLow = row.reorderLevel > 0 && v <= row.reorderLevel;
                  return <span style={{ color: isLow ? '#f85149' : '#3fb950', fontWeight:'bold' }}>{v}</span>;
                }
              },
              { key:'reorderLevel', label:'Reorder', align:'right', width:70, color:'#d29922' },
              { key:'unitPrice', label:'Unit Price', align:'right', width:90,
                render:v => v ? `₹${v.toLocaleString('en-IN')}` : '—' },
              { key:'vendor', label:'Vendor', width:110 },
              { key:'location', label:'Location', width:90 },
              { key:'id', label:'Actions', width:80,
                render:(_,row) => (
                  <div style={{ display:'flex', gap:4 }} onClick={e=>e.stopPropagation()}>
                    <Btn small variant="ghost" onClick={() => { setForm({...EMPTY_PART,...row}); setSelected(row); setModal('edit'); }}>Edit</Btn>
                    <Btn small variant="danger" onClick={(e) => { e.stopPropagation(); handleDeletePart(row); }}>Del</Btn>
                  </div>
                )
              },
            ]}
          />
        </Section>
      ) : (
        <Section title={`ISSUE HISTORY (${issues.length})`}>
          <TallyTable
            data={[...issues].reverse()}
            columns={[
              { key:'partName', label:'Part Name', color:'#e6edf3' },
              { key:'truckNumber', label:'Truck', width:100, color:'#58a6ff' },
              { key:'quantity', label:'Qty', align:'right', width:60 },
              { key:'unitPrice', label:'Unit Price', align:'right', width:90, render:v=>v?`₹${v}`:'—' },
              { key:'totalValue', label:'Value', align:'right', width:90, render:v=>v?<span style={{color:'#d29922'}}>₹{v.toLocaleString('en-IN')}</span>:'—' },
              { key:'jobCardNumber', label:'Job Card', width:100 },
              { key:'mechanicName', label:'Mechanic', width:110 },
              { key:'location', label:'Location', width:100 },
              { key:'issuedBy', label:'Issued By', width:100 },
              { key:'issuedAt', label:'Date', width:110, render:v=>v?new Date(v).toLocaleDateString('en-IN'):'—' },
              { key:'remarks', label:'Remarks' },
            ]}
          />
        </Section>
      )}

      {/* Add/Edit Part Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal==='add' ? 'ADD SPARE PART' : 'EDIT SPARE PART'} onClose={() => setModal(null)} wide>
          <form onSubmit={handleAddPart}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0 4%' }}>
              <Field label="Part Name *" half><Input name="partName" value={form.partName} onChange={handleChange} required /></Field>
              <Field label="Part Code" half><Input name="partCode" value={form.partCode} onChange={handleChange} /></Field>
              <Field label="Category" half>
                <Select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Unit" half>
                <Select name="unit" value={form.unit} onChange={handleChange}>
                  {['NOS','SET','MTR','KG','LTR','BOX'].map(u => <option key={u}>{u}</option>)}
                </Select>
              </Field>
              {modal === 'add' && <Field label="Opening Stock *" half><Input name="openingStock" type="number" value={form.openingStock} onChange={handleChange} required /></Field>}
              <Field label="Reorder Level" half><Input name="reorderLevel" type="number" value={form.reorderLevel} onChange={handleChange} /></Field>
              <Field label="Unit Price (₹)" half><Input name="unitPrice" type="number" step="0.01" value={form.unitPrice} onChange={handleChange} /></Field>
              <Field label="Vendor" half><Input name="vendor" value={form.vendor} onChange={handleChange} /></Field>
              <Field label="Shelf Location" half><Input name="location" value={form.location} onChange={handleChange} /></Field>
              <Field label="HSN Code" half><Input name="hsn" value={form.hsn} onChange={handleChange} /></Field>
              <Field label="GST %" half><Input name="gstPercent" type="number" value={form.gstPercent} onChange={handleChange} /></Field>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="success">{modal==='add' ? 'ADD PART' : 'SAVE'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Purchase Modal */}
      {modal === 'purchase' && (
        <Modal title="RECORD PURCHASE" onClose={() => setModal(null)}>
          <form onSubmit={handlePurchase}>
            <Field label="Select Part *">
              <Select name="partId" value={form.partId} onChange={handleChange} required>
                <option value="">-- Select Part --</option>
                {parts.map(p => <option key={p.id} value={p.id}>{p.partName} (Stock: {p.currentStock})</option>)}
              </Select>
            </Field>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0 4%' }}>
              <Field label="Quantity *" half><Input name="quantity" type="number" value={form.quantity} onChange={handleChange} required /></Field>
              <Field label="Price Per Unit (₹)" half><Input name="pricePerUnit" type="number" step="0.01" value={form.pricePerUnit} onChange={handleChange} /></Field>
              <Field label="Supplier Name" half><Input name="supplierName" value={form.supplierName} onChange={handleChange} /></Field>
              <Field label="Invoice Number" half><Input name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} /></Field>
              <Field label="PO Number" half><Input name="poNumber" value={form.poNumber} onChange={handleChange} /></Field>
              <Field label="Payment Mode" half>
                <Select name="paymentMode" value={form.paymentMode} onChange={handleChange}>
                  <option>CASH</option><option>CHEQUE</option><option>NEFT</option><option>PENDING</option>
                </Select>
              </Field>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="success">SAVE PURCHASE</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Issue Modal */}
      {modal === 'issue' && (
        <Modal title="ISSUE SPARE PART" onClose={() => setModal(null)}>
          <form onSubmit={handleIssue}>
            <Field label="Select Part *">
              <Select name="partId" value={form.partId} onChange={handleChange} required>
                <option value="">-- Select Part --</option>
                {parts.filter(p => p.currentStock > 0).map(p => (
                  <option key={p.id} value={p.id}>{p.partName} (Stock: {p.currentStock} {p.unit})</option>
                ))}
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
              <Field label="Job Card No." half><Input name="jobCardNumber" value={form.jobCardNumber} onChange={handleChange} /></Field>
              <Field label="Mechanic Name" half><Input name="mechanicName" value={form.mechanicName} onChange={handleChange} /></Field>
              <Field label="Location" half><Input name="location" value={form.location} onChange={handleChange} /></Field>
            </div>
            <Field label="Remarks"><Input name="remarks" value={form.remarks} onChange={handleChange} /></Field>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="warning">ISSUE PART</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
