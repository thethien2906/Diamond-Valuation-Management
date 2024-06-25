import { Alert, Box, Button, CircularProgress, Container, CssBaseline, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00BFFF', // Fluorescent blue
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
        },
    },
    typography: {
        h4: {
            fontWeight: 600,
            color: '#FFFFFF', // White
        },
    },
});

function Verify() {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerifyClick = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/auth/verify-email/${token}`);
            setMessage(response.data.message || 'Email verified successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.error('Verification failed:', error.response ? error.response.data : error.message);
            setMessage('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: 4,
                    bgcolor: 'background.default',
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: 3,
                    animation: 'fadeIn 1.5s ease-in-out',
                    '@keyframes fadeIn': {
                        '0%': { opacity: 0 },
                        '100%': { opacity: 1 },
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 3,
                        p: 3,
                    }}
                >
                    <Typography variant="h4">Email Verification</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleVerifyClick}
                        disabled={isLoading}
                        sx={{
                            minWidth: 200,
                            bgcolor: '#00BFFF',
                            '&:hover': {
                                bgcolor: '#0099CC',
                            },
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                                '0%': { boxShadow: '0 0 10px #00BFFF' },
                                '50%': { boxShadow: '0 0 20px #00BFFF' },
                                '100%': { boxShadow: '0 0 10px #00BFFF' },
                            },
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Verify Email Address'}
                    </Button>
                    {message && (
                        <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Verify;
