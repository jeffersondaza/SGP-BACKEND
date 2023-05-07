import { Router } from "express";
import { deleteUser, getUser, getUsers, createUser, updateUser, login, getRol, getRoles, updateUserRol, updatePassword } from "../../controllers/users/user";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { validateChangePassword, validateCreateUser, validateLogin, validateUpdateUser } from "../../middlewares/users/userValidator";

const router = Router();

router.get('/all', [(verifyToken) as any],getUsers);
router.get('/:id', [genericValidations],[(verifyToken) as any], getUser);
router.post('/', validateCreateUser, [genericValidations], createUser);
router.put('/:id', validateUpdateUser, [genericValidations], [(verifyToken) as any],updateUser );
router.delete('/:id', [(verifyToken) as any],deleteUser); 
router.post('/login', validateLogin, [genericValidations],  login);
router.get('/rol/all', [(verifyToken) as any], getRoles);
router.get('/rol/:id', [(verifyToken) as any], getRol);
router.put('/rol/:id', [(verifyToken) as any], updateUserRol);
router.put('/change-password/:id', validateChangePassword, [genericValidations],[(verifyToken) as any], updatePassword);


export default router;