import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router';

const SigninSuccess = () => {
    const navigate = useNavigate()
    const handleProceed = () => {
        if()
        navigate('/userDashboard')
        console.log('Signed in successfully!');
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="70vh"
            gap={3}
            textAlign="center"
        >
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'green' }} />

            <Typography variant="h5" fontWeight={600}>
                Signin Successful!
            </Typography>

            <Typography variant="body1" maxWidth={400}>
                You’ve successfully logged in with multi-factor authentication.
            </Typography>

            <Button variant="contained" color="primary" onClick={handleProceed}>
                Go to Dashboard
            </Button>
        </Box>
    );
};

export default SigninSuccess;
