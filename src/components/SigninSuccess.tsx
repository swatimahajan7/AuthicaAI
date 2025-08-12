import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router';

interface SigninSuccessProps {
    isAdmin: boolean;
    username?:string
}

const SigninSuccess = ({ isAdmin,username }: SigninSuccessProps) => {
    
    const navigate = useNavigate()
    const handleProceed = () => {
        if(isAdmin){
            navigate('/adminDashboard')
        }else{
            navigate(`/userHome/${username}`)
        }
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
                Go to {isAdmin ? 'Dashboard': 'Home'} Page
            </Button>
        </Box>
    );
};

export default SigninSuccess;
