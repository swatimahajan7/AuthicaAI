import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useAuthContext } from '../context/globalAuthContext';

const Dashboard = () => {

  const { users, setUsers, riskConfig } = useAuthContext();

  const tableUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    signupDate: '2024-01-15',
    status: 'Active',
    risk: user.risk
  }));

  interface User {
    id: number;
    name: string;
    email: string;
    signupDate: string;
    status: 'Active' | 'Inactive' | 'Pending' | string;
    'risk': 'Severe' | 'Medium' | 'High' | string;
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

  const getRiskStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'medium':
        return {
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #ef9a9a'
        };
      case 'high':
        return {
          backgroundColor: '#e57373',
          color: '#ffffff',
          border: '1px solid #f44336'
        };
      case 'severe':
        return {
          backgroundColor: '#c62828',
          color: '#ffffff',
          border: '1px solid #b71c1c'
        };
      default:
        return {
          backgroundColor: '#f5f5f5',
          color: '#666666',
          border: '1px solid #cccccc',
        };
    }
  };

  const handleRowUpdate = (newRow: User) => {
    const config = riskConfig.find(c => c.risk === newRow.risk as 'Medium' | 'High' | 'Severe');
    const updatedUsers = users.map(user =>
      user.id === newRow.id
        ? {
          ...user,
          risk: newRow.risk as 'Medium' | 'High' | 'Severe',
          authMethods: config?.authMethods || [],
          requireEmailOTP: config?.requireEmailOTP || false,
          requirePhoneOTP: config?.requirePhoneOTP || false,
        }
        : user
    );
    setUsers(updatedUsers);
    return newRow;
  };

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
      field: 'risk',
      headerName: 'Risk',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Medium', 'High', 'Severe'],
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{
            textTransform: 'capitalize',
            fontWeight: 500,
            ...getRiskStyles(params.value),
          }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Users Management
        </Typography>

        <Box sx={{ minHeight: 400, width: '100%' }}>
          <DataGrid
            rows={tableUsers}
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