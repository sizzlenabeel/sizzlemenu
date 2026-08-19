# Sizzle Fridge

A digital menu application for Sizzle, built with React, TypeScript, Vite, and Tailwind CSS.

## Getting Started

```sh
npm install
npm run dev
```

## Scheduled banners

The `banner_messages` table powers announcements above every location menu. Each
row has message text and can optionally include `link_url` and `link_label`. It
appears at `starts_at` and is hidden after `ends_at`; leave `ends_at` null for no
expiry. Links are stored as data rather than raw HTML so they remain safe to render.

For a reusable internal banner link, use `{location}` in place of the location's
Dynamo ID. For example, `/{location}/snacks` resolves to `/storytel/snacks` when
viewed from Storytel. Supported paths are `/{location}/food`,
`/{location}/snacks`, `/{location}/breakfast`, `/{location}/drinks`, and
`/{location}/product/{productId}`.
