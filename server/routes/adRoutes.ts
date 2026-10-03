import { Router } from 'express';
import { AdController } from '../controllers/adController.js';
import { authenticate } from '../middleware/auth.js';
import { validateAdGenerate, validateIdParam } from '../middleware/validate.js';

const router = Router();

// Protect all ad endpoints with authentication
router.use(authenticate);

// Generation (Stage 7 & 8)
router.post('/generate', validateAdGenerate, AdController.generate);

// Save & History (Stage 9)
router.post('/save', AdController.save);
router.get('/history', AdController.getHistory);
router.get('/dashboard-stats', AdController.getDashboardStats);
router.get('/:id', validateIdParam, AdController.getById);
router.put('/:id', validateIdParam, AdController.update);
router.delete('/:id', validateIdParam, AdController.delete);

export default router;
