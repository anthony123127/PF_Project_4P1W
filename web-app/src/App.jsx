import React from 'react';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PacksPage from './pages/PacksPage';
import PlayPage from './pages/PlayPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const HomePage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <section className="hero-panel">
      <div className="eyebrow">4 Pics 1 Word</div>
      <h1>Randomized packs, quick rounds, and a CMS-ready foundation.</h1>
      <p className="hero-copy">
        Pick a shuffled pack, solve image-based word puzzles, and track your progress as you go.
      </p>
      <div className="hero-actions">
        <NavLink className="button button-primary" to={user ? '/packs' : '/login'}>
          {user ? 'Browse Packs' : 'Login to Play'}
        </NavLink>
        <NavLink className="button button-secondary" to={user ? '/profile' : '/register'}>
          {user ? 'View Profile' : 'Create Account'}
        </NavLink>
      </div>
      <div className="info-grid">
        <article className="info-card">
          <h2>Player Flow</h2>
          <p>Published packs are randomized per request, and each pack serves unsolved puzzles in a fresh order.</p>
        </article>
        <article className="info-card">
          <h2>Auth Ready</h2>
          <p>JWT route guards protect the player journey now and leave room for admin-only CMS screens next.</p>
        </article>
        <article className="info-card">
          <h2>Admin Status</h2>
          <p>{isAdmin ? 'Your account can access the protected admin area shell.' : 'Admin screens stay locked behind role-based access.'}</p>
        </article>
      </div>
    </section>
  );
};

const AdminPlaceholderPage = () => (
  <section className="page-panel narrow-panel">
    <div className="eyebrow">Admin CMS</div>
    <h1>CMS screens are reserved for the next iteration.</h1>
    <p className="section-copy">
      Route protection is active. The player experience and resource API are wired now so the admin image, tag,
      puzzle, and pack workflows can layer in cleanly.
    </p>
  </section>
);

const AppLayout = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">4P1W</span>
          <span className="brand-copy">Puzzle Studio</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          {user && <NavLink to="/packs">Packs</NavLink>}
          {user && <NavLink to="/profile">Profile</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="session-panel">
          {user ? (
            <>
              <div className="session-copy">
                <strong>{user.username}</strong>
                <span>{user.roles.join(', ')}</span>
              </div>
              <button type="button" className="button button-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <div className="session-links">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </div>
          )}
        </div>
      </header>

      <main className="page-frame">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/packs"
            element={
              <ProtectedRoute>
                <PacksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/play/:packId"
            element={
              <ProtectedRoute>
                <PlayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPlaceholderPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppLayout />
    </Router>
  </AuthProvider>
);

export default App;
