import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to={userInfo?.role === 'doctor' ? '/doctor-dashboard' : '/home'} className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-xl font-bold text-gray-800 tracking-tight">HealthApp</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-gray-500 text-sm">Welcome, <span className="font-bold text-gray-800">{userInfo?.name}</span></span>
            
            <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition">
              {/* Show Image if exists, else show Icon */}
              {userInfo?.profilePic ? (
                <img 
                  src={`${BACKEND_URL}${userInfo.profilePic}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                   <User size={18} />
                </div>
              )}
            </Link>

            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition font-medium text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 mb-2">
               {userInfo?.profilePic ? (
                  <img src={`${BACKEND_URL}${userInfo.profilePic}`} className="w-10 h-10 rounded-full object-cover" />
               ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><User size={20} /></div>
               )}
               <div>
                 <p className="font-bold text-gray-800">{userInfo?.name}</p>
                 <p className="text-xs text-gray-500 capitalize">{userInfo?.role}</p>
               </div>
            </div>
            <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Your Profile</Link>
            <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Sign out</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;