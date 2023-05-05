import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserModelInterface } from '../interfaces/users/userModel.interface';
import sequelize from '../db/connection';
import { QueryTypes } from 'sequelize';
import { CustomRequest } from '../interfaces/commons/customRequest.interface';

export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Unathorized Request');
    }

    //Se remueve la cadena Bearer que se usa como estandar cuando se envia el token en la cabecera
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send('Wrong token');
    }

    // if (!token)
    //     return res.status(403).json({ message: 'No token provided' })

    try {
        //decodifico el token enviado
        const decoded: any = jwt.verify(token, process.env.SECRET!);

        //asigno el user _id en el objeto request para que se accesible al resto de funciones de este script
        req.userId = decoded.id;

        //verifico si el _id de usario extraido del token enviado corresponde a un usuario existente en bd y con estado activo
        const [user]: Array<UserModelInterface> = await sequelize.query(
            `SELECT * FROM usuario where cedula= ${req.userId};`,
            { type: QueryTypes.SELECT }
          );

        if (!user)
            return res.status(404).json({ message: 'User not found' })

        console.log('user :' + req.userId);

        next();
        
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
};
