import { useEffect } from 'react'; // 👈 Added missing import
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import Home from './pages/Home.jsx';
import LandingPage from './pages/LandingPage.jsx';
import DoctorRegister from './pages/DoctorRegister.jsx';
import Profile from './pages/Profile.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Toaster, toast } from 'react-hot-toast'; // 👈 Added 'toast' function import
import Navbar from './components/layout/Navbar';
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const socket = io('https://health-tech-platform.onrender.com');

function App() {
  const location = useLocation();

  // 🛑 Define pages where Navbar should be HIDDEN
  // I removed '/home', '/doctor-dashboard', etc. so the Navbar SHOWS on those pages
   const hideNavbarRoutes = ['/', '/login', '/signup', '/register-doctor','/home','/doctor-dashboard','/admin-dashboard'];

  // Check if current path is in the "hide" list
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    if (userInfo) {
        // 1. Connect to personal room
        socket.emit("setup", userInfo);
    }

    // 2. Listen for Notifications
    const handleNotification = (newMessage) => {
        // Show Toast
        toast(`💬 New message from ${newMessage.author}: "${newMessage.message}"`, {
            duration: 5000,
            position: 'top-right',
            style: {
                border: '1px solid #3b82f6',
                padding: '16px',
                color: '#1e3a8a',
            },
            icon: '📩',
        });
    };

    socket.on("notification_received", handleNotification);

    return () => {
        socket.off("notification_received", handleNotification);
    };
  }, []);

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      
      {/* ✅ CONDITIONALLY RENDER NAVBAR */}
      {shouldShowNavbar && <Navbar />}
      
      <Routes>
        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register-doctor" element={<DoctorRegister />} />
        
        {/* 🔐 PROTECTED ROUTES */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        {/* 🛡️ ADMIN DASHBOARD */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 👨‍⚕️ DOCTOR DASHBOARD */}
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute roleRequired="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;