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
  const [isDamaged, setIsDamaged] = useState(false);
  const [isDead, setIsDead] = useState(false);

  useEffect(() => {
    const fetchBoss = async () => {
      try {
        setLoading(true);
        // First update the boss health based on current tasks
        await bossApi.updateBoss();
        // Then fetch the updated boss
        const bossData = await bossApi.getBoss();
        setBoss(bossData);
        
        // Trigger damage animation on load
        setIsDamaged(true);
        setTimeout(() => setIsDamaged(false), 500);
        
        // Check if boss is dead
        if (bossData.currentHealth === 0) {
          setTimeout(() => setIsDead(true), 500);
        }
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
      {bossImage && !isDead && (
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
            animation: isDamaged ? 'pokemonDamage 0.6s' : 'none',
            '@keyframes pokemonDamage': {
              '0%, 100%': { 
                transform: 'translateX(0)',
                filter: 'brightness(1)',
              },
              '10%': { 
                transform: 'translateX(-15px)',
                filter: 'brightness(2) saturate(0)',
              },
              '20%': { 
                transform: 'translateX(15px)',
                filter: 'brightness(1)',
              },
              '30%': { 
                transform: 'translateX(-15px)',
                filter: 'brightness(2) saturate(0)',
              },
              '40%': { 
                transform: 'translateX(15px)',
                filter: 'brightness(1)',
              },
              '50%': { 
                transform: 'translateX(-10px)',
                filter: 'brightness(2) saturate(0)',
              },
              '60%': { 
                transform: 'translateX(10px)',
                filter: 'brightness(1)',
              },
              '70%': { 
                transform: 'translateX(-5px)',
                filter: 'brightness(2) saturate(0)',
              },
              '80%': { 
                transform: 'translateX(5px)',
                filter: 'brightness(1)',
              },
            },
          }}
        />
      )}

      {isDead && (
        <Box
          sx={{
            position: 'absolute',
            right: '15%',
            bottom: '38%',
            width: 'auto',
            height: '50vh',
            maxHeight: '500px',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            animation: 'pokemonFaint 2s forwards',
            '@keyframes pokemonFaint': {
              '0%': { 
                opacity: 1, 
                transform: 'translateY(0) scale(1)',
                filter: 'brightness(1)',
              },
              '20%': { 
                opacity: 0.8,
                transform: 'translateY(-20px) scale(1.05)',
                filter: 'brightness(1.5)',
              },
              '40%': { 
                opacity: 0.6,
                transform: 'translateY(0) scale(1)',
                filter: 'brightness(1)',
              },
              '60%': { 
                opacity: 0.4,
                transform: 'translateY(20px) scale(0.95) rotateZ(-10deg)',
                filter: 'brightness(0.8)',
              },
              '80%': { 
                opacity: 0.2,
                transform: 'translateY(100px) scale(0.5) rotateZ(-20deg)',
                filter: 'brightness(0.5)',
              },
              '100%': { 
                opacity: 0,
                transform: 'translateY(150px) scale(0.3) rotateZ(-30deg)',
                filter: 'brightness(0)',
              },
            },
          }}
        >
          <Box
            component="img"
            src={bossImage}
            alt={bossName}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
            }}
          />
        </Box>
      )}

      {isDead && (
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
            animation: 'victoryAppear 0.5s ease-out forwards',
            '@keyframes victoryAppear': {
              '0%': { 
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0.5)',
              },
              '100%': { 
                opacity: 1,
                transform: 'translate(-50%, -50%) scale(1)',
              },
            },
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              animation: 'victoryShine 1.5s ease-in-out infinite',
              '@keyframes victoryShine': {
                '0%, 100%': { 
                  filter: 'brightness(1) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
                },
                '50%': { 
                  filter: 'brightness(1.3) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
                },
              },
            }}
          >
            <Typography
              sx={{
                ...fontFamilyStyle,
                fontSize: '80px',
                fontWeight: 700,
                color: '#FFD700',
                textShadow: '6px 6px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000',
                letterSpacing: '4px',
                mb: 2,
              }}
            >
              VICTORY!
            </Typography>
            <Typography
              sx={{
                ...fontFamilyStyle,
                fontSize: '24px',
                fontWeight: 500,
                color: '#FFF',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                animation: 'blink 1s step-end infinite',
                '@keyframes blink': {
                  '0%, 50%': { opacity: 1 },
                  '51%, 100%': { opacity: 0 },
                },
              }}
            >
              You defeated {bossName}!
            </Typography>
          </Box>
        </Box>
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

