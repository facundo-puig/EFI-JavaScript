import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { usePost } from '../hooks/usePost';
import { useComments } from '../hooks/useComments';
import { canEditOrDeletePost, canEditComment, canDeleteComment } from '../utils/permissions';
import { confirmDeletePost, confirmDeleteComment } from '../utils/confirmations';
import CommentForm from '../components/CommentForm';
import CommentItem from '../components/CommentItem';
import '../styles/PostDetail.css';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const toast = useToast();
    
    const { post, loading, deletePost } = usePost(id);
    const { 
        comments, 
        loading: loadingComments, 
        submitting,
        createComment, 
        updateComment, 
        deleteComment: removeComment 
    } = useComments(id);

    // Crea un nuevo comentario y muestra notificación
    const handleCreateComment = async (text) => {
        try {
            const result = await createComment(text);
            
            if (result.success) {
                toast?.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Comentario publicado',
                    life: 3000
                });
                return true;
            } else {
                throw result.error;
            }
        } catch (error) {
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'No se pudo publicar el comentario',
                life: 3000
            });
            return false;
        }
    };

    // Actualiza un comentario existente
    const handleUpdateComment = async (commentId, text) => {
        try {
            const result = await updateComment(commentId, text);
            
            if (result.success) {
                toast?.current?.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Comentario actualizado',
                    life: 3000
                });
                return true;
            } else {
                throw result.error;
            }
        } catch (error) {
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'No se pudo actualizar el comentario',
                life: 3000
            });
            return false;
        }
    };

    // Elimina un comentario
    const handleDeleteComment = async (commentId) => {
        const result = await removeComment(commentId);
        
        if (result.success) {
            toast?.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Comentario eliminado',
                life: 3000
            });
        } else {
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el comentario',
                life: 3000
            });
        }
    };

    // Elimina el post y redirige a la lista
    const handleDeletePost = async () => {
        const result = await deletePost();
        
        if (result.success) {
            toast?.current?.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Post eliminado correctamente',
                life: 3000
            });
            setTimeout(() => navigate('/posts'), 1000);
        } else {
            toast?.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el post',
                life: 3000
            });
        }
    };

    // Muestra spinner mientras carga
    if (loading) {
        return (
            <div className="loading-container">
                <i className="pi pi-spin pi-spinner"></i>
            </div>
        );
    }

    // Muestra mensaje si no se encuentra el post
    if (!post) {
        return (
            <div className="not-found-container">
                <p>Post no encontrado</p>
            </div>
        );
    }

    return (
        <div className="post-detail-container">
            <ConfirmDialog />
            
            {/* Card del Post */}
            <Card 
                title={post.title}
                header={
                    <div className="post-header">
                        <Button
                            icon="pi pi-arrow-left"
                            label="Volver"
                            className="p-button-text"
                            onClick={() => navigate('/posts')}
                        />
                        {/* Botones de editar/eliminar solo si tiene permisos */}
                        {canEditOrDeletePost(user, post) && (
                            <div className="post-actions">
                                <Button
                                    icon="pi pi-pencil"
                                    label="Editar"
                                    className="p-button-warning"
                                    onClick={() => navigate(`/posts/${id}/edit`)}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    label="Eliminar"
                                    className="p-button-danger"
                                    onClick={() => confirmDeletePost(handleDeletePost)}
                                />
                            </div>
                        )}
                    </div>
                }
                footer={
                    <div className="post-footer">
                        <div className="post-author">
                            <i className="pi pi-user"></i>
                            <span>{post.author?.name || 'Autor desconocido'}</span>
                        </div>
                        <div className="post-date">
                            <i className="pi pi-calendar"></i>
                            <span>{new Date(post.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>
                }
            >
                <div className="post-content">
                    {post.content}
                </div>

                {/* Muestra fecha de actualización si es diferente a la creación */}
                {post.updated_at && post.updated_at !== post.created_at && (
                    <div className="post-updated">
                        Última actualización: {new Date(post.updated_at).toLocaleDateString('es-ES')}
                    </div>
                )}
            </Card>

            {/* Sección de Comentarios */}
            <Card className="comments-card">
                <div className="comments-header">
                    <h3>
                        <i className="pi pi-comments"></i>
                        Comentarios ({comments.length})
                    </h3>
                </div>

                {/* Formulario para nuevo comentario */}
                <CommentForm 
                    onSubmit={handleCreateComment}
                    isAuthenticated={!!token}
                    submitting={submitting}
                />

                <Divider />

                {/* Lista de comentarios */}
                {loadingComments ? (
                    <div className="comments-loading">
                        <i className="pi pi-spin pi-spinner"></i>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="comments-empty">
                        <i className="pi pi-inbox"></i>
                        No hay comentarios todavía.
                    </div>
                ) : (
                    <div className="comments-list">
                        {comments.map((comment, index) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                canEdit={canEditComment(user, comment)}
                                canDelete={canDeleteComment(user, comment)}
                                onUpdate={handleUpdateComment}
                                onDelete={(commentId) => 
                                    confirmDeleteComment(() => handleDeleteComment(commentId))
                                }
                                isLast={index === comments.length - 1}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}