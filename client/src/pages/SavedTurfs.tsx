import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import TurfCard from '../components/TurfCard'

interface SavedTurf {
  _id: string
  turf: {
    _id: string
    name: string
    description: string
    pricePerHour: number
    city: string
    dimensions: {
      length: number
      width: number
    }
    amenities: string[]
    turfCategory: string
    images: string[]
  }
}

const SavedTurfs: React.FC = () => {
  const [savedTurfs, setSavedTurfs] = useState<SavedTurf[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSavedTurfs = async () => {
      try {
        const response = await api.get('/save/use')
        setSavedTurfs(response.data)
      } catch (error) {
        console.error('Error fetching saved turfs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedTurfs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading your saved turfs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Turfs</h1>
        
        {savedTurfs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No saved turfs</h3>
            <p className="mt-1 text-sm text-gray-500">Start saving turfs you like to see them here.</p>
            <div className="mt-6">
              <Link
                to="/turf"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Browse Turfs
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedTurfs.map((savedTurf) => (
              <div key={savedTurf._id}>
                <TurfCard turf={savedTurf.turf} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedTurfs
