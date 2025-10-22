import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TurfCard from '../components/TurfCard'
import { Dropdown } from 'primereact/dropdown'
import { Slider } from 'primereact/slider'
import { MultiSelect } from 'primereact/multiselect'
import { FaFilter } from 'react-icons/fa'
import api from '../utils/api'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'

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

const Turf: React.FC = () => {
  const [turfs, setTurfs] = useState<Turf[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<number>(10000)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState<boolean>(false)

  const cities = [
    { label: 'All Cities', value: '0' },
    { label: 'City1', value: 'City 1' },
    { label: 'City2', value: 'City 2' },
    { label: 'City3', value: 'City 3' }
  ]

  const categories = [
    { label: 'All Categories', value: '0' },
    { label: 'Football', value: 'Football' },
    { label: 'Cricket', value: 'Cricket' },
    { label: 'Hockey', value: 'Hockey' }
  ]

  const amenitiesList = [
    { label: 'WiFi', value: 'WiFi' },
    { label: 'Parking', value: 'Parking' },
    { label: 'Locker Rooms', value: 'Locker Rooms' },
    { label: 'Showers', value: 'Showers' }
  ]

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const response = await api.get('/turf')
        console.log(response.data)
        setTurfs(response.data)
      } catch (error) {
        console.error('Error fetching turfs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTurfs()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (turfs.length === 0) {
    return <div>No turfs available.</div>
  }

  const filteredTurfs = turfs.filter((turf) => {
    const matchesSearchQuery = turf.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCity = !selectedCity || selectedCity === '0' || turf.city === selectedCity
    const matchesCategory = !selectedCategory || selectedCategory === '0' || turf.turfCategory === selectedCategory
    const matchesPrice = turf.pricePerHour <= priceRange
    const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => turf.amenities.includes(amenity))

    return matchesSearchQuery && matchesCity && matchesCategory && matchesPrice && matchesAmenities
  })

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Available Turfs</h1>
      <div className="flex justify-end">
        <div className="mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-yellow-300 text-white px-4 py-2 rounded flex items-center justify-center"
          >
            <FaFilter className="mr-2" /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter mb-6">
          <form className="max-w-md mx-auto mb-6">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-black focus:border-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
                placeholder="Search Turfs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                required
              />
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Dropdown value={selectedCity} options={cities} onChange={(e) => setSelectedCity(e.value)} placeholder="Select City" className="w-full" />
            <Dropdown value={selectedCategory} options={categories} onChange={(e) => setSelectedCategory(e.value)} placeholder="Select Category" className="w-full" />
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <Slider value={priceRange} onChange={(e) => setPriceRange(e.value)} max={10000} className="w-full" />
              <div className="text-sm text-gray-700">Up to ₹{priceRange}</div>
            </div>
            <MultiSelect value={selectedAmenities} options={amenitiesList} onChange={(e) => setSelectedAmenities(e.value)} placeholder="Select Amenities" className="w-full" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => (
            <Link to={`/turf/${turf._id}`} key={turf._id}>
              <TurfCard turf={turf} />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-red-500">No turfs match your search or filters.</div>
        )}
      </div>
    </div>
  )
}

export default Turf
