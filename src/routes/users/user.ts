import { Router } from "express";
import { deleteUser, getUser, getUsers, createUser, updateUser, login, getRol, getRoles, updateUserRol, updatePassword, validateSession } from "../../controllers/users/user";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { validateChangePassword, validateCreateUser, validateLogin, validateUpdateUser, validateUserSession } from "../../middlewares/users/userValidator";
import { verifyAdminRole } from "../../middlewares/users/roles.middlewares";

const router = Router();

//FIXME: VALIDATE URL PARAMS

//TODO 

router.get('/all', [verifyToken, verifyAdminRole],getUsers);
router.get('/:id', [genericValidations],[verifyToken as any, verifyAdminRole], getUser);
router.post('/', validateCreateUser, [genericValidations], createUser);
router.put('/:id', validateUpdateUser, [genericValidations], [(verifyToken) as any, verifyAdminRole],updateUser );
router.delete('/:id', [(verifyToken) as any, verifyAdminRole],deleteUser); 
router.post('/login', validateLogin, [genericValidations],  login);
router.get('/validate-session', validateUserSession, [genericValidations],[(verifyToken) as any],  validateSession);
router.get('/rol/all', [(verifyToken) as any, verifyAdminRole], getRoles);
router.get('/rol/:id', [(verifyToken) as any, verifyAdminRole], getRol);
router.put('/rol/:id', [(verifyToken) as any, verifyAdminRole], updateUserRol);
router.put('/change-password/:id', validateChangePassword, [genericValidations],[(verifyToken) as any], updatePassword);


export default router;