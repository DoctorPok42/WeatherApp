import Area from '../Area';

import { useState } from "react";

interface ResultProps {
  data: any;
}

const Result = ({ data }: ResultProps) => {
  const [type, setType] = useState<"today" | "5days">("today")

  const epa = [
    "Good",
    "Moderate",
    "Unhealthy for Sensitive Groups",
    "Unhealthy",
    "Very Unhealthy",
    "Hazardous"
  ]

  const epaColor = [
    "#17ead9",
    "#6078ea",
    "#ff758c",
    "#ff6b6b",
    "#ed8f03",
    "#ef504c"
  ]

  const tempColor = [
    "var(--color-temp-good)",
    "var(--color-temp-mild)",
    "var(--color-temp-hot)"
  ]

  const actual = data.dataHistory.forecast.forecastday[0].hour[
    Date.now() > new Date(data.data.location.localtime).getTime() ?
      new Date(data.data.location.localtime).getHours() :
      new Date().getHours()
  ]

  const tempIcon = {
    "Sunny": "/picto.svg#ic-sun",
    "Clear": "/picto.svg#ic-moon",
    "Partly cloudy": "/picto.svg#ic-cloud-sun",
    "Cloudy": "/picto.svg#ic-cloud",
    "Overcast": "/picto.svg#ic-cloud",
    "Mist": "/picto.svg#ic-cloud-fog",
  } as { [key: string]: string }

  return (
    <div className="">
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <div className="box flex-6!">
          <span className="text-[2.4rem] font-extrabold leading-none" style={{ color: tempColor[actual.temp_c < 25 ? 0 : actual.temp_c < 32 ? 1 : 2] }}>
            {actual.temp_c}°C
            <svg width="34" height="34" className="absolute top-[1.1rem] right-[1.1rem]">
              <use href={tempIcon[data.data.current.condition.text] || "/picto.svg#ic-sun"} />
            </svg>
          </span>

          <span className="text-[1.05rem] font-extrabold">
            {data.data.location.name}, <span className="font-semibold text-muted">{data.data.location.country}</span>
          </span>

          <span className="text-[.85rem] font-semibold text-muted">{data.data.current.condition.text}</span>
        </div>

        <div className="box">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[1.02rem]">Wind</span>
            <svg width="20" height="20" className="text-[#5271FF]">
              <use href="/picto.svg#ic-wind" />
            </svg>
          </div>
          <span className="font-bold text-[1.15rem]">{data.data.current.wind_kph} km/h </span>
          <span className="text-[.85rem] font-semibold text-muted">{data.data.current.wind_dir}</span>
        </div>

        <div className="box">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[1.02rem]">Humidity</span>
            <svg width="20" height="20" className="text-[#5271FF]">
              <use href="/picto.svg#ic-drop" />
            </svg>
          </div>
          <span className="font-bold text-[1.15rem]">{data.data.current.humidity}%</span>
        </div>

        <div className="box">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[1.02rem]">Pressure</span>
            <svg width="20" height="20" className="text-[#5271FF]">
              <use href="/picto.svg#ic-gauge" />
            </svg>
          </div>
          <span className="font-bold text-[1.15rem]">{data.data.current.pressure_mb} mb</span>
        </div>

        <div className="box">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[1.02rem]">Visibility</span>
            <svg width="20" height="20" className="text-[#5271FF]">
              <use href="/picto.svg#ic-eye" />
            </svg>
          </div>
          <span className="font-bold text-[1.15rem]">{data.data.current.vis_km} km</span>
        </div>

        <div className="box flex-5! font-bold" style={{
          backgroundColor: epaColor[data.data.current.air_quality["us-epa-index"] - 1]
        }}>
          <div className="flex items-center justify-between">
            <span className="text-[1.02rem] font-extrabold">Air Quality {
              epa[data.data.current.air_quality["us-epa-index"] - 1]
            }</span>

            <svg width="20" height="20">
              <use href="/picto.svg#ic-lungs" />
            </svg>
          </div>

          <div className="flex gap-[1.2rem]">
            <span className="flex flex-col"><span className="text-[.68rem] opacity-80 uppercase">Co </span> {data.data.current.air_quality.co} </span>
            <span className="flex flex-col"><span className="text-[.68rem] opacity-80 uppercase">No2</span> {data.data.current.air_quality.no2}</span>
            <span className="flex flex-col"><span className="text-[.68rem] opacity-80 uppercase">O3 </span> {data.data.current.air_quality.o3}</span>
          </div>
        </div>
      </div>

      <div className="box mb-4!">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-[1.1rem]">
          <div>
            <h2 className="m-0 text-[1.15rem] font-extrabold">
              Temperature
            </h2>
            <span className="text-[.9rem] font-semibold text-muted">
              {actual.temp_c}°C · Feel like {actual.feelslike_c}°C
            </span>
          </div>

          <div className="flex gap-[.4rem] bg-track rounded-full p-[.3rem] font-bold">
            <button className={`bg-[#5271ff] text-white text-[.85rem] rounded-full px-[.9rem] py-[.3rem] cursor-pointer ${type === "today" ? "bg-[#5271ff]" : "bg-track text-muted!"}`} onClick={() => setType("today")}>
              Today
            </button>
            <button className={`bg-track text-muted text-[.85rem] rounded-full px-[.9rem] py-[.3rem] cursor-pointer ${type === "5days" ? "bg-[#5271ff]! text-white!" : "bg-track"}`} onClick={() => setType("5days")}>
              5-Days
            </button>
          </div>
        </div>
        {type === "today" && (
          <div className="flex flex-col gap-[.8rem]">
            <Area colorData={[
              tempColor[actual.temp_c < 25 ? 0 : actual.temp_c < 32 ? 1 : 2]
            ]} data={data.dataHistory.forecast.forecastday[0].hour} />

            <h3 className="mb-2 leading-0 text-[.95rem] text-muted uppercase">hours by hour</h3>

            <div className="flex gap-[.6rem] overflow-x-auto pb-4">
              {data.dataHistory.forecast.forecastday[0].hour.map((hour: any, index: number) => (
                <div key={index + 1} className="box shadow-none! bg-[#eef1fa]! dark:bg-[#1c222e]! items-center justify-center gap-[.4rem]! py-[.8rem]!">
                  <span className="text-[.72rem] font-semibold text-muted">{hour.time.split(" ")[1]}</span>
                  <svg width="20" height="20" className="text-[#5271FF]">
                    <use href={tempIcon[hour.condition.text] || "/picto.svg#ic-sun"} />
                  </svg>
                  <span className="text-[.85rem] font-semibold text-text">{hour.temp_c}°</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {type === "5days" && (
          <div className="flex flex-wrap gap-[.6rem] justify-center">
            {data.dataHistory.forecast.forecastday.map((day: any, index: number) => (
              <div key={index + 1} className="box mb-4 dark:bg-[#1c222e]! items-center gap-2!">
                <span className="font-extrabold">{new Date(day.date).toLocaleDateString("en-US", { weekday: "long" })}</span>
                <svg width="30" height="30" className="text-[#5271FF]">
                  <use href={tempIcon[day.day.condition.text] || "/picto.svg#ic-sun"} />
                </svg>

                <div className="flex items-center gap-2 text-[.95rem] font-semibold">
                  <span className="text-text">{day.day.maxtemp_c}°</span>
                  <span className="text-muted">{day.day.mintemp_c}°</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Result
