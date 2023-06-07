import FormData from 'form-data';
import fs from 'fs';
import { Request, Response } from 'express';
import { respond } from '../../helpers/respond';
import { RepositoryFactory } from '../../repositories/repositoryFactory';

export const uploadFile = async (
  req: Request,
  res: Response
) => {
    try {
        const { file } = req; 
        const { usuario } = req.body;

        const formData = new FormData()
        if(file && file.path){
            const fileData = fs.readFileSync(file?.path);
            formData.append('file', fileData, { filename: file.originalname });
            formData.append('usuario', usuario)
        }
        
        const uploadFileResponse = await RepositoryFactory.RepositorySGP.reports.uploadFile(formData);

        return res.status(201).json(respond('1', 'OK', uploadFileResponse.data));
    } catch (error: any) {  
        return res.status(500).json(respond('0', 'Error', error));
    }
};
