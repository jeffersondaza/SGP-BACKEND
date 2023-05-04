import {Request, Response} from 'express';
import {QueryTypes} from 'sequelize';
import Usuario from '../../models/usuario';
import sequelize from "../../db/connection";
import { UserModelInterface } from '../../interfaces/users/userModel.interface';
import { respond } from '../../helpers/respond';

export const getUsuarios = async (req: Request, res:Response)=>{

    // const usuarios = await Usuario.findAll();
    const results: Array<UserModelInterface> = await sequelize.query("SELECT * FROM usuario;",{ type: QueryTypes.SELECT});
    res.status(200).json(respond("1", "OK", results));
}

export const getUsuario = async (req: Request, res:Response)=>{

    const { id } = req.params;

    const usuario = await Usuario.findByPk( id );

    ( usuario ) ? res.json( usuario) : res.status(404).json({msg: 'No hay ningún usuario con el id: '+ id});

}

export const postUsuario = (req: Request, res:Response)=>{

    const { body } = req;

    res.json({
        msg: 'postUsuario',
        body
    })

}

export const putUsuario = (req: Request, res:Response)=>{

    const { id } = req.params;
    const { body } = req;

    res.json({
        msg: 'putUsuario',
        body,
        id
    })

}

export const deleteUsuario = (req: Request, res:Response)=>{

    const { id } = req.params;

    res.json({
        msg: 'deleteUsuario',
        id
    })

}