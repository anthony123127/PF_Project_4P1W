import React, { useEffect, useState } from 'react';
import { gameApi } from '../services/api';

const ProfilePage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const response = await gameApi.getProgress();
        setProgress(response);
      } catch (err) {
        setError(err.response?.data || 'Unable to load profile progress.');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  return (
    <section className="page-panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Profile</div>
          <h1>Your puzzle summary at a glance.</h1>
        </div>
        <p className="section-copy">Solved count, attempts, score, and recent guesses update from the resource API.</p>
      </div>

      {loading && <div className="status-card">Loading progress...</div>}
      {error && <div className="status-card error-card">{error}</div>}

      {!loading && progress && (
        <>
          <div className="stats-grid">
            <article className="detail-card">
              <span className="stat-label">Solved</span>
              <strong>{progress.solved}</strong>
            </article>
            <article className="detail-card">
              <span className="stat-label">Attempts</span>
              <strong>{progress.attempts}</strong>
            </article>
            <article className="detail-card">
              <span className="stat-label">Score</span>
              <strong>{progress.score}</strong>
            </article>
          </div>

          <div className="recent-list">
            <h2>Recent puzzles</h2>
            {progress.recentPuzzles.length === 0 ? (
              <p>No puzzle attempts yet. Pick a pack to get started.</p>
            ) : (
              progress.recentPuzzles.map((entry) => (
                <article className="recent-item" key={`${entry.puzzleId}-${entry.playedAt}`}>
                  <div>
                    <strong>{entry.answer}</strong>
                    <span>{new Date(entry.playedAt).toLocaleString()}</span>
                  </div>
                  <span className={`result-pill ${entry.correct ? 'result-correct' : 'result-wrong'}`}>
                    {entry.correct ? 'Correct' : 'Miss'}
                  </span>
                </article>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ProfilePage;
