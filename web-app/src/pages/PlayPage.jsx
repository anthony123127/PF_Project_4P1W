import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gameApi } from '../services/api';

const PlayPage = () => {
  const { packId } = useParams();
  const [puzzle, setPuzzle] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadPuzzle = async () => {
    try {
      setLoading(true);
      setError('');
      setFeedback(null);
      setGuess('');
      const nextPuzzle = await gameApi.getNextPuzzle(packId);
      setPuzzle(nextPuzzle);
    } catch (err) {
      setError(err.response?.data || 'Unable to load the next puzzle.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPuzzle();
  }, [packId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!puzzle?.puzzleId) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const response = await gameApi.submitGuess(puzzle.puzzleId, guess);
      setFeedback(response);
    } catch (err) {
      setError(err.response?.data || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = async () => {
    try {
      setLoading(true);
      await gameApi.restartPack(packId);
      await loadPuzzle();
    } catch (err) {
      setError(err.response?.data || 'Unable to restart this pack.');
      setLoading(false);
    }
  };

  const isCompleted = puzzle?.packCompleted;

  return (
    <section className="page-panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Play Pack</div>
          <h1>Read the four images and guess the shared word.</h1>
        </div>
        <p className="section-copy">Guesses are normalized for case, spaces, and hyphens before scoring.</p>
      </div>

      {loading && <div className="status-card">Loading puzzle...</div>}
      {error && <div className="status-card error-card">{error}</div>}

      {!loading && isCompleted && (
        <div className="completion-card">
          <h2>Pack completed</h2>
          <p>You solved every available puzzle in this pack. Restart it for a fresh order or pick another pack.</p>
          <div className="hero-actions">
            <button type="button" className="button button-primary" onClick={handleRestart}>
              Restart Pack
            </button>
            <Link className="button button-secondary" to="/packs">
              Back to Packs
            </Link>
          </div>
        </div>
      )}

      {!loading && !isCompleted && puzzle?.puzzleId && (
        <div className="play-layout">
          <div className="image-grid">
            {puzzle.imageUrls.map((imageUrl, index) => (
              <figure className="image-card" key={imageUrl}>
                <img src={imageUrl} alt={`Puzzle clue ${index + 1}`} />
              </figure>
            ))}
          </div>

          <div className="play-sidebar">
            <div className="detail-card">
              <span className="stat-label">Difficulty</span>
              <strong>{puzzle.difficulty}</strong>
            </div>
            <div className="detail-card">
              <span className="stat-label">Hint</span>
              <strong>{puzzle.hint}</strong>
            </div>
            <div className="detail-card">
              <span className="stat-label">Remaining after this</span>
              <strong>{puzzle.remainingCount}</strong>
            </div>

            <form className="guess-form" onSubmit={handleSubmit}>
              <label htmlFor="guess">Your answer</label>
              <input
                id="guess"
                type="text"
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
                placeholder="Type the shared word"
                required
              />
              <button className="button button-primary" type="submit" disabled={submitting}>
                {submitting ? 'Checking...' : 'Submit Guess'}
              </button>
            </form>

            {feedback && (
              <div className={`status-card ${feedback.correct ? 'success-card' : 'error-card'}`}>
                <strong>{feedback.correct ? 'Correct' : 'Not quite'}</strong>
                <p>Score change: {feedback.scoreDelta > 0 ? `+${feedback.scoreDelta}` : feedback.scoreDelta}</p>
                <p>Normalized guess: {feedback.normalizedGuess || '-'}</p>
                <div className="hero-actions">
                  {feedback.nextAvailable ? (
                    <button type="button" className="button button-secondary" onClick={loadPuzzle}>
                      Next Random Puzzle
                    </button>
                  ) : (
                    <button type="button" className="button button-secondary" onClick={loadPuzzle}>
                      Finish Pack
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PlayPage;
