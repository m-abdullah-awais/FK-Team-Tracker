import { useState, useEffect, useCallback } from 'react'
import RequestTable from '../components/RequestTable'
import useFetch from '../hooks/useFetch'
import { useDispatch, useSelector } from 'react-redux'
import { setAllTeam } from '../features/Requests/requestSlice'
import debounce from 'lodash/debounce'
import { API_BASE_URL } from '../constants/API_BASE_URL'
import GroupOffIcon from '@mui/icons-material/GroupOff';
import { Box, Paper, Typography } from '@mui/material'


function Requests({ role }) {
  const dispatch = useDispatch()
  const team = useSelector((state) => state.requests.requests)
  const TOKEN = JSON.parse(localStorage.getItem("fk-user-access"))

  // State for tracking fetch trigger and team actions
  const [shouldFetch, setShouldFetch] = useState(true)
  const [verifyTeam, setVerifyTeam] = useState(false)
  const [declineTeam, setDeclineTeam] = useState(false)

  // Debounced function to trigger fetch
  const debouncedFetch = useCallback(
    debounce(() => {
      setShouldFetch(true)
    }, 1000), // 1 second delay
    []
  )

  // Handle team status changes with debouncing
  useEffect(() => {
    if (verifyTeam || declineTeam) {
      debouncedFetch()
      setVerifyTeam(false)
      setDeclineTeam(false)
    }
  }, [verifyTeam, declineTeam, debouncedFetch])

  // Polling interval for updates
  // useEffect(() => {
  //   const pollingInterval = setInterval(() => {
  //     setShouldFetch(true)
  //   }, 30000)

  //   return () => clearInterval(pollingInterval)
  // }, [])

  // Fetch data with conditions
  const [data, isLoading, error] = useFetch(
    shouldFetch ? `${API_BASE_URL}/team/all` : null,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    }
  )

  // Update team data and reset fetch trigger
  useEffect(() => {
    if (data) {
      dispatch(setAllTeam(data.data))
      setShouldFetch(false)
    }
  }, [data, dispatch])

  // Cleanup function for debounced fetch
  useEffect(() => {
    return () => {
      debouncedFetch.cancel()
    }
  }, [debouncedFetch])


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
            No Team Request Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adding members to your team to see them listed here.
          </Typography>
        </Paper>
      </Box>
    )
  }


  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {role === "admin" && (
        <RequestTable
          teamData={team}
          setVerifyTeam={setVerifyTeam}
          setDeclineTeam={setDeclineTeam}
        />
      )}
    </>
  )
}

export default Requests