import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from 'primereact/dropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCalendar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import api from '../utils/api'
import "primereact/resources/themes/lara-light-cyan/theme.css"

const SelectionForm: React.FC = () => {
  const [location, setLocation] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('day')
  const [locations, setLocations] = useState([])
  const navigate = useNavigate()

  const timeOptions = [
    { name: 'Day', code: 'day' },
    { name: 'Night', code: 'night' },
  ]

  const handleSearch = async (location: string, date: string, city: string) => {
    try {
      const res = await api.post('/turf', { location, date, city })
      
      if (res.data.success) {
        navigate('/turf', { state: { location, date, city } })
      } else {
        console.error('Error fetching turfs:', res.data.error)
      }
    } catch (error) {
      console.error('Error fetching turfs:', error)
    }
  }

  useEffect(() => {
    const fetchUniqueCities = async () => {
      try {
        const response = await api.get(`/turf?city=true`)
        const cityData = response.data
        if (Array.isArray(cityData)) {
          setLocations(cityData)
        } else {
          console.error('Unexpected format:', cityData)
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchUniqueCities()
  }, [])

  const buildSearchURL = () => {
    if (location) {
      return `/turf?location=${location}`
    }
    return '#'
  }

  return (
    <div className="flex p-2 justify-center items-center bg-white shadow-2xl rounded-full w-full m-auto flex-wrap lg:w-3/4">
      {/* Location Selection */}
      <div className="flex flex-col">
        <label className="text-gray-600 text-sm">
          <FontAwesomeIcon icon={faLocationDot} className="mr-3" />
          Location
        </label>
        <Dropdown
          value={location}
          onChange={(e) => setLocation(e.value)}
          options={locations}
          optionLabel="name"
          placeholder="Select a City"
          className="w-full"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={() => {
          if (!location) {
            alert("Please select location")
          } else {
            navigate(`/turf?location=${location}`)
          }
        }}
        className="flex items-center px-5 py-4 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full hover:bg-yellow-400 focus:bg-yellow-400"
      >
        <p>Search</p>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-3" />
      </button>
    </div>
  )
}

export default SelectionForm
