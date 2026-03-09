import express from 'express';
import { 
  getPendingDoctors, 
  approveDoctor, 
  getAllUsers, 
  updateUserStatus,
  addDoctor
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js'; // 👈 Import 'authorize' (not admin)

const router = express.Router();

// 1. Apply protection (Log in required)
router.use(protect);

// 2. Apply Authorization (Admin Role required)
// Your middleware is generic, so we pass 'admin' to it
router.use(authorize('admin')); 

// --- Admin Routes ---
router.get('/pending-doctors', getPendingDoctors);
router.put('/approve/:id', approveDoctor);
router.get('/users', getAllUsers);
router.put('/update-status/:id', updateUserStatus);
router.post('/add-doctor', addDoctor); 

export default router;