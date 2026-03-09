import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import API from '../api';
import { HeartPulse } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', formData);
      setMessage(`Success! Welcome, ${response.data.name}`);
      console.log("Token:", response.data.token);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-cover bg-center relative"
      style={{
        
        backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')"
      }}
    >
     
      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"></div>
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-5 z-50">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-lg group-hover:bg-blue-500 transition">
            <HeartPulse size={24} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight drop-shadow-md">HealthApp</span>
        </Link>
        
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-blue-200 font-medium transition shadow-black drop-shadow-sm">
            Home
          </Link>
          <Link to="/signup" className="px-5 py-2.5 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 shadow-lg transition">
            Sign Up
          </Link>
        </div>
      </nav>

     
      <form 
        onSubmit={handleSubmit} 
        className="relative z-10 w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 text-sm mt-2">Join us to manage your health better</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              placeholder="name" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Sign Up
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded text-center text-sm font-bold ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;