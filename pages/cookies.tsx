/**
 * Política de Cookies - Dólar Gaucho
 *
 * Cumplimiento: Directiva ePrivacy (2002/58/CE adaptada)
 * Transparencia en el uso de cookies y tecnologías de seguimiento
 */

import React from 'react';
import Head from 'next/head';
import { LegalLayout } from '@/components/legal';

const tableOfContents = [
  { id: 'que-son', title: '1. ¿Qué son las Cookies?' },
  { id: 'uso', title: '2. ¿Cómo Usamos las Cookies?' },
  { id: 'tipos', title: '3. Tipos de Cookies que Utilizamos' },
  { id: 'terceros', title: '4. Cookies de Terceros' },
  { id: 'control', title: '5. Control de Cookies' },
  { id: 'actualizacion', title: '6. Actualización de la Política' },
];

export default function CookiesPage() {
  return (
    <>
      <Head>
        <title>Política de Cookies | Dólar Gaucho</title>
        <meta
          name="description"
          content="Información sobre el uso de cookies y tecnologías de seguimiento en Dólar Gaucho."
        />
      </Head>

      <LegalLayout
        title="Política de Cookies"
        lastUpdated="19 de Octubre de 2025"
        tableOfContents={tableOfContents}
      >
        <div className="space-y-8 text-secondary leading-relaxed">
          {/* Introducción */}
          <section>
            <p className="text-base">
              Esta Política de Cookies explica qué son las cookies, cómo las utilizamos en Dólar
              Gaucho, qué tipos de cookies empleamos y cómo puede controlarlas. Al utilizar nuestro
              sitio web, usted acepta el uso de cookies de acuerdo con esta política.
            </p>
          </section>

          {/* 1. ¿Qué son las Cookies? */}
          <section id="que-son">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. ¿Qué son las Cookies?</h2>
            <p className="mb-3">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo
              (ordenador, tablet o móvil) cuando visita un sitio web. Las cookies permiten que el
              sitio web reconozca su dispositivo y recuerde información sobre su visita, como:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Sus preferencias y configuraciones</li>
              <li>Información de inicio de sesión</li>
              <li>Datos de navegación y comportamiento</li>
              <li>Idioma preferido</li>
              <li>Análisis de uso del sitio</li>
            </ul>
            <p>
              Las cookies pueden ser "de sesión" (se eliminan al cerrar el navegador) o
              "persistentes" (permanecen hasta una fecha de expiración o hasta que las elimine
              manualmente).
            </p>
          </section>

          {/* 2. ¿Cómo Usamos las Cookies? */}
          <section id="uso">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. ¿Cómo Usamos las Cookies?
            </h2>
            <p className="mb-3">Utilizamos cookies para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-foreground">Funcionalidad Esencial:</strong> Mantener su
                sesión activa, recordar sus preferencias de visualización y autenticar su cuenta.
              </li>
              <li>
                <strong className="text-foreground">Análisis y Rendimiento:</strong> Entender cómo
                los usuarios interactúan con nuestro sitio, qué páginas visitan, errores
                encontrados, para mejorar el servicio.
              </li>
              <li>
                <strong className="text-foreground">Personalización:</strong> Recordar sus
                favoritos, alertas configuradas y preferencias de usuario.
              </li>
              <li>
                <strong className="text-foreground">Seguridad:</strong> Detectar y prevenir
                actividades fraudulentas, proteger la integridad de su cuenta.
              </li>
            </ul>
          </section>

          {/* 3. Tipos de Cookies que Utilizamos */}
          <section id="tipos">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. Tipos de Cookies que Utilizamos
            </h2>

            {/* Cookies Estrictamente Necesarias */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                3.1. Cookies Estrictamente Necesarias
              </h3>
              <p className="mb-2">
                Estas cookies son esenciales para el funcionamiento del sitio. Sin ellas, algunas
                funcionalidades no estarán disponibles.
              </p>
              <div className="p-4 bg-panel border border-white/10 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-foreground">Cookie</th>
                      <th className="text-left py-2 text-foreground">Propósito</th>
                      <th className="text-left py-2 text-foreground">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono">auth-token</td>
                      <td className="py-2">Mantiene su sesión activa</td>
                      <td className="py-2">30 días</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono">csrf-token</td>
                      <td className="py-2">Protección contra ataques CSRF</td>
                      <td className="py-2">Sesión</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">cookie-consent</td>
                      <td className="py-2">Registra su elección de cookies</td>
                      <td className="py-2">1 año</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cookies de Rendimiento y Análisis */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                3.2. Cookies de Rendimiento y Análisis
              </h3>
              <p className="mb-2">
                Estas cookies nos ayudan a entender cómo los visitantes usan el sitio web,
                permitiéndonos mejorar su funcionamiento.
              </p>
              <div className="p-4 bg-panel border border-white/10 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-foreground">Cookie</th>
                      <th className="text-left py-2 text-foreground">Proveedor</th>
                      <th className="text-left py-2 text-foreground">Propósito</th>
                      <th className="text-left py-2 text-foreground">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono">_ga</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Distingue usuarios únicos</td>
                      <td className="py-2">2 años</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono">_gid</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Distingue usuarios únicos</td>
                      <td className="py-2">24 horas</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">_gat</td>
                      <td className="py-2">Google Analytics</td>
                      <td className="py-2">Limita tasa de solicitudes</td>
                      <td className="py-2">1 minuto</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cookies de Funcionalidad */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                3.3. Cookies de Funcionalidad
              </h3>
              <p className="mb-2">
                Estas cookies permiten que el sitio web recuerde las elecciones que realiza para
                proporcionar una experiencia personalizada.
              </p>
              <div className="p-4 bg-panel border border-white/10 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-foreground">Cookie</th>
                      <th className="text-left py-2 text-foreground">Propósito</th>
                      <th className="text-left py-2 text-foreground">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono">user-preferences</td>
                      <td className="py-2">Almacena preferencias de visualización</td>
                      <td className="py-2">1 año</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 font-mono">favorites</td>
                      <td className="py-2">Guarda sus divisas/cryptos favoritas</td>
                      <td className="py-2">1 año</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono">alerts-config</td>
                      <td className="py-2">Configuración de alertas de precios</td>
                      <td className="py-2">1 año</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 4. Cookies de Terceros */}
          <section id="terceros">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Cookies de Terceros</h2>
            <p className="mb-3">
              Utilizamos servicios de terceros que pueden colocar cookies en su dispositivo. Estos
              terceros tienen sus propias políticas de privacidad:
            </p>

            <div className="space-y-4">
              {/* Google Analytics */}
              <div className="p-4 bg-panel border border-white/10 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Google Analytics</h4>
                <p className="text-sm mb-2">
                  Utilizamos Google Analytics para analizar el uso del sitio web y mejorar nuestro
                  servicio.
                </p>
                <p className="text-sm">
                  <strong className="text-foreground">Más información:</strong>{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad de Google
                  </a>
                </p>
              </div>

              {/* Vercel Analytics */}
              <div className="p-4 bg-panel border border-white/10 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Vercel Analytics</h4>
                <p className="text-sm mb-2">
                  Utilizamos Vercel Analytics para monitorear el rendimiento y experiencia del
                  usuario.
                </p>
                <p className="text-sm">
                  <strong className="text-foreground">Más información:</strong>{' '}
                  <a
                    href="https://vercel.com/docs/analytics/privacy-policy"
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad de Vercel
                  </a>
                </p>
              </div>

              {/* APIs Externas */}
              <div className="p-4 bg-panel border border-white/10 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">APIs de Datos Financieros</h4>
                <p className="text-sm mb-2">
                  Consultamos APIs externas (BCRA, DolarAPI, CoinGecko) que pueden registrar
                  solicitudes pero no colocan cookies en su navegador a través de nuestro sitio.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Control de Cookies */}
          <section id="control">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              5. Cómo Controlar y Eliminar Cookies
            </h2>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              5.1. Configuración del Navegador
            </h3>
            <p className="mb-3">
              Puede controlar y/o eliminar cookies según desee. Puede eliminar todas las cookies que
              ya están en su dispositivo y configurar la mayoría de los navegadores para evitar que
              se coloquen. Sin embargo, si hace esto, es posible que tenga que ajustar manualmente
              algunas preferencias cada vez que visite un sitio.
            </p>

            <div className="p-4 bg-brand/5 border border-brand/20 rounded-lg mb-4">
              <p className="font-semibold text-foreground mb-2">
                Instrucciones para navegadores populares:
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  •{' '}
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  •{' '}
                  <a
                    href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  •{' '}
                  <a
                    href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  •{' '}
                  <a
                    href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    className="text-brand hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              5.2. Desactivar Google Analytics
            </h3>
            <p className="mb-3">
              Puede desactivar Google Analytics instalando el{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                className="text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                complemento de inhabilitación para navegadores de Google Analytics
              </a>
              .
            </p>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              5.3. Consecuencias de Deshabilitar Cookies
            </h3>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-200 mb-2">
                Si deshabilita las cookies, algunas funcionalidades del sitio pueden no funcionar
                correctamente:
              </p>
              <ul className="space-y-1 text-sm">
                <li>• No podrá mantener su sesión iniciada</li>
                <li>• Sus preferencias no se guardarán</li>
                <li>• Las alertas personalizadas no funcionarán</li>
                <li>• Algunos gráficos y funcionalidades pueden no cargar</li>
              </ul>
            </div>
          </section>

          {/* 6. Actualización de la Política */}
          <section id="actualizacion">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Actualización de esta Política
            </h2>
            <p className="mb-3">
              Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en
              las cookies que utilizamos o por razones operativas, legales o regulatorias.
            </p>
            <p>
              Le recomendamos revisar esta página periódicamente para estar informado de cualquier
              cambio. La fecha de "Última actualización" al inicio de esta política indica cuándo se
              realizó la última modificación.
            </p>
          </section>

          {/* Contacto */}
          <section className="pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contacto</h2>
            <p>
              Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos en{' '}
              <a href="mailto:privacidad@dolargaucho.com" className="text-brand hover:underline">
                privacidad@dolargaucho.com
              </a>
            </p>
          </section>
        </div>
      </LegalLayout>
    </>
  );
}
