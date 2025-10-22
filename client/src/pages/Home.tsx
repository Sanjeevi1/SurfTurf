import React, { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import Category from '../components/Category'
import TurfCard from '../components/TurfCard'
import api from '../utils/api'

interface SlotTemplate {
  startTime: string
  endTime: string
  maxPlayers: number
  isBooked: boolean
}

interface Turf {
  _id: string
  name: string
  description: string
  pricePerHour: number
  city: string
  slotTemplate: SlotTemplate[]
  dimensions: {
    length: number
    width: number
  }
  locationCoordinates: {
    type: string
    coordinates: number[]
  }
  amenities: string[]
  turfCategory: string
  images: string[]
}

const Home: React.FC = () => {
  const [topRankedTurfs, setTopRankedTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchTopRankedTurfs = async () => {
      try {
        const response = await api.get(`/recommend/top-ranked-turfs`)
        const topRankedTurfs = response.data

        const allTurfsResponse = await api.get(`/turf`)
        const allTurfs = allTurfsResponse.data

        const filteredTopRankedTurfs = allTurfs.filter((turf: Turf) =>
          topRankedTurfs.some((topTurf: any) => topTurf.id === turf._id)
        )

        const sortedTopRankedTurfs = filteredTopRankedTurfs.sort((a: any, b: any) =>
          b.predicted_score - a.predicted_score
        )

        setTopRankedTurfs(sortedTopRankedTurfs)
      } catch (error) {
        console.error("Error fetching top-ranked turfs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopRankedTurfs()
  }, [])

  const getUserDetails = async () => {
    try {
      const res = await api.get('/users/getuser')
      setUserData(res.data.data)
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <>
      <Hero isLoggedIn={!!userData} />
      <div className="font-bold text-black text-center text-2xl">Category</div>
      <Category />
      <br />
      <br />
      <h1 className="font-bold text-black text-2xl">AI Recommended Turfs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 lg:ml-16 lg:mr-16 sm:ml-10 sm:mr-10 md:ml-10 md:mr-10">
        {topRankedTurfs.length > 0 ? (
          topRankedTurfs.map((turf, index) => (
            <div
              key={turf._id}
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
              className="turf-card"
            >
              <TurfCard turf={turf} />
            </div>
          ))
        ) : (
          <p>No turfs available</p>
        )}
      </div>
    </>
  )
}

export default Home