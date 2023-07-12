import { Router } from "express";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { assignRolInProject, deleteParticipant, getParticipants } from "../../controllers/participants/participant";

const router = Router();

router.get('/:id', [genericValidations], [(verifyToken) as any], getParticipants);
router.post('/:id', [genericValidations], [(verifyToken) as any], assignRolInProject);
router.delete('/:id', [genericValidations], [(verifyToken) as any], deleteParticipant);

export default router;