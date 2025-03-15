import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";

interface Post {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
  created_at: string;
  tags: string[];
}

interface BlogProps {
  posts: Post[];
}

export default function Blog({ posts }: BlogProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const categories = ["Todos", "Bitcoin", "Ethereum", "NFTs", "Regulaciones", "Tecnología"];

  const filteredPosts =
    selectedCategory === "Todos"
      ? posts
      : posts.filter((post) => post.tags.includes(selectedCategory.toLowerCase()));

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-primary text-center mb-6">
          📰 Noticias del Mundo Crypto
        </h1>

        {/* Filtros de Categoría */}
        <div className="flex justify-center space-x-3 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? "bg-highlight text-white"
                  : "bg-panel text-secondary hover:bg-highlight/50"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid de Noticias */}
        {filteredPosts.length === 0 ? (
          <p className="text-center text-secondary">No hay noticias disponibles en esta categoría.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <motion.div key={post.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Link href={`/blog/${post.slug}`} passHref>
                  <div className="bg-panel border border-gray-700 shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition">
                    {/* 📌 Imagen */}
                    {post.image_url ? (
                      <div className="relative w-full h-52">
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-52 flex items-center justify-center bg-gray-800 text-gray-500">
                        📷 No hay imagen
                      </div>
                    )}

                    {/* 📌 Información */}
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-primary">{post.title}</h2>
                      <p className="text-secondary text-sm">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Obtener datos desde Supabase
export const getServerSideProps: GetServerSideProps = async () => {
  const { data, error: _error } = await supabase
    .from("news")
    .select("id, title, slug, image_url, created_at, tags")
    .order("created_at", { ascending: false });

  return { props: { posts: data || [] } };
};
