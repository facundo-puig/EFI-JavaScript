import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePostList } from '../hooks/usePostList';
import { useToast } from '../context/ToastContext';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import '../styles/PostList.css';

export default function PostList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { posts, loading, createPost } = usePostList();

    const handleCreatePost = async (formData) => {
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

        const result = await createPost(formData);

        if (result.success) {
            toast?.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Post creado con éxito',
                life: 3000
            });
            return true;
        } else {
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: result.error?.data?.error || 'No se pudo crear el post',
                life: 3000
            });
            return false;
        }
    };

    // Navega al detalle del post
    const handleViewDetails = (postId) => {
        navigate(`/posts/${postId}`);
    };

    return (
        <div className="posts-container">
            <div className="posts-header">
                <h1>
                    <i className="pi pi-book"></i>
                    Publicaciones
                </h1>
            </div>

            {/* Formulario de crear post solo si está autenticado */}
            {user ? (
                <div className="create-post-card">
                    <PostForm 
                        onSubmit={handleCreatePost}
                        submitLabel="Publicar"
                        title="Crear nueva publicación"
                        showCard={false}
                    />
                </div>
            ) : (
                <div className="login-prompt-card">
                    <p>
                        <i className="pi pi-lock"></i>
                        {' '}Inicia sesión para crear publicaciones
                    </p>
                </div>
            )}

            {/* Lista de posts con estados de carga y vacío */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#1976d2' }}></i>
                </div>
            ) : posts.length === 0 ? (
                <div className="no-posts">
                    <i className="pi pi-inbox" style={{ fontSize: '3rem' }}></i>
                    <p>No hay publicaciones todavía.</p>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <PostCard 
                            key={post.id}
                            post={post}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}