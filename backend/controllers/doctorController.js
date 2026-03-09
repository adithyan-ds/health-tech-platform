import User from '../models/User.js';

// @desc    Get all APPROVED doctors for the patient list
// @route   GET /api/doctors/getAll
export const getAllDoctors = async (req, res) => {
  try {
    // Find users who are doctors AND are approved
    const doctors = await User.find({ role: 'doctor', isApproved: true })
      .select('-password') // Don't send passwords
      .select('name email specialization experience fees phone'); // Only send necessary info

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Toggle Doctor Availability
// @route   PUT /api/doctors/toggle-availability
// @access  Private (Doctor Only)
export const toggleAvailability = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id);
    if (doctor) {
      doctor.isAvailable = !doctor.isAvailable; // Flip the switch
      await doctor.save();
      res.json({ 
        message: `Availability set to ${doctor.isAvailable ? 'Online' : 'Offline'}`, 
        isAvailable: doctor.isAvailable 
      });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};