import React from 'react';
import { Grid, Card, CardContent, Typography, Box, TextField } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useSnackbar } from '../contexts/SnackbarContext';
import useFetch from '../hooks/useFetch';
import { API_BASE_URL } from '../constants/API_BASE_URL';
import TodoCard from '../components/TodoCard';

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
export default function AdminDashboard() {


  const TOKEN = JSON.parse(localStorage.getItem('fk-user-access'));

  const [data] = useFetch(`${API_BASE_URL}/dashboard/admin/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  console.log(data?.data);

  const stats = [
    {
      title: 'Total Users',
      value: data?.data?.totalUsers || 0,
      icon: <PeopleAltIcon fontSize="large" />,
      bg: 'linear-gradient(to right, #6a11cb, #2575fc)',
    },
    {
      title: 'Total Reports',
      value: data?.data?.totalReports || 0,
      icon: <TrendingUpIcon fontSize="large" />,
      bg: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
    {
      title: 'Pending Reviews',
      value: data?.data?.pendingReviews || 0,
      icon: <TaskAltIcon fontSize="large" />,
      bg: 'linear-gradient(to right, #f7971e, #ffd200)',
    }
  ];

  // const barData = data?.data?.reportsPerTeam?.length > 0 ? data?.data?.reportsPerTeam : [
  //   {
  //     name: "",
  //     reports: 0
  //   }
  // ]

  const showSnackbar = useSnackbar();

  showSnackbar("Welcome to the Admin Dashboard!", 'success', 3000);

  const [selectedRange, setSelectedRange] = React.useState("7d");

  const handleRangeChange = (e) => {
    setSelectedRange(e.target.value);
  };

  // Dummy working hours data
  // const workingHoursData = {
  //   "7d": [
  //     { user: "John Doe", hours: 36 },
  //     { user: "Jane Smith", hours: 42 },
  //     { user: "Alex Johnson", hours: 38 },
  //   ],
  //   "15d": [
  //     { user: "John Doe", hours: 74 },
  //     { user: "Jane Smith", hours: 81 },
  //     { user: "Alex Johnson", hours: 69 },
  //   ],
  //   "30d": [
  //     { user: "John Doe", hours: 145 },
  //     { user: "Jane Smith", hours: 163 },
  //     { user: "Alex Johnson", hours: 157 },
  //   ],
  // };

  const chartData = data?.data?.workingHours[selectedRange];

  return (
    <Box sx={{ p: 4 }}>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((item, i) => (
          <Grid item xs={12} sm={6} size={4} md={3} key={i}>
            <StatCard {...item} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4}>
        {/* <Grid item xs={12} md={6} size={6}>
          <Card sx={{ borderRadius: 4, p: 2 }}>
            <Typography variant="h6" mb={2}>Reports Growth</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke="#1976d2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid> */}

        {/* <Grid item xs={12} md={6} size={12}>
          <Card sx={{ borderRadius: 4, p: 2 }}>
            <Typography variant="h6" mb={2}>Reports per Team</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#43a047" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid> */}

        {/* <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, p: 2 }}>
            <Typography variant="h6" mb={2}>Department Distribution</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid> */}



        <Grid item size={12}>
          <Card sx={{ borderRadius: 4, p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Team Member Working Hours</Typography>
              <TextField
                select
                size="small"
                value={selectedRange}
                onChange={handleRangeChange}
                sx={{ width: 150 }}
                SelectProps={{ native: true }}
              >
                <option value="7d">Last 7 Days</option>
                <option value="15d">Last 15 Days</option>
                <option value="30d">Last 30 Days</option>
              </TextField>
            </Box>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="user" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>





        <Grid size={12}>
          <TodoCard />
        </Grid>
      </Grid>
    </Box>
  );
}
