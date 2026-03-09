import { useEffect, useState, useCallback } from "react";
import API from "../api";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  LogOut,
  CheckCircle,
  AlertCircle,
  Search,
  AlertTriangle,
  Plus 
} from "lucide-react";
import Modal from "../components/ui/Modal.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// eslint-disable-next-line
  const StatCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-8 h-8 ${color.replace("bg-", "text-")}`} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
      </div>
    </div>
  );

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Add Doctor Modal State
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    name: '', email: '', password: '', phone: '', specialization: '', qualification: '', experience: '', fees: ''
  });

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

      // 1. Fetch Users
      const userRes = await API.get("/admin/users", config);
      const userData = userRes.data;
      setUsers(userData);

      const docs = userData.filter((u) => u.role === "doctor");
      setDoctors(docs);
      setPatients(userData.filter((u) => u.role === "user"));
      setPendingCount(docs.filter((d) => !d.isApproved).length);

      // 2. Fetch Complaints
      try {
        const complaintRes = await API.get("/complaints", config);
        setComplaints(complaintRes.data);
      } catch (err) {
        console.error("Complaints fetch error:", err);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchData();
  }, [fetchData]);

  // --- ACTIONS ---

  // 1. Approve/Revoke (✅ FIXED FUNCTION)
  const handleAccountStatus = async (userId, newStatus) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          'Content-Type': 'application/json',
        },
      };

      console.log(`Updating user ${userId} to status: ${newStatus}`);

      // Send the request with userId directly
      const { data } = await API.put(
        `/admin/update-status/${userId}`,
        { status: newStatus }, 
        config
      );

      // Update Local State instantly
      if (data) {
         toast.success(`User ${newStatus === 'approved' ? 'Approved' : 'Revoked'} successfully`);
         
         // Manually update the doctors list to reflect changes immediately
         setDoctors(prevDocs => 
            prevDocs.map(doc => 
                doc._id === userId 
                ? { ...doc, isApproved: newStatus === 'approved' } 
                : doc
            )
         );
         
         // Also update pending count
         if (newStatus === 'approved') setPendingCount(p => Math.max(0, p - 1));
         else setPendingCount(p => p + 1);
      }

    } catch (error) {
      console.error("Update failed:", error.response?.data?.message || error.message);
      toast.error("Failed to update status");
    }
  };

  // 2. Resolve Complaint
  const handleResolveComplaint = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      await API.put(`/complaints/${id}/resolve`, {}, config);
      toast.success("Complaint resolved");
      fetchData();
    } catch  {
      toast.error("Failed to update complaint");
    }
  };

  // 3. Add New Doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      
      await API.post('/admin/add-doctor', newDoctorData, config);
      
      toast.success('Doctor added successfully!');
      setIsAddDoctorModalOpen(false);
      setNewDoctorData({ name: '', email: '', password: '', phone: '', specialization: '', qualification: '', experience: '', fees: '' }); 
      fetchData(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add doctor');
    }
  };

  const handleInputChange = (e) => {
    setNewDoctorData({ ...newDoctorData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // --- HELPER: CERTIFICATE MODAL ---
  const openCertificateModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsCertModalOpen(true);
  };
  const closeCertificateModal = () => {
    setSelectedDoctor(null);
    setIsCertModalOpen(false);
  };

  // --- COMPONENT: STAT CARD ---
  


  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* 🟢 SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl flex flex-col z-10">
        <div className="p-6 border-b flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
          <span className="text-xl font-bold text-gray-800">HealthAdmin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab("overview")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === "overview" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
            <LayoutDashboard size={20} className="mr-3" /> Overview
          </button>
          <button onClick={() => setActiveTab("doctors")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === "doctors" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
            <Stethoscope size={20} className="mr-3" /> Doctors
            {pendingCount > 0 && <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-bold">{pendingCount}</span>}
          </button>
          <button onClick={() => setActiveTab("patients")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === "patients" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
            <Users size={20} className="mr-3" /> Patients
          </button>
          <button onClick={() => setActiveTab("complaints")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === "complaints" ? "bg-red-50 text-red-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}>
            <AlertTriangle size={20} className="mr-3" /> Complaints
            {complaints.filter((c) => c.status === "pending").length > 0 && <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-bold">{complaints.filter((c) => c.status === "pending").length}</span>}
          </button>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* 🟢 MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "doctors" && "Doctors Management"}
              {activeTab === "patients" && "Patient Records"}
              {activeTab === "complaints" && "Support Tickets"}
            </h1>
            <p className="text-gray-500 text-sm">Welcome back, Admin</p>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        
        {activeTab === "overview" && (
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            
            <StatCard title="Total Users" count={users.length} icon={Users} color="bg-blue-500" />
            <StatCard title="Active Doctors" count={doctors.filter((d) => d.isApproved).length} icon={CheckCircle} color="bg-emerald-500" />
            <StatCard title="Pending Approvals" count={pendingCount} icon={AlertCircle} color="bg-amber-500" />
            <StatCard title="Open Complaints" count={complaints.filter((c) => c.status === "pending").length} icon={AlertTriangle} color="bg-red-500" />
          </div>
        )}

        {/* DOCTORS TAB */}
        {activeTab === "doctors" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-gray-700">Medical Staff</h3>
               <button 
                 onClick={() => setIsAddDoctorModalOpen(true)}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm"
               >
                 <Plus size={16} className="mr-2" /> Add New Doctor
               </button>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th className="p-4">Doctor Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{doc.name}</td>
                    <td className="p-4 text-gray-500">{doc.email}</td>
                    <td className="p-4">
                      {doc.isApproved ? (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit"><CheckCircle size={12} className="mr-1"/> Approved</span>
                      ) : (
                        <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit"><AlertCircle size={12} className="mr-1"/> Pending</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {doc.certificateUrl && (
                        <button onClick={() => openCertificateModal(doc)} className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 px-3 py-1.5 rounded-lg">View Cert</button>
                      )}
                      
                      {/* ✅ FIXED BUTTON: Sends ID and STRING status ('approved' or 'rejected') */}
                      <button 
                        onClick={() => handleAccountStatus(doc._id, doc.isApproved ? 'rejected' : 'approved')}
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg border ${doc.isApproved ? 'text-red-600 border-red-200 hover:bg-red-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {doc.isApproved ? 'Revoke' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PATIENTS TAB */}
        {activeTab === "patients" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Patient Directory</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
                  <input type="text" placeholder="Search patients..." className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-blue-500 w-64"/>
                </div>
             </div>
             <table className="w-full text-left">
              <thead className="bg-white text-gray-500 text-xs uppercase border-b">
                <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-gray-500">{p.email}</td>
                    <td className="p-4 text-gray-400 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === "complaints" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-4 border-b bg-red-50 text-red-800 font-bold">User Complaints</div>
             <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase border-b">
                <tr><th className="p-4">User</th><th className="p-4">Issue</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{c.userName}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{c.subject}</div>
                      <div className="text-sm text-gray-500">{c.description}</div>
                    </td>
                    <td className="p-4">
                      {c.status === 'pending' ? <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs font-bold">Pending</span> : <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-bold">Resolved</span>}
                    </td>
                    <td className="p-4 text-right">
                      {c.status === 'pending' && <button onClick={() => handleResolveComplaint(c._id)} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700">Resolve</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* 🟢 MODAL: VIEW CERTIFICATE */}
      <Modal isOpen={isCertModalOpen} onClose={closeCertificateModal} title="Doctor Certificate" size="xl">
        {selectedDoctor?.certificateUrl ? (
          <img src={`${BACKEND_URL}${selectedDoctor.certificateUrl}`} alt="Certificate" className="w-full max-h-[70vh] object-contain rounded-xl border" />
        ) : <p>No certificate found.</p>}
      </Modal>

      {/* 🟢 MODAL: ADD NEW DOCTOR */}
      <Modal isOpen={isAddDoctorModalOpen} onClose={() => setIsAddDoctorModalOpen(false)} title="Add New Doctor">
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-gray-500 uppercase">Name</label><input name="name" onChange={handleInputChange} value={newDoctorData.name} required className="w-full p-2 border rounded" /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Phone</label><input name="phone" onChange={handleInputChange} value={newDoctorData.phone} required className="w-full p-2 border rounded" /></div>
          </div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Email</label><input type="email" name="email" onChange={handleInputChange} value={newDoctorData.email} required className="w-full p-2 border rounded" /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase">Password</label><input type="password" name="password" onChange={handleInputChange} value={newDoctorData.password} required className="w-full p-2 border rounded" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Specialization</label>
              <select name="specialization" onChange={handleInputChange} value={newDoctorData.specialization} required className="w-full p-2 border rounded">
                  <option value="">Select...</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="General Physician">General Physician</option>
              </select>
            </div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Qualification</label><input name="qualification" onChange={handleInputChange} value={newDoctorData.qualification} required className="w-full p-2 border rounded" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-gray-500 uppercase">Experience (Yrs)</label><input type="number" name="experience" onChange={handleInputChange} value={newDoctorData.experience} required className="w-full p-2 border rounded" /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Fees ($)</label><input type="number" name="fees" onChange={handleInputChange} value={newDoctorData.fees} required className="w-full p-2 border rounded" /></div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Create Doctor Account</button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;