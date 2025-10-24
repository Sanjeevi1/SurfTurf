"use client";
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMapMarkerAlt, 
    faPhone, 
    faEnvelope, 
    faClock,
    faUser,
    faMessage,
    faPaperPlane,
    faCheckCircle,
    faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: faMapMarkerAlt,
            title: "Address",
            details: [
                "123 Sports Complex Road",
                "Mumbai, Maharashtra 400001",
                "India"
            ]
        },
        {
            icon: faPhone,
            title: "Phone",
            details: [
                "+91 98765 43210",
                "+91 87654 32109",
                "Mon-Fri: 9AM-6PM"
            ]
        },
        {
            icon: faEnvelope,
            title: "Email",
            details: [
                "info@surfturf.com",
                "support@surfturf.com",
                "bookings@surfturf.com"
            ]
        },
        {
            icon: faClock,
            title: "Business Hours",
            details: [
                "Monday - Friday: 6:00 AM - 10:00 PM",
                "Saturday - Sunday: 6:00 AM - 11:00 PM",
                "24/7 Online Booking Available"
            ]
        }
    ];

    const faqs = [
        {
            question: "How do I book a turf?",
            answer: "You can book a turf through our website by selecting your preferred date, time, and turf. Simply browse available turfs, choose your slot, and complete the payment."
        },
        {
            question: "What is the cancellation policy?",
            answer: "You can cancel your booking up to 2 hours before the scheduled time. Cancellations made within 2 hours will incur a 50% cancellation fee."
        },
        {
            question: "Do you provide equipment?",
            answer: "Yes, we provide basic equipment for most sports. Premium equipment is available for an additional charge. You can also bring your own equipment."
        },
        {
            question: "Is parking available?",
            answer: "Yes, we provide free parking for all our customers. Valet parking is available for VIP package holders."
        },
        {
            question: "Can I book for multiple days?",
            answer: "Yes, you can book turfs for multiple days. We offer special discounts for bulk bookings. Contact us for more information."
        },
        {
            question: "Do you offer coaching services?",
            answer: "Yes, we have certified coaches available for various sports. Coaching sessions can be booked separately or included in premium packages."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Contact Us
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Get in touch with us for any questions, bookings, or support. We're here to help you have the best sports experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Get In Touch
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're always here to help. Reach out to us through any of these channels.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
                                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FontAwesomeIcon icon={info.icon} className="text-2xl text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{info.title}</h3>
                                <div className="space-y-2">
                                    {info.details.map((detail, idx) => (
                                        <p key={idx} className="text-gray-600">{detail}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your phone number"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="booking">Booking Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="feedback">Feedback</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <div className="relative">
                                            <FontAwesomeIcon icon={faMessage} className="absolute left-3 top-3 text-gray-400" />
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                rows={5}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                                placeholder="Tell us how we can help you..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* FAQ Section */}
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                                <div className="space-y-6">
                                    {faqs.map((faq, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                            <p className="text-gray-600">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Find Us
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Visit our state-of-the-art sports complex in the heart of the city.
                        </p>
                    </div>

                    <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl text-gray-400 mb-4" />
                            <p className="text-gray-600">Interactive Map Coming Soon</p>
                            <p className="text-sm text-gray-500 mt-2">123 Sports Complex Road, Mumbai, Maharashtra 400001</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Start Your Sports Journey?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of sports enthusiasts who trust SurfTurf for their training and recreation needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/customer/turf" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 text-center">
                            Book Now
                        </a>
                        <a href="/customer/services" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 text-center">
                            View Services
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
