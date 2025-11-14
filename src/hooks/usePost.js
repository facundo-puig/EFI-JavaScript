import { useState, useEffect } from 'react';
import { apiFetch } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export function usePost(postId) {
    const { token } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtiene los detalles de un post específico
    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiFetch(`/api/posts/${postId}`);
            setPost(data);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Actualiza el contenido de un post
    const updatePost = async (postData) => {
        try {
            const data = await apiFetch(`/api/posts/${postId}`, {
                method: 'PUT',
                token,
                body: postData
            });
            setPost(data);
            return { success: true, data };
        } catch (err) {
            return { success: false, error: err };
        }
    };

    // Elimina el post
    const deletePost = async () => {
        try {
            await apiFetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                token
            });
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    };

    const refreshPost = () => {
        return fetchPost();
    };

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    return {
        post,
        loading,
        error,
        refreshPost,
        updatePost,
        deletePost
    };
}