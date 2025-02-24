import { ReactNode } from "react";
import Navbar from "../navbar";
import Footer from "../footer";

interface PostLayoutProps {
  children: ReactNode;
}

const PostLayout: React.FC<PostLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 container mx-auto  p-16 max-w-3xl">{children}</main>
      <Footer />
    </div>
  );
};

export default PostLayout;