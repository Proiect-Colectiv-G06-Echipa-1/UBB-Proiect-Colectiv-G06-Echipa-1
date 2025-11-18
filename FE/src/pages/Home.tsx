import { useEffect, useState } from 'react';
import { TopNav } from '../components/TopNav';
import { StatusDropdown } from '../components/StatusDropdown';
import { QuestCard } from '../components/QuestCard';
import { Fab } from '../components/Fab';
import journalIcon from '../assets/journal.png';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../api/api';
import { TaskDTOStatusEnum, type TaskDTO } from '../../typescript-client';
import './Home.css';
import '../App.css';

export const Home = () => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  // TO DO: Change this to backlog
  const [selected, setSelected] = useState<TaskDTOStatusEnum>(TaskDTOStatusEnum.Pending);
  const [energyLevel, setEnergyLevel] = useState(6);

  const navigator = useNavigate();
  
  useEffect(() => {
    const load = async () => {
      const tasks = await taskApi.getAll();
      setTasks(tasks);
    };
    load();
  }, []);

  // TO DO: Find why date is undefined and delete this function afterwards
  const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const inSelected = tasks.filter(i => i.status === selected);

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
            // TODO: Remove after undefined is fixed
            <QuestCard
              key={item.id}
              title={item?.title || ''}
              created={formatDate(item?.creationDate || new Date())}
              deadline={formatDate(item?.lastUpdateDate || new Date())}
              count={item?.energyCost || 0}
            />
          ))}
        </div>
        <StatusDropdown selected={selected} setSelected={setSelected} />
        <Fab onClick={() => { navigator('/add') }} />
      </div>
    </div>
  );
};