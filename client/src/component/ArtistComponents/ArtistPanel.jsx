import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserCog,
  Image,
  ShoppingCart,
  Menu,
  LogOut
} from "lucide-react";

const ArtistPanel = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 2. Redirect the user to the login or home page[cite: 21]
    alert("Logged out successfully");
    navigate("/artistlogin"); 
  };

  const navItems = [
    { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "artwork", label: "Artwork", icon: Image },
    { to: "order", label: "Order", icon: ShoppingCart },
    { to: "profile", label: "Profile", icon: UserCog },
    // Label it as a logout action instead of just a link[cite: 22]
    { label: "Log Out", icon: LogOut, isLogout: true },
  ];

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-gray-100">
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-white shadow-sm border-gray-500 p-4 z-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#ff751f]">Artist Panel</h2>
          <button onClick={() => setOpen(!open)}>
            <Menu size={22} />
          </button>
        </div>

        {open && (
          <div className="mt-4 flex flex-col gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-[#ff751f]/10 text-[#ff751f] font-medium"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-300 flex-col shrink-0">
        <div className="p-6 text-2xl font-bold text-[#ff751f]">
          Artist Panel
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-[#ff751f]/10 text-[#ff751f] font-medium"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ArtistPanel;
