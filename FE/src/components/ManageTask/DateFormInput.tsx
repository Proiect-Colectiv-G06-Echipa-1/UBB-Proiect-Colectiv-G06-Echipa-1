import { FormControl, InputBase, InputLabel, Box } from "@mui/material";
import { fontFamilyStyle, fontSizeStyle } from "../../lib/style";

export default function DateFormInput({ label, value, setValue }: { label: string; value: Date; setValue: (value: Date) => void }) {
    const dateString = value instanceof Date && !isNaN(value.getTime()) ? value.toISOString().split('T')[0] : '';
    
    return (
        <FormControl fullWidth variant="filled">
            <Box sx={{bgcolor: "#ece6f0", border: 1, borderRadius: 4, borderColor: "black", position: "relative"}}>
                <InputLabel shrink={true} sx={[fontFamilyStyle, fontSizeStyle, {color: "black", fontWeight: 500, "&.Mui-focused": {color: "black" }}]}>
                    {label}
                </InputLabel>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InputBase type="date" value={dateString} onChange={(e) => setValue(new Date(e.target.value))} sx={[fontFamilyStyle, fontSizeStyle, {flex: 1, px: 1.7, pt: 2.5}]}/>
                </Box>
            </Box>
        </FormControl>
    )
}