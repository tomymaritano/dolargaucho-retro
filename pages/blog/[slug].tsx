import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticProps, GetStaticPaths } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Layout from "@/components/layout";
import Image from "next/image";
import Head from "next/head";
import { motion } from "framer-motion";

interface BlogPost {
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace(".md", "") },
  }));

  return {
    paths,
    fallback: "blocking", // Permite generar nuevas páginas dinámicamente
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const filePath = path.join(process.cwd(), "posts", `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    props: {
      post: {
        title: data.title || "Post sin título",
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || "",
        image: data.image || "/images/default.jpg",
        content,
      },
    },
  };
};

export default function BlogPost({ post }: { post: BlogPost }) {
  return (
    <Layout>
      <Head>
        <title>{post.title} | Noticias Financieras</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white min-h-screen py-16"
      >
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Encabezado del Post */}
          <div className="mb-10 text-center">
            <h1 className="text-6xl font-bold tracking-tight text-[#00ffcc]">{post.title}</h1>
            <p className="text-lg text-gray-400 mt-3 uppercase">
              {new Date(post.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Imagen Destacada con Overlay */}
          <div className="relative rounded-lg overflow-hidden shadow-xl mb-10">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={600}
              layout="responsive"
              priority={true}
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Contenido del Post con Mejor Estilo */}
          <article className="prose lg:prose-lg dark:prose-invert mx-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </article>
        </div>
      </motion.div>
    </Layout>
  );
}