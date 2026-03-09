import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HeartPulse } from 'lucide-react'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', { email, password });

     
      localStorage.setItem('userInfo', JSON.stringify(data));

      
      toast.success(`Welcome back, ${data.name}!`);

      
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/home');
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login Failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')"
      }}
    >
      
      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm z-0"></div>

      
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

      
      <div className="relative z-10 flex h-full items-center justify-center">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-xl shadow-2xl w-96 animate-fadeIn border border-gray-100"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-2">Login to access your dashboard</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white p-3 rounded-lg font-bold transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            New here? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;