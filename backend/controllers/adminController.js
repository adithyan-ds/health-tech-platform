import User from '../models/User.js';

// ... (keep getPendingDoctors, approveDoctor, getAllUsers as they were) ...
export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isApproved: false }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveDoctor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && user.role === 'doctor') {
      user.isApproved = true;
      await user.save();
      res.json({ message: 'Doctor approved' });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👇 THIS IS THE CRITICAL FIX FOR THE 500 ERROR
// inside adminController.js

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // 👈 We expect "approved" or "rejected"
    const user = await User.findById(req.params.id);

    if (user) {
      // 🛑 LOGIC CHECK:
      // If frontend sends "approved", we set isApproved = true.
      // If frontend sends "rejected", we set isApproved = false.
      user.isApproved = status === 'approved' ? true : false; 
      
      const updatedUser = await user.save();
      
      res.json({ 
        message: `User status updated to ${updatedUser.isApproved ? 'Approved' : 'Revoked'}`,
        user: updatedUser 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addDoctor = async (req, res) => {
    // ... keep your existing addDoctor logic ...
    try {
        const { name, email, password, phone, specialization, fees } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User exists' });

        const doctor = await User.create({
            name, email, password, phone, specialization, fees,
            role: 'doctor', isApproved: true
        });
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};