import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Turf {
  _id: string;
  name: string;
  description: string;
  pricePerHour: number;
  city: string;
  images: string[];
  amenities: string[];
  availableSlots: Array<{
    date: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      maxPlayers: number;
      isBooked: boolean;
      status: string;
    }>;
  }>;
}

const CustomerTurfDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    if (id) {
      fetchTurfDetails();
    }
  }, [id]);

  const fetchTurfDetails = async () => {
    try {
      const response = await axios.get(`/api/turf/${id}`);
      setTurf(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching turf details:', error);
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select a date and time slot');
      return;
    }
    
    // Navigate to booking page with selected details
    navigate('/customer/book', {
      state: {
        turfId: id,
        selectedDate,
        selectedSlot,
        turf
      }
    });
  };

  const getAvailableSlots = () => {
    if (!turf || !selectedDate) return [];
    
    const dateSlot = turf.availableSlots.find(slot => 
      new Date(slot.date).toISOString().split('T')[0] === selectedDate
    );
    
    return dateSlot ? dateSlot.slots.filter(slot => !slot.isBooked && slot.status === 'unlocked') : [];
  };

  const getAvailableDates = () => {
    if (!turf) return [];
    return turf.availableSlots.map(slot => new Date(slot.date).toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading turf details...</div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Turf not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Turf Images */}
        <div>
          {turf.images && turf.images.length > 0 && (
            <img
              src={turf.images[0]}
              alt={turf.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Turf Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{turf.name}</h1>
          <p className="text-gray-600 mb-6">{turf.description}</p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Price</h3>
            <p className="text-2xl font-bold text-blue-600">₹{turf.pricePerHour}/hour</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
            <p className="text-gray-600">{turf.city}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {turf.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Booking Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Your Slot</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a date</option>
                {getAvailableDates().map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a time slot</option>
                  {getAvailableSlots().map((slot, index) => (
                    <option key={index} value={`${slot.startTime}-${slot.endTime}`}>
                      {slot.startTime} - {slot.endTime} (Max: {slot.maxPlayers} players)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleBookNow}
              disabled={!selectedDate || !selectedSlot}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTurfDetail;
