import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import moment from 'moment'
import axios from 'axios'
import { Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title as ChartTitle,
        Tooltip,
        Legend } from 'chart.js'
import {Line} from 'react-chartjs-2'

import Layout from '../../components/Layout/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const timePeriods = ['24h', '7d', '30d', '3m', '1y']
const initialPeriod = timePeriods[1]

export default function CoinDetail() {
  const router = useRouter()
  const {uuid} = router.query

  const [curPeriod, setCurPeriod] = useState(initialPeriod)
  const [coinHistory, setCoinHistory] = useState()
  const [coinData, setCoinData] = useState()

  useEffect(() => {
    getCoinHistory(initialPeriod)
    getCoinData(uuid)
    
  },[])

  const getCoinHistory = (timePeriod) => {
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
    })
  }

  const getCoinData = (coinId) => {
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
    })
  }

  const RenderLineChart = ({history}) => {
    const coinPrice = []
    const timeStamp = []
    
    for (let i=0; i<history.length; i++) {
      const idx = coinHistory.history.length - 1 - i
      coinPrice.push(history[idx].price)
      let formattedTime = curPeriod === '24h' ? moment.unix(history[idx].timestamp).format("hh:mm") : moment.unix(history[idx].timestamp).format("DD-MMM-YY") 
      timeStamp.push(formattedTime)
    }

    const data = {
      labels: timeStamp,
      datasets: [
        {
          label: `price`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(51,153,255,0.4)',
          borderColor: 'rgba(51,153,255,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(51,153,255,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(51,153,255,1)',
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
      },
      animation: {
        duraction: 0,
      },
      scales: {
        x: {
          ticks: {
            callback: function(val, index, ticks) {
              return index % 3 === 0 ? this.getLabelForValue(val) : ''
            },
            maxRotation: 0,
            minRotation: 20
          }
        }
      }
    }

    
    return (
      <div className="flex flex-col py-4">
        <div className="flex flex-row justify-between py-2">
          <div className="text-2xl text-gray-600 font-bold tracking-wide">
            {coinData && coinData.symbol} to USD price history
          </div>
          <div className="flex gap-1 text-xs">
           { timePeriods.map((period,i) => (
                              <button key={i} onClick={() => getCoinHistory(period)}
                              className={`${curPeriod === period ? 'bg-white' : 'bg-gray-200'} border-2  px-2 py-2 rounded-lg`}>
                                {period}
                              </button>)) }
           
          </div>
        </div>
        <Line data={data} options={options} />
      </div>
    )
  }

  const RenderInfo = () =>  (
    <div className="py-4">
      {/* Price */}
      <div>  
        <div className="text-gray-400 font-bold tracking-wide">
          {`${coinData.name} price (${coinData.symbol})`}
        </div>
        
        <div className="flex flex-row items-center gap-4">
          <span className="text-3xl font-bold">
            ${(Math.round(coinData.price*100)/100).toLocaleString()}
          </span>
          <span className={`${coinData.change > 0 ? 'bg-green-500' : 'bg-red-500'} text-white text-sm px-4 py-1 rounded-lg`}>
            {coinData.change}%
          </span>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="flex flex-col lg:flex-row gap-x-1 lg:items-start mt-4 lg:h-24">
        <div className="flex flex-col border-2 rounded shadow lg:w-1/5 px-2 py-2 h-full">
          <div className="text-gray-500 font-bold">Coin Ranking</div>
          <div >{coinData.rank}</div>
        </div>
        <div className="flex flex-col border-2 rounded shadow lg:w-1/5 px-2 py-2 h-full">
          <div className="text-gray-500 font-bold">Market Cap</div>
          <div>${Math.round(coinData.marketCap).toLocaleString()}</div>
        </div>
        <div className="flex flex-col border-2 rounded shadow lg:w-1/5 px-2 py-2 h-full">
          <div className=" text-gray-500 font-bold">24H Volume</div>
          <div >${Math.round(coinData["24hVolume"]).toLocaleString()}</div>
        </div>
        <div className="flex flex-col border-2 rounded shadow lg:w-2/5 px-2 py-2 h-full">
          <div className=" text-gray-500 font-bold">Supply</div>
          <div className=" grid grid-cols-2 gap-x-2">
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
      { coinData ? <RenderInfo /> : <LoadingSpinner />}
      { coinHistory ? <RenderLineChart history={coinHistory?.history} /> : <LoadingSpinner />}
    </Layout>
  )
}