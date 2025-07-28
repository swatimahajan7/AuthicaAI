import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Dashboard = () => {
  // Mock user data - in real app this would come from your backend
  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      signupDate: '2024-01-15',
      status: 'Active',
      'severity level': 'low'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com', 
      signupDate: '2024-02-03',
      status: 'Active',
      'severity level': 'medium'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      signupDate: '2024-02-18',
      status: 'Inactive',
      'severity level': 'high'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      signupDate: '2024-03-02',
      status: 'Active',
      'severity level': 'very high'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@example.com',
      signupDate: '2024-03-15',
      status: 'Pending',
      'severity level': 'medium'
    }
  ]);

  interface User {
    id: number;
    name: string;
    email: string;
    signupDate: string;
    status: 'Active' | 'Inactive' | 'Pending' | string;
    'severity level': 'low' | 'medium' | 'high' | 'very high' | string;
  }

  const getStatusColor = (status: User['status']): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  interface RoleColorMap {
    [key: string]: 'error' | 'warning' | 'primary' | 'default';
  }

  const getRoleColor = (role: string): 'error' | 'warning' | 'primary' | 'default' => {
    const roleColorMap: RoleColorMap = {
      'very high': 'error',
      high: 'error',
      medium: 'warning',
      low: 'primary'
    };
    return roleColorMap[role] || 'default';
  };

  // Define columns for DataGrid
  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70,
      type: 'number'
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
            {params.value.split(' ').map(n => n[0]).join('')}
          </Avatar>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'signupDate',
      headerName: 'Signup Date',
      width: 130,
      type: 'date',
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'severity level',
      headerName: 'Severity Level',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={getRoleColor(params.value)}
          variant="outlined"
          size="small"
        />
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Users Management
        </Typography>
        
        {/* DataGrid */}
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Total Users: {users.length}
        </Typography>
      </Container>
    </Box>
  );
};

export default Dashboard;