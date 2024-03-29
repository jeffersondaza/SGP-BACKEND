import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../../db/connection';
import fs from 'fs';
import FormData from 'form-data';

import {
  CommentModelInterface,
  ProductModelInterface,
  ProjectModelInterface,
} from '../../interfaces/projects/projectModel.interface';
import { respond } from '../../helpers/respond';
import { RepositoryFactory } from '../../repositories/repositoryFactory';
import { ParticipantModelInterface } from '../../interfaces/participants/participant';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const results: Array<ProjectModelInterface> = await sequelize.query(
      'SELECT *  FROM proyecto;',
      { type: QueryTypes.SELECT }
    );

    const projects = results.map(async (project) => {
      const query = await sequelize.query(
        'SELECT participantes.usuario, participantes.rol FROM proyecto inner join participantes ON participantes.proyecto = proyecto.id AND proyecto.id = :id;',
        { replacements: { id: project.id }, type: QueryTypes.SELECT }
      );

      const objetoCombinado = { ...project, participants: [...query] };

      return objetoCombinado;
    });
    const projectsResults = await Promise.all(projects);

    return results
      ? res.status(200).json(respond('1', 'OK', projectsResults))
      : res.status(400).json(respond('0', 'Error', projectsResults));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results: Array<ProjectModelInterface> = await sequelize.query(
      'SELECT proyecto.*, programa.nombre as programa FROM proyecto inner join programa ON programa.id = proyecto.programa_id AND proyecto.id = :id;',
      { replacements: { id: id }, type: QueryTypes.SELECT }
    );

    const resultsParticipants: Array<ParticipantModelInterface> =
      await sequelize.query(
        'SELECT participantes.usuario, participantes.rol FROM proyecto inner join participantes ON participantes.proyecto = proyecto.id AND proyecto.id = :id;',
        { replacements: { id: id }, type: QueryTypes.SELECT }
      );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (!results[0]) {
      return res
        .status(200)
        .json(respond('0', `No hay ningún proyecto con el id: ${id}`, results));
    } else {
      const objetoCombinado = {
        ...results[0],
        participants: [...resultsParticipants],
      };
      return res.status(200).json(respond('1', 'OK', objetoCombinado));
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
  const now = new Date();
  try {
    const results = await sequelize.query(
      'INSERT INTO proyecto (titulo, estado, descripcion, fecha_inicio, visibilidad, ciudad, metodologia , justificacion, tipo_proyecto, programa_id) values(:titulo, "PROPUESTA", :descripcion, :fecha_inicio, 1, :ciudad, :metodologia, :justificacion, :tipo_proyecto, :programa_id);',
      {
        replacements: {
          titulo: body.titulo,
          descripcion: body.descripcion,
          fecha_inicio: now,
          ciudad: body.ciudad,
          metodologia: body.metodologia,
          justificacion: body.justificacion,
          tipo_proyecto: body.tipo_proyecto,
          programa_id: body.programa_id,
        },
        type: QueryTypes.INSERT,
      }
    );

    if(results[0]){
      const resultInsertParticipant = await sequelize.query(
        'INSERT INTO participantes (usuario, proyecto, fecha_inicio, rol) values(:usuario, :proyecto, :fecha_inicio, :rol);',
        {
          replacements: {
            usuario: body.usuario,
            proyecto: results[0],
            fecha_inicio: now,
            rol: 'DOCENTE INVESTIGADOR',
          },
          type: QueryTypes.INSERT,
        }
      );
    }
    
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
    const project: Array<ProjectModelInterface> = await sequelize.query(
      'SELECT * FROM proyecto WHERE id = :id;',
      { replacements: { id: id }, type: QueryTypes.SELECT }
    );

    const results = await sequelize.query(
      'UPDATE proyecto SET titulo = :titulo, estado = :estado, descripcion = :descripcion, ciudad = :ciudad, metodologia = :metodologia, justificacion = :justificacion, tipo_proyecto = :tipo_proyecto, fecha_inicio = :fecha_inicio, fecha_fin = :fecha_fin WHERE id = :id;',
      {
        replacements: {
          id: id,
          titulo: body.titulo ?? project[0].titulo,
          estado: body.estado ?? project[0].estado,
          descripcion: body.descripcion ?? project[0].descripcion,
          ciudad: body.ciudad ?? project[0].ciudad,
          metodologia: body.metodologia ?? project[0].metodologia,
          justificacion: body.justificacion ?? project[0].justificacion,
          tipo_proyecto: body.tipo_proyecto ?? project[0].tipo_proyecto,
          fecha_inicio: body.fecha_inicio ?? project[0].fecha_inicio,
          fecha_fin: body.fecha_fin ?? project[0].fecha_fin,
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
            'Los datos son los mismos o no existe el proyecto',
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
  const now = new Date();
  try {
    const results = await sequelize.query(
      'UPDATE proyecto SET fecha_fin = :fecha_fin, retroalimentacion_final = :retroalimentacion_final, conclusiones = :conclusiones, nota = :nota WHERE id = :id;',
      {
        replacements: {
          id: id,
          fecha_fin: now,
          retroalimentacion_final: body.retroalimentacion_final,
          conclusiones: body.conclusiones,
          nota: body.nota,
        },
        type: QueryTypes.UPDATE,
      }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (results[1] === 0) {
      return res
        .status(203)
        .json(respond('0', 'Los datos son los mismos', results[0]));
    } else {
      return res.status(200).json(respond('1', 'OK', results));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const createProduct = async (
  req: Request<never, never, ProductModelInterface, never, never>,
  res: Response
) => {
  const { body } = req;
  const { file } = req;
  const { id } = req.params;

  try {
    if (file) {
      const now = new Date();

      const results = await sequelize.query(
        'INSERT INTO producto (titulo_producto, tipo_producto, url_repo, fecha, proyecto) values(:titulo_producto, :tipo_producto, :url_repo, :fecha, :proyecto);',
        {
          replacements: {
            titulo_producto: body.titulo_producto,
            tipo_producto: body.tipo_producto,
            url_repo: `${process.env.SERVERURL}:${process.env.PORT}/${file?.path}`,
            fecha: now,
            proyecto: id,
          },
          type: QueryTypes.INSERT,
        }
      );

      return results
        ? res.status(200).json(respond('1', 'OK', results))
        : res.status(400).json(respond('0', 'Error', results));
    } else {
      const now = new Date();

      const results = await sequelize.query(
        'INSERT INTO producto (titulo_producto, tipo_producto, url_repo, fecha, proyecto) values(:titulo_producto, :tipo_producto, :url_repo, :fecha, :proyecto);',
        {
          replacements: {
            titulo_producto: body.titulo_producto,
            tipo_producto: body.url_repo,
            url_repo: body.url_repo,
            fecha: now,
            proyecto: id,
          },
          type: QueryTypes.INSERT,
        }
      );

      return results
        ? res.status(200).json(respond('1', 'OK', results))
        : res.status(400).json(respond('0', 'Error', results));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const updateProduct = async (
  req: Request<never, never, ProductModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;
  const { body } = req;
  const { file } = req;

  try {
    const now = new Date();

    const results = await sequelize.query(
      'UPDATE producto SET titulo_producto = :titulo_producto, tipo_producto = :tipo_producto, url_repo = :url_repo, fecha = :fecha WHERE id = :id;',
      {
        replacements: {
          id: id,
          titulo_producto: body.titulo_producto,
          tipo_producto: body.titulo_producto,
          url_repo: file?.path,
          fecha: now,
        },
        type: QueryTypes.UPDATE,
      }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (results[0] === 0) {
      return res
        .status(203)
        .json(
          respond(
            '0',
            'Los datos son los mismos o no existe el producto',
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

export const createComment = async (
  req: Request<never, never, CommentModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;
  const { body } = req;

  try {
    if (body.calificacion) {
      const now = new Date();
      const results = await sequelize.query(
        'INSERT INTO comentario (comentario, fase, nivel, fecha, producto_id, calificacion, usuario_id) values(:comentario, :fase, :nivel, :fecha, :producto_id, :calificacion, :usuario_id);',
        {
          replacements: {
            comentario: body.comentario,
            calificacion: body.calificacion,
            fase: '1',
            nivel: 'DOCENTE INVESTIGADOR',
            fecha: now,
            producto_id: id,
            usuario_id: body.usuario_id,
          },
          type: QueryTypes.INSERT,
        }
      );
      return results
        ? res.status(200).json(respond('1', 'OK', results))
        : res.status(400).json(respond('0', 'Error', results));
    } else {
      const now = new Date();

      const results = await sequelize.query(
        'INSERT INTO comentario (comentario, fase, nivel, fecha, producto_id, usuario_id) values(:comentario, :fase, :nivel, :fecha, :producto_id, :usuario_id);',
        {
          replacements: {
            comentario: body.comentario,
            fase: '1',
            nivel: 'DOCENTE INVESTIGADOR',
            fecha: now,
            producto_id: id,
            usuario_id: body.usuario_id,
          },
          type: QueryTypes.INSERT,
        }
      );

      return results
        ? res.status(200).json(respond('1', 'OK', results))
        : res.status(400).json(respond('0', 'Error', results));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const updateComment = async (
  req: Request<never, never, CommentModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const results = await sequelize.query(
      'UPDATE comentario SET comentario = :comentario, fase = :fase, nivel = :nivel, fecha = :fecha, producto_id = :producto_id WHERE id = :id;',
      {
        replacements: {
          id: id,
          comentario: body.comentario,
          fase: body.fase,
          nivel: body.nivel,
          fecha: body.fecha,
          producto_id: body.producto_id,
        },
        type: QueryTypes.UPDATE,
      }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (results[1] === 0) {
      return res
        .status(203)
        .json(respond('0', 'Los datos son los mismos', results[0]));
    } else {
      return res.status(200).json(respond('1', 'OK', results));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getProjectType = async (req: Request, res: Response) => {
  try {
    const results: Array<ProjectModelInterface> = await sequelize.query(
      'SELECT *  FROM tipo_proyecto;',
      { type: QueryTypes.SELECT }
    );
    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getMyProjects = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results: Array<ProjectModelInterface> = await sequelize.query(
      'SELECT id, titulo, estado, descripcion, macro_proyecto, proyecto.fecha_inicio, proyecto.fecha_fin, semillero, retroalimentacion_final, visibilidad, ciudad, metodologia, conclusiones, justificacion, nota, tipo_proyecto FROM proyecto JOIN participantes ON proyecto.id = participantes.proyecto WHERE participantes.usuario = :id;',
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

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    const { usuario } = req.body;

    const formData = new FormData();
    if (file && file.path) {
      const fileData = fs.readFileSync(file?.path);
      formData.append('file', fileData, { filename: file.originalname });
      formData.append('usuario', usuario);
    }

    return res.status(201).json(respond('1', 'OK', ''));
  } catch (error: any) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results: Array<ProductModelInterface> = await sequelize.query(
      'SELECT * FROM producto where id= :id;',
      { replacements: { id: id }, type: QueryTypes.SELECT }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (!results[0]) {
      return res
        .status(200)
        .json(respond('0', `No hay ningún proyecto con el id: ${id}`, results));
    } else {
      const filePath = results[0].url_repo;
      console.log(results[0].url_repo);
      const fileData = fs.readFileSync(filePath);
      return res.status(200).json(respond('1', 'OK', fileData));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const activateProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results = await sequelize.query(
      'UPDATE proyecto SET visibilidad = 1 WHERE id = :id',
      { replacements: { id: id }, type: QueryTypes.UPDATE }
    );

    if (!results) {
      return res.status(400).json(respond('0', 'Error', results));
    } else if (results[1] === 0) {
      return res
        .status(203)
        .json(respond('0', 'Los datos son los mismos', results[0]));
    } else {
      return res.status(200).json(respond('1', 'OK', results));
    }
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const results: Array<ProductModelInterface> = await sequelize.query(
      'SELECT *  FROM producto WHERE proyecto=:id;',
      { replacements: { id: id }, type: QueryTypes.SELECT }
    );

    const products = results.map(async (product) => {
      const query = await sequelize.query(
        'SELECT comentario.*, usuario.nombres, usuario.apellidos FROM comentario inner join usuario ON comentario.usuario_id = usuario.cedula AND producto_id = :id;',
        { replacements: { id: product.id }, type: QueryTypes.SELECT }
      );
  
      const mixedObject = { ...product, comentarios: [...query] };
  
      return mixedObject;
    });

    const productsResults = await Promise.all(products);
    return results
      ? res.status(200).json(respond('1', 'OK', productsResults))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const deleteProduct = async (
  req: Request<never, never, ProductModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const results = await sequelize.query(
      'DELETE FROM producto WHERE id = :id;',
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

export const deleteComment = async (
  req: Request<never, never, ProductModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const results = await sequelize.query(
      'DELETE FROM comentario WHERE id = :id;',
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

export const getComments = async (
  req: Request<never, never, CommentModelInterface, never, never>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const results: Array<ProjectModelInterface> = await sequelize.query(
      'SELECT comentario.*, usuario.nombres, usuario.apellidos FROM comentario inner join usuario ON comentario.usuario_id = usuario.cedula AND producto_id = :id;',
      {
        replacements: {
          id: id,
        },
        type: QueryTypes.SELECT,
      }
    );

    return results
      ? res.status(200).json(respond('1', 'OK', results))
      : res.status(400).json(respond('0', 'Error', results));
  } catch (error) {
    return res.status(500).json(respond('0', 'Error', error));
  }
};

export const createProjectType = () => {};
