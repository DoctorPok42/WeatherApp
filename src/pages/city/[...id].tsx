import { useEffect, useState } from "react"
import { Result, SearchBar } from "../../../components"
import ErrorPopup from "../../../components/Error";

const City = ({ id, data }: { id: string; data: any }) => {
  const [text, setText] = useState<string>(data?.data?.location.name || id)
  const [error, setError] = useState<string>("")

  const handleSearch = async (isUsingPosition: { latitude: number; longitude: number } | false = false) => {
    try {
      if (text && !isUsingPosition) {
        window.location.href = `/city/${text}`
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
      window.location.href = `/city/${data.data.location.name}`

    } catch (error: any) {
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
      <SearchBar text={text} setText={setText} handleSearch={handleSearch} getPosition={handleGetPosition} />

      {data.data && <Result data={data} />}
      {error && <ErrorPopup text={error} setText={setError} />}
    </div>
  )
}

export default City

export async function getServerSideProps(context: any) {
  const { id } = context.params

  const result = await fetch(`${process.env.APP_URL}/api/weather`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ city: id })
  })

  const data = await result.json()

  return {
    props: { id, data }
  }
}
