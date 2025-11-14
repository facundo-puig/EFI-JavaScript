import { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

export default function CommentForm({ onSubmit, isAuthenticated, submitting }) {
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(text);
        // Limpia el formulario solo si el comentario se publicó correctamente
        if (success) {
            setText('');
        }
    };

    // Muestra un mensaje si el usuario no está autenticado
    if (!isAuthenticated) {
        return (
            <div className="login-prompt">
                <i className="pi pi-lock"></i>
                Inicia sesión para dejar un comentario
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <div className="comment-input">
                <InputTextarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    placeholder="Escribe tu comentario..."
                    autoResize
                />
            </div>
            <Button
                type="submit"
                label={submitting ? 'Publicando...' : 'Publicar Comentario'}
                icon="pi pi-send"
                disabled={submitting}
            />
        </form>
    );
}