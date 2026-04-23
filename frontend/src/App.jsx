import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Trucks from './pages/Trucks';
import Fuel from './pages/Fuel';
import Trips from './pages/Trips';
import SpareParts from './pages/SpareParts';
import Tyres from './pages/Tyres';
import Reports from './pages/Reports';
import Users from './pages/Users';

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{
      background:'#0d1117', minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', color:'#00d4ff', fontFamily:'Consolas, monospace', fontSize:13
    }}>
      LOADING ENTERPRISE LOGISTICS...
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/trucks" element={<ProtectedRoute><Trucks /></ProtectedRoute>} />
      <Route path="/fuel" element={<ProtectedRoute><Fuel /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
      <Route path="/spare-parts" element={<ProtectedRoute><SpareParts /></ProtectedRoute>} />
      <Route path="/tyres" element={<ProtectedRoute><Tyres /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b22',
              color: '#e6edf3',
              border: '1px solid #30363d',
              fontFamily: 'Consolas, monospace',
              fontSize: 12,
            },
            success: { iconTheme: { primary: '#3fb950', secondary: '#161b22' } },
            error: { iconTheme: { primary: '#f85149', secondary: '#161b22' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
