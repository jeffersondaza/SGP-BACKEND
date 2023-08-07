import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../../db/connection';

import { respond } from '../../helpers/respond';
import { ProgramModelInterface } from '../../interfaces/programs/programModel.interface';

export const getPrograms = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const results: Array<ProgramModelInterface> = await sequelize.query(
      'SELECT *  FROM programa;',
      { type: QueryTypes.SELECT }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};