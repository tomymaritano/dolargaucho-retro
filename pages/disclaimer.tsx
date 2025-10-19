/**
 * Descargo de Responsabilidad (Disclaimer) - Dólar Gaucho
 *
 * CRÍTICO: Protección legal para plataforma de información financiera
 * Cumple con normativas argentinas para servicios informativos financieros
 */

import React from 'react';
import Head from 'next/head';
import { LegalLayout } from '@/components/legal';
import { FaExclamationTriangle } from 'react-icons/fa';

const tableOfContents = [
  { id: 'no-asesoria', title: '1. No Somos Asesores Financieros' },
  { id: 'informacion', title: '2. Naturaleza de la Información' },
  { id: 'fuentes', title: '3. Fuentes de Datos' },
  { id: 'exactitud', title: '4. Sin Garantía de Exactitud' },
  { id: 'riesgos', title: '5. Riesgos Financieros' },
  { id: 'responsabilidad', title: '6. Limitación de Responsabilidad' },
  { id: 'verificacion', title: '7. Deber de Verificación' },
];

export default function DisclaimerPage() {
  return (
    <>
      <Head>
        <title>Descargo de Responsabilidad | Dólar Gaucho</title>
        <meta
          name="description"
          content="Descargo de responsabilidad de Dólar Gaucho. Información importante sobre el uso de datos financieros."
        />
      </Head>

      <LegalLayout
        title="Descargo de Responsabilidad"
        lastUpdated="19 de Octubre de 2025"
        tableOfContents={tableOfContents}
      >
        <div className="space-y-8 text-secondary leading-relaxed">
          {/* Advertencia Principal */}
          <div className="p-6 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <FaExclamationTriangle className="text-red-500 text-3xl flex-shrink-0 mt-1" />
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-red-400">ADVERTENCIA IMPORTANTE</h2>
                <ul className="space-y-2 text-red-200 list-none">
                  <li>
                    • Dólar Gaucho <strong>NO es una entidad financiera</strong> regulada por el
                    Banco Central de la República Argentina (BCRA).
                  </li>
                  <li>
                    • <strong>NO ofrecemos</strong> servicios de asesoramiento financiero, legal,
                    tributario, contable o de inversión.
                  </li>
                  <li>
                    • <strong>NO facilitamos</strong> transacciones, operaciones de compraventa de
                    divisas, ni intermediación financiera.
                  </li>
                  <li>
                    • La información proporcionada es <strong>EXCLUSIVAMENTE INFORMATIVA</strong> y
                    educativa.
                  </li>
                  <li>
                    • <strong>USTED es el único responsable</strong> de sus decisiones financieras.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 1. No Somos Asesores Financieros */}
          <section id="no-asesoria">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              1. No Somos Asesores Financieros
            </h2>
            <p className="mb-3">
              Dólar Gaucho es una plataforma de información y herramientas educativas. Todo el
              contenido disponible en este sitio:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>NO constituye</strong> asesoramiento financiero, de inversión, legal,
                tributario o contable.
              </li>
              <li>
                <strong>NO debe interpretarse</strong> como recomendación para comprar, vender o
                mantener activos financieros.
              </li>
              <li>
                <strong>NO reemplaza</strong> el consejo de profesionales licenciados en finanzas,
                derecho o contabilidad.
              </li>
              <li>
                <strong>NO tiene en cuenta</strong> su situación financiera personal, objetivos de
                inversión o tolerancia al riesgo.
              </li>
            </ul>
            <p className="mt-4 font-semibold text-yellow-200">
              Si necesita asesoramiento financiero, consulte con un profesional certificado y
              habilitado por organismos reguladores.
            </p>
          </section>

          {/* 2. Naturaleza de la Información */}
          <section id="informacion">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. Naturaleza de la Información
            </h2>
            <p className="mb-3">
              La información proporcionada en Dólar Gaucho es de carácter general y tiene propósitos
              exclusivamente informativos y educativos:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Cotizaciones de divisas y criptomonedas</li>
              <li>Indicadores económicos (inflación, riesgo país, tasas)</li>
              <li>Información política y legislativa</li>
              <li>Calculadoras financieras con resultados estimativos</li>
              <li>Datos históricos y tendencias</li>
            </ul>
            <p className="mt-3">
              Esta información <strong>NO garantiza</strong> resultados futuros ni debe ser la única
              base para tomar decisiones financieras.
            </p>
          </section>

          {/* 3. Fuentes de Datos */}
          <section id="fuentes">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Fuentes de Datos</h2>
            <p className="mb-3">
              Dólar Gaucho agrega información de múltiples fuentes externas, incluyendo pero no
              limitado a:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Banco Central de la República Argentina (BCRA)</li>
              <li>Instituto Nacional de Estadística y Censos (INDEC)</li>
              <li>DolarAPI y otras APIs de cotizaciones</li>
              <li>CoinGecko, Binance y otros proveedores de datos cripto</li>
              <li>Fuentes gubernamentales y legislativas</li>
            </ul>
            <p>
              <strong className="text-foreground">Dólar Gaucho actúa como agregador</strong> y no es
              responsable por la exactitud, completitud o actualidad de los datos proporcionados por
              estas fuentes externas. Los datos oficiales deben consultarse directamente en las
              fuentes gubernamentales correspondientes.
            </p>
          </section>

          {/* 4. Sin Garantía de Exactitud */}
          <section id="exactitud">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              4. Sin Garantía de Exactitud
            </h2>
            <p className="mb-3">
              Aunque hacemos esfuerzos razonables para mantener la información actualizada y
              precisa, <strong>NO garantizamos</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>La exactitud, integridad o actualidad de la información</li>
              <li>La disponibilidad ininterrumpida del servicio</li>
              <li>Que el servicio esté libre de errores, virus o componentes dañinos</li>
              <li>Que los resultados de calculadoras sean 100% precisos</li>
              <li>Que las cotizaciones reflejen precios en tiempo real exactos</li>
            </ul>
            <p className="mt-3">
              Las tasas de cambio, precios de criptomonedas e indicadores económicos son
              <strong className="text-foreground"> altamente volátiles</strong> y pueden cambiar
              significativamente en cortos períodos de tiempo.
            </p>
          </section>

          {/* 5. Riesgos Financieros */}
          <section id="riesgos">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Riesgos Financieros</h2>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-3">
              <p className="font-semibold text-yellow-200 mb-2">ADVERTENCIA DE RIESGO FINANCIERO</p>
              <p>
                Las inversiones y operaciones financieras conllevan riesgos significativos,
                incluyendo la posible pérdida total de capital. El rendimiento pasado NO garantiza
                resultados futuros.
              </p>
            </div>
            <p className="mb-3">Los usuarios deben ser conscientes de que:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Los mercados financieros son impredecibles y volátiles</li>
              <li>Las criptomonedas son activos de alto riesgo y alta volatilidad</li>
              <li>La inflación, devaluación y políticas económicas pueden afectar inversiones</li>
              <li>Ningún método de análisis garantiza ganancias o elimina riesgos de pérdida</li>
              <li>Solo debe invertir dinero que pueda permitirse perder</li>
            </ul>
          </section>

          {/* 6. Limitación de Responsabilidad */}
          <section id="responsabilidad">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Limitación de Responsabilidad
            </h2>
            <p className="mb-3">
              En la máxima medida permitida por la ley aplicable, Dólar Gaucho y sus afiliados,
              directores, empleados y socios:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>NO seremos responsables</strong> por pérdidas financieras, daños directos,
                indirectos, incidentales, consecuentes o punitivos derivados de:
                <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                  <li>El uso o imposibilidad de usar el servicio</li>
                  <li>Decisiones tomadas basándose en información del sitio</li>
                  <li>Errores, omisiones o inexactitudes en los datos</li>
                  <li>Interrupciones, fallos o retrasos en el servicio</li>
                  <li>Acceso no autorizado o alteración de datos</li>
                </ul>
              </li>
              <li>
                <strong>NO asumimos responsabilidad</strong> por el contenido de sitios web de
                terceros enlazados desde nuestra plataforma.
              </li>
              <li>
                <strong>NO garantizamos</strong> que la información satisfará sus requisitos
                específicos.
              </li>
            </ul>
          </section>

          {/* 7. Deber de Verificación */}
          <section id="verificacion">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Deber de Verificación del Usuario
            </h2>
            <p className="mb-3">Al utilizar Dólar Gaucho, usted reconoce y acepta que:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Es <strong>su responsabilidad exclusiva</strong> verificar toda información con
                fuentes oficiales antes de tomar decisiones financieras.
              </li>
              <li>
                Debe consultar con profesionales certificados (asesores financieros, contadores,
                abogados) antes de realizar inversiones o transacciones significativas.
              </li>
              <li>
                Debe comprender completamente los productos financieros antes de invertir en ellos.
              </li>
              <li>
                Las calculadoras y herramientas proporcionan estimaciones que pueden no reflejar
                condiciones reales del mercado.
              </li>
              <li>
                El servicio se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD", sin garantías de
                ningún tipo.
              </li>
            </ul>
          </section>

          {/* Aceptación */}
          <section className="pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Aceptación</h2>
            <p className="mb-3">
              Al utilizar Dólar Gaucho, usted confirma que ha leído, comprendido y aceptado este
              Descargo de Responsabilidad en su totalidad.
            </p>
            <p>
              Si no está de acuerdo con estos términos, debe cesar inmediatamente el uso de este
              servicio.
            </p>
          </section>

          {/* Actualización */}
          <section className="mt-6 p-4 bg-brand/5 border border-brand/20 rounded-lg">
            <p className="text-sm">
              <strong className="text-foreground">Nota:</strong> Este descargo de responsabilidad
              puede ser actualizado periódicamente. Se recomienda revisar esta página regularmente
              para estar informado de cualquier cambio.
            </p>
          </section>
        </div>
      </LegalLayout>
    </>
  );
}
