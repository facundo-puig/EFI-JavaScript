import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../services/apiClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

// Configuración de colores para cada rol
const ROLE_CONFIG = {
    user: { label: 'Usuario', severity: 'info' },
    moderator: { label: 'Moderador', severity: 'warning' },
    admin: { label: 'Admin', severity: 'danger' }
};

export default function Profile() {
    const { token } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Redirige al login si no está autenticado
        if (!token) {
            navigate('/login');
            return;
        }

        // Obtiene los datos del perfil del usuario
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await apiFetch('/api/users/me', { token });
                setProfile(data);
            } catch (error) {
                console.error('Error al cargar perfil:', error);
                toast?.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar el perfil',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, navigate, toast]);

    if (loading) {
        return (
            <div className="loading-container">
                <i className="pi pi-spin pi-spinner"></i>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="not-found-container">
                <p>No se pudo cargar el perfil</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <Card title="Mi Perfil" className="profile-card">
                <div className="profile-content">
                    <div className="profile-info">
                        <div className="profile-field">
                            <label>Nombre:</label>
                            <span>{profile.name}</span>
                        </div>

                        <div className="profile-field">
                            <label>Email:</label>
                            <span>{profile.email}</span>
                        </div>

                        <div className="profile-field">
                            <label>Rol:</label>
                            <Tag 
                                value={ROLE_CONFIG[profile.role]?.label || profile.role}
                                severity={ROLE_CONFIG[profile.role]?.severity || 'info'}
                            />
                        </div>

                        <div className="profile-field">
                            <label>Miembro desde:</label>
                            <span>
                                {new Date(profile.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}