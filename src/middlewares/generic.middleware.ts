import { Request, Response, NextFunction } from 'express';
import  { validationResult } from 'express-validator';
import { respond } from '../helpers/respond';

export const genericValidations = async (req: Request, res: Response, next: NextFunction) => {
    const validateErrors = validationResult(req);
    if(!validateErrors.isEmpty()){
        return res.status(401).json(respond('0', validateErrors.array()[0].msg, {}))
    } else {
        next();
    }
};