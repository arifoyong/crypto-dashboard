import { useEffect, useState } from 'react'
import Image from 'next/image'

import millify from 'millify'
import Link from 'next/link'
import axios from 'axios'

import Layout from '../components/Layout/Layout'
import LoadingSpinner from '../components/LoadingSpinner'


const CRYPTO_PERPAGE = 50

export default function Home() {
  const [coinInfo, setCoinInfo] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getData(currentPage)
  },[currentPage])

  const getData = (i) => {
    const offset = (i-1) * CRYPTO_PERPAGE
    const AXIOS_OPTION = {
      method: 'GET',
      url: 'https://coinranking1.p.rapidapi.com/coins',
      params: {
        referenceCurrencyUuid: 'yhjMzLPhuIDl',
        timePeriod: '24h',
        orderBy: 'marketCap',
        orderDirection: 'desc',
        limit: CRYPTO_PERPAGE,
        offset: offset
      },
      headers: {
        'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
        'X-RapidAPI-Key': '83333a6113msh4c0dce62df56291p1aa75djsn79ede4857c46'
      }
    };
    setIsLoading(true)

    axios.request(AXIOS_OPTION)
    .then((resp) => {
      setCoinInfo(resp.data.data)
      setIsLoading(false)
    })
  }

  const RenderTable = ({coins}) => {
    const FormatPriceChange = (priceChange) => (
      <span className={`${priceChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
        {priceChange}%
      </span>
    )
    const RenderName = (coin) => (
      <div className="flex items-center">
        {coin.iconUrl && <Image className="" src={coin.iconUrl} alt="symbol" width={20}  height={20} /> }
        <span className="ml-2">{coin.name} &nbsp;</span>
        <span className="text-gray-400 font-semibold hidden lg:inline">
          ({coin.symbol})
        </span>
      </div>
    )

    return (
    <div className="overflow-auto mt-10 w-full">
    <table className="table-auto w-full shadow-xl">
      <thead className="">
        <tr className="font-bold border-y-2 border-slate-200 ">
          <td className="p-2">#</td>
          <td className="p-2">Cryptocurrency</td>
          <td className="p-2">Price ($)</td>
          <td className="p-2">Change (%)</td>
          <td className="p-2">Market Cap</td>
          <td className="p-2">24H Volume</td>
          </tr>
      </thead>

      <tbody className="divide-y divide-gray-300">
        {coins.map((coin,i) => {
          return (
            <Link key={coin.uuid} href={`/coin/${coin.uuid}`}>
                <tr className={`${i%2 === 0 ? '' : 'bg-gray-100'} cursor-pointer hover:bg-gray-400 hover:text-gray-100`}>
                  <td className="p-3">{coin.rank}</td>
                  <td className="p-3">{RenderName(coin)}</td>
                  <td className="p-3">{(Math.round(coin.price * 100)/100).toLocaleString()}</td>
                  <td className="p-3">{FormatPriceChange(coin.change)}</td>
                  <td className="p-3">{coin.marketCap &&  millify(coin.marketCap)}</td>
                  <td className="p-3">{coin["24hVolume"] && millify(coin["24hVolume"])}</td>
                </tr>
            </Link>
          )
        })}
      </tbody>
    </table>
    </div>
  )
  }

  const RenderStats = ({stats}) => {
    const Card = ({title, data}) => (
      <div className="px-2 py-4 bg-white border-2 shadow-lg rounded-lg">
        <span className="tracking-wide">{title}: </span>
        <span className="text-blue-500 font-semibold">{data}</span>
      </div>
    )
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 px-2 mx-auto mt-4" >
        <Card title="Total Coins" data={stats.totalCoins.toLocaleString()} />
        <Card title="Total Exchanges" data={stats.totalExchanges.toLocaleString()} />
        <Card title="Total Market Cap" data={millify(stats.totalMarketCap)} />
        <Card title="Total 24H Volume" data={millify(stats.total24hVolume)} />
      </div>
    )
  }

  const RenderPagination = ({stats}) => {
    let pages = []
    const maxPage = Math.ceil(stats.totalCoins/CRYPTO_PERPAGE)
    const noPagination = 4

    const firstPagination = maxPage-noPagination > currentPage ?  currentPage : maxPage-noPagination
    const lastPagination = currentPage+noPagination > maxPage ? maxPage : currentPage+noPagination

    for (let i=0; i<maxPage; i++) {
      pages.push(i+1)
    }

    return (
      <div className="flex py-4 px-2 w-full">
        <div className="flex mx-auto space-x-2">
          { currentPage > 1 && <button onClick={() => setCurrentPage(currentPage-1)} className="cursor-pointer border-2 p-2">Prev</button> }
          { firstPagination > 1 && <div onClick={() => setCurrentPage(pages[0])} className="cursor-pointer px-4 py-2">{pages[0]}</div> }
          { firstPagination > 2 && <div className=" px-4 py-2">...</div> }
          {pages.slice(firstPagination-1,lastPagination).map((page,i) => {
            return (
              <div className={`${currentPage === page ? 'bg-gray-200 rounded-lg font-bold' : ''} cursor-pointer px-4 py-2`}
              onClick={() => setCurrentPage(page)} key={page}>{page}</div>
              ) 
            })}
          { lastPagination < maxPage  && <div className=" px-4 py-2">...</div> }
          { lastPagination < maxPage  && <div onClick={() => setCurrentPage(maxPage)} className="cursor-pointer px-4 py-2">{maxPage}</div> }
          { currentPage < maxPage && <button onClick={() => setCurrentPage(currentPage+1)} className="cursor-pointer border-2 px-2 py-2">Next</button> }
        </div>
      </div>
    )
  }

  const RenderData = () => (
    <>
      <RenderStats stats={coinInfo.stats}/>
      <RenderTable coins={coinInfo.coins} />
      <RenderPagination stats={coinInfo.stats}/>
    </>
  )

  return (
    <Layout>
      { isLoading ? <LoadingSpinner /> : <RenderData/> }
    </Layout>
  )
}