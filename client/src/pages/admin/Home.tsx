import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/addturf"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Add New Turf</h3>
          <p className="text-gray-600">Add a new turf to the platform</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">View Bookings</h3>
          <p className="text-gray-600">Manage all bookings</p>
        </Link>

        <Link
          to="/admin/addOwner"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Owner</h3>
          <p className="text-gray-600">Add a new turf owner</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
