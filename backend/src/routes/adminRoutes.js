import { Router } from 'express';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  getDashboardStats,
  createFranchise,
  getFranchises,
  getFranchiseOverview,
  updateFranchise,
  toggleFranchiseStatus,
  getAllUsers,
  getAdminStaffList,
  getAdminProducts
} from '../controllers/adminController.js';

const router = Router();

// Protect all admin routes: Requires authentication and Admin role
router.use(verifyToken, authorizeRoles('admin'));

router.get('/dashboard', getDashboardStats);

router.post('/franchises', createFranchise);
router.get('/franchises', getFranchises);
router.get('/franchises/:id', getFranchiseOverview);
router.put('/franchises/:id', updateFranchise);
router.patch('/franchises/:id/status', toggleFranchiseStatus);

router.get('/users', getAllUsers);
router.get('/staff', getAdminStaffList);
router.get('/products', getAdminProducts);

export default router;
