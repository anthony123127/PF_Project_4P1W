import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Login failed');
    }
  };

  return (
    <section className="page-panel auth-panel narrow-panel">
      <div className="eyebrow">Player Access</div>
      <h2>Login</h2>
      <p className="section-copy">Sign in to unlock randomized pack selection and progress tracking.</p>
      {error && <div className="status-card error-card">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="button button-primary" type="submit">Login</button>
      </form>
      <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link></p>
    </section>
  );
};

export default LoginPage;
