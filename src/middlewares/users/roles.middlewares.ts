import { Request, Response, NextFunction } from 'express';
import { RoleInterface as RoleValidateInterface } from '../../interfaces/users/userModel.interface';
import sequelize from '../../db/connection';
import { CustomRequest } from '../../interfaces/commons/customRequest.interface';
import { respond } from '../../helpers/respond';
import { QueryTypes } from 'sequelize';
import { RolesEnum } from '../../enums/users/roles.enum';

const verifyRole = async (userId: string, role: string) => {
  try {
    const [user]: Array<RoleValidateInterface> = await sequelize.query(
      'SELECT usuarios.usuario as user, usuarios.tipo_usuario as user_type FROM usuario JOIN usuarios ON usuario.cedula = usuarios.usuario WHERE usuario.cedula = :userId;',
      {
        replacements: {
          userId,
        },
        type: QueryTypes.SELECT,
      }
    );
    
    return user && user.user_type === role ? true : false;
  } catch (err) {
    return false;
  }
};


export const verifyAdminRole: any = async (req: CustomRequest,res: Response,next: NextFunction) => await verifyRole(req.userId, RolesEnum.Admin) ? next() : res.status(404).json(respond('0', 'Access denied', {}));

export const verifyStudentRole: any = async (req: CustomRequest,res: Response,next: NextFunction) => await verifyRole(req.userId, RolesEnum.Student) ? next() : res.status(404).json(respond('0', 'Access denied', {}));

export const verifyTeacherRole: any = async (req: CustomRequest,res: Response,next: NextFunction) => await verifyRole(req.userId, RolesEnum.Teacher) ? next() : res.status(404).json(respond('0', 'Access denied', {}));
  