import { useEffect, useState } from "react"
import { Result, SearchBar } from "../../components"
import ErrorPopup from "../../components/Error";
import Head from "next/head";

const City = ({ id, data }: { id: string; data: any }) => {
  const [text, setText] = useState<string>(data?.data?.location.name || id)
  const [error, setError] = useState<string>("")

  const handleSearch = async (isUsingPosition: { latitude: number; longitude: number } | false = false) => {
    try {
      if (text && !isUsingPosition) {
        window.location.href = `/${text}`
        return
      }

      let response = await fetch("/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(isUsingPosition ? { city: isUsingPosition.latitude + "," + isUsingPosition.longitude } : { city: text })
      })

      let data = await response.json()

      if (data.error) {
        setError("City not found")
        return
      }

      setError("")
      setText(data.data.location.name)
      window.location.href = `/${data.data.location.name}`

    } catch (error: any) {
      console.error(error)
      setError("Something went wrong")
    }
  }

  const handleGetPosition = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords

      handleSearch({ latitude, longitude })
    }, (error) => {
      setError("Failed to get location")
    })
  }

  useEffect(() => {
    if (!data) {
      setText(id)
      handleSearch();
    } else if (data.error) {
      setError("City not found")
    }
  }, [data])

  return (
    <div className="mx-auto px-6">
      <Head>
        <title>Weather in {text} today — {data.data?.current?.temp_c || "N/A"}°C | Weather App</title>
        <meta name="description" content={`Check the weather in ${text} today. Get the latest temperature, humidity, wind speed, and more. Stay updated with accurate weather forecasts for ${text}.`} />
        <meta name="keywords" content={`weather, ${text}, temperature, forecast, humidity, wind speed, weather app`} />
        <meta property="og:title" content={`Weather in ${text} today — ${data.data?.current?.temp_c || "N/A"}°C | Weather App`} />
        <meta property="og:description" content={`Check the weather in ${text} today. Get the latest temperature, humidity, wind speed, and more. Stay updated with accurate weather forecasts for ${text}.`} />
        <link rel="canonical" href={`https://weather.doctorpok.io/${text}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta sc-camel-char-set="utf-8" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Weather App" />
        <meta property="og:title" content={`Weather in ${text} today — ${data.data?.current?.temp_c || "N/A"}°C | Weather App`} />
        <meta property="og:description" content={`${data.data?.current?.condition || "N/A"}, ${data.data?.current?.temp_c || "N/A"}°C, Humidity: ${data.data?.current?.humidity || "N/A"}%, Wind Speed: ${data.data?.current?.wind_speed || "N/A"} km/h. Stay updated with accurate weather forecasts for ${text}.`} />
        <meta property="og:url" content={`https://weather.doctorpok.io/${text}`} />
        <meta property="og:image" content={`https://weather.doctorpok.io/api/og?city=${text}`} />
        <meta property="og:locale" content="fr_FR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Weather in ${text} today — ${data.data?.current?.temp_c || "N/A"}°C | Weather App`} />
        <meta name="twitter:description" content={`${data.data?.current?.condition || "N/A"}, ${data.data?.current?.temp_c || "N/A"}°C, Humidity: ${data.data?.current?.humidity || "N/A"}%, Wind Speed: ${data.data?.current?.wind_speed || "N/A"} km/h. Stay updated with accurate weather forecasts for ${text}.`} />
        <meta name="twitter:image" content={`https://weather.doctorpok.io/api/og?city=${text}`} />
      </Head>

      <SearchBar text={text} setText={setText} handleSearch={handleSearch} getPosition={handleGetPosition} />

      {data.data && <Result data={data} />}
      {error && <ErrorPopup text={error} setText={setError} />}
    </div>
  )
}

export default City

export async function getServerSideProps(context: any) {
  const { city } = context.params

  const result = await fetch(`${process.env.APP_URL}/api/weather`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ city: city })
  })

  const data = await result.json()

  return {
    props: { id: city, data }
  }
}
