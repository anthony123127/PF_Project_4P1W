import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gameApi } from '../services/api';

const PacksPage = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPacks = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await gameApi.getPacks(true);
        setPacks(response);
      } catch (err) {
        setError(err.response?.data || 'Unable to load packs right now.');
      } finally {
        setLoading(false);
      }
    };

    loadPacks();
  }, []);

  return (
    <section className="page-panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Player Packs</div>
          <h1>Published packs are shuffled for every fresh visit.</h1>
        </div>
        <p className="section-copy">Choose any pack to start a randomized puzzle run.</p>
      </div>

      {loading && <div className="status-card">Loading packs...</div>}
      {error && <div className="status-card error-card">{error}</div>}

      {!loading && !error && (
        <div className="pack-grid">
          {packs.map((pack) => (
            <article className="pack-card" key={pack.id}>
              <div className="tag-row">
                {pack.difficulties.map((difficulty) => (
                  <span className="tag-pill" key={difficulty}>
                    {difficulty}
                  </span>
                ))}
              </div>
              <h2>{pack.name}</h2>
              <p>{pack.description}</p>
              <div className="pack-meta">
                <span>{pack.puzzleCount} puzzles</span>
                <Link className="button button-primary" to={`/play/${pack.id}`}>
                  Start Pack
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default PacksPage;
