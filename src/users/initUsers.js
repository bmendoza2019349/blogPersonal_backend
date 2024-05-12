import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Importar el modelo de usuario
import UserModel from './user.model.js';

async function connectToMongo() {
    try {
        await mongoose.connect(process.env.URI_MONGO || 'mongodb://localhost:27017/MyBlog', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado exitosamente.');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1); // Termina la aplicación si no se puede conectar a MongoDB
    }
}

async function addUser(user) {
    try {
        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(user.password, salt);

            await UserModel.create({
                email: user.email,
                username: user.username,
                age: user.age,
                sex: user.sex,
                birthdate: user.birthdate,
                password: hashedPassword,
                phone: user.phone,
                role: user.role,
                img: user.img,
                state: user.state,
            });

            console.log(`Added user: ${user.email}`);
        } else {
            console.log(`exists user: ${user.email}`);
        }
    } catch (error) {
        console.error(`Error adding user with email ${user.email}:`, error.message);
    }
}

async function addUsers() {
    await connectToMongo();

    const usersToInsert = [
        {
            email: "stev@kinal.edu",
            username: "S_peres",
            age: "18",
            sex: "MALE",
            birthdate: "2006-03-19",
            password: "123456",
            phone: "17283946",
            role: "ADMINISTRADOR",
            state: "true",
        },

    ];

    for (const user of usersToInsert) {
        await addUser(user);
    }
}

export default addUsers;