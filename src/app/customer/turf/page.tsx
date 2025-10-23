'use client';
import Link from "next/link";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import TurfCard from '@/components/customer/card';
import LoadingSpinner from '@/components/customer/LoadingSpinner';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { MultiSelect } from 'primereact/multiselect';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

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
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<number>(10000);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [cities, setCities] = useState<{label: string, value: string}[]>([]);
    const [categories, setCategories] = useState<{label: string, value: string}[]>([]);
    const [amenitiesList, setAmenitiesList] = useState<{label: string, value: string}[]>([]);

    // Move all hooks to the top
    const handleTurfClick = useCallback((id: string) => {
        return (`/customer/turf/${id}`);
    }, []);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedCity(null);
        setSelectedCategory(null);
        setPriceRange(10000);
        setSelectedAmenities([]);
    }, []);

    // Filter turfs based on search query and selected filters - memoized for performance
    const filteredTurfs = useMemo(() => {
        return turfs.filter((turf) => {
            const matchesSearchQuery = turf.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = !selectedCity || selectedCity === '0' || turf.city === selectedCity;
            const matchesCategory = !selectedCategory || selectedCategory === '0' || turf.turfCategory === selectedCategory;
            const matchesPrice = turf.pricePerHour <= priceRange;
            const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every(amenity => turf.amenities.includes(amenity));

            return matchesSearchQuery && matchesCity && matchesCategory && matchesPrice && matchesAmenities;
        });
    }, [turfs, searchQuery, selectedCity, selectedCategory, priceRange, selectedAmenities]);

    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                const response = await fetch('/api/turf');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);

                setTurfs(data);
                
                // Extract unique cities from turfs
                const uniqueCities = Array.from(new Set(data.map((turf: Turf) => turf.city)))
                    .map(city => ({ label: String(city), value: String(city) }));
                setCities([{ label: 'All Cities', value: '0' }, ...uniqueCities]);

                // Extract unique categories from turfs
                const uniqueCategories = Array.from(new Set(data.map((turf: Turf) => turf.turfCategory)))
                    .map(category => ({ label: String(category), value: String(category) }));
                setCategories([{ label: 'All Categories', value: '0' }, ...uniqueCategories]);

                // Extract unique amenities from turfs
                const allAmenities = data.flatMap((turf: Turf) => turf.amenities);
                const uniqueAmenities = Array.from(new Set(allAmenities))
                    .map(amenity => ({ label: String(amenity), value: String(amenity) }));
                setAmenitiesList(uniqueAmenities);

            } catch (error) {
                console.error('Error fetching turfs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTurfs();
    }, []);

    if (loading) {
        return <LoadingSpinner size="lg" text="Loading turfs..." />;
    }

    if (turfs.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-yellow-200">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Turfs Available</h3>
                    <p className="text-gray-600 mb-4">We're working on adding more turfs to our platform.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    // Log filtered turfs to check the output
    console.log('Filtered Turfs:', filteredTurfs);


    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Turfs</h1>
                        <p className="text-gray-600">Discover the best turfs in your area</p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <FaFilter className="mr-2" /> 
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

            {/* Search and Filter section (conditionally rendered) */}
            {showFilters && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-yellow-200">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Turfs</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="search"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                                placeholder="Search by turf name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* City Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <Dropdown 
                                value={selectedCity} 
                                options={cities} 
                                onChange={(e) => setSelectedCity(e.value)} 
                                placeholder="Select City" 
                                className="w-full" 
                            />
                        </div>

                        {/* Turf Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <Dropdown 
                                value={selectedCategory} 
                                options={categories} 
                                onChange={(e) => setSelectedCategory(e.value)} 
                                placeholder="Select Category" 
                                className="w-full" 
                            />
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                            <div className="space-y-2">
                                <Slider 
                                    value={priceRange} 
                                    onChange={(e) => setPriceRange(Array.isArray(e.value) ? e.value[0] : e.value)} 
                                    max={10000} 
                                    className="w-full" 
                                />
                                <div className="text-sm text-gray-600">Up to ₹{priceRange.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Amenities Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                            <MultiSelect 
                                value={selectedAmenities} 
                                options={amenitiesList} 
                                onChange={(e) => setSelectedAmenities(e.value)} 
                                placeholder="Select Amenities" 
                                className="w-full" 
                            />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors duration-200 font-medium"
                        >
                            <FaTimes className="inline mr-2" />
                            Clear Filters
                        </button>
                    </div>
                </div>
            )}
            {/* Turf Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTurfs.length > 0 ? (
                    filteredTurfs.map((turf) => (
                        <Link href={`/customer/turf/${turf._id}`} key={turf._id} className="block">
                            <div className="transform transition-transform duration-200 hover:scale-105">
                                <TurfCard turf={turf as any} />
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-yellow-200 max-w-md mx-auto">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Turfs Found</h3>
                            <p className="text-gray-600 mb-6">No turfs match your search or filters.</p>
                            <button
                                onClick={clearFilters}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                            >
                                Clear all filters
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
