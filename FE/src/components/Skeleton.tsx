/**
 * @file Skeleton.tsx
 * @brief Skeleton loading components.
 */
import { Skeleton } from '@mui/material';

/**
 * @brief Renders a rectangular skeleton for cards.
 */
export const CardSkeleton = () => <Skeleton variant="rectangular" width={240} height={100} sx={{ borderRadius: 3 }} />;

/**
 * @brief Placeholder for list skeleton.
 */
export const ListSkeleton = () => null;

/**
 * @brief Placeholder for detail skeleton.
 */
export const DetailSkeleton = () => null;