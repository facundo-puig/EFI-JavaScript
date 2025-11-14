import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { useUsers } from '../hooks/useUsers';
import { useToast } from '../context/ToastContext';
import '../styles/Admin.css';

// Opciones disponibles para el selector de roles
const ROLE_OPTIONS = [
    { label: 'Usuario', value: 'user' },
    { label: 'Moderador', value: 'moderator' },
    { label: 'Admin', value: 'admin' }
];

// Configuración de colores y etiquetas para cada rol
const ROLE_CONFIG = {
    user: { label: 'Usuario', severity: 'info' },
    moderator: { label: 'Moderador', severity: 'warning' },
    admin: { label: 'Admin', severity: 'danger' }
};

export default function Admin() {
    const toast = useToast();
    const { users, loading, changeUserRole } = useUsers(toast);

    // Renderiza el rol del usuario como una etiqueta con color
    const roleBodyTemplate = (rowData) => (
        <Tag 
            value={ROLE_CONFIG[rowData.role].label} 
            severity={ROLE_CONFIG[rowData.role].severity} 
        />
    );

    // Muestra el estado activo/inactivo del usuario
    const statusBodyTemplate = (rowData) => (
        <Tag 
            value={rowData.is_active ? 'Activo' : 'Inactivo'} 
            severity={rowData.is_active ? 'success' : 'danger'} 
        />
    );

    // Formatea la fecha de registro en formato español
    const dateBodyTemplate = (rowData) => 
        new Date(rowData.created_at).toLocaleDateString('es-ES');

    // Dropdown para cambiar el rol de un usuario
    const roleEditorTemplate = (rowData) => (
        <Dropdown
            value={rowData.role}
            options={ROLE_OPTIONS}
            onChange={(e) => changeUserRole(rowData.id, e.value)}
            placeholder="Seleccionar rol"
        />
    );

    return (
        <div className="admin-container">
            <Card title="Administración de Usuarios" className="admin-card">
                <DataTable 
                    value={users} 
                    loading={loading}
                    paginator 
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: '50rem' }}
                    emptyMessage="No hay usuarios registrados"
                >
                    <Column field="id" header="ID" sortable style={{ width: '5%' }} />
                    <Column field="name" header="Nombre" sortable style={{ width: '20%' }} />
                    <Column field="email" header="Email" sortable style={{ width: '25%' }} />
                    <Column 
                        field="role" 
                        header="Rol" 
                        body={roleBodyTemplate} 
                        sortable 
                        style={{ width: '15%' }} 
                    />
                    <Column 
                        header="Cambiar Rol" 
                        body={roleEditorTemplate} 
                        style={{ width: '15%' }} 
                    />
                    <Column 
                        field="is_active" 
                        header="Estado" 
                        body={statusBodyTemplate} 
                        sortable 
                        style={{ width: '10%' }} 
                    />
                    <Column 
                        field="created_at" 
                        header="Fecha Registro" 
                        body={dateBodyTemplate} 
                        sortable 
                        style={{ width: '10%' }} 
                    />
                </DataTable>
            </Card>
        </div>
    );
}