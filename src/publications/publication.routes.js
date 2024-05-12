import { Router } from "express";
import { check } from "express-validator";
import { addPublication, getPublication, publicationDelete, updatePublication,  } from "./publication.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCreador } from "../middlewares/validar-publication.js";

const router = Router();

router.post(
    "/agregarPubli",
    [
        validarJWT,
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatorio').not().isEmpty(),
        check('fechaPublicacion', 'La fechaPublicacion es obligatorio').not().isEmpty(),
        validarCampos
    ], addPublication);

    router.put(
        "/editarPubli/:id",
        [
            validarCreador,
            check("id", "Id no valido").isMongoId(),
            validarCampos,
        ], 
        updatePublication
    );

    router.get(
        "/listarPubli",
        [
        ],getPublication
    );
    

    router.delete(
        "/eliminarPubli/:id",
        [
            validarCreador,
            check('id', 'El id es obligatorio').not().isEmpty(),
        ],publicationDelete);

export default router;