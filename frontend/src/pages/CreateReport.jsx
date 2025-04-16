import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useDispatch } from 'react-redux';
import { addAdminReport } from '../features/Reports/reportSlice';
import { API_BASE_URL } from '../constants/API_BASE_URL';

function CreateReport() {
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [summary, setSummary] = React.useState('');

  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!startTime || !endTime || !summary) {
      showSnackbar("Please fill all fields", "error");
      return;
    }
    if (startTime > endTime) {
      showSnackbar("Start time cannot be after end time", "error");
      return;
    }
    if (summary.length < 10) {
      showSnackbar("Summary must be at least 50 characters", "error");
      return;
    }
    if (summary.length > 500) {
      showSnackbar("Summary must be less than 500 characters", "error");
      return;
    }
    fetch(`${API_BASE_URL}/workSummary/create`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("fk-user-access"))}`
      },
      body: JSON.stringify({
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
        workSummary: summary
      })
    })
      .then(res => res.json())
      .then(data => {
        showSnackbar("Report Created Successfully", "success");
        dispatch(addAdminReport(data.data));
      })
      .catch(err => {
        showSnackbar("Error in creating report", "error");
      })

    setStartTime(null);
    setEndTime(null);
    setSummary('');
  };

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* <Typography variant="h5" gutterBottom>
            Create New Report
          </Typography> */}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />

                <DateTimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Work Summary"
                placeholder="Enter your work summary here..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
                onClick={() => handleSubmit()}
              >
                Submit Report
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreateReport;