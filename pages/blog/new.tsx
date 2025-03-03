import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

export default function NewPost() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Generar slug (URL amigable)
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    let imageUrl = "";
    if (image) {
      const fileName = `news/${uuidv4()}.${image.name.split(".").pop()}`;
      const { data, error } = await supabase.storage.from("news-images").upload(fileName, image);

      if (error) {
        setMessage("Error al subir la imagen.");
        setLoading(false);
        return;
      }

      // Obtener la URL pública de la imagen
      const { data: publicUrlData } = supabase.storage.from("news-images").getPublicUrl(data.path);
      imageUrl = publicUrlData.publicUrl;
    }

    // Insertar la noticia en Supabase
    const { error } = await supabase.from("news").insert([
      {
        title,
        slug,
        content,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      }
    ]);

    setLoading(false);

    if (error) {
      setMessage("Error al publicar la noticia.");
    } else {
      setMessage("Noticia publicada con éxito.");
      setTitle("");
      setContent("");
      setImage(null);
      router.push("/blog");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">📢 Nueva Noticia</h1>

      {message && <p className="text-gray-300 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
        />

        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
          rows={5}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
        />

        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}