import { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { TaskDTOStatusEnum } from '../../../typescript-client';
import { formatStatus } from '../../lib/status';

interface Props {
  selected: TaskDTOStatusEnum;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  keyColor?: string;
  handleSelect: (status: TaskDTOStatusEnum) => void;
}

const categories = [
  TaskDTOStatusEnum.Backlog, 
  TaskDTOStatusEnum.InProgress, 
  TaskDTOStatusEnum.OnHold, 
  TaskDTOStatusEnum.Completed
];

export const StatusDropdown = ({selected, backgroundColor, hoverBackgroundColor, keyColor, handleSelect} : Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button onClick={handleClick} endIcon={<KeyboardArrowDown sx={{ color: keyColor || '#aa86ff' }} />} sx={{backgroundColor: backgroundColor || '#5A3D99',
       color: '#fff', borderRadius: '28px', width: 'auto', fontSize: '16px',fontWeight: 700,textTransform: 'none',padding: '8px 16px','&:hover': {backgroundColor: hoverBackgroundColor || '#4A2D89'}}}>
        {formatStatus(selected)}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ sx: { padding: 0 } }}
        PaperProps={{
          sx: {
            marginTop: '0px',
            backgroundColor: '#6F6471',
            color: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            minWidth: 'unset',
            width: 'auto'
          }
        }}
      >
        {categories.filter(category => category !== selected).map((category) => (
          <MenuItem 
            key={category} 
            onClick={() => { handleSelect(category); handleClose(); }} 
            sx={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: 700,
              borderBottom: '1px solid rgba(255,255,255,0.5)',
              '&:last-child': {
                borderBottom: 'none'
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)'
              }
            }}
          >
            {formatStatus(category)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};