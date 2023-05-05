import { DataTypes, ModelDefined } from "sequelize";
import db from "../db/connection";
import { UserModelInterface } from "../interfaces/users/userModel.interface";

const Usuario:ModelDefined<UserModelInterface, any> = db.define("usuario",{
    cedula: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    cod_universitario: {
      type: DataTypes.BIGINT,
    },
    correo_est: {
      type: DataTypes.STRING,
    },
    contrasena: {
      type: DataTypes.STRING,
    },
    nombres: {
      type: DataTypes.STRING,
    },
    apellidos: {
      type: DataTypes.STRING,
    },
    telefono: {
      type: DataTypes.STRING,
    },
    visibilidad: {
      type: DataTypes.STRING,
    },
    correo_personal: {
      type: DataTypes.STRING,
    },
    semillero_id: {
      type: DataTypes.INTEGER,
    },
    programa_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "usuario",
  }
);

export default Usuario;
