import upload from '../../helpers/multer';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { respond } from '../../helpers/respond';

export const uploadFileValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, function (err: any) {
    console.log({ body: req.body, file: req.file });
    if (err instanceof multer.MulterError) {
      return res.status(422).json(respond('0', 'Error', err.message));
    } else if (err) {
      return res.status(422).json(respond('0', 'Error', err.message));
    } else if (!req.body.usuario) {
      return res
        .status(422)
        .json(respond('0', 'Error', 'Debe incluir el usuario'));
    }
    next();
  });
};
