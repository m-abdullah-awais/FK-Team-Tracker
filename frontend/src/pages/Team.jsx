import { Box, Grid, Paper, Typography } from '@mui/material'
import { useEffect } from 'react'
import TeamCard from '../components/TeamCard'
import { useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { setTeamMembers } from '../features/Team/teamSlice'
import { useDispatch, useSelector } from 'react-redux'
import { API_BASE_URL } from '../constants/API_BASE_URL'
import GroupOffIcon from '@mui/icons-material/GroupOff';

function Team() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const TOKEN = JSON.parse(localStorage.getItem('fk-user-access'))

  const team = useSelector((state) => state.team.team)

  const shouldFetch = team.length === 0;

  const [data] = useFetch(
    shouldFetch ? `${API_BASE_URL}/team/members` : null,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    }
  )

  useEffect(() => {
    if (data && data.data) {
      dispatch(setTeamMembers(data.data))
    }
  }, [data, dispatch])

  const handleTeamCardClick = (id) => {
    navigate(`detail/${id}`)
  }


  if (team.length === 0) {
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
            No Team Members Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adding members to your team to see them listed here.
          </Typography>
        </Paper>
      </Box>
    )
  }


  return (
    <Grid container spacing={3}>
      {team && team.map((member, index) => (
        <Grid item size={4} key={index}>
          <Paper
            onClick={() => handleTeamCardClick(member._id)}
            sx={{ boxShadow: 'none', cursor: 'pointer' }}
          >
            <TeamCard member={member} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default Team
