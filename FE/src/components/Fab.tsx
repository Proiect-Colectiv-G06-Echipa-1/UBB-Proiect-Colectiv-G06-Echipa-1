import './Fab.css';
import createIcon from '../assets/create.svg';

interface Props { onClick: () => void }

export const Fab = ({ onClick }: Props) => (
  <button className="fab" onClick={onClick} aria-label="Create">
    <img src={createIcon} alt="Create" className="fab-icon" />
  </button>
);