import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminEditTurf: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerHour: '',
    city: '',
    amenities: '',
    turfCategory: 'Sports',
    dimensions: {
      length: '',
      width: ''
    },
    locationCoordinates: {
      latitude: '',
      longitude: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTurfDetails();
    }
  }, [id]);

  const fetchTurfDetails = async () => {
    try {
      const response = await axios.get(`/api/turf/${id}`);
      const turf = response.data;
      
      setFormData({
        name: turf.name,
        description: turf.description,
        pricePerHour: turf.pricePerHour.toString(),
        city: turf.city,
        amenities: turf.amenities.join(', '),
        turfCategory: turf.turfCategory,
        dimensions: {
          length: turf.dimensions.length.toString(),
          width: turf.dimensions.width.toString()
        },
        locationCoordinates: {
          latitude: turf.locationCoordinates.coordinates[1].toString(),
          longitude: turf.locationCoordinates.coordinates[0].toString()
        }
      });
      setInitialLoading(false);
    } catch (error) {
      console.error('Error fetching turf details:', error);
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        pricePerHour: parseInt(formData.pricePerHour),
        dimensions: {
          length: parseInt(formData.dimensions.length),
          width: parseInt(formData.dimensions.width)
        },
        locationCoordinates: {
          type: 'Point',
          coordinates: [parseFloat(formData.locationCoordinates.longitude), parseFloat(formData.locationCoordinates.latitude)]
        },
        amenities: formData.amenities.split(',').map(amenity => amenity.trim())
      };

      await axios.put(`/api/admin/edit/${id}`, payload);
      toast.success('Turf updated successfully!');
      navigate('/admin/home');
    } catch (error: any) {
      console.error('Error updating turf:', error);
      toast.error(error.response?.data?.error || 'Failed to update turf');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading turf details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Turf</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Turf Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Hour (₹)
            </label>
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="turfCategory"
              value={formData.turfCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Sports">Sports</option>
              <option value="Recreation">Recreation</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length (meters)
            </label>
            <input
              type="number"
              name="dimensions.length"
              value={formData.dimensions.length}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width (meters)
            </label>
            <input
              type="number"
              name="dimensions.width"
              value={formData.dimensions.width}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              name="locationCoordinates.latitude"
              value={formData.locationCoordinates.latitude}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              name="locationCoordinates.longitude"
              value={formData.locationCoordinates.longitude}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities (comma-separated)
          </label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g., Parking, Restroom, Changing Room"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/home')}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Turf...' : 'Update Turf'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditTurf;
