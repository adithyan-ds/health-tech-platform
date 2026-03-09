import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, ShieldCheck, HeartPulse, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      
      
      <nav className="flex justify-between items-center px-8 py-5 shadow-sm sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <HeartPulse size={24} />
          </div>
          <span className="text-2xl font-bold text-gray-800 tracking-tight">HealthApp</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-5 py-2.5 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition">
            Login
          </Link>
          <Link to="/signup" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </nav>

      
      <header 
        className="relative bg-cover bg-center bg-no-repeat h-[600px] flex items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1920&auto=format&fit=crop')"
        }}
      >
        
        <div className="absolute inset-0 bg-blue-900/60"></div>

        <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center z-10">
          
          
          <div className="lg:w-1/2 lg:pr-12 text-white">
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Healthcare at your <span className="text-blue-200">fingertips.</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Book appointments with top specialists, manage your medical records, and consult with doctors online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold rounded-xl transition shadow-lg flex items-center justify-center">
                Find a Doctor <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 text-lg font-bold rounded-xl transition shadow-sm flex items-center justify-center">
                Patient Login
              </Link>
            </div>
            
            
            <div className="mt-6">
              <Link to="/register-doctor" className="text-sm text-blue-200 hover:text-white underline opacity-90">
                Are you a doctor? Join our network here.
              </Link>
            </div>
          </div>
          
          
          <div className="lg:w-1/2"></div> 
        </div>
      </header>

      
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-gray-500 mb-16 max-w-2xl mx-auto">We provide the best medical services with improved facilities and the latest technology.</p>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-blue-50 hover:bg-blue-100 transition duration-300">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                <Stethoscope size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Doctors</h3>
              <p className="text-gray-600 leading-relaxed">Access to hundreds of specialized doctors with years of experience in various fields.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-green-50 hover:bg-green-100 transition duration-300">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Booking</h3>
              <p className="text-gray-600 leading-relaxed">Book appointments instantly without waiting in long queues at the hospital.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-purple-50 hover:bg-purple-100 transition duration-300">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Secure Records</h3>
              <p className="text-gray-600 leading-relaxed">Your medical history is kept safe, private, and easily accessible only to you.</p>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="bg-gray-900 text-gray-300 py-12 text-center">
        <div className="max-w-7xl mx-auto px-6">
           <p className="mb-4 text-2xl font-bold text-white">HealthApp</p>
           <p>© 2026 HealthApp Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;