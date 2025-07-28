import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const Dashboard = () => {
  // Mock user data - in real app this would come from backend
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      signupDate: '2024-01-15',
      status: 'Active',
      'severity level': 'Low'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      signupDate: '2024-02-03',
      status: 'Active',
      'severity level': 'Medium'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      signupDate: '2024-02-18',
      status: 'Inactive',
      'severity level': 'High'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      signupDate: '2024-03-02',
      status: 'Active',
      'severity level': 'Very high'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@example.com',
      signupDate: '2024-03-15',
      status: 'Pending',
      'severity level': 'Medium'
    }
  ]);

  interface User {
    id: number;
    name: string;
    email: string;
    signupDate: string;
    status: 'Active' | 'Inactive' | 'Pending' | string;
    'severity level': 'Low' | 'Medium' | 'High' | 'Very high' | string;
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
      'Very high': 'error',
      High: 'error',
      Medium: 'warning',
      Low: 'primary'
    };
    return roleColorMap[role] || 'default';
  };

  const handleRowUpdate = (newRow: User, oldRow: User) => {
    const updatedUsers = users.map(user =>
      user.id === newRow.id ? { ...user, ...newRow } : user
    );
    setUsers(updatedUsers);
    return newRow;
  };

  // Define columns for DataGrid
  const columns: GridColDef<User>[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      type: 'number',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
            {params.value.split(' ').map((n: any) => n[0]).join('')}
          </Avatar>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
    },
    {
      field: 'signupDate',
      headerName: 'Signup Date',
      flex: 1,
      // type: 'date',
      // valueGetter: (params: any) => new Date(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: any) => (
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
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Low', 'Medium', 'High', 'Very high'],
      renderCell: (params: any) => (
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
            processRowUpdate={handleRowUpdate}
            getRowId={(row) => row.id}
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

      </Container>
    </Box>
  );
};

export default Dashboard;