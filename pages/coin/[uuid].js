import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// import Image from 'next/image'

import moment from 'moment'
import millify from 'millify'
import axios from 'axios'
import Layout from '../../components/Layout/Layout'
import { Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend } from 'chart.js'
import {Line} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const headers = {
  'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
  'X-RapidAPI-Key': '83333a6113msh4c0dce62df56291p1aa75djsn79ede4857c46'
}


export default function CoinDetail() {
  const router = useRouter()
  const {uuid} = router.query

  const [isLoading, setIsLoading ] = useState(true)
  const [curPeriod, setCurPeriod] = useState('7d')
  const [coinHistory, setCoinHistory] = useState()
  const [coinData, setCoinData] = useState()

  useEffect(() => {
    getCoinHistory('7d')
    getCoinData(uuid)
    
  },[])


  const getCoinHistory = (timePeriod) => {
    setIsLoading(true)
    const COIN_DATA_HISTORY = {
      method: 'GET',
      url: `https://coinranking1.p.rapidapi.com/coin/${uuid}/history`,
      params: {referenceCurrencyUuid: 'yhjMzLPhuIDl', timePeriod: timePeriod},
      headers: {
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
        'X-RapidAPI-Key': '83333a6113msh4c0dce62df56291p1aa75djsn79ede4857c46'
      }
    };

    axios.request(COIN_DATA_HISTORY).then((resp) => {
      setCoinHistory(resp.data.data)
      setCurPeriod(timePeriod)
      setIsLoading(false)
    })
  }

  const getCoinData = (coinId) => {
    setIsLoading(true)
    const COIN_DATA = {
      method: 'GET',
      url: `https://coinranking1.p.rapidapi.com/coin/${coinId}`,
      params: {referenceCurrencyUuid: 'yhjMzLPhuIDl', timePeriod: '24h'},
      headers: {
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
        'X-RapidAPI-Key': '83333a6113msh4c0dce62df56291p1aa75djsn79ede4857c46'
      }
    };

    axios.request(COIN_DATA).then((resp) => {
      setCoinData(resp.data.data.coin)
      setIsLoading(false)
    })
  }

  const RenderLineChart = ({history}) => {
    const coinPrice = []
    const timeStamp = []

    for (let i=0; i<history.length; i++) {
      const idx = coinHistory.history.length - 1 - i
      coinPrice.push(history[idx].price)
      let formattedTime = curPeriod === '24h' ? moment.unix(history[idx].timestamp).format("hh:mm") : moment.unix(history[idx].timestamp).format("DD-MMM") 
      timeStamp.push(formattedTime)
    }

    const data = {
      labels: timeStamp,
      datasets: [
        {
          label: `price`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: coinPrice
        }
      ]
    }

    const options = {
      plugins: {
        legend: {
           display: false
        },
        animation: {
          duraction: 0,
        }, 
      },
      scales: {
        x: {
          ticks: {
            callback: function(val, index, ticks) {
              return index % 5 === 0 ? this.getLabelForValue(val) : ''
            },
            maxRotation: 0,
            minRotation: 0
          }
        }
      }
    }

    
    return (
      <div className="flex flex-col">
        <div className="flex flex-row justify-between py-2">
          <div className="text-2xl text-gray-600 font-bold tracking-wide">
            {coinData && coinData.symbol} to USD price history
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <button onClick={() => getCoinHistory('24h')}
                    className={`${curPeriod === '24h' ? 'bg-white' : 'bg-gray-200'} border-2  px-2 py-2 rounded-lg`}>
              24H
            </button>
            <button onClick={() => getCoinHistory('7d')}
                    className={`${curPeriod === '7d' ? 'bg-white' : 'bg-gray-200'} border-2  px-2 py-2 rounded-lg`}>
              7D
            </button>
            <button onClick={() => getCoinHistory('30d')}
                    className={`${curPeriod === '30d' ? 'bg-white' : 'bg-gray-200'} border-2  px-2 py-2 rounded-lg`}>
              30D
            </button>
          </div>
        </div>
          <Line data={data} options={options} />
      </div>
    )
  }

  const RenderInfo = () => (
    <div className="flex flex-col  px-4 py-4">
      <div className="text-gray-400 font-bold tracking-wide">
        {`${coinData.name} price (${coinData.symbol})`}
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="text-3xl font-bold">
          ${(Math.round(coinData.price*100)/100).toLocaleString()}
        </div>
        <div className={`${coinData.change > 0 ? 'bg-green-500' : 'bg-red-500'} text-white text-sm px-4 py-1 rounded-lg`}>
          {coinData.change}%
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start py-4">
        <div className="flex flex-col">
          <div className="text-gray-500 font-bold">Coin Ranking</div>
          <div>{coinData.rank}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500 font-bold">Market Cap</div>
          <div>${Math.round(coinData.marketCap).toLocaleString()}</div>
        </div>
        <div className="flex flex-col">
        <div className="text-gray-500 font-bold">24H Volume</div>
          <div>${Math.round(coinData["24hVolume"]).toLocaleString()}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500 font-bold">Supply</div>
          <div className="grid grid-cols-2 gap-x-2">
            <div>Circulating supply</div> 
            <div>{Math.round(coinData.supply.circulating).toLocaleString()} {coinData.symbol}</div>
            <div>Total supply</div>
            <div>{Math.round(coinData.supply.total).toLocaleString()} {coinData.symbol}</div>
          </div>
        </div>

      </div>
    </div>
  )

 


  return (
    <Layout>
      { coinData && console.log(coinData) }
      { coinData && <RenderInfo /> }
      { coinHistory && <RenderLineChart history={coinHistory?.history} />}
    </Layout>
  )
}