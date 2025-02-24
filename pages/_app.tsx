import "@/styles/globals.css";
import { Rajdhani } from "@next/font/google";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";

// Configurar Orbitron con Next.js
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "700"] });


export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={rajdhani.className}>
      <Navbar />
      <Component {...pageProps} />
    </main>
  );
}