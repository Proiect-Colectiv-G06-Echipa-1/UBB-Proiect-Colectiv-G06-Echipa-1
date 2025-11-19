import { useEffect, useState } from 'react';
import { TopNav } from '../components/TopNav';
import { StatusDropdown } from '../components/Generic/StatusDropdown';
import { QuestCard } from '../components/QuestCard';
import { Fab } from '../components/Fab';
import journalIcon from '../assets/journal.png';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../api/api';
import { TaskDTOStatusEnum, type TaskDTO } from '../../typescript-client';
import './Home.css';
import '../App.css';
import { formatDate } from '../lib/date';
import { toast } from 'react-toastify';

export const Home = () => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [selected, setSelected] = useState<TaskDTOStatusEnum>(TaskDTOStatusEnum.Backlog);
  const [energyLevel, setEnergyLevel] = useState(6);

  const handleSelect = (status: TaskDTOStatusEnum) => {
    setSelected(status);
  };

  const navigator = useNavigate();
  
  useEffect(() => {
    const load = async () => {
      try {
        const tasks = await taskApi.getAll();

        if (!tasks) {
          toast.error('Failed to load tasks.', { containerId: 'global-toast' });
          return;
        }
        setTasks(tasks);
      } catch (error) {
        toast.error('An error occurred while loading tasks.', { containerId: 'global-toast' });
      }
    };
    load();
  }, []);

  const inSelected = tasks.filter(i => i.status === selected);

  return (
    <div className="home">
      <TopNav
        energyLevel={energyLevel}
        onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
        onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
      />
      <div className="board">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className='section-title'>
            <img src={journalIcon} alt="Journal" className="journal-icon" />
            <Typography variant="h5" className="nanum-pen">Quests</Typography>
          </div>
          <StatusDropdown selected={selected} handleSelect={handleSelect} />
        </div>
        <div className="card-grid">
          {inSelected.map((item) => (            
            <QuestCard
              key={item.id}
              id ={item.id || 0}
              title={item?.title || ''}
              created={formatDate(item?.creationDate || new Date())}
              deadline={formatDate(item?.deadline || new Date())}
              count={item?.energyCost || 0}
            />
          ))}
        </div>
        <Fab onClick={() => { navigator('/manage-task') }} />
      </div>
    </div>
  );
};