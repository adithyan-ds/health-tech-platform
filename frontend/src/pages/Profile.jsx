import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Activity, Ruler, Weight, Camera, Save, Edit2 } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    address: '', bloodGroup: '', height: '', weight: '',
    specialization: '', qualification: '', experience: '', fees: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        
        const { data } = await API.get('/users/profile', config);
        setUser(data);
        setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            bloodGroup: data.bloodGroup || '',
            height: data.height || '',
            weight: data.weight || '',
            password: '', 
            specialization: data.specialization || '',
            qualification: data.qualification || '',
            experience: data.experience || '',
            fees: data.fees || ''
        });
        setLoading(false);
      } catch  {
        toast.error('Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const dataPayload = new FormData();
      Object.keys(formData).forEach(key => dataPayload.append(key, formData[key]));
      if (profileImage) dataPayload.append('profilePic', profileImage);

      const { data } = await API.put('/users/profile', dataPayload, {
        headers: { 
            Authorization: `Bearer ${userInfo?.token}`,
            'Content-Type': 'multipart/form-data'
        }
      });
      
      const updatedLocal = { ...userInfo, name: data.name, profilePic: data.profilePic };
      localStorage.setItem('userInfo', JSON.stringify(updatedLocal));
      
      setUser(data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32 relative">
             <div className="absolute -bottom-12 left-8 group">
                <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden">
                   {previewImage || user?.profilePic ? (
                      <img 
  src={
    previewImage 
      ? previewImage 
      : (user?.profilePic 
          ? (user.profilePic.startsWith("http") ? user.profilePic : `${BACKEND_URL}${user.profilePic}`)
          : null
        )
  } 
  alt="Profile" 
  className="w-full h-full object-cover"
/>
                   ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold uppercase">{user?.name?.charAt(0)}</div>
                   )}
                   {isEditing && (
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera className="text-white" size={24} />
                         <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                   )}
                </div>
             </div>
             <div className="absolute top-4 right-6">
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center hover:bg-white/30 transition font-medium">
                        <Edit2 size={16} className="mr-2"/> Edit Profile
                    </button>
                )}
             </div>
          </div>

          <div className="pt-16 px-8 pb-8">
             <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
             <p className="text-blue-600 font-medium capitalize">{user?.role} Account</p>

             <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                   <div className="relative"><User className="absolute left-3 top-3 text-gray-400" size={18}/><input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="w-full pl-10 p-2.5 border rounded-lg disabled:bg-gray-50" /></div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <div className="relative"><Mail className="absolute left-3 top-3 text-gray-400" size={18}/><input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className="w-full pl-10 p-2.5 border rounded-lg disabled:bg-gray-50" /></div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                   <div className="relative"><Phone className="absolute left-3 top-3 text-gray-400" size={18}/><input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className="w-full pl-10 p-2.5 border rounded-lg disabled:bg-gray-50" /></div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                   <div className="relative"><MapPin className="absolute left-3 top-3 text-gray-400" size={18}/><input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} className="w-full pl-10 p-2.5 border rounded-lg disabled:bg-gray-50" placeholder="Your City, Country" /></div>
                </div>

                
                <div className="col-span-full border-t pt-6 mt-2"><h3 className="text-lg font-bold text-gray-800 mb-4">Medical Details</h3></div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                   <div className="relative">
                      <Activity className="absolute left-3 top-3 text-gray-400" size={18}/>
                      <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={!isEditing} className="w-full pl-10 p-2.5 border rounded-lg disabled:bg-gray-50 bg-white">
                         <option value="">Select...</option>
                         <option value="A+">A+</option><option value="A-">A-</option>
                         <option value="B+">B+</option><option value="B-">B-</option>
                         <option value="O+">O+</option><option value="O-">O-</option>
                         <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      </select>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm/ft)</label>
                   <div className="relative"><Ruler className="absolute left-3 top-3 text-gray-400" size={18}/><input type="text" name="height" value={formData.height} onChange={handleChange} disabled={!isEditing} className="w-full pl-10 p-2.5 border rounded-lg disabled:bg-gray-50" placeholder="e.g. 5'9" /></div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                   <div className="relative"><Weight className="absolute left-3 top-3 text-gray-400" size={18}/><input type="text" name="weight" value={formData.weight} onChange={handleChange} disabled={!isEditing} className="w-full pl-10 p-2.5 border rounded-lg disabled:bg-gray-50" placeholder="e.g. 70 kg" /></div>
                </div>

                
                {user?.role === 'doctor' && (
                    <>
                        <div className="col-span-full border-t pt-6 mt-2"><h3 className="text-lg font-bold text-gray-800 mb-4">Professional Details</h3></div>
                        <div><label className="block text-sm font-medium text-gray-700">Specialization</label><input type="text" name="specialization" value={formData.specialization} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 border rounded-lg disabled:bg-gray-50" /></div>
                        <div><label className="block text-sm font-medium text-gray-700">Fees ($)</label><input type="number" name="fees" value={formData.fees} onChange={handleChange} disabled={!isEditing} className="w-full p-2.5 border rounded-lg disabled:bg-gray-50" /></div>
                    </>
                )}

                
                {isEditing && (
                    <div className="col-span-full flex gap-4 mt-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center shadow-lg"><Save size={18} className="mr-2"/> Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-200">Cancel</button>
                    </div>
                )}
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;