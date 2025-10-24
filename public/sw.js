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
  self.define = (a, n) => {
    const c = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[c]) return;
    let t = {};
    const r = (e) => i(e, c),
      l = { module: { uri: c }, exports: t, require: r };
    s[c] = Promise.all(a.map((e) => l[e] || r(e))).then((e) => (n(...e), t));
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
          url: '/_next/static/_pAlG5NEjVDy10QOvl4AE/_buildManifest.js',
          revision: '854eec0fe069d1f69982ae21a778ed0f',
        },
        {
          url: '/_next/static/_pAlG5NEjVDy10QOvl4AE/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/1106-7a8d2e652e981450.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/1955-819c8e0dff2ec7bc.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/2312-abd2f78ec3c3b755.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/2462-5525360352daa555.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/2527-ae8f4be3fd43bbe5.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/2619-c01fe8612c164762.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/3418.d8b8cbd2f171ebd5.js', revision: 'd8b8cbd2f171ebd5' },
        { url: '/_next/static/chunks/3480-e2d68769ff1b4f19.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/3612-949f91f011d30826.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/4087-14f888950973e3f2.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/4135-4d3d19900dac8f06.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/4287-fea5eaba85423aba.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/436-6ba9717209f1058d.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        {
          url: '/_next/static/chunks/4bd1b696-b7be8402c29a2bf8.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        { url: '/_next/static/chunks/5929-422c5849b5708d26.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/6184.e28cbee9080ea4be.js', revision: 'e28cbee9080ea4be' },
        { url: '/_next/static/chunks/6770-edf57c9e9dcd6387.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/7255-69e5faf06858e5d7.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/7487-a4d50e887eb533f2.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/7587-5c262ca43f0b412e.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        {
          url: '/_next/static/chunks/760c0163-47d4c11cf5e85808.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        { url: '/_next/static/chunks/8287-9f350833b1fccd92.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        { url: '/_next/static/chunks/8332-2e592d245df9b7b2.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        {
          url: '/_next/static/chunks/94726e6d-502ba1ac5629ff07.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        { url: '/_next/static/chunks/9981-775356befe74728e.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        {
          url: '/_next/static/chunks/framework-1869d3a69b51e224.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        { url: '/_next/static/chunks/main-a54eb0d23f8e06f1.js', revision: '_pAlG5NEjVDy10QOvl4AE' },
        {
          url: '/_next/static/chunks/main-app-b979d40eaba06ccf.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/404-8d00ea7a975564e0.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/500-0030ba76f2d57cb9.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/_app-79387dc4caa78fa2.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/arquitectura-704048a9b58fbd77.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/auth-78d82447607c537a.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/auth/callback-e3a8aa50a8b4e1f2.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/cookies-36b230d9ffb44bb4.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard-8425a45cc782d37b.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/alertas-e852a4f30236fc25.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/analisis-cdff9c5bc90055ca.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calendario-93339840e95b34af.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/crypto-2582b7267e73f18d.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/favoritos-3fe2db8aa95a6b33.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/herramientas-3c9714441ea90dcb.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mercados-f5d91e3cd61b0014.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/perfil-7331408cf2eae821.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/demo-5d66fd610c8ef008.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/disclaimer-00d4b768345efc5d.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/elecciones-5afb9326d10a3d5b.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/forgot-password-73db1e738f5262c7.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/help-690e12e9ee1d9b07.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/index-d6ecbd470f82d71f.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/privacidad-3c3aca282b0b43c8.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/reset-password-60187618e6593a5b.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/roadmap-1a48e66a0b5b2b33.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/pages/terminos-6e23fb9b32241e93.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-0edfbdbd594bad7a.js',
          revision: '_pAlG5NEjVDy10QOvl4AE',
        },
        { url: '/_next/static/css/8c3fa92032afb5dc.css', revision: '8c3fa92032afb5dc' },
        { url: '/_next/static/css/a26effe29909ff03.css', revision: 'a26effe29909ff03' },
        { url: '/_next/static/css/a9b21774882a3827.css', revision: 'a9b21774882a3827' },
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
