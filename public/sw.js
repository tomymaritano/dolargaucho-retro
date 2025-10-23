if (!self.define) {
  let e,
    s = {};
  const a = (a, r) => (
    (a = new URL(a + '.js', r).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (r, n) => {
    const c = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[c]) return;
    let i = {};
    const t = (e) => a(e, c),
      d = { module: { uri: c }, exports: i, require: t };
    s[c] = Promise.all(r.map((e) => d[e] || t(e))).then((e) => (n(...e), i));
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
        { url: '/_next/static/chunks/1106-7a8d2e652e981450.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/2594-a80c1b7c194bab9a.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/2619-c01fe8612c164762.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/273-e973f7ce8b043991.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/3418.d8b8cbd2f171ebd5.js', revision: 'd8b8cbd2f171ebd5' },
        { url: '/_next/static/chunks/3612-cffcbe8a7889518f.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/4087-14f888950973e3f2.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/4135-4d3d19900dac8f06.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/4358-e0b720e92d17a428.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/436-90ba59893ea5cd95.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/4367-e8b1feb632e4cec9.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        {
          url: '/_next/static/chunks/4bd1b696-b7be8402c29a2bf8.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        { url: '/_next/static/chunks/6184.e28cbee9080ea4be.js', revision: 'e28cbee9080ea4be' },
        { url: '/_next/static/chunks/6406-7ea4b00dfbd504bf.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/6770-edf57c9e9dcd6387.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/7255-86138ae034fedf50.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/7487-aee74ede6d51acc4.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        {
          url: '/_next/static/chunks/760c0163-47d4c11cf5e85808.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        { url: '/_next/static/chunks/7689-286320e4bb0a985b.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        { url: '/_next/static/chunks/8287-9f350833b1fccd92.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        {
          url: '/_next/static/chunks/94726e6d-502ba1ac5629ff07.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        { url: '/_next/static/chunks/9923-0ee2a1bd24e5d209.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        {
          url: '/_next/static/chunks/framework-1869d3a69b51e224.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        { url: '/_next/static/chunks/main-a54eb0d23f8e06f1.js', revision: 'rrpnBY8MpvYcJaOBGdEm-' },
        {
          url: '/_next/static/chunks/main-app-b979d40eaba06ccf.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/404-38bad2b557d877d8.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/500-330435ec0b8d27a1.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/_app-96b6de39f2c4d038.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/arquitectura-6bb0a14e3d862c80.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/auth-e4ec50e904f62e70.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/auth/callback-560d825c690ebf59.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/cookies-16fba0e4873fdb90.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard-de84556b20477d29.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/alertas-673e2c524a4e18b8.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/analisis-ef760da7a7ab8bfc.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calendario-8ec38c9f9e6f2f64.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/crypto-24cb61f04f341f96.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/favoritos-5b26f4fb5f7d79fa.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/herramientas-afc3d6f3cb2a1f04.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mercados-ad7a4f52c6086cff.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/perfil-7199438de0ffc4a1.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/demo-beb3748e76b7f6b0.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/dev/test-auth-002fd469c750a06b.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/disclaimer-e733b0674a0b994b.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/forgot-password-4b032108b3cb6334.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/help-3c268998cde9fac1.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/index-882f077f305d3bfd.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/privacidad-3d4613e73ff872a9.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/reset-password-1c5e663295443735.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/roadmap-b8f207082eaee46f.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/pages/terminos-59876713c697e647.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-24f6d53c63228e74.js',
          revision: 'rrpnBY8MpvYcJaOBGdEm-',
        },
        { url: '/_next/static/css/8c3fa92032afb5dc.css', revision: '8c3fa92032afb5dc' },
        { url: '/_next/static/css/a9b21774882a3827.css', revision: 'a9b21774882a3827' },
        { url: '/_next/static/css/b7f856a3c902364a.css', revision: 'b7f856a3c902364a' },
        {
          url: '/_next/static/rrpnBY8MpvYcJaOBGdEm-/_buildManifest.js',
          revision: 'd1949232ee0a7774b17a64d4a87f73ca',
        },
        {
          url: '/_next/static/rrpnBY8MpvYcJaOBGdEm-/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/abstract-bg.svg', revision: 'eb8c0b3124464c6663a53fe13ff2fffb' },
        { url: '/apple-touch-icon.png', revision: 'd5a0c8276185d4efad29b675fff0b798' },
        { url: '/favicon.ico', revision: '665ad89475d71dcbc7f87a66e55d9c3a' },
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
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: r }) =>
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
