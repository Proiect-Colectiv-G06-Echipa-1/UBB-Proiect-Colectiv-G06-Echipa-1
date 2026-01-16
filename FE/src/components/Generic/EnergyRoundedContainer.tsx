/**
 * @file EnergyRoundedContainer.tsx
 * @brief Component that displays energy cost in a rounded container.
 */
import Box from "@mui/material/Box";
import { fontFamilyStyle, fontSizeStyle } from "../../lib/style";

/**
 * @interface EnergyRoundedContainerProps
 * @brief Props for the EnergyRoundedContainer component.
 */
export interface EnergyRoundedContainerProps {
    energyCost: number; ///< The energy cost to display.
}

/**
 * @brief Renders a circular badge containing the energy cost.
 * @return The rendered EnergyRoundedContainer component.
 */
export default function EnergyRoundedContainer({ energyCost }: EnergyRoundedContainerProps) {
    return (
        <Box sx={[fontFamilyStyle, fontSizeStyle, {fontSize: "32px", width: 36, height: 36, borderRadius: '50%', bgcolor: '#E9E3F2', color: '#4F378A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0}]}>
            {energyCost}
        </Box>
    );
}