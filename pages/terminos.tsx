/**
 * Términos y Condiciones de Uso - Dólar Gaucho
 *
 * Cumplimiento normativo:
 * - Ley 24.240 (Defensa del Consumidor)
 * - Ley 25.326 (Protección de Datos Personales)
 */

import React from 'react';
import Head from 'next/head';
import { LegalLayout } from '@/components/legal';

const tableOfContents = [
  { id: 'aceptacion', title: '1. Aceptación de Términos' },
  { id: 'definiciones', title: '2. Definiciones' },
  { id: 'servicio', title: '3. Descripción del Servicio' },
  { id: 'usuario', title: '4. Requisitos del Usuario' },
  { id: 'uso', title: '5. Uso del Servicio' },
  { id: 'propiedad', title: '6. Propiedad Intelectual' },
  { id: 'responsabilidad', title: '7. Limitación de Responsabilidad' },
  { id: 'privacidad', title: '8. Protección de Datos' },
  { id: 'modificaciones', title: '9. Modificaciones' },
  { id: 'jurisdiccion', title: '10. Ley Aplicable y Jurisdicción' },
];

export default function TerminosPage() {
  return (
    <>
      <Head>
        <title>Términos y Condiciones de Uso | Dólar Gaucho</title>
        <meta
          name="description"
          content="Términos y condiciones de uso de Dólar Gaucho. Información legal sobre el uso de nuestra plataforma."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <LegalLayout
        title="Términos y Condiciones de Uso"
        lastUpdated="19 de Octubre de 2025"
        tableOfContents={tableOfContents}
      >
        <div className="space-y-8 text-secondary leading-relaxed">
          {/* Introducción */}
          <section>
            <p className="text-base">
              Bienvenido a Dólar Gaucho. Al acceder y utilizar este sitio web y/o aplicación móvil,
              usted acepta quedar vinculado por estos Términos y Condiciones de Uso, todas las leyes
              y regulaciones aplicables, y acepta que es responsable del cumplimiento de todas las
              leyes locales aplicables.
            </p>
          </section>

          {/* 1. Aceptación de Términos */}
          <section id="aceptacion">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Aceptación de Términos</h2>
            <p className="mb-3">
              Al utilizar Dólar Gaucho (el "Servicio"), usted acepta estos términos en su totalidad.
              Si no está de acuerdo con estos términos, no debe utilizar este Servicio.
            </p>
            <p>
              El uso continuado del Servicio después de cualquier modificación a estos términos
              constituirá su aceptación de dichas modificaciones.
            </p>
          </section>

          {/* 2. Definiciones */}
          <section id="definiciones">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Definiciones</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-foreground">"Servicio":</strong> Dólar Gaucho, plataforma
                web/móvil que provee información sobre cotizaciones de divisas, criptomonedas e
                indicadores económicos.
              </li>
              <li>
                <strong className="text-foreground">"Usuario":</strong> Cualquier persona física o
                jurídica que acceda o utilice el Servicio.
              </li>
              <li>
                <strong className="text-foreground">"Contenido":</strong> Toda información, datos,
                textos, gráficos, imágenes y otros materiales disponibles en el Servicio.
              </li>
              <li>
                <strong className="text-foreground">"Datos Personales":</strong> Información que
                identifica o hace identificable a una persona física, conforme a la Ley 25.326.
              </li>
            </ul>
          </section>

          {/* 3. Descripción del Servicio */}
          <section id="servicio">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Descripción del Servicio</h2>
            <p className="mb-3">Dólar Gaucho es una plataforma informativa que proporciona:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Cotizaciones de divisas (dólar, euro, real, etc.)</li>
              <li>Precios de criptomonedas</li>
              <li>Indicadores económicos (inflación, riesgo país, tasas)</li>
              <li>Calculadoras financieras</li>
              <li>Información política y legislativa</li>
              <li>Sistema de alertas personalizadas</li>
            </ul>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-200 font-semibold mb-3 uppercase tracking-wide text-sm">
                Importante
              </p>
              <div className="space-y-2 text-sm leading-relaxed text-yellow-200/90">
                <p>Dólar Gaucho NO es una entidad financiera regulada por el BCRA.</p>
                <p>
                  NO ofrecemos servicios de asesoramiento financiero, legal, tributario o contable.
                </p>
                <p>NO facilitamos transacciones ni operaciones financieras.</p>
                <p>El Servicio es exclusivamente informativo y educativo.</p>
              </div>
            </div>
          </section>

          {/* 4. Requisitos del Usuario */}
          <section id="usuario">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Requisitos del Usuario</h2>
            <p className="mb-3">Para utilizar el Servicio, usted debe:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ser mayor de 18 años o contar con autorización de un tutor legal.</li>
              <li>Tener capacidad legal para contratar conforme a la legislación argentina.</li>
              <li>Proporcionar información veraz y actualizada durante el registro.</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>No utilizar el Servicio para actividades ilegales o no autorizadas.</li>
            </ul>
          </section>

          {/* 5. Uso del Servicio */}
          <section id="uso">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Uso del Servicio</h2>
            <h3 className="text-lg font-semibold text-foreground mb-2">5.1. Uso Permitido</h3>
            <p className="mb-3">El Usuario puede:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Acceder y consultar la información disponible</li>
              <li>Configurar alertas personalizadas</li>
              <li>Utilizar calculadoras financieras</li>
              <li>Compartir contenido con atribución</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2">5.2. Uso Prohibido</h3>
            <p className="mb-3">El Usuario NO puede:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Reproducir, distribuir o comercializar el contenido sin autorización</li>
              <li>Realizar ingeniería inversa o intentar acceder al código fuente</li>
              <li>Utilizar robots, scrapers o herramientas automatizadas sin permiso</li>
              <li>Sobrecargar o interferir con la infraestructura del Servicio</li>
              <li>
                Publicar contenido malicioso, difamatorio, obsceno o que viole derechos de terceros
              </li>
              <li>Hacerse pasar por otra persona o entidad</li>
            </ul>
          </section>

          {/* 6. Propiedad Intelectual */}
          <section id="propiedad">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Propiedad Intelectual</h2>
            <p className="mb-3">
              Todo el contenido del Servicio, incluyendo pero no limitado a diseños, textos,
              gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y
              compilaciones de datos, es propiedad de Dólar Gaucho o sus proveedores de contenido y
              está protegido por las leyes argentinas e internacionales de propiedad intelectual.
            </p>
            <p>
              Los datos proporcionados por fuentes externas (BCRA, INDEC, DolarAPI, CoinGecko, etc.)
              son propiedad de sus respectivos titulares. Dólar Gaucho actúa como agregador y
              presentador de esta información.
            </p>
          </section>

          {/* 7. Limitación de Responsabilidad */}
          <section id="responsabilidad">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Limitación de Responsabilidad
            </h2>
            <p className="mb-3">
              En la máxima medida permitida por la ley aplicable, Dólar Gaucho:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                NO garantiza la exactitud, integridad, actualidad o disponibilidad del Contenido.
              </li>
              <li>
                NO se responsabiliza por decisiones financieras tomadas en base a la información
                proporcionada.
              </li>
              <li>
                NO será responsable por daños directos, indirectos, incidentales, consecuentes o
                punitivos.
              </li>
              <li>
                NO garantiza que el Servicio estará libre de errores, virus o componentes dañinos.
              </li>
              <li>
                NO se responsabiliza por la suspensión temporal o permanente del Servicio por
                mantenimiento, actualizaciones o causas fuera de nuestro control.
              </li>
            </ul>
            <p className="mt-4">
              El Usuario reconoce que utiliza el Servicio bajo su propio riesgo y que debe verificar
              toda información con fuentes oficiales antes de tomar decisiones financieras.
            </p>
          </section>

          {/* 8. Protección de Datos */}
          <section id="privacidad">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              8. Protección de Datos Personales
            </h2>
            <p className="mb-3">
              Dólar Gaucho cumple con la Ley 25.326 de Protección de Datos Personales. Para
              información detallada sobre cómo recolectamos, usamos y protegemos sus datos
              personales, consulte nuestra{' '}
              <a href="/privacidad" className="text-brand hover:underline">
                Política de Privacidad
              </a>
              .
            </p>
            <p>
              Sus derechos incluyen acceso, rectificación, actualización y supresión de sus datos
              personales (derechos ARCO), conforme a la normativa vigente.
            </p>
          </section>

          {/* 9. Modificaciones */}
          <section id="modificaciones">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              9. Modificaciones del Servicio y Términos
            </h2>
            <p className="mb-3">
              Dólar Gaucho se reserva el derecho de modificar, suspender o descontinuar, temporal o
              permanentemente, el Servicio o cualquier parte del mismo, con o sin previo aviso.
            </p>
            <p className="mb-3">
              Estos Términos y Condiciones pueden ser actualizados periódicamente. La fecha de
              "Última actualización" se indicará al inicio del documento. Se recomienda revisar
              estos términos regularmente.
            </p>
            <p>
              El uso continuado del Servicio después de la publicación de cambios constituirá su
              aceptación de dichos cambios.
            </p>
          </section>

          {/* 10. Ley Aplicable y Jurisdicción */}
          <section id="jurisdiccion">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              10. Ley Aplicable y Jurisdicción
            </h2>
            <p className="mb-3">
              Estos Términos y Condiciones se rigen por las leyes de la República Argentina,
              específicamente:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Ley 24.240 (Defensa del Consumidor)</li>
              <li>Ley 25.326 (Protección de Datos Personales)</li>
              <li>Código Civil y Comercial de la Nación</li>
            </ul>
            <p>
              Para cualquier controversia derivada de estos términos, las partes se someten a la
              jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires,
              renunciando a cualquier otro fuero o jurisdicción que pudiere corresponder.
            </p>
          </section>

          {/* Contacto */}
          <section className="pt-6 border-t border-border/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contacto</h2>
            <p className="mb-2">
              Para consultas sobre estos Términos y Condiciones, puede contactarnos en:
            </p>
            <ul className="space-y-1 text-sm">
              <li>
                <strong className="text-foreground">Email:</strong>{' '}
                <a href="mailto:tomymaritano@gmail.com" className="text-brand hover:underline">
                  tomymaritano@gmail.com
                </a>
              </li>
              <li>
                <strong className="text-foreground">Sitio web:</strong>{' '}
                <a href="https://dolargaucho.com" className="text-brand hover:underline">
                  dolargaucho.com
                </a>
              </li>
            </ul>
          </section>
        </div>
      </LegalLayout>
    </>
  );
}
