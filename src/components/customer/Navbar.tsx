"use client";

import axios from "axios";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import Link from 'next/link';

export function NavBar() {
    const [data, setData] = useState(null);
    const router = useRouter();

    // Redirect to login page
    const redirectToLoginPage = () => {
        router.push('/login');
    };

    // Fetch user details if logged in
    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/getuser');
            setData(res.data.data);
        } catch (error) {
            console.log("Failed to fetch user data", error);
            setData(null);
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success('Logout successful');
            setData(null);
            redirectToLoginPage();
        } catch (error: any) {
            console.log("Logout failed", error.message);
            toast.error(error.message);
        }
    };

    // Fetch user details on component mount
    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <Navbar fluid className="bg-white shadow-lg border-b border-gray-200">
            <Link href="/customer/home" className="flex items-center">
                <span className="self-center whitespace-nowrap text-2xl font-bold text-blue-600">SurfTurf</span>
            </Link>
            
            <div className="flex md:order-2 items-center gap-4">
                {data ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar 
                                alt="User settings" 
                                img={(data as any)?.profilePicture || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} 
                                rounded 
                                className="cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all duration-200"
                            />
                        }
                        className="z-50"
                    >
                        <Dropdown.Header className="bg-gray-50">
                            <span className="block text-sm font-medium text-gray-900">{(data as any)?.username || 'User'}</span>
                            <span className="block truncate text-sm text-gray-500">{(data as any)?.email || 'user@example.com'}</span>
                        </Dropdown.Header>
                        {/* Role-based dropdown items */}
                        {(data as any)?.role === 'admin' || (data as any)?.role === 'owner' ? (
                            // Admin/Owner dropdown
                            <>
                                <Dropdown.Item className="hover:bg-blue-50">
                                    <Link href="/admin/bookings" className="flex items-center w-full">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Manage Bookings
                                    </Link>
                                </Dropdown.Item>
                                <Dropdown.Item className="hover:bg-blue-50">
                                    <Link href="/admin/addturf" className="flex items-center w-full">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Turf
                                    </Link>
                                </Dropdown.Item>
                                {(data as any)?.role === 'admin' && (
                                    <Dropdown.Item className="hover:bg-blue-50">
                                        <Link href="/admin/addOwner" className="flex items-center w-full">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Add Owner
                                        </Link>
                                    </Dropdown.Item>
                                )}
                            </>
                        ) : (
                            // Customer dropdown
                            <>
                                <Dropdown.Item className="hover:bg-blue-50">
                                    <Link href="/customer/turf/saved" className="flex items-center w-full">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        Saved Turfs
                                    </Link>
                                </Dropdown.Item>
                                <Dropdown.Item className="hover:bg-blue-50">
                                    <Link href="/customer/bookings" className="flex items-center w-full">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        My Bookings
                                    </Link>
                                </Dropdown.Item>
                            </>
                        )}
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={logout} className="text-red-600 hover:bg-red-50">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <button
                        onClick={redirectToLoginPage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        Login
                    </button>
                )}

                <Navbar.Toggle />
            </div>
            
            <Navbar.Collapse className="bg-white">
                {/* Role-based navigation */}
                {(data as any)?.role === 'admin' || (data as any)?.role === 'owner' ? (
                    // Admin/Owner navigation
                    <>
                        <Navbar.Link href="/admin/home" className="text-gray-700 hover:text-blue-600 font-medium">
                            Dashboard
                        </Navbar.Link>
                        <Navbar.Link href="/admin/addturf" className="text-gray-700 hover:text-blue-600 font-medium">
                            Add Turf
                        </Navbar.Link>
                        <Navbar.Link href="/admin/bookings" className="text-gray-700 hover:text-blue-600 font-medium">
                            Bookings
                        </Navbar.Link>
                        {(data as any)?.role === 'admin' && (
                            <Navbar.Link href="/admin/addOwner" className="text-gray-700 hover:text-blue-600 font-medium">
                                Add Owner
                            </Navbar.Link>
                        )}
                    </>
                ) : (
                    // Customer navigation
                    <>
                        <Navbar.Link href="/customer/home" className="text-gray-700 hover:text-blue-600 font-medium">
                            Home
                        </Navbar.Link>
                        <Navbar.Link href="/customer/turf" className="text-gray-700 hover:text-blue-600 font-medium">
                            Turf
                        </Navbar.Link>
                        <Navbar.Link href="/customer/services" className="text-gray-700 hover:text-blue-600 font-medium">
                            Services
                        </Navbar.Link>
                        <Navbar.Link href="/customer/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                            Contact
                        </Navbar.Link>
                    </>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
}
