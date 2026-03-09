import { useEffect, useState } from 'react';
import API from '../api';
import Navbar from '../components/layout/Navbar';
import BookingModal from '../components/BookingModal';
import Modal from '../components/ui/Modal';
import ChatBox from '../components/layout/ChatBox';
import ComplaintModal from '../components/layout/ComplaintModal';
import { AlertTriangle } from 'lucide-react'; // Add AlertTriangle to your lucide-react imports // 🆕 Import ChatBox
import { Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, FileText, Download, MessageCircle } from 'lucide-react';

const Home = () => {
  // --- STATE ---
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 

  // Prescription State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  // Chat State
  const [activeChat, setActiveChat] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        
        // Fetch Doctors
        const docs = await API.get('/doctors/getAll', config);
        setDoctors(docs.data);

        // Fetch My Appointments
        const apps = await API.get('/appointments/my-appointments', config);
        setAppointments(apps.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [refreshKey]);

  // --- HELPERS ---
  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit"><CheckCircle size={12} className="mr-1"/> Scheduled</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit"><XCircle size={12} className="mr-1"/> Cancelled</span>;
      case 'completed': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit"><CheckCircle size={12} className="mr-1"/> Completed</span>;
      default: return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center w-fit"><AlertCircle size={12} className="mr-1"/> Pending</span>;
    }
  };

  const openPrescriptionModal = (appt) => {
    setSelectedAppt(appt);
    setIsPrescriptionModalOpen(true);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* 🗓️ MY APPOINTMENTS SECTION */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="mr-2 text-blue-600" /> My Appointments
          </h2>

          {appointments.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3">Doctor</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {appointments.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-800">Dr. {app.doctorName}</td>
                        <td className="px-6 py-4 text-gray-600">{app.date}</td>
                        <td className="px-6 py-4 text-gray-600">{app.time}</td>
                        <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                        
                        <td className="px-6 py-4 text-right space-x-2">
                            {app.status === 'completed' && (
                                <>
                                    <button onClick={() => openPrescriptionModal(app)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition inline-flex items-center text-sm font-medium" title="View Prescription">
                                        <FileText size={16} className="mr-1"/> Rx
                                    </button>
                                    {app.reportUrl && (
                                        <a href={`${BACKEND_URL}${app.reportUrl}`} target="_blank" rel="noreferrer" className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition inline-flex items-center text-sm font-medium" title="Download Report">
                                            <Download size={16} className="mr-1"/> Report
                                        </a>
                                    )}
                                </>
                            )}
                            {app.status !== 'completed' && <span className="text-gray-300 text-sm">--</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center text-blue-800">
              <p>You haven't booked any appointments yet.</p>
            </div>
          )}
        </div>

        {/* 👨‍⚕️ FIND DOCTORS SECTION */}
        <div className="text-center mb-10 border-t pt-10">
          <h1 className="text-3xl font-bold text-gray-800">Find Your Specialist</h1>
          <p className="text-gray-500 mt-2">Book appointments or chat with top-rated doctors.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 🟢 FILTER: Only show ONLINE doctors */}
          {doctors.filter(doc => doc.isAvailable).map((doc) => (
            <div key={doc._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {doc.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{doc.name}</h3>
                    <p className="text-blue-600 text-sm font-medium">{doc.specialization}</p>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1">● Online</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                   <p className="flex items-center"><Clock size={16} className="mr-2 text-gray-400"/> {doc.experience} Years Exp.</p>
                   <p className="flex items-center"><DollarSign size={16} className="mr-2 text-gray-400"/> <span className="font-bold text-green-600">${doc.fees}</span></p>
                </div>

                <div className="space-y-2">
                    <button 
                    onClick={() => setSelectedDoctor(doc)} 
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                    >
                    <Calendar size={18} className="mr-2" /> Book Now
                    </button>
                    
                    {/* 🆕 CHAT BUTTON */}
                    <button 
                    onClick={() => setActiveChat(doc._id)} 
                    className="w-full bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-lg font-medium hover:bg-green-100 transition flex items-center justify-center"
                    >
                    <MessageCircle size={18} className="mr-2" /> Chat Now
                    </button>
                </div>
              </div>
            </div>
          ))}

          {/* Message if NO doctors are online */}
          {doctors.filter(doc => doc.isAvailable).length === 0 && (
             <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg font-medium">No doctors are currently online.</p>
                <p className="text-gray-400 text-sm">Please check back later or contact support.</p>
             </div>
          )}
        </div>
      </div>

      {/* 🟢 BOOKING MODAL */}
      {selectedDoctor && (
        <BookingModal 
          doctor={selectedDoctor} 
          onClose={() => {
            setSelectedDoctor(null);
            setRefreshKey(prev => prev + 1); 
          }} 
        />
      )}

      {/* 🟢 PRESCRIPTION VIEW MODAL */}
      <Modal isOpen={isPrescriptionModalOpen} onClose={() => setIsPrescriptionModalOpen(false)} title="Medical Prescription">
         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex justify-between">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Doctor</p>
                    <p className="font-medium text-gray-800">Dr. {selectedAppt?.doctorName}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                    <p className="font-medium text-gray-800">{selectedAppt?.date}</p>
                </div>
            </div>
         </div>
         <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Prescription / Notes</p>
            <div className="bg-white p-4 border rounded-lg text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[120px] shadow-inner">
                {selectedAppt?.prescription || "No notes provided by the doctor."}
            </div>
         </div>
      </Modal>

      {/* 🟢 CHAT WINDOW */}
  {activeChat && (
  <ChatBox 
      room={`chat_${userInfo._id}_${activeChat}`} 
      user={userInfo} 
      recipientId={activeChat} // 👈 Pass Doctor ID as recipient
      closeChat={() => setActiveChat(null)} 
  />
)}
{/* 🔴 FLOATING REPORT ISSUE BUTTON */}
      <button 
        onClick={() => setIsComplaintModalOpen(true)}
        className="fixed bottom-6 left-6 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-full shadow-lg hover:bg-red-50 transition flex items-center font-bold text-sm z-40"
      >
        <AlertTriangle size={16} className="mr-2" />
        Report Issue
      </button>

      {/* 🔴 COMPLAINT MODAL */}
      <ComplaintModal 
        isOpen={isComplaintModalOpen} 
        onClose={() => setIsComplaintModalOpen(false)} 
      />
    </div>
  );
};

export default Home;