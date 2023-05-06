import { check, body} from 'express-validator';

export const validateCreateUser =[
    check('cedula').notEmpty().withMessage('La cedula es requerida').trim(),
    check('cod_universitario').notEmpty().withMessage('El código de estudiante es requerido').trim(),
    check('correo_est').notEmpty().withMessage('El correo del estudiante es requerido').trim(),
    check('contrasena').notEmpty().withMessage('La contraseña es requerida').trim(),
    check('nombres').notEmpty().withMessage('El nombre del estudiante es requerido').trim(),
    check('apellidos').notEmpty().withMessage('El apellido del estudiante es requerido').trim(),
    check('telefono').notEmpty().withMessage('El telefono del estudiante es requerido').trim(),
    check('visibilidad').notEmpty().withMessage('La visibilidad del usuario es requerido').trim(),
    check('correo_personal').notEmpty().withMessage('El correo personal del estudiante es requerido').trim()
];

export const validateLogin =[
    check('correo_est').notEmpty().withMessage('El correo del estudiante es requerido').trim(),
    check('contrasena').notEmpty().withMessage('La contraseña es requerida').trim()
];


export const validateUpdateUser =[
    check('contrasena').notEmpty().withMessage('El correo del estudiante es requerido').trim(),
    check('nombres').notEmpty().withMessage('La contraseña es requerida').trim(),
    check('apellidos').notEmpty().withMessage('El correo del estudiante es requerido').trim(),
    check('telefono').notEmpty().withMessage('La contraseña es requerida').trim(),
    check('visibilidad').notEmpty().withMessage('El correo del estudiante es requerido').trim(),
    check('correo_personal').notEmpty().withMessage('La contraseña es requerida').trim()
];