import { Router } from "express";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { getPrograms } from "../../controllers/programs/program";

const router = Router();

router.get('/', [genericValidations], getPrograms);

export default router;