/* src/pages/ProfilePage.jsx */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({ full_name: '', birth_date: '', email: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('ppf_session'));
        if (!session) return navigate('/');
        setUser(session);
        fetchProfile(session.id);
    }, [navigate]);

    const fetchProfile = async (id) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const res = await axios.get(`${API_URL}/users/profile/${id}`);
            setProfile(res.data);
        } catch (e) { console.error("Error al cargar perfil:", e); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            await axios.put(`${API_URL}/users/update`, {
                userId: user.id,
                full_name: profile.full_name,
                birth_date: profile.birth_date
            });
            alert("✅ Perfil actualizado correctamente");
            navigate('/home');
        } catch (e) { alert("❌ Error al actualizar el perfil"); }
        finally { setLoading(false); }
    };

    return (
        <div className="ppf-app-container">
            <div className="ppf-main-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <header className="ppf-header">
                    <h1 className="ppf-title-blue">Mi Perfil</h1>
                    <button onClick={() => navigate('/home')} className="ppf-button-primary" style={{ backgroundColor: '#6b7280' }}>
                        VOLVER
                    </button>
                </header>

                <div className="ppf-card">
                    <form className="ppf-form" onSubmit={handleUpdate}>
                        <div className="ppf-form__group">
                            <label className="ppf-label">Correo (No editable)</label>
                            <input className="ppf-input" value={profile.email} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} />
                        </div>
                        <div className="ppf-form__group">
                            <label className="ppf-label">Nombre Completo</label>
                            <input 
                                className="ppf-input" 
                                value={profile.full_name} 
                                onChange={e => setProfile({...profile, full_name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="ppf-form__group">
                            <label className="ppf-label">Fecha de Nacimiento</label>
                            <input 
                                type="date" 
                                className="ppf-input" 
                                value={profile.birth_date ? profile.birth_date.split('T')[0] : ''} 
                                onChange={e => setProfile({...profile, birth_date: e.target.value})} 
                                required 
                            />
                        </div>
                        <button type="submit" className="ppf-button-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                            {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;