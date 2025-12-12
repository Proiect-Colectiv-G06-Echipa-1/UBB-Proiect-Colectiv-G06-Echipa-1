import {useState, useEffect, useRef} from 'react';
import logoSvg from '../assets/logo.svg';
import minusSvg from '../assets/Minus circle.svg';
import plusSvg from '../assets/Plus circle.svg';
import energySvg from '../assets/green-energy.svg';
import toolsSvg from '../assets/swords.svg';
import userSvg from '../assets/User.svg';
import {useAuth} from '../authentication/AuthContext';
import {useNavigate} from 'react-router-dom';
import {Typography, Box, Menu, MenuItem} from '@mui/material';
import {fontFamilyStyle, fontSizeStyle} from '../lib/style';
import {ROUTES} from '../routing/routes';
import {userApi} from '../api/api.ts';
import {toast} from 'react-toastify';
import '../styles/global.css';

export const TopNav = () => {
    // TODO(DC): Fetch these from BE
    const minEnergy = 0;
    const maxEnergy = 10;

    const UPDATE_REQUEST_DELAY_IN_SECONDS = 1;
    const lastEnergyValueSent = useRef<number | undefined>(undefined);
    const updateRequestTimeoutEventHandle = useRef<number>(-1);
    const [energyLevel, setEnergyLevel] = useState<number | undefined>(undefined);
    const [isLoadingEnergy, setIsLoadingEnergy] = useState(false);

    const {logout, isAdmin} = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Effect for fetching initial energy from BE
    useEffect(() => {
        const clamp = (n: number) => Math.max(minEnergy, Math.min(maxEnergy, Math.round(n)));

        const fetchEnergy = async () => {
            try {
                setIsLoadingEnergy(true);
                const energy = await userApi.getEnergy();
                setEnergyLevel(clamp(energy));
            } catch (err) {
                setEnergyLevel(0);
                console.error('Failed to fetch energy:', err);
                toast.error('Failed to load current energy level', { containerId: 'global-toast' });
            } finally {
                setIsLoadingEnergy(false);
            }
        };

        fetchEnergy();
    }, []);

    // Effect for sending delayed batched update requests for energy
    useEffect(() => {
        if (energyLevel === undefined || energyLevel === lastEnergyValueSent.current) {
            return;
        }
        if (updateRequestTimeoutEventHandle.current > 0) {
            window.clearTimeout(updateRequestTimeoutEventHandle.current);
            updateRequestTimeoutEventHandle.current = -1;
        }
        updateRequestTimeoutEventHandle.current = window.setTimeout(async () => {
            try {
                await userApi.setEnergy({energyUpdateRequest: {energy: energyLevel}});
                lastEnergyValueSent.current = energyLevel;
            } catch (err) {
                console.error('Failed to persist energy: ', err);
                toast.error('Failed to persist energy.', {containerId: 'global-toast'});
            }
            updateRequestTimeoutEventHandle.current = -1;
        }, UPDATE_REQUEST_DELAY_IN_SECONDS * 1000);
    }, [energyLevel]);

    const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDecrease = () => {
        setEnergyLevel(prev => {
            return Math.max(minEnergy, prev! - 1);
        });
    };

    const handleIncrease = () => {
        setEnergyLevel(prev => {
            return Math.min(maxEnergy, prev! + 1);
        });
    };

    const handleLogout = () => {
        handleUserMenuClose();
        logout();
        navigate(ROUTES.login);
    };

    const handleAdminPanel = () => {
        handleUserMenuClose();
        navigate('/admin');
    };

    // Stiluri comune pentru a nu repeta codul în JSX
    const circleBtnStyle = (disabled: boolean) => ({
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        padding: 0,
        minWidth: 0,
    });

    const iconBtnStyle = {
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '6px',
        bgcolor: '#fff',
        minWidth: '28px',
    };

    const imgStyle = {
        width: 27,
        height: 28,
        display: 'block',
    };

    // Use 0 as a fallback for rendering while loading / null
    const renderLevel = energyLevel ?? 0;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                height: 'var(--navbar-height)',
                width: 'auto',
                inset: 0,
                px: 2,
                bgcolor: '#ffffff',
                position: 'fixed',
                zIndex: 1000,
            }}
        >
            {/* BRAND SECTION */}
            <Box
                onClick={() => navigate(ROUTES.root)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                }}
            >
                <Box component="img" src={logoSvg} alt="TUDU Logo" sx={{height: 28, display: 'block'}}/>
                <Typography
                    variant="h5"
                    sx={[fontFamilyStyle,
                        {
                            fontWeight: 400,
                            fontSize: '36px',
                            letterSpacing: '.06em',
                            color: '#111',
                        }]}
                >
                    TUDU
                </Typography>
            </Box>

            {/* ACTIONS SECTION */}
            <Box sx={{display: 'flex', alignItems: 'center', gap: '14px'}}>

                {/* Decrease Button */}
                <Box
                    component="button"
                    onClick={handleDecrease}
                    disabled={energyLevel == minEnergy || isLoadingEnergy}
                    aria-label="Decrease energy"
                    sx={circleBtnStyle(energyLevel == minEnergy || isLoadingEnergy)}
                >
                    <Box component="img" src={minusSvg} alt="-" sx={imgStyle}/>
                </Box>

                {/* maxEnergy Bar */}
                <Box
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={maxEnergy}
                    aria-valuenow={renderLevel}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 2,
                        height: 32,
                        borderRadius: '14px',
                        padding: 0,
                        bgcolor: 'transparent',
                        overflow: 'hidden',
                        minWidth: 220,
                        border: '1px solid #000',
                        gap: 0,
                        position: 'relative',
                    }}
                >
                    {Array.from({length: maxEnergy}).map((_, i) => (
                        <Box
                            component="span"
                            key={i}
                            sx={{
                                flex: 1,
                                height: '100%',
                                bgcolor: i < renderLevel ? '#05f90d' : '#fff',
                                boxSizing: 'border-box',
                                borderRight: i === maxEnergy - 1 ? 'none' : '1px solid #000',
                            }}
                        />
                    ))}

                    {/* Optional loading overlay/indicator */}
                    {isLoadingEnergy && (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: 'none',
                                fontSize: 12,
                                fontWeight: 700,
                                color: '#333',
                                backgroundColor: 'rgba(255,255,255,0.6)',
                            }}
                        >
                            Loading...
                        </Box>
                    )}
                </Box>

                {/* Increase Button */}
                <Box
                    component="button"
                    onClick={handleIncrease}
                    disabled={energyLevel == maxEnergy || isLoadingEnergy}
                    aria-label="Increase energy"
                    sx={circleBtnStyle(energyLevel == maxEnergy || isLoadingEnergy)}
                >
                    <Box component="img" src={plusSvg} alt="+" sx={imgStyle}/>
                </Box>

                {/* Static Icons */}
                <Box sx={iconBtnStyle} aria-label="Energy">
                    <Box component="img" src={energySvg} alt="energy" sx={imgStyle}/>
                </Box>

                <Box sx={iconBtnStyle} aria-label="Tools">
                    <Box component="img" src={toolsSvg} alt="tools" sx={imgStyle}/>
                </Box>

                {/* User Icon with Dropdown */}
                <Box>
                    <Box
                        onClick={handleUserMenuClick}
                        sx={{
                            ...iconBtnStyle,
                            borderRadius: '50%',
                            cursor: 'pointer',
                        }}
                        aria-label="User"
                    >
                        <Box component="img" src={userSvg} alt="user" sx={imgStyle}/>
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleUserMenuClose}
                        MenuListProps={{sx: {padding: 0}}}
                        PaperProps={{
                            sx: {
                                marginTop: '8px',
                                backgroundColor: '#6F6471',
                                color: '#fff',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                minWidth: 'unset',
                                width: 'auto'
                            }
                        }}
                    >
                        {isAdmin && (
                            <MenuItem
                                onClick={handleAdminPanel}
                                sx={[fontFamilyStyle, fontSizeStyle,
                                    {
                                        display: 'block',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '12px 20px',
                                        fontWeight: 700,
                                        borderBottom: '1px solid rgba(255,255,255,0.5)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.08)'
                                        }
                                    }]}
                            >
                                Admin Panel
                            </MenuItem>
                        )}
                        <MenuItem
                            onClick={handleLogout}
                            sx={[fontFamilyStyle, fontSizeStyle, {
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                padding: '12px 20px',
                                fontWeight: 700,
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.08)'
                                }
                            }]}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
        </Box>
    );
};
