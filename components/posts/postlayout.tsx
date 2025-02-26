import { ReactNode } from "react";
import Navbar from "../navbar";
import Footer from "../footer";

interface PostLayoutProps {
  children: ReactNode;
}

const PostLayout: React.FC<PostLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar fijo con sombra para mejor separación */}
      <Navbar />

      {/* Contenedor Principal con mejor espaciado y UX */}
      <main className="flex-1 container mx-auto px-6 lg:px-16 py-20 max-w-4xl">
        <div className="border border-gray-800 bg-black/50 p-8 rounded-xl shadow-lg">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PostLayout;