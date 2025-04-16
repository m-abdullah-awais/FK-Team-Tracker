import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        textAlign: 'center',
      }}
    >
      <Container>
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h1" sx={{ fontSize: '10rem', fontWeight: 'bold', color: '#3f51b5' }}>
            404
          </Typography>
          <Typography variant="h4" sx={{ marginBottom: 3 }}>
            Oops! Page Not Found
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            The page you are looking for doesn't exist or has been moved. Please check the URL or go back to the homepage.
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#283593',
              },
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default NotFound;
