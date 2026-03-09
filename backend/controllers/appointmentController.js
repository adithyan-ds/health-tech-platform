import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// @desc    Book an appointment
// @route   POST /api/appointments/book
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // 1. Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // 2. Check availability (Simple check: is there an appointment at same date & time?)
    // Note: In a real app, you'd handle time ranges.
    const existingAppointment = await Appointment.findOne({ 
      doctorId, 
      date, 
      time,
      status: { $ne: 'cancelled' } // Ignore cancelled apps
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Doctor is not available at this time' });
    }

    // 3. Create Appointment
    const appointment = await Appointment.create({
      userId: req.user._id,
      userName: req.user.name,
      doctorId,
      doctorName: doctor.name,
      date,
      time,
      status: 'pending'
    });

    res.status(200).json({ message: 'Appointment booked successfully', appointment });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ... existing imports and bookAppointment function ...

// @desc    Get logged-in user's appointments
// @route   GET /api/appointments/my-appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // Newest first
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ... existing imports and functions

// @desc    Get appointments for the logged-in DOCTOR
// @route   GET /api/appointments/doctor-appointments
export const getDoctorAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (Approve/Cancel)
// @route   PUT /api/appointments/status/:id
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'cancelled'
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = status;
      const updatedAppointment = await appointment.save();
      res.json({ message: `Appointment ${status}`, updatedAppointment });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Complete appointment (Add Prescription & Report)
// @route   PUT /api/appointments/complete/:id
export const completeAppointments = async (req, res) => {
  try {
    const { prescription } = req.body;
    // req.file will handle the report upload
    const reportUrl = req.file ? `/${req.file.path.replace(/\\/g, '/')}` : ''; 

    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = 'completed';
      appointment.prescription = prescription || appointment.prescription;
      if (reportUrl) appointment.reportUrl = reportUrl; // Only update if new file uploaded

      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ... existing imports

// @desc    Get appointments for the logged-in DOCTOR
// @route   GET /api/appointments/doctor-appointments
// @access  Private (Doctor Only)
export const getDoctorAppointments = async (req, res) => {
  try {
    // Find appointments where the doctorId matches the logged-in user
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .sort({ date: 1, time: 1 }); // Sort by date/time
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete Appointment & Add Prescription
// @route   PUT /api/appointments/complete/:id
// @access  Private (Doctor Only)
export const completeAppointment = async (req, res) => {
  try {
    const { prescription } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      // Check if the logged-in doctor owns this appointment
      if (appointment.doctorId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      appointment.status = 'completed';
      appointment.prescription = prescription || "No prescription added.";

      // If a report file was uploaded
      if (req.file) {
        appointment.reportUrl = `/${req.file.path.replace(/\\/g, '/')}`;
      }

      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};