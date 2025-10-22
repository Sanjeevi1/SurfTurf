import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SavedTurf {
  _id: string;
  turfId: {
    _id: string;
    name: string;
    description: string;
    pricePerHour: number;
    city: string;
    images: string[];
    amenities: string[];
  };
  savedAt: string;
}

const CustomerSavedTurfs: React.FC = () => {
  const [savedTurfs, setSavedTurfs] = useState<SavedTurf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedTurfs();
  }, []);

  const fetchSavedTurfs = async () => {
    try {
      const response = await axios.get('/api/save');
      setSavedTurfs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching saved turfs:', error);
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (turfId: string) => {
    try {
      await axios.delete(`/api/save/${turfId}`);
      setSavedTurfs(savedTurfs.filter(saved => saved.turfId._id !== turfId));
      toast.success('Turf removed from saved list');
    } catch (error) {
      console.error('Error removing saved turf:', error);
      toast.error('Failed to remove turf from saved list');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading saved turfs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Turfs</h1>

      {savedTurfs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No saved turfs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTurfs.map((savedTurf) => (
            <div key={savedTurf._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {savedTurf.turfId.images && savedTurf.turfId.images.length > 0 && (
                <img
                  src={savedTurf.turfId.images[0]}
                  alt={savedTurf.turfId.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {savedTurf.turfId.name}
                </h3>
                <p className="text-gray-600 mb-4">{savedTurf.turfId.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-blue-600">
                    ₹{savedTurf.turfId.pricePerHour}/hour
                  </span>
                  <span className="text-sm text-gray-500">{savedTurf.turfId.city}</span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {savedTurf.turfId.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/customer/turf/${savedTurf.turfId._id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemoveSaved(savedTurf.turfId._id)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerSavedTurfs;
