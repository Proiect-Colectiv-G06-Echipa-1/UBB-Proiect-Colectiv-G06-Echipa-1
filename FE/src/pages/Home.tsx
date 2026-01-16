import { useEffect, useState } from 'react';
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
import { SearchBar } from '../components/Generic/SearchBar';

export const Home = () => {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [selected, setSelected] = useState<TaskDTOStatusEnum>(TaskDTOStatusEnum.Backlog);
  const [search, setSearch] = useState('');

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

  // Filter by status and search term (trimmed, case-insensitive)
  const inSelected = tasks.filter(i =>
    i.status === selected &&
    i.title?.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--navbar-height))',
        width: '100vw',
        bgcolor: '#fff',
        m: 0,
        p: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 'var(--navbar-height)',
        left: 0,
      }}
    >
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
            <StatusDropdown categories={allCategories} selected={selected} handleSelect={handleSelect} />
          </Box>
        </Box>

        {/* Card Grid */}
        {/* TODO: Fix the alignment of cards to be the same as in figma (the last column has a lot of space remaining on the right and is ugly, I modified this cause it CREATED A GOD DAMN V SHAPE TABLE) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            width: '100%',
            justifyItems: 'center',
          }}
        >
          {inSelected.map((item) => (
            // TODO(DC): Replace this with TaskCard. Tweak TaskCard to be used here as well
            <QuestCard
              key={item.id}
              id={item.id || 0}
              width={"100%"}
              title={item?.title || ''}
              created={formatDate(item?.creationDate || new Date())}
              deadline={formatDate(item?.deadline || new Date())}
              count={item?.energyCost || 0}
            />
          ))}
        </Box>

        <Fab 
          onClick={() => { navigator('/manage-task') }} 
          sx={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            zIndex: 1000,
          }}
        />
      </Box>
    </Box>
  );
};