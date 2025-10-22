import React, { useState, useEffect } from "react";

// DatePickerWithSlots component that works with available slots from the fetched turf data
const DatePickerWithSlots = ({
    availableSlots,
    selectedDate,
    setSelectedDate,
    setSelectedSlot
}: {
    availableSlots: any[];
    selectedDate: string | null;
    setSelectedDate: (date: string | null) => void;
    setSelectedSlot: (slot: any) => void;
}) => {
    const [slots, setSlots] = useState<string[]>([]);

    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
    });

    // Extract slots for a specific date from availableSlots
    const fetchSlotsForDate = async (date: Date) => {
        const dateString = date.toISOString().split("T")[0];
        const matchingSlot = availableSlots?.find((slot: any) => 
            new Date(slot.date).toISOString().split("T")[0] === dateString
        );
        if (matchingSlot) {
            return matchingSlot.slots?.map(
                (timeSlot: any) =>
                    `${timeSlot.startTime} - ${timeSlot.endTime} `
            ) || [];
        }
        return [];
    };

    // Fetch slots for the selected date when the component loads or when selectedDate changes
    useEffect(() => {
        if (selectedDate) {
            const date = new Date(selectedDate);
            loadSlots(date);
        }
    }, [selectedDate, availableSlots]);

    const loadSlots = async (date: Date) => {
        const fetchedSlots = await fetchSlotsForDate(date);
        setSlots(fetchedSlots);
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date.toISOString().split("T")[0]);  // Update the selected date in the parent
        loadSlots(date);  // Load the slots for the newly selected date
    };

    const handleSlotClick = (slot: string) => {
        setSelectedSlot(slot);  // Update the selected slot in the parent
    };

    return (
        <div>
            {/* Date picker UI */}
            <div className="flex space-x-4 mb-4">
                {dates.map((date) => (
                    <div
                        key={date.toISOString()}
                        className={`px-3 py-1 rounded-lg cursor-pointer m-0 ${selectedDate === date.toISOString().split("T")[0]
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border-blue-600 border-2"
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
                    Available Slots for {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Select a date'}
                </h3>
                <ul className="mt-2 flex justify-start space-x-4">
                    {slots.length > 0 ? (
                        slots.map((slot, index) => (
                            <li
                                key={index}
                                className="border p-2 rounded-md mb-1 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSlotClick(slot)}  // Set selected slot
                            >
                                {slot}
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

export default DatePickerWithSlots;
