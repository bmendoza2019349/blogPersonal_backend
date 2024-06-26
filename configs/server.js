import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/user.routes.js'
import publicRoutes from '../src/publications/publication.routes.js'

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/blogSystem/v1/auth'
        this.userPath = '/blogSystem/v1/user'
        this.publicPath = '/blogSystem/v1/public'
        this.conectarDB(); 
        this.middlewares();
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    
    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    };

   
    routes() {  
        this.app.use(this.authPath, authRoutes);      
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.publicPath, publicRoutes)
    };

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;