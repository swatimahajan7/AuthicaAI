import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router';

const RegistrationSuccess = () => {
    const navigate = useNavigate()
    const handleProceed = () => {
        navigate('/userDashboard')
        console.log('Proceeding to application...');
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
                Registration Complete!
            </Typography>

            <Typography variant="body1" maxWidth={400}>
                You have successfully completed all the steps of registration. You may now proceed to use the application.
            </Typography>

            <Button variant="contained" color="primary" onClick={handleProceed}>
                Proceed
            </Button>
        </Box>
    );
};

export default RegistrationSuccess;
