import Area from '../Area';

import styles from './styles.module.scss'

interface ResultProps {
    data: any;
}

const Result = ({ data }: ResultProps) => {
    if (!data) return null

    const epa = [
        "Good",
        "Moderate",
        "Unhealthy for Sensitive Groups",
        "Unhealthy",
        "Very Unhealthy",
        "Hazardous"
    ]

    return (
        <div className={styles.result}>
            <div className={styles.result__container}>
                <div className={styles.box}>
                    <h2>
                        {data.data.location.name}, <span>{data.data.location.country}</span>
                        <img src={data.data.current.condition.icon} alt={data.data.current.condition.text} />
                    </h2>
                    <span>{data.data.current.condition.text}</span>
                </div>

                <div className={styles.box}>
                    <h2>Wind</h2>
                    <span>{data.data.current.wind_kph} km/h </span>
                    <span>{data.data.current.wind_dir}</span>
                </div>

                <div className={styles.box}>
                    <h2>Humidity</h2>
                    <span>{data.data.current.humidity}%</span>
                </div>

                <div className={styles.box}>
                    <h2>Pressure</h2>
                    <span>{data.data.current.pressure_mb} mb</span>
                </div>

                <div className={styles.box}>
                    <h2>Visibility</h2>
                    <span>{data.data.current.vis_km} km</span>
                </div>

                <div className={styles.box}>
                    <h2>Air Quality (
                        {
                            epa[data.data.current.air_quality["us-epa-index"] - 1]
                        }
                        )
                    </h2>
                    <span>Co: {data.data.current.air_quality.co} </span>
                    <span> | No2: {data.data.current.air_quality.no2}</span>
                    <span> | O3: {data.data.current.air_quality.o3}</span>
                </div>

                <div className={styles.box} style={{
                    float: "right"
                }}>
                    <h2>Temperature</h2>
                    <span>{data.dataHistory.forecast.forecastday[0].hour[
                        Date.now() > new Date(data.data.location.localtime).getTime() ?
                            new Date(data.data.location.localtime).getHours() :
                            new Date().getHours()
                    ].temp_c}°C </span>
                    <span> Feel like {data.dataHistory.forecast.forecastday[0].hour[
                        Date.now() > new Date(data.data.location.localtime).getTime() ?
                            new Date(data.data.location.localtime).getHours() :
                            new Date().getHours()
                    ].feelslike_c}°C</span>

                    <Area colorData={["#17ead9"]} data={data.dataHistory.forecast.forecastday[0].hour} />
                </div>

            </div>
        </div>
    )
}

export default Result
