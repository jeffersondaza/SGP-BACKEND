import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../../db/connection';
import {
  LoginRequestInterface,
  UserModelInterface,
} from '../../interfaces/users/userModel.interface';
import { respond } from '../../helpers/respond';
import { comparePassword, encryptPassword } from '../../helpers/manageAccess';
import jwt from 'jsonwebtoken';
import { RolesEnum } from '../../enums/users/roles.enum';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const results: Array<UserModelInterface> = await sequelize.query(
      'SELECT cedula, cod_universitario, correo_est, nombres, apellidos, telefono, visibilidad, semillero_id, programa_id FROM usuario;',
      { type: QueryTypes.SELECT }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results: Array<UserModelInterface> = await sequelize.query(
      'SELECT cedula, cod_universitario, correo_est, nombres, apellidos, telefono, visibilidad, semillero_id, programa_id FROM usuario where cedula= :cedula;',
      { replacements: { cedula: id }, type: QueryTypes.SELECT }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (!results[0]) {
      return res
        .status(200)
        .json(respond('0', `No hay ningún usuario con el id: ${id}`, results));
    } else {
      return res.status(200).json(respond('1', 'OK', results[0]));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const createUser = async (
  req: Request<never, never, UserModelInterface, never, never>,
  res: Response
) => {
  const { body } = req;

  try {
    const password = await encryptPassword(body.contrasena);
      const results = await sequelize.query(
        'INSERT INTO usuario (cedula, cod_universitario, correo_est, contrasena, nombres, apellidos, telefono , visibilidad, correo_personal) values(:cedula, :cod_universitario, :correo_est, :password, :nombres, :apellidos, :telefono, :visibilidad, :correo_personal);',
        {
          replacements: {
            cedula: body.cedula,
            cod_universitario: body.cod_universitario,
            correo_est: body.correo_est,
            password: password,
            nombres: body.nombres,
            apellidos: body.apellidos,
            telefono: body.telefono,
            visibilidad: true,
            correo_personal: body.correo_personal,
          },
          type: QueryTypes.INSERT,
        }
      );

      const result = await sequelize.query(
        'INSERT INTO usuarios (usuario, tipo_usuario) values(:cedula, :tipo_usuario);',
        {
          replacements: {
            cedula: body.cedula,
            tipo_usuario: RolesEnum.Student
          },
          type: QueryTypes.INSERT,
        }
      );

      if(!result){
        res.status(400).json(respond('0', 'Error', results));
      }
        

      return results
        ? res.status(200).json(respond('1', 'OK', results))
        : res.status(400).json(respond('0', 'Error', results));
  } catch (error: any) {
      return res.status(500).json(respond('0', 'Error', { error: error?.name } ?? error));
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const results = await sequelize.query(
      `UPDATE usuario SET nombres= '${body.nombres}', apellidos='${body.apellidos}', telefono= ${body.telefono}, visibilidad='${body.visibilidad}', correo_personal='${body.correo_personal}' WHERE cedula = '${id}';`,
      { type: QueryTypes.UPDATE }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (results[1] === 0) {
      return res
        .status(203)
        .json(
          respond(
            '0',
            `No hay ningún usuario con el id: ${id} o los datos son los mismos`,
            results[0]
          )
        );
    } else {
      return res.status(200).json(respond('1', 'OK', results));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results = await sequelize.query(
      'DELETE FROM usuario WHERE cedula = :cedula',
      { replacements: { cedula: id }, type: QueryTypes.DELETE }
    );

    return res
      .status(200)
      .json(
        respond(
          '1',
          `No hay ningún usuario con el id: ${id} o los datos son los mismos`,
          results
        )
      );
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const login = async (
  req: Request<never, never, LoginRequestInterface, never, never>,
  res: Response
) => {
  const { body } = req;

  try {
    const [result]: Array<UserModelInterface> = await sequelize.query(
      'SELECT * FROM usuario JOIN usuarios ON usuario.cedula = usuarios.usuario JOIN tipo_usuario ON usuarios.tipo_usuario = tipo_usuario.nombre WHERE usuario.correo_est = :correo_est',
      {
        replacements: {
          correo_est: body.institutionalEmail,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (!result) {
      return res.status(400).json(respond('0', 'Error', result));
    } else {
      const matchPassword = await comparePassword(
        body.password,
        result.contrasena
      );

      if (!matchPassword)
        return res
          .status(203)
          .json(respond('0', 'Correo o contraseña incorrectos', {}));

      const token = jwt.sign({ id: result.cedula }, process.env.SECRET!, {
        expiresIn: 7200,
      });

      if(result.visibilidad === 0)
        return res
        .status(203)
        .json(respond('0', 'Acceso denegado', {}));

      const { contrasena, nombre, tipo_usuario, descripcion, ...finalResponse } = result;  

      return res
        .status(200)
        .json(respond('1', 'Operación exitosa!', { ...finalResponse, role: tipo_usuario, token }));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const result: Array<any> = await sequelize.query(
      'SELECT * FROM tipo_usuario',
      {
        type: QueryTypes.SELECT,
      }
    );

    return result
      ? res.status(200).json(respond('1', 'OK', result))
      : res.status(400).json(respond('0', 'Error', result));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getRol = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result: Array<any> = await sequelize.query(
      'SELECT * FROM usuarios WHERE usuario = :usuario',
      {
        replacements: {
          usuario: id,
        },
        type: QueryTypes.SELECT,
      }
    );

    if (!result) {
      res.status(400).json(respond('0', 'Error', result));
    } else if (!result[0]) {
      return res
        .status(203)
        .json(respond('0', `No hay ningún usuario con el id: ${id}`, result));
    } else {
      return res.status(200).json(respond('1', 'OK', {'rol': result[0].tipo_usuario}));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const updateUserRol = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const result = await sequelize.query(
      'UPDATE usuarios SET tipo_usuario = :tipo_usuario WHERE usuario =usuario;',
      {
        replacements: {
          usuario: id,
          tipo_usuario: body.tipo_usuario,
        },
        type: QueryTypes.UPDATE,
      }
    );

    if (!result) {
      return res.status(400).json(respond('0', 'Error', result));
    } else if (result[1] === 0) {
      return res
        .status(203)
        .json(
          respond(
            '0',
            `No hay ningún usuario con el id: ${id} o el suario ya tiene el mismo rol`,
            result[0]
          )
        );
    } else {
      return res.status(200).json(respond('1', 'OK', result));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const password = await encryptPassword(body.contrasena);
    const result = await sequelize.query(
      'UPDATE usuario SET contrasena = :contrasena WHERE cedula = :cedula;',
      {
        replacements: {
          cedula: id,
          contrasena: password,
        },
        type: QueryTypes.UPDATE,
      }
    );

    if (!result) {
      return res.status(400).json(respond('0', 'Error', result));
    } else if (result[1] === 0) {
      return res
        .status(203)
        .json(
          respond('0', `No hay ningún usuario con el id: ${id}`, result[0])
        );
    } else {
      return res.status(200).json(respond('1', 'OK', result));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const validateSession = (req:Request, res:Response)=>{

  const { body } = req;

  return res.status(200).json(respond('1', 'OK', body.token));
}