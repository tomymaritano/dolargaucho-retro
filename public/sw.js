if (!self.define) {
  let e,
    s = {};
  const i = (i, a) => (
    (i = new URL(i + '.js', a).href),
    s[i] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = i), (e.onload = s), document.head.appendChild(e));
        } else ((e = i), importScripts(i), s());
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, t) => {
    const c = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[c]) return;
    let n = {};
    const r = (e) => i(e, c),
      u = { module: { uri: c }, exports: n, require: r };
    s[c] = Promise.all(a.map((e) => u[e] || r(e))).then((e) => (t(...e), n));
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
        {
          url: '/_next/static/a-XMitDFAVCf7UJCuSL_J/_buildManifest.js',
          revision: 'd9e5b8292a23c1665b59384efed73373',
        },
        {
          url: '/_next/static/a-XMitDFAVCf7UJCuSL_J/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/1106-7a8d2e652e981450.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/1955-eff93c545aebe445.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/2312-abd2f78ec3c3b755.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/2462-5525360352daa555.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/2527-06b2e7f99c4f3a6b.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/2619-c01fe8612c164762.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/3418.d8b8cbd2f171ebd5.js', revision: 'd8b8cbd2f171ebd5' },
        { url: '/_next/static/chunks/3612-d3d2fe840f2d70f9.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/4087-14f888950973e3f2.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/4135-4d3d19900dac8f06.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/4287-fea5eaba85423aba.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/436-6ba9717209f1058d.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        {
          url: '/_next/static/chunks/4bd1b696-b7be8402c29a2bf8.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        { url: '/_next/static/chunks/5929-422c5849b5708d26.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/6073-3dc3f0188d2f6ff2.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/6184.e28cbee9080ea4be.js', revision: 'e28cbee9080ea4be' },
        { url: '/_next/static/chunks/6770-edf57c9e9dcd6387.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/7255-e1ae79db8b0ebc54.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/7487-a4d50e887eb533f2.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        { url: '/_next/static/chunks/7587-5c262ca43f0b412e.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        {
          url: '/_next/static/chunks/760c0163-47d4c11cf5e85808.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        { url: '/_next/static/chunks/8287-9f350833b1fccd92.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        {
          url: '/_next/static/chunks/94726e6d-502ba1ac5629ff07.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        { url: '/_next/static/chunks/9981-775356befe74728e.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        {
          url: '/_next/static/chunks/framework-1869d3a69b51e224.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        { url: '/_next/static/chunks/main-a54eb0d23f8e06f1.js', revision: 'a-XMitDFAVCf7UJCuSL_J' },
        {
          url: '/_next/static/chunks/main-app-b979d40eaba06ccf.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/404-e578fce765d1f23f.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/500-05244478d23183ef.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/_app-15ae8d3a1c01fdfb.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/arquitectura-567803cd5de2a580.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/auth-be0dbf1219f64d7b.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/auth/callback-e3a8aa50a8b4e1f2.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/cookies-cb21fc7680c71eb4.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard-c60800c72c6925b7.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/alertas-120619bec4e039c8.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/analisis-fcf09b320b0d1234.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calendario-b7bdc3069c994a43.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/crypto-7ff49a875209cca5.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/favoritos-075665f636c1f81e.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/herramientas-187f7428aae4dce7.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mercados-6acfc23803a2b564.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/perfil-7a88c48514e2383f.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/demo-5d66fd610c8ef008.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/disclaimer-e7393a4173de91c5.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/elecciones-3baa09a4c7eb617d.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/forgot-password-fbd5e86cd7f484a7.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/help-e5375a4d8c8efaba.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/index-b0bdcc2cd61dba33.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/privacidad-2274cbf66f46c023.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/reset-password-489a94f28448f9cc.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/roadmap-b7713fc14c719836.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/pages/terminos-dd110859eff37aef.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-1e1174b221eedb7b.js',
          revision: 'a-XMitDFAVCf7UJCuSL_J',
        },
        { url: '/_next/static/css/8c3fa92032afb5dc.css', revision: '8c3fa92032afb5dc' },
        { url: '/_next/static/css/a9b21774882a3827.css', revision: 'a9b21774882a3827' },
        { url: '/_next/static/css/cfab743b886ff6db.css', revision: 'cfab743b886ff6db' },
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
            cacheWillUpdate: async ({ request: e, response: s, event: i, state: a }) =>
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
