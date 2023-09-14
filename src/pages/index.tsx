import Head from 'next/head'
import { NavBar, SearchBar } from '../../components'
import { useEffect, useState } from 'react'
import { Result } from '../../components'
import { Alert } from '@mui/material'

const Home = () => {
  const [is_loading, setIsLoading] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const [isCitySearch, setIsCitySearch] = useState<boolean>(true)
  const [cityData, setCityData] = useState<any>(undefined)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (text.length <= 0) return

    setIsLoading(true)

    try {
      fetch("/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          city: text
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError("City not found")
            setIsCitySearch(false)
            return
          } else {
            setError("")
            setIsCitySearch(true)
            setCityData(data)
          }
        })
    } catch (error: any) {
      setCityData(undefined)
      setError("Something went wrong")
    }

    setIsLoading(false)
  }, [is_loading])

  return (
    <>
      <Head>
        <title>MyTodo</title>
        <meta name="description" content="MyTodo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar is_loading={is_loading} />

      {error !== "" && <Alert severity='error' onClose={() => {
            setError("")
          }
        }>{error}</Alert>
      }

      <section className="container1">
        <div className="container1_text">
            <SearchBar text={text} setText={setText} setIsLoading={setIsLoading} />
        </div>

        {isCitySearch && <Result data={cityData} />}
      </section>
    </>
  )
}

export default Home
