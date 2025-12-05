import type { JSX } from "react";
import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { TopNav } from "../components/TopNav";
import { fontFamilyStyle, fontSizeStyle } from "../lib/style";

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { authenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100vw',
          bgcolor: '#fff',
          m: 0,
          p: 0,
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        <TopNav
          energyLevel={6}
          onDecrease={() => {}}
          onIncrease={() => {}}
        />
        <Box
          sx={{
            position: 'relative',
            bgcolor: '#A8B1FF',
            flex: 1,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={[fontFamilyStyle, 
            {
              fontWeight: 400,
              fontSize: '48px',
              color: '#111',
              textAlign: 'center',
            }]}
          >
            Access Denied
          </Typography>
          <Typography
            sx={[fontFamilyStyle, fontSizeStyle,
            {
              color: '#333',
              textAlign: 'center',
              maxWidth: '600px',
            }]}
          >
            You do not have administrator privileges to access this page.
          </Typography>
          <Button
            onClick={() => navigate('/home')}
            sx={[fontFamilyStyle, fontSizeStyle,
            {
              bgcolor: '#6F6471',
              color: '#fff',
              borderRadius: '28px',
              padding: '12px 24px',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#5a4d5d',
              },
            }]}
          >
            Go to Home
          </Button>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
}

