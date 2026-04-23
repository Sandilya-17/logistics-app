import React, { useEffect, useState } from 'react';
import { fuelAPI, sparePartsAPI, tyresAPI, trucksAPI, tripsAPI } from '../api/api';
import { PageHeader, Section, TallyTable, Btn, StatCard, Badge } from '../components/UI';

export default function Reports() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [activeReport, setActiveReport] = useState('fuel_excess');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const reports = [
    { id:'fuel_excess', label:'Fuel Excess Report', icon:'⛽' },
    { id:'fuel_monthly', label:'Monthly Fuel Details', icon:'📋' },
    { id:'stock_report', label:'Spare Parts Stock', icon:'🔧' },
    { id:'tyre_stock', label:'Tyre Stock Report', icon:'⚙' },
    { id:'part_issues', label:'Part Issue History', icon:'📦' },
    { id:'tyre_issues', label:'Tyre Issue History', icon:'🔄' },
    { id:'fleet_status', label:'Fleet Status', icon:'🚛' },
    { id:'trips_report', label:'Trips Report', icon:'📋' },
  ];

  const loadReport = async (id = activeReport) => {
    setLoading(true);
    try {
      let res;
      switch(id) {
        case 'fuel_excess': res = await fuelAPI.getExcessReport(month, year); break;
        case 'fuel_monthly': res = await fuelAPI.getMonthly(month, year); break;
        case 'stock_report': res = await sparePartsAPI.stockReport(); break;
        case 'tyre_stock': res = await tyresAPI.stockReport(); break;
        case 'part_issues': res = await sparePartsAPI.getAllIssues(); break;
        case 'tyre_issues': res = await tyresAPI.getAllIssues(); break;
        case 'fleet_status': res = await trucksAPI.getAll(); break;
        case 'trips_report': res = await tripsAPI.getAll(); break;
        default: res = { data: [] };
      }
      setData(res.data || []);
    } catch { setData([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadReport(); }, [activeReport, month, year]);

  const getColumns = () => {
    switch(activeReport) {
      case 'fuel_excess': return [
        { key:'truckNumber', label:'Truck No.', color:'#58a6ff' },
        { key:'driverName', label:'Driver' },
        { key:'fuelLimit', label:'Limit (L)', align:'right', render:v=>v?.toFixed(1) },
        { key:'totalConsumed', label:'Consumed (L)', align:'right', render:v=>v?.toFixed(1) },
        { key:'excess', label:'Excess (L)', align:'right',
          render:(v,row) => row.isExcess ? <span style={{color:'#f85149',fontWeight:'bold'}}>+{v?.toFixed(1)}</span> : <span style={{color:'#3fb950'}}>—</span> },
        { key:'totalCost', label:'Cost (₹)', align:'right', render:v=>v?`₹${v.toLocaleString('en-IN')}`:'—' },
        { key:'entryCount', label:'Entries', align:'right' },
        { key:'isExcess', label:'Status', render:v=><Badge text={v?'EXCESS':'NORMAL'} type={v?'danger':'success'} /> },
      ];
      case 'fuel_monthly': return [
        { key:'truckNumber', label:'Truck', color:'#58a6ff' },
        { key:'liters', label:'Liters', align:'right', render:v=>v?.toFixed(1) },
        { key:'pricePerLiter', label:'₹/L', align:'right', render:v=>v?`₹${v}`:'-' },
        { key:'totalCost', label:'Cost', align:'right', render:v=>v?`₹${v.toLocaleString('en-IN')}`:'—' },
        { key:'fuelStation', label:'Station' },
        { key:'paymentMode', label:'Payment' },
        { key:'filledAt', label:'Date', render:v=>v?new Date(v).toLocaleDateString('en-IN'):'—' },
        { key:'enteredBy', label:'By' },
      ];
      case 'stock_report': return [
        { key:'partCode', label:'Code', color:'#8b949e' },
        { key:'partName', label:'Part Name', color:'#e6edf3' },
        { key:'category', label:'Category' },
        { key:'unit', label:'Unit', width:60 },
        { key:'openingStock', label:'Opening', align:'right' },
        { key:'purchasedStock', label:'Purchased', align:'right', color:'#3fb950' },
        { key:'issuedStock', label:'Issued', align:'right', color:'#d29922' },
        { key:'currentStock', label:'Closing', align:'right',
          render:(v,row)=><span style={{color:row.reorderLevel>0&&v<=row.reorderLevel?'#f85149':'#3fb950',fontWeight:'bold'}}>{v}</span> },
        { key:'unitPrice', label:'Unit Price', align:'right', render:v=>v?`₹${v}`:'—' },
        { key:'vendor', label:'Vendor' },
      ];
      case 'tyre_stock': return [
        { key:'tyreName', label:'Tyre Name', color:'#e6edf3' },
        { key:'brand', label:'Brand' },
        { key:'size', label:'Size' },
        { key:'type', label:'Type' },
        { key:'openingStock', label:'Opening', align:'right' },
        { key:'purchasedStock', label:'Purchased', align:'right', color:'#3fb950' },
        { key:'issuedStock', label:'Issued', align:'right', color:'#d29922' },
        { key:'currentStock', label:'Closing', align:'right',
          render:(v,row)=><span style={{color:row.reorderLevel>0&&v<=row.reorderLevel?'#f85149':'#3fb950',fontWeight:'bold'}}>{v}</span> },
        { key:'unitPrice', label:'Unit Price', align:'right', render:v=>v?`₹${v}`:'—' },
      ];
      case 'part_issues': return [
        { key:'partName', label:'Part Name', color:'#e6edf3' },
        { key:'truckNumber', label:'Truck', color:'#58a6ff' },
        { key:'quantity', label:'Qty', align:'right' },
        { key:'totalValue', label:'Value', align:'right', render:v=>v?`₹${v.toLocaleString('en-IN')}`:'—' },
        { key:'jobCardNumber', label:'Job Card' },
        { key:'mechanicName', label:'Mechanic' },
        { key:'location', label:'Location' },
        { key:'issuedBy', label:'Issued By' },
        { key:'issuedAt', label:'Date', render:v=>v?new Date(v).toLocaleDateString('en-IN'):'—' },
      ];
      case 'tyre_issues': return [
        { key:'tyreName', label:'Tyre', color:'#e6edf3' },
        { key:'truckNumber', label:'Truck', color:'#58a6ff' },
        { key:'quantity', label:'Qty', align:'right' },
        { key:'position', label:'Position' },
        { key:'totalValue', label:'Value', align:'right', render:v=>v?`₹${v.toLocaleString('en-IN')}`:'—' },
        { key:'location', label:'Location' },
        { key:'issuedBy', label:'By' },
        { key:'issuedAt', label:'Date', render:v=>v?new Date(v).toLocaleDateString('en-IN'):'—' },
      ];
      case 'fleet_status': return [
        { key:'truckNumber', label:'Truck No.', color:'#58a6ff' },
        { key:'vehicleType', label:'Type' },
        { key:'make', label:'Make' },
        { key:'driverName', label:'Driver' },
        { key:'fuelLimit', label:'Fuel Limit', align:'right', render:v=>`${v} L` },
        { key:'status', label:'Status', render:v=><Badge text={v} type={v==='ACTIVE'?'success':'danger'} /> },
        { key:'location', label:'Location' },
        { key:'insuranceExpiry', label:'Insurance' },
        { key:'registrationExpiry', label:'RC' },
      ];
      case 'trips_report': return [
        { key:'tripNumber', label:'Trip No.', color:'#58a6ff' },
        { key:'truckNumber', label:'Truck' },
        { key:'consignee', label:'Consignee' },
        { key:'fromLocation', label:'From' },
        { key:'toLocation', label:'To' },
        { key:'freightAmount', label:'Freight', align:'right', render:v=>`₹${(v||0).toLocaleString('en-IN')}` },
        { key:'balanceAmount', label:'Balance', align:'right', render:v=>v>0?<span style={{color:'#f85149'}}>₹{v.toLocaleString('en-IN')}</span>:'—' },
        { key:'status', label:'Status', render:v=><Badge text={v} type={{PLANNED:'warning',IN_TRANSIT:'info',DELIVERED:'success',CANCELLED:'danger'}[v]||'default'} /> },
        { key:'paymentStatus', label:'Payment', render:v=><Badge text={v} type={{PAID:'success',PENDING:'danger',PARTIAL:'warning'}[v]||'default'} /> },
        { key:'startDate', label:'Start', render:v=>v?new Date(v).toLocaleDateString('en-IN'):'—' },
      ];
      default: return [];
    }
  };

  const needsMonthYear = ['fuel_excess','fuel_monthly'].includes(activeReport);

  return (
    <div>
      <PageHeader title="REPORTS CENTER" subtitle="Generate and view enterprise reports" />

      <div style={{ display:'flex', minHeight:'calc(100vh - 80px)' }}>
        {/* Left panel: report list */}
        <div style={{ width:200, background:'#161b22', borderRight:'1px solid #21262d', padding:'8px 0' }}>
          <div style={{ padding:'6px 16px', color:'#6c757d', fontSize:9, letterSpacing:1 }}>SELECT REPORT</div>
          {reports.map(r => (
            <div key={r.id}
              onClick={() => setActiveReport(r.id)}
              style={{
                padding:'8px 16px', cursor:'pointer', fontSize:11,
                color: activeReport===r.id ? '#00d4ff' : '#8b949e',
                background: activeReport===r.id ? '#0f3460' : 'transparent',
                borderLeft: activeReport===r.id ? '3px solid #00d4ff' : '3px solid transparent'
              }}
            >
              {r.icon} {r.label}
            </div>
          ))}
        </div>

        {/* Right panel: report data */}
        <div style={{ flex:1 }}>
          <div style={{
            background:'#161b22', borderBottom:'1px solid #21262d',
            padding:'8px 20px', display:'flex', gap:10, alignItems:'center'
          }}>
            {needsMonthYear && (<>
              <span style={{ color:'#6c757d', fontSize:10 }}>PERIOD:</span>
              <select value={month} onChange={e=>setMonth(+e.target.value)}
                style={{ background:'#0d1117', border:'1px solid #30363d', color:'#e6edf3', padding:'3px 8px', fontSize:11, fontFamily:'Consolas, monospace', borderRadius:2 }}>
                {months.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
              </select>
              <select value={year} onChange={e=>setYear(+e.target.value)}
                style={{ background:'#0d1117', border:'1px solid #30363d', color:'#e6edf3', padding:'3px 8px', fontSize:11, fontFamily:'Consolas, monospace', borderRadius:2 }}>
                {[2023,2024,2025,2026].map(y=><option key={y}>{y}</option>)}
              </select>
            </>)}
            <Btn variant="primary" onClick={() => loadReport()} small>REFRESH</Btn>
            <span style={{ color:'#6c757d', fontSize:10, marginLeft:'auto' }}>
              {loading ? 'Loading...' : `${data.length} records`}
            </span>
          </div>

          <div style={{ padding:'12px 20px' }}>
            <div style={{ background:'#0f3460', padding:'6px 14px', marginBottom:0, fontSize:11, color:'#8b949e' }}>
              {reports.find(r=>r.id===activeReport)?.icon} &nbsp;
              <strong style={{ color:'#e6edf3' }}>{reports.find(r=>r.id===activeReport)?.label}</strong>
              {needsMonthYear && ` — ${months[month-1]} ${year}`}
            </div>
            <TallyTable data={data} columns={getColumns()} />
          </div>
        </div>
      </div>
    </div>
  );
}
