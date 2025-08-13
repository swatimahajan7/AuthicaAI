import React from "react";
import Navbar from "../components/NavBar";

import { useNavigate } from "react-router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Paper,
  styled
} from '@mui/material';
import {
  Person,
  Email,
  CalendarToday
} from '@mui/icons-material';
import { useAuthContext } from '../context/globalAuthContext';
import { useParams } from 'react-router-dom';


const UserDashboard: React.FC = () => {
  const { username } = useParams();

  return (
    <div>
      <Navbar isAdmin={false} />
      <UserDetailsCard username={username} />

    </div>
  );
};

interface User {
  name: string;
  email: string;
  signupDate: string;
}


const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  boxShadow: theme.shadows[4],
  borderRadius: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1)
  }
}));

const DetailItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    gap: theme.spacing(1.5)
  }
}));

const ClickableName = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '1rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.25rem'
  },
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'underline'
  },
  transition: 'all 0.2s ease'
}));

interface UserDetailsCardProps {
  username?: string;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ username }) => {
  const { users } = useAuthContext();
  const currentUser = users.find(user => user.username == username);
  const navigate = useNavigate();
  const handleNameClick = () => {
    navigate("/userProfile");
  };


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 4 }, }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}>
            <Avatar
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                fontSize: { xs: '2rem', sm: '2.5rem' },
                bgcolor: 'primary.main',
                mb: 2
              }}
            >
              {currentUser?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography
              variant="h5"
              component="h5"
              fontWeight="600"
              sx={{
                textAlign: 'center'
              }}
            >
              User Details
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <DetailItem elevation={1}>
                <Person sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 28 } }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Name
                  </Typography>
                  <ClickableName
                    variant="h6"
                    onClick={handleNameClick}
                  >
                    {currentUser?.name}
                  </ClickableName>
                </Box>
              </DetailItem>
            </Grid>

            <Grid item xs={12}>
              <DetailItem elevation={1}>
                <Email sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 28 } }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Email Address
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="500"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      wordBreak: 'break-all'
                    }}
                  >
                    {currentUser?.email}
                  </Typography>
                </Box>
              </DetailItem>
            </Grid>

            <Grid item xs={12}>
              <DetailItem elevation={1}>
                <CalendarToday sx={{ color: 'primary.main', fontSize: { xs: 24, sm: 28 } }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Signup Date
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="500"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    {formatDate('2024-01-15')}
                  </Typography>
                </Box>
              </DetailItem>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </Box>
  );
};


export default UserDashboard;