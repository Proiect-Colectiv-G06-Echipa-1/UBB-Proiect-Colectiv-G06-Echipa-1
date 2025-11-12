import { useEffect, useState } from 'react';
import { TopNav } from '../components/TopNav';
import { StatusDropdown } from '../components/StatusDropdown';
import { QuestCard } from '../components/QuestCard';
import { Fab } from '../components/Fab';
import type { Category, EnergyItem } from '../types';
import { getAll, getCategories } from '../repository/energyRepository';
import './Home.css';

export const Home = () => {
  const [items, setItems] = useState<EnergyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState('In Progress');
  const [energyLevel, setEnergyLevel] = useState(6);

  useEffect(() => {
    const load = async () => {
      const [i, c] = await Promise.all([getAll(), getCategories()]);
      setItems(i);
      setCategories(c);
    };
    load();
  }, []);

  const inSelected = items.filter(i => i.category === selected);
  const first = inSelected[0];

  return (
    <div className="home">
      <TopNav
        energyLevel={energyLevel}
        onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
        onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
      />
      <div className="board">
        <h2 className="section-title"><span className="book">📒</span>Quests</h2>
        {first && (
          <div className="card-row">
            <QuestCard
              title={first.name}
              created={first.description?.split('\n')[0].replace('Created: ','') || ''}
              deadline={first.description?.split('\n')[1].replace('Deadline: ','') || ''}
              count={first.energyLevel}
            />
          </div>
        )}
        <StatusDropdown
          categories={categories}
          selected={selected}
          onChange={setSelected}
        />
        <Fab onClick={() => { /* future: open modal */ }} />
      </div>
    </div>
  );
};