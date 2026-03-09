import express from 'express';
import { 
  bookAppointment, 
  getMyAppointments, 
  getDoctorAppointments, // 👈 Import this
  completeAppointment    // 👈 Import this
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // Ensure you have this for file uploads

const router = express.Router();

// Patient Routes
router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);

// 🆕 Doctor Routes
router.get('/doctor-appointments', protect, authorize('doctor'), getDoctorAppointments);

// Note: We use 'upload.single' to handle the report file
router.put(
  '/complete/:id', 
  protect, 
  authorize('doctor'), 
  upload.single('report'), 
  completeAppointment
);

export default router;