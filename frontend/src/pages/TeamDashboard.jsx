import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useSnackbar } from '../contexts/SnackbarContext';
import TodoCard from '../components/TodoCard';
import useFetch from '../hooks/useFetch';
import { API_BASE_URL } from '../constants/API_BASE_URL';

// ---------- Stat Cards Data ----------






const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// ---------- Stat Card Component ----------
const StatCard = ({ title, value, icon, bg }) => (
  <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          sx={{
            background: bg,
            color: '#fff',
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 64,
            minHeight: 64,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// ---------- Main Dashboard ----------
export default function TeamDashboard() {

  const TOKEN = JSON.parse(localStorage.getItem('fk-user-access'));
  const showSnackbar = useSnackbar();

  const [data, loading, error, refresh] = useFetch(`${API_BASE_URL}/dashboard/team/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
  });

  React.useEffect(() => {
    if (error) {
      showSnackbar('Failed to load dashboard data', 'error');
    }
  }, [error, showSnackbar]);


  console.log("Sdsdsd", data);



  const stats = [
    {
      title: 'Submitted Reports',
      value: data?.data?.totalReports || '0',
      icon: <PeopleAltIcon fontSize="large" />,
      bg: 'linear-gradient(to right, #6a11cb, #2575fc)',
    },
    {
      title: 'Reviewed by Admin',
      value: data?.data?.reviewedReports || '0',
      icon: <TrendingUpIcon fontSize="large" />,
      bg: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    {
      title: 'Pending Reports',
      value: data?.data?.pendingReports || '0',
      icon: <TaskAltIcon fontSize="large" />,
      bg: 'linear-gradient(to right, #f7971e, #ffd200)',
    },
  ];


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // showSnackbar('Welcome to the Team Dashboard!', 'success', 3000);

  return (
    <Box sx={{ p: 4 }}>

      <Grid container spacing={3} mb={4}>
        {stats.map((item, i) => (
          <Grid item xs={12} sm={6} size={4} md={3} key={i}>
            <StatCard {...item} />
          </Grid>
        ))}
      </Grid>

      <Grid container>

        <TodoCard />

      </Grid>
    </Box>
  );
}
