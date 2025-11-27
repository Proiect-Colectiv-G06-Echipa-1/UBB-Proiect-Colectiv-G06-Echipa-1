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
  allowedStatuses?: TaskDTOStatusEnum[];
  disabled?: boolean;
}

const categories = [TaskDTOStatusEnum.Backlog, TaskDTOStatusEnum.InProgress, TaskDTOStatusEnum.OnHold, TaskDTOStatusEnum.Completed];

export const StatusDropdown = ({selected, backgroundColor, hoverBackgroundColor, keyColor, handleSelect, allowedStatuses, disabled = false} : Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const categoriesToShow = allowedStatuses || categories;

  return (
    <Box>
      <Button 
        onClick={handleClick} 
        disabled={disabled}
        endIcon={<KeyboardArrowDown sx={{ color: disabled ? '#999' : (keyColor || '#aa86ff') }} />} 
        sx={{
          backgroundColor: disabled ? '#e0e0e0' : (backgroundColor || '#5A3D99'),
          color: disabled ? '#999' : '#fff', 
          borderRadius: '28px', 
          width: 'auto', 
          fontSize: '16px',
          fontWeight: 700,
          textTransform: 'none',
          padding: '8px 16px',
          '&:hover': {backgroundColor: disabled ? '#e0e0e0' : (hoverBackgroundColor || '#4A2D89')},
          '&.Mui-disabled': {
            backgroundColor: '#e0e0e0',
            color: '#999'
          }
        }}
      >
        {formatStatus(selected)}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} 
       MenuListProps={{sx: {padding: 0}}}
       PaperProps={{sx: {backgroundColor: '#6F6471', color: '#fff', borderRadius: '12px', width: 'auto', minWidth: 'unset'}}}>
        {categoriesToShow.filter(category => category !== selected).map((category) => (
          <MenuItem key={category} onClick={() => {handleSelect(category); handleClose();}} sx={{fontSize: '16px', fontWeight: 700,padding: '10px 16px',
           borderBottom: '1px solid rgba(255,255,255,0.5)','&:last-child': {borderBottom: 'none'},'&:hover': {backgroundColor: 'rgba(255,255,255,0.08)'}}}>
            {formatStatus(category)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};