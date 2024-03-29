import { Router } from "express";
import { verifyToken } from "../../middlewares/authJWT.middleware";
import { genericValidations } from "../../middlewares/generic.middleware";
import { activateProject, approveProject, createComment, createProduct, createProject, deleteComment, deleteProduct, deleteProject, getComments, getMyProjects, getProduct, getProducts, getProject, getProjectType, getProjects, updateProject } from "../../controllers/projects/project";
import { validateApproveProject, validateCreateComment, validateCreateProject, validateUpdateProject, validateUpdateProjectStatus } from "../../middlewares/projects/projectValidator";
import { verifyAdminRole } from "../../middlewares/users/roles.middlewares";
import { uploadFileValidation } from "../../middlewares/projects/uploadProductValidator";


const router = Router();

router.get('/:id',[(verifyToken) as any], getProject);
router.get('/', [(verifyToken) as any],getProjects);
router.post('/', validateCreateProject, [genericValidations],[(verifyToken) as any], createProject);
router.put('/:id', validateUpdateProject, [genericValidations],[(verifyToken) as any], updateProject);
router.put('/update-status/:id', validateUpdateProjectStatus, [genericValidations],[(verifyToken) as any], updateProject);
router.delete('/:id', [(verifyToken) as any], deleteProject);
router.put('/approve/:id', validateApproveProject, [genericValidations],[(verifyToken) as any], approveProject);
router.get('/types/all', [(verifyToken) as any],getProjectType);
router.get('/my-projects/:id', [(verifyToken) as any],getMyProjects);
router.post('/product/:id', uploadFileValidation, [genericValidations],[(verifyToken) as any], createProduct);
router.get('/product/all/:id', [(verifyToken) as any],getProducts);
router.get('/product/:id', [genericValidations],[(verifyToken) as any], getProduct);
router.put('/activate/:id', [genericValidations],[(verifyToken) as any], activateProject);
router.delete('/product/:id', [(verifyToken) as any], deleteProduct);
router.post('/product/comment/:id', validateCreateComment, [genericValidations],[(verifyToken) as any], createComment);
router.delete('/product/comment/:id', [(verifyToken) as any], deleteComment);
router.get('/product/comment/:id',[(verifyToken) as any], getComments);

export default router;