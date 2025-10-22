import React from 'react'
import { Link } from 'react-router-dom'
import SelectionForm from './SelectionForm'

interface HeroProps {
  isLoggedIn: boolean
}

const ImageGrid = () => {
  const images = [
    "https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=429&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1593766827228-8737b4534aa6?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682435573900-b55886ec0e0a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682435570815-afa782cf02b8?q=80&w=886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ]

  return (
    <div className="grid grid-flow-row-dense grid-cols-2 gap-4">
      {images.map((src, index) => (
        <div key={index} className={`${index === 3 ? 'hidden' : index === 2 ? 'h-30' : index === 1 ? 'h-52' : 'h-48'}`}>
          <img
            src={src}
            alt=""
            className="h-full rounded-2xl object-cover"
            width="350"
          />
        </div>
      ))}
      <div className="h-48">
        <img
          src={images[3]}
          alt=""
          className="h-full rounded-2xl object-cover"
          width="350"
        />
      </div>
    </div>
  )
}

const Hero: React.FC<HeroProps> = ({ isLoggedIn }) => {
  return (
    <div className="bg-white font-poppins">
      <section className="relative py-10 sm:py-16 lg:py-24">
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 lg:grid-cols-2 gap-12 bg-cover bg-right">
            <div className="z-20 bg-white bg-opacity-80 p-8 rounded-xl">
              <p className="text-base font-semibold tracking-wider text-blue-600 uppercase">Your perfect turf awaits</p>
              <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-8xl">Book Your Turf Today!</h1>
              <p className="mt-4 text-base font-bold text-black lg:mt-8 sm:text-xl">Experience top-notch facilities and make every game memorable.</p>

              {!isLoggedIn ? (
                <>
                  <span
                    title="Book Now"
                    className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full lg:mt-16 hover:bg-yellow-400 focus:bg-yellow-400"
                    role="button"
                  >
                    <Link to='/turf'>Book Now</Link>
                    <svg className="w-6 h-6 ml-8 -mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>

                  <p className="mt-5 ml-3 text-black font-bold">New User??
                    <Link to='/signup' className="text-yellow-300 transition-all duration-200 hover:underline m-2">
                      Sign up
                    </Link>
                  </p>
                </>
              ) : null}
            </div>
            <ImageGrid />
          </div>
        </div>

        {isLoggedIn ? <SelectionForm /> : null}
      </section>
    </div>
  )
}

export default Hero
