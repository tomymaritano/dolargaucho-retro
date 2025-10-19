if (!self.define) {
  let e,
    s = {};
  const t = (t, a) => (
    (t = new URL(t + '.js', a).href),
    s[t] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = t), (e.onload = s), document.head.appendChild(e));
        } else ((e = t), importScripts(t), s());
      }).then(() => {
        let e = s[t];
        if (!e) throw new Error(`Module ${t} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, c) => {
    const n = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[n]) return;
    let i = {};
    const r = (e) => t(e, n),
      k = { module: { uri: n }, exports: i, require: r };
    s[n] = Promise.all(a.map((e) => k[e] || r(e))).then((e) => (c(...e), i));
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
          url: '/_next/static/XCGkenwtLO6aU8GFwkcmt/_buildManifest.js',
          revision: 'b3cf1b72a228afbe644e91f978a18a7b',
        },
        {
          url: '/_next/static/XCGkenwtLO6aU8GFwkcmt/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/1011-7ae090776cd001ae.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/1106-b599b3c258658a6f.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/1776-fabeb34c8e437d70.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/2926-40e5b110f25535bd.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/3928.7f26eb9007937c4e.js', revision: '7f26eb9007937c4e' },
        { url: '/_next/static/chunks/4135-4d3d19900dac8f06.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/4373.ecbf525656d74e07.js', revision: 'ecbf525656d74e07' },
        { url: '/_next/static/chunks/4526-c40c869e5450cd50.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/4624-3e3b1d41a7b03dc9.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        {
          url: '/_next/static/chunks/4bd1b696-b7be8402c29a2bf8.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        { url: '/_next/static/chunks/5687-5c6d055819dc4b3c.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/6184.e28cbee9080ea4be.js', revision: 'e28cbee9080ea4be' },
        { url: '/_next/static/chunks/6770-f397543d34c0ec97.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/728-7f2d374dd8a9a58f.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/7304.9b9d765081113cdd.js', revision: '9b9d765081113cdd' },
        { url: '/_next/static/chunks/7425-e22741528e368203.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/7522-adf716ea1a8ded2d.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/79-18cc1b6c456dacc1.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/7962-ee51c7fa03cf7097.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        { url: '/_next/static/chunks/8333.76367a1e26af491c.js', revision: '76367a1e26af491c' },
        { url: '/_next/static/chunks/9228.59aa9be41e5c2450.js', revision: '59aa9be41e5c2450' },
        { url: '/_next/static/chunks/9745.872b2aa8f2515c38.js', revision: '872b2aa8f2515c38' },
        { url: '/_next/static/chunks/9764-2c99f7a5ee95b57f.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        {
          url: '/_next/static/chunks/d9067523-b0d214895adfd2e1.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/ee8b1517-bc0f826389769139.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/framework-7f5b11a362f676ba.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        { url: '/_next/static/chunks/main-a27abea4b33a5b3b.js', revision: 'XCGkenwtLO6aU8GFwkcmt' },
        {
          url: '/_next/static/chunks/main-app-b979d40eaba06ccf.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/404-908cba2d371ed441.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/500-c1f1ee4f24803d7a.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/_app-10c7ff8c4f364e54.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/auth/callback-404d54a3645ad779.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard-af77b59f7da1c7a5.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/alertas-2d2b61ddc622473f.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/analisis-f85bc8a30dc3aad8.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calculadoras-16795d77c7916afb.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calendario-8d25984c3553d6de.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/crypto-59e1c5d88ab005fb.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/economia-81fc9b249fd482b5.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/favoritos-262b6ae962fc5223.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/finanzas-e7b4a863719b41ab.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/herramientas-c84decb121a3a6a2.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mega-calculadora-9f6508cea84e9f69.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mercados-a8b009ed42d0f44d.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/perfil-9f3dff74fcd55a59.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/politica-a104c673f5a50101.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/demo-6626a470c889b262.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/dev/test-auth-e874d9192dcd42d0.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/forgot-password-88b7c6aec407e0d0.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/help-f29a3d6157e63cc4.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/index-085669a0c9fb5365.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/login-2f773e462fe84424.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/register-971bb87d80f73da6.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/reset-password-9df1e1fbef0ed764.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/pages/signup-f4b8eb95db817e5c.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-e5dc9155a5825f4c.js',
          revision: 'XCGkenwtLO6aU8GFwkcmt',
        },
        { url: '/_next/static/css/75181d17c81213d2.css', revision: '75181d17c81213d2' },
        { url: '/_next/static/css/8c3fa92032afb5dc.css', revision: '8c3fa92032afb5dc' },
        { url: '/_next/static/css/c4be2e4c4ceff5e1.css', revision: 'c4be2e4c4ceff5e1' },
        { url: '/abstract-bg.svg', revision: 'eb8c0b3124464c6663a53fe13ff2fffb' },
        { url: '/favicon.ico', revision: 'c30c7d42707a47a3f4591831641e50dc' },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        { url: '/hero-bg.jpg', revision: '1b973af739e25cf38e1daeb7efe2fcf3' },
        { url: '/logo.svg', revision: '402f43d7eecaf13e267a682b6007b678' },
        { url: '/manifest.json', revision: '64a3f31b7248305ea92f3bbf45aea8ae' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
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
            cacheWillUpdate: async ({ request: e, response: s, event: t, state: a }) =>
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
