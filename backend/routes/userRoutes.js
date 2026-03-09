import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // Import Multer for image upload

const router = express.Router();

// 1. Get Profile Data (Protected)
router.get('/profile', protect, getUserProfile);

// 2. Update Profile Data (Protected + Accepts 'profilePic' file)
router.put('/profile', protect, upload.single('profilePic'), updateUserProfile);

export default router;