import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Paper, Avatar, IconButton } from '@mui/material';
import { LockOutlined as LockIcon, Email as EmailIcon, VpnKey as KeyIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSnackbar } from '../contexts/SnackbarContext';
import useAuth from '../hooks/useAuth';
import { API_BASE_URL } from '../constants/API_BASE_URL';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const showSnackbar = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email: email.toLowerCase(),
        password: password,
      };

      setLoading(true);
      setError(null);

      // const data = await login(userData)

      const response = await axios(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(userData)
      });

      if (!response.status === 200 && !response.statusText === 'OK') {
        throw new Error('Failed to login');
      }

      showSnackbar('Login successful', 'success');

      localStorage.setItem('fk-user-access', JSON.stringify(response.data.data.accessToken));
      localStorage.setItem('fk-user-refresh', JSON.stringify(response.data.data.refreshToken));

      setTimeout(() => {
        if (response.data.data.user.role === "admin") {
          window.location.href = '/admin/dashboard';
        }
        else if (response.data.data.user.role === "team") {
          window.location.href = '/team/dashboard';
        }
      }, 1000);
    }
    catch (error) {            
      setError(error || 'Login failed. Please try again.');
      error.status == 406 ? showSnackbar("Please wait for the admin to approve your account", 'error') : showSnackbar(error?.response?.data?.message || 'Login failed', 'error');
      console.error('Login failed', error);
    }
    finally {
      setTimeout(() => {
        setLoading(false);
      }, 2500)
    }

  };


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#e3f2fd',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
          {/* Company Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                border: '5px solid white',
                boxShadow: 1,
              }}
              src="https://source.unsplash.com/random/150x150"
            />
          </Box>

          {/* Login Title */}
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: '#1976d2' }}>
            Login to Your Account
          </Typography>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Email Field */}
              <Grid item size={12}>
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton position="start">
                        <EmailIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* Password Field */}
              <Grid item size={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton position="start">
                        <KeyIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              {/* Login Button */}
              <Grid item size={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{
                    padding: '12px',
                    backgroundColor: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  <LockIcon sx={{ marginRight: 1 }} /> 
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Forgot Password Link */}
          <Box sx={{ marginTop: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              <a href="/forgot-password" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Forgot Password?
              </a>
            </Typography>
          </Box>

          {/* Register Now Button */}
          <Box sx={{ marginTop: 3, textAlign: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to="/signup"
              fullWidth
              sx={{
                padding: '12px',
                borderColor: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: '#e3f2fd',
                },
              }}
              startIcon={<PersonAddIcon />}
            >
              Sign up
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
