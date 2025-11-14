export default function PostCard({ post, onViewDetails }) {
    return (
        <div className="post-card" onClick={() => onViewDetails(post.id)}>
            <h2>{post.title}</h2>
            
            <div className="post-content">
                {post.content}
            </div>

            {/* Información del autor y fecha de publicación */}
            <div className="post-footer">
                <div className="post-author">
                    <i className="pi pi-user"></i>
                    <span>{post.author?.name || 'Autor desconocido'}</span>
                </div>
                <div className="post-date">
                    <i className="pi pi-calendar"></i>
                    <span>
                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}