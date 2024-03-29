import { Router } from "express";
import { getRoles, getRol, updateUserRol, updateRolPermissions, createRolPermissions } from "../../controllers/roles/role";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { verifyAdminRole } from "../../middlewares/users/roles.middlewares";
import { validateCreateRolePermissions, validateUpdateRole, validateUpdateRolePermissions } from "../../middlewares/roles/roleValidator";

const router = Router();

router.get('/',[(verifyToken) as any], getRoles);
router.get('/:id', [(verifyToken) as any], getRol);
router.post('/permissions', validateCreateRolePermissions ,[(verifyToken) as any], createRolPermissions);
router.put('/permissions/', validateUpdateRolePermissions ,[(verifyToken) as any], updateRolPermissions);
router.put('/:id', validateUpdateRole ,[(verifyToken) as any], updateUserRol);

export default router;