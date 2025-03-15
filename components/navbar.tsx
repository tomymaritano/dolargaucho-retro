import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaGithub,
  FaTwitter,
  FaUserCircle,
  FaFileContract,
} from "react-icons/fa";
import AvisoLegal from './aviso-legal';

interface SocialItem {
  label: string;
  icon: React.ReactElement;
  href: string;
}

const socialItems: SocialItem[] = [
  {
    label: "GitHub",
    icon: <FaGithub />,
    href: "https://github.com/tomymaritano",
  },
  {
    label: "Twitter",
    icon: <FaTwitter />,
    href: "https://twitter.com/hacklabdog",
  },
  {
    label: "Portfolio",
    icon: <FaUserCircle />,
    href: "https://www.xope.io",
  },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLegalPopup = () => {
    setIsLegalOpen(!isLegalOpen);
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 backdrop-blur-md transition duration-300 ${
        isScrolled ? "bg-[#121826]/80 shadow-lg" : "bg-[#121826]/60"
      } border-b border-gray-800`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" width={40} height={40} alt="Dolar Gaucho" />
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-gray-200">
          <button onClick={toggleLegalPopup} className="flex items-center gap-2 hover:text-[#A78BFA] transition">
            <FaFileContract /> Aviso Legal
          </button>
          {socialItems.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-[#A78BFA] transition"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-gray-200 text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#1c1f2e]/90 backdrop-blur-lg px-6 py-4 text-gray-200">
          <button onClick={toggleLegalPopup} className="block py-2 hover:text-[#A78BFA] transition">
            <FaFileContract /> Aviso Legal
          </button>
          {socialItems.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-[#A78BFA] transition"
            >
              {social.icon}
            </a>
          ))}
        </div>
      )}

      {isLegalOpen && <AvisoLegal onClose={() => setIsLegalOpen(false)} />}
    </nav>
  );
};

export default Navbar;