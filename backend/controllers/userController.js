// @ts-nocheck
import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        // Doctor specific fields
        specialization: user.specialization,
        qualification: user.qualification,
        experience: user.experience,
        fees: user.fees,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// ... imports

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      // 🆕 Update Patient Fields
      user.address = req.body.address || user.address;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.height = req.body.height || user.height;
      user.weight = req.body.weight || user.weight;

      if (req.body.password) {
        user.password = req.body.password; 
      }

      if (req.file) {
        user.profilePic = `/${req.file.path.replace(/\\/g, '/')}`;
      }

      // Doctor fields (keep existing logic)
      if (user.role === 'doctor') {
        user.specialization = req.body.specialization || user.specialization;
        user.fees = req.body.fees || user.fees;
        user.qualification = req.body.qualification || user.qualification;
        user.experience = req.body.experience || user.experience;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
        token: req.headers.authorization.split(' ')[1] 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};