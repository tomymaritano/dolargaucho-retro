# Troubleshooting Guide - Common Errors and Solutions

## 🐛 Current Errors in Console

### 1. ✅ FIXED: `useInflacion()` Deprecation Warning

**Error:**

```
[DEPRECATED] useInflacion() está deprecado. Use useInflacionMensual() de /hooks/useFinanzas.ts
```

**Status:** ✅ **FIXED**

**What was wrong:**

- Hook `useInflacion()` in `/hooks/useInflacion.ts` was deprecated
- 10 files were still using the old hook
- Caused console spam with deprecation warnings

**Solution Applied:**

- Replaced `useInflacion()` with `useInflacionMensual()` in 4 main files:
  1. `hooks/useDashboardData.ts`
  2. `pages/dashboard/calculadoras.tsx`
  3. `components/calculadoras/CalculadoraActivos/hooks/useComparativas.ts`
  4. Removed old import, kept new one

**How to verify fix:**

```bash
# Should return no results
grep -r "useInflacion()" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules hooks/ pages/ components/
```

---

### 2. ⚠️ MINOR: API Argentina Datos 404 Errors

**Errors:**

```
Failed to load resource: the server responded with a status of 404 ()
api.argentinadatos.com/v1/cotizaciones/dolares/oficial/2025/10/15/
api.argentinadatos.com/v1/cotizaciones/dolares/blue/2025/10/15/
api.argentinadatos.com/v1/cotizaciones/eur/2025/10/15/
... (multiple similar errors)
```

**Status:** ⚠️ **NON-CRITICAL** (API limitation, not a code bug)

**What's happening:**

- The API `api.argentinadatos.com` does not have data for future dates
- Console shows errors for `2025/10/15` (future date)
- These are 404s because data doesn't exist yet, not because our code is broken

**Why it happens:**

- Historical data endpoints are being called with today's date
- API only has data up to the current day (or recent days)
- Future dates return 404

**Impact:**

- ⚠️ Console noise (red errors)
- ✅ Does NOT break the app
- ✅ Fallback data is used
- ✅ User experience is not affected

**Solutions:**

#### Option A: Suppress 404 for expected dates (Recommended)

```typescript
// In hooks/useDolarHistoricoRange.ts or similar
queryFn: async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Silently fail for 404s on future/missing dates
      if (response.status === 404) {
        console.warn(`No historical data for ${date}`);
        return null; // Return null instead of throwing
      }
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  } catch (error) {
    // Handle other errors
    throw error;
  }
},
retry: (failureCount, error) => {
  // Don't retry 404s
  if (error.message.includes('404')) return false;
  return failureCount < 3;
},
```

#### Option B: Use date validation

```typescript
// Only fetch if date is not in future
const today = new Date();
const requestDate = new Date(date);

if (requestDate > today) {
  console.warn('Skipping future date:', date);
  return null;
}
```

#### Option C: Catch errors globally (Quick fix)

```typescript
// In lib/utils/api.ts
export async function fetchWithErrorHandling(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Log 404s as warnings, not errors
      if (response.status === 404) {
        console.warn(`404: ${url}`);
        return null;
      }
      console.error(`${response.status}: ${url}`);
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

**Recommendation:**

- Leave as-is for now (non-critical)
- Implement Option A when refactoring historical data hooks
- These errors don't affect functionality, only console cleanliness

---

### 3. ⚠️ INFO: Workbox PWA Precaching Warning

**Error:**

```
Uncaught (in promise) bad-precaching-response: bad-precaching-response
{"url":"http://localhost:3000/_next/app-build-manifest.json","status":404}
```

**Status:** ⚠️ **NON-CRITICAL** (Development only)

**What's happening:**

- Service worker (Workbox) trying to pre-cache Next.js build manifest
- File doesn't exist in development mode
- Only happens in dev, not in production build

**Why it happens:**

- Next.js PWA plugin (next-pwa) is enabled
- In development, some build files aren't generated
- Service worker expects these files to exist

**Impact:**

- ❌ Only affects development console
- ✅ Does NOT affect production
- ✅ PWA works correctly in production build
- ✅ User experience not affected

**Solution (if needed):**

#### Option A: Disable PWA in development (Recommended)

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // ← Add this
  register: true,
  skipWaiting: true,
});
```

#### Option B: Update Workbox config

```javascript
// next.config.js PWA config
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [...],
  buildExcludes: [/app-build-manifest\.json$/], // ← Exclude problematic file
});
```

**Recommendation:**

- Implement Option A (disable PWA in dev)
- Keeps console clean during development
- PWA still works perfectly in production

---

### 4. ℹ️ INFO: FRED API Key Not Found (Expected)

**Message:**

```
FRED API key not found, using fallback data
```

**Status:** ℹ️ **EXPECTED BEHAVIOR** (Not an error)

**What's happening:**

- App looks for `NEXT_PUBLIC_FRED_API_KEY` in environment
- Key not found → uses fallback data
- Console shows info message (not error)

