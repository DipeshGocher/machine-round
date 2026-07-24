import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  getDashboard,
  getProducts,
  toggleProductAvailability
} from '../controllers/staffController.js';

const router = Router();

// Protect all staff endpoints: Requires authentication and 'staff' role
router.use(verifyToken, authorizeRoles('staff'));

router.get('/dashboard', getDashboard);
router.get('/products', getProducts);
router.patch('/products/:id/availability', toggleProductAvailability);

export default router;
