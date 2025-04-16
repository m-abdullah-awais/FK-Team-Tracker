import { useEffect, useState } from 'react'
import AdminReportTable from '../components/AdminReports/AdminReportTable'
import TeamReportTable from '../components/TeamReports/TeamReportTable';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminReports } from '../features/Reports/reportSlice';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';
import { API_BASE_URL } from '../constants/API_BASE_URL';
import { Box, Paper, Typography } from '@mui/material';
import GroupOffIcon from '@mui/icons-material/GroupOff';

function Reports({ role }) {
  const TOKEN = JSON.parse(localStorage.getItem('fk-user-access'));

  const endpoint = role === "admin"
    ? `${API_BASE_URL}/workSummary/all-users-summary`
    : `${API_BASE_URL}/workSummary/all`;

  const dispatch = useDispatch();
  // const { reports } = useSelector((state) => state.reports);
  const [response] = useFetch(endpoint, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    }
  });

  useEffect(() => {
    if (response && role === "admin") {
      dispatch(setAdminReports(response.data));
    }
  }, [response, dispatch, role]);

  const adminReports = useSelector((state) => state.reports.reports);

  if (!response) {
    return <div>Loading...</div>
  }

  if (response.data?.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
        p={2}
      >
        <Paper
          elevation={3}
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: 3,
          }}
        >
          <GroupOffIcon color="disabled" sx={{ fontSize: 50, mb: 1 }} />
          <Typography variant="h6" fontWeight={600} color="text.secondary">
            No Reports Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try creating new reports to see them here.
          </Typography>
        </Paper>
      </Box>
    )

  }

  return (
    <>
      {role === "admin" && <AdminReportTable rowData={adminReports} />}
      {role === "team" && <TeamReportTable rowData={response?.data} />}
    </>
  );
}

export default Reports