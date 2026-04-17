import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatLayout from '../components/ChatLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { useAuth } from '../context/AuthContext';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <ChatLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
