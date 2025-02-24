import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticProps, GetStaticPaths } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Layout from "@/components/layout";
import InvestmentChart from "@/components/investmentchart";

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
    fallback: false,
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
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <div className="container mx-auto p-6 max-w-3xl">
          {/* Título */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
          <p className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString()}</p>

          {/* Imagen Destacada */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover mt-4 rounded-lg shadow-lg"
          />

          {/* Contenido del Markdown */}
          <article className="prose lg:prose-lg dark:prose-invert mx-auto mt-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </Layout>
  );
}