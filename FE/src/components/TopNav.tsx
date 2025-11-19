// Using SVG assets instead of inline/icon components
import logoSvg from '../assets/logo.svg';
import minusSvg from '../assets/Minus circle.svg';
import plusSvg from '../assets/Plus circle.svg';
import energySvg from '../assets/green-energy.svg';
import toolsSvg from '../assets/swords.svg';
import userSvg from '../assets/User.svg';
import { useAuth } from '../authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import './TopNav.css';
import '../App.css';
import { Typography } from '@mui/material';

interface TopNavProps {
  energyLevel: number; // 0-10 segments
  onDecrease?: () => void;
  onIncrease?: () => void;
}

export const TopNav = ({ energyLevel, onDecrease, onIncrease }: TopNavProps) => {
  const segments = 10;
  const atMin = energyLevel <= 0;
  const atMax = energyLevel >= segments;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="topnav">
      <div className="brand" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        <img src={logoSvg} alt="TUDU Logo" className="brand-logo" />
        <Typography variant="h5" className="nanum-pen">TUDU</Typography>
      </div>
      <div className="actions">
        <button
          className={`circle-btn ${atMin ? 'disabled' : ''}`}
          onClick={onDecrease}
          aria-label="Decrease energy"
          disabled={atMin}
        >
          <img src={minusSvg} alt="-" />
        </button>
        <div className="segments" role="meter" aria-valuemin={0} aria-valuemax={segments} aria-valuenow={energyLevel}>
          {Array.from({ length: segments }).map((_, i) => (
            <span key={i} className={`seg ${i < energyLevel ? 'active' : ''}`} />
          ))}
        </div>
        <button
          className={`circle-btn ${atMax ? 'disabled' : ''}`}
          onClick={onIncrease}
          aria-label="Increase energy"
          disabled={atMax}
        >
          <img src={plusSvg} alt="+" />
        </button>
        <div className="icon-btn bolt" aria-label="Energy">
          <img src={energySvg} alt="energy" />
        </div>
        <div className="icon-btn tools" aria-label="Tools">
          <img src={toolsSvg} alt="tools" />
        </div>
        <div className="icon-btn user" aria-label="User">
          <img src={userSvg} alt="user" />
        </div>
        <button 
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};