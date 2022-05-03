import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import moment from 'moment'

import Layout from '../components/Layout/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { XIcon, SearchIcon } from '@heroicons/react/outline'

const demoImage = '/news-icon.jpg'

export default function News() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [allNews, setAllNews] = useState()

  useEffect(() => {
    getNews('cryptocurrency')
  },[])

  const handleChange =(e) => {
    setSearchValue(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getNews(e.target.value)
    }
  }

  const getNews = (query) => {
    setIsLoading(true)
    const AXIOS_OPTION = {
      method: 'GET',
      url: 'https://bing-news-search1.p.rapidapi.com/news/search',
      params: {q: query, count: 12, freshness: 'Day', textFormat: 'Raw', safeSearch: 'Off'},
      headers: {
        'X-BingApis-SDK': 'true',
        'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com',
        'X-RapidAPI-Key': '83333a6113msh4c0dce62df56291p1aa75djsn79ede4857c46'
      }
    };
    
    axios.request(AXIOS_OPTION).then((resp) => {
      setAllNews(resp.data.value)
      setIsLoading(false)
    })
  }

  const NewsCard = ({news}) => {
    return (
      <Link href={news.url}>
        <a>
        <div className="cursor-pointer flex flex-col justify-between shadow-lg rounded-lg px-4 py-2 h-full">
          <header className="flex flex-row items-start gap-2 py-4">
            <div className="font-bold">
              {news.name}
            </div>
            <div className="h-32 w-64 relative" >
              <Image className="" 
                src={news?.image?.thumbnail.contentUrl || demoImage}
                layout="fill"
                alt="news"
                objectFit="contain"
                />
            </div>
          </header>
          <section className="py-2">
            {news.description}
          </section>
          <footer className="flex justify-between items-center mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 relative">
                <Image className="" 
                  src={news.provider[0].image?.thumbnail?.contentUrl || demoImage}
                  layout="fill"
                  alt="news"
                  objectFit="contain"
                  />
              </div> 
              <span>
                {news.provider[0].name}
              </span> 
            </div>
            <div>
              {moment(news.datePublished).startOf('ss').fromNow()}
            </div>
          </footer>
        </div>
        </a>
      </Link>
    )
  }

  const RenderNews = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {allNews.map((news,i) => (
          <NewsCard key={i} news={news}/>
        ) )}
      </div>
  )

  return (
    <Layout>
      <div className="flex py-4 px-4 mb-2 items-center">
        <div className="flex relative items-center w-full lg:w-80">
          <input className="border-2 px-2 py-2 rounded-lg w-full " 
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="text" 
                value={searchValue}
                placeholder=""/>
          {searchValue !== '' ? <XIcon className="cursor-pointer text-gray-400 w-6 h-6 absolute right-2"
                                        onClick={() => setSearchValue("")} />  :
                                <SearchIcon className="text-gray-400 w-6 h-6 absolute right-2"/>
          }
          </div>
      </div>
      {isLoading ? <LoadingSpinner/> : <RenderNews />}
    </Layout>
  )
}