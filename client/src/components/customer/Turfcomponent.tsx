import React, { Fragment, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { useParams } from 'react-router-dom';
import DatePickerWithSlots from "./datepicker";

interface TimeSlot {
    startTime: string;
    endTime: string;
    maxPlayers: number;
    bookedPlayers: number;
    isBooked: boolean;
}

interface Slot {
    date: string;
    timeSlots: TimeSlot[];
}

interface Turf {
    name: string;
    description: string;
    pricePerHour: number;
    availableSlots: Slot[];
    amenities: string[];
    turfCategory: string;
    dimensions: { length: number; width: number };
    images: string[];
    rating: number;
    reviews: string[];
}

const ProductPreviews = ({ previews }: { previews: string[] }) => {
    const [index, setIndex] = useState(0);

    return (
        <Fragment>
            <div className="rounded-lg shadow-2xl p-4">
                <div className="relative">
                    <div className="text-center mb-4 md:p-6">
                        <img
                            src={previews[index]}
                            alt=""
                            className="max-w-full h-auto rounded-3xl shadow-2xl"
                        />
                    </div>
                    <ul className="flex">
                        {previews.map((preview, i) => (
                            <a href="#!" key={i}>
                                <li
                                    className="w-24 h-24 inline-flex justify-center items-center bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-600 dark:border-opacity-20 rounded-lg mr-2.5 p-2"
                                    onClick={() => setIndex(i)}
                                >
                                    <img
                                        src={preview}
                                        alt=""
                                        className="max-w-full h-auto"
                                    />
                                </li>
                            </a>
                        ))}
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

const LivePortal = () => {
    const [turf, setTurf] = useState<Turf | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedSlot, setSelectedSlot] = useState<{ date: string; slot: TimeSlot } | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchTurf = async () => {
            try {
                const response = await fetch(`/api/turf/${id}`);
                if (!response.ok) throw new Error('Failed to fetch turf');
                const data = await response.json();
                setTurf(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTurf();
    }, [id]);

    if (loading || !turf) return <div>Loading...</div>;

    return (
        <section className="py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative overflow-hidden z-10">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1 relative">
                        <ProductPreviews previews={turf.images} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-6 lg:mb-12">
                            <h1 className="text-2xl leading-none md:text-4xl font-medium mb-4">
                                {turf.name}
                            </h1>
                            <p className="opacity-70 mb-6">
                                {turf.rating?.toFixed(1) || '4.5'} out of {turf.reviews?.length || 0}{" "}
                                <a href="#!" className="text-blue-600 font-medium ml-1">
                                    Reviews
                                </a>
                            </p>
                            <h3 className="text-2xl text-blue-600 font-medium">
                                Rs. {turf.pricePerHour} per hour
                            </h3>
                        </div>

                        <form action="#!">
                            <div className="mb-6">
                                <h5 className="font-medium mb-2">Amenities</h5>
                                <div className="flex flex-wrap gap-2">
                                    {turf.amenities.map((amenity, i) => (
                                        <span key={i} className="bg-gray-100 dark:bg-slate-800 py-1 px-4 rounded-full border text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 mt-1">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h5 className="font-medium mb-2">Available Slots</h5>
                                <DatePickerWithSlots
                                    availableSlots={turf.availableSlots}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    setSelectedSlot={setSelectedSlot}
                                />
                            </div>

                            <div className="flex items-center my-7">
                                <button className="bg-blue-600 text-white text-sm rounded uppercase hover:bg-opacity-90 px-6 py-2.5 mr-2">
                                    Book Now
                                </button>
                                <button className="bg-blue-600 text-white rounded text-xl hover:bg-opacity-90 py-1.5 px-3 mr-2">
                                    <FontAwesomeIcon icon={faHeart} />
                                </button>
                                <button className="hover:bg-blue-600 rounded hover:bg-opacity-10 text-blue-600 px-3 py-2">
                                    <FontAwesomeIcon icon={faShareAlt} /> Share
                                </button>
                            </div>

                            <p className="opacity-70 lg:mr-56 xl:mr-80">
                                {turf.description}
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LivePortal;