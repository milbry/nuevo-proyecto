import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase.js";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
export default function Nav({ user }) {
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();
  const [navHeight, setNavHeight] = useState(0);

  const links = [
    { name: "Inicio", to: "/" },
    { name: "Encuesta", to: "/survey" },
    { name: "Contacto", to: "/contact" },
    { name: "Zona VIP", to: "/private" },
  ];

  // Obtener altura del navbar para "espaciador"
  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    const handleResize = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        ref={navRef}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 bg-green-200 shadow-md"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Link
            to="/"
            className="font-extrabold text-2xl flex items-center gap-2 text-black hover:text-green-700 transition-transform duration-300 hover:scale-105"
          >
            🌿 GreenMag
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <motion.div key={link.to} whileHover={{ scale: 1.05 }}>
                <Link
                  to={link.to}
                  className={`relative text-black font-medium transition-colors duration-300 hover:text-green-800 ${
                    location.pathname === link.to ? "underline underline-offset-4 font-semibold" : ""
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>


          {/* User Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <motion.button
                  onClick={() => nav("/profile")}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white text-green-800 px-5 py-1 rounded-lg font-medium hover:bg-green-100 transition shadow-sm"
                >
                  Mi perfil
                </motion.button>
                <motion.button
                  onClick={() => auth.signOut()}
                  whileHover={{ scale: 1.05 }}
                  className="bg-red-100 text-red-700 px-5 py-1 rounded-lg font-medium hover:bg-red-200 transition shadow-sm"
                >
                  Salir
                </motion.button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/auth"
                  className="bg-white text-green-800 px-5 py-1 rounded-lg font-medium hover:bg-green-100 transition shadow-sm"
                >
                  Ingresar
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen((prev) => !prev)}>
              {menuOpen ? <HiX size={28} className="text-black" /> : <HiMenu size={28} className="text-black" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-green-200 overflow-hidden shadow-inner"
            >
              <div className="flex flex-col px-4 py-4 gap-2">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`py-2 px-2 rounded transition-colors duration-300 hover:bg-green-300 ${
                      location.pathname === link.to ? "underline underline-offset-4 text-green-800 font-semibold" : "text-black"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {user ? (
                  <div className="flex flex-col gap-2 mt-3">
                    <button
                      onClick={() => {
                        nav("/profile");
                        setMenuOpen(false);
                      }}
                      className="bg-white text-green-800 px-3 py-1 rounded-lg hover:bg-green-100 transition shadow-sm"
                    >
                      Mi perfil
                    </button>
                    <button
                      onClick={() => {
                        auth.signOut();
                        setMenuOpen(false);
                      }}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition shadow-sm"
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="bg-white text-green-800 px-3 py-1 rounded-lg hover:bg-green-100 transition shadow-sm mt-2"
                  >
                    Ingresar
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer para evitar que navbar tape contenido */}
      <div style={{ height: navHeight }} />
    </>
  );
}
