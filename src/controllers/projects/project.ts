import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../../db/connection';

import { ProjectModelInterface } from '../../interfaces/projects/projectModel.interface';
import { respond } from '../../helpers/respond';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const results: Array<ProjectModelInterface> = await sequelize.query(
      'SELECT *  FROM proyecto;',
      { type: QueryTypes.SELECT }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results: Array<ProjectModelInterface> = await sequelize.query(
      'SELECT * FROM proyecto where id= :id;',
      { replacements: { id: id }, type: QueryTypes.SELECT }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (!results[0]) {
      return res
        .status(200)
        .json(respond('0', `No hay ningún proyecto con el id: ${id}`, results));
    } else {
      return res.status(200).json(respond('1', 'OK', results[0]));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const createProject = async (
  req: Request<never, never, ProjectModelInterface, never, never>,
  res: Response
) => {
  const { body } = req;

  try {
    const results = await sequelize.query(
      'INSERT INTO proyecto (titulo, estado, descripcion, fecha_inicio, visibilidad, ciudad, metodologia , justificacion, tipo_proyecto) values(:titulo, :estado, :descripcion, :fecha_inicio, 1, :ciudad, :metodologia, :justificacion, :tipo_proyecto);',
      {
        replacements: {
          titulo: body.titulo,
          estado: body.estado,
          descripcion: body.descripcion,
          fecha_inicio: body.fecha_inicio,
          ciudad: body.ciudad,
          metodologia: body.metodologia,
          justificacion: body.justificacion,
          tipo_proyecto: body.tipo_proyecto,
        },
        type: QueryTypes.INSERT,
      }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const updateProject = async (
  req: Request<never, never, ProjectModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const results = await sequelize.query(
      'UPDATE proyecto SET titulo = :titulo, estado = :estado, descripcion = :descripcion, visibilidad = :visibilidad, ciudad = :ciudad, metodologia = :metodologia, justificacion = :justificacion, tipo_proyecto = :tipo_proyecto WHERE id = :id;',
      {
        replacements: {
          id: id,
          titulo: body.titulo,
          estado: body.estado,
          descripcion: body.descripcion,
          visibilidad: body.visibilidad,
          ciudad: body.ciudad,
          metodologia: body.metodologia,
          justificacion: body.justificacion,
          tipo_proyecto: body.tipo_proyecto,
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

export const deleteProject = async (
  req: Request<never, never, ProjectModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;

  const { body } = req;

  try {
    const results = await sequelize.query(
      'UPDATE proyecto SET visibilidad = 0 WHERE id = :id;',
      {
        replacements: {
          id: id,
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

export const approveProject = async (
  req: Request<never, never, ProjectModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const results = await sequelize.query(
      'UPDATE proyecto SET fecha_fin = :fecha_fin, conclusiones = :conclusiones WHERE id = :id;',
      {
        replacements: {
          id: id,
          fecha_fin: body.fecha_fin,
          conclusiones: body.conclusiones,
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

export const createProjectType = () => {};
