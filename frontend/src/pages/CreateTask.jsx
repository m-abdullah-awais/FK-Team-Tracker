import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '../constants/API_BASE_URL';
// import { addTask } from '../features/Tasks/taskSlice';

function CreateTask() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState('medium');
  const [status, setStatus] = React.useState('not_started');
  const [dueDate, setDueDate] = React.useState(null);
  const [createdFor, setCreatedFor] = React.useState('');

  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !dueDate || !createdFor) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    if (description.length < 10) {
      showSnackbar('Description must be at least 10 characters', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('fk-user-access'))}`
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          status,
          dueDate: dueDate?.toISOString(),
          createdBy: JSON.parse(localStorage.getItem('fk-user-id')),
          createdFor
        })
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar('Task Created Successfully', 'success');
        // dispatch(addTask(data.data));
        setTitle('');
        setDescription('');
        setPriority('medium');
        setStatus('not_started');
        setDueDate(null);
        setCreatedFor('');
      } else {
        showSnackbar(data?.message || 'Failed to create task', 'error');
      }
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
    }
  };

  return (
    <Box>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <TextField
                select
                label="Priority"
                fullWidth
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>

              <TextField
                select
                label="Status"
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="not_started">Not Started</MenuItem>
                <MenuItem value="ready">Ready</MenuItem>
                <MenuItem value="progress">In Progress</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>

              <TextField
                label="Assigned To (User ID)"
                fullWidth
                value={createdFor}
                onChange={(e) => setCreatedFor(e.target.value)}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Create Task
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreateTask;
