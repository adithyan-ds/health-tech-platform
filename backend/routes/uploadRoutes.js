import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload a single file
router.post('/', upload.single('image'), (req, res) => {
  try {
    // Return the path so frontend can save it to the user's profile
    res.send(`/${req.file.path.replace(/\\/g, '/')}`); 
  } catch (error) {
    res.status(400).send({ message: 'Error uploading file' });
  }
});

export default router;