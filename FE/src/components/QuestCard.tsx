import { Link } from 'react-router-dom';
import { Box, Typography, Card, IconButton, CardMedia } from '@mui/material';
import EnergyRoundedContainer from './Generic/EnergyRoundedContainer';
import { fontFamilyStyle, fontSizeStyle } from '../lib/style';

interface QuestCardProps {
  id: number;
  title: string;
  created: string;
  deadline: string;
  width: string,
  count: number;
  image?: string;
  onClick?: (id: number) => void;
}

export const QuestCard = ({ id, title, created, deadline, width, count, image, onClick }: QuestCardProps) => {
  const truncatedTitle = title.length > 20 ? title.substring(0, 20) + '…' : title;
  
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
          width: width,
          minWidth: width,
          maxWidth: width,
          boxShadow: '0 2px 0 #cfc7d8',
          transition: 'transform 0.1s ease',
          '&:hover': {
             transform: 'translateY(-1px)'
          }
        }}
      >
        <EnergyRoundedContainer energyCost={count} /> 
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="h6" 
            component="h4" 
            sx={[fontFamilyStyle, fontSizeStyle, 
            { 
              fontWeight: 700,
              lineHeight: 1.1,
              mb: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }]}
          >
            {truncatedTitle}
          </Typography>
          
          <Box 
            sx={[fontFamilyStyle, fontSizeStyle, 
            {
              color: '#000',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              lineHeight: 1.1,
            }]}
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