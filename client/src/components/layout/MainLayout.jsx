// src/components/layout/MainLayout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    bgcolor: '#121212',
                    minHeight: '100vh',
                    ml: '280px',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;