import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase.js";
import { motion, AnimatePresence } from "framer-motion";
// AÑADIR EL ICONO DEL CARRITO
import { HiMenu, HiX, HiShoppingCart, HiUserCircle } from "react-icons/hi"; 

export default function Nav({ user }) {
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();
  const [navHeight, setNavHeight] = useState(0);

  // --- ENLACES ACTUALIZADOS: AÑADIMOS PLANTAS Y ACCESORIOS MÁS CLARO ---
  const links = [
    { name: "Inicio", to: "/" },
    // Aseguramos que la lista de productos principal tenga una ruta explícita si Home es solo la landing
    { name: "Plantas", to: "/grid" }, 
    { name: "Accesorios", to: "/accessories" }, 
    { name: "Encuesta", to: "/survey" },
    { name: "Contacto", to: "/contact" },
    { name: "Zona VIP", to: "/private" },
  ];
  // ----------------------------------------------------------------------

  // Obtener altura del navbar para "espaciador"
  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    const handleResize = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Función de cierre de menú y navegación
  const handleNavClick = (to) => {
    nav(to);
    setMenuOpen(false);
  }

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


          {/* User and Cart Buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* --- 🛒 ENLACE AL CARRITO (NUEVO) --- */}
            <motion.div whileHover={{ scale: 1.1 }}>
                <Link
                    to="/cart"
                    className="p-2 rounded-full text-black hover:bg-white hover:text-green-700 transition"
                    title="Ver Carrito de Compras"
                >
                    <HiShoppingCart size={24} />
                    {/* Indicador de ítems, si se implementa */}
                    {/* <span className="absolute top-0 right-0 inline-flex items-center justify-center ...">3</span> */}
                </Link>
            </motion.div>
            
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

          {/* Mobile menu button (and Cart/User for mobile) */}
          <div className="md:hidden flex items-center gap-3">
            {/* 🛒 Ícono del Carrito para móvil */}
            <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-full text-black hover:text-green-700 transition"
                title="Ver Carrito de Compras"
            >
                <HiShoppingCart size={28} />
            </Link>
            
            <button onClick={() => setMenuOpen((prev) => !prev)}>
              {menuOpen ? <HiX size={30} className="text-black" /> : <HiMenu size={30} className="text-black" />}
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

                {/* Separador */}
                <hr className="my-2 border-green-300" />
                
                {user ? (
                  <div className="flex flex-col gap-2 mt-3">
                    <button
                      onClick={() => handleNavClick("/profile")}
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
                    className="bg-white text-green-800 px-3 py-1 rounded-lg hover:bg-green-100 transition shadow-sm mt-2 text-center"
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