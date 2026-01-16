import { Box, Typography } from "@mui/material";
import { fontFamilyStyle, fontSizeStyle } from "../../lib/style";

export interface CaptionAndContentProps {
    caption?: string;
    content?: string;
}

export default function CaptionAndContent({ caption, content }: CaptionAndContentProps) {
    return (
        <Box sx={{ display: 'flex', mb: 1.5, gap: 1, flexDirection: 'column' }}>
            {caption && (
                <Typography variant="caption" sx={[fontFamilyStyle, { fontSize: "28px", fontWeight: 500, lineHeight: 1.5 }]}>
                    {caption}
                </Typography>
            )}
            <Typography variant="caption" sx={[fontFamilyStyle, fontSizeStyle, { fontWeight: 500, wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }]}>
                {content}
            </Typography>
        </Box>
    )
}