import React from 'react';
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#121826] text-white py-8 text-center border-t border-gray-700 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">

        {/* 📌 Texto de derechos reservados */}
        <p className="text-lg font-semibold text-gray-300">
          © {new Date().getFullYear()} <span className="text-white font-bold">Dólar Gaucho</span>. Todos los derechos reservados.
        </p>

        {/* 📌 Redes sociales */}
        <div className="flex space-x-6 mt-6 md:mt-0">
          <a 
            href="https://twitter.com/tomymaritano" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-[#1DA1F2] transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <FaTwitter size={26} />
          </a>
          <a 
            href="https://github.com/tomymaritano" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <FaGithub size={26} />
          </a>
          <a 
            href="https://discord.gg/tu-servidor" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-[#5865F2] transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <FaDiscord size={26} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;