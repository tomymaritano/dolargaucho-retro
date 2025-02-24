import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Layout from "@/components/layout";

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);

  if (!filenames || filenames.length === 0) {
    return { props: { posts: [] } }; // Asegura que `posts` siempre sea un array
  }

  const posts = filenames.map((filename) => {
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
}

export default function Blog({ posts }: { posts?: { slug: string; title: string; date: string; excerpt: string; image: string }[] }) {
  if (!posts || posts.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-2xl text-gray-600">No hay posts disponibles.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Encabezado del Blog */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 py-12 text-center text-white shadow-lg">
        <h1 className="text-4xl font-bold">📖 Blog de Finanzas</h1>
        <p className="text-lg text-gray-200 mt-2">Explora nuestros artículos sobre tecnología, blockchain y fintech</p>
      </div>

      <div className="container mx-auto p-6">
        {/* Grid de Posts Mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Imagen con efecto hover */}
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all"></div>
              </div>

              {/* Contenido del Post */}
              <div className="p-5">
                <p className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString()}</p>
                <Link href={`/blog/${post.slug}`} className="block text-xl font-semibold text-blue-700 hover:text-blue-900 mt-2">
                  {post.title}
                </Link>
                <p className="text-gray-600 mt-2">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}