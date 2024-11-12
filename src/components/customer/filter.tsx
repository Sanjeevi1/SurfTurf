import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

const TurfFilter = ({ onFilter }) => {
    const [filters, setFilters] = useState({
        name: '',
        city: '',
        minPrice: null,
        maxPrice: null,
        dimensions: '',
        amenities: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleAmenityChange = (amenity) => {
        setFilters((prev) => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter((item) => item !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-md shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Filter Turfs</h2>

            <div>
                <label className="block mb-2 font-medium">Turf Name</label>
                <InputText
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                    placeholder="Enter turf name"
                    className="w-full"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">City</label>
                <InputText
                    name="city"
                    value={filters.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">Price Range</label>
                <div className="flex space-x-2">
                    <InputNumber
                        name="minPrice"
                        value={filters.minPrice}
                        onValueChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.value }))}
                        placeholder="Min Price"
                        className="w-full"
                    />
                    <InputNumber
                        name="maxPrice"
                        value={filters.maxPrice}
                        onValueChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.value }))}
                        placeholder="Max Price"
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block mb-2 font-medium">Dimensions</label>
                <InputText
                    name="dimensions"
                    value={filters.dimensions}
                    onChange={handleChange}
                    placeholder="Enter dimensions"
                    className="w-full"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">Amenities</label>
                <div className="flex flex-col space-y-2">
                    {['WiFi', 'Parking', 'Restrooms', 'Lighting'].map((amenity) => (
                        <div key={amenity} className="flex items-center">
                            <Checkbox
                                inputId={amenity}
                                checked={filters.amenities.includes(amenity)}
                                onChange={() => handleAmenityChange(amenity)}
                                className="mr-2"
                            />
                            <label htmlFor={amenity}>{amenity}</label>
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" label="Filter Turfs" icon="pi pi-filter" className="mt-4" />
        </form>
    );
};

export default TurfFilter;
