import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../../db/connection';
import { RoleModelInterface } from '../../interfaces/roles/roleModel.interface';
import { respond } from '../../helpers/respond';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const results: Array<RoleModelInterface> = await sequelize.query(
      'SELECT tipo_usuario.*, permisos.acceso FROM tipo_usuario inner join permisos ON permisos.tipo_usuario_nombre = tipo_usuario.nombre',
      { type: QueryTypes.SELECT }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getRol = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result: Array<any> = await sequelize.query(
      'SELECT tipo_usuario.*, permisos.acceso FROM usuario INNER JOIN usuarios ON usuario.cedula = usuarios.usuario INNER JOIN tipo_usuario ON usuarios.tipo_usuario = tipo_usuario.nombre  INNER JOIN permisos ON tipo_usuario.nombre = permisos.tipo_usuario_nombre WHERE usuario.cedula = :usuario;',
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
      return res.status(200).json(respond('1', 'OK', result[0]));
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
      'UPDATE usuarios SET tipo_usuario = :tipo_usuario WHERE usuario = :usuario;',
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
          respond('0', `El usuario tiene el mismo rol o no existe`, result[0])
        );
    } else {
      return res.status(200).json(respond('1', 'OK', result));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const createRolPermissions = async (
  req: Request<never, never, RoleModelInterface, never, never>,
  res: Response
) => {
  const { body } = req;

  try {
    const resultRol: Array<any> = await sequelize.query(
      'SELECT * FROM tipo_usuario WHERE nombre = :tipo_usuario;',
      {
        replacements: {
          tipo_usuario: body.tipo_usuario,
        },
        type: QueryTypes.SELECT,
      }
    );

    if(resultRol[0]){
      const result: Array<any> = await sequelize.query(
        'SELECT * FROM permisos WHERE tipo_usuario_nombre = :tipo_usuario_nombre;',
        {
          replacements: {
            tipo_usuario_nombre: body.tipo_usuario,
          },
          type: QueryTypes.SELECT,
        }
      );
  
      if (!result[0]) {
        const results = await sequelize.query(
          `INSERT INTO permisos (tipo_usuario_nombre, acceso) VALUES ("${body.tipo_usuario}", '{"USUARIOS": "${body.USUARIOS}", "PROGRAMAS": "${body.PROGRAMAS}", "FACULTADES": "${body.FACULTADES}", "EVENTOS": "${body.EVENTOS}", "PROYECTOS": "${body.PROYECTOS}", "SEMILLEROS": "${body.SEMILLEROS}", "REPORTES": "${body.REPORTES}", "ROLES": "${body.ROLES}"}');`,
          {
            type: QueryTypes.INSERT,
          }
        );
  
        return results
          ? res.status(200).json(respond('1', 'OK', results))
          : res.status(400).json(respond('0', 'Error', results));
      } else if (result[0]) {
        return res
          .status(200)
          .json(respond('1', 'Ya hay unos permisos registrados para este Rol', result));
      } else {
        res.status(400).json(respond('0', 'Error', result));
      }
    }else{
      const resultInsertRol = await sequelize.query(
        'INSERT INTO tipo_usuario (nombre, descripcion) values(:nombre, :descripcion);',
        {
          replacements: {
            nombre: body.tipo_usuario,
            descripcion: body.tipo_usuario,
          },
          type: QueryTypes.INSERT,
        }
      );

      if(resultInsertRol){
        const result: Array<any> = await sequelize.query(
          'SELECT * FROM permisos WHERE tipo_usuario_nombre = :tipo_usuario_nombre;',
          {
            replacements: {
              tipo_usuario_nombre: body.tipo_usuario,
            },
            type: QueryTypes.SELECT,
          }
        );
    
        if (!result[0]) {
          const results = await sequelize.query(
            `INSERT INTO permisos (tipo_usuario_nombre, acceso) VALUES ("${body.tipo_usuario}", '{"USUARIOS": "${body.USUARIOS}", "PROGRAMAS": "${body.PROGRAMAS}", "FACULTADES": "${body.FACULTADES}", "EVENTOS": "${body.EVENTOS}", "PROYECTOS": "${body.PROYECTOS}", "SEMILLEROS": "${body.SEMILLEROS}", "REPORTES": "${body.REPORTES}", "ROLES": "${body.ROLES}"}');`,
            {
              type: QueryTypes.INSERT,
            }
          );
    
          return results
            ? res.status(200).json(respond('1', 'OK', results))
            : res.status(400).json(respond('0', 'Error', results));
        } else if (result[0]) {
          return res
            .status(203)
            .json(respond('0', 'Ya hay unos permisos registrados para este Rol', result));
        } else {
          res.status(400).json(respond('0', 'Error', result));
        }
      }
    }
  } catch (error: any) {
    return res
      .status(500)
      .json(respond('0', 'Error', { error: error.name, msg: 'Revise que el Rol si exista' } ?? error));
  }
};

export const updateRolPermissions = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const result = await sequelize.query(
      'UPDATE permisos SET acceso = :acceso WHERE tipo_usuario_nombre = :tipo_usuario;',
      {
        replacements: {
          tipo_usuario: body.tipo_usuario,
          acceso: body.acceso,
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
            'El tipo de usuario no existe o los datos son los mismos',
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
