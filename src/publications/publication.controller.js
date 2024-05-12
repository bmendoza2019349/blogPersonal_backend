import { response, request } from "express";
import Publication from "./publications.model.js";

export const addPublication = async (req, res) => {
    try {
        const { titulo, contenido, fechaPublicacion, descripcion, img } = req.body;

        // Verificar el rol del usuario
        if (req.user.role !== 'ADMINISTRADOR') {
            return res.status(403).json({
                error: 'Forbidden',
                msg: 'Only administrators can create publications'
            });
        }

        const { uid } = req.user;

        const publication = new Publication({ titulo, contenido, fechaPublicacion, autor: uid, descripcion, img });

        await publication.save();

        res.status(200).json({
            msg: "The publication was added successfully",
            publication
        });
    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator",
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const { comentario } = req.body;
        const { publicationId } = req.params;

        const publication = await Publication.findById(publicationId);

        if (!publication) {
            return res.status(404).json({ msg: "Publication not found" });
        }

        publication.comentarios.push(comentario);

        await publication.save();

        res.status(200).json({
            msg: "Comment added successfully",
            publication
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
            msg: "Contact the administrator",
        });
    }
};

export const updatePublication = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    // Actualiza el usuario en la base de datos
    await Publication.findByIdAndUpdate(id, rest);

    // Obtiene el usuario actualizado
    const publication = await Publication.findOne({ _id: id });

    res.status(200).json({
        msg: 'User uodate successfully',
        publication,
    });
}


export const publicationDelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Desactiva el usuario en lugar de borrarlo permanentemente
        const user = await Publication.findByIdAndUpdate(id, { state: false });

        res.status(200).json({ msg: 'The user desactived susccessfully', user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Contacta al ADMINISTRATOR' });
    }
};

export const getPublication = async (req, res) => {
    try {
        const publication = await Publication.find({ activityStatus: { $ne: false } });

        if (!publication || tareas.publication === 0) {
            return res.status(404).json({ msg: "No se encontraron publication" });
        }

        return res.status(200).json({
            msg: "Lista de todas las publication activas",
            publication
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener las publication");
    }
}