import React, { useEffect, useState } from 'react';
import { getPacksAdmin, upsertPack, deletePack } from '../../api/cmsApi';
import { Link } from 'react-router-dom';

const PacksManagementPage = () => {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPack, setEditingPack] = useState(null);
    const [error, setError] = useState('');

    const loadPacks = async () => {
        try {
            setLoading(true);
            const data = await getPacksAdmin();
            setPacks(data.data);
        } catch (err) {
            setError('Failed to load packs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPacks();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await upsertPack(editingPack);
            setEditingPack(null);
            loadPacks();
        } catch (err) {
            setError('Failed to save pack.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? All puzzles in this pack will be deleted.')) return;
        try {
            await deletePack(id);
            loadPacks();
        } catch (err) {
            setError('Failed to delete pack.');
        }
    };

    return (
        <section className="page-panel">
            <div className="section-heading">
                <div>
                    <div className="eyebrow">Admin CMS</div>
                    <h1>Manage Puzzle Packs</h1>
                </div>
                <button 
                    className="button button-primary"
                    onClick={() => setEditingPack({ name: '', description: '', published: false, displayOrder: packs.length + 1 })}
                >
                    Create New Pack
                </button>
            </div>

            {error && <div className="status-card error-card">{error}</div>}

            {loading ? (
                <div className="status-card">Loading packs...</div>
            ) : (
                <div className="info-grid">
                    {packs.map(pack => (
                        <article key={pack.id} className="info-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2>{pack.name}</h2>
                                    <p>{pack.description}</p>
                                    <div className="eyebrow" style={{ marginTop: '10px' }}>
                                        {pack.published ? 'Published' : 'Draft'} • Order: {pack.displayOrder}
                                    </div>
                                </div>
                                <div className="hero-actions" style={{ flexDirection: 'column', gap: '5px' }}>
                                    <button className="button button-ghost" onClick={() => setEditingPack(pack)}>Edit</button>
                                    <Link className="button button-ghost" to={`/admin/puzzles/${pack.id}`}>Puzzles</Link>
                                    <button className="button button-ghost" style={{ color: 'red' }} onClick={() => handleDelete(pack.id)}>Delete</button>
                                </div>
                            </div>
                        </article>
                    ))}
                    {packs.length === 0 && <div className="status-card">No packs found. Create your first one!</div>}
                </div>
            )}

            {editingPack && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="page-panel narrow-panel" style={{ backgroundColor: 'var(--panel-bg)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                        <h2>{editingPack.id ? 'Edit Pack' : 'New Pack'}</h2>
                        <form onSubmit={handleSave} className="guess-form" style={{ marginTop: '1rem' }}>
                            <label>Name</label>
                            <input 
                                type="text" 
                                value={editingPack.name} 
                                onChange={e => setEditingPack({...editingPack, name: e.target.value})} 
                                required 
                            />
                            <label>Description</label>
                            <textarea 
                                value={editingPack.description} 
                                onChange={e => setEditingPack({...editingPack, description: e.target.value})} 
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: '1rem' }}
                            />
                            <label>Display Order</label>
                            <input 
                                type="number" 
                                value={editingPack.displayOrder} 
                                onChange={e => setEditingPack({...editingPack, displayOrder: parseInt(e.target.value)})} 
                                required 
                            />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    checked={editingPack.published} 
                                    onChange={e => setEditingPack({...editingPack, published: e.target.checked})} 
                                />
                                Published
                            </label>
                            <div className="hero-actions" style={{ marginTop: '1.5rem' }}>
                                <button type="submit" className="button button-primary">Save Pack</button>
                                <button type="button" className="button button-ghost" onClick={() => setEditingPack(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PacksManagementPage;
