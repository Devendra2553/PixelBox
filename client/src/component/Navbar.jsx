import { useState } from "react";
import { ShoppingCart, Paintbrush, Menu, X } from "lucide-react"; // Added Menu/X for mobile clarity
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); //

  const toggleMenu = () => {
    setIsOpen((prev) => !prev); //
  };

  return (
    <nav className="h-16 w-full bg-[#ff751f] text-white px-4 md:px-10 flex items-center justify-between fixed top-0 z-50 shadow-md">
      {/* --- LEFT SECTION: LOGIN MENU --- */}
      <div className="relative flex items-center gap-2">
        <button
          onClick={toggleMenu}
          className="hover:scale-110 transition-transform focus:outline-none"
          aria-label="Toggle login menu"
        >
          {isOpen ? <X size={25} /> : <Paintbrush size={25} />}
        </button>

        {isOpen && (
          <>
            {/* Mobile Backdrop: Closes menu when clicking outside */}
            <div
              className="fixed inset-0 bg-black/20 z-[-1] md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <div className="absolute top-12 left-0 flex flex-col min-w-45 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200">
              <Link
                className="text-[#ff751f] py-2.5 px-4 font-bold hover:scale-110 transition-all border-b border-gray-50"
                to="/userlogin"
                onClick={() => setIsOpen(false)}
              >
                Login as Customer
              </Link>
              <Link
                className="text-[#ff751f] py-2.5 px-4 font-bold hover:scale-110 transition-all border-b border-gray-50"
                to="/artistlogin"
                onClick={() => setIsOpen(false)}
              >
                Login as Artist
              </Link>
              <Link
                className="text-[#ff751f] py-2.5 px-4 font-bold hover:scale-110 transition-all"
                to="/adminlogin"
                onClick={() => setIsOpen(false)}
              >
                Login as Admin
              </Link>
            </div>
          </>
        )}
      </div>

      {/* --- CENTER SECTION: LOGO --- */}
      <Link to="/" className="absolute left-1/2 -translate-x-1/2">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter">
          PixelBox
        </h1>
      </Link>

      {/* --- RIGHT SECTION: CART --- */}
      <Link to="/cart" className="hover:scale-110 transition-transform">
        <div className="relative p-1">
          <ShoppingCart size={25} />
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
