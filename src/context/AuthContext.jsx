import React, { createContext, useEffect, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiFetch } from '../services/apiClient';
import { useToast } from './ToastContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    // Verifica si hay un token guardado al cargar la aplicación
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);

                // Verifica si el token no ha expirado
                if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
                    setUser(decoded);
                    setToken(storedToken);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Token inválido', error);
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    // Inicia sesión y guarda el token
    const login = async (email, password) => {
        try {
            const data = await apiFetch('/api/login', {
                method: 'POST',
                body: { email, password }
            });

            const jwtToken = data.access_token;

            if (!jwtToken) {
                toast?.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se recibió el token',
                    life: 3000
                });
                return false;
            }

            localStorage.setItem('token', jwtToken);
            const decoded = jwtDecode(jwtToken);
            setUser(decoded);
            setToken(jwtToken);

            toast?.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Inicio de sesión exitoso',
                life: 3000
            });
            return true;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.data?.error || 'Credenciales incorrectas',
                life: 3000
            });
            return false;
        }
    };

    // Cierra sesión y limpia el estado
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        toast?.current?.show({
            severity: 'info',
            summary: 'Sesión cerrada',
            detail: 'Has cerrado sesión correctamente',
            life: 3000
        });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);