import { Button } from "@mui/material";

interface Props {
    text: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    keyColor?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

// Don't beat me for the name, Button would be confusing
export const GenericButton = ({text, onClick, backgroundColor, hoverBackgroundColor, startIcon, endIcon} : Props) => {
    return(
        <Button onClick={onClick} startIcon={startIcon} endIcon={endIcon} sx={{backgroundColor: backgroundColor || '#5A3D99',
            color: '#fff', borderRadius: '28px', width: 'auto', fontSize: '16px',fontWeight: 700,textTransform: 'none',padding: '8px 16px','&:hover': {backgroundColor: hoverBackgroundColor || '#4A2D89'}}}>
            {text}
        </Button>
    )
}