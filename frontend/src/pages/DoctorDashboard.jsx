import { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/layout/Navbar';
import Modal from '../components/ui/Modal';
import ChatBox from '../components/layout/ChatBox'; 
import toast from 'react-hot-toast';
import { Check, X, Calendar, Clock, User, Activity, FileText, Upload, Power, MessageCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  
  
  const [activeChat, setActiveChat] = useState(null); // 🆕

  
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

 
  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      
      const { data } = await API.get('/appointments/doctor-appointments', config);
      setAppointments(data);

   
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, );

  const toggleAvailability = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await API.put('/doctors/toggle-availability', {}, config);
      setIsAvailable(data.isAvailable);
      toast.success(data.isAvailable ? "You are now ONLINE 🟢" : "You are now OFFLINE 🔴");
    } catch  {
      toast.error("Failed to update status");
    }
  };

  const openCompleteModal = (appt) => {
    setSelectedAppt(appt); setPrescription(''); setReportFile(null); setIsCompleteModalOpen(true);
  };

  const handleComplete = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
        const formData = new FormData();
        formData.append('prescription', prescription);
        if (reportFile) formData.append('report', reportFile);
        await API.put(`/appointments/complete/${selectedAppt._id}`, formData, {
            headers: { Authorization: `Bearer ${userInfo?.token}`, 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Completed!"); setIsCompleteModalOpen(false); fetchData();
    } catch  { toast.error("Failed"); } finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      await API.put(`/appointments/status/${id}`, { status }, config);
      toast.success(`Appointment ${status}`);
      fetchData(); 
    } catch { toast.error("Failed to update status"); }
  };

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const todayCount = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header & Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
            <p className="text-gray-500">Manage appointments & availability.</p>
          </div>
          <button 
            onClick={toggleAvailability}
            className={`flex items-center px-6 py-3 rounded-full font-bold shadow-md transition-all ${
                isAvailable ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
            }`}
          >
            <Power size={20} className="mr-2" />
            {isAvailable ? "You are Online" : "You are Offline"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4"><Activity size={20} /></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase">Pending</p><p className="text-xl font-bold">{pendingCount}</p></div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4"><Calendar size={20} /></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase">Today</p><p className="text-xl font-bold">{todayCount}</p></div>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3"><User size={14} /></div>
                        <span className="font-medium">{app.userName}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{app.date} <br/> {app.time}</td>
                      <td className="px-6 py-4">
                        {app.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">Pending</span>}
                        {app.status === 'approved' && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Scheduled</span>}
                        {app.status === 'completed' && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">Completed</span>}
                        {app.status === 'cancelled' && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">Cancelled</span>}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        
                        {/* 🆕 CHAT BUTTON */}
                        <button 
                            onClick={() => setActiveChat(app)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition inline-flex items-center"
                            title="Chat"
                        >
                            <MessageCircle size={20} />
                        </button>

                        {/* Existing Actions */}
                        {app.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatus(app._id, 'approved')} className="text-green-600 hover:bg-green-50 p-2 rounded"><Check size={20} /></button>
                            <button onClick={() => handleStatus(app._id, 'cancelled')} className="text-red-600 hover:bg-red-50 p-2 rounded"><X size={20} /></button>
                          </>
                        )}
                        {app.status === 'approved' && (
                           <button onClick={() => openCompleteModal(app)} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">Complete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && <tr><td colSpan="4" className="text-center py-6 text-gray-400">No appointments found.</td></tr>}
                </tbody>
              </table>
            </div>
        </div>
      </div>

      {/* Complete Modal */}
      <Modal isOpen={isCompleteModalOpen} onClose={() => setIsCompleteModalOpen(false)} title="Complete Appointment">
         <form onSubmit={handleComplete} className="space-y-4">
             <div className="bg-gray-50 p-3 rounded border"><p className="text-sm font-bold">Patient: {selectedAppt?.userName}</p></div>
             <textarea value={prescription} onChange={(e)=>setPrescription(e.target.value)} className="w-full border p-3 rounded" placeholder="Rx: Prescription..." rows="4" required></textarea>
             <div>
                <label className="block text-sm font-bold mb-1">Upload Report</label>
                <input type="file" onChange={(e) => setReportFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
             </div>
             <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">{loading ? 'Saving...' : 'Complete Appointment'}</button>
         </form>
      </Modal>

      {/* 🆕 CHAT WINDOW */}
 {activeChat && (
  <ChatBox 
      room={`chat_${activeChat.userId}_${userInfo._id}`} 
      user={userInfo} 
      recipientId={activeChat.userId} 
      closeChat={() => setActiveChat(null)} 
  />
)}

    </div>
  );
};

export default DoctorDashboard;