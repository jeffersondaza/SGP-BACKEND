import { check, body} from 'express-validator';

export const validateLogin =[
    check('institutionalEmail').notEmpty().withMessage('El correo del estudiante es requerido').trim(),
    check('password').notEmpty().withMessage('La contraseña es requerida').trim()
];