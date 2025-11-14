import { createContext, useContext } from 'react';

// Contexto para compartir la referencia del Toast en toda la aplicación
export const ToastContext = createContext(null);

// Hook personalizado para acceder al Toast desde cualquier componente
export const useToast = () => {
    const toast = useContext(ToastContext);
    if (!toast) {
        console.warn('useToast debe usarse dentro de ToastContext.Provider');
    }
    return toast;
};