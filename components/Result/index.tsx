import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWind, faDroplet, faFan, faEye, faLungs } from '@fortawesome/free-solid-svg-icons';
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

    const epaColor = [
        "#17ead9",
        "#6078ea",
        "#ff758c",
        "#ff6b6b",
        "#ed8f03",
        "#ef504c"
    ]

    const tempColor = [
        "#17ead9",
        "#FCCF31",
        "#ef504c"
    ]

    const actual = data.dataHistory.forecast.forecastday[0].hour[
        Date.now() > new Date(data.data.location.localtime).getTime() ?
            new Date(data.data.location.localtime).getHours() :
            new Date().getHours()
    ]

    return (
        <div className={styles.result}>
            <div className={styles.result__container}>
                <div className={styles.box}>
                    <h2 style={{
                        color: tempColor[actual.temp_c < 25 ? 0 : actual.temp_c < 32 ? 1 : 2]
                    }}>{actual.temp_c}°C</h2>
                    <h2>
                        {data.data.location.name}, <span>{data.data.location.country}</span>
                        <img src={data.data.current.condition.icon} alt={data.data.current.condition.text} />
                    </h2>
                    <span>{data.data.current.condition.text}</span>
                </div>

                <div className={styles.box}>
                    <h2>Wind
                        <FontAwesomeIcon className={styles.icon} icon={faWind} />
                    </h2>
                    <span>{data.data.current.wind_kph} km/h </span>
                    <span>{data.data.current.wind_dir}</span>
                </div>

                <div className={styles.box}>
                    <h2>Humidity
                        <FontAwesomeIcon className={styles.icon} style={{
                            width: ".7rem"
                        }} icon={faDroplet} />
                    </h2>
                    <span>{data.data.current.humidity}%</span>
                </div>

                <div className={styles.box}>
                    <h2>Pressure
                        <FontAwesomeIcon className={styles.icon} icon={faFan} />
                    </h2>
                    <span>{data.data.current.pressure_mb} mb</span>
                </div>

                <div className={styles.box}>
                    <h2>Visibility
                        <FontAwesomeIcon className={styles.icon} icon={faEye} />
                    </h2>
                    <span>{data.data.current.vis_km} km</span>
                </div>

                <div className={styles.box} style={{
                    backgroundColor: epaColor[data.data.current.air_quality["us-epa-index"] - 1]
                }}>
                    <h2>Air Quality
                        ({
                            epa[data.data.current.air_quality["us-epa-index"] - 1]
                        })
                        <FontAwesomeIcon className={styles.icon} icon={faLungs} />
                    </h2>
                    <span>Co: {data.data.current.air_quality.co} </span>
                    <span> | No2: {data.data.current.air_quality.no2}</span>
                    <span> | O3: {data.data.current.air_quality.o3}</span>
                </div>

                <div className={styles.box} style={{
                    float: "right"
                }}>
                    <h2>Temperature</h2>
                    <span>{actual.temp_c}°C </span>
                    <span> Feel like {actual.feelslike_c}°C</span>

                    <Area colorData={[
                        tempColor[actual.temp_c < 25 ? 0 : actual.temp_c < 32 ? 1 : 2]
                    ]} data={data.dataHistory.forecast.forecastday[0].hour} />
                </div>

            </div>
        </div>
    )
}

export default Result
