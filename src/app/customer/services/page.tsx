"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFootball, 
    faBasketball, 
    faTableTennis, 
    faVolleyball, 
    faSwimming, 
    faDumbbell,
    faUsers,
    faClock,
    faShield,
    faWifi,
    faCar,
    faShower,
    faUtensils,
    faParking,
    faStar
} from '@fortawesome/free-solid-svg-icons';

const Services = () => {
    const sports = [
        {
            icon: faFootball,
            name: "Football",
            description: "Professional football turfs with FIFA standards",
            features: ["Full-size pitch", "Quality grass", "Floodlights", "Changing rooms"]
        },
        {
            icon: faBasketball,
            name: "Basketball",
            description: "Indoor and outdoor basketball courts",
            features: ["Professional hoops", "Smooth surface", "Scoreboards", "Seating area"]
        },
        {
            icon: faTableTennis,
            name: "Table Tennis",
            description: "Indoor table tennis facilities",
            features: ["Professional tables", "Quality paddles", "Tournament setup", "Coaching available"]
        },
        {
            icon: faVolleyball,
            name: "Volleyball",
            description: "Beach and indoor volleyball courts",
            features: ["Net setup", "Sand courts", "Indoor courts", "Tournament ready"]
        },
        {
            icon: faSwimming,
            name: "Swimming",
            description: "Swimming pool facilities",
            features: ["Olympic size", "Lifeguard on duty", "Changing rooms", "Safety equipment"]
        },
        {
            icon: faDumbbell,
            name: "Fitness",
            description: "Gym and fitness facilities",
            features: ["Modern equipment", "Personal trainers", "Group classes", "Nutrition guidance"]
        }
    ];

    const amenities = [
        { icon: faWifi, name: "Free WiFi", description: "High-speed internet access" },
        { icon: faCar, name: "Parking", description: "Ample parking space" },
        { icon: faShower, name: "Shower Facilities", description: "Clean shower and changing rooms" },
        { icon: faUtensils, name: "Food & Beverages", description: "Refreshments and snacks available" },
        { icon: faShield, name: "Security", description: "24/7 security surveillance" },
        { icon: faUsers, name: "Staff Support", description: "Professional staff assistance" }
    ];

    const packages = [
        {
            name: "Basic Package",
            price: "₹500",
            duration: "1 Hour",
            features: [
                "Turf booking",
                "Basic equipment",
                "Changing room access",
                "Water facility"
            ]
        },
        {
            name: "Premium Package",
            price: "₹800",
            duration: "1 Hour",
            features: [
                "Turf booking",
                "Premium equipment",
                "Changing room access",
                "Shower facilities",
                "Refreshments",
                "Parking space"
            ]
        },
        {
            name: "VIP Package",
            price: "₹1200",
            duration: "1 Hour",
            features: [
                "Turf booking",
                "Premium equipment",
                "Luxury changing rooms",
                "Shower facilities",
                "Premium refreshments",
                "Valet parking",
                "Personal assistant",
                "Priority booking"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Our Services
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Discover our comprehensive range of sports facilities and premium services designed for athletes and sports enthusiasts.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-2" />
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faClock} className="text-yellow-400 mr-2" />
                                <span>24/7 Availability</span>
                            </div>
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faShield} className="text-yellow-400 mr-2" />
                                <span>Safe & Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sports Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Sports We Offer
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            From football to fitness, we provide world-class facilities for all your sporting needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sports.map((sport, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="text-center">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FontAwesomeIcon icon={sport.icon} className="text-2xl text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{sport.name}</h3>
                                    <p className="text-gray-600 mb-4">{sport.description}</p>
                                    <ul className="text-sm text-gray-500 space-y-1">
                                        {sport.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Amenities Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Premium Amenities
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Enjoy world-class amenities that make your sports experience comfortable and memorable.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {amenities.map((amenity, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center">
                                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                                        <FontAwesomeIcon icon={amenity.icon} className="text-xl text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{amenity.name}</h3>
                                        <p className="text-gray-600">{amenity.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Service Packages
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Choose the perfect package that suits your needs and budget.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {packages.map((pkg, index) => (
                            <div key={index} className={`rounded-lg shadow-lg p-8 ${
                                index === 1 ? 'bg-blue-600 text-white transform scale-105' : 'bg-white'
                            }`}>
                                <div className="text-center">
                                    <h3 className={`text-2xl font-bold mb-4 ${
                                        index === 1 ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {pkg.name}
                                    </h3>
                                    <div className="mb-6">
                                        <span className={`text-4xl font-bold ${
                                            index === 1 ? 'text-white' : 'text-blue-600'
                                        }`}>
                                            {pkg.price}
                                        </span>
                                        <span className={`text-lg ${
                                            index === 1 ? 'text-blue-200' : 'text-gray-600'
                                        }`}>
                                            /{pkg.duration}
                                        </span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {pkg.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <FontAwesomeIcon 
                                                    icon={faStar} 
                                                    className={`w-4 h-4 mr-3 ${
                                                        index === 1 ? 'text-yellow-300' : 'text-green-500'
                                                    }`} 
                                                />
                                                <span className={index === 1 ? 'text-blue-100' : 'text-gray-600'}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                                        index === 1 
                                            ? 'bg-white text-blue-600 hover:bg-blue-50' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}>
                                        Choose Package
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Book Your Sports Experience?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust SurfTurf for their sports needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/customer/turf" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 text-center">
                            Browse Turfs
                        </a>
                        <a href="/customer/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 text-center">
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
