import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Dropdown, Navbar as FlowbiteNavbar } from 'flowbite-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Navbar: React.FC = () => {
  const [data, setData] = useState<any>(null)
  const navigate = useNavigate()

  const redirectToLoginPage = () => {
    navigate('/login')
  }

  const getUserDetails = async () => {
    try {
      const res = await api.get('/users/getuser')
      setData(res.data.data)
    } catch (error) {
      console.log("Failed to fetch user data", error)
      setData(null)
    }
  }

  const logout = async () => {
    try {
      await api.get("/users/logout")
      toast.success('Logout successful')
      setData(null)
      redirectToLoginPage()
    } catch (error: any) {
      console.log("Logout failed", error.message)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <FlowbiteNavbar fluid>
      <FlowbiteNavbar.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold text-blue-700">SurfTurf</span>
      </FlowbiteNavbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">{data ? data.username : 'Loading'}</span>
            <span className="block truncate text-sm font-medium">{data ? data.email : 'Loading'}</span>
          </Dropdown.Header>
          <Dropdown.Item>
            <Link to="/saved">Saved Turfs</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link to="/bookings">My Bookings</Link>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>
            {data ? (
              <p>Sign Out</p>
            ) : (
              <button
                onClick={redirectToLoginPage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Login
              </button>
            )}
          </Dropdown.Item>
        </Dropdown>
        <FlowbiteNavbar.Toggle />
      </div>
      <FlowbiteNavbar.Collapse>
        <FlowbiteNavbar.Link href="/" active>Home</FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="/turf">Turf</FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="#">Services</FlowbiteNavbar.Link>
        <FlowbiteNavbar.Link href="#">Contact</FlowbiteNavbar.Link>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  )
}

export default Navbar
