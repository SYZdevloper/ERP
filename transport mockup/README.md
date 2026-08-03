# Transportation Industry Insights — Next.js App Router Starter

This project converts the supplied transportation HTML prototype into reusable Next.js/TypeScript components while preserving the same homepage flow used by Agriculture Industry Insights.

## Why this structure maps cleanly

- `components/` contains reusable visual sections and client interactions.
- `config/transportation.ts` contains transport-specific branding, routes, copy, sample verticals and sample reports.
- `lib/homepage-data.ts` is the backend adapter. It accepts common aliases such as `categories`/`verticals`, `report_count`/`reports_count`, `base_year`, `forecast_value`, and `latest_reports`.
- `app/page.tsx` stays thin, so the same page can be reused for another industry by swapping the config and endpoint.
- Route contracts match the Agriculture website: `/verticals`, `/services`, `/news`, `/blogs`, `/about`, `/contact`, `/reports/[slug]`.

## Run

```bash
npm install
npm run dev
```

## Connect the existing backend

1. Copy `.env.example` to `.env.local`.
2. Set `HOMEPAGE_API_URL` to the endpoint already used by the agriculture homepage.
3. If your payload uses different field names, edit only `lib/homepage-data.ts`.

Example accepted payload:

```json
{
  "categories": [
    {
      "id": "1",
      "title": "Road Transportation",
      "slug": "road-transportation",
      "report_count": 18,
      "icon": "road"
    }
  ],
  "latest_reports": [
    {
      "id": "abc",
      "title": "Smart Highways Market Size, Share & Forecast 2026–2035",
      "slug": "smart-highways-market-abc",
      "category_name": "Road",
      "base_year": 2025,
      "base_value": "USD 52.4 Billion",
      "forecast_year": 2035,
      "forecast_value": "USD 128.2 Billion",
      "cagr": "9.3%"
    }
  ]
}
```

## Create the next industry website

Duplicate `config/transportation.ts`, rename it, and change:

- name/domain/email
- hero and section copy
- colors in `app/globals.css`
- verticals and fallback sample content
- API endpoint environment variable

The shared components and public route structure can remain unchanged.

## Merge into the agriculture repository

Copy these folders/files into the existing App Router project:

```text
app/page.tsx
app/globals.css
components/
config/transportation.ts
lib/homepage-data.ts
types/site.ts
```

Keep your existing `/verticals`, `/services`, `/news`, `/blogs`, `/about`, `/contact`, and `/reports/[slug]` pages. Update imports or aliases only if your repository does not use `@/*`.
