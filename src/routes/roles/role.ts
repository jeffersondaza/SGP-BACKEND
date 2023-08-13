import { Router } from "express";
import { getRoles, getRol, updateUserRol, updateRolPermissions } from "../../controllers/roles/role";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { verifyAdminRole } from "../../middlewares/users/roles.middlewares";
import { validateUpdateRole, validateUpdateRolePermissions } from "../../middlewares/roles/roleValidator";

const router = Router();

router.get('/',[(verifyToken) as any], getRoles);
router.get('/:id', [(verifyToken) as any, verifyAdminRole], getRol);
router.put('/permissions/', validateUpdateRolePermissions ,[(verifyToken) as any, verifyAdminRole], updateRolPermissions);
router.put('/:id', validateUpdateRole ,[(verifyToken) as any, verifyAdminRole], updateUserRol);

export default router;