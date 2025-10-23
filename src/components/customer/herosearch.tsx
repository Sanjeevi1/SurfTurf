'use client'; // Ensure this file is treated as a client component

import { Dropdown } from 'primereact/dropdown';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCalendar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { useRouter } from 'next/router';
const SelectionForm = () => {
    const [location, setLocation] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [timeOfDay, setTimeOfDay] = useState('day'); // default to 'day'
    const [locations, setLocations] = useState([]); // State to hold unique cities

    const timeOptions = [
        { name: 'Day', code: 'day' },
        { name: 'Night', code: 'night' },
    ];

    const handleSearch = async (location: string, date: string, city: string) => {
        const res = await fetch('/api/customer/turf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location, date, city }),
        });

        const data = await res.json();

        if (data.success) {
            // Redirect to a page with the filtered turfs
            router.push({
                pathname: '/turfs',
                query: { location, date, city } // Pass the filters as query parameters
            });
        } else {
            console.error('Error fetching turfs:', data.error);
        }
    };

    // Fetch unique cities
    useEffect(() => {
        const fetchUniqueCities = async () => {
            try {
                const response = await fetch(`/api/turf?location=true`);
                const cityData = await response.json();
                if (Array.isArray(cityData)) {
                    setLocations(cityData);
                } else {
                    console.error('Unexpected format:', cityData);
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchUniqueCities();
    }, []);
    const buildSearchURL = () => {
        if (location) {
            return `/customer/turf?location=${location}`;
        }
        return '#'; // Invalid link if inputs are missing
    };

    return (
        <div className="flex p-2 justify-center items-center bg-white shadow-2xl rounded-full w-full m-auto flex-wrap lg:w-3/4">
            {/* Location Selection */}
            <div className="flex flex-col">
                <label className="text-gray-600 text-sm">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-3" />
                    Location
                </label>
                <Dropdown
                    value={location}
                    onChange={(e) => setLocation(e.value)}
                    options={locations}
                    optionLabel="name"
                    placeholder="Select a City"
                    className="w-full"
                />
            </div>

            {/* Date Selection */}
            {/* <div className="flex flex-col mx-4">
                <label className="text-gray-600 text-sm">
                    <FontAwesomeIcon icon={faCalendar} className="mr-3" />
                    Date
                </label>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-black"
                />
            </div> */}

            {/* Time of Day Selection */}
            {/* <div className="flex flex-col mx-4">
                <label className="text-gray-600 text-sm">Time of Day</label>
                <Dropdown
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.value)}
                    options={timeOptions}
                    optionLabel="name"
                    placeholder="Select Time"
                    className="w-full md:w-14rem"
                />
            </div> */}

            {/* Search Button */}
            <Link
                href={buildSearchURL()}
                className="flex items-center px-5 py-4 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full hover:bg-yellow-400 focus:bg-yellow-400"
                onClick={(e) => {
                    if (!location) {
                        e.preventDefault();
                        alert("Please select location ");
                    }
                }}
            >
                <p>Search</p>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-3" />
            </Link>
        </div>
    );
};

export default SelectionForm;
