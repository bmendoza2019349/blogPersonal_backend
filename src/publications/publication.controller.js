import { response, request } from "express";
import Publication from "./publications.model.js";
import User from "../users/user.model.js";

export const addPublication = async (req, res) => {
    try {
        const { titulo, contenido, descripcion, img, materia } = req.body;

        // Verificar el rol del usuario
        if (req.user.role !== 'ADMINISTRADOR') {
            return res
            .status(403)
            .send(`Solo el administrador puede crear una publicacion`);
            
        }

        const { uid } = req.user;
        // Obtener el email del autor
        const user = await User.findById(uid);
        const autorEmail = user.email;

        // Obtener la fecha y hora actual en formato ISO 8601 sin milisegundos
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const fechaPublicacion = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const publication = new Publication({ titulo, contenido, fechaPublicacion, autor: autorEmail, descripcion, img, materia });

        await publication.save();

        return res
        .status(200)
        .send(`publicacion creada exitosamente`);

    } catch (error) {
        console.log(error);
        return res
        .status(403)
        .send(`contacta al administrador`);
    }

};

// Agregar comentario a una publicación
export const addComment = async (req, res) => {
    try {
        const { texto } = req.body; // Se espera que el cliente envíe el usuario y el texto del comentario en el cuerpo de la solicitud
        const { id } = req.params;
        console.log(id)
        const { uid } = req.user;
        // Obtener el email del autor
        const user = await User.findById(uid);
        const autorEmail = user.username;

        // Buscar la publicación por su ID
        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({ msg: "Publication not found" });
        }

        // Obtener la fecha y hora actual en formato ISO 8601 sin milisegundos
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const fechaHora = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        // Agregar el comentario al array de comentarios de la publicación
        publication.comentarios.push({ usuario: autorEmail, texto, fechaHora });

        // Guardar la publicación actualizada en la base de datos
        await publication.save();

        // Enviar la respuesta con la publicación actualizada
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

// Editar comentario en una publicación
export const editComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const { texto } = req.body;

        const { uid } = req.user;
        // Obtener el email del autor
        const user = await User.findById(uid);
        const autorEmail = user.username;

        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({ msg: "Publication not found" });
        }

        const commentIndex = publication.comentarios.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        // Obtener el ID del usuario creador del comentario
        const commentCreatorId = publication.comentarios[commentIndex].usuario;

        // Verificar si el usuario que intenta editar es el creador del comentario

        if (publication.comentarios[commentIndex].usuario !== autorEmail) {
            return res.status(403).json({ msg: "You can only edit your own comments" });
        }

        // Obtener la fecha y hora actual en formato ISO 8601 sin milisegundos
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const fechaHora = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // Actualizar el texto del comentario y la fecha y hora de modificación
        publication.comentarios[commentIndex].texto = texto;
        publication.comentarios[commentIndex].fechaHora = fechaHora;

        // Guardar la publicación actualizada en la base de datos
        await publication.save();

        // Enviar la respuesta con la publicación actualizada
        res.status(200).json({
            msg: "Comment updated successfully",
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

export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;

        const { uid } = req.user;
        // Obtener el email del autor
        const user = await User.findById(uid);
        const autorEmail = user.username;

        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({ msg: "Publication not found" });
        }

        const commentIndex = publication.comentarios.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        if (publication.comentarios[commentIndex].usuario !== autorEmail) {
            return res.status(403).json({ msg: "You can only delete your own comments" });
        }

        publication.comentarios.splice(commentIndex, 1);

        await publication.save();

        res.status(200).json({
            msg: "Comment deleted successfully",
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

export const listComments = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la publicación por su ID
        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({ msg: "Publication not found" });
        }

        // Obtener la lista de comentarios de la publicación
        const comments = publication.comentarios;

        // Enviar la lista de comentarios como respuesta
        res.status(200).json({
            msg: "List of comments",
            comments
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
    try {
        if (!req.user || !req.user.uid) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const { id } = req.params;
        const { uid } = req.user;

        const user = await User.findById(uid);
        const autorEmail = user.email;

        // Verificar si el usuario autenticado es el creador de la publicación
        const publication = await Publication.findOne({ _id: id, autor: autorEmail });

        if (!publication) {
            return res.status(403).json({ msg: "You are not authorized to update this publication" });
        }

        const { _id, ...rest } = req.body;

        // Actualizar la publicación en la base de datos
        await Publication.findByIdAndUpdate(id, rest);

        // Obtener la publicación actualizada
        const updatedPublication = await Publication.findById(id);

        res.status(200).json({
            msg: 'Publication updated successfully',
            publication: updatedPublication,
        });
    } catch (error) {
        console.error(error); // Registrar el error en la consola
        res.status(500).json({ msg: 'Contact the administrator' });
    }
};


export const publicationDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;
        const user = await User.findById(uid);
        const autorEmail = user.email;
        // Verificar si el usuario autenticado es el creador de la publicación
        const publication = await Publication.findOne({ _id: id, autor: autorEmail });

        if (!publication) {
            return res.status(403).json({ msg: "You are not authorized to delete this publication" });
        }

        // Eliminar los comentarios asociados a la publicación
        await Publication.findByIdAndUpdate(id, { $set: { comentarios: [] } });

        // Desactivar la publicación
        const deletedPublication = await Publication.findByIdAndUpdate(id, { state: false });

        res.status(200).json({ msg: 'The publication and its comments have been successfully deleted', publication: deletedPublication });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Contact the administrator' });
    }
};

export const getPublication = async (req, res) => {
    try {
        const query = { state: true };
        const [total, publication] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
        ]);

        return res.status(200).json({
            msg: "Lista de todas las publication activas",
            publication
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener las publication");
    }
}

export const getPublicById = async (req, res) => {
    const { id } = req.params;
    try {
        const publicacion = await Publication.findOne({ _id: id });

        if (!publicacion) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }

        res.status(200).json({
            publicacion
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la publicación' });
    }
};