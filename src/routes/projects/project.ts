import { Router } from "express";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { approveProject, createProject, deleteProject, getProject, getProjects, updateProject } from "../../controllers/projects/project";
import { validateApproveProject, validateCreateProject, validateUpdateProject } from "../../middlewares/projects/projectValidator";
import { verifyAdminRole } from "../../middlewares/users/roles.middlewares";


const router = Router();

router.get('/all', [(verifyToken) as any, verifyAdminRole],getProjects);
router.get('/:id',[(verifyToken) as any], getProject);
router.post('/', validateCreateProject, [genericValidations],[(verifyToken) as any], createProject);
router.put('/:id', validateUpdateProject, [genericValidations],[(verifyToken) as any], updateProject);
router.delete('/:id', [(verifyToken) as any], deleteProject);
router.put('/approve/:id', validateApproveProject, [genericValidations],[(verifyToken) as any], approveProject);

export default router;