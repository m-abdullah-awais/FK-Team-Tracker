import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
  Divider,
  TextField,
  Stack,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import useFetch from '../hooks/useFetch';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useDispatch } from 'react-redux';
import { updateTeamMember } from '../features/Team/teamSlice';
import { API_BASE_URL } from '../constants/API_BASE_URL';

import AssessmentIcon from '@mui/icons-material/Assessment';
import StarRateIcon from '@mui/icons-material/StarRate';
import AccessTimeIcon from '@mui/icons-material/AccessTime'

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    role: '',
    service: '',
    profilePic: '',
    phone: '',
    gender: '',
    address: '',
    verification: '',
    totalReports: 0,
    averageRating: 0,
    totalHoursWorked: 0,
    createdAt: ''
  });

  const showSnackbar = useSnackbar();

  const dispatch = useDispatch()

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [data] = useFetch(`${API_BASE_URL}/user/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("fk-user-access"))}`,
    }
  });

  useEffect(() => {
    if (data && data?.data) {
      setUserData(data?.data);
      dispatch(updateTeamMember(data?.data))
    }
  }, [data]);

  console.log("User data from Profile:", data?.data);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          profilePic: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple submissions
    setIsSaving(true);
    try {
      const formData = new FormData();

      // Append user fields
      for (const key in userData) {
        if (key !== 'profilePic') {
          formData.append(key, userData[key]);
        }
      }

      if (selectedFile) {
        formData.append('profilePic', selectedFile);
      }

      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("fk-user-access"))}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        showSnackbar("Profile updated successfully", "success");
        setUserData(result.data);

        console.log("Updated user data:", result.data);

        setIsEditing(false);
      } else {
        showSnackbar(result.message || 'Failed to update profile', "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar('Something went wrong', "error");
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 2500)
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item size={12}>
          <Card sx={{ position: 'relative' }}>
            <Box sx={{ height: 140, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }} />
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', position: 'relative', mt: -12 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 175,
                      height: 175,
                      border: '5px solid white',
                      boxShadow: 1,
                    }}
                    src={selectedFile ? URL.createObjectURL(selectedFile) : userData.profilePic}
                  />
                  {isEditing && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '50%',
                        p: 1,
                        cursor: 'pointer',
                      }}
                      onClick={handleUploadClick}
                    >
                      <CameraAltIcon sx={{ color: 'white' }} />
                    </Box>
                  )}
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Box>
                <Box sx={{ ml: 3, mb: 2 }}>
                  <Typography variant="h4">{userData?.username}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                      label={userData.role === "admin" ? "Admin" : "Team"}
                      icon={userData.role === "admin" ? <AdminPanelSettingsIcon /> : <GroupIcon />}
                      color={userData.role === "admin" ? "primary" : "secondary"}
                      variant="outlined"
                    />
                    <Chip
                      label={userData.service === "job" ? "Job" : "Intern"}
                      icon={userData.service === "job" ? <WorkIcon /> : <SchoolIcon />}
                      color={userData.service === "job" ? "primary" : "info"}
                      variant="outlined"
                    />
                    <Chip
                      label="Verified"
                      icon={<CheckCircleIcon style={{ color: 'green' }} />}
                      variant="outlined"
                      color="success"
                    />
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details Card */}
        <Grid item size={6} md={8}>
          <Card>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Profile Information</Typography>
                <Button
                  startIcon={<EditIcon />}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isSaving}
                  color={isSaving ? "inherit" : "primary"}
                >
                  {isEditing ? (isSaving ? 'Saving...' : 'Save') : 'Edit'}
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                {isEditing ? (
                  <>
                    <TextField fullWidth label="Username" name="username" value={userData.username} onChange={handleInputChange} variant="outlined" />
                    {/* <TextField fullWidth label="Email" name="email" value={userData.email} onChange={handleInputChange} variant="outlined" /> */}
                    <TextField fullWidth label="Phone" name="phone" value={userData.phone} onChange={handleInputChange} variant="outlined" />
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      name="gender"
                      value={userData.gender}
                      onChange={handleInputChange}
                      variant="outlined"
                      SelectProps={{ native: true }}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </TextField>
                    <TextField fullWidth label="Address" name="address" value={userData.address} onChange={handleInputChange} variant="outlined" multiline rows={2} />
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><EmailIcon color="primary" /><Typography>Email: {userData.email}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><PhoneIcon color="primary" /><Typography>Phone: {userData.phone || "Not provided"}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><GroupIcon color="primary" /><Typography>Gender: {userData.gender || "Not provided"}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><LocationOnIcon color="primary" /><Typography>Address: {userData.address || "Not provided"}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><AdminPanelSettingsIcon color="primary" /><Typography>Role: {userData.role}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><WorkIcon color="primary" /><Typography>Service: {userData.service}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><CheckCircleIcon color="primary" /><Typography>Verification: {userData.verification}</Typography></Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><SchoolIcon color="primary" /><Typography>Member since: {new Date(userData.createdAt).toLocaleString()}</Typography></Box>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item size={6} md={4}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Performance Stats
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
                {/* Reports Submitted */}
                <Box textAlign="center">
                  <AssessmentIcon color="primary" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Reports Submitted
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {userData?.totalReports}
                  </Typography>
                </Box>

                {/* Average Rating */}
                <Box textAlign="center">
                  <StarRateIcon color="warning" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Average Rating
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {Number(userData?.averageRating).toFixed(1)}
                  </Typography>
                </Box>

                {/* Total Hours Worked */}
                <Box textAlign="center">
                  <AccessTimeIcon color="success" sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Hours Worked
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {Number(userData?.totalHoursWorked).toFixed(1)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;
