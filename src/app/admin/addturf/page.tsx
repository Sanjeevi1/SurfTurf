"use client";
import Link from "next/link";
import { XIcon } from "@heroicons/react/solid";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { 
    MapPin, 
    Clock, 
    Users, 
    DollarSign, 
    Image as ImageIcon, 
    Plus, 
    Trash2,
    ArrowLeft,
    Save
} from "lucide-react";
import PageLayout from '@/components/ui/PageLayout';
import { 
    validateRequired, 
    validatePositiveNumber, 
    validateTextLength, 
    validateLatitude, 
    validateLongitude, 
    validateImages, 
    validateSlot,
    ValidationError 
} from "@/utils/validation";

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
    const [errors, setErrors] = React.useState<ValidationError[]>([]);
    
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
        const { name, value, type } = e.target;
        setSlot({
            ...slot,
            [name]: value,
        });
    };
    const removeSlot = (index: number) => {
        setSlots(slots.filter((_, i) => i !== index));
    };
    const removeImage = (url: string) => {
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
    

    const validateForm = () => {
        const newErrors: ValidationError[] = [];
        
        // Validate basic fields
        const nameError = validateRequired(turf.name, "Turf name");
        if (nameError) newErrors.push({ field: 'name', message: nameError });
        
        const cityError = validateRequired(turf.city, "City");
        if (cityError) newErrors.push({ field: 'city', message: cityError });
        
        const descriptionError = validateTextLength(turf.description, "Description", 10, 500);
        if (descriptionError) newErrors.push({ field: 'description', message: descriptionError });
        
        const priceError = validatePositiveNumber(turf.pricePerHour, "Price per hour");
        if (priceError) newErrors.push({ field: 'pricePerHour', message: priceError });
        
        const categoryError = validateRequired(turf.turfCategory, "Category");
        if (categoryError) newErrors.push({ field: 'turfCategory', message: categoryError });
        
        const amenitiesError = validateRequired(turf.amenities, "Amenities");
        if (amenitiesError) newErrors.push({ field: 'amenities', message: amenitiesError });
        
        // Validate dimensions
        const lengthError = validatePositiveNumber(turf.dimensions.length, "Length");
        if (lengthError) newErrors.push({ field: 'dimensionsLength', message: lengthError });
        
        const widthError = validatePositiveNumber(turf.dimensions.width, "Width");
        if (widthError) newErrors.push({ field: 'dimensionsWidth', message: widthError });
        
        // Validate coordinates
        const latError = validateLatitude(turf.locationCoordinates.latitude);
        if (latError) newErrors.push({ field: 'latitude', message: latError });
        
        const lngError = validateLongitude(turf.locationCoordinates.longitude);
        if (lngError) newErrors.push({ field: 'longitude', message: lngError });
        
        // Validate images
        const imagesError = validateImages(turf.images);
        if (imagesError) newErrors.push({ field: 'images', message: imagesError });
        
        // Validate slots
        if (slots.length === 0) {
            newErrors.push({ field: 'slots', message: "At least one time slot is required" });
        } else {
            slots.forEach((slot, index) => {
                const slotError = validateSlot(slot);
                if (slotError) {
                    newErrors.push({ field: `slot_${index}`, message: `Slot ${index + 1}: ${slotError}` });
                }
            });
        }
        
        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the validation errors');
            return;
        }
        
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
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link 
                            href="/admin/home"
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Turf</h1>
                    <p className="text-gray-600">Create a new turf listing for your business</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                            Basic Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Turf Name *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter turf name"
                                    value={turf.name}
                                    onChange={(e) => setTurf({ ...turf, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'name') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.find(e => e.field === 'name') && (
                                    <span className="text-red-500 text-sm">{errors.find(e => e.field === 'name')?.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                                    City *
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    placeholder="Enter city"
                                    value={turf.city}
                                    onChange={(e) => setTurf({ ...turf, city: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'city') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.find(e => e.field === 'city') && (
                                    <span className="text-red-500 text-sm">{errors.find(e => e.field === 'city')?.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="turfCategory" className="text-sm font-medium text-gray-700">
                                    Category *
                                </label>
                                <select
                                    id="turfCategory"
                                    value={turf.turfCategory}
                                    onChange={(e) => setTurf({ ...turf, turfCategory: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Football">Football</option>
                                    <option value="Cricket">Cricket</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Tennis">Tennis</option>
                                    <option value="Badminton">Badminton</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="pricePerHour" className="text-sm font-medium text-gray-700 flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Price per Hour (₹) *
                                </label>
                                <input
                                    id="pricePerHour"
                                    type="number"
                                    placeholder="Enter price per hour"
                                    value={turf.pricePerHour}
                                    onChange={(e) => setTurf({ ...turf, pricePerHour: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'pricePerHour') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.find(e => e.field === 'pricePerHour') && (
                                    <span className="text-red-500 text-sm">{errors.find(e => e.field === 'pricePerHour')?.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                placeholder="Describe your turf, facilities, and what makes it special..."
                                value={turf.description}
                                onChange={(e) => setTurf({ ...turf, description: e.target.value })}
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                                    errors.find(e => e.field === 'description') ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.find(e => e.field === 'description') && (
                                <span className="text-red-500 text-sm">{errors.find(e => e.field === 'description')?.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Dimensions & Location */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-green-600" />
                            Dimensions & Location
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="dimensionsLength" className="text-sm font-medium text-gray-700">
                                    Length (meters) *
                                </label>
                                <input
                                    id="dimensionsLength"
                                    type="number"
                                    placeholder="Enter length"
                                    value={turf.dimensions.length}
                                    onChange={(e) => setTurf({ ...turf, dimensions: { ...turf.dimensions, length: e.target.value } })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'dimensionsLength') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.find(e => e.field === 'dimensionsLength') && (
                                    <span className="text-red-500 text-sm">{errors.find(e => e.field === 'dimensionsLength')?.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="dimensionsWidth" className="text-sm font-medium text-gray-700">
                                    Width (meters) *
                                </label>
                                <input
                                    id="dimensionsWidth"
                                    type="number"
                                    placeholder="Enter width"
                                    value={turf.dimensions.width}
                                    onChange={(e) => setTurf({ ...turf, dimensions: { ...turf.dimensions, width: e.target.value } })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'dimensionsWidth') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.find(e => e.field === 'dimensionsWidth') && (
                                    <span className="text-red-500 text-sm">{errors.find(e => e.field === 'dimensionsWidth')?.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                                    Latitude *
                                </label>
                                <input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    placeholder="Enter latitude"
                                    value={turf.locationCoordinates.latitude}
                                    onChange={(e) => setTurf({ ...turf, locationCoordinates: { ...turf.locationCoordinates, latitude: e.target.value } })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'latitude') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.find(e => e.field === 'latitude') && (
                                    <span className="text-red-500 text-sm">{errors.find(e => e.field === 'latitude')?.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                                    Longitude *
                                </label>
                                <input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    placeholder="Enter longitude"
                                    value={turf.locationCoordinates.longitude}
                                    onChange={(e) => setTurf({ ...turf, locationCoordinates: { ...turf.locationCoordinates, longitude: e.target.value } })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.find(e => e.field === 'longitude') ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.find(e => e.field === 'longitude') && (
                                    <span className="text-red-500 text-sm">{errors.find(e => e.field === 'longitude')?.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-purple-600" />
                            Amenities
                        </h2>
                        
                        <div className="space-y-2">
                            <label htmlFor="amenities" className="text-sm font-medium text-gray-700">
                                Amenities (comma-separated) *
                            </label>
                            <input
                                id="amenities"
                                type="text"
                                placeholder="e.g., Parking, Restroom, Changing Room, Floodlights"
                                value={turf.amenities}
                                onChange={(e) => setTurf({ ...turf, amenities: e.target.value })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors.find(e => e.field === 'amenities') ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {errors.find(e => e.field === 'amenities') && (
                                <span className="text-red-500 text-sm">{errors.find(e => e.field === 'amenities')?.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <ImageIcon className="h-5 w-5 mr-2 text-orange-600" />
                            Turf Images
                        </h2>
                        
                <UploadDropzone
    endpoint="imageUploader"
    onClientUploadComplete={(res) => {
        if (res && res.length > 0) {
            setTurf((prevTurf) => ({
                ...prevTurf,
                                        images: [...prevTurf.images, ...res.map((file) => file.url)],
            }));
                                    toast.success("Images uploaded successfully!");
        }
    }}
/>
                        {errors.find(e => e.field === 'images') && (
                            <div className="mt-2">
                                <span className="text-red-500 text-sm">{errors.find(e => e.field === 'images')?.message}</span>
                            </div>
                        )}

                        {/* Display Images */}
                        {turf.images.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {turf.images.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square rounded-lg overflow-hidden">
                                                <Image 
                                                    src={url} 
                                                    alt={`Turf Image ${index + 1}`} 
                                                    width={200} 
                                                    height={200} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                            <button
                                type="button"
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(url)}
                            >
                                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Time Slots */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                            Available Time Slots
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="space-y-2">
                                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                                    Date *
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={slot.date}
                                    onChange={handleSlotChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                                    Start Time *
                                </label>
                                <input
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    value={slot.startTime}
                                    onChange={handleSlotChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                                    End Time *
                                </label>
                                <input
                                    id="endTime"
                                    name="endTime"
                                    type="time"
                                    value={slot.endTime}
                                    onChange={handleSlotChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                </div>

                            <div className="space-y-2">
                                <label htmlFor="maxPlayers" className="text-sm font-medium text-gray-700 flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    Max Players *
                                </label>
                                <input
                                    id="maxPlayers"
                                    name="maxPlayers"
                                    type="number"
                                    value={slot.maxPlayers}
                                    onChange={handleSlotChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                </div>

                        <button
                            type="button"
                            onClick={addSlot}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Time Slot
                        </button>
                        
                        {errors.find(e => e.field === 'slots') && (
                            <div className="mt-2">
                                <span className="text-red-500 text-sm">{errors.find(e => e.field === 'slots')?.message}</span>
                            </div>
                        )}

                 {/* Display Added Slots */}
                        {slots.length > 0 && (
                 <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Added Time Slots</h3>
                                <div className="space-y-3">
        {slots.map((slot, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <span className="font-medium">{slot.date}</span>
                                                    <span className="text-gray-500">{slot.startTime} - {slot.endTime}</span>
                                                    <span className="text-gray-500">{slot.maxPlayers} players</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        slot.status === 'unlocked' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {slot.status}
                                                    </span>
                                                </div>
                                            </div>
                <button
                    type="button"
                                                className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => removeSlot(index)}
                >
                                                <Trash2 className="h-4 w-4" />
                </button>
                                        </div>
        ))}
                                </div>
                            </div>
                        )}
</div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Link
                            href="/admin/home"
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Create Turf
                        </button>
                    </div>
            </form>
            </div>
        </div>
    );
}

