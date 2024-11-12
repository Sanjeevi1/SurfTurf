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
        const fetchTopRankedTurfs = async () => {
            try {
                // Fetch the top-ranked turf data (which includes predicted_score)
                const response = await axios.get(`/api/top-ranked-turfs`);
                const topRankedTurfs = response.data;

                // Fetch all turfs to filter for the top-ranked ones
                const allTurfsResponse = await axios.get(`/api/turf`);
                const allTurfs = allTurfsResponse.data;

                // Filter turfs that match top-ranked turf IDs and include predicted_score
                const filteredTopRankedTurfs = allTurfs.filter((turf) =>
                    topRankedTurfs.some((topTurf) => topTurf.id === turf._id)
                );

                // Sort the filtered turfs by predicted_score in descending order
                const sortedTopRankedTurfs = filteredTopRankedTurfs.sort((a, b) =>
                    b.predicted_score - a.predicted_score
                );

                // Set the sorted top-ranked turfs to the state
                setTopRankedTurfs(sortedTopRankedTurfs);
            } catch (error) {
                console.error("Error fetching top-ranked turfs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRankedTurfs();
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
        <>
            <Hero isLoggedIn={true} />
            <div className="font-bold text-black text-center text-2xl">Category</div>
            <Category />
            <br />
            <br />
            <h1 className="font-bold text-black  text-2xl">Ai Recommended Turfs</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 lg:ml-16 lg:mr-16 sm:ml-10 sm:mr-10 md:ml-10 md:mr-10">
                {topRankedTurfs.length > 0 ? (
                    topRankedTurfs.map((turf, index) => (
                        <div
                            key={turf._id}
                            onClick={() => handleTurfClick(turf._id)}
                            style={{
                                animationDelay: `${index * 0.2}s`,
                            }}
                            className="turf-card"
                        >
                            <TurfCard turf={turf} />
                        </div>
                    ))
                ) : (
                    <p>No turfs available</p>
                )}
            </div>
        </>
    );
}
