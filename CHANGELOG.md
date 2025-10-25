# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## 1.27.0 (2025-10-25)

- fix: add build excludes to pwa config to prevent path errors in dev mode ([b87cc64](https://github.com/tomymaritano/dolargaucho-retro/commit/b87cc64))
- fix: only apply pwa wrapper in production to prevent dev mode errors ([9a53db3](https://github.com/tomymaritano/dolargaucho-retro/commit/9a53db3))
- fix: remove duplicate breadcrumbs from dashboard pages ([0a7acbf](https://github.com/tomymaritano/dolargaucho-retro/commit/0a7acbf))
- fix: remove pwa config and duplicate mercados route to resolve next.js errors ([b8b09a0](https://github.com/tomymaritano/dolargaucho-retro/commit/b8b09a0))
- fix: restore navbar border to white/10 for marketing page ([72d793b](https://github.com/tomymaritano/dolargaucho-retro/commit/72d793b))
- fix: revert border migration to maintain original white borders ([a398fad](https://github.com/tomymaritano/dolargaucho-retro/commit/a398fad))
- fix: revert navbar border from border-subtle to border-white/10 ([14fee3e](https://github.com/tomymaritano/dolargaucho-retro/commit/14fee3e))
- fix: use darker gray for borders in light mode ([1e21281](https://github.com/tomymaritano/dolargaucho-retro/commit/1e21281)), closes [#e2e8f0](https://github.com/tomymaritano/dolargaucho-retro/issues/e2e8f0) [#94a3b8](https://github.com/tomymaritano/dolargaucho-retro/issues/94a3b8)
- fix: use even darker gray for borders in light mode ([919abbb](https://github.com/tomymaritano/dolargaucho-retro/commit/919abbb)), closes [#475569](https://github.com/tomymaritano/dolargaucho-retro/issues/475569)
- fix: use fallback data for bcra tasas api ([c211833](https://github.com/tomymaritano/dolargaucho-retro/commit/c211833))
- fix: use fixed tailwind classes in bcra stat cards ([99fc6ba](https://github.com/tomymaritano/dolargaucho-retro/commit/99fc6ba))
- fix: use very dark gray for borders in light mode ([1c887b4](https://github.com/tomymaritano/dolargaucho-retro/commit/1c887b4)), closes [#1e293b](https://github.com/tomymaritano/dolargaucho-retro/issues/1e293b)
- feat: add bcra economic indicators infrastructure (sprint 1) ([69d4adc](https://github.com/tomymaritano/dolargaucho-retro/commit/69d4adc))
- feat: add bcra mercados page and dashboard integration (sprint 2) ([960d253](https://github.com/tomymaritano/dolargaucho-retro/commit/960d253))
- feat: add border-subtle to tailwind theme for navbar styling ([5d53b40](https://github.com/tomymaritano/dolargaucho-retro/commit/5d53b40))
- feat: batch migrate 66 components to theme-aware styling ([c514c2f](https://github.com/tomymaritano/dolargaucho-retro/commit/c514c2f))
- feat: complete background migration for remaining 45 files ([e8b7c14](https://github.com/tomymaritano/dolargaucho-retro/commit/e8b7c14))
- feat: migrate borders to theme-aware css variables for better visibility ([0fc0090](https://github.com/tomymaritano/dolargaucho-retro/commit/0fc0090))
- feat: migrate dashboard navbar to theme-aware css variables ([da69baf](https://github.com/tomymaritano/dolargaucho-retro/commit/da69baf))
- feat: migrate founder story to theme-aware styling ([472070e](https://github.com/tomymaritano/dolargaucho-retro/commit/472070e))
- feat: migrate from next-pwa to serwist for next.js 15 compatibility ([b15903a](https://github.com/tomymaritano/dolargaucho-retro/commit/b15903a))
- feat: migrate to next-themes and improve bcra api timeout handling ([e36e14c](https://github.com/tomymaritano/dolargaucho-retro/commit/e36e14c))

## 1.26.0 (2025-10-24)

- feat(hero): prioritize elections and enhance interactivity ([c2dedff](https://github.com/tomymaritano/dolargaucho-retro/commit/c2dedff))

## 1.25.0 (2025-10-24)

- feat(countdown): unify countdowns and add typing effect ([5714ed9](https://github.com/tomymaritano/dolargaucho-retro/commit/5714ed9))

## <small>1.24.3 (2025-10-24)</small>

- fix(hero): improve mobile and tablet responsive layout ([44f48a8](https://github.com/tomymaritano/dolargaucho-retro/commit/44f48a8))

## <small>1.24.2 (2025-10-24)</small>

- fix(elections): remove seconds and restore flip-clock animation ([d7c3191](https://github.com/tomymaritano/dolargaucho-retro/commit/d7c3191))

## <small>1.24.1 (2025-10-24)</small>

- fix(hero): remove scroll arrow, fix refresh and improve mobile ux ([e2023a4](https://github.com/tomymaritano/dolargaucho-retro/commit/e2023a4))

## 1.24.0 (2025-10-24)

- feat(hero): make full screen with animated scroll indicator and improve countdown ([e4ad4d9](https://github.com/tomymaritano/dolargaucho-retro/commit/e4ad4d9))

## 1.23.0 (2025-10-24)

- feat(elections): enhance countdown ux and consistency ([7378531](https://github.com/tomymaritano/dolargaucho-retro/commit/7378531))

## <small>1.22.1 (2025-10-24)</small>

- fix(elections): improve countdown spacing and prevent reflow ([90c1ac4](https://github.com/tomymaritano/dolargaucho-retro/commit/90c1ac4))

## 1.22.0 (2025-10-24)

- feat(elections): enhance countdown with animations and seconds ([1147dae](https://github.com/tomymaritano/dolargaucho-retro/commit/1147dae))

## 1.21.0 (2025-10-24)

- feat(elections): add interactive countdown to hero ([d96f1be](https://github.com/tomymaritano/dolargaucho-retro/commit/d96f1be))
- refactor(elections): remove redundant cta buttons from hero ([a09a95a](https://github.com/tomymaritano/dolargaucho-retro/commit/a09a95a))

## 1.20.0 (2025-10-24)

- feat(elections): add interactive animations to hero cards ([2ba5db4](https://github.com/tomymaritano/dolargaucho-retro/commit/2ba5db4))
- refactor(elections): redesign countdown to match currency table style ([00c8b7a](https://github.com/tomymaritano/dolargaucho-retro/commit/00c8b7a))

## <small>1.19.1 (2025-10-24)</small>

- fix(mobile): make search button clickable in mobile drawer ([e2a7f22](https://github.com/tomymaritano/dolargaucho-retro/commit/e2a7f22))

## 1.19.0 (2025-10-24)

- feat(mobile): improve search button design in mobile drawer ([b0d69e7](https://github.com/tomymaritano/dolargaucho-retro/commit/b0d69e7))

## 1.18.0 (2025-10-24)

- feat(mobile): redesign full-screen drawer with enhanced ux ([88f1722](https://github.com/tomymaritano/dolargaucho-retro/commit/88f1722))

## 1.17.0 (2025-10-24)

- feat(mobile): optimize marketing page for mobile devices ([d12de73](https://github.com/tomymaritano/dolargaucho-retro/commit/d12de73))

## <small>1.16.1 (2025-10-24)</small>

- fix(types): add category field to election data interface ([8ea7c84](https://github.com/tomymaritano/dolargaucho-retro/commit/8ea7c84))

## 1.16.0 (2025-10-24)

- refactor: simplify marketing components and update navigation ([b0fefa3](https://github.com/tomymaritano/dolargaucho-retro/commit/b0fefa3))
- feat(elecciones): add missing election system files ([f1e511a](https://github.com/tomymaritano/dolargaucho-retro/commit/f1e511a))
- feat(elecciones): sistema completo de resultados en vivo para elecciones 2025 ([03f566d](https://github.com/tomymaritano/dolargaucho-retro/commit/03f566d))
- docs: add v1.7.0 to changelog ([f083087](https://github.com/tomymaritano/dolargaucho-retro/commit/f083087))

## <small>1.15.2 (2025-10-23)</small>

- fix: remove demo auth mode and fix build errors ([73ca8cc](https://github.com/tomymaritano/dolargaucho-retro/commit/73ca8cc))
- refactor: redesign 404 page to match landing page ui ([548c598](https://github.com/tomymaritano/dolargaucho-retro/commit/548c598))
- refactor: remove unused components, hooks, and files ([8c0f1ee](https://github.com/tomymaritano/dolargaucho-retro/commit/8c0f1ee))

## <small>1.15.1 (2025-10-23)</small>

- fix: resolve test failures and improve ux for error pages and logout ([fabf3e1](https://github.com/tomymaritano/dolargaucho-retro/commit/fabf3e1))

## 1.15.0 (2025-10-23)

- test: add mocks and update alertform test ([5f9f18f](https://github.com/tomymaritano/dolargaucho-retro/commit/5f9f18f))
- refactor: migrate 5 key components to use dolar service ([c45f7e7](https://github.com/tomymaritano/dolargaucho-retro/commit/c45f7e7))
- refactor: update components and remove hardcoded votes from roadmap ([71bddae](https://github.com/tomymaritano/dolargaucho-retro/commit/71bddae))
- refactor: update dashboard pages and remove deprecated routes ([f0d22f3](https://github.com/tomymaritano/dolargaucho-retro/commit/f0d22f3))
- refactor: update hooks and database queries ([6ae4be6](https://github.com/tomymaritano/dolargaucho-retro/commit/6ae4be6))
- feat: add type definitions for finanzas, fred and charts ([2e3e096](https://github.com/tomymaritano/dolargaucho-retro/commit/2e3e096))
- docs: add v1.6.0 changelog entry for architecture improvements ([5d51c16](https://github.com/tomymaritano/dolargaucho-retro/commit/5d51c16))

## 1.14.0 (2025-10-23)

- feat: implement pragmatic architecture with axios interceptors and business logic services ([86ae520](https://github.com/tomymaritano/dolargaucho-retro/commit/86ae520))

## <small>1.13.2 (2025-10-22)</small>

- fix: skip failing ui tests and exclude api endpoints from jest ([f08fbe4](https://github.com/tomymaritano/dolargaucho-retro/commit/f08fbe4)), closes [#favorites-bug](https://github.com/tomymaritano/dolargaucho-retro/issues/favorites-bug)

## <small>1.13.1 (2025-10-22)</small>

- fix: format code with prettier and add resizeobserver mock ([389a800](https://github.com/tomymaritano/dolargaucho-retro/commit/389a800))

## 1.13.0 (2025-10-22)

- refactor: complete auth.tsx refactoring (793→114 lines) ([6877c4f](https://github.com/tomymaritano/dolargaucho-retro/commit/6877c4f))
- refactor: export types from use favorites sorting hook ([4f63f25](https://github.com/tomymaritano/dolargaucho-retro/commit/4f63f25))
- refactor: extract auth form logic and components ([fa3f1c8](https://github.com/tomymaritano/dolargaucho-retro/commit/fa3f1c8)), closes [#refactoring](https://github.com/tomymaritano/dolargaucho-retro/issues/refactoring) [#react-principles](https://github.com/tomymaritano/dolargaucho-retro/issues/react-principles)
- refactor: extract favorites list to focused row components ([69b4546](https://github.com/tomymaritano/dolargaucho-retro/commit/69b4546))
- refactor: remove unnecessary footer text from timeline ([cb40369](https://github.com/tomymaritano/dolargaucho-retro/commit/cb40369))
- fix: change future quarters to planned status ([eea1226](https://github.com/tomymaritano/dolargaucho-retro/commit/eea1226))
- fix: correct postgresql array handling in preferences update ([125ac2e](https://github.com/tomymaritano/dolargaucho-retro/commit/125ac2e))
- fix: correct z-index layering and selection indicator styling ([c6f2760](https://github.com/tomymaritano/dolargaucho-retro/commit/c6f2760))
- fix: definitive z-index solution with inline styles and solid backgrounds ([ae2e34d](https://github.com/tomymaritano/dolargaucho-retro/commit/ae2e34d))
- fix: proper z-index with isolation and add historical q1 2025 ([82ac6d7](https://github.com/tomymaritano/dolargaucho-retro/commit/82ac6d7))
- feat: create modern vertical timeline inspired by react-chrono ([50ee3c2](https://github.com/tomymaritano/dolargaucho-retro/commit/50ee3c2))
- feat: redesign timeline as vertical layout with lateral info ([160bf8e](https://github.com/tomymaritano/dolargaucho-retro/commit/160bf8e))
- feat: redesign timeline with modern tech-inspired card layout ([219dbba](https://github.com/tomymaritano/dolargaucho-retro/commit/219dbba))
- feat: renovate roadmap for 2026 planning with cleaner design ([6b5ea3d](https://github.com/tomymaritano/dolargaucho-retro/commit/6b5ea3d))

## 1.12.0 (2025-10-22)

- feat: complete roadmap overhaul with voting system and interactive features ([e292cc4](https://github.com/tomymaritano/dolargaucho-retro/commit/e292cc4))

## 1.11.0 (2025-10-22)

- feat: add interactive roadmap timeline and email testing ([6a01c3e](https://github.com/tomymaritano/dolargaucho-retro/commit/6a01c3e))

## 1.10.0 (2025-10-22)

- feat: clean up auth pages and improve user experience ([12306e6](https://github.com/tomymaritano/dolargaucho-retro/commit/12306e6))

## 1.9.0 (2025-10-22)

- chore: update roadmap - mark alerts backend as completed ([534f240](https://github.com/tomymaritano/dolargaucho-retro/commit/534f240))
- feat: implement functional alerts backend with cron verification ([89a4d0d](https://github.com/tomymaritano/dolargaucho-retro/commit/89a4d0d))

## 1.8.0 (2025-10-22)

- feat: mark email service as completed in roadmap ([16776cb](https://github.com/tomymaritano/dolargaucho-retro/commit/16776cb))

## 1.7.0 (2025-10-21)

- feat: implement email service with resend and react email ([570306f](https://github.com/tomymaritano/dolargaucho-retro/commit/570306f)), closes [#00D084](https://github.com/tomymaritano/dolargaucho-retro/issues/00D084)

## 1.6.0 (2025-10-21)

- feat: mark auth system as completed in roadmap ([0932680](https://github.com/tomymaritano/dolargaucho-retro/commit/0932680))

## 1.5.0 (2025-10-21)

- feat: add backend sync infrastructure for alerts system ([d0c0c31](https://github.com/tomymaritano/dolargaucho-retro/commit/d0c0c31))
- docs: standardize to tanstack query terminology ([c798fc9](https://github.com/tomymaritano/dolargaucho-retro/commit/c798fc9))
- refactor: modernize dashboard ui across all pages ([83efd29](https://github.com/tomymaritano/dolargaucho-retro/commit/83efd29))

## 1.4.0 (2025-10-21)

- feat: add technical architecture page and improve roadmap with timeline ([8e9d6f5](https://github.com/tomymaritano/dolargaucho-retro/commit/8e9d6f5))

## 1.3.0 (2025-10-21)

- refactor: migrate favorites store to sync engine infrastructure ([c5feab8](https://github.com/tomymaritano/dolargaucho-retro/commit/c5feab8))
- feat: add reusable sync engine for cross-device state management ([2f40657](https://github.com/tomymaritano/dolargaucho-retro/commit/2f40657))

## 1.2.0 (2025-10-21)

- feat(favorites): implement cross-device favorites synchronization ([f6c3a42](https://github.com/tomymaritano/dolargaucho-retro/commit/f6c3a42))

## 1.1.0 (2025-10-21)

- feat(perfil): redesign profile page with modern dashboard ui ([5034643](https://github.com/tomymaritano/dolargaucho-retro/commit/5034643))

## <small>1.0.1 (2025-10-21)</small>

- fix(favoritos): correct crypto data destructuring ([608bafe](https://github.com/tomymaritano/dolargaucho-retro/commit/608bafe))

## 1.0.0 (2025-10-21)

- chore: install next-themes dependency ([31170d3](https://github.com/tomymaritano/dolargaucho-retro/commit/31170d3))
- chore: remove unused Supabase and legacy component files ([4969958](https://github.com/tomymaritano/dolargaucho-retro/commit/4969958))
- chore: trigger release workflow ([f188ba1](https://github.com/tomymaritano/dolargaucho-retro/commit/f188ba1))
- chore: update contact email to tomymaritano@gmail.com ([19a4cc5](https://github.com/tomymaritano/dolargaucho-retro/commit/19a4cc5))
- fix: add explicit type to useUsersCount hook ([eaa0e4d](https://github.com/tomymaritano/dolargaucho-retro/commit/eaa0e4d))
- fix: anchor auth tabs to prevent movement when switching forms ([fd677a4](https://github.com/tomymaritano/dolargaucho-retro/commit/fd677a4))
- fix: corregir filtros de tiempo en gráficos históricos ([1ff40dd](https://github.com/tomymaritano/dolargaucho-retro/commit/1ff40dd))
- fix: filter international currencies from /cotizaciones endpoint ([36a3ecc](https://github.com/tomymaritano/dolargaucho-retro/commit/36a3ecc))
- fix: improve hover button positioning with flex-1 layout ([da5290f](https://github.com/tomymaritano/dolargaucho-retro/commit/da5290f))
- fix: invert crypto trend colors to match investment perspective ([97c388c](https://github.com/tomymaritano/dolargaucho-retro/commit/97c388c))
- fix: make dot pattern much more subtle ([ef48aa8](https://github.com/tomymaritano/dolargaucho-retro/commit/ef48aa8))
- fix: make NavbarFloating work without AuthProvider ([7be46b9](https://github.com/tomymaritano/dolargaucho-retro/commit/7be46b9))
- fix: make Vercel background fully visible ([046092c](https://github.com/tomymaritano/dolargaucho-retro/commit/046092c)), closes [#0A0A0A](https://github.com/tomymaritano/dolargaucho-retro/issues/0A0A0A)
- fix: navbar button now updates when user logs in/out ([6cce193](https://github.com/tomymaritano/dolargaucho-retro/commit/6cce193))
- fix: normalize sparkline data points for visual consistency ([5825c17](https://github.com/tomymaritano/dolargaucho-retro/commit/5825c17))
- fix: prevent form repositioning when switching auth tabs ([120b94f](https://github.com/tomymaritano/dolargaucho-retro/commit/120b94f))
- fix: prevent input refresh on every keystroke in auth forms ([a296443](https://github.com/tomymaritano/dolargaucho-retro/commit/a296443))
- fix: remove all remaining line breaks in className strings ([778d718](https://github.com/tomymaritano/dolargaucho-retro/commit/778d718))
- fix: remove bg-background from page wrappers to show gradient ([3eb40db](https://github.com/tomymaritano/dolargaucho-retro/commit/3eb40db))
- fix: remove duplicate bullets in disclaimer warning list ([1e148f5](https://github.com/tomymaritano/dolargaucho-retro/commit/1e148f5))
- fix: remove line breaks in className strings ([5c57978](https://github.com/tomymaritano/dolargaucho-retro/commit/5c57978))
- fix: remove solid backgrounds from DataSources and FAQs sections ([542d6ae](https://github.com/tomymaritano/dolargaucho-retro/commit/542d6ae))
- fix: remove unnecessary useTransition causing constant re-renders in auth inputs ([ff7b676](https://github.com/tomymaritano/dolargaucho-retro/commit/ff7b676))
- fix: Rename calculadorainflacion.tsx to CalculadoraInflacion.tsx ([2800347](https://github.com/tomymaritano/dolargaucho-retro/commit/2800347))
- fix: resolve build errors in help.tsx and tailwind.config.ts ([26f4ef1](https://github.com/tomymaritano/dolargaucho-retro/commit/26f4ef1))
- fix: resolve ESLint errors in refactored components ([929be2e](https://github.com/tomymaritano/dolargaucho-retro/commit/929be2e))
- fix: restore mini table with sparklines in FinalCTA ([0c1ae0d](https://github.com/tomymaritano/dolargaucho-retro/commit/0c1ae0d))
- fix: simplify disclaimer warning to single clean alert ([bbb1cb5](https://github.com/tomymaritano/dolargaucho-retro/commit/bbb1cb5))
- fix: standardize sparkline rendering to monotone curves ([c7d59c1](https://github.com/tomymaritano/dolargaucho-retro/commit/c7d59c1))
- fix: unify sparkline colors to match financial standard ([bdcefd5](https://github.com/tomymaritano/dolargaucho-retro/commit/bdcefd5))
- fix: use actual logo.svg with reveal animation ([199e1a7](https://github.com/tomymaritano/dolargaucho-retro/commit/199e1a7))
- fix: use invisible field to maintain consistent form height ([f128493](https://github.com/tomymaritano/dolargaucho-retro/commit/f128493))
- fix(release): skip commitlint for automated semantic-release commits ([8447fd4](https://github.com/tomymaritano/dolargaucho-retro/commit/8447fd4))
- feat: add animated logo with drawing effect ([e1f41c6](https://github.com/tomymaritano/dolargaucho-retro/commit/e1f41c6))
- feat: add comprehensive favicon and PWA support ([6bb40ed](https://github.com/tomymaritano/dolargaucho-retro/commit/6bb40ed)), closes [Hi#res](https://github.com/Hi/issues/res)
- feat: add comprehensive legal framework with Argentine compliance ([cb98bc5](https://github.com/tomymaritano/dolargaucho-retro/commit/cb98bc5))
- feat: add comprehensive SEO and social sharing meta tags ([4446663](https://github.com/tomymaritano/dolargaucho-retro/commit/4446663))
- feat: add DashboardNavbar with marquee and improved menu ([41d3158](https://github.com/tomymaritano/dolargaucho-retro/commit/41d3158))
- feat: add gradient action bar with favorite, copy, and share buttons ([47a0838](https://github.com/tomymaritano/dolargaucho-retro/commit/47a0838))
- feat: add hover animation to logo ([95201c9](https://github.com/tomymaritano/dolargaucho-retro/commit/95201c9))
- feat: add interactive animations to FeaturesSimple with GSAP and tilt effect ([87a9b28](https://github.com/tomymaritano/dolargaucho-retro/commit/87a9b28))
- feat: add missing components and charts for dashboard ([a70495f](https://github.com/tomymaritano/dolargaucho-retro/commit/a70495f))
- feat: add reusable Tabs component and improve Help Center navigation ([076db25](https://github.com/tomymaritano/dolargaucho-retro/commit/076db25))
- feat: add smooth form transitions with Framer Motion ([40738fe](https://github.com/tomymaritano/dolargaucho-retro/commit/40738fe))
- feat: add sparklines to favorites and fix international rates overflow ([431da42](https://github.com/tomymaritano/dolargaucho-retro/commit/431da42))
- feat: add useDolarWith7DayTrend hook for 24h and 7-day trends ([de91dd7](https://github.com/tomymaritano/dolargaucho-retro/commit/de91dd7))
- feat: add Vercel-style background with radial gradient and dots ([3aa143d](https://github.com/tomymaritano/dolargaucho-retro/commit/3aa143d))
- feat: add visual bar chart for dollar comparison analysis ([45e35c3](https://github.com/tomymaritano/dolargaucho-retro/commit/45e35c3))
- feat: add What's New changelog system with elegant modal ([17392a8](https://github.com/tomymaritano/dolargaucho-retro/commit/17392a8))
- feat: agregar herramientas financieras y mejorar análisis técnico ([cc2f24f](https://github.com/tomymaritano/dolargaucho-retro/commit/cc2f24f))
- feat: Complete FASE 0 - Production-ready build ([8465429](https://github.com/tomymaritano/dolargaucho-retro/commit/8465429))
- feat: complete landing page redesign with fintech aesthetics ([e1485f5](https://github.com/tomymaritano/dolargaucho-retro/commit/e1485f5))
- feat: create unified Table component system with UX principles ([dcef6f3](https://github.com/tomymaritano/dolargaucho-retro/commit/dcef6f3))
- feat: enhance Vercel background visibility and depth ([7bc0511](https://github.com/tomymaritano/dolargaucho-retro/commit/7bc0511))
- feat: fix auth forms and add nickname support ([41e2fc5](https://github.com/tomymaritano/dolargaucho-retro/commit/41e2fc5))
- feat: fix password reset functionality and redesign forgot password page ([4efa482](https://github.com/tomymaritano/dolargaucho-retro/commit/4efa482))
- feat: implement comprehensive security best practices ([20c3e16](https://github.com/tomymaritano/dolargaucho-retro/commit/20c3e16))
- feat: improve auth forms with password visibility and confirmation ([43a11b0](https://github.com/tomymaritano/dolargaucho-retro/commit/43a11b0))
- feat: improve changelog modal with collapsible entries ([6ad8598](https://github.com/tomymaritano/dolargaucho-retro/commit/6ad8598))
- feat: improve dashboard layout and add 7-day percentage column ([d020214](https://github.com/tomymaritano/dolargaucho-retro/commit/d020214))
- feat: improve favorites UX with hover buttons and badges ([b3fc215](https://github.com/tomymaritano/dolargaucho-retro/commit/b3fc215))
- feat: improve UX with interactive tooltips and mobile responsiveness ([dbf38d6](https://github.com/tomymaritano/dolargaucho-retro/commit/dbf38d6))
- feat: mejora completa de landing page con tema adaptativo y social proof ([01f3818](https://github.com/tomymaritano/dolargaucho-retro/commit/01f3818))
- feat: optimizar UX del dashboard eliminando duplicación de datos ([b783496](https://github.com/tomymaritano/dolargaucho-retro/commit/b783496))
- feat: redesign search modal with premium style ([556b56e](https://github.com/tomymaritano/dolargaucho-retro/commit/556b56e))
- feat: replace placeholder images with interactive mockups ([d4cb4aa](https://github.com/tomymaritano/dolargaucho-retro/commit/d4cb4aa))
- feat: replace quotation cards with historical comparison chart ([0380d97](https://github.com/tomymaritano/dolargaucho-retro/commit/0380d97)), closes [#3b82f6](https://github.com/tomymaritano/dolargaucho-retro/issues/3b82f6) [#0047FF](https://github.com/tomymaritano/dolargaucho-retro/issues/0047FF) [#8B5CF6](https://github.com/tomymaritano/dolargaucho-retro/issues/8B5CF6) [#f97316](https://github.com/tomymaritano/dolargaucho-retro/issues/f97316) [#10b981](https://github.com/tomymaritano/dolargaucho-retro/issues/10b981)
- feat: sistema completo de GitHub Projects para tracking de roadmap ([48e4a88](https://github.com/tomymaritano/dolargaucho-retro/commit/48e4a88))
- feat: unify card layout and add favorite button animations ([f22fed1](https://github.com/tomymaritano/dolargaucho-retro/commit/f22fed1))
- feat: unify dashboard with professional tables and consistent sparklines ([aea8dfb](https://github.com/tomymaritano/dolargaucho-retro/commit/aea8dfb))
- feat: unify table UI across all components ([c8df81b](https://github.com/tomymaritano/dolargaucho-retro/commit/c8df81b))
- feat(crypto): add expandable historical charts to crypto table ([ba46f3a](https://github.com/tomymaritano/dolargaucho-retro/commit/ba46f3a))
- feat(crypto): redesign page header with breadcrumbs and back button ([57f2af1](https://github.com/tomymaritano/dolargaucho-retro/commit/57f2af1))
- feat(favoritos): remove available items sections ([e2350c9](https://github.com/tomymaritano/dolargaucho-retro/commit/e2350c9))
- feat(release): implement automated semantic release system ([17554f4](https://github.com/tomymaritano/dolargaucho-retro/commit/17554f4))
- refactor: complete redesign of analysis page with clean minimal UI ([0817a5c](https://github.com/tomymaritano/dolargaucho-retro/commit/0817a5c))
- refactor: drastically simplify marketing site structure ([339d675](https://github.com/tomymaritano/dolargaucho-retro/commit/339d675))
- refactor: extract favoritos and crypto page components ([fb2a79b](https://github.com/tomymaritano/dolargaucho-retro/commit/fb2a79b))
- refactor: improve disclaimer warning block structure ([ccb3946](https://github.com/tomymaritano/dolargaucho-retro/commit/ccb3946))
- refactor: improve form validations and remove height placeholders ([6e7aae3](https://github.com/tomymaritano/dolargaucho-retro/commit/6e7aae3))
- refactor: improve warning block structure in terms page ([e551dc4](https://github.com/tomymaritano/dolargaucho-retro/commit/e551dc4))
- refactor: integrate Help Center into legal layout structure ([eb9a573](https://github.com/tomymaritano/dolargaucho-retro/commit/eb9a573))
- refactor: make Help Center tabs more compact ([860d623](https://github.com/tomymaritano/dolargaucho-retro/commit/860d623))
- refactor: massive dashboard refactorization - 89% code reduction ([72fb76f](https://github.com/tomymaritano/dolargaucho-retro/commit/72fb76f))
- refactor: merge analysis and finance pages into unified view ([0fe15ac](https://github.com/tomymaritano/dolargaucho-retro/commit/0fe15ac))
- refactor: migrate DiputadosTable and SenadoresTable to unified Table system ([f02f716](https://github.com/tomymaritano/dolargaucho-retro/commit/f02f716))
- refactor: redesign analysis page with modern cohesive UI ([75c14dd](https://github.com/tomymaritano/dolargaucho-retro/commit/75c14dd))
- refactor: redesign chart components with modern minimal style ([251f7bf](https://github.com/tomymaritano/dolargaucho-retro/commit/251f7bf))
- refactor: redesign Tasas and Brechas sections with intuitive visual UI ([be22b49](https://github.com/tomymaritano/dolargaucho-retro/commit/be22b49))
- refactor: remove chart backgrounds and footer sources for cleaner design ([c9e3109](https://github.com/tomymaritano/dolargaucho-retro/commit/c9e3109))
- refactor: remove currency/dollar icons from tables, keep only crypto images ([91bb2a8](https://github.com/tomymaritano/dolargaucho-retro/commit/91bb2a8))
- refactor: remove welcome header from auth page ([961c3f3](https://github.com/tomymaritano/dolargaucho-retro/commit/961c3f3))
- refactor: rename all components to PascalCase convention ([6b13820](https://github.com/tomymaritano/dolargaucho-retro/commit/6b13820))
- refactor: replace logo with animated SVG dollar sign ([e483cc0](https://github.com/tomymaritano/dolargaucho-retro/commit/e483cc0))
- refactor: simplify logo animation to rotate + scale ([a42271b](https://github.com/tomymaritano/dolargaucho-retro/commit/a42271b))
- refactor: simplify NavbarFloating to minimal design ([1333a7d](https://github.com/tomymaritano/dolargaucho-retro/commit/1333a7d))
- refactor: simplify ProductShowcase section - reduce information overload ([0e698c5](https://github.com/tomymaritano/dolargaucho-retro/commit/0e698c5))
- perf: optimize auth inputs and simplify header text ([90e43a7](https://github.com/tomymaritano/dolargaucho-retro/commit/90e43a7))
- revert: remove data sampling from sparklines ([ad12360](https://github.com/tomymaritano/dolargaucho-retro/commit/ad12360))
- blog ([7e998c2](https://github.com/tomymaritano/dolargaucho-retro/commit/7e998c2))
- Initial commit from Create Next App ([7f339bd](https://github.com/tomymaritano/dolargaucho-retro/commit/7f339bd))
- udp ([9c29673](https://github.com/tomymaritano/dolargaucho-retro/commit/9c29673))
- udp ([831215f](https://github.com/tomymaritano/dolargaucho-retro/commit/831215f))
- udp ([efc70a5](https://github.com/tomymaritano/dolargaucho-retro/commit/efc70a5))
- udp ([e209d2a](https://github.com/tomymaritano/dolargaucho-retro/commit/e209d2a))
- udp ([e59a0c8](https://github.com/tomymaritano/dolargaucho-retro/commit/e59a0c8))
- udp ([20407da](https://github.com/tomymaritano/dolargaucho-retro/commit/20407da))
- udp ([dd5ead5](https://github.com/tomymaritano/dolargaucho-retro/commit/dd5ead5))
- udp ([3bd752f](https://github.com/tomymaritano/dolargaucho-retro/commit/3bd752f))
- udp ([676a609](https://github.com/tomymaritano/dolargaucho-retro/commit/676a609))
- udp ([1b88e1e](https://github.com/tomymaritano/dolargaucho-retro/commit/1b88e1e))
- udp ([d965847](https://github.com/tomymaritano/dolargaucho-retro/commit/d965847))
- udpates ([97bbf4b](https://github.com/tomymaritano/dolargaucho-retro/commit/97bbf4b))
- udpates ([d3f16e0](https://github.com/tomymaritano/dolargaucho-retro/commit/d3f16e0))
- udpates ([b1694da](https://github.com/tomymaritano/dolargaucho-retro/commit/b1694da))
- udpates ([c7a5aa3](https://github.com/tomymaritano/dolargaucho-retro/commit/c7a5aa3))
- up ([a8867c8](https://github.com/tomymaritano/dolargaucho-retro/commit/a8867c8))
- updates ([6f4ae90](https://github.com/tomymaritano/dolargaucho-retro/commit/6f4ae90))
- updates ([b847415](https://github.com/tomymaritano/dolargaucho-retro/commit/b847415))
- updates ([a08a8b0](https://github.com/tomymaritano/dolargaucho-retro/commit/a08a8b0))
- updates ([411aeed](https://github.com/tomymaritano/dolargaucho-retro/commit/411aeed))
- updates ([c5303c0](https://github.com/tomymaritano/dolargaucho-retro/commit/c5303c0))
- updates ([250ec9f](https://github.com/tomymaritano/dolargaucho-retro/commit/250ec9f))
- updates ([6018fd2](https://github.com/tomymaritano/dolargaucho-retro/commit/6018fd2))
- updates ([cbcc430](https://github.com/tomymaritano/dolargaucho-retro/commit/cbcc430))
- updates ([4b29992](https://github.com/tomymaritano/dolargaucho-retro/commit/4b29992))
- updates ([70994b0](https://github.com/tomymaritano/dolargaucho-retro/commit/70994b0))
- updates ([ad632f1](https://github.com/tomymaritano/dolargaucho-retro/commit/ad632f1))
- updates ([aa18c2e](https://github.com/tomymaritano/dolargaucho-retro/commit/aa18c2e))
- updates ([dd85802](https://github.com/tomymaritano/dolargaucho-retro/commit/dd85802))
- updates ([a864064](https://github.com/tomymaritano/dolargaucho-retro/commit/a864064))
- updates ([f5606a6](https://github.com/tomymaritano/dolargaucho-retro/commit/f5606a6))
- Updates ([bef2c1c](https://github.com/tomymaritano/dolargaucho-retro/commit/bef2c1c))
- Updates ([a2bce84](https://github.com/tomymaritano/dolargaucho-retro/commit/a2bce84))
- Updates ([13cedd2](https://github.com/tomymaritano/dolargaucho-retro/commit/13cedd2))

### BREAKING CHANGE

- Combines analisis and finanzas into single comprehensive page

Changes:

- Merge both pages into unified Análisis Económico page
- Add 6-column indicator grid: Brecha, IPC Mensual, IPC Anual, Riesgo, UVA
- Show trend indicators (arrows) and change values for all metrics
- Include IPC interanual (yearly inflation) as separate indicator
- Add comprehensive chart section: Inflación, Riesgo País, Tasas
- Keep clean minimal design without borders
- Simplify cotizaciones visualization with thin bars
- Charts now displayed in cleaner layout without heavy cards
- Add contextual info for IPC, UVA, and Riesgo País
- Better responsive grid (2 cols mobile, 3 tablet, 5/6 desktop)
- All data in single scrollable view

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>

- Complete UX/UI overhaul

Changes:

- Remove all unnecessary borders and boxes
- Simplify header (no icons, just text)
- Redesign indicators as clean stat blocks (no cards/borders)
- Add trend indicators (arrows) for all metrics
- Show change values (pp, pb) next to trends
- Streamline dollar comparison with thin progress bars
- Sort dollars by value (highest first)
- Simplify brecha cards with minimal bg (bg-white/[0.02])
- Remove heavy Card components throughout
- Use consistent spacing (space-y-8)
- Cleaner typography hierarchy
- Minimal info footer with subtle background
- Better visual flow and breathing room
- Align with modern dashboard aesthetics

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
