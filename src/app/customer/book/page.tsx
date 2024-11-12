"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import Script from "next/script";
import toast from "react-hot-toast";

const ConfirmationPage = () => {
    const [turfDetails, setTurfDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Added state for user data
    const searchParams = useSearchParams();
    const turfId = searchParams.get("turfId");
    const selectedDate = searchParams.get("selectedDate");
    const selectedSlot = searchParams.get("selectedSlot");
    const pricePerHour = parseFloat(searchParams.get("pricePerHour") || "0");
    const duration = parseInt(searchParams.get("duration") || "1");
    const totalCost = pricePerHour * duration;
    const handleLockSlot = async (slot) => {


    };
    const createOrder = async () => {
        try {
            // Await handleLockSlot to ensure it completes before proceeding

            const res = await fetch("/api/createOrder", {
                method: "POST",
                body: JSON.stringify({ amount: totalCost * 100 }),
            });
            const data = await res.json();

            const paymentData = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                order_id: data.id,

                handler: async function (response) {
                    // verify payment
                    const res = await fetch("/api/verifyOrder", {
                        method: "POST",
                        body: JSON.stringify({
                            orderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });
                    const data = await res.json();

                    if (data.isOk) {
                        toast.success("Payment successful");
                        handleProceedToPayment();
                    } else {
                        toast.error("Payment failed");
                        // Unlock the slot if payment failed

                    }
                },
            };

            const payment = new (window).Razorpay(paymentData);
            payment.open();
        } catch (error) {
            console.error("Error in createOrder:", error);
            toast.error("Failed to create order.");
        }
    };


    useEffect(() => {
        const fetchTurfDetails = async () => {
            try {
                const response = await fetch(`/api/turf/${turfId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch turf details");
                }
                const data = await response.json();
                setTurfDetails(data.data);
            } catch (error) {
                console.error("Error fetching turf details:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserData = async () => {
            try {
                const res = await axios.get('/api/users/getuser');
                setUser(res.data.data); // Save user data
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (turfId) {
            fetchTurfDetails();
            fetchUserData();
        }
    }, [turfId]);

    const handleProceedToPayment = async () => {


        if (user) {
            const bookingData = {
                user: user._id, // Use user data if available
                turfId,
                selectedDate,
                selectedSlot,
                totalCost,
                numberOfPlayers: 10, // Replace with actual value
            };

            try {
                const res = await fetch(`/api/book`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bookingData),
                });

                if (res.ok) {
                    const data = await res.json();
                    toast.success(data.message);
                } else {
                    toast.error("Payment failed or booking creation failed.");
                }
            } catch (error) {
                console.error("Error processing payment:", error);
                toast.error("An error occurred during the payment process.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!turfDetails) return <div>Turf details not found</div>;
    const redirectToPage = () => {
        window.location.href = '/customer/turf'; // Full-page reload navigation
    };
    return (
        <section className="py-14 md:py-24 bg-white dark:bg-[#0b1727] text-zinc-900 dark:text-white relative overflow-hidden z-10">
            <Script type="text/javascript" src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="container px-4 mx-auto">
                <div className="flex flex-wrap gap-8 lg:justify-center sm:justify-start ">
                    <div className="md:col-span-1 w-60 h-60">
                        <img
                            src={turfDetails.images[0]}
                            alt={turfDetails.name}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                    </div>
                    <div className="flex flex-col justify-start lg:w-3/5 sm:w-3/4">
                        <h1 className="text-3xl leading-none md:text-4xl font-bold mb-4 text-yellow-400">
                            Booking Invoice
                        </h1>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                            <p className="opacity-70 mb-4 text-lg">
                                <strong>Turf Name:</strong> {turfDetails.name}
                            </p>
                            <p className="opacity-70 mb-4 text-lg">
                                <strong>Location:</strong> {turfDetails.city}
                            </p>
                            <p className="opacity-70 mb-4 text-lg">
                                <strong>Date:</strong>{" "}
                                {new Date(selectedDate).toLocaleDateString()}
                            </p>
                            <p className="opacity-70 mb-4 text-lg">
                                <strong>Time Slot:</strong> {selectedSlot}
                            </p>

                            <div className="border-t border-gray-300 dark:border-gray-700 my-4"></div>

                            <div className="flex justify-between text-lg mb-3">
                                <span>Price per Hour:</span>
                                <span>Rs. {pricePerHour.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg mb-3">
                                <span>Duration:</span>
                                <span>{duration} hour(s)</span>
                            </div>

                            <div className="border-t border-gray-300 dark:border-gray-700 my-4"></div>

                            <div className="flex justify-between text-xl font-bold">
                                <span>Total Cost:</span>
                                <span>Rs. {totalCost.toFixed(2)}</span>
                            </div>

                            <div className="opacity-70 mt-4 text-sm">
                                <p><strong>Dimensions:</strong> {turfDetails.dimensions.width} x {turfDetails.dimensions.length} meters</p>
                                <p><strong>Amenities:</strong> {turfDetails.amenities.join(", ")}</p>
                            </div>
                        </div>

                        <div className="flex items-center mt-7">
                            <button
                                className="bg-yellow-300 text-black rounded uppercase hover:bg-opacity-90 px-6 py-2.5 mr-4 font-medium"
                                onClick={createOrder}
                            >
                                Proceed to Payment
                            </button>
                            <button className="bg-gray-300 text-black rounded uppercase hover:bg-opacity-90 px-6 py-2.5 font-medium" onClick={redirectToPage}>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConfirmationPage;
