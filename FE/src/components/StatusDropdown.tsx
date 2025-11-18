import { useState } from 'react';
import { KeyboardArrowDown } from '@mui/icons-material';
import './StatusDropdown.css';
import { TaskDTOStatusEnum } from '../../typescript-client';

interface Category {
  id: number;
  name: TaskDTOStatusEnum;
}

interface Props {
  selected: TaskDTOStatusEnum;
  setSelected: React.Dispatch<React.SetStateAction<TaskDTOStatusEnum>>;
}

// TO DO: Change this to Backlog, ... etc.
const categories: Category[] = [{ id: 1, name: TaskDTOStatusEnum.Pending }, { id: 2, name: TaskDTOStatusEnum.InProgress },
    { id: 3, name: TaskDTOStatusEnum.Cancelled }, { id: 4, name: TaskDTOStatusEnum.Completed }];

export const StatusDropdown = ({selected, setSelected} : Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="status-dropdown">
      <button className="pill" onClick={() => setOpen(!open)}>
        <span>{selected}</span>
        <KeyboardArrowDown className="caret" style={{ color: '#aa86ff' }} />
      </button>
      {open && (
        <div className="menu">
          {categories.filter(category => category.name !== selected).map(c => (
            <button key={c.id} className="menu-item" onClick={() => { setSelected(c.name); setOpen(false); }}>
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};