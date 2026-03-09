import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Config Imports
import connectDB from './config/db.js';


// Route Imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import http from 'http'; // 👈 Import http
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});



io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  // 1. 🆕 SETUP: User joins their own personal room (based on User ID)
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(`User ${userData.name} joined personal room: ${userData._id}`);
    socket.emit('connected');
  });

  // 2. Join Chat Room (Existing)
  socket.on('join_room', (room) => {
    socket.join(room);
  });

  // 3. 🆕 Send Message & Notification
  socket.on('send_message', (data) => {
    // A. Send to the chat room (so the message appears in the box)
    socket.to(data.room).emit('receive_message', data);

    // B. Send Notification to the specific recipient (so they get a Toast popup)
    if (data.recipientId) {
        // Send to the recipient's personal room
        socket.to(data.recipientId).emit('notification_received', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});
// 👆 ------------------

app.use(express.json());
app.use(cors());

// 1. Standard Middleware (Must come before routes)
app.use(cors());
app.use(express.json());

// 2. Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. Serve Uploaded Files Publicly
// This makes http://localhost:5000/uploads/image.jpg work
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes); // 👈 File Upload Route

// Base Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 5. Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`Error: ${err.message}`);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});