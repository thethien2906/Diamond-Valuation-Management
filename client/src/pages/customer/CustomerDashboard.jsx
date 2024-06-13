import React from 'react';
import { Link } from "react-router-dom";
import '../../App.css';
import CustomerLayout from '../../components/CustomerLayout'; // Adjust the path if needed
import { UserContext } from '../../context/userContext'
import { useContext } from "react";
export default function CustomerDashboard() {
    const {user} = useContext(UserContext)
    return (
        <CustomerLayout>
        </CustomerLayout>
    )
}
