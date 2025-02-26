import "@/styles/globals.css";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";

// Configurar Orbitron con Next.js
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });


export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Navbar />
      <Component {...pageProps} />
    </main>
  );
}