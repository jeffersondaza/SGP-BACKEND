import { Router } from "express";
import { deleteUser, getUser, getUsers, createUser, putUser, login } from "../../controllers/users/user";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { validateCreateUser, validateLogin } from "../../middlewares/users/userValidator";

const router = Router();

router.get('/all', getUsers);
router.get('/:id', [(verifyToken) as any], getUser);
router.post('/', validateCreateUser, [genericValidations], createUser);
router.put('/:id', putUser );
router.delete('/:id', deleteUser); 
router.post('/login', validateLogin, [genericValidations],  login);

export default router;