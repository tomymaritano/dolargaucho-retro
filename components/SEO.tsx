import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  keywords?: string;
}

const DEFAULT_SEO = {
  title: 'Dólar Gaucho - Cotizaciones del Dólar en Tiempo Real',
  description:
    'Seguí todas las cotizaciones del dólar en Argentina en tiempo real: Blue, Oficial, MEP, CCL, Tarjeta y más. Análisis financiero completo con inflación, riesgo país y tasas.',
  image: '/thumbnail.png',
  url: 'https://dolargaucho.com',
  keywords:
    'dolar blue, dolar hoy, cotizacion dolar, dolar oficial, dolar mep, dolar ccl, inflacion argentina, riesgo pais, tasas plazo fijo',
};

export function SEO({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  image = DEFAULT_SEO.image,
  url = DEFAULT_SEO.url,
  type = 'website',
  noindex = false,
  keywords = DEFAULT_SEO.keywords,
}: SEOProps) {
  const fullTitle = title === DEFAULT_SEO.title ? title : `${title} | Dólar Gaucho`;
  const fullImageUrl = image.startsWith('http') ? image : `${DEFAULT_SEO.url}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${DEFAULT_SEO.url}${url}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={fullUrl} />

      {/* Language */}
      <meta httpEquiv="content-language" content="es-AR" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:site_name" content="Dólar Gaucho" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Theme Color */}
      <meta name="theme-color" content="#0047FF" />
      <meta name="msapplication-TileColor" content="#0047FF" />

      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Dólar Gaucho',
            url: DEFAULT_SEO.url,
            logo: `${DEFAULT_SEO.url}/logo.svg`,
            description: DEFAULT_SEO.description,
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'tomymaritano@gmail.com',
              contactType: 'Customer Service',
            },
            sameAs: [],
          }),
        }}
      />

      {/* Structured Data - WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Dólar Gaucho',
            url: DEFAULT_SEO.url,
            description: DEFAULT_SEO.description,
            inLanguage: 'es-AR',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${DEFAULT_SEO.url}/dashboard?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </Head>
  );
}
