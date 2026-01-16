// Boss image mapping - maps boss name to their image
// Add new boss images to assets folder and import them here

import pikachuImage from '../assets/pikachu.png?url';
import bossBackground from '../assets/boss-fight-background.png?url';

export const BOSS_IMAGES: Record<string, { image: string; background: string }> = {
  'John Pikachu': {
    image: pikachuImage,
    background: bossBackground,
  },
  'Pikachu': {
    image: pikachuImage,
    background: bossBackground,
  },
  // Add more bosses here as needed:
  // 'Boss Name': {
  //   image: bossImage,
  //   background: bossBackground,
  // },
};

// Default boss image if boss name not found
export const DEFAULT_BOSS_IMAGE = '';
export const DEFAULT_BOSS_BACKGROUND = '';

export const getBossImage = (bossName: string | undefined): string => {
  if (!bossName) return DEFAULT_BOSS_IMAGE;
  return BOSS_IMAGES[bossName]?.image || DEFAULT_BOSS_IMAGE;
};

export const getBossBackground = (bossName: string | undefined): string => {
  if (!bossName) return DEFAULT_BOSS_BACKGROUND;
  return BOSS_IMAGES[bossName]?.background || DEFAULT_BOSS_BACKGROUND;
};

