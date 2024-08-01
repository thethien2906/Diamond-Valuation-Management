import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './userContext';

const ConsultantContext = createContext();

const ConsultantContextProvider = ({ children }) => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const pendingRes = await axios.get(
          `/api/consultants/${user._id}/pending-bookings`
        );
        setPendingBookings(pendingRes.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <ConsultantContext.Provider
      value={{
        pendingBookings,
        setPendingBookings, // Provide this for direct updates
      }}
    >
      {children}
    </ConsultantContext.Provider>
  );
};

export { ConsultantContext, ConsultantContextProvider };