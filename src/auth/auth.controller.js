import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      //verificar si el email existe:
      const user = await User.findOne({ email });
  
      if(user && (await bcryptjs.compare(password, user.password))){
        const token = await generarJWT(user.id, user.email, user.role)
  
        res.status(200).json({
          msg: "Login Ok!!!",
          userDetails: {
            username: user.username,
            token: token
          },
        });
      }
  
      if (!user) {
        return res
          .status(400)
          .send(`Wrong credentials, ${email} doesn't exists en database`);
      }
  
      // verificar la contraseña
      const validPassword = bcryptjs.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).send("wrong password");
      }
     
    } catch (e) {
      res.status(500).send("Comuniquese con el administrador");
    }
  };