import { useState } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { X, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';

const ComplaintModal = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

      // Assuming your backend route is POST /api/complaints
      await API.post('/complaints', { subject, description }, config);
      
      toast.success('Complaint submitted successfully. We will look into it!');
      setSubject('');
      setDescription('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report an Issue">
      <div className="p-2">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg flex items-start mb-6 text-sm">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>If you have experienced any issues with a doctor, booking, or the platform, please let us know. Our admin team will review it.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
            <select 
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select an issue...</option>
              <option value="Doctor Behavior">Doctor Behavior / Unprofessional</option>
              <option value="Booking Issue">Booking / Scheduling Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Technical Bug">Technical Bug</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
            <textarea 
              required
              rows="4"
              placeholder="Please provide details about your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-70 mt-2"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ComplaintModal;