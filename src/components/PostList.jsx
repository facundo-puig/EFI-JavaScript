import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Skeleton } from 'primereact/skeleton'
import { toast } from 'react-toastify'
import '../styles/PostList.css'

export default function PostList() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/posts')
            const data = await response.json()
            
            if (response.ok) {
                setPosts(data)
            } else {
                toast.error("Error al cargar los posts")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error al conectar con el servidor")
        } finally {
            setLoading(false)
        }
    }

    const cardFooter = (post) => (
        <div className="post-footer">
            <span className="post-author">
                <i className="pi pi-user"></i> {post.author?.name || 'Anónimo'}
            </span>
            <span className="post-date">
                <i className="pi pi-calendar"></i> {new Date(post.created_at).toLocaleDateString()}
            </span>
        </div>
    )

    if (loading) {
        return (
            <div className="posts-container">
                <h1>Posts</h1>
                <div className="posts-grid">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <Card key={n} className="post-card">
                            <Skeleton width="100%" height="2rem" className="mb-2"></Skeleton>
                            <Skeleton width="100%" height="4rem" className="mb-2"></Skeleton>
                            <Skeleton width="75%" height="1rem"></Skeleton>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="posts-container">
            <div className="posts-header">
                <h1>
                    <i className="pi pi-book"></i> Posts del Blog
                </h1>
                <Button 
                    label="Crear Post" 
                    icon="pi pi-plus" 
                    className="p-button-rounded"
                />
            </div>
            
            <div className="posts-grid">
                {posts.length === 0 ? (
                    <div className="no-posts">
                        <i className="pi pi-inbox" style={{ fontSize: '3rem' }}></i>
                        <p>No hay posts disponibles</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <Card 
                            key={post.id} 
                            title={post.title}
                            footer={cardFooter(post)}
                            className="post-card"
                        >
                            <p className="post-content">{post.content}</p>
                            <div className="post-actions">
                                <Button 
                                    label="Leer más" 
                                    icon="pi pi-arrow-right" 
                                    className="p-button-text"
                                />
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}