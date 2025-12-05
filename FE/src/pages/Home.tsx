import { useEffect, useState } from 'react';
import { TopNav } from '../components/TopNav';
import { StatusDropdown } from '../components/Generic/StatusDropdown';
import { QuestCard } from '../components/QuestCard';
import { Fab } from '../components/Fab';
import journalIcon from '../assets/journal.png';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../api/api';
import { TaskDTOStatusEnum, type TaskDTO } from '../../typescript-client';
import { formatDate } from '../lib/date';
import { toast } from 'react-toastify';
import { allCategories } from '../lib/status';
import { fontFamilyStyle } from '../lib/style';

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        bgcolor: '#fff',
        m: 0,
        p: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <TopNav
        energyLevel={energyLevel}
        onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
        onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
      />
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#A8B1FF',
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '8px 0 16px',
            }}
          >
            <Box
              component="img"
              src={journalIcon}
              alt="Journal"
              sx={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <Typography
              variant="h5"
              sx={[fontFamilyStyle, {
                fontWeight: 400,
                fontSize: '36px',
                color: '#111',
                lineHeight: 1,
              }]}
            >
              Quests
            </Typography>
          </Box>
          <StatusDropdown categories={allCategories} selected={selected} handleSelect={handleSelect} />
        </Box>

        {/* Card Grid */}
        {/* TODO: Fix the alignment of cards to be the same as in figma (the last column has a lot of space remaining on the right and is ugly, I modified this cause it CREATED A GOD DAMN V SHAPE TABLE) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginTop: '16px',
            width: '100%',
            justifyItems: 'start',
          }}
        >
          {inSelected.map((item) => (
            <QuestCard
              key={item.id}
              id={item.id || 0}
              title={item?.title || ''}
              created={formatDate(item?.creationDate || new Date())}
              deadline={formatDate(item?.deadline || new Date())}
              width='250px'
              count={item?.energyCost || 0}
            />
          ))}
        </Box>

        <Fab onClick={() => { navigator('/manage-task') }} />
      </Box>
    </Box>
  );
};