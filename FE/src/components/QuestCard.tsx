/**
 * @file QuestCard.tsx
 * @brief Component that displays a summary of a task in a card format.
 */
import { Link } from 'react-router-dom';
import { Box, Typography, Card, IconButton, CardMedia } from '@mui/material';
import EnergyRoundedContainer from './Generic/EnergyRoundedContainer';
import { fontFamilyStyle, fontSizeStyle } from '../lib/style';

/**
 * @interface QuestCardProps
 * @brief Props for the QuestCard component.
 */
interface QuestCardProps {
  id: number; ///< The task ID.
  title: string; ///< The task title.
  created: string; ///< Formatted creation date.
  deadline: string; ///< Formatted deadline date.
  width: string, ///< Width of the card.
  count: number; ///< Energy cost.
  image?: string; ///< Optional icon image URL.
  onClick?: (id: number) => void; ///< Optional click handler for the icon.
}

/**
 * @brief QuestCard component used in the Home page and Admin Panel.
 * @return The rendered QuestCard.
 */
export const QuestCard = ({ id, title, created, deadline, width, count, image, onClick }: QuestCardProps) => {
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
          boxShadow: '0 2px 0 #cfc7d8',
          transition: 'transform 0.1s ease',
          '&:hover': {
             transform: 'translateY(-1px)'
          }
        }}
      >
        <EnergyRoundedContainer energyCost={count} /> 
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            component="h4" 
            sx={[fontFamilyStyle, fontSizeStyle, 
            { 
              fontWeight: 700,
              lineHeight: 1.1,
              mb: '4px',
            }]}
          >
            {title}
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