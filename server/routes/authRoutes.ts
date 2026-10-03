import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.get('/me', authenticate, AuthController.me);
router.post('/logout', AuthController.logout);

export default router;
