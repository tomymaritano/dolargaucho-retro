import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: " ¿Cómo se actualizan las cotizaciones?",
    answer:
      "Las cotizaciones en Dólar Gaucho se actualizan en tiempo real a través de diversas fuentes financieras confiables.",
  },
  {
    question: " ¿Cuáles son los tipos de cambio que puedo consultar?",
    answer:
      "Puedes ver el dólar Oficial, Blue, MEP, CCL y Crypto, además de referencias económicas como inflación y riesgo país.",
  },
  {
    question: " ¿Dólar Gaucho es un sitio oficial?",
    answer:
      "No, Dólar Gaucho es un servicio independiente que brinda información actualizada sobre el mercado cambiario en Argentina.",
  },
  {
    question: " ¿Puedo usar la API de Dólar Gaucho?",
    answer:
      "Actualmente no contamos con una API pública, pero estamos trabajando en ello. ¡Pronto más novedades!",
  },
];

const Faqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    contentRefs.current.forEach((ref, idx) => {
      if (ref) {
        ref.style.maxHeight = idx === openIndex ? `${ref.scrollHeight}px` : "0px";
      }
    });
  }, [openIndex]);

  return (
    <section className="w-full py-20 bg-gradient-to-b from-[#121826] to-[#1c1f2e] text-white flex flex-col items-center">
      <div className="max-w-3xl px-6">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-100">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#181B2B] border border-[#2D2F3E] rounded-xl shadow-md overflow-hidden transition-all"
            >
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center text-lg font-semibold bg-[#1E2235] hover:bg-[#2A2F47] transition-all duration-300"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-white">{faq.question}</span>
                <FaChevronDown
                  className={`text-gray-400 transition-transform ${openIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>

              <div
                ref={(el) => { contentRefs.current[index] = el; }}
                className="px-6 text-gray-300 overflow-hidden transition-all duration-300 max-h-0 bg-[#1B1E2A]"
              >
                <p className="py-3">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;