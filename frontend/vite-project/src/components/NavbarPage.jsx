import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-900 to-black shadow-lg border-b border-red-700 z-50"
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-white text-2xl font-bold cursor-pointer"
          >
            AnimeHub
          </motion.div>
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <NavItem to="/" text="Home" />
          <NavItem to="/animelist" text="Anime List" />
          <NavItem to="/about" text="About Us" />
          {isLoggedIn ? (
            <button
              className="bg-red-500 text-white font-bold rounded-full px-4 py-2 shadow-lg hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-white text-gray-800 font-bold rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition"
              onClick={() => navigate("/signup")}
            >
              Sign Up / Login
            </button>
          )}
        </div>

        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-black flex flex-col space-y-4 p-4 text-white border-t border-red-700"
        >
          <NavItem to="/" text="Home" mobile onClick={toggleMenu} />
          <NavItem to="/animelist" text="Anime List" mobile onClick={toggleMenu} />
          <NavItem to="/about" text="About Us" mobile onClick={toggleMenu} />
          {isLoggedIn ? (
            <button
              className="bg-red-500 text-white font-bold rounded-full px-4 py-2 shadow-lg hover:bg-red-600 transition w-full"
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-white text-gray-800 font-bold rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition w-full"
              onClick={() => {
                navigate("/signup");
                toggleMenu();
              }}
            >
              Sign Up / Login
            </button>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

const NavItem = ({ to, text, mobile, onClick }) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.5)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.9 }}
      className={`cursor-pointer text-white font-semibold px-4 py-2 rounded-md ${mobile ? "text-center" : ""}`}
    >
      {text}
    </motion.div>
  </Link>
);

export default Navbar;