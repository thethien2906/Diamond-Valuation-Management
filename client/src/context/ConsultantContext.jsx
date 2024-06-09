// client/src/context/ConsultantContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UserContext } from './userContext';
const ConsultantContext = createContext();

const ConsultantContextProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('viewRequests');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const navigate = useNavigate();
  const { user } = React.useContext(UserContext);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const pendingRes = await axios.get(
          `/api/consultants/${user.userID}/pending-bookings`
        );
        setPendingBookings(pendingRes.data);

        const approvedRes = await axios.get(
          `/api/consultants/${user.userID}/appointments`
        );
        setApprovedBookings(approvedRes.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [user]); // Fetch on initial render and when user changes

  const handleApprove = async (bookingId) => {
    try {
      const updatedBooking = await axios.put(
        `/api/bookings/${bookingId}`,
        { status: "approved" }
      );
      // Update both pending and approved bookings
      setPendingBookings(
        pendingBookings.filter((booking) => booking._id !== bookingId)
      );
      setApprovedBookings([...approvedBookings, updatedBooking.data]);
      navigate("/consultant/appointments");
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  };

  const handleDeny = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: "rejected" });
      setPendingBookings(
        pendingBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Error denying booking:", error);
    }
  };
  return (
    <ConsultantContext.Provider
      value={{
        activeTab,
        setActiveTab,
        pendingBookings,
        approvedBookings,
        handleApprove,
        handleDeny,
      }}
    >
      {children}
    </ConsultantContext.Provider>
  );
};

export { ConsultantContext, ConsultantContextProvider };
