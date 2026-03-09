import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      specialization,
      qualification,
      experience,
      fees,
    } = req.body;

    console.log("1. Request Received for:", email);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("2. User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("3. Attempting to create user in DB...");

    // ✅ NEW: certificate upload path
    const certificateUrl = req.file
      ? `/uploads/certificates/${req.file.filename}`
      : "";

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      phone,
      specialization,
      qualification,
      experience,
      fees,
      certificateUrl, // ✅ NEW
    });

    

    if (!process.env.JWT_SECRET) {
      console.log("ERROR: JWT_SECRET is missing in .env file!");
      return res.status(500).json({ message: "JWT Secret is missing on server" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("5. Token generated successfully");

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      certificateUrl: user.certificateUrl, // ✅ NEW
      token,
    });
  } catch (error) {
    console.error("❌ REGISTRATION CRASHED AT STEP:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// @desc Authenticate user & get token
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Check for Doctor Approval
      if (user.role === "doctor" && !user.isApproved) {
        return res
          .status(403)
          .json({ message: "Your account is pending admin approval." });
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        certificateUrl: user.certificateUrl, // ✅ optional
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        }),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
