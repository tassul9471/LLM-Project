import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';
import { validateProduct, validateIdParam } from '../middleware/validate.js';

const router = Router();

// Protect all product endpoints with authentication
router.use(authenticate);

router.post('/', validateProduct, ProductController.create);
router.post('/seed', ProductController.seedSampleData);
router.get('/', ProductController.getAll);
router.get('/:id', validateIdParam, ProductController.getById);
router.put('/:id', validateIdParam, validateProduct, ProductController.update);
router.delete('/:id', validateIdParam, ProductController.delete);

export default router;
