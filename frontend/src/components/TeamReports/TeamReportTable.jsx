import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TeamReportModal from './TeamReportModal';
// import BasicModal from './ReportModal';
// import ReportModal from './ReportModal';

import { CheckCircle, HourglassTop, Cancel } from '@mui/icons-material';


function TeamReportTable({ rowData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


    const [columnVisibilityModel, setColumnVisibilityModel] = useState({
      _id: false
    });

  const columns = [
    { field: '_id', headerName: 'ID', width: 120 },
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'startDateTime', headerName: 'Start Date & Time', width: 180 },
    { field: 'endDateTime', headerName: 'End Date & Time', width: 180 },
    { field: 'summary', headerName: 'Summary', width: 160 },
    { field: 'adminRating', headerName: 'Rating', width: 65 },
    { field: 'adminComments', headerName: 'Admin Comments', width: 160 },
    {
      field: 'status',
      headerName: 'Review Status',
      width: 110,
      renderCell: (params) => {
        const status = params.value ? "Reviewed" : "Pending";
        const icon = params.value ? 
          <CheckCircle sx={{ color: '#4caf50', marginRight: 1 }} /> : 
          <HourglassTop sx={{ color: '#ff9800', marginRight: 1 }} />;

        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: params.value ? '#4caf50' : '#ff9800'
          }}>
            {icon}
            {status}
          </div>
        );
      }
    },
  ];

  const rows = rowData.map((row, index) => {
    return {
      _id: row._id,
      id: index+1,
      teamMember: row.createdBy.username,
      startDateTime: new Date(row.startTime).toLocaleString(),
      endDateTime: new Date(row.endTime).toLocaleString(),
      summary: row.workSummary,
      adminRating: row.rating,
      adminComments: row.adminComments,
      status: row.isReviewed,
    };
  })



  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) =>
          setColumnVisibilityModel(newModel)
        }
        sx={{ cursor: 'default' }}
      />

      <TeamReportModal
        open={modalOpen}
        handleClose={handleCloseModal}
        rowData={selectedRow}
      />
    </div>
  );
}

export default TeamReportTable;