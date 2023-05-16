import { Router } from "express";

import { validateLogin } from "../../middlewares/auth/loginValidator";
import { genericValidations } from "../../middlewares/generic.middleware";
import { login } from "../../controllers/users/user";

const router = Router();

router.post('/', validateLogin, [genericValidations],  login);

export default router;