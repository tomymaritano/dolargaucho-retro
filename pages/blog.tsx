import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Layout from "@/components/layout";
import { GetStaticProps } from "next";
import { motion } from "framer-motion";

// 🔹 Definir la interfaz del BlogPost
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
}

// 🔹 Obtener los posts en tiempo de compilación
export const getStaticProps: GetStaticProps = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts: BlogPost[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(".md", ""),
      title: data.title || "Post sin título",
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || "No hay descripción disponible.",
      image: data.image || "/images/default.jpg",
    };
  });

  return {
    props: {
      posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    },
  };
};

// 🔹 Definir el tipo de las props del Blog
interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
  return (
    <Layout>
      {/* 🔥 Hero Section */}
      <section className="relative bg-black text-white text-center py-24 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <h1 className="text-6xl font-extrabold tracking-tight text-[#007aff] uppercase">
            📰 Blog Financiero
          </h1>
          <p className="text-2xl text-gray-400 mt-4 max-w-3xl mx-auto">
            Análisis profundo sobre <span className="text-[#00ffcc] font-semibold">mercados, blockchain y finanzas globales.</span>
          </p>
        </div>
      </section>

      {/* 📚 Grid de Posts */}
      <section className="container mx-auto py-20 px-6">
        {posts.length === 0 ? (
          <p className="text-3xl text-gray-400 text-center">No hay artículos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {posts.map((post: BlogPost) => (
              <motion.div
                key={post.slug}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                {/* 🖼 Imagen con Overlay */}
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-all"></div>
                </div>

                {/* 📌 Contenido del Post */}
                <div className="p-6">
                  <p className="text-sm text-gray-400">
                    {new Date(post.date).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block text-2xl font-bold text-white hover:text-[#00ffcc] mt-3 transition-all"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-300 mt-4">{post.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}