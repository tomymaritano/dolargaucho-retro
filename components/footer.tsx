import React from 'react';
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-blue-900 text-white py-6 text-center border-t border-blue-700 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        <p className="text-lg font-medium">© {new Date().getFullYear()} Dólar Gaucho. Todos los derechos reservados.</p>
        
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110">
            <FaGithub size={24} />
          </a>
          <a href="#" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110">
            <FaDiscord size={24} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;