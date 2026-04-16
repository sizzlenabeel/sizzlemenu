## Plan: Favicon + Remove Lovable Mentions

### 1. Set favicon to uploaded logo

- Copy `user-uploads://Logo.2.webp` to `public/favicon.webp`
- Delete existing `public/favicon.ico` 
- Add `<link rel="icon" href="/favicon.webp" type="image/webp">` to `index.html  and other pages`

### 2. Clean Lovable mentions from index.html

- Remove `<meta name="author" content="Lovable" />`
- Update `<meta name="description">` from "Lovable Generated Project" to "Sizzle menu"
- Update `og:description` and `twitter:description` similarly
- Remove `<meta name="twitter:site" content="@Lovable" />`
- Remove TODO comments

### 3. Replace README.md

- Replace the Lovable-branded README with a simple project README for "Sizzle Menu"

### 4. Hide the Lovable badge on published deployments

- Use the `set_badge_visibility`tool to hide it on `*.lovable.app` as well

### Note on lovable-tagger

The `lovable-tagger` dev dependency in `vite.config.ts` only runs in development mode and adds no code to production builds. It's safe to leave, but I can remove it if you prefer.

### Files


| File                  | Change                                     |
| --------------------- | ------------------------------------------ |
| `public/favicon.webp` | New file (copied from upload)              |
| `index.html`          | Add favicon link, remove Lovable meta tags |
| `README.md`           | Replace with clean project README          |
| Badge setting         | Hide via API                               |
