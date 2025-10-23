'use client';
import Hero from '@/components/customer/Hero';
import SelectionForm from '@/components/customer/herosearch';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Category from '@/components/customer/Category';
import TurfCard from '@/components/customer/savedturfcard';
import DatePicker from '@/components/customer/datepicker';
import axios from 'axios';

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

export default function Home() {
    const [turfs, setTurfs] = useState<Turf[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const [topTurfIds, setTopTurfIds] = useState<string[]>([]);
    const [userData, setUserData] = useState(null);

    // Fetch top-ranked turf IDs

    // Fetch all turfs after topTurfIds is set

    const handleTurfClick = (id: string) => {
        router.push(`/customer/turf/${id}`);
    };
    const [topRankedTurfs, setTopRankedTurfs] = useState([]);

    useEffect(() => {
        const fetchTopRatedTurfs = async () => {
            try {
                // Fetch all turfs
                const allTurfsResponse = await axios.get(`/api/turf`);
                const allTurfs = allTurfsResponse.data;

                // Sort turfs by price (assuming higher price = better quality) and take top 3
                // You can modify this logic based on your rating system
                const sortedTurfs = allTurfs
                    .sort((a, b) => b.pricePerHour - a.pricePerHour)
                    .slice(0, 3);

                setTopRankedTurfs(sortedTurfs);
            } catch (error) {
                console.error("Error fetching top-rated turfs:", error);
                // Fallback: show first 3 turfs if sorting fails
                try {
                    const fallbackResponse = await axios.get(`/api/turf`);
                    setTopRankedTurfs(fallbackResponse.data.slice(0, 3));
                } catch (fallbackError) {
                    console.error("Fallback fetch also failed:", fallbackError);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTopRatedTurfs();
    }, []);

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/getuser');
            setUserData(res.data.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
            <Hero isLoggedIn={true} />
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Categories</h2>
                    <p className="text-gray-600">Choose your preferred sport</p>
                </div>
                <Category />
                
                <div className="text-center mb-8 mt-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Rated Turfs</h1>
                    <p className="text-gray-600">Discover our most popular and highly-rated turfs</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {topRankedTurfs.length > 0 ? (
                        topRankedTurfs.map((turf, index) => (
                            <div
                                key={turf._id}
                                onClick={() => handleTurfClick(turf._id)}
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                }}
                                className="turf-card transform transition-transform duration-200 hover:scale-105"
                            >
                                <TurfCard turf={turf} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 max-w-md mx-auto">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Turfs Available</h3>
                                <p className="text-gray-600 mb-6">We're working on adding more turfs to our platform.</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                >
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
