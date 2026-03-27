import { useState } from "react";
import { ShoppingCart, Paintbrush, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="h-16 w-full bg-[#ff751f] text-white px-6 flex items-center justify-between fixed top-0 z-50">
      <div
        className="relative flex items-center gap-2 cursor-pointer"
        onClick={toggleMenu}
      >
        <Paintbrush size={25} />
        {isOpen && (
          <span className="absolute whitespace-nowrap flex flex-col top-8 left-0 font-medium">
            <Link
              className="bg-[#fffffff0] text-[#ff751f] py-1 px-2 rounded shadow m-1 hover:bg-orange-200"
              to="/artistlogin"
            >
              Login as artist
            </Link>
            <Link
              className="bg-[#fffffff0] text-[#ff751f] py-1 px-2 rounded shadow m-1 hover:bg-orange-200"
              to="/userlogin"
            >
              Login as customer
            </Link>
          </span>
        )}
      </div>

      <Link to="/">
        <h1 className="text-3xl font-bold tracking-wide">PixelBox</h1>
      </Link>

      <Link to="/cart">
        <div className="cursor-pointer">
          <ShoppingCart size={25} />
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
