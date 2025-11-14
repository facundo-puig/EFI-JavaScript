import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePost } from '../hooks/usePost';
import PostForm from '../components/PostForm';
import '../styles/PostEdit.css';

export default function PostEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const toast = useToast();
    
    const { post, loading, updatePost } = usePost(id);

    // Redirige al login si no está autenticado
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleSubmit = async (formData) => {
        // Valida que los campos no estén vacíos
        if (!formData.title.trim() || !formData.content.trim()) {
            toast?.current?.show({
                severity: 'warn',
                summary: 'Atención',
                detail: 'Título y contenido son obligatorios',
                life: 3000
            });
            return false;
        }

        const result = await updatePost(formData);

        if (result.success) {
            toast?.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Post actualizado correctamente',
                life: 3000
            });
            setTimeout(() => navigate(`/posts/${id}`), 1000);
            return true;
        } else {
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: result.error?.data?.error || 'No se pudo actualizar el post',
                life: 3000
            });
            return false;
        }
    };

    // Cancela la edición y vuelve al detalle del post
    const handleCancel = () => {
        navigate(`/posts/${id}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <i className="pi pi-spin pi-spinner"></i>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="not-found-container">
                <p>Post no encontrado</p>
            </div>
        );
    }

    return (
        <div className="post-edit-container">
            <Card title="Editar Post">
                <PostForm
                    initialValues={{
                        title: post.title,
                        content: post.content
                    }}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    submitLabel="Guardar Cambios"
                    showCard={false}
                />
            </Card>
        </div>
    );
}