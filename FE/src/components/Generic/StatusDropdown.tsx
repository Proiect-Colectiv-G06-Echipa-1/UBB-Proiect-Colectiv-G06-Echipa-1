/**
 * @file StatusDropdown.tsx
 * @brief Dropdown component for selecting task statuses.
 */
import { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { TaskDTOStatusEnum } from '../../../typescript-client';
import { formatStatus } from '../../lib/status';
import { fontFamilyStyle, fontSizeStyle } from '../../lib/style';

/**
 * @interface Props
 * @brief Props for the StatusDropdown component.
 */
interface Props {
  selected: TaskDTOStatusEnum; ///< The currently selected status.
  categories: TaskDTOStatusEnum[]; ///< List of statuses to display in the dropdown.
  backgroundColor?: string; ///< Optional background color for the button.
  hoverBackgroundColor?: string; ///< Optional hover background color for the button.
  keyColor?: string; ///< Optional color for the arrow icon.
  handleSelect: (status: TaskDTOStatusEnum) => void; ///< Callback when a status is selected.
}

/**
 * @brief A button that opens a menu to select a task status.
 * @return The rendered StatusDropdown component.
 */
export const StatusDropdown = ({selected, categories, backgroundColor, hoverBackgroundColor, keyColor, handleSelect} : Props) => {
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
      <Button onClick={handleClick} endIcon={<KeyboardArrowDown sx={{ color: keyColor || '#aa86ff' }} />} sx={[fontFamilyStyle, fontSizeStyle, {backgroundColor: backgroundColor || '#5A3D99',
        color: '#fff', borderRadius: '28px', width: 'auto', fontWeight: 700, textTransform: 'none', padding: '8px 16px', '&:hover': {backgroundColor: hoverBackgroundColor || '#4A2D89'}}]}>
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
            sx={[fontFamilyStyle, fontSizeStyle, {
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '12px 20px',
              fontWeight: 700,
              borderBottom: '1px solid rgba(255,255,255,0.5)',
              '&:last-child': {
                borderBottom: 'none'
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.08)'
              }
            }]}
          >
            {formatStatus(category)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};