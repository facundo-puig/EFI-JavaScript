/**
 * Verifica si el usuario puede editar o eliminar un post
 * Un usuario puede editar/eliminar su propio post o si es admin
 */
export function canEditOrDeletePost(user, post) {
    if (!user || !post) return false;
    const userId = parseInt(user.sub);
    return userId === post.user_id || user.role === 'admin';
}

/**
 * Verifica si el usuario puede editar un comentario
 * Solo el autor del comentario puede editarlo
 */
export function canEditComment(user, comment) {
    if (!user || !comment) return false;
    const userId = parseInt(user.sub);
    return userId === comment.user_id;
}

/**
 * Verifica si el usuario puede eliminar un comentario
 * El autor, moderadores y admins pueden eliminar comentarios
 */
export function canDeleteComment(user, comment) {
    if (!user || !comment) return false;
    const userId = parseInt(user.sub);
    return userId === comment.user_id || 
           user.role === 'admin' || 
           user.role === 'moderator';
}

// objeto con todos los permisos
export const permissions = {
    canEditPost: canEditOrDeletePost,
    canDeletePost: canEditOrDeletePost,
    canEditComment,
    canDeleteComment
};