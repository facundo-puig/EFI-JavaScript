import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css'

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const menuRight = useRef(null);

    // Items del menú principal
    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            command: () => navigate('/')
        },
        {
            label: 'Posts',
            icon: 'pi pi-book',
            command: () => navigate('/posts')
        },
        // Mostrar opción de administración solo si el usuario es admin
        ...(user && user.role === 'admin' ? [{
            label: 'Administrar',
            icon: 'pi pi-cog',
            command: () => navigate('/admin')
        }] : [])
    ];

    // Opciones del menú desplegable del usuario
    const userMenuItems = [
        {
            label: 'Perfil',
            icon: 'pi pi-id-card',
            command: () => navigate('/perfil')
        },
        {
            separator: true
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => {
                logout();
                navigate('/');
            }
        }
    ];

    // Logo y título del blog
    const start = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '3rem', color: '#ffffffff' }}>
            <i className="pi pi-bookmark" style={{ fontSize: '1.5rem', color: '#3B82F6' }}></i>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>MiniBlog</span>
        </div>
    );

    // Sección derecha del navbar con opciones de usuario
    const end = (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
                <>
                    {/* Nombre del usuario */}
                    <span style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
                        {user.name}
                    </span>
                    
                    {/* Menú desplegable del usuario */}
                    <Menu model={userMenuItems} popup ref={menuRight} />
                    <Button
                        icon="pi pi-user"
                        className="p-button-rounded p-button-text"
                        onClick={(e) => menuRight.current.toggle(e)}
                        aria-label="Usuario"
                    />
                </>
            ) : (
                <>
                    {/* Botones para usuarios no autenticados */}
                    <Button
                        label="Iniciar Sesión"
                        icon="pi pi-sign-in"
                        className="p-button-outlined"
                        onClick={() => navigate('/login')}
                    />
                    <Button
                        label="Registrarse"
                        icon="pi pi-user-plus"
                        onClick={() => navigate('/registrarse')}
                    />
                </>
            )}
        </div>
    );

    return <Menubar model={items} start={start} end={end} />;
}