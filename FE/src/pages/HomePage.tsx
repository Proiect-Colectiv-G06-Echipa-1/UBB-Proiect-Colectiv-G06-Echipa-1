import { Box, Typography, Container } from '@mui/material';

export default function HomePage() {
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100vh',
      mt: 8,
      p: 3,
      backgroundColor: 'rgba(159, 175, 255, 1)',
    }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Home Page
        </Typography>
        <Typography variant="body1">
          You are successfully logged in!
        </Typography>
      </Container>
    </Box>
  );
}