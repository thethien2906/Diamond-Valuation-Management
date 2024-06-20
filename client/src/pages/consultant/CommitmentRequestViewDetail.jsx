import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box, Typography, Paper, CircularProgress, Button
} from '@mui/material';
import { toast } from 'react-hot-toast';

const CommitmentRequestViewDetail = () => {
    const { commitId } = useParams();
    const [commit, setCommit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await axios.get(`/api/commit-request/${commitId}`);
                if (response.status === 200) { // Check if the request was successful
                    setCommit(response.data);
                } else {
                    toast.error('Commitment request not found');
                }
            } catch (error) {
                console.error('Error fetching commitment details:', error);
                toast.error('Failed to fetch commitment details');
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [commitId]); 
    const handleUpdateStatus = async () => {
        try {
            const response = await axios.put(`/api/commit-request/${commitId}`, {
                status: 'Pending by Consultant'
            });
            toast.success('Commitment request status updated!');
            navigate('/consultant/commit-requests'); // Redirect after updating
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };
    const handleDenyRequest = async () => {
        try {
            await axios.delete(`/api/commit-request/${commitId}`);
            toast.success('Commitment request denied and deleted successfully');
            navigate('/consultant/commit-requests'); // Redirect after deleting
        } catch (error) {
            console.error('Error denying commitment request:', error);
            toast.error('Failed to deny commitment request');
        }
    };
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>;
    }

    if (!commit) {
        return <Typography variant="h6">Commitment details not found</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Commitment Request Details
            </Typography>
            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="body1">Record ID: {commit.recordId}</Typography>
                <Typography variant="body1">Customer Name: {commit.customerName}</Typography>
                <Typography variant="body1">Phone Number: {commit.phoneNumber}</Typography>
                <Typography variant="body1">Email: {commit.email}</Typography>
                <Typography variant="body1">Reason for Loss: {commit.reasonForLoss}</Typography>
                <Typography variant="body1">Date Issued: {new Date(commit.dateIssued).toLocaleDateString()}</Typography>
                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateStatus}>
                        Submit
                    </Button>
                    <Button 
                    variant="contained" 
                    color="error" // Use error color for deny button
                    onClick={handleDenyRequest}
                >
                    Deny
                </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CommitmentRequestViewDetail;
