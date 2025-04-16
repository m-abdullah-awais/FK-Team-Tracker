import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import { useSelector } from 'react-redux';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import AssessmentIcon from '@mui/icons-material/Assessment';
import StarRateIcon from '@mui/icons-material/StarRate';

function TeamDetail() {
  const { teamId } = useParams();

  const teamMembers = useSelector(state => state.team.team);

  const memberData = teamMembers?.find(member => member._id === teamId);

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

  console.log("userData->", userData);


  useEffect(() => {
    if (memberData) {
      setUserData(memberData);
    }
  }, [memberData]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12} size={12}>
          <Card sx={{ position: 'relative' }}>
            <Box
              sx={{
                height: 140,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              }}
            />
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  position: 'relative',
                  mt: -12,
                }}
              >
                <Avatar
                  sx={{
                    width: 175,
                    height: 175,
                    border: '5px solid white',
                    boxShadow: 1,
                  }}
                  src={userData.profilePic || "https://source.unsplash.com/random/150x150"}
                />
                <Box sx={{ ml: 3, mb: 2 }}>
                  <Typography variant="h4">
                    {userData.username}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {
                      userData.role == "admin" ?
                        <Chip
                          label="Admin"
                          icon={<AdminPanelSettingsIcon />}
                          color="primary"
                          variant="outlined"
                        />
                        :
                        <Chip
                          label="Team"
                          icon={<GroupIcon />}
                          color="secondary"
                          variant="outlined"
                        />
                    }

                    {
                      userData &&
                        userData.service === "job" ?
                        (
                          <Chip
                            label="Job"
                            icon={<WorkIcon />}
                            color="primary"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            label="Intern"
                            icon={<SchoolIcon />}
                            color="info"
                            variant="outlined"
                          />
                        )
                    }
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

        {/* User Details Card */}
        <Grid item xs={12} md={8} size={6}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><EmailIcon color="primary" /><Typography>Email: {userData.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><PhoneIcon color="primary" /><Typography>Phone: {userData.phone || "Not provided"}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><GroupIcon color="primary" /><Typography>Gender: {userData.gender || "Not provided"}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><LocationOnIcon color="primary" /><Typography>Address: {userData.address || "Not provided"}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><AdminPanelSettingsIcon color="primary" /><Typography>Role: {userData.role}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><WorkIcon color="primary" /><Typography>Service: {userData.service}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><CheckCircleIcon color="primary" /><Typography>Verification: {userData.verification}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><SchoolIcon color="primary" /><Typography>Member since: {new Date(userData.createdAt).toLocaleString()}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Card */}
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

export default TeamDetail;