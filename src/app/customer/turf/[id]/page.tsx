"use client";
import React, { Fragment, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useParams } from 'next/navigation';
import ReviewComponent from "@/components/customer/Review";

const DatePickerWithSlots = ({
    availableSlots,
    selectedDate,
    setSelectedDate,
    setSelectedSlot,
    selectedSlot
}) => {
    const [slots, setSlots] = useState([]);

    // Extract dates from availableSlots
    const dates = availableSlots.map(slotInfo => new Date(slotInfo.date)); // Ensure date is a Date object

    // Fetch slots for a specific date from availableSlots
    const fetchSlotsForDate = (date) => {
        const dateString = date.toISOString().split("T")[0];

        const matchingSlot = availableSlots.find(slotInfo => {
            const slotDate = new Date(slotInfo.date); // Convert slotInfo.date to a Date object
            return slotDate.toISOString().split("T")[0] === dateString;
        });

        return matchingSlot ? matchingSlot.slots.map(
            (timeSlot) => ({
                time: `${timeSlot.startTime} - ${timeSlot.endTime}`,
                isBooked: timeSlot.isBooked // Assuming isBooked property is present
            })
        ) : [];
    };

    // Load slots for the selected date when the component loads or when selectedDate changes
    useEffect(() => {
        if (selectedDate) {
            loadSlots(selectedDate);
        }
    }, [selectedDate, availableSlots]);

    const loadSlots = (date) => {
        const fetchedSlots = fetchSlotsForDate(date);
        setSlots(fetchedSlots);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);  // Update the selected date in the parent
        loadSlots(date);  // Load the slots for the newly selected date
    };

    const handleSlotClick = (slot) => {
        if (!slot.isBooked) {
            setSelectedSlot(slot.time);  // Update the selected slot in the parent
        }
    };

    return (
        <div>
            {/* Date picker UI */}
            <div className="flex space-x-4 mb-4 smooth-transition">
                {dates.map((date) => (
                    <div
                        key={date.toISOString()}
                        className={`px-3 py-1 rounded-lg cursor-pointer m-0 ${selectedDate?.toDateString() === date.toDateString()
                            ? "bg-yellow-300 text-white"
                            : "bg-white text-gray-700 border-yellow-300 border-2"
                            }`}
                        onClick={() => handleDateClick(date)}
                    >
                        <div className="font-bold m-0 text-sm">{date.getDate()}</div>
                        <div className="m-0 text-sm">{date.toLocaleString("default", { weekday: "short" })}</div>
                        <div className="m-0 text-sm">{date.toLocaleString("default", { month: "short" })}</div>
                    </div>
                ))}
            </div>

            {/* Slot selection UI */}
            <div>
                <h3 className="text-lg font-semibold">
                    Available Slots for {selectedDate?.toLocaleDateString()}
                </h3>
                <ul className="mt-2 flex justify-start space-x-4 flex-wrap">
                    {slots.length > 0 ? (
                        slots.map((slot, index) => (
                            <li
                                key={index}
                                className={`border p-2 rounded-md mb-1 cursor-pointer ${slot.isBooked ? "bg-red-500 text-white" : ""} ${selectedSlot === slot.time && !slot.isBooked ? "bg-yellow-300 text-white" : ""}`}
                                onClick={() => handleSlotClick(slot)}  // Set selected slot
                            >
                                {slot.time}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">No slots available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};


const ProductPreviews = ({ previews }) => {
    const [index, setIndex] = useState(0);

    return (
        <Fragment>
            <div className="p-4">
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
                                    className="w-24 h-24 inline-flex justify-center items-center bg-yellow-30 dark:bg-slate-800 border border-yellow-300 dark:border-yellow-300 dark:border-opacity-20 rounded-lg mr-2.5 p-2"
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

ProductPreviews.propTypes = {
    previews: PropTypes.array.isRequired,
};
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import TurfCard from "@/components/customer/savedturfcard";
const LivePortal = () => {
    const [turf, setTurf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const { id } = useParams();
    const [data, setdata] = useState(null)
    const [similarTurfs, setSimilarTurfs] = useState([]);

    const fetchSimilarTurfs = async () => {
        try {
            const response = await axios.get(`/api/similar-turfs/${id}`);

            const similarTurfIds = response.data.map((item) => item.id);
            const allTurfsResponse = await axios.get(`/api/turf`);
            const allTurfs = allTurfsResponse.data;

            // Filter turfs that match similar turf IDs
            const filteredSimilarTurfs = allTurfs.filter((turf) =>
                similarTurfIds.includes(turf._id)
            );

            setSimilarTurfs(filteredSimilarTurfs);
        } catch (error) {
            console.error("Error fetching similar turfs:", error);
        }
    };

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
    const handleSaveTurf = async () => {
        try {
            const response = await axios.post('/api/save', {
                userId: data._id,
                turfId: id,
            });

            if (response.status === 200) {
                toast.success(response.data.message); // Display success message
            } else if (response.data.message === 'Turf already saved.') {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log('Error saving turf:', error);
        }
    };
    useEffect(() => {
        const fetchTurf = async () => {
            try {
                const response = await fetch(`/api/turf/${id}`);
                if (!response.ok) throw new Error('Failed to fetch turf');
                const data = await response.json();
                setTurf(data.data);
                await fetchSimilarTurfs();

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
                                <a href="#!" className="text-yellow-300 font-medium ml-1">
                                    Reviews
                                </a>
                            </p>
                            <h3 className="text-2xl text-yellow-300 font-medium">
                                Rs. {turf.pricePerHour} per hour
                            </h3>
                        </div>

                        <form action="#!">
                            <div className="mb-6">
                                <h5 className="font-medium mb-2">Amenities</h5>
                                <div className="flex flex-wrap gap-2">
                                    {turf.amenities.map((amenity) => (
                                        <span key={amenity} className="px-3 py-1 bg-yellow-50 text-yellow-300 rounded-md">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h5 className="font-medium mb-2">Description</h5>
                                <p className="text-gray-600">{turf.description}</p>
                            </div>

                            <DatePickerWithSlots
                                availableSlots={turf.availableSlots} // Update to use availableSlots
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                setSelectedSlot={setSelectedSlot}
                                selectedSlot={selectedSlot}
                            />

                            <div className="flex items-center justify-between mt-6">
                                <div className="flex  my-7 items-start">
                                    {selectedDate && selectedSlot ? (
                                        <button
                                            type="button"
                                            className="bg-yellow-300 text-white rounded uppercase hover:bg-opacity-90 px-6 py-2.5 mr-2"
                                        >
                                            <Link
                                                href={{
                                                    pathname: "/customer/book",
                                                    query: {
                                                        turfId: turf._id,
                                                        selectedDate: selectedDate.toISOString(),
                                                        selectedSlot,
                                                        pricePerHour: turf.pricePerHour
                                                    }
                                                }}
                                            >
                                                Book Now
                                            </Link>
                                        </button>
                                    ) : (
                                        <div className=" "
                                        >
                                            <button
                                                type="button"
                                                className="bg-yellow-300 text-white rounded uppercase hover:bg-opacity-90 px-6 py-2.5 mr-2"
                                            >
                                                Book Now
                                            </button>

                                            <p
                                                className=" text-red-600 rounded  hover:bg-opacity-90 "

                                            >
                                                Select Date and Slot
                                            </p>
                                        </div>
                                    )}

                                    <button className="bg-yellow-300 text-white rounded text-xl hover:bg-opacity-90 py-2 px-3 mr-2" onClick={handleSaveTurf}>
                                        <FontAwesomeIcon icon={faHeart} />
                                    </button>
                                    <button className="hover:bg-yellow-300 rounded hover:bg-opacity-10 text-yellow-300 px-3 py-2">
                                        <FontAwesomeIcon icon={faShareAlt} /> Share
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Similar Turfs Section */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4">Similar Turfs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                        {similarTurfs.length > 0 ? (
                            similarTurfs.map((similarTurf) => (
                                <TurfCard turf={similarTurf} />
                            ))
                        ) : (
                            <p>No similar turfs available.</p>
                        )}
                    </div>
                </div>
                <div className="my-12">
                    <ReviewComponent turfId={id} />
                </div>
            </div>
        </section>
    );
};

export default LivePortal;
