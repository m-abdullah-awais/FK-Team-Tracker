import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <CircularProgress size={60} thickness={5} color="primary" />
        <Typography mt={2} fontSize={18} fontWeight={500}>
          Loading your experience...
        </Typography>
      </Box>
    );
  }

  console.log("User from ProtectedRoute:", user);

  if (!user && user?.verification !== "approved") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
