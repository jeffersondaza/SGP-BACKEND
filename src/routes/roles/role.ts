import { Router } from "express";
import { getRol, getRoles, updateUserRol } from "../../controllers/users/user";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { verifyAdminRole } from "../../middlewares/users/roles.middlewares";
import { validateUpdateRole } from "../../middlewares/roles/roleValidator";

const router = Router();

router.get('/',[(verifyToken) as any], getRoles);
router.get('/:id', [(verifyToken) as any, verifyAdminRole], getRol);
router.put('/:id', validateUpdateRole ,[(verifyToken) as any, verifyAdminRole], updateUserRol);

export default router;