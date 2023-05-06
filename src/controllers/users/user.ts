import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../../db/connection";
import { LoginRequestInterface, UserModelInterface } from "../../interfaces/users/userModel.interface";
import { respond } from "../../helpers/respond";
import { comparePassword, encryptPassword } from "../../helpers/manageAccess";
import jwt from 'jsonwebtoken';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const results: Array<UserModelInterface> = await sequelize.query(
      "SELECT * FROM usuario;",
      { type: QueryTypes.SELECT }
    );
    return results
      ? res.status(200).json(respond("1", "OK", results))
      : res.status(400).json(respond("0", "Error", results));
  } catch (error) {
    return res.status(500).json(respond("0", "Error", error));
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results: Array<UserModelInterface> = await sequelize.query(
      `SELECT * FROM usuario where cedula= ${id};`,
      { type: QueryTypes.SELECT }
    );

    if (!results) {
      res.status(400).json(respond("0", "Error", results));
    } else if (!results[0]) {
      res
        .status(200)
        .json(respond("1", `No hay ningún usuario con el id: ${id}`, results));
    } else {
      res.status(200).json(respond("1", "OK", results));
    }
  } catch (error) {
    res.status(500).json(respond("0", "Error", error));
  }
};

export const createUser = async (req: Request<never, never, UserModelInterface, never, never>, res: Response) => {
  const { body } = req;

  if (!body.cedula || !body.telefono) {
    res
      .status(404)
      .json(
        respond(
          "0",
          "Atributos incompletos, por favor verifica los datos",
          body
        )
      );
  } else {
    try {
      const password = await encryptPassword(body.contrasena); 
      const results = await sequelize.query(
        `INSERT INTO usuario (cedula, cod_universitario, correo_est, contrasena, nombres, apellidos, telefono , visibilidad, correo_personal) values('${body.cedula}', ${body.cod_universitario}, '${body.correo_est}', '${password}', '${body.nombres}', '${body.apellidos}', '${body.telefono}', '${body.visibilidad}', '${body.correo_personal}');`,
        { type: QueryTypes.INSERT }
      );
      results
        ? res.status(200).json(respond("1", "OK", results))
        : res.status(400).json(respond("0", "Error", results));
    } catch (error) {
      res.status(500).json(respond("0", "Error", error));
    }
  }

};

export const putUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const results = await sequelize.query(
      `UPDATE usuario SET contrasena = '${body.contrasena}', nombres= '${body.nombres}', apellidos='${body.apellidos}', telefono= ${body.telefono}, visibilidad='${body.visibilidad}', correo_personal='${body.correo_personal}' WHERE cedula = '${id}';`,
      { type: QueryTypes.UPDATE }
    );

    console.log(results[1]);
    if (!results) {
      res.status(400).json(respond("0", "Error", results));
    } else if (results[1] === 0) {
      res
        .status(203)
        .json(
          respond(
            "0",
            `No hay ningún usuario con el id: ${id} o los datos son los mismos`,
            results[0]
          )
        );
    } else {
      res.status(200).json(respond("1", "OK", results));
    }
  } catch (error) {
    res.status(500).json(respond("0", "Error", error));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const results = await sequelize.query(
      "DELETE FROM usuario WHERE cedula = :cedula",
      { replacements: { cedula: id }, type: QueryTypes.DELETE }
    );

    console.log(results);
    res
      .status(200)
      .json(
        respond(
          "1",
          `No hay ningún usuario con el id: ${id} o los datos son los mismos`,
          results
        )
      );
  } catch (error) {
    res.status(500).json(respond("0", "Error", error));
  }
};

export const login = async (req: Request<never, never, LoginRequestInterface, never, never>, res: Response) => {

  const { body } = req;

  try {
      const [result]: Array<UserModelInterface> = await sequelize.query(
        "SELECT * FROM usuario WHERE correo_est = :correo_est",
        {
          replacements: {
            correo_est: body.correo_est
          },
          type: QueryTypes.SELECT,
        }
      );

      if (!result) {
        res.status(400).json(respond("0", "Error", result));
      } else {
        const matchPassword = await comparePassword(body.contrasena, result.contrasena)

        if (!matchPassword) return res.status(203).json(respond("0", "Correo o contraseña incorrectos", {}));

        const token = jwt.sign({ id: result.cedula}, process.env.SECRET!, {
          expiresIn: 86400
        })

        return res.status(200).json(respond('1', 'Operación exitosa!', { token }))

      } 
  } catch (error) {
    console.log(error);
    return res.status(500).json(respond("0", "Errorrrr", error));
  }
};
