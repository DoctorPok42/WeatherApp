<div align="center">
    <img src="public/logo-icon.svg" width="90">

# Weather App

**Weather by city — live conditions, hourly curve and 3-day forecast.**

[weather.doctorpok.io](https://weather.doctorpok.io)  
![Uptime](https://uptime.doctorpok.io/api/badge/13/status)

</div>

---

## Overview

A Next.js weather platform built on [weatherapi.com](https://www.weatherapi.com/).
Every city gets its own server-rendered, indexable URL (`/[city]`)
carrying full meta tags and a generated social preview image.

**Features**

- Current conditions: temperature, feels-like, wind, humidity, pressure, visibility
- US-EPA air quality index with CO / NO₂ / O₃ readings, colour-coded
- Hourly temperature area chart + hour-by-hour strip
- 3-day forecast tab
- Search by city name or by browser geolocation
- Light / dark theme driven by system preference
- Per-city SEO: title, description, canonical, Open Graph, Twitter Card
- Dynamic 1200×630 OG image per city (`/api/og`)

---

## Installation

**1. Clone**

```bash
git clone git@github.com:DoctorPok42/WeatherApp.git
cd WeatherApp
```

**2. Install**

```bash
npm install
```

**3. Environment**

Create a `.env` file. Get your API key at [weatherapi.com](https://www.weatherapi.com/).

```bash
WEATHER_API_KEY=          # weatherapi.com key
APP_URL=http://localhost:3000
                          # absolute origin used by /[city] SSR to call /api/weather
NEXT_PUBLIC_SITE_URL=https://weather.doctorpok.io
                          # absolute origin written into sitemap.xml <loc> entries
```

`APP_URL` is required: `getServerSideProps` in `/[city]` performs a server-side
`fetch` to `/api/weather` and needs an absolute URL. Without it, city pages
return no data.

**4. Run**

```bash
npm run dev     # dev server on :3000
npm run build   # production build
npm start       # serve the production build
npm run lint
```

---

## Routes

| Route | Type | Purpose |
| --- | --- | --- |
| `/` | page | Search screen (city input + geolocation button) |
| `/[city]` | page, SSR | City weather, rendered server-side so it is indexable |
| `/api/weather` | API, **POST** | Proxies weatherapi.com: `current.json` + `forecast.json` (5 days) |
| `/api/og` | API, edge | Generates the 1200×630 social preview image |
| `/sitemap.xml` | page, SSR | XML sitemap built from `src/lib/cities.ts` |

`/api/weather` reads the city from `req.body`, so it only answers POST:

```bash
curl -X POST http://localhost:3000/api/weather \
  -H "Content-Type: application/json" \
  -d '{"city":"Talence"}'
```

It accepts a city name or `"latitude,longitude"` — the geolocation button uses
the latter form.

---

## Design system

### Tokens

Defined in `src/styles/globals.css`. Tailwind 4's `@theme inline` block maps them
to utility classes, so `bg-card`, `text-muted`, `bg-track` all resolve from CSS
variables and follow the active theme automatically.

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#f5f7fb` | `#0b0e14` |
| `--card` | `#ffffff` | `#151a24` |
| `--track` | `#eef1fa` | `#1c222e` |
| `--text` | `#12151c` | `#eef1f7` |
| `--muted` | `#5c6577` | `#93a0b4` |

Primary blue is `#5271ff` (hover `#3a56d4`).

**Temperature scale** — applied to the main reading and the chart stroke:
`--color-temp-good` `#17ead9` (< 25 °C) · `--color-temp-mild` `#ffb648` (25–32 °C)
· `--color-temp-hot` `#ff6b6b` (> 32 °C)

**Air quality** — one colour per US-EPA index, 1 to 6, set on the AQI card
background.

Dark mode resolves from `prefers-color-scheme`, and can be forced by putting
`.dark` or `.light` on `:root`.

### Icons

All icons live in one sprite, `public/picto.svg`, referenced by id:

```tsx
<svg width="20" height="20" className="text-[#5271ff]">
  <use href="/picto.svg#ic-drop" />
</svg>
```

Every symbol uses `currentColor`, so colour comes from the parent's `color`.

Available: `ic-sun` · `ic-cloud` · `ic-partly` · `ic-rain` · `ic-moon` ·
`ic-wind` · `ic-drop` · `ic-gauge` · `ic-eye` · `ic-lungs` · `ic-pin` ·
`ic-search` · `ic-x` · `ic-cloud-mark`

---

## SEO

City pages carry the full set: `title`, `description`, `keywords`, `canonical`,
`robots`, Open Graph (`type`, `site_name`, `title`, `description`, `url`,
`image`, `locale`) and Twitter Card (`summary_large_image`).

### OG image

`/api/og?city=Talence` returns a 1200×630 PNG: temperature in its scale colour,
weather picto, city and country, feels-like, then wind / humidity / air-quality
cards. If the city is unknown or the API fails it falls back to a branded card,
so a shared link never shows a broken preview.

It runs on the **edge runtime** and calls weatherapi.com directly rather than
going through `/api/weather` — that is intentional, not duplication.

Preview URLs must be absolute: Slack, WhatsApp and X do not resolve relative paths.

## Tech

- [Next.js 16](https://nextjs.org/) — pages router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [ApexCharts](https://apexcharts.com/) — temperature area chart
- [weatherapi.com](https://www.weatherapi.com/) — weather data
- Docker + GitHub Actions

## License

[MIT](https://github.com/DoctorPok42/WeatherApp/blob/main/LICENSE)
