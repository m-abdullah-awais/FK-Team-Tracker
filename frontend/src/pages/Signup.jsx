import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Paper, Avatar, IconButton, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { PersonAdd as PersonAddIcon, Email as EmailIcon, VpnKey as KeyIcon, Person as PersonIcon } from '@mui/icons-material';
import { useSnackbar } from '../contexts/SnackbarContext';

import axios from 'axios';
import { API_BASE_URL } from '../constants/API_BASE_URL';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [service, setService] = useState('')

  const showSnackbar = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showSnackbar('Passwords do not match!', 'error');
      return;
    }

    const userData = {
      username: username,
      email: email.toLowerCase(),
      password: password,
      role: 'team',
      service: service
    }

    try {
      setLoading(true);
      // const data = await signup(userData);

      const response = await axios(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(userData)
      });

      if (!response.status === 200 && !response.statusText === 'OK') {
        throw new Error('Registration failed. Please try again.');
      }

      setSuccess(true);
      showSnackbar('Successfully registered! Please login.', 'success');

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      showSnackbar( err?.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000)
    }

  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
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

          {/* Signup Title */}
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: '#1976d2' }}>
            Create Your Account
          </Typography>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Username Field */}
              <Grid item size={12}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <IconButton position="start">
                        <PersonIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

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

              {/* Confirm Password Field */}
              <Grid item size={12}>
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

              {/* Service (Job or Intern) Field */}
              <Grid item size={12}>
                <FormControl fullWidth required>
                  <InputLabel>Service</InputLabel>
                  <Select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    label="Service"
                  >
                    <MenuItem value="job">Job</MenuItem>
                    <MenuItem value="intern">Intern</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Signup Button */}
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
                  {loading ? <CircularProgress sx={{ marginRight: 1 }} /> : <PersonAddIcon sx={{ marginRight: 1 }} />}
                  Signup
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Already have an account Link */}
          <Box sx={{ marginTop: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <a href="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Login here
              </a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup;
