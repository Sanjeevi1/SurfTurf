import React, { useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaShower, FaParking, FaWifi, FaTrash } from 'react-icons/fa'
import { BsBookmarkFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
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

interface TurfCardProps {
  turf: Turf
  role?: string
  refreshTurfList?: () => void
}

const TurfCard: React.FC<TurfCardProps> = ({ turf, role, refreshTurfList }) => {
  const [isSaved, setIsSaved] = useState(false)
  const [data, setData] = useState<any>(null)
  const [showSaveOptions, setShowSaveOptions] = useState(false)

  const getUserDetails = async () => {
    try {
      const res = await api.get('/users/getuser')
      setData(res.data.data)
    } catch (error) {
      console.log('Error fetching user details:', error)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  const handleSaveTurf = async () => {
    try {
      const response = await api.post('/save', {
        userId: data._id,
        turfId: turf._id,
      })

      if (response.status === 200) {
        setIsSaved(true)
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error('Error saving turf:', error)
    }
  }

  const handleDeleteTurf = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this turf?')) {
      try {
        const response = await api.delete(`/turf/delete?id=${turf._id}`)
        if (response.status === 200) {
          alert('Turf deleted successfully')
          window.location.replace('/admin/home')
        }
      } catch (error) {
        console.error('Error deleting turf:', error)
        alert('Failed to delete turf')
      }
    }
  }

  return (
    <div className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      <div className="relative">
        <img
          src={turf.images[0]}
          alt={turf.name}
          className="w-full h-40 object-cover"
        />
        {/* Save button with hover effect */}
        <div
          className="absolute top-2 right-2"
          onMouseEnter={() => setShowSaveOptions(true)}
        >
          {isSaved ? (
            <BsBookmarkFill className="text-yellow-300 text-2xl" />
          ) : (
            <BsBookmarkFill className="text-yellow-100 text-2xl" />
          )}

          {/* Show options on hover */}
          {showSaveOptions && !isSaved && (
            <div
              className="absolute top-10 right-0 bg-white shadow-lg rounded p-2"
              onClick={handleSaveTurf}
            >
              <span className="cursor-pointer text-gray-900 font-medium">Save Turf</span>
            </div>
          )}
        </div>
        {role === 'owner' && (
          <div className="absolute top-2 left-2">
            <FaTrash
              className="text-red-600 text-2xl cursor-pointer"
              onClick={handleDeleteTurf}
              title="Delete Turf"
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">{turf.name}</h2>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <FaMapMarkerAlt className="mr-1" />
          <span>{turf.city}</span>
        </div>

        {/* Turf Dimensions */}
        <div className="mt-2 text-sm text-gray-500">
          <span>{`Dimensions: ${turf.dimensions.length}m x ${turf.dimensions.width}m`}</span>
        </div>

        {/* Features Icons */}
        <div className="flex items-center space-x-4 text-yellow-300 mt-3">
          {turf.amenities.includes('Shower') && <FaShower title="Shower" className="text-xl" />}
          {turf.amenities.includes('Parking') && <FaParking title="Parking" className="text-xl" />}
          {turf.amenities.includes('Wifi') && <FaWifi title="Wifi" className="text-xl" />}
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">Rs.{turf.pricePerHour}/hour</span>
          <Link
            to={`/turf/${turf._id}`}
            className="bg-yellow-300 text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TurfCard
