import { check, body} from 'express-validator';

export const validateUpdateRole =[
    check('tipo_usuario').notEmpty().withMessage('El tipo de usuario es requerido').trim()
];

export const validateUpdateRolePermissions =[
    check('tipo_usuario').notEmpty().withMessage('El tipo de usuario es requerido').trim(),
    check('acceso').notEmpty().withMessage('El acceso es requerido').trim()
];