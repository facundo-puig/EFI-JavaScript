import { confirmDialog } from 'primereact/confirmdialog';

// Muestra un diálogo de confirmación para eliminar
export function confirmDelete({ message, onAccept, header = 'Confirmación' }) {
    confirmDialog({
        message,
        header,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí, eliminar',
        rejectLabel: 'Cancelar',
        accept: onAccept
    });
}

// Confirmación para eliminar un post
export function confirmDeletePost(onAccept) {
    confirmDelete({
        message: '¿Estás seguro de eliminar este post?',
        onAccept
    });
}

// Confirmación para eliminar un comentario
export function confirmDeleteComment(onAccept) {
    confirmDelete({
        message: '¿Estás seguro de eliminar este comentario?',
        onAccept
    });
}