# PWA Setup Guide - Dólar Gaucho

## ✅ Implementado

La aplicación ya está configurada como Progressive Web App (PWA).

### Características Implementadas

1. **Manifest.json** ✅
   - Nombre y descripción de la app
   - Iconos en múltiples tamaños
   - Theme colors
   - Shortcuts a secciones principales
   - Screenshots para app stores

2. **Service Worker** ✅
   - Caching automático de APIs externas
   - Cache de imágenes estáticas
   - Estrategias de caching optimizadas
   - Offline fallback

3. **Caching Strategy** ✅
   - **DolarAPI**: NetworkFirst con timeout de 10s
   - **ArgentinaData API**: NetworkFirst, cache 5min
   - **Imágenes**: CacheFirst, persiste 30 días

---

## 📱 Instalación para Usuarios

### En Android (Chrome/Edge)

1. Abre `https://dolargaucho.com` en Chrome
2. Toca el menú (3 puntos) → "Agregar a pantalla de inicio"
3. Confirma la instalación
4. El ícono aparecerá en tu pantalla de inicio

### En iOS (Safari)

1. Abre `https://dolargaucho.com` en Safari
2. Toca el botón de compartir (cuadrado con flecha)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma
5. La app aparecerá como cualquier otra aplicación

### En Desktop (Chrome/Edge)

1. Abre `https://dolargaucho.com`
2. Mira el ícono de instalación en la barra de direcciones (➕)
3. Haz clic → "Instalar"
4. La app se abrirá en ventana independiente

---

## 🎨 Generar Iconos

Necesitas generar los íconos PWA. Usa estas herramientas:

### Opción 1: PWA Asset Generator (Recomendado)

```bash
npm install -g pwa-asset-generator

# Genera todos los tamaños desde un logo
pwa-asset-generator logo.svg public/icons \
  --background "#0A0E27" \
  --padding "10%" \
  --index public/manifest.json
```

### Opción 2: Online (Realfavicongenerator)

1. Ve a https://realfavicongenerator.net/
2. Sube tu logo (preferiblemente 512x512)
3. Descarga el paquete
4. Extrae los iconos a `/public/icons/`

### Opción 3: Manual con ImageMagick

```bash
# Instala ImageMagick
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Linux

# Genera todos los tamaños
for size in 72 96 128 144 152 192 384 512; do
  convert logo.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
done
```

---

## 🚀 Testing PWA

### Lighthouse Audit

1. Abre Chrome DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Progressive Web App"
4. Click en "Analyze page load"

**Score esperado**: 90-100

### PWA Builder

Analiza tu PWA en: https://www.pwabuilder.com/

---

## 📋 Checklist de Funcionalidades PWA

- ✅ Manifest.json configurado
- ✅ Service Worker registrado
- ✅ Iconos en múltiples tamaños
- ✅ Theme color definido
- ✅ Caching strategies
- ✅ Funciona offline (básico)
- ⚠️ Push notifications (pendiente - próxima fase)
- ⚠️ Background sync (pendiente)
- ⚠️ Share target API (pendiente)

---

## 🔧 Troubleshooting

### La PWA no se muestra para instalación

1. Verifica HTTPS (requerido en producción)
2. Confirma que `manifest.json` es accesible
3. Chequea que los iconos existen en `/public/icons/`
4. Revisa la consola de DevTools por errores

### Service Worker no se actualiza

```bash
# Limpia cache y recompila
rm -rf .next public/sw.js public/workbox-*.js
npm run build
```

### Offline no funciona

1. Verifica que el service worker está registrado
2. Chequea Network tab en DevTools (debe mostrar "ServiceWorker")
3. Revisa que las rutas de cache coinciden con las URLs

---

## 📚 Recursos

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [next-pwa GitHub](https://github.com/shadowwalker/next-pwa)
- [Workbox Strategies](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

## 🎯 Próximos Pasos (Fase 2)

1. **Push Notifications**
   - Integrar con Firebase Cloud Messaging
   - Implementar permisos de notificaciones
   - Conectar con sistema de alertas

2. **Offline Mode Mejorado**
   - Caché de datos del usuario
   - Sincronización cuando vuelve online
   - Indicador visual de estado offline

3. **Share Target API**
   - Permitir compartir cotizaciones a la app
   - Desde otras apps del teléfono

4. **Shortcuts Dinámicos**
   - Shortcuts a favoritos del usuario
   - Acceso rápido a última calculadora usada
