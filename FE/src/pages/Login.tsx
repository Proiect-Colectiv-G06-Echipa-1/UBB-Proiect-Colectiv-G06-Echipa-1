import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { authApi } from '../api/api.ts';
import { useAuth } from '../authentication/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login({loginRequest: {username, password}});
      if (response && response.token) {
        localStorage.setItem('jwt', response.token);
        await refreshAuth();
        toast.success('Login successful!', { containerId: 'global-toast' });
        navigate('/home');
      } else {
        throw new Error('Invalid response from server - no token received');
      }
    } catch (err: any) {
      localStorage.removeItem('jwt');
      toast.error(err.message || 'Login failed. Please check your credentials.', { containerId: 'global-toast' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        background: 'rgba(159, 175, 255, 1)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          maxWidth: 450,
          width: '100%',
          mx: 2,
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 600,
            color: '#333',
            mb: 3 
          }}
        >
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                '&:hover': {
                  backgroundColor: '#fff',
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                },
              },
            }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                '&:hover': {
                  backgroundColor: '#fff',
                },
                '&.Mui-focused': {
                  backgroundColor: '#fff',
                },
              },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 2,
                mb: 3,
                py: 1.5,
                px: 8,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #663a8f 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Logging' : 'Login'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/register')}
                disabled={loading}
                sx={{ 
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  verticalAlign: 'baseline',
                  color: '#667eea',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                    color: '#5568d3',
                  }
                }}
              >
                Register here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}