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
        <div>
            <h1>Dashboard</h1>
            {!!user && <h2>Hello {user.name}</h2>}
        </div>
        </CustomerLayout>
    )
}
