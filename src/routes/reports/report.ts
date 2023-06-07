import { Router } from 'express';
import { uploadFile } from '../../controllers/reports/report';
import { uploadFileValidation } from '../../middlewares/report/upload'

const router = Router();

router.post('/upload', uploadFileValidation, uploadFile);

export default router;