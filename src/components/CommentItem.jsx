import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';

export default function CommentItem({ 
    comment, 
    canEdit, 
    canDelete, 
    onUpdate, 
    onDelete,
    isLast 
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);

    // Activa el modo de edición
    const handleStartEdit = () => {
        setIsEditing(true);
        setEditText(comment.text);
    };

    // Cancela la edición y restaura el texto original
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(comment.text);
    };

    // Guarda los cambios del comentario
    const handleSaveEdit = async () => {
        const success = await onUpdate(comment.id, editText);
        if (success) {
            setIsEditing(false);
        }
    };

    return (
        <div>
            <div className="comment-item">
                <div className="comment-content">
                    <div className="comment-meta">
                        <div>
                            <strong>{comment.author?.name || 'Usuario'}</strong>
                            <span className="comment-date">
                                {new Date(comment.created_at).toLocaleDateString('es-ES')}
                            </span>
                        </div>
                        {/* Botones de editar y eliminar según permisos */}
                        <div className="comment-buttons">
                            {canEdit && (
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-rounded p-button-text p-button-warning"
                                    onClick={handleStartEdit}
                                    tooltip="Editar comentario"
                                />
                            )}
                            {canDelete && (
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-rounded p-button-text p-button-danger"
                                    onClick={() => onDelete(comment.id)}
                                    tooltip="Eliminar comentario"
                                />
                            )}
                        </div>
                    </div>
                    
                    {/* Muestra el formulario de edición o el texto del comentario */}
                    {isEditing ? (
                        <div className="edit-comment-form">
                            <InputTextarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={3}
                                autoResize
                            />
                            <div className="edit-comment-actions">
                                <Button
                                    label="Guardar"
                                    icon="pi pi-check"
                                    className="p-button-success"
                                    onClick={handleSaveEdit}
                                />
                                <Button
                                    label="Cancelar"
                                    icon="pi pi-times"
                                    className="p-button-secondary"
                                    onClick={handleCancelEdit}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="comment-text">
                            {comment.text}
                        </p>
                    )}
                </div>
            </div>
            {/* Muestra un divisor entre comentarios excepto en el último */}
            {!isLast && <Divider />}
        </div>
    );
}