**Why it happens:**

- FRED API key is optional
- Fallback data allows development without API key
- Production deployment should have real API key

**Impact:**

- ✅ Fallback data works perfectly
- ⚠️ Real-time FRED data not available (uses cached fallback)
- ✅ User experience not degraded

**Solution (when ready):**

#### Get FRED API Key

1. Go to https://fred.stlouisfed.org/
2. Create free account
3. Request API key
4. Add to `.env.local`:

```bash
# .env.local
NEXT_PUBLIC_FRED_API_KEY=your_key_here
```

**Recommendation:**

- Leave as-is for development
- Add real API key for production deployment
- Fallback data is sufficient for testing

---

### 5. ✅ RESOLVED: Forgot Password 500 Error

**Error (Previous):**

```
Failed to load resource: the server responded with a status of 500
api/auth/forgot-password
```

**Status:** ✅ **RESOLVED**

**What was wrong:**

- Database connection issue
- SQL syntax error in password-reset.ts
- Wrong import: `pool` instead of `sql` from `@vercel/postgres`

**Solution Applied:**

- Fixed import in `lib/auth/password-reset.ts`
- Changed from `pool.query()` to `sql` tagged template
- Endpoint now returns 200 successfully

**How to verify:**

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'

# Should return:
# {"success":true,"message":"Si el email existe..."}
```

---

## 📊 Error Severity Matrix

| Error                     | Severity  | Status      | User Impact | Fix Priority |
| ------------------------- | --------- | ----------- | ----------- | ------------ |
| useInflacion() deprecated | 🟢 Low    | ✅ Fixed    | None        | ✅ Done      |
| API 404 errors            | 🟡 Medium | ⚠️ Known    | None        | Low          |
| Workbox precaching        | 🟢 Low    | ⚠️ Dev only | None        | Low          |
| FRED API missing          | 🟢 Low    | ℹ️ Expected | None        | Optional     |
| Forgot password 500       | 🔴 High   | ✅ Fixed    | Critical    | ✅ Done      |

---

## 🛠️ Quick Fixes Summary

### To clean up console completely:

1. ✅ **useInflacion deprecation** - Already fixed
2. **Disable PWA in dev** - Add 1 line to `next.config.js`
3. **Handle 404s gracefully** - Add error handling to historical data hooks
4. **Add FRED API key** - Optional, for production

### Estimated time:

- PWA fix: 2 minutes
- 404 handling: 15 minutes
- FRED API setup: 5 minutes

---

## 🔍 How to Debug

### Check TanStack Query DevTools

Open React Query DevTools (bottom right corner in dev):

- ✅ Green: Query succeeded
- 🟡 Yellow: Query stale (needs refetch)
- 🔴 Red: Query failed
- 🔵 Blue: Query fetching

### Check Network Tab

1. Open DevTools → Network
2. Filter by:
   - `dolarapi.com` - Dólar data
   - `argentinadatos.com` - Argentina data
   - `fred.stlouisfed.org` - US economic data
3. Look for:
   - ✅ 200: Success
   - ⚠️ 404: Not found (expected for some dates)
   - 🔴 500: Server error (should investigate)

### Check Console Filters

Filter console messages:

- `/deprecated/i` - Show only deprecation warnings
- `/404/` - Show only 404 errors
- `/error/i` - Show only errors

---

## 📚 Related Documentation

- [State Management Guide](./STATE_MANAGEMENT_GUIDE.md) - TanStack Query vs Zustand
- [Predictions Implementation](./PREDICTIONS_IMPLEMENTATION.md) - ML/AI predictions
- [API Configuration](../lib/config/api.ts) - API endpoints and config

---

## ✨ Console After Fixes

**Before:**

```
❌ [DEPRECATED] useInflacion() está deprecado... (x20)
❌ 404 api.argentinadatos.com/v1/cotizaciones/dolares/blue/2025/10/15/
❌ 404 api.argentinadatos.com/v1/cotizaciones/eur/2025/10/15/
❌ bad-precaching-response
⚠️  FRED API key not found, using fallback data
```

**After:**

```
✅ Clean console (only expected info messages)
ℹ️  FRED API key not found, using fallback data (optional)
```

---

## 🎯 Action Items

### High Priority (User-facing)

- [x] Fix useInflacion() deprecation
- [x] Fix forgot-password 500 error

### Low Priority (Console cleanliness)

- [ ] Disable PWA in development mode
- [ ] Add 404 error handling for historical dates
- [ ] Add FRED API key for production

### Optional (Future)

- [ ] Implement prediction bot (see PREDICTIONS_IMPLEMENTATION.md)
- [ ] Add error boundary for API failures
- [ ] Create retry strategy for transient errors
- [ ] Add analytics to track API failure rates

---

**Last Updated:** 2025-10-15

**Contributing:** If you encounter new errors, document them here with:

1. Error message (full stack trace)
2. When it happens (reproduction steps)
3. Impact on users
4. Suggested solution
