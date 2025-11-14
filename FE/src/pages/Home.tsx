import { useEffect, useState } from 'react';
import { TopNav } from '../components/TopNav';
import { StatusDropdown } from '../components/StatusDropdown';
import { QuestCard } from '../components/QuestCard';
import { Fab } from '../components/Fab';
import type { Category, EnergyItem } from '../types';
import { getAll, getCategories } from '../repository/energyRepository';
import journalIcon from '../assets/journal.png';
import './Home.css';
import '../App.css';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const [items, setItems] = useState<EnergyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState('In Progress');
  const [energyLevel, setEnergyLevel] = useState(6);

  const navigator = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [i, c] = await Promise.all([getAll(), getCategories()]);
      setItems(i);
      setCategories(c);
    };
    load();
  }, []);

  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const inSelected = items.filter(i => i.category === selected);

  return (
    <div className="home">
      <TopNav
        energyLevel={energyLevel}
        onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
        onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
      />
      <div className="board">
        <div className='section-title'>
          <img src={journalIcon} alt="Journal" className="journal-icon" />
          <Typography variant="h5" className="nanum-pen">Quests</Typography>
        </div>

        <div className="card-grid">
          {inSelected.map((item) => (
            <QuestCard
              key={item.id}
              title={item.name}
              created={formatDate(item.createdAt)}
              deadline={formatDate(item.deadline)}
              count={item.energyLevel}
            />
          ))}
        </div>
        <StatusDropdown
          categories={categories}
          selected={selected}
          onChange={setSelected}
        />
        <Fab onClick={() => { navigator('/add') }} />
      </div>
    </div>
  );
};