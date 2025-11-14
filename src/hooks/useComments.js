import { useState, useEffect } from 'react';
import { apiFetch } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export function useComments(postId) {
    const { token } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Obtiene todos los comentarios de un post
    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiFetch(`/api/posts/${postId}/comments`);
            setComments(data);
        } catch (err) {
            setError(err);
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    // Crea un nuevo comentario
    const createComment = async (text) => {
        if (!text.trim()) {
            throw new Error('El comentario no puede estar vacío');
        }

        try {
            setSubmitting(true);
            await apiFetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                body: { text },
                token
            });
            await fetchComments();
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        } finally {
            setSubmitting(false);
        }
    };

    // Actualiza un comentario existente
    const updateComment = async (commentId, text) => {
        if (!text.trim()) {
            throw new Error('El comentario no puede estar vacío');
        }

        try {
            await apiFetch(`/api/comments/${commentId}`, {
                method: 'PUT',
                body: { text },
                token
            });
            await fetchComments();
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    };

    // Elimina un comentario
    const deleteComment = async (commentId) => {
        try {
            await apiFetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                token
            });
            await fetchComments();
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    return {
        comments,
        loading,
        submitting,
        error,
        createComment,
        updateComment,
        deleteComment,
        refreshComments: fetchComments
    };
}