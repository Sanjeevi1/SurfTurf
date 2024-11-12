"use client";

import axios from "axios";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export function NavBar() {
    const [data, setData] = useState(null);
    const router = useRouter();

    // Redirect to login page
    const redirectToLoginPage = () => {
        router.push('/login'); // Next.js navigation
    };

    // Fetch user details if logged in
    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/getuser');
            setData(res.data.data);
        } catch (error) {
            console.log("Failed to fetch user data", error);
            setData(null); // Reset data if fetch fails (user might not be logged in)
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success('Logout successful');
            setData(null); // Reset user data on logout
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
        <Navbar fluid>
            <Navbar.Brand>
                <span className="self-center whitespace-nowrap text-xl font-semibold text-blue-700">SurfTurf</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline
                    label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}
                >
                    <Dropdown.Header>
                        <span className="block text-sm">{data ? (data.username) : 'Loading'}</span>
                        <span className="block truncate text-sm font-medium">{data ? (data.email) : 'Loading'}</span>
                    </Dropdown.Header>
                    <Dropdown.Item> <a href="/customer/turf/saved">Saved Turfs</a></Dropdown.Item>
                    <Dropdown.Item>
                        <a href="/bookings">My Bookings</a>

                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>                {data ? (
                        <p>Sign Out</p>) : (
                        <button
                            onClick={redirectToLoginPage}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                            Login
                        </button>
                    )}</Dropdown.Item>
                </Dropdown>

                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="/customer/home" active>Home</Navbar.Link>
                <Navbar.Link href="/customer/turf">Turf</Navbar.Link>
                <Navbar.Link href="#">Services</Navbar.Link>
                <Navbar.Link href="#">Contact</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
