import { useState } from 'react';
import type { Category } from '../types';
import './StatusDropdown.css';

interface Props {
  categories: Category[];
  selected: string;
  onChange: (value: string) => void;
}

export const StatusDropdown = ({ categories, selected, onChange }: Props) => {
  const [open, setOpen] = useState(true); // open like the screenshot
  return (
    <div className="status-dropdown">
      <button className="pill" onClick={() => setOpen(!open)}>
        <span className="dot" />
        <span>{selected}</span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="menu">
          {categories.filter(c => c.name !== selected).map(c => (
            <button key={c.id} className="menu-item" onClick={() => { onChange(c.name); setOpen(false); }}>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};