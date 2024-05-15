import { Router } from "express";
import { check } from "express-validator";
import { register, updateUser, userDelete} from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
  "/register",
  [
    check("email", "Este no es un correo válido").isEmail(),
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 4 caracteres").isLength({min: 4,}),
    validarCampos,
  ],
  register
);

// Ruta para actualizar un usuario por su ID
router.put(
  "/updateuser/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  updateUser
);

// Ruta para eliminar un usuario por su ID
router.delete(
  "/deleteuser/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  userDelete
);

export default router;