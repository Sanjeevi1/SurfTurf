import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Book: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { turfId, selectedDate, selectedSlot, pricePerHour } = location.state || {}

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await api.get('/users/getuser')
        setUser(res.data.data)
      } catch (error) {
        console.error('Error fetching user details:', error)
        navigate('/login')
      }
    }

    getUserDetails()
  }, [navigate])

  const handleBooking = async () => {
    if (!user || !turfId || !selectedDate || !selectedSlot) {
      toast.error('Missing booking information')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/book', {
        user: user._id,
        turfId,
        selectedDate,
        selectedSlot,
        totalCost: pricePerHour,
        numberOfPlayers: 1
      })

      if (response.data.message === 'Booking created successfully') {
        toast.success('Booking confirmed!')
        navigate('/bookings')
      } else {
        toast.error(response.data.message)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  if (!turfId || !selectedDate || !selectedSlot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking</h1>
          <p className="text-gray-600 mb-4">Please select a turf, date, and time slot first.</p>
          <button
            onClick={() => navigate('/turf')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Turfs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirm Your Booking</h1>
          
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSlot}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per Hour</label>
                  <p className="mt-1 text-sm text-gray-900">₹{pricePerHour}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Cost</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">₹{pricePerHour}</p>
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={loading}
                className="px-6 py-2 bg-yellow-300 text-gray-900 rounded-md hover:bg-yellow-400 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Book
