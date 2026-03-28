import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.errors ||
                err.response?.data?.message ||
                err.response?.data ||
                'Registration failed'
            );
        }
    };

    return (
        <section className="page-panel auth-panel narrow-panel">
            <div className="eyebrow">New Account</div>
            <h2>Register</h2>
            <p className="section-copy">Create a player account now. Admin assignment can be granted later through the backend.</p>
            {error && (
                <div className="status-card error-card">
                    {Array.isArray(error) ? (
                        <ul className="error-list">
                            {error.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    ) : (
                        <p>{error}</p>
                    )}
                </div>
            )}
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-field">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-field">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button className="button button-primary" type="submit">Register</button>
            </form>
            <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
        </section>
    );
};

export default RegisterPage;
