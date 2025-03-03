import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { FaArrowLeft } from "react-icons/fa";

interface PostProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    image_url?: string;
    created_at: string;
  };
}

export default function PostPage({ post }: PostProps) {
  if (!post) {
    return (
      <div className="text-center text-gray-500 mt-10">
        🚫 Post no encontrado.
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-dark/80 backdrop-blur-lg rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* 🔙 Botón para Volver */}
      <Link href="/blog">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-secondary hover:text-highlight transition"
        >
          <FaArrowLeft /> Volver al blog
        </motion.button>
      </Link>

      {/* 📌 Imagen del post */}
      {post.image_url && (
        <motion.div
          className="relative w-full h-[350px] rounded-lg overflow-hidden my-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={post.image_url}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg object-cover"
            priority
          />
        </motion.div>
      )}

      {/* 📌 Título y Fecha */}
      <h1 className="text-4xl font-extrabold text-highlight tracking-wide">
        {post.title}
      </h1>
      <p className="text-secondary text-sm mt-1">
        📅 {new Date(post.created_at).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* 📌 Contenido del post con Markdown */}
      <div className="prose prose-invert mt-6">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </motion.div>
  );
}

// ✅ Obtener datos desde Supabase
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.slug || typeof params.slug !== "string") {
    return { notFound: true };
  }

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!data || error) {
    return { notFound: true };
  }

  return { props: { post: data } };
};