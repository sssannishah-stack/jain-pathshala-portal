import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loading from './components/common/Loading';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import UserHistory from './pages/UserHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import './App.css';

function AppRoutes() {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          currentUser 
            ? <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} /> 
            : <LoginPage />
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/history" 
        element={
          <ProtectedRoute requiredRole="user">
            <UserHistory />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/reports" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminReports />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="*" 
        element={
          <Navigate to={currentUser ? (userRole === 'admin' ? '/admin' : '/dashboard') : '/login'} />
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <div className="app">
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                  borderRadius: '10px',
                },
                success: {
                  iconTheme: {
                    primary: '#00b894',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ff4757',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
