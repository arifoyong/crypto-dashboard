import Link from 'next/link'
import { useState } from 'react'
import { MenuAlt1Icon, PaperAirplaneIcon, XIcon} from '@heroicons/react/outline'

const NavBar = () => {
  const [active, setActive] = useState(false)

  return (
    <nav className="bg-gray-600 flex items-center justify-between flex-wrap p-3">
      <Link href="/">
        <a className="inline-flex items-center p-2 mr-4">
          <PaperAirplaneIcon className="text-white w-6 h-6"/>
          <span className='ml-2 text-xl text-white font-bold uppercase'>
            CryptoApp
          </span>
        </a>
      </Link>

      {/* Button to be shown on small screen */}
      <button className="lg:hidden inline-flex text-white rounded p-3 outline-none hover:bg-gray-200  hover:text-gray-600" 
              onClick={() => setActive(!active)}>
          {active ? <XIcon className="w-6 h-6"/> : 
                    <MenuAlt1Icon className="w-6 h-6" />
          }
      </button>

      {/* Navigation content */}
      <div className={`${active ? '' : 'hidden'} w-full lg:flex lg:w-auto`} >
        <div className="flex flex-col lg:flex-row ">
          <Link href='/'>
            <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-gray-200 hover:text-gray-600 '>
              Home
            </a>
          </Link>
          <Link href='/news'>
            <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-gray-200 hover:text-gray-600'>
              News
            </a>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar