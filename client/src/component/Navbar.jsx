import { useState } from "react";
import { ShoppingCart, Paintbrush, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [hover, setHover] = useState(false);

  return (
    <nav className="h-16 w-full bg-[#ff751f] text-white px-6 flex items-center justify-between fixed top-0 z-50">
      <Link to="/artistlogin">
        <div
          className="relative flex items-center gap-2 cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Paintbrush size={25} />
          {hover && (
            <span className="absolute whitespace-nowrap top-8 left-0 font-medium bg-[#fffffff0] text-[#ff751f] px-2 rounded shadow">
              Login as artist
            </span>
          )}
        </div>
      </Link>

      <Link to="/home">
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
