import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import { Divider, Stack, Chip } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

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

export default function TeamReportModal({ open, handleClose, rowData }) {
  const [adminRating, setAdminRating] = React.useState(0);
  const [adminComment, setAdminComment] = React.useState('');
  const [startDateTime, setStartDateTime] = React.useState('');
  const [endDateTime, setEndDateTime] = React.useState('');

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0') + 'T' +
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0');
  };

  React.useEffect(() => {
    if (rowData) {
      setAdminRating(rowData.adminRating || 0);
      setAdminComment(rowData.adminComments || '');
      setStartDateTime(formatDateTime(rowData.startDateTime));
      setEndDateTime(formatDateTime(rowData.endDateTime));
    }
  }, [rowData]);

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
      <Box sx={style}>
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
          {/* Dates */}
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
            value={rowData?.teamMember || 'John Doe'}
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
              readOnly
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
            InputProps={{ readOnly: true }}
          />
        </Stack>

        {/* Close Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Typography
            onClick={handleClose}
            sx={{
              cursor: 'pointer',
              color: 'primary.main',
              fontWeight: 500
            }}
          >
            Close
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}
