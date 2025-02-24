import { ReactNode } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Ajustamos margen superior para evitar superposición */}
      <main className="flex-1 flex justify-center items-center mt-20 px-4">
        <div className="w-full max-w-7xl">{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;