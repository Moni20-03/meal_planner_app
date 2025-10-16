import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import PlanView from './pages/PlanView';
import Profile from './pages/Profile';
import { authAPI } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.verify()
        .then(response => {
          setIsAuthenticated(true);
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Register onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/planner" 
          element={
            isAuthenticated ? 
            <Planner user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/plan/:id" 
          element={
            isAuthenticated ? 
            <PlanView user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? 
            <Profile user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
