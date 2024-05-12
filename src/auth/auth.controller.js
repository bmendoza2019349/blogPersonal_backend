import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const login = async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Verificar si es email o  name, y si  existe
        const isEmail = usuario.includes('@');

        let user;

        if (isEmail) {
            user = await User.findOne({ email: usuario });
        } else {
            user = await User.findOne({username: usuario})
        }


        if (!user) {
            return res.status(400).json({
                msg: "Incorrect credentials, email does not exist in the database.",
            });
        }

        // Verificar si el usuario está activo
        if (!user.state) {
            return res.status(400).json({
                msg: "The user is not active in the database.",
            });
        }

        // Verificar la contraseña de manera segura utilizando bcrypt
        const validPassword = await bcryptjs.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: "Password is incorrect.",
            });
        }

        // Generar el JWT de forma segura
        const token = await generarJWT(user.id);


        res.status(200).json({
            msg: `Welcome ${user.role} ${user.name}`,
            token,
        });
    } catch (error) {
        res.status(500).send("Comuniquese con el administrador");
    }
}