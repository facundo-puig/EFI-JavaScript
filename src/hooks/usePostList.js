import { useState, useEffect } from 'react';
import { apiFetch } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export function usePostList() {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carga la lista de todos los posts
    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiFetch('/api/posts');
            setPosts(data);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Crea un nuevo post y recarga la lista
    const createPost = async (postData) => {
        try {
            await apiFetch('/api/posts', {
                method: 'POST',
                token: token,
                body: postData
            });
            await loadPosts();
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return {
        posts,
        loading,
        error,
        createPost,
        refreshPosts: loadPosts
    };
}