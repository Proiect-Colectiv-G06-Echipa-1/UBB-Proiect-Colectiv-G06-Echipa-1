import { Link } from 'react-router-dom';
import { Box, Typography, Card, IconButton, CardMedia } from '@mui/material';

interface QuestCardProps {
  id: number;
  title: string;
  created: string;
  deadline: string;
  count: number;
  image?: string;
  onClick?: (id: number) => void;
}

export const QuestCard = ({ id, title, created, deadline, count, image, onClick }: QuestCardProps) => {
  return (
    <Link to={`/task/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card 
        elevation={0}
        sx={{
          bgcolor: '#fff',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          width: '250px',
          boxShadow: '0 2px 0 #cfc7d8',
          transition: 'transform 0.1s ease',
          '&:hover': {
             transform: 'translateY(-1px)'
          }
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: '#e9e3f2',
            color: '#4f378a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px',
            flexShrink: 0
          }}
        >
          {count}
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            component="h4" 
            sx={{ 
              margin: '0 0 6px 0', 
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: 1.2 
            }}
          >
            {title}
          </Typography>
          
          <Box 
            sx={{ 
              fontSize: '12px', 
              color: '#000',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              lineHeight: 1.3
            }}
          >
            <Box>Created: {created}</Box>
            <Box>Deadline: {deadline}</Box>
          </Box>
        </Box>
        {image && (
          <IconButton 
            onClick={(e) => {
              e.preventDefault();
              onClick?.(id);
            }}
            sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <CardMedia component="img" image={image} sx={{ width: 24, height: 24 }}/>
          </IconButton>
        )}
      </Card>
    </Link>
  );
};