import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js';

export const register = async (req, res) => {
    try {
        const { email, username, age, sex, birthdate, password,  phone, role } = req.body;

        const user = new User({ email, username, age, sex, birthdate, password,  phone, role });

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();

        res.status(200).json({
            msg: "The user was added successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(409).json({
            error: error.message,
            msg: "Contact the administrator",
        });
    }
};

export const updateUser = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, email, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    // Actualiza el usuario en la base de datos
    await User.findByIdAndUpdate(id, rest);

    // Obtiene el usuario actualizado
    const user = await User.findOne({ _id: id });

    res.status(200).json({
        msg: 'User update successfully',
        user,
    });
}


export const userDelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Desactiva el usuario en lugar de borrarlo permanentemente
        const user = await User.findByIdAndUpdate(id, { estado: false });

        res.status(200).json({ msg: 'The user desactived susccessfully', user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Contacta al ADMINISTRATOR' });
    }
};