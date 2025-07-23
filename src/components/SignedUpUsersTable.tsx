// import PropTypes from 'prop-types';
// import { styled } from '@mui/material/styles';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';

// // Custom styled table cell for better appearance
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//     fontWeight: 600,
//     padding: theme.spacing(2),
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em',
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     padding: theme.spacing(2),
//     color: theme.palette.text.primary,
//     borderBottom: `1px solid ${theme.palette.divider}`,
//   },
// }));

// // Custom styled table row with hover effect
// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:hover': {
//     backgroundColor: theme.palette.action.selected,
//     transition: 'background-color 0.3s ease',
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// // Mock data for users
// const users = [
//   {
//     id: 1,
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     signupDate: '2025-07-20',
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     email: 'jane.smith@example.com',
//     signupDate: '2025-07-21',
//   },
//   {
//     id: 3,
//     name: 'Alex Johnson',
//     email: 'alex.johnson@example.com',
//     signupDate: '2025-07-22',
//   },
// ];

// // Loading and error components
// const LoadingSpinner = () => (
//   <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
//     <CircularProgress />
//   </Box>
// );

// const ErrorMessage = ({ message }) => (
//   <Box sx={{ color: 'error.main', textAlign: 'center', padding: 2 }}>
//     {message}
//   </Box>
// );

// ErrorMessage.propTypes = {
//   message: PropTypes.string.isRequired,
// };

// function UserTable({ usersData = users, isLoading = false, error = null }) {
//   return (
//     <TableContainer
//       component={Paper}
//       sx={{
//         marginTop: 2,
//         maxWidth: '100%',
//         overflowX: 'auto',
//         boxShadow: 3,
//         borderRadius: 2,
//       }}
//     >
//       {isLoading ? (
//         <LoadingSpinner />
//       ) : error ? (
//         <ErrorMessage message={error} />
//       ) : (
//         <Table
//           sx={{ minWidth: 650 }}
//           aria-label="user table"
//           size="medium"
//         >
//           <TableHead>
//             <TableRow>
//               <StyledTableCell>Name</StyledTableCell>
//               <StyledTableCell>Email</StyledTableCell>
//               <StyledTableCell>Signup Date</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {usersData.map((user) => (
//               <StyledTableRow key={user.id}>
//                 <StyledTableCell component="th" scope="row">
//                   {user.name}
//                 </StyledTableCell>
//                 <StyledTableCell>{user.email}</StyledTableCell>
//                 <StyledTableCell>{user.signupDate}</StyledTableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </TableContainer>
//   );
// }

// UserTable.propTypes = {
//   usersData: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.number.isRequired,
//       name: PropTypes.string.isRequired,
//       email: PropTypes.string.isRequired,
//       signupDate: PropTypes.string.isRequired,
//     })
//   ),
//   isLoading: PropTypes.bool,
//   error: PropTypes.string,
// };

// export default UserTable;

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Box,
  Avatar,
  Badge,
  Chip
} from '@mui/material';
import {
  Notifications,
  Settings,
  Group,
  AccountCircle,
  Business
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock user data - in real app this would come from your backend
  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      signupDate: '2024-01-15',
      status: 'Active',
      role: 'User'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com', 
      signupDate: '2024-02-03',
      status: 'Active',
      role: 'Admin'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      signupDate: '2024-02-18',
      status: 'Inactive',
      role: 'User'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      signupDate: '2024-03-02',
      status: 'Active',
      role: 'Moderator'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@example.com',
      signupDate: '2024-03-15',
      status: 'Pending',
      role: 'User'
    }
  ]);

  const getStatusColor = (status) => {
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Moderator':
        return 'warning';
      case 'User':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>


      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Users Management
        </Typography>
        
        {/* Users Table */}
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Signup Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                    '&:hover': { backgroundColor: '#f0f0f0' }
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.signupDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={getRoleColor(user.role)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Total Users: {users.length}
        </Typography>
      </Container>
    </Box>
  );
};

export default Dashboard;