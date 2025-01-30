// components/Footer.tsx
import React from 'react';
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-purple-900 to-pink-700 text-yellow-300 py-6 text-center font-mono border-t border-yellow-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <p className="text-lg font-bold">© {new Date().getFullYear()} Dólar Retro. Todos los derechos reservados.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-yellow-400 hover:text-pink-400 transition-all duration-300">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-yellow-400 hover:text-pink-400 transition-all duration-300">
            <FaGithub size={24} />
          </a>
          <a href="#" className="text-yellow-400 hover:text-pink-400 transition-all duration-300">
            <FaDiscord size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
