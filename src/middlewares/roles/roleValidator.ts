import { check, body} from 'express-validator';

export const validateUpdateRole =[
    check('tipo_usuario').notEmpty().withMessage('El tipo de usuario es requerido').trim()
];

export const validateCreateRolePermissions =[
    check('tipo_usuario').notEmpty().withMessage('El tipo de usuario es requerido').trim(),
    check('USUARIOS').notEmpty().withMessage('El acceso es requerido').trim(),
    check('PROGRAMAS').notEmpty().withMessage('El acceso es requerido').trim(),
    check('FACULTADES').notEmpty().withMessage('El acceso es requerido').trim(),
    check('EVENTOS').notEmpty().withMessage('El acceso es requerido').trim(),
    check('PROYECTOS').notEmpty().withMessage('El acceso es requerido').trim(),
    check('SEMILLEROS').notEmpty().withMessage('El acceso es requerido').trim(),
    check('REPORTES').notEmpty().withMessage('El acceso es requerido').trim(),
    check('ROLES').notEmpty().withMessage('El acceso es requerido').trim(),
];

export const validateUpdateRolePermissions =[
    check('tipo_usuario').notEmpty().withMessage('El tipo de usuario es requerido').trim(),
    check('acceso').notEmpty().withMessage('El acceso es requerido').trim()
];