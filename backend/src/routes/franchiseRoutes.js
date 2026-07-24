import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  getDashboard,
  getStaffList,
  addStaff,
  updateStaff,
  toggleStaffStatus,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability
} from '../controllers/franchiseController.js';

const router = Router();

// Protect all franchise owner routes: Requires JWT authentication and 'franchise' role
router.use(verifyToken, authorizeRoles('franchise'));

// Dashboard
router.get('/dashboard', getDashboard);

// Staff Management
router.get('/staff', getStaffList);
router.post('/staff', addStaff);
router.put('/staff/:id', updateStaff);
router.patch('/staff/:id/status', toggleStaffStatus);

// Product Management
router.get('/products', getProducts);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/:id/availability', toggleProductAvailability);

export default router;
