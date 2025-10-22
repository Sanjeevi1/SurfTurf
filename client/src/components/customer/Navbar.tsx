import { FC } from 'react';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const NavBar: FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to login page
  const redirectToLoginPage = () => {
    navigate('/login');
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout successful');
      navigate('/login');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      console.log('Logout failed', errorMessage);
      toast.error(errorMessage);
    }
  };

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
            <span className="block text-sm">{user ? user.username : 'Loading'}</span>
            <span className="block truncate text-sm font-medium">{user ? user.email : 'Loading'}</span>
          </Dropdown.Header>
          <Dropdown.Item>
            <a href="/customer/turf/saved">Saved Turfs</a>
          </Dropdown.Item>
          <Dropdown.Item>
            <a href="/customer/bookings">My Bookings</a>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>
            {user ? (
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
};

export default NavBar;
