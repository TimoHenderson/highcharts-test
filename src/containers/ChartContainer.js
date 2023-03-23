import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

require('highcharts/indicators/indicators')(Highcharts)
require('highcharts/indicators/pivot-points')(Highcharts)
require('highcharts/indicators/macd')(Highcharts)
require('highcharts/modules/accessibility')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);



const ChartContainer = () => {
    const [chartOptions, setChartOptions] = useState({
        yAxis: [{
            height: '75%',
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'AAPL'
            }
        }, {
            top: '75%',
            height: '25%',
            labels: {
                align: 'right',
                x: -3
            },
            offset: 0,
            title: {
                text: 'MACD'
            }
        }],
        series: [{
            data: [],
            type: '',
            name: 'AAPL Stock Price',
            id: 'aapl'
        }
            // ,
            // {
            //     type: 'pivotpoints',
            //     linkedTo: 'aapl',
            //     zIndex: 0,
            //     lineWidth: 1,
            //     dataLabels: {
            //         overflow: 'none',
            //         crop: false,
            //         y: 4,
            //         style: {
            //             fontSize: 9
            //         }
            //     }
            // }, {
            //     type: 'macd',
            //     yAxis: 1,
            //     linkedTo: 'aapl'
            // }
        ]
    });

    useEffect(() => {
        const updateSeries = (parsedData) => {
            const newChartOptions = { ...chartOptions }
            newChartOptions.series[0].data = parsedData;
            setChartOptions(newChartOptions);
        }

        const parseData = (data) => {
            const rawSeriesData = data["Time Series (Daily)"]
            const parsed = Object.keys(rawSeriesData).map((key) => {
                const date = new Date(key).getTime();
                const item = rawSeriesData[key];
                return [date, Number(item["1. open"]), Number(item["2. high"]), Number(item["3. low"]), Number(item["4. close"])];
            }).reverse()
            return parsed;
        }

        const getData = async () => {
            const res = await fetch("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&outputsize=full&apikey=demo");
            const data = await res.json();
            const parsedData = parseData(data);
            updateSeries(parsedData);
        }
        getData();
    }, []);

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType='stockChart'
                options={chartOptions}
            />
        </div>
    )
}

export default ChartContainer;