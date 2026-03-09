import express from 'express';
import { submitComplaint, getComplaints, resolveComplaint } from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Patient submits a complaint
router.post('/', protect, submitComplaint);


router.get('/', protect, authorize('admin'), getComplaints);
router.put('/:id/resolve', protect, authorize('admin'), resolveComplaint);

export default router;