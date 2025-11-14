import { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

export default function PostForm({ 
    onSubmit, 
    onCancel,
    initialValues = { title: '', content: '' },
    submitLabel = 'Publicar',
    title = 'Crear nueva publicación',
    showCard = true
}) {
    const [formData, setFormData] = useState(initialValues);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Valida que los campos no estén vacíos
        if (!formData.title.trim() || !formData.content.trim()) {
            return;
        }

        setSubmitting(true);
        const success = await onSubmit(formData);
        
        if (success) {
            // Limpia el formulario solo si fue exitoso y no hay valores iniciales
            if (!initialValues.title && !initialValues.content) {
                setFormData({ title: '', content: '' });
            }
        }
        
        setSubmitting(false);
    };

    const formContent = (
        <>
            {title && <h3>{title}</h3>}
            
            <form onSubmit={handleSubmit}>
                <InputText
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título"
                    className="w-full mb-3"
                />

                <InputTextarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Contenido"
                    rows={4}
                    className="w-full mb-3"
                />

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Botón cancelar */}
                    {onCancel && (
                        <Button
                            type="button"
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-secondary"
                            onClick={onCancel}
                            disabled={submitting}
                        />
                    )}
                    <Button 
                        label={submitting ? 'Guardando...' : submitLabel}
                        icon="pi pi-send" 
                        type="submit"
                        disabled={submitting || !formData.title.trim() || !formData.content.trim()}
                    />
                </div>
            </form>
        </>
    );

    // Renderiza con o sin Card según el prop showCard
    return showCard ? (
        <Card className="mb-4">
            {formContent}
        </Card>
    ) : formContent;
}