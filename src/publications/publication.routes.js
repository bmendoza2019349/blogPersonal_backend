import { Router } from "express";
import { check } from "express-validator";
import {
    addPublication,
    getPublication,
    publicationDelete,
    updatePublication,
    addComment,
    editComment, 
    deleteComment,
    listComments,
    getPublicById,
    getPublicacionSetting
} from "./publication.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get('/:id/updatePu', getPublicacionSetting)
router.post(
    "/",
    [
        validarJWT,
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatorio').not().isEmpty(),
        validarCampos
    ], addPublication);

router.put(
    "/:id/updatePu",
    [
        validarJWT,
        check("id", "Id no valido").isMongoId(),
        validarCampos,
    ],
    updatePublication
);

router.get(
    "/",
    [
    ], getPublication
);


router.delete(
    "/:id/pubDelete",
    [
        validarJWT,
        check('id', 'El id es obligatorio').not().isEmpty(),
        validarCampos,
    ], publicationDelete);

router.post(
    "/:id/comments",
    [
        validarJWT, // Verificar token JWT para autenticación
        check('texto', 'El texto del comentario es obligatorio').not().isEmpty(),
        validarCampos // Validar campos
    ],
    addComment
);

// Editar comentario en una publicación
router.put(
    "/pub/:id/comupdate/:commentId",
    [
        validarJWT, // Verificar token JWT para autenticación
        check('texto', 'El texto del comentario es obligatorio').not().isEmpty(),
        validarCampos // Validar campos
    ],
    editComment
);

// Eliminar comentario de una publicación
router.delete(
    "/:id/comments/:commentId",
    [
        validarJWT // Verificar token JWT para autenticación
    ],
    deleteComment
);

router.get(
    "/public/:id",
    [],
    listComments
);

router.get(
    "/:id",
    [check('id', 'El id es obligatorio').not().isEmpty(),],
    getPublicById
)

export default router;