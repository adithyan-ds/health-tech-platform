import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    fees: "",
    role: "doctor",
  });

  const [certificate, setCertificate] = useState(null); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleFileChange = (e) => {
    setCertificate(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const payload = new FormData();

      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      if (certificate) {
        payload.append("certificate", certificate);
      }

      await API.post("/auth/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Application Submitted! Please wait for Admin Approval.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Join as a Doctor
        </h2>

        {error && (
          <p className="mb-4 p-2 bg-red-100 text-red-600 rounded text-center">
            {error}
          </p>
        )}

        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              Full Name
            </label>
            <input
              name="name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              placeholder="Dr. John Doe"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Phone</label>
            <input
              name="phone"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              placeholder="9876543210"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="doctor@hospital.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-1">Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="******"
          />
        </div>

        {/* Professional Info */}
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3 border-b pb-2">
          Professional Details
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              Specialization
            </label>
            <select
              name="specialization"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select...</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="General Physician">General Physician</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">
              Experience (Years)
            </label>
            <input
              type="number"
              name="experience"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              placeholder="5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              Qualification
            </label>
            <input
              name="qualification"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              placeholder="MBBS, MD"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">
              Consultation Fees
            </label>
            <input
              type="number"
              name="fees"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              placeholder="500"
            />
          </div>
        </div>

        {/* ✅ NEW: Certificate Upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-1">
            Upload Certificates (PDF/Image)
          </label>
          <input
            type="file"
            name="certificate"
            onChange={handleFileChange}
            className="w-full p-2 border rounded bg-white"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />

          {certificate && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: <span className="font-semibold">{certificate.name}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white p-3 rounded-lg font-bold hover:bg-blue-800 transition"
        >
          Submit Application
        </button>

        <p className="mt-4 text-center text-sm">
          Looking for patient registration?{" "}
          <Link to="/signup" className="text-blue-600 font-bold">
            Click here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default DoctorRegister;
