import express from 'express';
import { getAllDoctors } from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';;
import { toggleAvailability } from '../controllers/doctorController.js';

const router = express.Router();

// Route to get all doctors (Protected: User must be logged in to see list)
router.get('/getAll', protect, getAllDoctors);
router.put('/toggle-availability', protect, authorize('doctor'), toggleAvailability);

export default router;