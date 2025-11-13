import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';

export default function NavBar() {
  const { logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ 
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: 'white',
      color: '#333',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333' }}>
          My App
        </Typography>
        
        {username && (
          <Typography variant="body1" sx={{ mr: 2, color: '#666' }}>
            Welcome, {username}
          </Typography>
        )}
        
        <Button 
          color="inherit" 
          onClick={handleLogout}
          variant="outlined"
          sx={{ 
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#5568d3',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              color: '#5568d3'
            }
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}