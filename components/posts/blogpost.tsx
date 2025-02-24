import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PostLayout from "./postlayout";

interface BlogPostProps {
  content: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ content }) => {
  // 1️⃣ Buscar bloques de código JSON en el Markdown
  const regex = /```json\n([\s\S]*?)\n```/g;
  const matches = [...content.matchAll(regex)];

  let jsonData: { title?: string; data?: { año: number; valor: number }[] } | null = null;
  let contentWithoutJson = content;

  if (matches.length > 0) {
    try {
      jsonData = JSON.parse(matches[0][1].trim()); // Convertir JSON
      contentWithoutJson = content.replace(matches[0][0], ""); // Eliminar JSON del Markdown
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  return (
    <PostLayout> {/* 🔹 Envolver todo con el layout */}
      <div className="prose prose-lg max-w-none text-gray-900 leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {contentWithoutJson} 
        </ReactMarkdown>

        {/* Renderizar el gráfico si el JSON es válido */}
        {jsonData && jsonData.data && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{jsonData.title || "Gráfico"}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jsonData.data}>
                <XAxis dataKey="año" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Mostrar un error si el JSON no se pudo procesar */}
        {matches.length > 0 && !jsonData && (
          <p className="text-red-500 text-center mt-4">⚠️ Error al procesar el JSON. Verifica la sintaxis.</p>
        )}
      </div>
    </PostLayout>
  );
};

export default BlogPost;