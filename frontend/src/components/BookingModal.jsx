import { useState } from 'react';
import API from '../api';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';

const BookingModal = ({ doctor, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      };

      await API.post('/appointments/book', {
        doctorId: doctor._id,
        date,
        time
      }, config);

      setSuccess(true);
      // Close modal automatically after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      setLoading(false);
    }
  };

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fadeIn">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 hover:bg-blue-700 p-1 rounded-full transition"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <p className="text-blue-100 mt-1">with Dr. {doctor.name}</p>
        </div>

        {/* Success View */}
        {success ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Booking Confirmed!</h3>
            <p className="text-gray-500 mt-2">Your appointment has been scheduled.</p>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleBooking} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                  min={new Date().toISOString().split('T')[0]} // Disable past dates
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              Fee: ${doctor.fees || 50} • Pay at clinic
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;