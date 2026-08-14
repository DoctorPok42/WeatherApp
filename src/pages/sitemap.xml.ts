import type { GetServerSideProps } from "next";
import { CITIES } from "../lib/cities";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://weather.doctorpok.io";

const buildSitemap = (): string => {
  const lastmod = new Date().toISOString();

  const urls = [
    `  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...CITIES.map(
      (city: any) => `  <url>
    <loc>${SITE_URL}/${city.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(buildSitemap());
  res.end();

  return { props: {} };
};

const Sitemap = () => null;

export default Sitemap;
