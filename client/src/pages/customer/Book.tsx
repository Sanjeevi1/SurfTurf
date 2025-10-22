import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface BookingData {
  turfId: string;
  selectedDate: string;
  selectedSlot: string;
  turf: {
    name: string;
    pricePerHour: number;
  };
}

const CustomerBook: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setBookingData(location.state as BookingData);
    } else {
      navigate('/customer/turf');
    }
  }, [location.state, navigate]);

  const handleBooking = async () => {
    if (!bookingData) return;

    setLoading(true);
    try {
      const [startTime, endTime] = bookingData.selectedSlot.split('-');
      const totalPrice = bookingData.turf.pricePerHour * numberOfPlayers;

      const bookingPayload = {
        turfId: bookingData.turfId,
        bookingDate: bookingData.selectedDate,
        timeSlot: {
          startTime,
          endTime
        },
        numberOfPlayers,
        totalPrice
      };

      await axios.post('/api/bookings', bookingPayload);
      toast.success('Booking created successfully!');
      navigate('/customer/bookings');
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading booking details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {bookingData.turf.name}
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {new Date(bookingData.selectedDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time Slot:</span>
            <span className="font-medium">{bookingData.selectedSlot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per hour:</span>
            <span className="font-medium">₹{bookingData.turf.pricePerHour}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Players
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={numberOfPlayers}
            onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Price:</span>
            <span className="text-blue-600">₹{bookingData.turf.pricePerHour * numberOfPlayers}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/customer/turf')}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerBook;
