'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const BookingPreview = ({ booking, onClick }) => {
    return (
        <div
            className="grid grid-cols-12 gap-4 p-4 border dark:border-yellow-300 rounded-lg mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={onClick}
        >
            <div className="col-span-12 md:col-span-4">
                {booking.turfDetails.images.length > 0 && (
                    <img
                        src={booking.turfDetails.images[0]}
                        alt={booking.turfDetails.name}
                        className="rounded-lg max-w-full h-auto"
                    />
                )}
            </div>
            <div className="col-span-12 md:col-span-8 flex flex-col justify-between">
                <div>
                    <h4 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 hover:text-blue-600">
                        {booking.turfDetails.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                        {booking.turfDetails.description}
                    </p>
                    <div className="flex items-center mb-2">
                        <FaMapMarkerAlt className="mr-2 text-yellow-300" />
                        <span className="font-medium text-zinc-900 dark:text-white">
                            {booking.turfDetails.city}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-yellow-300" />
                        <span className="font-medium text-zinc-900 dark:text-white">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="mt-4">
                    <span className="block text-sm font-medium text-zinc-900 dark:text-white">
                        Players: {booking.numberOfPlayers}
                    </span>
                    <span className="block text-sm font-medium text-zinc-900 dark:text-white">
                        Total: ${booking.totalPrice}
                    </span>
                </div>
            </div>
        </div>
    );
};


BookingPreview.propTypes = {
    booking: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

const ProgressBar = () => {
    const progressBardetails = [
        // { value: "1", active: true },
        // { value: "2", active: false },
        // { value: "3", active: false }
    ];

    return (
        <div className="col-span-12">
            <div className="flex items-center justify-between relative mb-12">
                {/* <div className="absolute top-5 right-0 left-0 border-t-2 border-dashed dark:border-yellow-300"></div> */}
                {progressBardetails.map((item, i) => (
                    <span
                        className={`relative w-10 h-10 shadow flex justify-center items-center text-lg z-20 cursor-pointer rounded-full border ${item.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 dark:bg-yellow-300 dark:border-yellow-3 00'
                            }`}
                        key={i}
                    >
                        {item.value}
                    </span>
                ))}
            </div>
        </div>
    );
};

const TurfDetails = ({ turf, booking }) => (
    <div className="grid grid-cols-12 gap-6 p-4 border dark:border-yellow-300 rounded">
        <div className="col-span-12 md:col-span-5">
            {turf.images.length > 0 && (
                <img src={turf.images[0]} alt="Turf" className="rounded max-w-full h-auto" />
            )}
        </div>
        <div className="col-span-12 md:col-span-7 flex flex-col justify-center">
            <h5 className="text-xl font-medium mb-2 hover:text-blue-600">{turf.name}</h5>
            <p className="text-lg mb-4">{turf.description}</p>
            <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2 text-yellow-300" />
                <span className="font-medium">Location: {turf.city}</span>
            </div>
            <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-yellow-300" />
                <span className="font-medium">Date: {new Date(booking.bookingDate).toLocaleDateString()}</span>
            </div>
        </div>
    </div>
);

TurfDetails.propTypes = {
    turf: PropTypes.object.isRequired,
    booking: PropTypes.object.isRequired
};

const Invoice = ({ booking }) => {
    const payments = [
        { label: "Slot Date", value: new Date(booking.bookingDate).toLocaleDateString() },
        { label: "Slot Time", value: `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}` },
        { label: "Players", value: `${booking.numberOfPlayers}` },
        { label: "Total", value: `$${booking.totalPrice}` }
    ];

    return (
        <div className="bg-gray-100 dark:bg-yellow-300 p-6 lg:p-12 rounded-md">
            <h4 className="text-2xl font-medium mb-12">Invoice</h4>
            <div className="grid grid-cols-3 gap-6">
                {payments.map((item, i) => (
                    <Fragment key={i}>
                        {!!i && <hr className="col-span-3 my-0 dark:border-yellow-300" />}
                        <div className="col-span-2">
                            <h6 className="font-medium">{item.label}</h6>
                        </div>
                        <div className="col-span-1">
                            <p className="font-medium">{item.value}</p>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    );
};

Invoice.propTypes = {
    booking: PropTypes.object.isRequired
};

const OrderSummary = ({ turf, booking }) => {
    return (
        <section className="py-14 md:py-24 bg-white dark:bg-yellow-300 text-zinc-900 dark:text-white relative overflow-hidden z-10">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-6">
                        <TurfDetails turf={turf} booking={booking} />
                    </div>
                    <div className="col-span-12 md:col-span-6 xl:col-span-5 xl:col-start-8">
                        <Invoice booking={booking} />
                    </div>
                </div>
            </div>
        </section>
    );
};

OrderSummary.propTypes = {
    turf: PropTypes.object.isRequired,
    booking: PropTypes.object.isRequired
};

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get('/api/users/getuser');
                const id = res.data.data._id;
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                });
                const data = await response.json();

                if (data.success) {
                    const bookingsWithTurfDetails = await Promise.all(
                        data.data.map(async (booking) => {
                            const turfResponse = await fetch(`/api/turf/${booking.turf}`);
                            const turfData = await turfResponse.json();
                            return { ...booking, turfDetails: turfData.data };
                        })
                    );
                    setBookings(bookingsWithTurfDetails);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [id]);

    if (loading) return <div className="text-center p-6">Loading...</div>;
    if (error) return <p className="text-red-500 text-center">Error fetching bookings: {error}</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-yellow-300 mb-6">My Bookings</h3>
            {selectedBooking ? (
                <>
                    <button
                        onClick={() => setSelectedBooking(null)}
                        className={` px-4 py-2 bg-yellow-300 text-white rounded-lg hover:bg-yellow-700 transition  `}
                    >
                        &larr; Go Back to All Bookings
                    </button>
                    <OrderSummary booking={selectedBooking} turf={selectedBooking.turfDetails} />
                </>
            ) : (
                <div>
                    {bookings.length === 0 ? (
                        <p className="text-black text-center">No bookings found.</p>
                    ) : (
                        bookings.map((booking) => (
                            <BookingPreview
                                key={booking._id}
                                booking={booking}
                                onClick={() => setSelectedBooking(booking)}
                            />
                        ))
                    )}
                </div>
            )}

        </div>
    );
};

export default UserBookings;
