// Using SVG assets instead of inline/icon components
import logoSvg from '../assets/create.svg';
import minusSvg from '../assets/Minus circle.svg';
import plusSvg from '../assets/Plus circle.svg';
import energySvg from '../assets/green-energy.svg';
import toolsSvg from '../assets/swords.svg';
import userSvg from '../assets/User.svg';
import './TopNav.css';

interface TopNavProps {
  energyLevel: number; // 0-10 segments
  onDecrease?: () => void;
  onIncrease?: () => void;
}

export const TopNav = ({ energyLevel, onDecrease, onIncrease }: TopNavProps) => {
  const segments = 10;
  const atMin = energyLevel <= 0;
  const atMax = energyLevel >= segments;
  return (
    <div className="topnav">
      <div className="brand">
        <img src={logoSvg} alt="TUDU Logo" className="brand-logo" />
        <span className="brand-name">TUDU</span>
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
      </div>
    </div>
  );
};