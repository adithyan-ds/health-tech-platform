import { Link } from "react-router-dom";

const Sidebar = ({ role = "patient" }) => {
  const linksByRole = {
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Doctors", path: "/admin/doctors" },
      { name: "Patients", path: "/admin/patients" },
      { name: "Appointments", path: "/admin/appointments" },
    ],
    doctor: [
      { name: "Dashboard", path: "/doctor" },
      { name: "Appointments", path: "/doctor/appointments" },
      { name: "Prescriptions", path: "/doctor/prescriptions" },
    ],
    patient: [
      { name: "Dashboard", path: "/patient" },
      { name: "Book Appointment", path: "/patient/book-appointment" },
      { name: "My Appointments", path: "/patient/appointments" },
      { name: "Prescriptions", path: "/patient/prescriptions" },
    ],
  };

  const links = linksByRole[role] || linksByRole.patient;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
        Menu
      </h2>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
