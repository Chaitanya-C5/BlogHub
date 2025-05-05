import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [isLogged, setIsLogged] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 190);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLogged(false);
    navigate("/");
  };

  useEffect(() => {
    setIsLogged(!!(localStorage.username && localStorage.token));
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navLinks = [
    { name: "Home", path: "home" },
    { name: "About", path: "about" },
    { name: "Community", path: "community" }
  ];

  return (
    <div className={`text-white fixed top-0 w-full z-20 transition-colors duration-300 px-4 md:px-8 ${scrolled ? "bg-black/95" : "bg-transparent"}`}>
      <div className="flex items-center justify-between py-2">
        {/* Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/assets/logo.png" alt="logo" className="h-16 md:h-20 lg:h-24" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between w-full">
            {/* Centered Navigation Links */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <nav className="flex items-center gap-6 lg:gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={`#${link.path}`}
                    onClick={() => setActiveLink(link.path)}
                    className={`py-2 ${activeLink === link.path ? "font-bold border-b-2 border-blue-500" : "hover:text-slate-300"}`}
                  >
                    {link.name}
                  </a>
                ))}
                <Link to="/blogs" className="py-2 hover:text-slate-300">
                  Blogs
                </Link>
              </nav>
            </div>

            {/* Right-Aligned Auth Buttons */}
            <div className="ml-auto flex items-center gap-4">
              {!isLogged ? (
                <>
                  <button
                    className="hover:text-slate-300"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="border-2 px-4 py-2 rounded hover:text-slate-300 hover:border-slate-300"
                    onClick={() => navigate("/signup")}
                  >
                    SignUp
                  </button>
                </>
              ) : (
                <button
                  className="border-2 px-4 py-2 rounded hover:text-slate-300 hover:border-slate-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
          </div>


        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 py-4 px-2 mt-2 rounded-lg">
          <nav className="flex flex-col space-y-4 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={`#${link.path}`}
                onClick={() => {
                  setActiveLink(link.path);
                  setMenuOpen(false);
                }}
                className={`py-2 ${activeLink === link.path ? "font-bold border-l-4 pl-2 border-blue-500" : "hover:text-slate-300 pl-2"}`}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="/blogs" 
              className="py-2 hover:text-slate-300 pl-2"
              onClick={() => setMenuOpen(false)}
            >
              Blogs
            </a>
          </nav>
          
          <div className="flex flex-col space-y-3 pt-2 border-t border-gray-700">
            {!isLogged ? (
              <>
                <button 
                  className="w-full py-2 text-left pl-2 hover:bg-gray-800 rounded" 
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                >
                  Login
                </button>
                <button 
                  className="w-full py-2 text-left pl-2 hover:bg-gray-800 rounded" 
                  onClick={() => {
                    navigate("/signup");
                    setMenuOpen(false);
                  }}
                >
                  SignUp
                </button>
              </>
            ) : (
              <button 
                className="w-full py-2 text-left pl-2 hover:bg-gray-800 rounded" 
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;