import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Turf {
  _id: string;
  name: string;
  description: string;
  pricePerHour: number;
  city: string;
  images: string[];
  amenities: string[];
  turfCategory: string;
  dimensions: {
    length: number;
    width: number;
  };
  locationCoordinates: {
    type: string;
    coordinates: number[];
  };
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

const AdminGetTurf: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Turf Details</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/admin/edit/${id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Turf
          </button>
          <button
            onClick={() => navigate('/admin/home')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

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
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{turf.name}</h2>
            <p className="text-gray-600">{turf.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Price</h3>
              <p className="text-2xl font-bold text-blue-600">₹{turf.pricePerHour}/hour</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-gray-600">{turf.city}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Category</h3>
              <p className="text-gray-600">{turf.turfCategory}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Dimensions</h3>
              <p className="text-gray-600">{turf.dimensions.length}m × {turf.dimensions.width}m</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h3>
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

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Coordinates</h3>
            <p className="text-gray-600">
              Lat: {turf.locationCoordinates.coordinates[1]}, 
              Lng: {turf.locationCoordinates.coordinates[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Available Slots */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Slots</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Slots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {turf.availableSlots.map((dateSlot, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(dateSlot.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {dateSlot.slots.map((slot, slotIndex) => (
                        <span
                          key={slotIndex}
                          className={`px-2 py-1 text-xs rounded-full ${
                            slot.isBooked 
                              ? 'bg-red-100 text-red-800' 
                              : slot.status === 'locked'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {slot.startTime}-{slot.endTime}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dateSlot.slots.filter(slot => !slot.isBooked).length} available
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminGetTurf;
