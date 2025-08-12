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
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    authenticatorRegistered: user.authenticatorEnabled ?? false,
    faceRegistered: Boolean(user.faceRecognition),
    signupDate: '2024-01-15',
    risk: user.risk
  }));

  interface TableUser {
    name: string;
    username: string;
    email: string;
    phone: string;
    authenticatorRegistered: boolean;
    faceRegistered: boolean;
    signupDate: string;
    risk: 'Severe' | 'Medium' | 'High' | string;
  }

  const getRiskStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'medium':
        return { backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a' };
      case 'high':
        return { backgroundColor: '#e57373', color: '#ffffff', border: '1px solid #f44336' };
      case 'severe':
        return { backgroundColor: '#c62828', color: '#ffffff', border: '1px solid #b71c1c' };
      default:
        return { backgroundColor: '#f5f5f5', color: '#666666', border: '1px solid #cccccc' };
    }
  };

  const handleRowUpdate = (newRow: TableUser) => {
    const config = riskConfig.find(c => c.risk === (newRow.risk as 'Medium' | 'High' | 'Severe'));

    const updatedUsers = users.map(user =>
      user.username === newRow.username
        ? {
          ...user,
          risk: newRow.risk as 'Medium' | 'High' | 'Severe',
          authMethods: config?.authMethods || [],
          requireEmailOTP: config?.requireEmailOTP ?? false,
          requirePhoneOTP: config?.requirePhoneOTP ?? false,
        } as any
        : user
    );

    setUsers(updatedUsers);
    return newRow;
  };

  const columns: GridColDef<TableUser>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.2,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.value}
        </Box>
      ),
    },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'authenticatorRegistered',
      headerName: 'Authenticator registered?',
      flex: 1.2,
      renderCell: (params: any) => (
        <Chip label={params.value ? 'Yes' : 'No'} color={params.value ? 'success' : 'default'} size="small" />
      ),
    },
    {
      field: 'faceRegistered',
      headerName: 'Face registered?',
      flex: 1,
      renderCell: (params: any) => (
        <Chip label={params.value ? 'Yes' : 'No'} color={params.value ? 'success' : 'default'} size="small" />
      ),
    },
    { field: 'signupDate', headerName: 'Signed-up date', flex: 1 },
    {
      field: 'risk',
      headerName: 'Risk level',
      flex: 1,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Medium', 'High', 'Severe'],
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize', fontWeight: 500, ...getRiskStyles(params.value) }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" component="h6" gutterBottom sx={{ mb: 3 }}>
          Users Management
        </Typography>

        <Box sx={{ minHeight: 600, width: '100%' }}>
          <DataGrid
            rows={tableUsers}
            columns={columns}
            processRowUpdate={handleRowUpdate}
            getRowId={(row) => row.username}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
              '& .MuiDataGrid-row:hover': { backgroundColor: '#f0f0f0' },
              '.MuiDataGrid-main': { minHeight: 500 },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
