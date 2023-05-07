import { check, body} from 'express-validator';

export const validateCreateProject =[
    check('titulo').notEmpty().withMessage('El titulo es requerido').trim(),
    check('estado').notEmpty().withMessage('El estado es requerida').trim(),
    check('descripcion').notEmpty().withMessage('La descripción es requerida').trim(),
    check('fecha_inicio').notEmpty().withMessage('La fecha de inicio es requerida').trim(),
    check('ciudad').notEmpty().withMessage('La ciudad es requerida').trim(),
    check('metodologia').notEmpty().withMessage('La metodologia es requerida').trim(),
    check('justificacion').notEmpty().withMessage('La justificacion es requerida').trim(),
    check('tipo_proyecto').notEmpty().withMessage('El tipo de proyecto es requerido').trim()
];

export const validateUpdateProject =[
    check('titulo').notEmpty().withMessage('El titulo es requerido').trim(),
    check('estado').notEmpty().withMessage('El estado es requerida').trim(),
    check('descripcion').notEmpty().withMessage('La descripción es requerida').trim(),
    check('visibilidad').notEmpty().withMessage('La visibilidad es requerida').trim(),
    check('ciudad').notEmpty().withMessage('La ciudad es requerida').trim(),
    check('metodologia').notEmpty().withMessage('La metodologia es requerida').trim(),
    check('justificacion').notEmpty().withMessage('La justificacion es requerida').trim(),
    check('tipo_proyecto').notEmpty().withMessage('El tipo de proyecto es requerido').trim()
];

export const validateApproveProject =[
    check('fecha_fin').notEmpty().withMessage('La fecha final del proyecto es requerida').trim(),
    check('conclusiones').notEmpty().withMessage('La conclusión del proyecto es requerida').trim()
];