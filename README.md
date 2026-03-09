# 🏥 Full-Stack HealthTech Management Platform

A comprehensive, role-based healthcare management system built with the MERN stack. This platform connects patients, doctors, and administrators through a secure, real-time ecosystem designed to streamline clinic operations and telehealth interactions.

## 🚀 Features by Role

### 👨‍⚕️ For Doctors
* **Availability Management:** Toggle online/offline status in real-time.
* **Appointment Handling:** View, accept, and complete patient appointments.
* **Medical Records:** Upload and attach prescriptions and medical reports (PDF/Images) directly to patient files.
* **Live Consultations:** Engage in real-time chat with patients via WebSockets.

### 🧑‍🤝‍🧑 For Patients
* **Doctor Discovery:** Browse active doctors by specialization, experience, and consultation fees.
* **Seamless Booking:** Interactive calendar and time-slot selection for appointments.
* **Telehealth Chat:** Send secure, real-time messages to online doctors.
* **Patient Dashboard:** Track appointment history, download prescriptions, and submit platform feedback.

### 🛡️ For Administrators
* **Staff Verification:** Review doctor credentials (uploaded certificates) to approve or revoke system access.
* **Platform Analytics:** Real-time metrics on user acquisition and system health.
* **Issue Resolution:** Dedicated ticket system to track and resolve patient complaints.

## 💻 Tech Stack

**Frontend:**
* React.js & Vite
* Tailwind CSS (Utility-first styling)
* React Router DOM (Navigation)
* Socket.io-client (Real-time updates)
* Lucide React (Iconography)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Data modeling)
* Socket.io (WebSocket server for chat & notifications)
* Multer (File upload handling)
* JSON Web Tokens (JWT) & Bcrypt.js (Authentication & Security)

## ⚙️ Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/adithyan-ds/health-tech-platform.git](https://github.com/adithyan-ds/health-tech-platform.git)
   cd health-tech-platform