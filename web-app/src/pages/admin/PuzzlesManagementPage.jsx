import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPuzzlesAdmin, upsertPuzzle, deletePuzzle, getImages, getTags } from '../../api/cmsApi';

const PuzzlesManagementPage = () => {
    const { packId } = useParams();
    const [puzzles, setPuzzles] = useState([]);
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPuzzle, setEditingPuzzle] = useState(null);
    const [error, setError] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const puzzleRes = await getPuzzlesAdmin(packId);
            const imageRes = await getImages();
            const tagRes = await getTags();
            setPuzzles(puzzleRes.data);
            setImages(imageRes.data);
            setTags(tagRes.data);
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [packId]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (editingPuzzle.imageIds.length !== 4) {
            setError('Each puzzle must have exactly 4 images.');
            return;
        }
        try {
            await upsertPuzzle({ ...editingPuzzle, packId });
            setEditingPuzzle(null);
            loadData();
        } catch (err) {
            setError('Failed to save puzzle.');
        }
    };

    const toggleImage = (imageId) => {
        const current = [...editingPuzzle.imageIds];
        if (current.includes(imageId)) {
            setEditingPuzzle({ ...editingPuzzle, imageIds: current.filter(id => id !== imageId) });
        } else if (current.length < 4) {
            setEditingPuzzle({ ...editingPuzzle, imageIds: [...current, imageId] });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this puzzle?')) return;
        try {
            await deletePuzzle(id);
            loadPuzzles();
        } catch (err) {
            setError('Failed to delete.');
        }
    };

    const filteredImages = selectedTag 
        ? images.filter(img => img.tags.some(t => t.name === selectedTag))
        : images;

    return (
        <section className="page-panel">
            <div className="section-heading">
                <div>
                    <div className="eyebrow">Admin CMS • <Link to="/admin/packs" style={{ color: 'inherit' }}>Packs</Link></div>
                    <h1>Manage Puzzles</h1>
                </div>
                <button 
                    className="button button-primary"
                    onClick={() => setEditingPuzzle({ answer: '', hint: '', difficulty: 'easy', imageIds: [], acceptedVariants: [] })}
                >
                    Create New Puzzle
                </button>
            </div>

            {error && <div className="status-card error-card">{error}</div>}

            {loading ? (
                <div className="status-card">Loading puzzles...</div>
            ) : (
                <div className="info-grid">
                    {puzzles.map(puzzle => (
                        <article key={puzzle.id} className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className="image-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                                {puzzle.imageIds.slice(0, 4).map(id => {
                                    const img = images.find(i => i.id === id);
                                    return <img key={id} src={img?.url} style={{ width: '100%', borderRadius: '4px' }} alt="" />;
                                })}
                            </div>
                            <div>
                                <h2>{puzzle.answer}</h2>
                                <p className="eyebrow">{puzzle.difficulty.toUpperCase()} • {puzzle.hint}</p>
                            </div>
                            <div className="hero-actions">
                                <button className="button button-ghost" onClick={() => setEditingPuzzle(puzzle)}>Edit</button>
                                <button className="button button-ghost" style={{ color: 'red' }} onClick={() => handleDelete(puzzle.id)}>Delete</button>
                            </div>
                        </article>
                    ))}
                    {puzzles.length === 0 && <div className="status-card">No puzzles in this pack yet. Create one!</div>}
                </div>
            )}

            {editingPuzzle && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="page-panel" style={{ width: '90%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'var(--panel-bg)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                        <h2>{editingPuzzle.id ? 'Edit Puzzle' : 'New Puzzle'}</h2>
                        <form onSubmit={handleSave} className="guess-form" style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label>Answer</label>
                                    <input 
                                        type="text" 
                                        value={editingPuzzle.answer} 
                                        onChange={e => setEditingPuzzle({...editingPuzzle, answer: e.target.value})} 
                                        required 
                                    />
                                    <label>Hint</label>
                                    <input 
                                        type="text" 
                                        value={editingPuzzle.hint} 
                                        onChange={e => setEditingPuzzle({...editingPuzzle, hint: e.target.value})} 
                                        required 
                                    />
                                    <label>Difficulty</label>
                                    <select 
                                        value={editingPuzzle.difficulty} 
                                        onChange={e => setEditingPuzzle({...editingPuzzle, difficulty: e.target.value})}
                                        style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', width: '100%' }}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                    <label>Accepted Variants (comma separated)</label>
                                    <input 
                                        type="text" 
                                        value={editingPuzzle.acceptedVariants?.join(', ')} 
                                        onChange={e => setEditingPuzzle({...editingPuzzle, acceptedVariants: e.target.value.split(',').map(v => v.trim()).filter(v => v)})} 
                                    />
                                    <p className="eyebrow" style={{ marginTop: '10px' }}>
                                        Selected: {editingPuzzle.imageIds.length} / 4 Images
                                    </p>
                                    <div className="hero-actions" style={{ marginTop: '1.5rem' }}>
                                        <button type="submit" className="button button-primary">Save Puzzle</button>
                                        <button type="button" className="button button-ghost" onClick={() => setEditingPuzzle(null)}>Cancel</button>
                                    </div>
                                </div>
                                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                                    <label>Select 4 Images</label>
                                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                        <button 
                                            type="button" 
                                            className={`button ${!selectedTag ? 'button-primary' : 'button-ghost'}`}
                                            onClick={() => setSelectedTag('')}
                                        >All</button>
                                        {tags.map(tag => (
                                            <button 
                                                key={tag.id}
                                                type="button" 
                                                className={`button ${selectedTag === tag.name ? 'button-primary' : 'button-ghost'}`}
                                                onClick={() => setSelectedTag(tag.name)}
                                            >{tag.name}</button>
                                        ))}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', height: '400px', overflowY: 'auto', alignContent: 'start' }}>
                                        {filteredImages.map(img => (
                                            <div 
                                                key={img.id} 
                                                onClick={() => toggleImage(img.id)}
                                                style={{ 
                                                    cursor: 'pointer', 
                                                    position: 'relative',
                                                    border: editingPuzzle.imageIds.includes(img.id) ? '3px solid var(--brand-primary)' : '1px solid transparent',
                                                    borderRadius: '6px'
                                                }}
                                            >
                                                <img src={img.url} style={{ width: '100%', borderRadius: '4px' }} alt="" />
                                                {editingPuzzle.imageIds.includes(img.id) && (
                                                    <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--brand-primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }}>✓</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PuzzlesManagementPage;
