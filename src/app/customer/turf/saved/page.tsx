'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TurfCard from '@/components/customer/savedturfcard';
import axios from 'axios';

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

export default function Home() {
    const [turfs, setTurfs] = useState<Turf[]>([]);
    const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([]);
    const [savedTurfs, setSavedTurfs] = useState<{ turfId: number }[]>([]);
    const router = useRouter();
    const [user, setUser] = useState({});

    // Fetch user details
    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/getuser');
            setUser(res.data.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    // Fetch saved turfs for the user
    const handleSaveTurf = async () => {
        try {
            const response = await axios.post('/api/save/use', {
                userId: user._id,
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching saved turfs:', error);
            return []; // Return empty array on error
        }
    };

    // Fetch all turfs
    const fetchTurfs = async () => {
        try {
            const response = await axios.get('/api/turf');
            setTurfs(response.data);
        } catch (error) {
            console.error('Error fetching turfs:', error);
        }
    };

    // Load user data on component mount
    useEffect(() => {
        getUserDetails();
    }, []);

    // Load saved turfs and all turfs
    useEffect(() => {
        const loadData = async () => {
            const savedTurfsData = await handleSaveTurf();
            setSavedTurfs(savedTurfsData);
        };
        loadData();
    }, [user]);

    useEffect(() => {
        fetchTurfs();
    }, []);

    // Filter turfs based on saved turf IDs
    useEffect(() => {
        if (turfs.length > 0 && savedTurfs.length > 0) {
            const turfIds = savedTurfs.map((item) => item.turfId);
            const filtered = turfs.filter(turf => turfIds.includes(turf._id));
            setFilteredTurfs(filtered);
        }
    }, [turfs, savedTurfs]);

    const handleTurfClick = (id: string) => {
        router.push(`/customer/turf/${id}`);
    };

    console.log(filteredTurfs, 'Filtered Turfs');

    return (
        <>
            <div className='font-bold text-black text-2xl text-center m-10'>MySavedTurfs</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 ml-16">
                {filteredTurfs.map((turf) => (
                    <div key={turf._id}>
                        <TurfCard turf={turf} />
                    </div>
                ))}
            </div>
        </>
    );
}
