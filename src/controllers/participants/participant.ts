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
  const { id } = req.params;
  const now = new Date();

  try {
    const results = await sequelize.query(
      'INSERT INTO participantes (usuario, proyecto, fecha_inicio, rol) values(:usuario, :proyecto, :fecha_inicio, :rol);',
      {
        replacements: {
          usuario: body.usuario,
          proyecto: id,
          fecha_inicio: now,
          rol: body.rol,
        },
        type: QueryTypes.INSERT,
      }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error: any) {
    return res
      .status(500)
      .json(respond('0', 'Error', { error: error?.name } ?? error));
  }
};

export const getParticipants = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const results: Array<ParticipantModelInterface> = await sequelize.query(
      'SELECT *  FROM participantes WHERE proyecto = :proyecto;',
      {replacements:{
        proyecto: id
      }, 
      type: QueryTypes.SELECT }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const deleteParticipant = async (
  req: Request<never, never, ParticipantModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const results = await sequelize.query(
      'DELETE FROM participantes WHERE proyecto = :id AND usuario = :usuario;',
      {
        replacements: {
          id: id,
          usuario: body.usuario,
        },
        type: QueryTypes.UPDATE,
      }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (results[1] === 0) {
      return res
        .status(203)
        .json(
          respond(
            '0',
            `No hay ningún proyecto con el id: ${id} o los datos son los mismos`,
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