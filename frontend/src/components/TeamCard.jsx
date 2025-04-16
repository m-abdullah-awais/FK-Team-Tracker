import * as React from 'react';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Stack,
  Chip,
} from '@mui/material';

export default function TeamCard({ member }) {

  return (
    <Card
      sx={{
        boxShadow: 3,
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
        py: 1,
        minHeight: 300,
        borderRadius: 5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Avatar
          src={member.profilePic}
          alt="Team Member Pic"
          sx={{
            width: 130,
            height: 130,
            border: '4px solid white',
            boxShadow: 2,
          }}
        />
      </Box>

      <CardContent>
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography variant="h6" component="div" fontWeight={600} sx={{ minHeight: 65 }}>
            {member.username || "FK Member Name"}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
                  Team Member
              </Typography> */}
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>

            {
              member.role == "admin" ?
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
              member &&
                member.service === "job" ?
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

          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
