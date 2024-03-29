import { check, body} from 'express-validator';

export const validateCreateUser =[
    check('cedula').notEmpty().withMessage('La cedula es requerida').trim(),
    check('cod_universitario').notEmpty().withMessage('El código de estudiante es requerido').trim(),
    check('correo_est').notEmpty().withMessage('El correo del estudiante es requerido').trim(),
    check('contrasena').notEmpty().withMessage('La contraseña es requerida').trim(),
    check('nombres').notEmpty().withMessage('El nombre del estudiante es requerido').trim(),
    check('apellidos').notEmpty().withMessage('El apellido del estudiante es requerido').trim(),
    check('telefono').notEmpty().withMessage('El telefono del estudiante es requerido').trim(),
    check('correo_personal').notEmpty().withMessage('El correo personal del estudiante es requerido').trim(),
    check('programa_id').notEmpty().withMessage('El programa del estudiante es requerido').trim()
];

export const validateUpdateUser =[
    check('nombres').notEmpty().withMessage('El nombre del estudiante es requerido').trim(),
    check('apellidos').notEmpty().withMessage('El apellido del estudiante es requerido').trim(),
    check('telefono').notEmpty().withMessage('El telefono del estudiante es requerido').trim(),
    check('correo_personal').notEmpty().withMessage('El correo personal del estudiante es requerido').trim()
];

export const validateUpdateMyAccount =[
    check('nombres').notEmpty().withMessage('El nombre del estudiante es requerido').trim(),
    check('apellidos').notEmpty().withMessage('El apellido del estudiante es requerido').trim(),
    check('telefono').notEmpty().withMessage('El telefono del estudiante es requerido').trim(),
    check('correo_personal').notEmpty().withMessage('El correo personal del estudiante es requerido').trim()
];

export const validateChangePassword =[
    check('contrasena').notEmpty().withMessage('El usuario y la nueva contraseña son requeridos').trim()
];

export const validateUserSession =[
    check('contrasena').notEmpty().withMessage('El usuario y la nueva contraseña son requeridos').trim()
];