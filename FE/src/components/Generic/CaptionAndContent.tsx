/**
 * @file CaptionAndContent.tsx
 * @brief Generic component for displaying a label and its corresponding value.
 */
import { Box, Typography } from "@mui/material";
import { fontFamilyStyle, fontSizeStyle } from "../../lib/style";

/**
 * @interface CaptionAndContentProps
 * @brief Props for the CaptionAndContent component.
 */
export interface CaptionAndContentProps {
    caption?: string; ///< Optional label/caption.
    content?: string; ///< Optional content/value.
}

/**
 * @brief Displays a caption and content side-by-side.
 * @return The rendered CaptionAndContent component.
 */
export default function CaptionAndContent({ caption, content }: CaptionAndContentProps) {
    return (
        <Box sx={{ display: 'flex', mb: 1.5, gap: 1 }}>
            <Typography variant="caption" sx={[fontFamilyStyle, { fontSize: "28px", fontWeight: 500, lineHeight: 1.5 }]}>
                {caption}
            </Typography>
            <Typography variant="caption" sx={[fontFamilyStyle, fontSizeStyle, { fontWeight: 500, wordBreak: 'break-word' }]}>
                {content}
            </Typography>
        </Box>
    )
}