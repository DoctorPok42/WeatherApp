import Head from 'next/head'
import { SearchBar } from '../../components'
import { useState } from 'react'
import ErrorPopup from '@/components/Error'

const Home = () => {
  const [text, setText] = useState<string>('')
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

  return (
    <>
      <Head>
        <title>Weather App - Check the Weather in Your City</title>
        <meta name="description" content={`Check the weather in your city today. Get the latest temperature, humidity, wind speed, and more. Stay updated with accurate weather forecasts for your location.`} />
        <meta name="keywords" content={`weather, city, temperature, forecast, humidity, wind speed, weather app`} />
        <meta property="og:title" content={`Weather App - Check the Weather in Your City`} />
        <link rel="canonical" href={`https://weather.doctorpok.io/`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta sc-camel-char-set="utf-8" />
      </Head>

      <div className="mx-auto px-6">
        <SearchBar text={text} setText={setText} handleSearch={handleSearch} getPosition={handleGetPosition} />

        {error && <ErrorPopup text={error} setText={setError} />}
      </div>
    </>
  )
}

export default Home
