import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../../db/connection';

import { respond } from '../../helpers/respond';
import { ParticipantModelInterface } from '../../interfaces/participants/participant';

export const assignRolInProject = async (
  req: Request<never, never, ParticipantModelInterface, never, never>,
  res: Response
) => {
  
  const { body } = req;
  const now = new Date();

  try {
    const results = await sequelize.query(
      'INSERT INTO participantes (usuario, proyecto, fecha_inicio, rol) values(:usuario, :proyecto, :fecha_inicio, :rol);',
      {
        replacements: {
            usuario: body.usuario,
            proyecto: body.proyecto,
            fecha_inicio: now,
            rol: body.rol
        },
        type: QueryTypes.INSERT,
      }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error:any) {
    return res
      .status(500)
      .json(respond('0', 'Error', { error: error?.name } ?? error));
  }
};
