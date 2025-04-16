import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';


import { Button, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { declineTeam, verifyTeam } from '../features/Requests/requestSlice';



import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import { addTeamMember } from '../features/Team/teamSlice';
import { useSnackbar } from '../contexts/SnackbarContext';
import { API_BASE_URL } from '../constants/API_BASE_URL';

function RequestTable({ teamData, setVerifyTeam, setDeclineTeam }) {

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    _id: false
  });

  const dispatch = useDispatch()

  const showSnackbar = useSnackbar();

  const columns = [
    { field: '_id', headerName: '_ID', width: 50 },
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'username', headerName: 'Username', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'service', headerName: 'Service', width: 110,
      renderCell: (params) => (
        params.row.service === "job" ? (
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
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'approved'
              ? 'success'
              : params.value === 'pending'
                ? 'warning'
                : 'error'
          }
          variant="outlined"
        />
      ),
    },
    {
      field: 'acceptRequest',
      headerName: 'Accept',
      width: 120,
      renderCell: (params) => (
        params.row.status === 'pending' ? (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckIcon />}
            onClick={() => {
              setVerifyTeam(true)
              fetch(`${API_BASE_URL}/team/verify/${params.row._id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${JSON.parse(localStorage.getItem('fk-user-access'))}`,
                }
              })
                .then((response) => response.json())
                .then((data) => {
                  dispatch(verifyTeam({ id: params.row._id }))
                  dispatch(addTeamMember(data.data))
                  showSnackbar("Team member verified successfully", "success")
                })
                .catch((error) => {
                  console.error('Error:', error);
                  showSnackbar("Error verifying team member", "error")
                  setVerifyTeam(false)
                });
            }}
          >
            Accept
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<CheckIcon />}
            disabled
          >
            Accept
          </Button>
        )
      ),
    },
    {
      field: 'rejectRequest',
      headerName: 'Reject',
      width: 120,
      renderCell: (params) => (
        params.row.status === 'pending' ? (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            onClick={() => {
              setDeclineTeam(true)
              fetch(`${API_BASE_URL}/team/decline/${params.row._id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${JSON.parse(localStorage.getItem('fk-user-access'))}`,
                }
              })
                .then((response) => response.json())
                .then((data) => {
                  showSnackbar("Team member declined successfully", "success")
                  dispatch(declineTeam({ id: params.row._id }))
                })
                .catch((error) => {
                  console.error('Error:', error);
                  showSnackbar("Error declining team member", "error")
                  setDeclineTeam(false)
                });
            }}
          >
            Reject
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<CloseIcon />}
            disabled
          >
            Reject
          </Button>
        )
      ),
    },
  ];

  const rows = teamData.map((item, index) => ({
    _id: item._id,
    id: index + 1,
    username: item.username,
    email: item.email,
    service: item.service,
    status: item.verification,
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        // rowsPerPageOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
        sx={{ cursor: 'default' }}
      />

    </div>
  );
}

export default RequestTable;