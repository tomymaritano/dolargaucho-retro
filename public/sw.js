if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + '.js', a).href),
    s[n] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = n), (e.onload = s), document.head.appendChild(e));
        } else ((e = n), importScripts(n), s());
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, i) => {
    const c = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[c]) return;
    let r = {};
    const t = (e) => n(e, c),
      u = { module: { uri: c }, exports: r, require: t };
    s[c] = Promise.all(a.map((e) => u[e] || t(e))).then((e) => (i(...e), r));
  };
}
define(['./workbox-f52fd911'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: '434af078512000203212119bf342c673' },
        { url: '/_next/dynamic-css-manifest.json', revision: 'd751713988987e9331980363e24189ce' },
        { url: '/_next/static/chunks/1011-a3e1cb1c6712555b.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/1106-7a8d2e652e981450.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/1327-0d7865f30ee37eb3.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/1625-7850753cb102b23d.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/2454-e4162158190149ae.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/2907-0ec1283c181efd42.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/2926-ef8e39b40c681be5.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/3418.d8b8cbd2f171ebd5.js', revision: 'd8b8cbd2f171ebd5' },
        { url: '/_next/static/chunks/4087-5fae4c4472c0cb92.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/4135-4d3d19900dac8f06.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/4373.fc14d95a871897f4.js', revision: 'fc14d95a871897f4' },
        {
          url: '/_next/static/chunks/4bd1b696-b7be8402c29a2bf8.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        { url: '/_next/static/chunks/5298-16b9f236647e2fed.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/6184.e28cbee9080ea4be.js', revision: 'e28cbee9080ea4be' },
        { url: '/_next/static/chunks/6770-f397543d34c0ec97.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/7304.ecb752984c9d372f.js', revision: 'ecb752984c9d372f' },
        { url: '/_next/static/chunks/7522-10271d27bd391aa2.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/7576-e4127affaee53bbb.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        {
          url: '/_next/static/chunks/760c0163-47d4c11cf5e85808.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        { url: '/_next/static/chunks/7689-286320e4bb0a985b.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/79-03657973b3606de2.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/8074-83bcd1cdb50005c3.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/8333.c9d12eff8f476ac7.js', revision: 'c9d12eff8f476ac7' },
        { url: '/_next/static/chunks/8609-ebff13fdf208914c.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        { url: '/_next/static/chunks/9228.59aa9be41e5c2450.js', revision: '59aa9be41e5c2450' },
        { url: '/_next/static/chunks/9389-199a66b18ac713a5.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        {
          url: '/_next/static/chunks/94726e6d-502ba1ac5629ff07.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        { url: '/_next/static/chunks/9745.2d2c63f145d3daa0.js', revision: '2d2c63f145d3daa0' },
        { url: '/_next/static/chunks/9965-df97bc3393affa2f.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        {
          url: '/_next/static/chunks/ee8b1517-bc0f826389769139.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/framework-1869d3a69b51e224.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        { url: '/_next/static/chunks/main-a54eb0d23f8e06f1.js', revision: 'zF2yRqBOre1u1n1BN2nIY' },
        {
          url: '/_next/static/chunks/main-app-b979d40eaba06ccf.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/404-564540dc049c6e6e.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/500-17c279bdfb5812b5.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/_app-814cc9f9d2dd0712.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/auth-2363c6bc824c6931.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/auth/callback-6883e712d2cb9d9e.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/cookies-74f4c7c5dc7df2d6.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard-bed52872524660c4.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/alertas-da6646a8ed280a10.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/analisis-9ebd79ef80a75f22.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calculadoras-7eb88084c0e97724.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calendario-19f15bcf9a3e5e62.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/crypto-1453afe899e96670.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/economia-fcfc2716a7d59bf4.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/favoritos-c46a93d00809f2c1.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/finanzas-50827dc26fb752ff.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/herramientas-814baef4d6b1e2c8.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mega-calculadora-f3f11dfba1f5733c.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mercados-1587f67b7f05322b.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/perfil-97ba7cc84870ab73.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/politica-a3bb5f7fda61e5ba.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/demo-a640f5f21d0ce74f.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/dev/test-auth-24443f3381e4e13c.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/disclaimer-d4d5174d81bf79db.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/forgot-password-c3c50e1d59754cd1.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/help-ee98be283a7029bb.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/index-40c1434f447ad0ac.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/login-869eaf39b17f54c1.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/privacidad-aa4a090c06ee1b31.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/register-c6a637fae2ffd295.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/reset-password-5e3c746a0e59d677.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/roadmap-a5c2351945ac207e.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/signup-12042075b5526f6a.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/pages/terminos-9a52602aeac5e20a.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-766b960065a82174.js',
          revision: 'zF2yRqBOre1u1n1BN2nIY',
        },
        { url: '/_next/static/css/320c071115ae6eb6.css', revision: '320c071115ae6eb6' },
        { url: '/_next/static/css/8c3fa92032afb5dc.css', revision: '8c3fa92032afb5dc' },
        { url: '/_next/static/css/a9b21774882a3827.css', revision: 'a9b21774882a3827' },
        {
          url: '/_next/static/zF2yRqBOre1u1n1BN2nIY/_buildManifest.js',
          revision: '4cf79a8588cbf61e3f0647925b5faae6',
        },
        {
          url: '/_next/static/zF2yRqBOre1u1n1BN2nIY/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/abstract-bg.svg', revision: 'eb8c0b3124464c6663a53fe13ff2fffb' },
        { url: '/apple-touch-icon.png', revision: 'd5a0c8276185d4efad29b675fff0b798' },
        { url: '/favicon.ico', revision: 'c30c7d42707a47a3f4591831641e50dc' },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        { url: '/hero-bg.jpg', revision: '1b973af739e25cf38e1daeb7efe2fcf3' },
        { url: '/icon-192.png', revision: '555a4fdc277d3f5b242243ddc38c7038' },
        { url: '/icon-512.png', revision: '826b9a15228135fd37cba6a0c9b4de43' },
        { url: '/logo.svg', revision: '17d52e7d3a9d0d0e08c247e91353462a' },
        { url: '/manifest.json', revision: '64a3f31b7248305ea92f3bbf45aea8ae' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/record.gif', revision: '6bfc28f26b52ee503314808743073665' },
        { url: '/site.webmanifest', revision: '217400e71ac08d53b3bfca897050491f' },
        { url: '/thumbnail.png', revision: 'ab1ec46e379e56a211945f993dc10d5d' },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
        { url: '/window.svg', revision: 'a2760511c65806022ad20adf74370ff3' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: n, state: a }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/dolarapi\.com\/.*/i,
      new e.NetworkFirst({
        cacheName: 'dolarapi-cache',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 60 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/api\.argentinadatos\.com\/.*/i,
      new e.NetworkFirst({
        cacheName: 'argentinadatos-cache',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 300 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      new e.CacheFirst({
        cacheName: 'images-cache',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      'GET'
    ));
});
