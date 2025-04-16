import React from 'react';
import { Container, Box, Typography, Button, Paper, Grid } from '@mui/material';
import { Login as LoginIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';

function IndexPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
          <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 3, fontWeight: 'bold', color: '#1976d2' }}>
            Team Performance Tracking
          </Typography>

          <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 3 }}>
            Welcome to the Team Performance Tracking application! This platform helps teams track their performance, measure progress, and optimize productivity.
            <br />
            Whether you're a manager or a team member, our app gives you all the insights you need to make data-driven decisions and improve team outcomes.
          </Typography>

          <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                sx={{
                  padding: '12px',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
                href="/login"
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<PersonAddIcon />}
                sx={{
                  padding: '12px',
                  backgroundColor: '#f50057',
                  '&:hover': {
                    backgroundColor: '#c51162',
                  },
                }}
                href="/signup"
              >
                Signup
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default IndexPage;
