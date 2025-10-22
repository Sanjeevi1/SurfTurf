import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Turf {
  _id: string;
  name: string;
  category: string;
  size: string;
  location: string;
  address: string;
  characteristics: string;
  rate: string;
  image: string;
  slots: Array<{
    startTime: string;
    endTime: string;
    isBooked: boolean;
  }>;
}

interface Slot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const AdminChumma: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [turf, setTurf] = useState<Turf>({
    name: '',
    category: '',
    size: '',
    location: '',
    address: '',
    characteristics: '',
    rate: '',
    image: '',
    slots: []
  });
  const [imageUrl, setImageUrl] = useState('');
  const [slot, setSlot] = useState<Slot>({
    startTime: '',
    endTime: '',
    isBooked: false
  });
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (id) {
      fetchTurfDetails();
    }
  }, [id]);

  const fetchTurfDetails = async () => {
    try {
      const response = await axios.get(`/api/turf/${id}`);
      const dataTurf = response.data;
      
      setTurf({
        name: dataTurf.name || '',
        category: dataTurf.turfCategory || '',
        size: `${dataTurf.dimensions?.length || 0}m x ${dataTurf.dimensions?.width || 0}m`,
        location: dataTurf.city || '',
        address: dataTurf.description || '',
        characteristics: dataTurf.amenities?.join(', ') || '',
        rate: dataTurf.pricePerHour?.toString() || '',
        image: dataTurf.images?.[0] || '',
        slots: []
      });
      setImageUrl(dataTurf.images?.[0] || '');
    } catch (error: any) {
      toast.error('Failed to load turf details.');
    }
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSlot({
      ...slot,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addSlot = (): void => {
    if (!slot.startTime || !slot.endTime) {
      alert('Please provide both start time and end time for the slot.');
      return;
    }

    setSlots((prevSlots) => [...prevSlots, slot]);
    setSlot({ startTime: '', endTime: '', isBooked: false });
  };

  const removeSlot = (index: number) => {
    setSlots((prevSlots) => prevSlots.filter((_, i) => i !== index));
  };

  const removeImage = () => {
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload = {
      id: id,
      name: turf.name,
      category: turf.category,
      size: turf.size,
      location: turf.location,
      address: turf.address,
      characteristics: turf.characteristics,
      rate: turf.rate,
      slots: slots,
      image: imageUrl,
    };

    try {
      await axios.post('/api/admin/edit', payload);
      toast.success('Turf updated successfully');
      navigate('/admin/home');
    } catch (error: any) {
      console.log('Turf failed to update', error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Edit turf details
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={turf.name}
              onChange={(e) => setTurf({ ...turf, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              value={turf.category}
              type="text"
              onChange={(e) => setTurf({ ...turf, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2 w-full mb-4">
          <label htmlFor="size">Size</label>
          <input
            id="size"
            value={turf.size}
            type="text"
            onChange={(e) => setTurf({ ...turf, size: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full mb-4">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            value={turf.location}
            type="text"
            onChange={(e) => setTurf({ ...turf, location: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full mb-4">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            value={turf.address}
            type="text"
            onChange={(e) => setTurf({ ...turf, address: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full mb-4">
          <label htmlFor="characteristics">Characteristics</label>
          <input
            id="characteristics"
            value={turf.characteristics}
            type="text"
            onChange={(e) => setTurf({ ...turf, characteristics: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2 w-full mb-4">
          <label htmlFor="rate">Rate</label>
          <input
            id="rate"
            value={turf.rate}
            type="number"
            onChange={(e) => setTurf({ ...turf, rate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setImageUrl(e.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {imageUrl && (
            <div className="relative mt-4">
              <img
                src={imageUrl}
                alt="Uploaded Image"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-red-500"
                aria-label="Remove Image"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Slot Management */}
        <div className="mb-4">
          <h3 className="font-medium text-lg mb-2">Add Slot</h3>
          <div className="flex flex-col space-y-2 mb-2">
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={slot.startTime}
                onChange={handleSlotChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                value={slot.endTime}
                onChange={handleSlotChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isBooked"
                name="isBooked"
                type="checkbox"
                checked={slot.isBooked}
                onChange={handleSlotChange}
                className="h-4 w-4"
              />
              <label htmlFor="isBooked">Is Booked</label>
            </div>
          </div>
          <button
            type="button"
            onClick={addSlot}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Slot
          </button>
        </div>

        {/* Display Added Slots */}
        {slots.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-lg mb-2">Added Slots</h3>
            <ul className="list-disc pl-5 space-y-1">
              {slots.map((slot, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span>
                    {slot.startTime} - {slot.endTime}{' '}
                    {slot.isBooked ? '(Booked)' : '(Available)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove slot"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Update →
        </button>
      </form>
    </div>
  );
};

export default AdminChumma;
