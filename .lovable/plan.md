

## Plan: Netlify Configuration for Reliable Deployment

### Goal
Add Netlify configuration files so deep links (`/sizzle`, `/storytel`, etc.) work, builds are reproducible, and security/caching headers follow current best practices.

### Background
Netlify is a static host. For a Vite + React Router SPA it needs three things:
1. A build command + publish directory it can rely on
2. A SPA fallback so unknown paths serve `index.html`
3. Sensible cache headers so hashed JS/CSS are cached long-term and `index.html` is always fresh

The cleanest current practice (2024-2025) is to put everything in a single `netlify.toml` at the repo root rather than scattering `_redirects` and `_headers`. `netlify.toml` is version-controlled, overrides UI settings, and is the approach Netlify documents first.

We'll also keep a minimal `public/_redirects` as a safety net — it gets copied into `dist/` automatically and guarantees SPA fallback even if `netlify.toml` is ever misread.

### Files to add

| File | Purpose |
|---|---|
| `netlify.toml` (root) | Build command, publish dir, Node version, SPA redirect, cache + security headers |
| `public/_redirects` | Backup SPA fallback (already created earlier — will be kept) |

### `netlify.toml` contents

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# SPA fallback — every unknown path serves index.html so React Router takes over
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Long-term cache for hashed Vite assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Never cache index.html so users always get the latest app shell
[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# Baseline security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

### Netlify dashboard settings
Once `netlify.toml` is committed, Netlify will pick up build command, publish dir, and Node version automatically. You can leave the UI fields blank or matching:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

### What this fixes / improves
- `/sizzle`, `/storytel`, `/embark`, `/tobii`, `/ahouse`, `/king`, `/nordnet` will load directly and survive page refresh
- Repeat visits are faster (hashed assets cached for a year)
- Users always get the newest deploy because `index.html` is never cached
- Basic clickjacking / MIME-sniffing protections in place
- Build is pinned to Node 20 so deploys are reproducible

### Notes
- No code changes to the React app are needed.
- This config only affects Netlify. Lovable's own hosting ignores these files and handles SPA routing on its own, so nothing breaks there.
- `lovable-tagger` stays as-is (dev-only, not in the production bundle).

