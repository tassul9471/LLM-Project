import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateIdParam } from '../middleware/validate.js';

const router = Router();

// Protect ALL admin routes with both authentication AND admin role
router.use(requireAuth);
router.use(requireAdmin);

// Admin Dashboard stats
router.get('/dashboard', AdminController.getDashboard);

// User Management
router.get('/users', AdminController.getUsers);
router.get('/users/:id', validateIdParam, AdminController.getUserById);
router.delete('/users/:id', validateIdParam, AdminController.deleteUser);

// Product Management
router.get('/products', AdminController.getProducts);
router.get('/products/:id', validateIdParam, AdminController.getProductById);
router.delete('/products/:id', validateIdParam, AdminController.deleteProduct);

// Advertisement Management
router.get('/ads', AdminController.getAds);
router.get('/ads/:id', validateIdParam, AdminController.getAdById);
router.delete('/ads/:id', validateIdParam, AdminController.deleteAd);

export default router;
