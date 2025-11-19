import { Box, Typography } from "@mui/material";

export interface CaptionAndContentProps {
    caption?: string;
    content?: string;
}

export default function CaptionAndContent({ caption, content }: CaptionAndContentProps) {
    return (
        <Box sx={{ display: 'flex', mb: 1.5, gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, lineHeight: 1 }}>
                {caption}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 500, wordBreak: 'break-word', lineHeight: 1.2 }}>
                {content}
            </Typography>
        </Box>
    )
}