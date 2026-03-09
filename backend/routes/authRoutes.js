import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js"; // 👈 No curly braces!

const router = express.Router();

// Route for Register (Now accepts a file named "certificate")
router.post("/register", upload.single("certificate"), registerUser);

// Route for Login
router.post("/login", loginUser);

export default router;