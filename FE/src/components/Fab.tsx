import { Box, Button } from '@mui/material';
import createIcon from '../assets/create.svg';

interface Props { onClick: () => void }

export const Fab = ({ onClick }: Props) => (
  <Button
    onClick={onClick}
    aria-label="Create"
    sx={{
      position: 'absolute',
      right: 24,
      bottom: 48,
      minWidth: 0,
      width: 52,
      height: 52,
      borderRadius: '14px',
      border: '3px solid #111',
      backgroundColor: '#fff',
      boxShadow: 'inset 0 -4px 0 #cfcfcf, 0 3px 4px rgba(0,0,0,.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0,
      transition: 'transform .15s ease, box-shadow .15s ease',
      zIndex: 100,
      
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 'inset 0 -4px 0 #cfcfcf, 0 6px 12px rgba(0,0,0,.15)'
      },
      
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: 'inset 0 -2px 0 #cfcfcf, 0 3px 6px rgba(0,0,0,.12)'
      }
    }}
  >
    <Box 
      component="img" 
      src={createIcon} 
      alt="Create" 
      sx={{ 
        width: 28, 
        height: 28, 
        display: 'block' 
      }} 
    />
  </Button>
);