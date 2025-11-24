import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white overflow-hidden">
      {/* Fondo animado sutil */}
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-repeat animate-pulse-slow"></div>

      <div className="relative container mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Sobre la revista */}
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold mb-3 tracking-wide drop-shadow-lg">
            GreenMag
          </h2>
          <p className="text-green-100 max-w-sm leading-relaxed">
            Tu fuente de inspiración sobre plantas y naturaleza. Descubre artículos, consejos y novedades del mundo verde.
          </p>
        </div>

        {/* Enlaces útiles */}
        <div className="flex-1">
          <h3 className="font-semibold text-xl mb-3">Enlaces</h3>
          <ul className="space-y-2 text-green-100">
            <li>
              <a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-2">
                Inicio
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-2">
                Artículos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-2">
                Contacto
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-2">
                Nosotros
              </a>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="flex-1">
          <h3 className="font-semibold text-xl mb-3">Síguenos</h3>
          <div className="flex space-x-5">
            <a
              href="#"
              className="text-white hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="#"
              className="text-white hover:text-sky-300 transition-all duration-300 transform hover:scale-110"
            >
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior con sombra y tipografía fina */}
      <div className="border-t border-green-300 mt-8 pt-4 text-center text-green-100 text-sm tracking-wide">
        &copy; {new Date().getFullYear()} GreenMag — Todos los derechos reservados
      </div>
    </footer>
  );
}
