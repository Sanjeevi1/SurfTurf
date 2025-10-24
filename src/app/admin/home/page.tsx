'use client';
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import TurfCard from '@/components/customer/card';
import axios from "axios";

interface SlotTemplate {
    startTime: string;
    endTime: string;
    maxPlayers: number;
    isBooked: boolean;
}

interface Turf {
    _id: string;
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

const Turfs: React.FC = () => {
    const [turfs, setTurfs] = useState<Turf[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [id,setId]=useState("");
    const [role,setRole]=useState("");
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number>(10000);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const fetchTurfs = async () => {
        try {
            // Fetch user ID first
            const res = await axios.get('/api/users/getuser');
            setId(res.data.data._id);
            setRole(res.data.data.role)
            const response = await fetch('/api/turf/ownerTurfs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: res.data.data._id, // Pass the retrieved user ID
                    location: '', // Add appropriate location if needed
                    date: '', // Add a date if needed
                    city: selectedCity || '', // Pass selected city or empty string
                    category: selectedCategory || '' // Pass selected category or empty string
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data); // Log the data to inspect the structure
            setTurfs(data);
        } catch (error) {
            console.error('Error fetching turfs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        fetchTurfs();
    }, [selectedCity, selectedCategory]); // Trigger effect when selectedCity or selectedCategory changes
    

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator
    }

    if (turfs.length === 0) {
        return <div>No turfs available.</div>;
    }

    const handleTurfClick = (id: string) => {
        return (`/customer/turf/${id}`);
    };

    // Filter turfs based on search query and selected filters
    const filteredTurfs = turfs.filter((turf) => {
        const matchesSearchQuery = turf.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = !selectedCity || selectedCity === '0' || turf.city === selectedCity;
        const matchesCategory = !selectedCategory || selectedCategory === '0' || turf.turfCategory === selectedCategory;
        const matchesPrice = turf.pricePerHour <= priceRange;
        const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => turf.amenities.includes(amenity));

        return matchesSearchQuery && matchesCity && matchesCategory && matchesPrice && matchesAmenities;
    });

    // Log filtered turfs to check the output
    console.log('Filtered Turfs:', filteredTurfs);


    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
            <div className="container mx-auto p-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Turfs</h1>
                    <p className="text-gray-600">Manage your turf listings and bookings</p>
                </div>
            {/* Turf Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTurfs.length > 0 ? (
                    filteredTurfs.map((turf) => (
                        <Link href={`/admin/getturf/${turf._id}`} key={turf._id}>
                            <div onClick={() => handleTurfClick(turf._id)}>
                                <TurfCard turf={turf} role={role} refreshTurfList={fetchTurfs} />
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 max-w-md mx-auto">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Turfs Found</h3>
                            <p className="text-gray-600 mb-6">No turfs match your search or filters.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCity(null);
                                    setSelectedCategory(null);
                                    setPriceRange(10000);
                                    setSelectedAmenities([]);
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default Turfs;
