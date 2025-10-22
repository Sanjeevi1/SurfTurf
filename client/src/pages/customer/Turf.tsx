import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Turf {
  _id: string;
  name: string;
  description: string;
  pricePerHour: number;
  city: string;
  images: string[];
  amenities: string[];
}

const CustomerTurf: React.FC = () => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([]);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    fetchTurfs();
  }, []);

  const fetchTurfs = async () => {
    try {
      const response = await axios.get('/api/turf');
      setTurfs(response.data);
      setFilteredTurfs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching turfs:', error);
      setLoading(false);
    }
  };

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    if (location) {
      const filtered = turfs.filter(turf => 
        turf.city.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredTurfs(filtered);
    } else {
      setFilteredTurfs(turfs);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading turfs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Turfs</h1>
        
        {/* Search Bar */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search by location..."
            value={searchLocation}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTurfs.map((turf) => (
          <div key={turf._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {turf.images && turf.images.length > 0 && (
              <img
                src={turf.images[0]}
                alt={turf.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{turf.name}</h3>
              <p className="text-gray-600 mb-4">{turf.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-blue-600">₹{turf.pricePerHour}/hour</span>
                <span className="text-sm text-gray-500">{turf.city}</span>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {turf.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to={`/customer/turf/${turf._id}`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredTurfs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No turfs found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerTurf;
