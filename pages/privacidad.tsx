/**
 * Política de Privacidad - Dólar Gaucho
 *
 * Cumplimiento: Ley 25.326 (Protección de Datos Personales Argentina)
 * Organismo de Control: AAIP (Agencia de Acceso a la Información Pública)
 */

import React from 'react';
import Head from 'next/head';
import { LegalLayout } from '@/components/legal';

const tableOfContents = [
  { id: 'responsable', title: '1. Responsable del Tratamiento' },
  { id: 'datos', title: '2. Datos que Recolectamos' },
  { id: 'finalidad', title: '3. Finalidad del Tratamiento' },
  { id: 'derechos', title: '4. Derechos ARCO' },
  { id: 'seguridad', title: '5. Medidas de Seguridad' },
  { id: 'cookies', title: '6. Cookies y Tecnologías' },
  { id: 'terceros', title: '7. Compartir con Terceros' },
  { id: 'menores', title: '8. Menores de Edad' },
  { id: 'cambios', title: '9. Cambios en la Política' },
];

export default function PrivacidadPage() {
  return (
    <>
      <Head>
        <title>Política de Privacidad | Dólar Gaucho</title>
        <meta
          name="description"
          content="Política de privacidad de Dólar Gaucho. Información sobre cómo tratamos y protegemos tus datos personales."
        />
      </Head>

      <LegalLayout
        title="Política de Privacidad"
        lastUpdated="19 de Octubre de 2025"
        tableOfContents={tableOfContents}
      >
        <div className="space-y-8 text-secondary leading-relaxed">
          {/* Introducción */}
          <section>
            <p className="text-base">
              Dólar Gaucho respeta su privacidad y está comprometido con la protección de sus datos
              personales. Esta Política de Privacidad describe cómo recolectamos, usamos,
              almacenamos y protegemos su información personal en cumplimiento con la Ley 25.326 de
              Protección de Datos Personales de Argentina.
            </p>
          </section>

          {/* 1. Responsable del Tratamiento */}
          <section id="responsable">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              1. Responsable del Tratamiento de Datos
            </h2>
            <div className="p-4 bg-panel border border-border/10 rounded-lg space-y-2">
              <p>
                <strong className="text-foreground">Responsable:</strong> Dólar Gaucho
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{' '}
                <a href="mailto:tomymaritano@gmail.com" className="text-brand hover:underline">
                  tomymaritano@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-foreground">Sitio web:</strong>{' '}
                <a href="https://dolargaucho.com" className="text-brand hover:underline">
                  dolargaucho.com
                </a>
              </p>
            </div>
            <p className="mt-4">
              Nuestra base de datos de información personal se encuentra debidamente registrada ante
              la Agencia de Acceso a la Información Pública (AAIP), conforme lo establece la Ley
              25.326.
            </p>
          </section>

          {/* 2. Datos que Recolectamos */}
          <section id="datos">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Datos que Recolectamos</h2>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              2.1. Datos Proporcionados por Usted
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              <li>Nombre y apellido</li>
              <li>Dirección de correo electrónico</li>
              <li>Información de perfil (opcional)</li>
              <li>Preferencias de alertas y notificaciones</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              2.2. Datos Recolectados Automáticamente
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Dirección IP</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y tiempo de navegación</li>
              <li>Datos de uso y preferencias del servicio</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>

          {/* 3. Finalidad del Tratamiento */}
          <section id="finalidad">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. Finalidad del Tratamiento de Datos
            </h2>
            <p className="mb-3">Utilizamos sus datos personales para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-foreground">Provisión del Servicio:</strong> Crear y
                administrar su cuenta, personalizar su experiencia.
              </li>
              <li>
                <strong className="text-foreground">Comunicaciones:</strong> Enviar alertas de
                precio, notificaciones del servicio, newsletters (con su consentimiento).
              </li>
              <li>
                <strong className="text-foreground">Mejora del Servicio:</strong> Analizar el uso,
                identificar errores, desarrollar nuevas funcionalidades.
              </li>
              <li>
                <strong className="text-foreground">Seguridad:</strong> Prevenir fraude, proteger la
                plataforma, cumplir con obligaciones legales.
              </li>
              <li>
                <strong className="text-foreground">Marketing:</strong> Enviar promociones,
                actualizaciones del producto (solo con su consentimiento explícito).
              </li>
            </ul>
          </section>

          {/* 4. Derechos ARCO */}
          <section id="derechos">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              4. Sus Derechos (Derechos ARCO)
            </h2>
            <p className="mb-3">
              Conforme a la Ley 25.326, usted tiene los siguientes derechos sobre sus datos
              personales:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>
                <strong className="text-foreground">Acceso:</strong> Solicitar una copia de los
                datos personales que tenemos sobre usted.
              </li>
              <li>
                <strong className="text-foreground">Rectificación:</strong> Solicitar la corrección
                de datos inexactos o incompletos.
              </li>
              <li>
                <strong className="text-foreground">Cancelación:</strong> Solicitar la eliminación
                de sus datos cuando no sean necesarios.
              </li>
              <li>
                <strong className="text-foreground">Oposición:</strong> Oponerse al tratamiento de
                sus datos en determinadas circunstancias.
              </li>
            </ul>
            <div className="p-4 bg-brand/5 border border-brand/20 rounded-lg">
              <p className="font-semibold text-foreground mb-2">¿Cómo ejercer sus derechos?</p>
              <p>
                Envíe un correo electrónico a{' '}
                <a href="mailto:tomymaritano@gmail.com" className="text-brand hover:underline">
                  tomymaritano@gmail.com
                </a>{' '}
                con su solicitud. Responderemos dentro de los 10 días hábiles conforme a la
                normativa.
              </p>
            </div>
          </section>

          {/* 5. Medidas de Seguridad */}
          <section id="seguridad">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Medidas de Seguridad</h2>
            <p className="mb-3">
              Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Cifrado de datos en tránsito (HTTPS/TLS)</li>
              <li>Cifrado de datos sensibles en reposo</li>
              <li>Controles de acceso y autenticación</li>
              <li>Monitoreo de seguridad y auditorías regulares</li>
              <li>Capacitación del personal en protección de datos</li>
            </ul>
          </section>

          {/* 6. Cookies */}
          <section id="cookies">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Cookies y Tecnologías de Seguimiento
            </h2>
            <p className="mb-3">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia. Para más
              información, consulte nuestra{' '}
              <a href="/cookies" className="text-brand hover:underline">
                Política de Cookies
              </a>
              .
            </p>
            <p>
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la
              funcionalidad del sitio.
            </p>
          </section>

          {/* 7. Compartir con Terceros */}
          <section id="terceros">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Compartir Información con Terceros
            </h2>
            <p className="mb-3">
              No vendemos ni alquilamos sus datos personales. Podemos compartir información con:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-foreground">Proveedores de Servicios:</strong> Hosting,
                analytics, email marketing (ej. Vercel, Google Analytics, SendGrid).
              </li>
              <li>
                <strong className="text-foreground">APIs de Datos:</strong> BCRA, INDEC, DolarAPI,
                CoinGecko para obtener información financiera.
              </li>
              <li>
                <strong className="text-foreground">Cumplimiento Legal:</strong> Autoridades cuando
                sea requerido por ley.
              </li>
            </ul>
            <p className="mt-3">
              Todos nuestros proveedores están obligados contractualmente a proteger sus datos y
              solo usarlos para los fines autorizados.
            </p>
          </section>

          {/* 8. Menores de Edad */}
          <section id="menores">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Menores de Edad</h2>
            <p>
              Nuestro servicio no está dirigido a menores de 18 años. No recolectamos
              intencionalmente datos de menores. Si un padre/tutor descubre que su hijo ha
              proporcionado información sin consentimiento, debe contactarnos para su eliminación.
            </p>
          </section>

          {/* 9. Cambios */}
          <section id="cambios">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Cambios en esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad ocasionalmente. La fecha de "Última
              actualización" se modificará en consecuencia. Le notificaremos cambios materiales por
              email o mediante aviso en el sitio.
            </p>
          </section>

          {/* Contacto AAIP */}
          <section className="pt-6 border-t border-border/10">
            <h2 className="text-2xl font-bold text-foreground mb-4">Autoridad de Control</h2>
            <p className="mb-2">
              Si considera que se han vulnerado sus derechos, puede contactar a la autoridad de
              control:
            </p>
            <div className="p-4 bg-panel border border-border/10 rounded-lg space-y-1 text-sm">
              <p>
                <strong className="text-foreground">
                  Agencia de Acceso a la Información Pública (AAIP)
                </strong>
              </p>
              <p>
                Sitio web:{' '}
                <a href="https://www.argentina.gob.ar/aaip" className="text-brand hover:underline">
                  argentina.gob.ar/aaip
                </a>
              </p>
              <p>Email: datospersonales@aaip.gob.ar</p>
            </div>
          </section>
        </div>
      </LegalLayout>
    </>
  );
}
