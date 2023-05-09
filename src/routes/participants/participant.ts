import { Router } from "express";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { assignRolInProject } from "../../controllers/participants/participant";

const router = Router();

router.post('/assign-rol', [(verifyToken) as any], assignRolInProject);

export default router;