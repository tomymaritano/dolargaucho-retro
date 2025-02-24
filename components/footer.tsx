import React from "react";
import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/10 backdrop-blur-md border-t border-white/20 text-white py-8 text-center shadow-inner dark:bg-black/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 space-y-4 md:space-y-0">
        
        {/* Texto de derechos reservados */}
        <p className="text-lg font-medium text-gray-300">
          © {new Date().getFullYear()} Dólar Gaucho. Todos los derechos reservados.
        </p>

        {/* Redes sociales con animaciones */}
        <div className="flex space-x-6">
          <a
            href="#"
            className="text-cyan-300 hover:text-white transition-all duration-300 transform hover:scale-125"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-125"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="#"
            className="text-purple-400 hover:text-white transition-all duration-300 transform hover:scale-125"
          >
            <FaDiscord size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;