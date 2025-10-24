// components/TurfCard.tsx
'use client'
import React, { useState, Fragment, useEffect } from 'react';
import { FaMapMarkerAlt, FaShower, FaParking, FaWifi, FaHeart } from 'react-icons/fa';
import { BsBookmarkFill } from 'react-icons/bs';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';
import Link from 'next/link';
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
    turf: Turf & { userId?: string };
}
const ProductPreviews = ({ previews }: { previews: string[] }) => {
    const [index, setIndex] = useState(0);

    return (
        <Fragment>
            <div className=" p-4">
                <div className="relative">
                    <div className="text-center mb-4">
                        <img
                            src={previews[index]}
                            alt=""
                            className="max-w-full h-auto rounded-3xl shadow-2xl"
                        />
                    </div>
                    <ul className="flex">
                        {previews.map((preview: string, i: number) => (
                            <a href="#!" key={i}>
                                <li
                                    className="w-12 h-12 inline-flex justify-center items-center bg-yellow-30 dark:bg-slate-800 border border-yellow-300 dark:border-yellow-300 dark:border-opacity-20 rounded-lg mr-2.5 p-2"
                                    onClick={() => setIndex(i)}
                                >
                                    <img src={preview} alt="" className="max-w-full h-auto" />
                                </li>
                            </a>
                        ))}
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

const TurfCard: React.FC<TurfCardProps> = ({ turf }) => {
    const [isSaved, setIsSaved] = useState(true); // Default to true since it's in saved turfs
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Get current user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/users/getuser');
                const data = await response.json();
                setCurrentUser(data.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    const handleUnsaveTurf = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await fetch('/api/save/unsave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId: currentUser?._id, 
                    turfId: turf._id 
                }),
            });

            if (response.ok) {
                setIsSaved(false);
                // Show success message
                toast.success('Turf removed from saved successfully!');
                // Refresh the page to update the list
                window.location.reload();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to remove turf from saved');
            }
        } catch (error) {
            console.error('Error unsaving turf:', error);
            toast.error('Error removing turf from saved');
        }
    };

    return (

        <div className="max-w-sm grid grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 w-full ">
            <div className="relative rounded-lg">
                <ProductPreviews previews={turf.images} />
                
                {/* Save/Unsave button */}
                <div className="absolute top-3 right-3 z-10">
                    <button
                        onClick={handleUnsaveTurf}
                        className="p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                        title="Remove from saved"
                    >
                        <HiHeart className="text-xl" />
                    </button>
                </div>
            </div>
            <div className="p-4 w-full">
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

                <div className="flex justify-between items-center mt-4 flex-wrap">
                    <span className="text-md font-bold text-gray-900 mb-2">₹{turf.pricePerHour}/hour</span>
                    <button
                        className="bg-yellow-300 text-gray-900  text-sm px-2 py-1 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
                    >
                        <Link href={`/customer/turf/${turf._id}`}>Book Now
                        </Link>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default TurfCard;
