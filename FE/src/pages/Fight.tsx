import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { bossApi } from '../api/api';
import { toast } from 'react-toastify';
import { fontFamilyStyle } from '../lib/style';
import type { BossDTO } from '../../typescript-client';
import { getBossImage, getBossBackground } from '../lib/bossImages';

export default function Fight() {
  const [boss, setBoss] = useState<BossDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoss = async () => {
      try {
        setLoading(true);
        // First update the boss health based on current tasks
        await bossApi.updateBoss();
        // Then fetch the updated boss
        const bossData = await bossApi.getBoss();
        setBoss(bossData);
      } catch (error) {
        console.error('Failed to fetch boss:', error);
        toast.error('Failed to load boss data', { containerId: 'global-toast' });
      } finally {
        setLoading(false);
      }
    };

    fetchBoss();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!boss) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Typography>No boss data available</Typography>
      </Box>
    );
  }

  const maxHealth = boss.maxHealth ?? 0;
  const currentHealth = boss.currentHealth ?? 0;
  // Remove "John" from boss name if present
  const bossName = (boss.name ?? 'Boss').replace(/^John\s+/i, '');
  const hpPercentage = maxHealth > 0 ? (currentHealth / maxHealth) * 100 : 0;
  
  // Get boss-specific images
  const bossImage = getBossImage(bossName);
  const bossBackgroundImage = getBossBackground(bossName);
  
  // Debug: log images to console
  console.log('Boss name:', bossName);
  console.log('Boss image:', bossImage);
  console.log('Boss background:', bossBackgroundImage);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        backgroundImage: bossBackgroundImage ? `url(${bossBackgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: bossBackgroundImage ? 'transparent' : '#90EE90',
      }}
    >
      {/* HP Bar Container - Top Left (Figma style - exact match) */}
      <Box
        sx={{
          position: 'absolute',
          top: 80,
          left: 20,
          backgroundColor: '#FFFACD', // Pale yellow/cream like in Figma
          padding: '12px 16px',
          borderRadius: '8px',
          border: 'none',
          minWidth: '180px',
          minHeight: '60px',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.2)', // Dark gray shadow to the right and bottom
          zIndex: 10,
        }}
      >
        {/* Boss Name - Top Left */}
        <Typography
          sx={{
            ...fontFamilyStyle,
            fontSize: '30px',
            fontWeight: 500,
            color: '#000',
            position: 'absolute',
            top: '12px',
            left: '16px',
          }}
        >
          {bossName}
        </Typography>
        {/* HP - Bottom Right */}
        <Typography
          sx={{
            ...fontFamilyStyle,
            fontSize: '18px',
            color: '#000',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            position: 'absolute',
            bottom: '12px',
            right: '16px',
          }}
        >
          HP: {currentHealth}/{maxHealth}
        </Typography>
      </Box>

      {/* Boss Image - Positioned on the right, on the grass platform (exact Figma position) */}
      {bossImage && (
        <Box
          component="img"
          src={bossImage}
          alt={bossName}
          onError={(e) => {
            console.error('Failed to load boss image:', bossImage);
            console.error('Error:', e);
          }}
          onLoad={() => {
            console.log('Boss image loaded successfully:', bossImage);
          }}
          sx={{
            position: 'absolute',
            right: '15%',
            bottom: '38%',
            width: 'auto',
            height: '50vh',
            maxHeight: '500px',
            maxWidth: '400px',
            objectFit: 'contain',
            imageRendering: 'pixelated',
            zIndex: 5,
          }}
        />
      )}

      {/* HP Bar Visual - Bottom center */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '3%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '350px',
          maxWidth: '90%',
          height: '24px',
          backgroundColor: '#333',
          borderRadius: '12px',
          border: '2px solid #000',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            width: `${hpPercentage}%`,
            height: '100%',
            backgroundColor: hpPercentage > 50 ? '#4CAF50' : hpPercentage > 25 ? '#FF9800' : '#F44336',
            transition: 'width 0.3s ease, background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {hpPercentage > 15 && (
            <Typography
              sx={{
                ...fontFamilyStyle,
                fontSize: '14px',
                color: '#fff',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {Math.round(hpPercentage)}%
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

