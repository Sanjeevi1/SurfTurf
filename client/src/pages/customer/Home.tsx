import React from 'react';
import Hero from '../../components/customer/Hero';
import { useAuth } from '../../contexts/AuthContext';

const CustomerHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <Hero isLoggedIn={!!user} />
    </>
  );
};

export default CustomerHome;
