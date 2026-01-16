import { Box, Slider, InputLabel, FormControl } from "@mui/material";
import { fontFamilyStyle, fontSizeStyle } from "../../lib/style";

export default function EnergyFormInput({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) {
    return (
        <FormControl fullWidth variant="filled">
            <Box
                sx={{bgcolor: "#ece6f0", border: 1, borderRadius: 4, borderColor: "black", position: "relative", px: 2, pt: 3, pb: 1.5,}}>
                <InputLabel shrink={true} sx={[fontFamilyStyle, {position: "absolute", top: 6, left: 14, color: "black", fontWeight: 500, fontSize: "18px", transform: "none"}]}>
                    {label}
                </InputLabel>
                <Slider value={value} onChange={(_, newValue) => setValue(newValue as number)} min={0} max={10} marks valueLabelDisplay="auto" sx={{
                        color: "#5A3D99",
                        '& .MuiSlider-markLabel, & .MuiSlider-valueLabel': {...fontFamilyStyle, ...fontSizeStyle},
                    }}
                />
            </Box>
        </FormControl>
    )
}