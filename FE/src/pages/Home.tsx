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

  const inSelected = items.filter(i => i.category === selected);

  return (
    <div className="home">
      <TopNav
        energyLevel={energyLevel}
        onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
        onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
      />
      <div className="board">
        <h2 className="section-title">
          <img src={journalIcon} alt="Journal" className="journal-icon" />
          <Typography variant="h5" className="nanum-pen">Quests</Typography>
        </h2>
        <div className="card-grid">
          {inSelected.map((item) => (
            <QuestCard
              key={item.id}
              title={item.name}
              created={item.description?.split('\n')[0].replace('Created: ','') || ''}
              deadline={item.description?.split('\n')[1].replace('Deadline: ','') || ''}
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