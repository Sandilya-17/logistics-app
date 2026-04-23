import React, { useEffect, useState } from 'react';
import { usersAPI } from '../api/api';
import { TallyTable, PageHeader, Btn, Modal, Field, Input, Select, Section, Badge } from '../components/UI';
import toast from 'react-hot-toast';

const ALL_PERMS = ['VIEW_TRUCKS','FUEL_ENTRY','TRIPS','SPARE_PART_ISSUE','TYRE_ISSUE','VIEW_REPORTS'];
const DEPTS = ['MANAGEMENT','OPERATIONS','MAINTENANCE','ACCOUNTS','TRANSPORT','WAREHOUSE'];
const EMPTY = { username:'', password:'', fullName:'', email:'', phone:'', role:'EMPLOYEE', department:'OPERATIONS', permissions:[] };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [selected, setSelected] = useState(null);

  const load = () => usersAPI.getAll().then(r => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const togglePerm = (perm) => {
    setForm(p => ({
      ...p,
      permissions: p.permissions.includes(perm)
        ? p.permissions.filter(x => x !== perm)
        : [...p.permissions, perm]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal === 'add') {
        await usersAPI.add(form);
        toast.success('User created');
      } else {
        await usersAPI.update(selected.id, form);
        toast.success('User updated');
      }
      load(); setModal(null);
    } catch (err) {
      toast.error(err.response?.data || 'Error saving user');
    }
  };

  const handleToggleActive = async (u) => {
    await usersAPI.update(u.id, { active: !u.active });
    toast.success(u.active ? 'User deactivated' : 'User activated');
    load();
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete user ${u.username}?`)) return;
    await usersAPI.delete(u.id);
    toast.success('User deleted');
    load();
  };

  return (
    <div>
      <PageHeader
        title="USER MANAGEMENT"
        subtitle={`${users.filter(u=>u.active).length} Active | ${users.filter(u=>!u.active).length} Inactive | Total: ${users.length}`}
        actions={[
          <Btn key="add" variant="success" onClick={() => { setForm(EMPTY); setModal('add'); }}>+ ADD USER</Btn>
        ]}
      />

      <Section title="SYSTEM USERS">
        <TallyTable
          data={users}
          columns={[
            { key:'username', label:'Username', color:'#58a6ff', width:120 },
            { key:'fullName', label:'Full Name', width:160 },
            { key:'role', label:'Role', width:90,
              render:v=><Badge text={v} type={v==='ADMIN'?'info':'success'} /> },
            { key:'department', label:'Department', width:120 },
            { key:'email', label:'Email', width:160 },
            { key:'phone', label:'Phone', width:110 },
            { key:'active', label:'Status', width:80,
              render:v=><Badge text={v?'ACTIVE':'INACTIVE'} type={v?'success':'danger'} /> },
            { key:'lastLogin', label:'Last Login', width:130,
              render:v=>v?new Date(v).toLocaleString('en-IN'):'Never' },
            { key:'permissions', label:'Permissions', width:200,
              render:(v,row) => row.role==='ADMIN'
                ? <span style={{ color:'#3fb950', fontSize:10 }}>All permissions</span>
                : <span style={{ color:'#8b949e', fontSize:10 }}>{(v||[]).join(', ') || 'None'}</span>
            },
            { key:'id', label:'Actions', width:120,
              render:(_,row) => (
                <div style={{ display:'flex', gap:4 }} onClick={e=>e.stopPropagation()}>
                  <Btn small variant="ghost" onClick={() => { setForm({...EMPTY,...row,password:''}); setSelected(row); setModal('edit'); }}>Edit</Btn>
                  <Btn small variant={row.active?'warning':'success'} onClick={() => handleToggleActive(row)}>
                    {row.active?'Deact.':'Act.'}
                  </Btn>
                  <Btn small variant="danger" onClick={() => handleDelete(row)}>Del</Btn>
                </div>
              )
            },
          ]}
        />
      </Section>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'CREATE USER':` EDIT USER — ${selected?.username}`} onClose={() => setModal(null)} wide>
          <form onSubmit={handleSubmit}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0 4%' }}>
              <Field label="Username *" half><Input name="username" value={form.username} onChange={handleChange} required /></Field>
              <Field label={modal==='add'?'Password *':'New Password (leave blank to keep)'} half>
                <Input name="password" type="password" value={form.password} onChange={handleChange} required={modal==='add'} />
              </Field>
              <Field label="Full Name *" half><Input name="fullName" value={form.fullName} onChange={handleChange} required /></Field>
              <Field label="Email" half><Input name="email" type="email" value={form.email} onChange={handleChange} /></Field>
              <Field label="Phone" half><Input name="phone" value={form.phone} onChange={handleChange} /></Field>
              <Field label="Role" half>
                <Select name="role" value={form.role} onChange={handleChange}>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ADMIN">ADMIN</option>
                </Select>
              </Field>
              <Field label="Department" half>
                <Select name="department" value={form.department} onChange={handleChange}>
                  {DEPTS.map(d=><option key={d}>{d}</option>)}
                </Select>
              </Field>
            </div>

            {form.role === 'EMPLOYEE' && (
              <div style={{ marginTop:8 }}>
                <div style={{ color:'#8b949e', fontSize:10, marginBottom:8 }}>MODULE PERMISSIONS :</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {ALL_PERMS.map(p => (
                    <label key={p} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(p)}
                        onChange={() => togglePerm(p)}
                        style={{ cursor:'pointer' }}
                      />
                      <span style={{
                        color: form.permissions.includes(p) ? '#3fb950' : '#6c757d',
                        fontSize:11
                      }}>{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:16 }}>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" variant="success">{modal==='add'?'CREATE USER':'SAVE CHANGES'}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
