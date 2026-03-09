import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  role: { type: String, enum: ['user', 'admin', 'doctor'], default: 'user' },
  profilePic: { type: String, default: "" },
  isApproved: { type: Boolean, default: function() { return this.role !== 'doctor'; }},
  isAvailable: { 
    type: Boolean, 
    default: false 
  },
  
  // 🆕 PATIENT SPECIFIC FIELDS
  address: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  height: { type: String, default: "" }, // e.g., "5'9" or "175 cm"
  weight: { type: String, default: "" }, // e.g., "70 kg"

  // DOCTOR SPECIFIC FIELDS
  specialization: { type: String },
  qualification: { type: String },
  experience: { type: String },
  fees: { type: Number },
  certificateUrl: { type: String, default: "" },

}, { timestamps: true });

// Password Encryption
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;