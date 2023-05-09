import express, {Application} from 'express';
import userRoutes from '../routes/users/user';
import projectRoutes from '../routes/projects/project';
import participantRoutes from '../routes/participants/participant';
import cors from 'cors';

import db from '../db/connection';

class Server {

    private app: Application;
    private port: String;
    private apiPaths ={
        usuario: '/api/user',
        project: '/api/project',
        participant: '/api/participant'
    };

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '8000';

        //doc
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection(){
        
        try {
            
            await db.authenticate();
            console.log('Database online');

        } catch (error) {
            console.log(error);
        }
    }

    middlewares(){

        //cors
        this.app.use(cors());

        //lectura del Body
        this.app.use(express.json());

        //carpeta publica
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use( this.apiPaths.usuario, userRoutes);
        this.app.use( this.apiPaths.project, projectRoutes);
        this.app.use( this.apiPaths.participant, participantRoutes);
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log('Servidor corriendo en el puerto! '+ this.port);
        })
    }

}

export default Server;