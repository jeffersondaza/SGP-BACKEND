import { Router } from "express";
import { deleteUser, getUser, getUsers, createUser, putUser, login } from "../../controllers/users/user";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { validateCreateUser, validateLogin, validateUpdateUser } from "../../middlewares/users/userValidator";

const router = Router();

router.get('/all', [(verifyToken) as any],getUsers);
router.get('/:id', [genericValidations],[(verifyToken) as any], getUser);
router.post('/', validateCreateUser, [genericValidations],[(verifyToken) as any], createUser);
router.put('/:id', validateUpdateUser, [(verifyToken) as any],putUser );
router.delete('/:id', [(verifyToken) as any],deleteUser); 
router.post('/login', validateLogin, [genericValidations],  login);

export default router;