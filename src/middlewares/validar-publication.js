import Publication from "../publications/publications.model.js";

export const validarCreador = async (req, res, next) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findById(id);

        // Verifica si la publicación existe
        if (!publication) {
            return res.status(404).json({ msg: 'Publicación no encontrada' });
        }

        // Verifica si el usuario actual es el creador de la publicación
        if (publication.autor !== req.usuario.id) {
            return res.status(403).json({ msg: 'No tienes permiso para realizar esta acción' });
        }

        // Si el usuario es el creador de la publicación, pasa al siguiente middleware
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error del servidor' });
    }
};