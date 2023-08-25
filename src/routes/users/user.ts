import { Router } from "express";
import { deleteUser, getUser, getUsers, createUser, updateUser, login, updatePassword, validateSession, activateUser } from "../../controllers/users/user";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { validateChangePassword, validateCreateUser, validateUpdateUser, validateUserSession } from "../../middlewares/users/userValidator";
import { verifyAdminRole, verifyStudentRole } from "../../middlewares/users/roles.middlewares";

const router = Router();

//FIXME: VALIDATE URL PARAMS

//TODO 

router.get('/', [(verifyToken) as any],getUsers);
router.get('/:id', [genericValidations],[verifyToken as any], getUser);
router.post('/', validateCreateUser, [genericValidations], createUser);
router.put('/:id', validateUpdateUser, [genericValidations], [(verifyToken) as any],updateUser );
router.put('/my-account/:id', validateUpdateUser, [genericValidations], [(verifyToken) as any],updateUser );
router.delete('/:id', [(verifyToken) as any],deleteUser); 
router.get('/validate-session', validateUserSession, [genericValidations],[(verifyToken) as any],  validateSession);
router.put('/change-password/:id', validateChangePassword, [genericValidations],[(verifyToken) as any], updatePassword);
router.put('/activate/:id', [genericValidations],[(verifyToken) as any], activateUser);

export default router;