"use client";
import Link from "next/link";
import { XIcon } from "@heroicons/react/solid"; // For the cross icon
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";

export default function AddPage() {
    const router = useRouter();
    const [turf, setTurf] = React.useState({
        name: "",
        owner: "", // Assuming the owner is provided somehow or handled on the backend
        description: "",
        pricePerHour: "",
        city: "",
        dimensions: { length: "", width: "" },
        locationCoordinates: { latitude: "", longitude: "" },
        amenities: "",
        turfCategory: "",
        images: [] as string[], // Make images an array
    });
    const [imageUrl, setImageUrl] = React.useState("");
    const [id,setId]=React.useState("");
    useEffect(() =>{
        const fetchId=async() =>{
            const res = await axios.get('/api/users/getuser');
            setId(res.data.data._id);
        }
        fetchId();
    },[])
    interface Slot {
        date: string; // add this line for date
        startTime: string;
        endTime: string;
        maxPlayers: number;
        isBooked: boolean;
        status: "locked" | "unlocked"; // include the status as specified
    }

    const [slot, setSlot] = React.useState<Slot>({
        date: "",
        startTime: "",
        endTime: "",
        maxPlayers: 0,
        isBooked: false,
        status: "unlocked"
    });
    const [slots, setSlots] = React.useState<Slot[]>([]);

    const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setSlot({
            ...slot,
            [name]: type === "checkbox" ? checked : value,
        });
    };
    const removeSlot = (index: number) => {
        setSlots(slots.filter((_, i) => i !== index));
    };
    const removeImage = (url) => {
        setTurf((prev) => ({
            ...prev,
            images: prev.images.filter((image) => image !== url)
        }));
    };
    const addSlot = (): void => {
        if (!slot.startTime || !slot.endTime || !slot.maxPlayers) {
            alert("Please provide start time, end time, and max players for the slot.");
            return;
        }
        setSlots((prevSlots) => [...prevSlots, slot]);
        
        // Reset slot to include date and status
        setSlot({
            date: "",                // Reset date to an empty string
            startTime: "",           // Reset start time
            endTime: "",             // Reset end time
            maxPlayers: 0,           // Reset max players
            isBooked: false,         // Reset booking status
            status: "unlocked",      // Reset status to "unlocked"
        });
    };
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            ...turf,
            owner:id,
            dimensions: { length: Number(turf.dimensions.length), width: Number(turf.dimensions.width) },
            locationCoordinates: {
                type: "Point",
                coordinates: [Number(turf.locationCoordinates.latitude), Number(turf.locationCoordinates.longitude)],
            },
            images: turf.images,
            availableSlots: slots.map((slot) => ({
                date: new Date(slot.date), // Convert date string to Date object
                slots: [{ startTime: slot.startTime, endTime: slot.endTime, maxPlayers: slot.maxPlayers, isBooked: slot.isBooked, status: slot.status }]
            })),
        };


        try {
            const response = await axios.post("/api/admin/add", payload);
            console.log("Turf Added", response.data);
            toast.success("Turf added successfully");
            window.location.href =  '/admin/home' ;
        } catch (error: any) {
            console.log("Turf failed to add", error.message);
            toast.error(error.message);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Add new turf details</h2>
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" onChange={(e) => setTurf({ ...turf, name: e.target.value })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="description">Description</label>
                    <input id="description" type="text" onChange={(e) => setTurf({ ...turf, description: e.target.value })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="pricePerHour">Price per Hour</label>
                    <input id="pricePerHour" type="number" onChange={(e) => setTurf({ ...turf, pricePerHour: e.target.value })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="city">City</label>
                    <input id="city" type="text" onChange={(e) => setTurf({ ...turf, city: e.target.value })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="amenities">Amenities (comma-separated)</label>
                    <input id="amenities" type="text" onChange={(e) => setTurf({ ...turf, amenities: e.target.value })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="turfCategory">Category</label>
                    <input id="turfCategory" type="text" onChange={(e) => setTurf({ ...turf, turfCategory: e.target.value })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="dimensionsLength">Length</label>
                    <input id="dimensionsLength" type="number" onChange={(e) => setTurf({ ...turf, dimensions: { ...turf.dimensions, length: e.target.value } })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="dimensionsWidth">Width</label>
                    <input id="dimensionsWidth" type="number" onChange={(e) => setTurf({ ...turf, dimensions: { ...turf.dimensions, width: e.target.value } })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="latitude">Latitude</label>
                    <input id="latitude" type="number" onChange={(e) => setTurf({ ...turf, locationCoordinates: { ...turf.locationCoordinates, latitude: e.target.value } })} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <label htmlFor="longitude">Longitude</label>
                    <input id="longitude" type="number" onChange={(e) => setTurf({ ...turf, locationCoordinates: { ...turf.locationCoordinates, longitude: e.target.value } })} />
                </LabelInputContainer>

                {/* Upload Component */}
                <UploadDropzone
    endpoint="imageUploader"
    onClientUploadComplete={(res) => {
        if (res && res.length > 0) {
            setTurf((prevTurf) => ({
                ...prevTurf,
                images: [...prevTurf.images, ...res.map((file) => file.url)], // Append new images to the array
            }));
            toast.success("Upload Completed");
        }
    }}
/>

                {/* Display Images with Remove Option */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {turf.images.map((url, index) => (
                        <div key={index} className="relative w-full h-32">
                            <Image src={url} alt={`Turf Image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-lg" />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-600 rounded-full p-1"
                                onClick={() => removeImage(url)}
                            >
                                <XIcon className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Slot input Container */}
                <div className="mb-4">
                    <h3 className="font-medium text-lg mb-2">Add Slot</h3>
                    <LabelInputContainer>
                        <label htmlFor="date">Date</label>
                        <input id="date" name="date" type="date" value={slot.date} onChange={handleSlotChange} />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <label htmlFor="startTime">Start Time</label>
                        <input id="startTime" name="startTime" type="time" value={slot.startTime} onChange={handleSlotChange} />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <label htmlFor="endTime">End Time</label>
                        <input id="endTime" name="endTime" type="time" value={slot.endTime} onChange={handleSlotChange} />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <label htmlFor="maxPlayers">Max Players</label>
                        <input id="maxPlayers" name="maxPlayers" type="number" value={slot.maxPlayers} onChange={handleSlotChange} />
                    </LabelInputContainer>
                    <button type="button" onClick={addSlot} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Slot</button>
                </div>
                 {/* Display Added Slots */}
                 <div className="mt-6">
    <h3 className="font-medium text-lg mb-2">Available Slots</h3>
    <ul className="space-y-4">
        {slots.map((slot, index) => (
            <li key={index} className="p-4 border rounded-md relative">
                <p><strong>Date:</strong> {slot.date}</p>
                <p><strong>Start Time:</strong> {slot.startTime}</p>
                <p><strong>End Time:</strong> {slot.endTime}</p>
                <p><strong>Max Players:</strong> {slot.maxPlayers}</p>
                <p><strong>Status:</strong> {slot.isBooked ? "Booked" : "Available"} - {slot.status}</p>
                
                {/* Remove button */}
                <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                    onClick={() => removeSlot(index)}
                >
                    <XIcon className="h-5 w-5 text-white" />
                </button>
            </li>
        ))}
    </ul>
</div>

                <button className="bg-gradient-to-br from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium" type="submit">Add &rarr;</button>
            </form>
        </div>
    );
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string; }) => (
    <div className="flex flex-col space-y-2 w-full">{children}</div>
);
