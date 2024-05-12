import mongoose from "mongoose";

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
    fechaPublicacion: {
        type: String
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comentarios: {
        type: [{
            type: String
        }]
    },
    state: {
        type: Boolean,
        default: true,
    }
})

export default mongoose.model('Publication', PublicationSchema)