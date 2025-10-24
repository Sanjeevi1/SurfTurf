// components/TurfCard.tsx
'use client'
import React, { useEffect, useState, memo } from 'react';
import { FaMapMarkerAlt, FaShower, FaParking, FaWifi, FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsBookmarkFill, BsBookmark } from 'react-icons/bs';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import axios from 'axios';
import toast from 'react-hot-toast';

interface SlotTemplate {
    startTime: string;
    endTime: string;
    maxPlayers: number;
    isBooked: boolean;
}

interface Turf {
    _id: number;
    name: string;
    description: string;
    pricePerHour: number;
    city: string;
    slotTemplate: SlotTemplate[];
    dimensions: {
        length: number;
        width: number;
    };
    locationCoordinates: {
        type: string;
        coordinates: number[];
    };
    amenities: string[];
    turfCategory: string;
    images: string[];
}

interface TurfCardProps {
    turf: Turf;
    role?: string;
    refreshTurfList?: () => void;
}

const TurfCard: React.FC<TurfCardProps> = memo(({ turf, role, refreshTurfList }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [data, setdata] = useState<any>(null)

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/getuser')
            setdata(res.data.data)
        } catch (error) {

        }

    }
    useEffect(() => {
        getUserDetails();
    }, [])
    const handleSaveTurf = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: data?._id, turfId: turf._id }),
            });

            if (response.ok) {
                setIsSaved(true);
                toast.success('Turf saved successfully!');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to save turf');
            }
        } catch (error) {
            console.error('Error saving turf:', error);
        }
    };

    const handleUnsaveTurf = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await fetch('/api/save/unsave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: data?._id, turfId: turf._id }),
            });

            if (response.ok) {
                setIsSaved(false);
                toast.success('Turf removed from saved successfully!');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to remove turf from saved');
            }
        } catch (error) {
            console.error('Error unsaving turf:', error);
            toast.error('Error removing turf from saved');
        }
    };
    const [showSaveOptions, setShowSaveOptions] = useState(false);
    const handleDeleteTurf = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this turf?')) {
            try {
                const response = await axios.delete(`/api/turf/delete?id=${turf._id}`);
                if (response.status === 200) {
                    toast.success('Turf deleted successfully');
                    // Optionally, trigger a re-fetch or state update in the parent component if needed
                    // refreshTurfList();
                    window.location.replace('/admin/home');
                }
            } catch (error) {
                console.error('Error deleting turf:', error);
                toast.error('Failed to delete turf');
            }
        }
    };

    return (

        <div className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <div className="relative">
                <img
                    src={turf.images[0]}
                    alt={turf.name}
                    className="w-full h-40 object-cover"
                />
                {/* Improved Save button with better UX */}
                <div className="absolute top-3 right-3 z-10">
                    <button
                        onClick={isSaved ? handleUnsaveTurf : handleSaveTurf}
                        className={`
                            p-2 rounded-full transition-all duration-300 transform hover:scale-110 
                            ${isSaved 
                                ? 'bg-red-500 text-white shadow-lg hover:bg-red-600' 
                                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
                            }
                        `}
                        title={isSaved ? 'Remove from saved' : 'Save turf'}
                    >
                        {isSaved ? (
                            <HiHeart className="text-xl" />
                        ) : (
                            <HiOutlineHeart className="text-xl" />
                        )}
                    </button>
                </div>
                {role === 'owner' && (
                    <div className="absolute top-2 left-2">
                        <FaTrash
                            className="text-red-600 text-2xl cursor-pointer"
                            onClick={handleDeleteTurf}
                            title="Delete Turf"
                        />
                    </div>
                )}
            </div>
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{turf.name}</h2>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{turf.city}</span> {/* City */}
                </div>

                {/* Turf Dimensions */}
                <div className="mt-2 text-sm text-gray-500">
                    <span>{`Dimensions: ${turf.dimensions?.length || 'N/A'}m x ${turf.dimensions?.width || 'N/A'}m`}</span>
                </div>

                {/* Features Icons */}
                <div className="flex items-center space-x-4 text-yellow-300 mt-3">
                    {turf.amenities?.includes('Shower') && <FaShower title="Shower" className="text-xl" />}
                    {turf.amenities?.includes('Parking') && <FaParking title="Parking" className="text-xl" />}
                    {turf.amenities?.includes('Wifi') && <FaWifi title="Wifi" className="text-xl" />}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gray-900">₹{turf.pricePerHour}/hour</span>
                    {role !== 'owner' && role !== 'admin' && (
                        <button
                            onClick={() => window.location.href = `/customer/turf/${turf._id}`}
                            className="bg-yellow-300 text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
                        >
                            Book Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});

TurfCard.displayName = 'TurfCard';

export default TurfCard;
