/**
 * @file PermanentDrawer.tsx
 * @brief Permanent drawer component with search functionality for user management.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Divider, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fontFamilyStyle, fontSizeStyle } from '../../lib/style';

/**
 * @interface DrawerItem
 * @brief Represents an item in the drawer.
 */
export interface DrawerItem {
    id: number; ///< Unique ID for the item.
    text: string; ///< Display text.
    icon: React.ReactNode; ///< Icon to display.
}

/**
 * @interface PermanentDrawerLeftProps
 * @brief Props for the PermanentDrawerLeft component.
 */
export interface PermanentDrawerLeftProps {
    width?: number; ///< Width of the drawer.
    items: DrawerItem[]; ///< List of items to display.
    onItemClick?: (item: DrawerItem) => void; ///< Click handler for items.
    selectedItemId?: number | null; ///< Currently selected item ID.
    children?: React.ReactNode; ///< Content to display next to the drawer.
}

const drawerWidth = 240;

/**
 * @brief A permanent side drawer that includes a search bar and a list of items.
 * @return The rendered PermanentDrawerLeft component.
 */
export default function PermanentDrawerLeft(props: PermanentDrawerLeftProps) {
    const { width = drawerWidth, items, onItemClick, selectedItemId, children } = props;
    const [searchTerm, setSearchTerm] = useState("");
    const searchedItems = items.filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 64px)' }}>
            <CssBaseline />
            <Drawer sx={{ width: width, flexShrink: 0, '& .MuiDrawer-paper':
                {width: width, boxSizing: 'border-box', marginTop: '64px',
                 height: 'calc(100vh - 64px)', backgroundColor: '#7C8DFF'}}} variant="permanent" anchor="left">
                <Box sx={{ px: 2, py: 4 }}>
                    <Box
                        sx={{display: 'flex', alignItems: 'center', position: 'relative', borderRadius: '25px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '8px 12px',
                            '&:hover': {backgroundColor: 'rgba(255, 255, 255, 1)'
                        }}} 
                    >
                        <SearchIcon sx={{ color: '#666', marginRight: '8px' }} />
                        <InputBase
                            placeholder="Search users…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            sx={[fontFamilyStyle, {width: '100%','& .MuiInputBase-input': {padding: 0, fontSize: '18px', '&::placeholder': { color: '#999', opacity: 1}}}]}
                        />
                    </Box>
                </Box>
                <Divider sx={{ height: '2px', backgroundColor: 'white'}} />
                <List>
                {searchedItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                    <ListItemButton onClick={() => onItemClick?.(item)} 
                        sx={{backgroundColor: item.id === selectedItemId ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            '&:hover': {backgroundColor: item.id === selectedItemId ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}
                        }}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            slotProps={{
                                primary: {
                                    sx: [fontFamilyStyle, fontSizeStyle]
                                }
                            }}
                        />
                    </ListItemButton>
                    </ListItem>
                ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, height: '100%' }}>
                {children}
            </Box>
        </Box>
    );
}