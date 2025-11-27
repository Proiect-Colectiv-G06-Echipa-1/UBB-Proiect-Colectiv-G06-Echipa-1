import logoSvg from '../assets/logo.svg';
import minusSvg from '../assets/Minus circle.svg';
import plusSvg from '../assets/Plus circle.svg';
import energySvg from '../assets/green-energy.svg';
import toolsSvg from '../assets/swords.svg';
import userSvg from '../assets/User.svg';
import { useAuth } from '../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';

interface TopNavProps {
  energyLevel: number; // 0-10 segments
  onDecrease?: () => void;
  onIncrease?: () => void;
}

export const TopNav = ({ energyLevel, onDecrease, onIncrease }: TopNavProps) => {
  const segments = 10;
  const atMin = energyLevel <= 0;
  const atMax = energyLevel >= segments;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Stiluri comune pentru a nu repeta codul în JSX
  const circleBtnStyle = (disabled: boolean) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    padding: 0,
    minWidth: 0,
  });

  const iconBtnStyle = {
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '6px',
    bgcolor: '#fff',
    minWidth: '28px',
  };

  const imgStyle = {
    width: 27,
    height: 28,
    display: 'block',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
        bgcolor: '#fff',
        borderBottom: '1px solid #e6e6e6',
        px: 2,
      }}
    >
      {/* BRAND SECTION */}
      <Box
        onClick={() => navigate('/')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
        }}
      >
        <Box component="img" src={logoSvg} alt="TUDU Logo" sx={{ height: 28, display: 'block' }} />
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Nanum Pen Script', cursive",
            fontWeight: 400,
            fontSize: '36px',
            letterSpacing: '.06em',
            color: '#111',
          }}
        >
          TUDU
        </Typography>
      </Box>

      {/* ACTIONS SECTION */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

        {/* Decrease Button */}
        <Box
          component="button"
          onClick={onDecrease}
          disabled={atMin}
          aria-label="Decrease energy"
          sx={circleBtnStyle(atMin)}
        >
          <Box component="img" src={minusSvg} alt="-" sx={imgStyle} />
        </Box>

        {/* Segments Bar */}
        <Box
          role="meter"
          aria-valuemin={0}
          aria-valuemax={segments}
          aria-valuenow={energyLevel}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 2,
            height: 32,
            borderRadius: '14px',
            padding: 0,
            bgcolor: 'transparent',
            overflow: 'hidden',
            minWidth: 220,
            border: '1px solid #000',
            gap: 0,
          }}
        >
          {Array.from({ length: segments }).map((_, i) => (
            <Box
              component="span"
              key={i}
              sx={{
                flex: 1,
                height: '100%',
                bgcolor: i < energyLevel ? '#05f90d' : '#fff',
                boxSizing: 'border-box',
                borderRight: i === segments - 1 ? 'none' : '1px solid #000',
              }}
            />
          ))}
        </Box>

        {/* Increase Button */}
        <Box
          component="button"
          onClick={onIncrease}
          disabled={atMax}
          aria-label="Increase energy"
          sx={circleBtnStyle(atMax)}
        >
          <Box component="img" src={plusSvg} alt="+" sx={imgStyle} />
        </Box>

        {/* Static Icons */}
        <Box sx={iconBtnStyle} aria-label="Energy">
          <Box component="img" src={energySvg} alt="energy" sx={imgStyle} />
        </Box>

        <Box sx={iconBtnStyle} aria-label="Tools">
          <Box component="img" src={toolsSvg} alt="tools" sx={imgStyle} />
        </Box>

        <Box
          sx={{
            ...iconBtnStyle,
            borderRadius: '50%',
          }}
          aria-label="User"
        >
          <Box component="img" src={userSvg} alt="user" sx={imgStyle} />
        </Box>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          aria-label="Logout"
          sx={{
            border: 'none',
            borderRadius: '6px',
            bgcolor: '#fff',
            width: 'auto',
            padding: '8px 16px',
            color: '#111',
            fontWeight: 800,
            fontSize: '14px',
            textTransform: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: '#222',
              color: '#fff',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};