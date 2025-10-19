if (!self.define) {
  let s,
    e = {};
  const t = (t, a) => (
    (t = new URL(t + '.js', a).href),
    e[t] ||
      new Promise((e) => {
        if ('document' in self) {
          const s = document.createElement('script');
          ((s.src = t), (s.onload = e), document.head.appendChild(s));
        } else ((s = t), importScripts(t), e());
      }).then(() => {
        let s = e[t];
        if (!s) throw new Error(`Module ${t} didn’t register its module`);
        return s;
      })
  );
  self.define = (a, i) => {
    const r = s || ('document' in self ? document.currentScript.src : '') || location.href;
    if (e[r]) return;
    let c = {};
    const n = (s) => t(s, r),
      u = { module: { uri: r }, exports: c, require: n };
    e[r] = Promise.all(a.map((s) => u[s] || n(s))).then((s) => (i(...s), c));
  };
}
define(['./workbox-f52fd911'], function (s) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    s.clientsClaim(),
    s.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: '434af078512000203212119bf342c673' },
        { url: '/_next/dynamic-css-manifest.json', revision: 'd751713988987e9331980363e24189ce' },
        {
          url: '/_next/static/3HtBpGXQrOGg2uWEMPBZt/_buildManifest.js',
          revision: 'b1768564e388fee20bec1c496cf796bc',
        },
        {
          url: '/_next/static/3HtBpGXQrOGg2uWEMPBZt/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/1106-4e085b29a0e83adb.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/2110-d463f76d4af42e72.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/2312-abd2f78ec3c3b755.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/2454-dfc61846c843136c.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/2907-7f2b5f81440ddb3c.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/2926-e73dc86ee0880bfd.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/3418.d8b8cbd2f171ebd5.js', revision: 'd8b8cbd2f171ebd5' },
        { url: '/_next/static/chunks/4135-4d3d19900dac8f06.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/4188-a03aa6c62ddc12a6.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/4373.fc14d95a871897f4.js', revision: 'fc14d95a871897f4' },
        { url: '/_next/static/chunks/4381-a8bf0b19363e9f8d.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        {
          url: '/_next/static/chunks/4bd1b696-b7be8402c29a2bf8.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        { url: '/_next/static/chunks/5196-ec7886e8ea7d846d.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/5687-880309fb00fa50f2.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/6184.e28cbee9080ea4be.js', revision: 'e28cbee9080ea4be' },
        { url: '/_next/static/chunks/6770-f397543d34c0ec97.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/7304.ecb752984c9d372f.js', revision: 'ecb752984c9d372f' },
        { url: '/_next/static/chunks/7522-a403923dac2aa9ca.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/7576-b46291993d1e4b55.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/79-7164f6f4b92423db.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/8332-73a3831e4b91f9d1.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/8333.c9d12eff8f476ac7.js', revision: 'c9d12eff8f476ac7' },
        { url: '/_next/static/chunks/8609-88b8694ec49d0370.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        { url: '/_next/static/chunks/9228.59aa9be41e5c2450.js', revision: '59aa9be41e5c2450' },
        {
          url: '/_next/static/chunks/94726e6d-502ba1ac5629ff07.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        { url: '/_next/static/chunks/9745.2d2c63f145d3daa0.js', revision: '2d2c63f145d3daa0' },
        { url: '/_next/static/chunks/9965-f6877303cc12fe92.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        {
          url: '/_next/static/chunks/ee8b1517-bc0f826389769139.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/framework-bf874269b1587647.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        { url: '/_next/static/chunks/main-58dd31a8da325136.js', revision: '3HtBpGXQrOGg2uWEMPBZt' },
        {
          url: '/_next/static/chunks/main-app-b979d40eaba06ccf.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/404-22a57d77d4e58bd6.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/500-680ada4f83fbe496.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/_app-0bee3260c141a56b.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/auth-bf78cc5c4d5c52b9.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/auth/callback-5a85962db80147c3.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard-605123e5808b18aa.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/alertas-7ee8a6a3cea57729.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/analisis-70e5a8b732a72ba2.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calculadoras-e749bd0ce08ccd9e.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/calendario-3e555426d2a74987.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/crypto-6d568ce19da1c1ce.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/economia-a523a6dc18156e4b.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/favoritos-bf96d6572b4be2a3.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/finanzas-d8b16ee86d91a9e7.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/herramientas-516cd1b5772af086.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mega-calculadora-34984719a0b34db6.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/mercados-0b323242b3169804.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/perfil-661af60d48adc9a8.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dashboard/politica-469a790bfbc0b0b4.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/demo-4d1ca2d134f6017b.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/dev/test-auth-db88b0fa35311db6.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/forgot-password-7c0f8fd28fb5bcf3.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/help-b9844c7ed65c2133.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/index-e501487f01835764.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/login-066944c9b2f5ba52.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/register-f4cb32386bff04d1.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/reset-password-104e75600af6105b.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/roadmap-d0a6d2dd970ea313.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/pages/signup-4164dfb5fca21a39.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-58607ac6f07f8b23.js',
          revision: '3HtBpGXQrOGg2uWEMPBZt',
        },
        { url: '/_next/static/css/8c3fa92032afb5dc.css', revision: '8c3fa92032afb5dc' },
        { url: '/_next/static/css/a9b21774882a3827.css', revision: 'a9b21774882a3827' },
        { url: '/_next/static/css/fede20387a33c879.css', revision: 'fede20387a33c879' },
        { url: '/abstract-bg.svg', revision: 'eb8c0b3124464c6663a53fe13ff2fffb' },
        { url: '/favicon.ico', revision: 'c30c7d42707a47a3f4591831641e50dc' },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        { url: '/hero-bg.jpg', revision: '1b973af739e25cf38e1daeb7efe2fcf3' },
        { url: '/logo.svg', revision: '17d52e7d3a9d0d0e08c247e91353462a' },
        { url: '/manifest.json', revision: '64a3f31b7248305ea92f3bbf45aea8ae' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/record.gif', revision: '6bfc28f26b52ee503314808743073665' },
        { url: '/thumbnail.png', revision: 'ab1ec46e379e56a211945f993dc10d5d' },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
        { url: '/window.svg', revision: 'a2760511c65806022ad20adf74370ff3' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(
      '/',
      new s.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: s, response: e, event: t, state: a }) =>
              e && 'opaqueredirect' === e.type
                ? new Response(e.body, { status: 200, statusText: 'OK', headers: e.headers })
                : e,
          },
        ],
      }),
      'GET'
    ),
    s.registerRoute(
      /^https:\/\/dolarapi\.com\/.*/i,
      new s.NetworkFirst({
        cacheName: 'dolarapi-cache',
        networkTimeoutSeconds: 10,
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 60 })],
      }),
      'GET'
    ),
    s.registerRoute(
      /^https:\/\/api\.argentinadatos\.com\/.*/i,
      new s.NetworkFirst({
        cacheName: 'argentinadatos-cache',
        networkTimeoutSeconds: 10,
        plugins: [new s.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 300 })],
      }),
      'GET'
    ),
    s.registerRoute(
      /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      new s.CacheFirst({
        cacheName: 'images-cache',
        plugins: [new s.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      'GET'
    ));
});
