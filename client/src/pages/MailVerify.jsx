import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button } from '@mui/material';

function Verify() {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const handleVerifyClick = async () => {
        setIsLoading(true); // Show loading indicator
        try {
            const response = await axios.post(`/auth/verify-email/${token}`);
            setMessage(response.data.message || 'Email verified successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Redirect after 2 seconds (adjust as needed)
        } catch (error) {
            console.error('Verification failed:', error.response ? error.response.data : error.message);
            setMessage('Verification failed. Please try again.');
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    return (
        <div>
            <Typography variant="h4">Email Verification</Typography>
            <Button variant="contained" color="primary" onClick={handleVerifyClick} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email Address'}
            </Button>
            <Typography>{message}</Typography>
        </div>
    );
}

export default Verify;
