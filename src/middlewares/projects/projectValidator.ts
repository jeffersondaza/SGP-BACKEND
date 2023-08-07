import { check, body} from 'express-validator';

export const validateCreateProject =[
    check('titulo').notEmpty().withMessage('El titulo es requerido').trim(),
    check('descripcion').notEmpty().withMessage('La descripción es requerida').trim(),
    check('ciudad').notEmpty().withMessage('La ciudad es requerida').trim(),
    check('metodologia').notEmpty().withMessage('La metodologia es requerida').trim(),
    check('justificacion').notEmpty().withMessage('La justificacion es requerida').trim(),
    check('tipo_proyecto').notEmpty().withMessage('El tipo de proyecto es requerido').trim(),
    check('programa_id').notEmpty().withMessage('El programa al cual pertenece el usuario es requerido').trim()
];

export const validateUpdateProject =[
    check('titulo').notEmpty().withMessage('El titulo es requerido').trim(),
    check('estado').notEmpty().withMessage('El estado es requerida').trim(),
    check('descripcion').notEmpty().withMessage('La descripción es requerida').trim(),
    check('ciudad').notEmpty().withMessage('La ciudad es requerida').trim(),
    check('metodologia').notEmpty().withMessage('La metodologia es requerida').trim(),
    check('justificacion').notEmpty().withMessage('La justificacion es requerida').trim(),
    check('tipo_proyecto').notEmpty().withMessage('El tipo de proyecto es requerido').trim()
];

export const validateApproveProject =[
    check('retroalimentacion_final').notEmpty().withMessage('La retroalimentación del proyecto es requerida').trim(),
    check('conclusiones').notEmpty().withMessage('La conclusión del proyecto es requerida').trim(),
    check('nota').notEmpty().withMessage('La nota del proyecto es requerida').trim()
];

export const validateCreateComment =[
    check('comentario').notEmpty().withMessage('El comentario es requerido').trim()
];