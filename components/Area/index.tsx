import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AreaProps {
    colorData: string[];
    data: any;
}

const Area = ({ colorData, data }: AreaProps) => {
    const options = {
        chart: {
            id: "realtime",
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        colors: colorData,
        stroke: { width: 2, curve: 'smooth' },
        dataLabels: { enabled: false },
        xaxis: {
            categories: data?.map((data: any) => data.time.split(" ")[1]),
        },
        yaxis: {
            show: true,
        },
        grid: {
            row: {
                opacity: 0,
            },
            column: {
                opacity: 0,
            },
        },
    }

    return (
        <Chart
            type="area"
            height={300}
            width='350%'
            options={options as any}
            series={[{
                name: "Temperature",
                data: data?.map((data: any) => data.temp_c),
            }]}
        />
    )
}

export default Area