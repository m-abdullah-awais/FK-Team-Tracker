import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import { Divider, Stack, Chip } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useDispatch } from 'react-redux';
import { updateAdminReport } from '../../features/Reports/reportSlice';
import { API_BASE_URL } from '../../constants/API_BASE_URL';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

export default function AdminReportModal({ open, handleClose, rowData }) {
  const [adminRating, setAdminRating] = React.useState(0);
  const [adminComment, setAdminComment] = React.useState('');
  const [startDateTime, setStartDateTime] = React.useState('');
  const [endDateTime, setEndDateTime] = React.useState('');

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // Format: YYYY-MM-DDThh:mm (format required by datetime-local input)
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0') + 'T' +
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0');
  };

  const showSnackbar = useSnackbar();
  // Update state when rowData changes
  React.useEffect(() => {
    if (rowData) {
      setAdminRating(rowData.adminRating || 0);
      setAdminComment(rowData.adminComments || '');
      setStartDateTime(formatDateTime(rowData.startDateTime));
      setEndDateTime(formatDateTime(rowData.endDateTime));
    }
  }, [rowData]);


  const dispatch = useDispatch();


  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${API_BASE_URL}/workSummary/update/${rowData?._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('fk-user-access'))}`,
      },
      body: JSON.stringify({
        rating: adminRating,
        adminComments: adminComment,
      }),
    })
      .then((response) => response.json())
      .then((data) => {

        handleClose();
        dispatch(updateAdminReport(data.data));
        showSnackbar('Report updated successfully', 'success');
      })
      .catch((error) => {
        console.error('Error:', error);
        showSnackbar('Error updating report', 'error');
      });

    handleClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      'false': 'warning',
      'true': 'info',
    };
    return colors[status] || 'default';
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box component="form" sx={style} noValidate autoComplete="off" onSubmit={handleSubmit}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            Report Details
          </Typography>
          <Chip
            label={rowData?.status ? 'Reviewed' : 'Pending'}
            color={getStatusColor(rowData?.status)}
            variant="outlined"
          />
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Report Info Section */}
        <Stack spacing={3}>
          {/* Times */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date & Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
                startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              }}
              value={startDateTime}
            />
            <TextField
              label="End Date & Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
                startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
              }}
              value={endDateTime}
            />
          </Box>

          {/* Team Member */}
          <TextField
            label="Team Member"
            fullWidth
            InputProps={{
              readOnly: true,
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
            }}
            value={rowData?.teamMember || ''}
          />

          {/* Work Summary */}
          <TextField
            label="Work Summary"
            multiline
            rows={4}
            fullWidth
            InputProps={{
              readOnly: true,
              startAdornment: <AssignmentIcon sx={{ mr: 1, mt: 1, color: 'primary.main' }} />
            }}
            value={rowData?.summary || ''}
          />

          <Divider sx={{ my: 2 }} />

          {/* Admin Review Section */}
          <Typography variant="h6" color="primary" gutterBottom>
            Admin Review
          </Typography>

          {/* Admin Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Rating:</Typography>
            <Rating
              name="admin-rating"
              value={adminRating}
              onChange={(event, newValue) => setAdminRating(newValue)}
              precision={0.5}
              size="large"
            />
            <Typography variant="body2" color="text.secondary">
              ({adminRating} out of 5)
            </Typography>
          </Box>

          {/* Admin Comments */}
          <TextField
            label="Admin Comments"
            multiline
            rows={3}
            fullWidth
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
            placeholder="Enter your feedback here..."
          />
        </Stack>

        {/* Actions */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!adminRating}
          >
            Submit Review
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}