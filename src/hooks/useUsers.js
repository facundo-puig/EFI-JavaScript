import { useState, useEffect } from 'react';
import { apiFetch } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export function useUsers(toast) {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtiene la lista completa de usuarios
    const fetchUsers = async () => {
        if (!token) return;
        
        try {
            setLoading(true);
            const data = await apiFetch('/api/users', { token });
            setUsers(data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los usuarios',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    // Cambia el rol de un usuario específico
    const changeUserRole = async (userId, newRole) => {
        try {
            await apiFetch(`/api/users/${userId}/role`, {
                method: 'PATCH',
                token,
                body: { role: newRole }
            });

            toast?.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Rol actualizado correctamente',
                life: 3000
            });

            // Actualiza el estado local sin recargar todos los usuarios
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
        } catch (error) {
            console.error('Error al cambiar rol:', error);
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar el rol',
                life: 3000
            });
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    return {
        users,
        loading,
        changeUserRole,
        refreshUsers: fetchUsers
    };
}