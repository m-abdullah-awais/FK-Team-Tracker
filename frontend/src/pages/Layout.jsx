import React from 'react'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

function Layout() {
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <SideBar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    <Outlet />
                </Box>
            </Box>
        </>
    )
}

export default Layout