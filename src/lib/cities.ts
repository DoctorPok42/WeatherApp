export type City = {
  slug: string;
  name: string;
  query: string;
  country: string;
};

export const CITIES: City[] = [
  { slug: "paris", name: "Paris", query: "Paris", country: "France" },
  { slug: "london", name: "London", query: "London", country: "United Kingdom" },
  { slug: "new-york", name: "New York", query: "New York", country: "United States" },
  { slug: "tokyo", name: "Tokyo", query: "Tokyo", country: "Japan" },
  { slug: "sydney", name: "Sydney", query: "Sydney", country: "Australia" },
  { slug: "berlin", name: "Berlin", query: "Berlin", country: "Germany" },
  { slug: "madrid", name: "Madrid", query: "Madrid", country: "Spain" },
  { slug: "rome", name: "Rome", query: "Rome", country: "Italy" },
  { slug: "moscow", name: "Moscow", query: "Moscow", country: "Russia" },
  { slug: "beijing", name: "Beijing", query: "Beijing", country: "China" },
  { slug: "delhi", name: "Delhi", query: "Delhi", country: "India" },
  { slug: "cairo", name: "Cairo", query: "Cairo", country: "Egypt" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", query: "Rio de Janeiro", country: "Brazil" },
  { slug: "cape-town", name: "Cape Town", query: "Cape Town", country: "South Africa" },
  { slug: "toronto", name: "Toronto", query: "Toronto", country: "Canada" },
  { slug: "mexico-city", name: "Mexico City", query: "Mexico City", country: "Mexico" },
  { slug: "bangkok", name: "Bangkok", query: "Bangkok", country: "Thailand" },
  { slug: "singapore", name: "Singapore", query: "Singapore", country: "Singapore" },
  { slug: "dubai", name: "Dubai", query: "Dubai", country: "United Arab Emirates" },
  { slug: "istanbul", name: "Istanbul", query: "Istanbul", country: "Turkey" },
  { slug: "seoul", name: "Seoul", query: "Seoul", country: "South Korea" },
  { slug: "jakarta", name: "Jakarta", query: "Jakarta", country: "Indonesia" },
  { slug: "sao-paulo", name: "São Paulo", query: "São Paulo", country: "Brazil" },
  { slug: "los-angeles", name: "Los Angeles", query: "Los Angeles", country: "United States" },
];

export const getCityBySlug = (slug: string): City | undefined =>
  CITIES.find((c) => c.slug === slug.toLowerCase());

export const toSlug = (input: string): string =>
  input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
