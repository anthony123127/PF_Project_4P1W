import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const Home = () => {
  const { user, logout, isAdmin } = useAuth();
  return (
    <div>
      <h1>4 Pics 1 Word</h1>
      {user ? (
        <div>
          <p>Welcome, {user.username} ({user.roles.join(', ')})!</p>
          {isAdmin && <p><strong>You have Admin privileges.</strong></p>}
          <button onClick={logout}>Logout</button>
          <p><Link to="/play">Start Playing</Link></p>
        </div>
      ) : (
        <div>
          <p>Please login to play.</p>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/play" 
              element={
                <ProtectedRoute>
                  <div><h2>Game Area</h2><p>Packs will appear here in Iteration 2.</p><Link to="/">Back Home</Link></div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <div><h2>Admin Dashboard</h2><p>CMS will be implemented in future iterations.</p><Link to="/">Back Home</Link></div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
