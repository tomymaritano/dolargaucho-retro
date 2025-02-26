import { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black transition-colors duration-300 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Contenido Principal con Animación */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex justify-center pt-20"
      >
        <div className="w-full max-w-7xl px-6">{children}</div>
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;