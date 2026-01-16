import Box from "@mui/material/Box";
import { fontFamilyStyle, fontSizeStyle } from "../../lib/style";

export interface EnergyRoundedContainerProps {
    energyCost: number;
}

export default function EnergyRoundedContainer({ energyCost }: EnergyRoundedContainerProps) {
    return (
        <Box sx={[fontFamilyStyle, fontSizeStyle, {fontSize: "32px", width: 36, height: 36, borderRadius: '50%', bgcolor: '#E9E3F2', color: '#4F378A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0}]}>
            {energyCost}
        </Box>
    );
}