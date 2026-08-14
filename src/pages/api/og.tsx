import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const config = { runtime: "edge" };

const BG = "#0b0e14";
const CARD = "#151a24";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#eef1f7";
const MUTED = "#93a0b4";
const PRIMARY_LIGHT = "#7c92ff";

const tempColor = (t: number) => (t < 25 ? "#17ead9" : t < 32 ? "#ffb648" : "#ff5f6d");

const AQI_COLORS = ["#17c9b8", "#6078ea", "#e08a4e", "#ff6b6b", "#c2528f", "#8a3fa0"];
const AQI_LABELS = ["Good", "Moderate", "Unhealthy (Sensitive)", "Unhealthy", "Very Unhealthy", "Hazardous"];

const cloudMark = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><path d="M9 30c-4 0-6.5-3-6.5-6.4 0-3.4 2.6-6.2 5.9-6.7C9.4 12.6 13.6 9.2 18.6 9.2c5 0 9.3 3.4 10.4 8 4.1.4 7.2 3.8 7.2 7.9 0 4.4-3.6 8-8 8H11.5" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const WEATHER_PATHS: Record<string, string> = {
  sun: `<circle cx="12" cy="12" r="4" fill="none" stroke="C" stroke-width="2"/><g stroke="C" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/><line x1="4.5" y1="4.5" x2="6.2" y2="6.2"/><line x1="17.8" y1="17.8" x2="19.5" y2="19.5"/><line x1="4.5" y1="19.5" x2="6.2" y2="17.8"/><line x1="17.8" y1="6.2" x2="19.5" y2="4.5"/></g>`,
  cloud: `<path d="M17.5 19H8a5.5 5.5 0 01-1-10.9A6 6 0 0118 10a4 4 0 01-.5 9z" fill="none" stroke="C" stroke-width="2" stroke-linejoin="round"/>`,
  partly: `<circle cx="8" cy="8" r="3.2" fill="none" stroke="C" stroke-width="1.8"/><g stroke="C" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="2.2" x2="8" y2="3.6"/><line x1="2.7" y1="8" x2="4.1" y2="8"/><line x1="3.8" y1="3.8" x2="4.8" y2="4.8"/></g><path d="M18.5 20H10a4.5 4.5 0 01-.8-8.9A5 5 0 0119 12.5a3.3 3.3 0 01-.5 7.5z" fill="none" stroke="C" stroke-width="2" stroke-linejoin="round"/>`,
  rain: `<path d="M17.5 15H8a5.5 5.5 0 01-1-10.9A6 6 0 0118 6a4 4 0 01-.5 9z" fill="none" stroke="C" stroke-width="2" stroke-linejoin="round"/><g stroke="C" stroke-width="2" stroke-linecap="round"><line x1="9" y1="18.5" x2="8" y2="21.5"/><line x1="13" y1="18.5" x2="12" y2="21.5"/><line x1="17" y1="18.5" x2="16" y2="21.5"/></g>`,
};

const weatherIcon = (kind: keyof typeof WEATHER_PATHS, color: string) => {
  const body = WEATHER_PATHS[kind].replace(/"C"/g, `"${color}"`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${body}</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const iconKind = (condition: string): keyof typeof WEATHER_PATHS => {
  const c = condition.toLowerCase();
  if (/(rain|drizzle|shower|sleet|snow|thunder)/.test(c)) return "rain";
  if (/(overcast|cloudy|fog|mist)/.test(c) && !/partly/.test(c)) return "cloud";
  if (/partly/.test(c)) return "partly";
  return "sun";
};

export default async function og(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? "Talence";

  const origin = new URL(req.url).origin;
  const [regular, extrabold] = await Promise.all([
    fetch(`${origin}/fonts/Nunito-SemiBold.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${origin}/fonts/Nunito-ExtraBold.ttf`).then((r) => r.arrayBuffer()),
  ]);

  let name = city;
  let country = "";
  let temp = 0;
  let feels = 0;
  let condition = "Sunny";
  let wind = 0;
  let humidity = 0;
  let aqiIndex = 1;
  let ok = false;

  try {
    const r = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`
    );
    const data = await r.json();
    if (!data.error) {
      name = data.location.name;
      country = data.location.country;
      temp = Math.round(data.current.temp_c);
      feels = Math.round(data.current.feelslike_c);
      condition = data.current.condition.text;
      wind = Math.round(data.current.wind_kph);
      humidity = data.current.humidity;
      aqiIndex = data.current.air_quality?.["us-epa-index"] ?? 1;
      ok = true;
    }
  } catch {
  }

  const accent = tempColor(temp);
  const aqiColor = AQI_COLORS[Math.min(aqiIndex - 1, 5)];
  const aqiLabel = AQI_LABELS[Math.min(aqiIndex - 1, 5)];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "64px 72px",
          fontFamily: "Nunito",
        }}
      >
        < div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={cloudMark(PRIMARY_LIGHT)} width={52} height={52} />
          <div style={{ fontSize: 34, fontWeight: 800, color: TEXT }}> Weather App </div>
        </div>

        {
          ok ? (
            <>
              < div style={{ display: "flex", alignItems: "flex-end", gap: 32 }
              }>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ fontSize: 150, fontWeight: 800, color: accent, lineHeight: 1 }}>
                      {temp}°
                    </div>
                    < img src={weatherIcon(iconKind(condition), accent)} width={82} height={82} />
                  </div>
                  < div style={{ fontSize: 58, fontWeight: 800, color: TEXT, marginTop: 12 }}>
                    {name}
                    {country ? <span style={{ color: MUTED, fontWeight: 600 }}>, {country} </span> : null}
                  </div>
                  < div style={{ fontSize: 30, fontWeight: 600, color: MUTED, marginTop: 4 }}>
                    {condition} · ressenti {feels}°C
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                {
                  [
                    { label: "Vent", value: `${wind} km/h` },
                    { label: "Humidité", value: `${humidity}%` },
                  ].map((m) => (
                    <div
                      key={m.label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        background: CARD,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 20,
                        padding: "20px 28px",
                        minWidth: 210,
                      }}
                    >
                      <div style={{ fontSize: 22, fontWeight: 700, color: MUTED }}> {m.label} </div>
                      < div style={{ fontSize: 34, fontWeight: 800, color: TEXT }}> {m.value} </div>
                    </div>
                  ))}
                <div
                  style={
                    {
                      display: "flex",
                      flexDirection: "column",
                      background: aqiColor,
                      borderRadius: 20,
                      padding: "20px 28px",
                      minWidth: 210,
                    }
                  }
                >
                  <div style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                    Qualité de l'air
                  </div>
                  < div style={{ fontSize: 34, fontWeight: 800, color: "#ffffff" }}> {aqiLabel} </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 86, fontWeight: 800, color: TEXT, lineHeight: 1.1 }}>
                La météo, ville par ville
              </div>
              < div style={{ fontSize: 32, fontWeight: 600, color: MUTED, marginTop: 16 }}>
                Température, vent, humidité, qualité de l'air et prévisions à 5 jours.
              </div>
            </div>
          )}

        <div style={{ display: "flex", height: 8, borderRadius: 4, background: accent, width: 180 }} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Nunito", data: regular, weight: 600, style: "normal" },
        { name: "Nunito", data: extrabold, weight: 800, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, immutable, no-transform, s-maxage=1800, max-age=1800",
      },
    }
  );
}
