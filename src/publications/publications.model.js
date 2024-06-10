import mongoose from "mongoose";

const ComentarioSchema = mongoose.Schema({
    usuario: {
        type: String, // Podría ser ObjectId si quieres referenciar el usuario en la base de datos
        required: true
    },
    fechaHora: {
        type: String,
    },
    texto: {
        type: String,
        required: true
    }
});

const PublicationSchema = mongoose.Schema({
    titulo: {
        type: String
    },
    descripcion: {
        type: String
    },
    img: {
        type: String
    },
    materia: {
        type: String
    },
    fechaPublicacion: {
        type: String
    },
    autor: {
        type: String
    },
    github: {
        type: String
    },
    comentarios: [ComentarioSchema], // Cambiado para que los comentarios sean objetos con las propiedades adecuadas
    state: {
        type: Boolean,
        default: true,
    }
});

export default mongoose.model('Publication', PublicationSchema);