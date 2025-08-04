import React from "react";
import { Typography, Container, Button, Box } from "@mui/material";
import { useNavigate } from "react-router";


const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/signin"); 
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Welcome!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Thank you for signing in. We're happy to have you on board.
        </Typography>

        <Button variant="contained" color="primary" onClick={handleLogout}>
          Log Out
        </Button>
      </Box>
    </Container>
  );
};

export default UserDashboard;
